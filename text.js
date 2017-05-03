walk(document.body);

function walk(node)  
{
	// I stole this function from here:
	// http://is.gd/mwZp7E
	
	var child, next;

	switch ( node.nodeType )  
	{
		case 1: 
		case 9:  
		case 11: 
			child = node.firstChild;
			while ( child ) 
			{
				next = child.nextSibling; 
				walk(child);
				child = next;
			}
			break;

		case 3: 
            if(window.location.href.indexOf("google") > -1) {
                //set timeout for google
                setTimeout(function(){ handleText(node);}, 1000);
            }
            else{
                //otherwise execute right away
                handleText(node);
            }
			break;
	}
}

function handleText(textNode) 
{
	var v = textNode.nodeValue;

	v = v.replace(/Donald Trump/gi, "Donald Duck");
	v = v.replace(/Donald J Trump/gi, "Donald F Duck");
	v = v.replace(/Donald J. Trump/gi, "Donald F. Duck");
	v = v.replace(/Donald John Trump/gi, "Donald Fauntleroy Duck");
	v = v.replace(/Mr. Trump/gi, "Mr. Duck");
	v = v.replace(/Mister Trump/gi, "Mister Duck");
    v = v.replace(/Drumpf/gi, "Duck");
    v = v.replace(/Trump/gi, "Duck");
    v = v.replace(/Trump2016/gi, "Duck2016");
    v = v.replace(/#Trump2016/gi, "#Duck2016");
    v = v.replace(/Make America Great Again/gi, "Make America Quack Again");
    v = v.replace(/#Make America Great Again/gi, "#Make America Quack Again");
    v = v.replace(/#MakeAmericaGreatAgain/gi, "#MakeAmericaQuackAgain");
    v = v.replace(/realDonaldTrump/gi, "realDonaldDuck");

	textNode.nodeValue = v;
    
}

// ORIGINAL CODE FROM DUCKIFY ABOVE THIS LINE #########################################

function getParamOnName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
//getParamOnName('parameterName');

function cleanQuery(q){
    q = unescape(q); // Clean special characters (including spaces %20)
    q = q.replace(/\./gi, ''); // Remove periods
    q = q.replace(/\'/gi, ''); // Remove apostrophes
    q = q.replace(/\+/gi, ' '); // Replace + with a space
    return q;
}

function matchReward(k){
    for (var k in target){ 
       if (target.hasOwnProperty(k)) {
            console.log("Key is " + k + ", value is" + target[k]);
           //ping the system with target[k]
       }
    }
}



