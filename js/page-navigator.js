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
    });

    return Number(result);
}

/**
 * Jumps the user to the specified page
 *
 * @param rootPageType - forumid or threadid
 * @param basePagID - ID number associated with rootPageType
 * @param page - Page number to jump to
 *
 */
function jumpToPage(rootPageType, basePageID, page) {
    location.href = 'http://forums.somethingawful.com/' + findCurrentPage() + '?' + rootPageType + '=' + basePageID + '&pagenumber=' + page;
}

/**
 * Display the page navigator HTML
 *
 */
function displayPageNavigator() {
    // store the fact we've shown it in #container, since it's the parent of the element I guess
    if (jQuery('#container').data('shownPageNav'))
        return true;
    jQuery('#container').data('shownPageNav', true);
    var pageCount = countPages();
    // Determines if we are on a forum or a thread
    var rootPageType = (findCurrentPage() == 'forumdisplay.php') ? 'forumid' : 'threadid';
    // Either forum ID or thread ID, depending on which we are
    // currently viewing
    var basePageID = findForumID();
    // Current page
    var currentPage = Number(jQuery('span.curpage').html());

    // If there is only a single page in the thread, or something
    // goes wrong, just quit out
    if (currentPage == 0) {
        return;
    }

    var html = '<div id="page-nav"> ' + 
                '   <span id="first-page-buttons">' + 
                '       <img src="' + chrome.extension.getURL('images/') + 'nav-firstpage.png" id="nav-first-page" class="nav-button" />' + 
                '       <img src="' + chrome.extension.getURL('images/') + 'nav-prevpage.png" id="nav-prev-page" class="nav-button" />' +
                '   </span>' +
                '   <span id="page-drop-down">' +
                '       <select id="number-drop-down" name="page-number">';

    for (var i = 1; i < (pageCount + 1); i++) {
        html += '           <option value="' + i + '">' + i + '</option>';
    }

    html +=     '       </select>' +
                '   </span>' +
                '   <span id="last-page-buttons">' +
                '       <img src="' + chrome.extension.getURL('images/') + 'nav-nextpage.png" id="nav-next-page" class="nav-button" />' + 
                '       <img src="' + chrome.extension.getURL('images/') + 'nav-lastpage.png" id="nav-last-page" class="nav-button" />' +
                '   </span>' +
               '</div>';

    // Add the navigator to the DOM
    jQuery('#container').append(html);

    var navigatorWidth = (pageCount > 100) ? 187 : 180;

    // Setup page nav CSS
    jQuery('#page-nav').css({'background': '#006699',
                             'width': navigatorWidth + 'px',
                             'float': 'right',
                             'position': 'fixed',
                             'bottom': '0px',
                             'right': '10px',
                             'padding-bottom': '2px',
                             'padding-left': '4px',
	                         '-webkit-box-shadow': '#000000 -1px -1px 12px',
	                         'border-top-left-radius': '6px 6px',
	                         'border-top-right-radius': '6px 6px'});

    // Set styles for buttons and inputs
    jQuery('.nav-button').css({'position': 'relative',
                               'top': '4px',
                               'cursor': 'pointer'});

    jQuery('select#number-drop-down').css({'position': 'relative', 'top': '-2px'});

    // Pre-select the current page
    jQuery('select#number-drop-down').val(currentPage);

    // Add event handlers for each button
    jQuery("select#number-drop-down").change(function () {
        jQuery("select option:selected").each(function () {
            jumpToPage(rootPageType, basePageID, jQuery(this).val());
        });
    });

    // If we are on the first page, disable the first two buttons,
    // otherwise setup event handlers
    if (currentPage != 1) {
        jQuery('#nav-first-page').click(function() {
            jumpToPage(rootPageType, basePageID, 1);
        });

        jQuery('#nav-prev-page').click(function() {
            jumpToPage(rootPageType, basePageID, currentPage - 1);
        });
    } else {
        jQuery('#nav-first-page').css('opacity', '0.5');
        jQuery('#nav-prev-page').css('opacity', '0.5');
    }

    // If we are on the last page, disable the last two buttons,
    // otherwise setup event handlers
    if (currentPage != pageCount) {
        jQuery('#nav-last-page').click(function() {
            jumpToPage(rootPageType, basePageID, pageCount);
        });

        jQuery('#nav-next-page').click(function() {
            jumpToPage(rootPageType, basePageID, currentPage + 1);
        });
    } else {
        jQuery('#nav-last-page').css('opacity', '0.5');
        jQuery('#nav-next-page').css('opacity', '0.5');
    }
}
