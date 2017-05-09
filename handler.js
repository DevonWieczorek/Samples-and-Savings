
function setStorageObject(key, obj){
    if (typeof(Storage) !== "undefined"){
       localStorage.setItem(key, obj);
    }
    else{
        console.log('Local storage is not supported in this browser.');
    }
}

function getStorageObject(key){
    if (typeof(Storage) !== "undefined"){
       localStorage.getItem(key);
    }
    else{
        console.log('Local storage is not supported in this browser.');
    }
}

var rewards;
function getRewardList(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", chrome.runtime.getURL('rewards.json'), true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if(!xhr.responseText){
                console.log('There was an error retrieving the data.');
                return false;
            }
            rewards = jQuery.parseJSON(xhr.responseText);
            matchReward(window.location.href);
        }
    }
    xhr.send();
    
    return rewards;
}


function cleanQuery(q){
    q = unescape(q).toLowerCase(); // Clean special characters (including spaces %20)
    q = q.replace(/\./gi, ''); // Remove periods
    q = q.replace(/\"/gi, ''); // Remove quotations
    q = q.replace(/\'/gi, ''); // Remove apostrophes
    q = q.replace(/\+/gi, ' '); // Replace + with a space
    return q;
}

function matchReward(q){
    // key is the search term (q)
    // rewards is the JSON object
    var arr = [];
    q = cleanQuery(q);
    
    // already finds exact match
    for (var key in rewards) {
        var k = cleanQuery(`${key}`);
        if(q.includes(k)) arr.push(k);
        //if(cleanQuery(q).indexOf(k) > -1) arr.push(k);
    }
    
    if(arr.length > 1){
        q = refinedSearch(q,arr);
        getReward(rewards[q]);
    }
    else if(arr.length == 1){
        getReward(rewards[arr]);
    }
}

function compareLength(a,b){
    return a.length > b.length;
}

function refinedSearch(q, arr){
    var r = [];
    
    for(var i = 0; i < arr.length; i++){
        var regex = '/' + arr[i] + '/gi';
        var tempQ = q.match(regex);
        if(tempQ != null) r.push(tempQ);
    }
    
    if(r.length == 0 || r.length == 1){
        return arr[0];
    }
    else{
        var m = r[0];
        for(var i = 0; i < r.length; i++){
            if(compareLength(r[i], m)) m = r[i];
        }
        return m;
    }
    
}

function refinedSearch(q, arr){
    var r = [];
    
    for(var i = 0; i < arr.length; i++){
        if(q.includes(arr[i])){
            r.push(arr[i]);
        } 
    }
    
    if(r.length == 0){
        return arr[0];
    }
    else if(r.length == 1){
        return r[0];
    }
    else{
        var m = relevancy.sort(r,q);
        return m;
    }
    
}

function cleanRewardText(r){
    if(r.toLowerCase().indexOf('samples') == -1 && r.toLowerCase().indexOf('coupons') == -1){
        r += ' Samples';
    }
    return r;
}

var img = '';
var url = '';
var message = '';
var rewardText = '';
var rewardValue = '';
var response = [];

function getReward(reward) {
    reward = reward.toLowerCase();
    if (reward == "" || reward == undefined) reward = "sasgeneric";

    jQuery.getJSON('https://www.flowpreview.com/Services/GetRewardValue.ashx?c=7&Value=' + reward, function (rewardObj) { 
        if (!rewardObj) return false;

            var finalImg = "";
            var maintext = rewardObj[0].maintext
                , mainimg = rewardObj[0].mainimg
                , mainimg2 = rewardObj[0].mainimg2;

            (mainimg2 == undefined || mainimg2 == "") ? finalImg = mainimg : finalImg = mainimg2;

            var rewardInfo = [maintext,finalImg];
        
            rewardText = rewardInfo[0];
            if(rewardInfo[1].indexOf('.com') > -1){
                img = rewardInfo[1];
            }
            else{
                img = 'http://www.cdn925.com' + rewardInfo[1].split('..')[1];
            }
            message = 'Looking for FREE ' + cleanRewardText(rewardText) + '?\nClick here to claim!';
            url = 'http://signup.samplesandsavings.com/default.aspx?Flow=C9A3F9FE-57A9-D490-BE51-26C2DFC9DC07E007EFC7&reward=' + reward;

            chrome.extension.sendMessage({
                message: message, 
                img: img, 
                url: url, 
                rewardText: rewardText,
                rewardValue: reward
            }, function(){});

            response = [img, message, url, rewardText, rewardValue];
            return response;
    });
}

chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
    var exceptions = ['samplesandsavings', 'flowpreview', 'cdn925','freesamplefinderusa', 'promoandsweeps'];
    if (msg.action == 'search') {
        for(var i = 0; i < exceptions.length; i++){
            if(window.location.host.indexOf(exceptions[i]) > -1) return false;
        }
        getRewardList();
    }
});
