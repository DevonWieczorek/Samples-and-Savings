// buttons reference for notifications: 
// http://stackoverflow.com/questions/20188792/is-there-any-way-to-insert-action-buttons-in-notification-in-google-chrome#answer-20190702 

function notify(notifyMessage) {
    var options = {
        type: "basic",
        title: "Psst!",
        message: notifyMessage,
        iconUrl: "icon.png",
        buttons: [{
            title: "Get my Sample!",
            iconUrl: "icon.png"
        }]
        
      };
    chrome.notifications.create("", options, function(notificationId) { 
        // Callback after notification
    });
}


// When clicking notification
chrome.notifications.onClicked.addListener(function(notificationId, byUser) {
    chrome.tabs.create({url: "http://www.samplesandsavings.com"});
    chrome.notifications.clear(notificationId, function(){}); // Remove notification
}); 

// When clicking notification button
chrome.notifications.onButtonClicked.addListener(function(notificationId, btnIdx) {
    if (btnIdx === 0) chrome.tabs.create({url: "http://www.samplesandsavings.com"});
    // if (btnIdx === 1){ do other thing }
    
    chrome.notifications.clear(notificationId, function(){}); // Remove notification
}); 

// Once the active tab is updated, call the function
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && tab.active) {
      // Test for notification support, then execute
      if (window.Notification) notify('Looking for samples?\nClick here for FREE STUFF!');
  }
})

// Test for click on extension icon, doesn't work
chrome.browserAction.onClicked.addListener(function(activeTab){
    alert('browserAction');
}); 