
var linkout = '';

function notify(notifyMessage, img) {
    var options = {
        type: "basic",
        title: "Why spend money?",
        message: notifyMessage,
        iconUrl: img,
        buttons: [
            {
                title: "Get my Samples!"
                ,iconUrl: "icon.png"
            }
            /*,{
                title: "I don't like free stuff"
                //,iconUrl: "icon.png"
            }*/
        ],
        requireInteraction: true
        
      };
    
    // buttons reference for notifications: 
    // http://stackoverflow.com/questions/20188792/is-there-any-way-to-insert-action-buttons-in-notification-in-google-chrome#answer-20190702 
    
    //prototype: chrome.notifications.create(notificationID(leave blank), options, callback
    chrome.notifications.create("", options, function(notificationId) { 
        // Callback after notification
    });
}

function tooSoon(a){
    var w = 604800000; // milliseconds in a week
    var x = new Date();
    var t = x.getTime();
    return (Math.floor((a - t)/w)) < 1;
}

function getTimeStamp(){
    var d = new Date();
    return d.getTime();
}


// CHROME EXTENSION EVENT LISTENERS #######################################

chrome.tabs.onUpdated.addListener(function(tabId , info , tab) {
    if (info.status == "complete") {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {action: "search"}, function(response) {});  
        });
    }
});


chrome.runtime.onMessage.addListener(function(response, sender, sendResponse){
    if(response != null){
        
        linkout = response.url;
        if (window.Notification){ // Test for notification support, then execute

            if (typeof(Storage) !== "undefined"){
                // Check to see if this reward has already been shown
                var timestamp = localStorage.getItem(response.rewardValue);
                if(timestamp != null && timestamp != undefined){
                    // If so, was it within the past week?
                    if(tooSoon(timestamp)){
                        // If yes, don't show
                        console.log('Reward ' + response.rewardValue + ' was not shown due to frequency of result.');
                    }
                    else{
                        // If no, show the reward
                        notify(response.message, response.img);
                        
                        // Update the timestamp for last shown
                        var timestamp = getTimeStamp();
                        localStorage.setItem(response.rewardValue, timestamp);
                    }
                } 
                else{
                    notify(response.message, response.img);
                    
                    // Save the timestamp of when this reward was shown
                    var timestamp = getTimeStamp();
                    localStorage.setItem(response.rewardValue, timestamp);
                }
                
            }
            else{
                // If local storage is not supported show the reward anyway
                console.log('Local storage is not supported in this browser.');
                notify(response.message, response.img);
            }

        } 
    }
});

// When clicking notification
chrome.notifications.onClicked.addListener(function(notificationId, byUser) {
    chrome.tabs.create({url: linkout});
    chrome.notifications.clear(notificationId, function(){}); // Remove notification
}); 

// When clicking notification button
chrome.notifications.onButtonClicked.addListener(function(notificationId, btnIdx) {
    if (btnIdx === 0) chrome.tabs.create({url: linkout});
    //if (btnIdx === 1){ chrome.notifications.clear(notificationId, function(){}); }
    chrome.notifications.clear(notificationId, function(){}); // Remove notification
}); 

// When clicking the extension icon next to the URL bar
chrome.browserAction.onClicked.addListener(function(activeTab){
    // Would need to send a command to the popup.js
}); 

