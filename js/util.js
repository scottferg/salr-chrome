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
 * Returns the current PHP page the user is on
 *
 */
function findCurrentPage() {
    // Substrings out everything after the domain, then splits on the ?
    // and takes the left-side of the result
    return (window.location.href).substr(33).split('?')[0];
}

/**
 * Returns the current forum ID
 *
 */
function findForumID() {
    // Substrings out everything after the domain, then splits on the ?,
    // defaults to the argument list (right), splits on the &, looks at the first
    // parameter in the list, and splits on the = to get the result
    var parameterList = ((window.location.href).substr(33).split('?')[1]).split('&');

    for (var parameter in parameterList) {
        var currentParam = (parameterList[parameter]).split('=');

        if (currentParam[0] == 'threadid' || currentParam[0] == 'forumid') {
            return currentParam[1]; 
        }
    }
}

/**
 * Count the total number of pages to display in page navigator
 *
 */
function countPages() {

    var index = (findCurrentPage() == 'forumdisplay.php') ? 5 : 3;

    var result;

    jQuery('.pages').each(function() {
        var text = jQuery(this).html();
        var firstIndex = text.indexOf('(');
        var endIndex = text.indexOf(')');

        result = text.substr(firstIndex + 1, endIndex - (firstIndex + 1));
        if (result=='' || isNaN(result)) {
            result = 1;
        }
    });

    return Number(result);
}

function buildUrl(rootPageType, basePageID, page) {
    return 'http://forums.somethingawful.com/' + findCurrentPage() + '?' + rootPageType + '=' + basePageID + '&pagenumber=' + page;
}

/**
 * Jumps the user to the specified page
 *
 * @param rootPageType - forumid or threadid
 * @param basePagID - ID number associated with rootPageType
 * @param page - Page number to jump to
 *
 */
function jumpToPage(url) {
    location.href = url;
}

function findFirstUnreadPost() {
    var index = 0;
    var count = 0;
    var thread_post_size = jQuery('div#thread > table.post').size();

    // Get post number on page from anchor in URL
    var anchor_post = window.location.href.split('#pti')[1];
    if (!isNaN(anchor_post)) {
        return anchor_post-1;
    }

    // Get postid from anchor in URL
    anchor_post = window.location.href.split('#post')[1];
    if (!isNaN(anchor_post)) {
        var pti = jQuery('table#post'+anchor_post+' tr:first').attr('id').split('pti')[1];
        if (!isNaN(pti))
            return pti-1;
    }

    // Check if the user has the "Show an icon next to each post indicating if
    // it has been seen or not" option enabled for the forums
    var use_setseen = (jQuery('td.postdate > a[href*=action=setseen]').length > 0);

    jQuery('div#thread > table.post').each(function() {
        if (use_setseen) {
            // User has setseen icons enabled
            var posticon_img = jQuery('img[src*=posticon]', this);

            count++;
            if (posticon_img.attr('src') == 'http://fi.somethingawful.com/style/posticon-seen.gif') {
                index = count;
            }
        } else {
            // User has read post coloring enabled
            var post = jQuery('tr', this);

            count++;
            if (post.hasClass('seen1') || post.hasClass('seen2')) {
                index = count;
            }
        }
    });

    if (index == thread_post_size) // All posts read
        return index - 1;

    return index;
}
