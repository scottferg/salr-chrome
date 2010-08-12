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
 * Changes the sticky status of a forum in the popup menu
 */
function toggleSticky(forumID) {
    var forums = JSON.parse(settings.forumsList);
    for(i in forums) {
        if (forums[i].id != forumID)
            continue;

        if (forums[i].sticky == true) {
            forums[i].sticky = false;
            jQuery('img#sticky-'+forumID).each( function() {
                jQuery(this).attr('src', '../images/sticky_off.gif');
            });
        } else {
            forums[i].sticky = true;
            jQuery('img#sticky-'+forumID).each( function() {
                jQuery(this).attr('src', '../images/sticky_on.gif');
            });
        }
        settings.forumsList = JSON.stringify(forums);
        port.postMessage({ 'message': 'ChangeSetting',
                           'option' : 'forumsList',
                           'value'  : JSON.stringify(forums) });
        return;
    }
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
                // Loop through forum list and add stickied forums
                for(i in forums) {
                    if (forums[i].sticky == true)  {
                        newHTML += populateMenuHelper(forums[i], color, true);
                        if (color == '#ffffff') {
                            color = '#eeeeee';
                        } else {
                            color = '#ffffff';
                        }
                    }
                }
                
                newHTML += '<hr/>';
            }
            numSeps ++;
        } else if (indent == 0) {
            newHTML += '<div class="header-link">';
            newHTML += '<a onclick="javascript:openTab(\'http://forums.somethingawful.com/forumdisplay.php?forumid=' + this.id + '\')" href="javascript:" class="link link'+ indent +'">' + title + '</a><br/>';
            newHTML += '</div>';
        
        } else {
            newHTML += populateMenuHelper(this, color, false);
        }

        if (color == '#ffffff') {
            color = '#eeeeee';
        } else {
            color = '#ffffff';
        }
    });
    
    jQuery('div#forums-list').html(newHTML);
}

function populateMenuHelper(forum, color, stuck) {
    var subHTML = '';

    var splitUp = forum.name.match(/^(-*)(.*)/);
    var indent = splitUp[1].length;
    if (stuck == true)
        indent=2;
    var title = splitUp[2];

    // Add sticky controls to popup window
    if (forum.sticky == true)
        subHTML += '<div style="float:left;cursor:pointer;overflow-x: hidden;"><img src="../images/sticky_on.gif" onClick="javascript:toggleSticky('+forum.id+')" id="sticky-'+forum.id+'" /></div>';
    else
        subHTML += '<div style="float:left;cursor:pointer;overflow-x: hidden;"><img src="../images/sticky_off.gif" onClick="javascript:toggleSticky('+forum.id+')" id="sticky-'+forum.id+'" /></div>';

    // Dynamically set the 10's digit for padding here, since we can have any number
    // of indentations
    subHTML += '<div class="forum-link" style="padding-left: ' + indent + '0px; background: ' + color + ';">';
    subHTML += '<a onclick="javascript:openTab(\'http://forums.somethingawful.com/forumdisplay.php?forumid=' + forum.id + '\')" href="javascript:">' + title + '</a><br/>';
    subHTML += '</div>';
    return subHTML;
}
