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
chrome.extension.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(data) {
        switch (data.message) {
            case 'OpenSettings':
                onToolbarClick();
                break;
            case 'ChangeSetting':
                localStorage.setItem(settingNameFromFriendlyName(data.option), data.value);
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
                // If we don't have stored settings, set defaults
                if (!localStorage.getItem('username')) {
                    setupDefaultPreferences();
                }
                
                // Respond with the username
                port.postMessage({
                    'username': localStorage.getItem('username'),
                    'userQuote': localStorage.getItem('user-quote'),
                    'darkRead' : localStorage.getItem('dark-read'),
                    'lightRead' : localStorage.getItem('light-read'),
                    'darkNewReplies' : localStorage.getItem('dark-new-replies'),
                    'lightNewReplies' : localStorage.getItem('light-new-replies'),
                    'youtubeHighlight' : localStorage.getItem('youtube-highlight'),
                    'hideAdvertisements' : localStorage.getItem('hide-advertisements'),
                    'hideHeaderLinks' : localStorage.getItem('hide-header-links'),
                    'hideFooterLinks' : localStorage.getItem('hide-footer-links'),
                    'displayNewPostsFirst' : localStorage.getItem('display-new-posts-first'),
                    'displayConfigureSalr' : localStorage.getItem('display-configure-salr'),
                    'replaceImagesWithLinks' : localStorage.getItem('replace-images-with-links'),
                    'replaceImagesReadOnly' : localStorage.getItem('replace-images-read-only'),
                    //'dontReplaceEmoticons' : localStorage.getItem('dont-replace-emoticons'),
                    'replaceLinksWithImages' : localStorage.getItem('replace-links-with-images'),
                    'dontReplaceLinkNWS' : localStorage.getItem('dont-replace-link-nws'),
                    'dontReplaceLinkSpoiler' : localStorage.getItem('dont-replace-link-spoiler'),
                    'dontReplaceLinkRead' : localStorage.getItem('dont-replace-link-read'),
                    'restrictImageSize' : localStorage.getItem('restrict-image-size'),
                    'inlineVideo' : localStorage.getItem('inline-video-links'),
                    'highlightFriends' : localStorage.getItem('highlight-friends'),
                    'highlightFriendsColor' : localStorage.getItem('highlight-friends-color'),
                    'highlightSelf' : localStorage.getItem('highlight-self'),
                    'highlightSelfColor' : localStorage.getItem('highlight-self-color'),
                    'highlightModAdmin' : localStorage.getItem('highlight-moderator-admin'),
                    'highlightModeratorColor' : localStorage.getItem('highlight-moderator-color'),
                    'highlightAdminColor' : localStorage.getItem('highlight-admin-color'),
                    'friendsList' : localStorage.getItem('friends-list'),
                    'inlinePostCounts' : localStorage.getItem('inline-post-counts'),
                    'forumsList' : localStorage.getItem('forums-list'),
                    'highlightOP' : localStorage.getItem('highlight-original-poster'),
                    'highlightOPColor' : localStorage.getItem('highlight-original-poster-color'),
                    'disableCustomButtons' : localStorage.getItem('disable-custom-buttons'),

                    'enableUserNotes' : localStorage.getItem('user-notes-enabled'),
                    'userNotes' : localStorage.getItem('user-notes'),
                    'boxQuotes' : localStorage.getItem('box-quotes'),
                    'displayPageNavigator' : localStorage.getItem('display-page-navigator')
                });
                break;
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
 * Gets the setting name, based on the friendly name provided externally.
 */
function settingNameFromFriendlyName(friendlyName) {
    switch (friendlyName) {
        case 'username': return 'username';
        case 'userQuote': return 'user-quote';
        case 'darkRead' : return 'dark-read';
        case 'lightRead' : return 'light-read';
        case 'darkNewReplies' : return 'dark-new-replies';
        case 'lightNewReplies' : return 'light-new-replies';
        case 'youtubeHighlight' : return 'youtube-highlight';
        case 'hideAdvertisements' : return 'hide-advertisements';
        case 'hideHeaderLinks' : return 'hide-header-links';
        case 'hideFooterLinks' : return 'hide-footer-links';
        case 'displayNewPostsFirst' : return 'display-new-posts-first';
        case 'displayConfigureSalr' : return 'display-configure-salr';
        case 'replaceImagesWithLinks' : return 'replace-images-with-links';
        case 'replaceImagesReadOnly' : return 'replace-images-read-only';
        //case 'dontReplaceEmoticons' : return 'dont-replace-emoticons';
        case 'replaceLinksWithImages' : return 'replace-links-with-images';
        case 'dontReplaceLinkNWS' : return 'dont-replace-link-nws';
        case 'dontReplaceLinkSpoiler' : return 'dont-replace-link-spoiler';
        case 'dontReplaceLinkRead' : return 'dont-replace-link-read';
        case 'restrictImageSize' : return 'restrict-image-size';
        case 'inlineVideo' : return 'inline-video-links';
        case 'highlightFriends' : return 'highlight-friends';
        case 'highlightFriendsColor' : return 'highlight-friends-color';
        case 'highlightSelf' : return 'highlight-self';
        case 'highlightSelfColor' : return 'highlight-self-color';
        case 'highlightModAdmin' : return 'highlight-moderator-admin';
        case 'highlightModeratorColor' : return 'highlight-moderator-color';
        case 'highlightAdminColor' : return 'highlight-admin-color';
        case 'friendsList' : return 'friends-list';
        case 'inlinePostCounts' : return 'inline-post-counts';
        case 'disableCustomButtons' : return 'disable-custom-buttons';
        case 'forumsList' : return 'forums-list';
        case 'highlightOP' : return 'highlight-original-poster';
        case 'highlightOPColor' : return 'highlight-original-poster-color';
        case 'enableUserNotes' : return 'user-notes-enabled';
        case 'userNotes' : return 'user-notes';
        case 'boxQuotes' : return 'box-quotes';
        case 'displayPageNavigator' : return 'display-page-navigator';
    }
}

/**
 * Sets up default preferences for highlighting only
 *
 */
function setupDefaultPreferences() {
    localStorage.setItem('user-quote', '#a2cd5a');
    localStorage.setItem('dark-read', '#6699cc');
    localStorage.setItem('light-read', '#99ccff');
    localStorage.setItem('dark-new-replies', '#99cc99');
    localStorage.setItem('light-new-replies', '#ccffcc');
    localStorage.setItem('youtube-highlight', '#ff00ff');
    localStorage.setItem('display-configure-salr', 'true');
    localStorage.setItem('highlight-friends-color', "#f2babb");
    localStorage.setItem('highlight-self-color', "#f2babb");
    localStorage.setItem('highlight-admin-color', "#ff7256");
    localStorage.setItem('highlight-moderator-color', "#b4eeb4");
    localStorage.setItem('inline-post-counts', 'false');
    localStorage.setItem('disable-custom-buttons', 'false');
    localStorage.setItem('highlight-original-poster-color', '#fff2aa');
    localStorage.setItem('display-page-navigator', 'true');
    localStorage.setItem('user-notes-enabled', 'true');
}
