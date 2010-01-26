// Fetch extension settings
var settings = {};
var port = chrome.extension.connect();

port.onMessage.addListener(function(data) {
    settings = data;
    
    populateMenu();    
});

port.postMessage({
    'message': 'GetPageSettings'
});

/**
 * Opens a link in a tab. 
 */
function openTab(tabUrl) {
    var button = event.button;
    if(button > 1)
        return;
    var selected = true;
    if(button == 1 || event.ctrlKey) // Middle Button or Ctrl click
        selected = false;
    chrome.tabs.create({ url: tabUrl, selected: selected });
}

/**
 * Populate the menu with forums.
 */
function populateMenu() {
    var forums = JSON.parse(settings.forumsList);
    var newHTML = '';
    var numSeps = 0;
    
    jQuery(forums).each( function() {
        var splitUp = this.name.match(/^(-*)(.*)/);
        
        var lines = splitUp[1].length;
        var title = splitUp[2];
        
        if (lines > 10) { // Separator
            if (numSeps > 0) {
                newHTML += '<hr/>';
            }
            numSeps ++;
        } else if (lines == 0) {
            newHTML += '<div class="link0">';
            newHTML += '<a onclick="javascript:openTab(\'http://forums.somethingawful.com/forumdisplay.php?forumid=' + this.id + '\')" href="javascript:" class="link link'+ lines +'">' + title + '</a><br/>';
            newHTML += '</div>';
        
        } else {
            newHTML += '<a onclick="javascript:openTab(\'http://forums.somethingawful.com/forumdisplay.php?forumid=' + this.id + '\')" href="javascript:" class="link link'+ lines +'">' + title + '</a><br/>';
        }
    });
    
    jQuery('div#forums-list').html(newHTML);
}