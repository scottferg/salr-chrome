// Copyright (c) 2009, Scott Ferguson
// All rights reserved.
// 
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the software nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
// 
// THIS SOFTWARE IS PROVIDED BY SCOTT FERGUSON ''AS IS'' AND ANY
// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL SCOTT FERGUSON BE LIABLE FOR ANY
// DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/**
 * External message event listener
 *
 */
chrome.extension.onConnectExternal.addListener(function(port) {
    port.onMessage.addListener(function(data) {
        switch (data.message) {
            case 'GetForumsJumpList':
            case 'GetSALRSettings':
                port.postMessage(getPageSettings());
                break;
            case 'ChangeSALRSetting':
                localStorage.setItem(data.option, data.value);
                break;
        }
    });
});

/**
 * Message event listener so that we can talk to the content-script
 *
 */
chrome.extension.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(data) {
        switch (data.message) {
            case 'OpenSettings':
                onToolbarClick();
                break;
            case 'ChangeSetting':
                localStorage.setItem(data.option, data.value);
                break;
            case 'OpenTab':
                openNewTab(data.url);
                break;
            case 'ShowPageAction':
                // Register the tab with the tagging page action
                chrome.pageActions.enableForTab("forums_jump_list",
                                                { 
                                                    tabId: port.tab.id,
                                                    url: port.tab.url,
                                                    title: "Click to open forum jump list",
                                                    iconId: 0
                                                });

                break;
            case 'GetPageSettings':
            case 'GetSALRSettings':
            case 'GetForumsJumpList':
                port.postMessage(getPageSettings());
                break;
            case 'ChangeSALRSetting':
                localStorage.setItem(data.option, data.value);
            case 'log':
            default:
                console.log(data);
		}
    });
});

/**
 * Event handler for clicking on the toolstrip logo
 *
 * @param element - Toolstrip element
 */
function onToolbarClick() {
	chrome.tabs.create({url:chrome.extension.getURL('settings.html')});
}

/**
 * Opens a new tab with the specified URL
 *
 *
 */
function openNewTab(aUrl) {
    chrome.tabs.create({url: aUrl});
}

/**
 * Sets up default preferences for highlighting only
 *
 */
function setupDefaultPreferences() {
    localStorage.setItem('userQuote', '#a2cd5a');
    localStorage.setItem('darkRead', '#6699cc');
    localStorage.setItem('lightRead', '#99ccff');
    localStorage.setItem('darkNewReplies', '#99cc99');
    localStorage.setItem('lightNewReplies', '#ccffcc');
    localStorage.setItem('youtubeHighlight', '#ff00ff');
    localStorage.setItem('displayConfigureSalr', 'true');
    localStorage.setItem('highlightFriendsColor', "#f2babb");
    localStorage.setItem('highlightSelfColor', "#f2babb");
    localStorage.setItem('highlightAdminColor', "#ff7256");
    localStorage.setItem('highlightModeratorColor', "#b4eeb4");
    localStorage.setItem('inlinePostCounts', 'false');
    localStorage.setItem('highlightOPColor', '#fff2aa');
    localStorage.setItem('displayPageNavigator', 'true');
    localStorage.setItem('userNotesEnabled', 'true');
    localStorage.setItem('displayCustomButtons', 'true');
    localStorage.setItem('salrInitialized', 'true');
}

/**
 * Returns page settings to local and remote message requests
 *
 */
function getPageSettings() {
    // Don't wipe the settings made by previous versions
    if (localStorage.getItem('username')) {
        localStorage.setItem('salrInitialized', 'true');
    }

    // If we don't have stored settings, set defaults
    if (!localStorage.getItem('salrInitialized')) {
        setupDefaultPreferences();
    }

    fixSettings();

    var response = {};

    for ( var index in localStorage ) {
        response[index] = localStorage.getItem(index);
    }

    return response;
} 

/**
 * Update settings from old versions
 *
 */
function fixSettings() {
    if (localStorage.getItem('disableCustomButtons') == 'true') {
        localStorage.setItem('displayCustomButtons', 'false');
        localStorage.removeItem('disableCustomButtons');
    } else if (localStorage.getItem('disableCustomButtons') == 'false') {
        localStorage.setItem('displayCustomButtons', 'true');
        localStorage.removeItem('disableCustomButtons');
    }
    if (localStorage.getItem('ignore_bookmark_star')) {
        localStorage.setItem('ignoreBookmarkStar', localStorage.getItem('ignore_bookmark_star'));
        localStorage.removeItem('ignore_bookmark_star');
    }
    if (localStorage.getItem('highlightCancer')) {
        localStorage.setItem('fixCancer', localStorage.getItem('highlightCancer'));
        localStorage.removeItem('highlightCancer');
    }
}
