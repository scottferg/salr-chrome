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
    var color = '#ffffff';
    
    jQuery(forums).each( function() {
        var splitUp = this.name.match(/^(-*)(.*)/);
        
        var indent = splitUp[1].length;
        var title = splitUp[2];
        
        if (indent > 10) { // Separator
            if (numSeps > 0) {
                newHTML += '<hr/>';
            }
            numSeps ++;
        } else if (indent == 0) {
            newHTML += '<div class="header-link">';
            newHTML += '<a onclick="javascript:openTab(\'http://forums.somethingawful.com/forumdisplay.php?forumid=' + this.id + '\')" href="javascript:" class="link link'+ indent +'">' + title + '</a><br/>';
            newHTML += '</div>';
        
        } else {
            // Dynamically set the 10's digit for padding here, since we can have any number
            // of indentations
            newHTML += '<div class="forum-link" style="padding-left: ' + indent + '0px; background: ' + color + ';">';
            newHTML += '<a onclick="javascript:openTab(\'http://forums.somethingawful.com/forumdisplay.php?forumid=' + this.id + '\')" href="javascript:">' + title + '</a><br/>';
            newHTML += '</div>';
        }

        if (color == '#ffffff') {
            color = '#eeeeee';
        } else {
            color = '#ffffff';
        }
    });
    
    jQuery('div#forums-list').html(newHTML);
}
