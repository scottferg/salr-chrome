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

function PageNavigator(base_image_uri) {
    this.base_image_uri = base_image_uri;

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

    var html =  '<nav id="page-nav"> ' + 
                    '<div id="nav-body">' +
                    '<span id="first-page-buttons">' + 
                        '<a class="nav-button" id="nav-first-page" href="#">' +
                            '<img src="' + this.base_image_uri + 'nav-firstpage.png" />' + 
                        '</a>' + 
                        '<a class="nav-button" id="nav-prev-page" href="#">' +
                            '<img src="' + this.base_image_uri + 'nav-prevpage.png" />' +
                        '</a>' + 
                    '</span>' +
                    '<span id="page-drop-down">' +
                    '<select id="number-drop-down" name="page-number">';

    for (var i = 1; i < (this.pageCount + 1); i++) {
        html += '<option value="' + i + '">' + i + '</option>';
    }

    html +=         '</select>' +
                    '</span>' +
                    '<span id="last-page-buttons">' +
                        '<a class="nav-button" id="nav-next-page" href="#">' +
                            '<img src="' + this.base_image_uri + 'nav-nextpage.png" />' + 
                        '</a>' + 
                        '<a class="nav-button" id="nav-last-page" href="#">' +
                            '<img src="' + this.base_image_uri + 'nav-lastpage.png" />' +
                        '</a>' + 
                        '<a class="nav-button" id="nav-last-post" >' +
                            '<img src="' + this.base_image_uri + 'lastpost.png" />' +
                        '</a>' + 
                    '</span>' +
                    '</div>' +
                '</nav>';

    // Add the navigator to the DOM
    jQuery('#container').append(html);

    var navigatorWidth = (this.pageCount > 100) ? 219 : 212;

    // Setup page nav CSS
    jQuery('nav#page-nav').css({'width': navigatorWidth + 'px'});
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
            jumpToPage(getPageUrl(jQuery(this).val()));
        });
    });

    // If we are on the first page, disable the first two buttons,
    // otherwise setup event handlers
    if (this.currentPage != 1) {
        jQuery('#nav-first-page').first().attr('href', getPageUrl(1));
        jQuery('#nav-prev-page').attr('href', prevPageUrl());
    } else {
        jQuery('#nav-first-page').css('opacity', '0.5');
        jQuery('#nav-prev-page').css('opacity', '0.5');
    }

    // If we are on the last page, disable the last two buttons,
    // otherwise setup event handlers
    if (this.currentPage != this.pageCount) {
        jQuery('#nav-last-page').first().attr('href', getPageUrl(that.pageCount));
        jQuery('#nav-next-page').first().attr('href', nextPageUrl());
    } else {
        jQuery('#nav-last-page').css('opacity', '0.5');
        jQuery('#nav-next-page').css('opacity', '0.5');
    }

    jQuery('#nav-last-post').click(function() {
        var post = jQuery('div#thread > table.post').eq(findFirstUnreadPost());

        jQuery(window).scrollTop(post.offset().top);
    });
};

PageNavigator.prototype.display = function() {
    jQuery('nav#page-nav').addClass('displayed');
};

PageNavigator.prototype.hide = function() {
    jQuery('nav#page-nav').removeClass('displayed');
};
