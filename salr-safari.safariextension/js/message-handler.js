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
 * Message event listener so that we can talk to the content-script
 *
 */
function handleScriptQuery(message_event) {
    console.log(message_event);
    var message = message_event.name;
    var data = message_event.message;

    console.log(message);

    switch (message) {
        case 'OpenSettings':
            onToolbarClick();
            break;
        case 'ChangeSetting':
            safari.extension.settings.setItem(data.option, data.value);
            break;
        case 'OpenTab':
            openNewTab(data.url);
            break;
        case 'GetPageSettings':
            // Respond with the username
            message_event.target.page.dispatchMessage('result', getPageSettings());
            break;
        case 'GetForumsJumpList':
            // TODO: Response overkill here
            message_event.target.page.dispatchMessage('result', getPageSettings());
            break;
        case 'GetSALRSettings':
            message_event.target.page.dispatchMessage('result', getPageSettings());
            break;
        case 'ChangeSALRSetting':
            safari.extension.settings.setItem(data.option, data.value);
            break;
        case 'log':
        default:
            console.log(data);
    }
}

/**
 * External message event listener
 *
 */
safari.application.addEventListener('message', handleScriptQuery, false);

/**
 * Event handler for clicking on the toolstrip logo
 *
 * @param element - Toolstrip element
 */
function onToolbarClick() {
    console.log('Any need for this?');
}

/**
 * Opens a new tab with the specified URL
 *
 *
 */
function openNewTab(aUrl) {
    console.log('Open new tab!');
}


/**
 * Sets up default preferences for highlighting only
 *
 */
function setupDefaultPreferences() {
    safari.extension.settings.setItem('userQuote', '#a2cd5a');
    safari.extension.settings.setItem('darkRead', '#6699cc');
    safari.extension.settings.setItem('lightRead', '#99ccff');
    safari.extension.settings.setItem('darkNewReplies', '#99cc99');
    safari.extension.settings.setItem('lightNewReplies', '#ccffcc');
    safari.extension.settings.setItem('youtubeHighlight', '#ff00ff');
    safari.extension.settings.setItem('displayConfigureSalr', 'true');
    safari.extension.settings.setItem('highlightFriendsColor', "#f2babb");
    safari.extension.settings.setItem('highlightSelfColor', "#f2babb");
    safari.extension.settings.setItem('highlightAdminColor', "#ff7256");
    safari.extension.settings.setItem('highlightModeratorColor', "#b4eeb4");
    safari.extension.settings.setItem('inlinePostCounts', 'false');
    safari.extension.settings.setItem('disableCustomButtons', 'false');
    safari.extension.settings.setItem('highlightOPColor', '#fff2aa');
    safari.extension.settings.setItem('displayPageNavigator', 'true');
    safari.extension.settings.setItem('userNotesEnabled', 'true');
}

/**
 * Returns page settings to local and remote message requests
 *
 */
function getPageSettings() {
    // If we don't have stored settings, set defaults
    if (!safari.extension.settings.getItem('username')) {
        setupDefaultPreferences();
    }

    var response = {};

    for ( var index in safari.extension.settings ) {
        response[index] = safari.extension.settings.getItem(index);
    }

    return response;
} 
