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

function PageNavigator() {
    this.pageCount = countPages();
    // Determines if we are on a forum or a thread
    this.rootPageType = (findCurrentPage() == 'forumdisplay.php') ? 'forumid' : 'threadid';
    // Either forum ID or thread ID, depending on which we are
    // currently viewing
    this.basePageID = findForumID();
    // Current page
    this.currentPage = Number(jQuery('span.curpage').html());

    this.writeNavigatorHtml();
    this.selectPage(this.currentPage);
    this.bindButtonEvents();
};

PageNavigator.prototype.writeNavigatorHtml = function() {
    // store the fact we've shown it in #container, since it's the parent of the element I guess
    if (jQuery('#container').data('shownPageNav'))
        return true;
    jQuery('#container').data('shownPageNav', true);

    // If there is only a single page in the thread, or something
    // goes wrong, just quit out
    if (this.currentPage == 0) {
        return;
    }

    var html = '<div id="page-nav"> ' + 
                '   <span id="first-page-buttons">' + 
                '       <img src="' + chrome.extension.getURL('images/') + 'nav-firstpage.png" id="nav-first-page" class="nav-button" />' + 
                '       <img src="' + chrome.extension.getURL('images/') + 'nav-prevpage.png" id="nav-prev-page" class="nav-button" />' +
                '   </span>' +
                '   <span id="page-drop-down">' +
                '       <select id="number-drop-down" name="page-number">';

    for (var i = 1; i < (this.pageCount + 1); i++) {
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

    var navigatorWidth = (this.pageCount > 100) ? 187 : 180;

    // Setup page nav CSS
    jQuery('#page-nav').css({'width': navigatorWidth + 'px'});
};

PageNavigator.prototype.selectPage = function(page_number) {
    // Pre-select the current page
    jQuery('select#number-drop-down').val(page_number);
};

PageNavigator.prototype.bindButtonEvents = function() {
    var that = this;

    // Add event handlers for each button
    jQuery("select#number-drop-down").change(function () {
        jQuery("select option:selected").each(function () {
            jumpToPage(that.rootPageType, that.basePageID, jQuery(this).val());
        });
    });

    // If we are on the first page, disable the first two buttons,
    // otherwise setup event handlers
    if (this.currentPage != 1) {
        jQuery('#nav-first-page').click(function() {
            jumpToPage(that.rootPageType, that.basePageID, 1);
        });

        jQuery('#nav-prev-page').click(function() {
            jumpToPage(that.rootPageType, that.basePageID, that.currentPage - 1);
        });
    } else {
        jQuery('#nav-first-page').css('opacity', '0.5');
        jQuery('#nav-prev-page').css('opacity', '0.5');
    }

    // If we are on the last page, disable the last two buttons,
    // otherwise setup event handlers
    if (this.currentPage != this.pageCount) {
        jQuery('#nav-last-page').click(function() {
            jumpToPage(that.rootPageType, that.basePageID, that.pageCount);
        });

        jQuery('#nav-next-page').click(function() {
            jumpToPage(that.rootPageType, that.basePageID, that.currentPage + 1);
        });
    } else {
        jQuery('#nav-last-page').css('opacity', '0.5');
        jQuery('#nav-next-page').css('opacity', '0.5');
    }
};
