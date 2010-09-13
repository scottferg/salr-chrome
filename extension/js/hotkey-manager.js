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

function HotKeyManager(quickReply) {
    /*****************
     N - Next Post
     P/M - Previous Post
     J - Next Page
     K/H - Previous Page
     O - Reanchor thread
     Q - Quick Quote current post
     E - Quick Edit current post
     R - Quick Reply current thread
    *******************/
    this.quickReply = quickReply;
    this.bindHotKeys();
    
    jQuery(document).data("enableSALRHotkeys", true);
    jQuery(document).bind("enableSALRHotkeys", this.enableHotKeys);
    jQuery(document).bind("disableSALRHotkeys", this.disableHotKeys);

    this.thread_post_size = jQuery('div#thread > table.post').size();
    this.current_post = findFirstUnreadPost();
    this.first_keypress = true;
}

HotKeyManager.prototype.bindHotKeys = function() {
    var that = this;

    jQuery(document).keydown(function(event) {
        switch(event.keyCode) {
            case 27: /* esc */
                that.hideQuickReply();
                break;
            case 77: /* m */
                if (event.altKey)
                    that.toggleQuickReply();
                break;
        }
    });
    jQuery(document).keypress(function(event) {
        var quick_reply_block = false;
        
        if(!jQuery(document).data("enableSALRHotkeys"))
            return;

        /*if (findCurrentPage() == 'showthread.php') {
            if (this.quickReply.isExpanded() || this.quickReply.isVisible()) {
                quick_reply_block = true;
            }
        }

        if (!quick_reply_block) {*/
            switch(event.keyCode) {
                case 110:
                    // Next post
                    that.nextPost();
                    break;
                case 112:
                case 109:
                    // Previous post
                    that.previousPost();
                    break;
                case 106:
                    // Next page
                    that.nextPage();
                    break;
                case 107:
                case 104:
                    // Previous page
                    that.previousPage();
                    break;
                case 111:
                    // Re-anchor thread
                    that.anchorThread();
                    break;
                case 49: /* 1 */
                    // Jump to first post on the page
                    that.firstPost();
                    break;
                case 48: /* 0 */
                    // Jump to last post on the page
                    that.lastPost();
                    break;
                case 115: /* s */
                    //that.toggleSignatures();
                    break;
                case 113:
                    // Quick quote current post
                    if (findCurrentPage() == 'showthread.php') {
                        that.quoteCurrentPost();
                        event.preventDefault();
                    }
                    break;
                case 101:
                    // Quick edit current post
                    if (findCurrentPage() == 'showthread.php') {
                        that.editCurrentPost();
                        event.preventDefault();
                    }
                    break;
                case 114:
                    // TODO: Conditionalize on quick reply being enabled
                    if (findCurrentPage() == 'showthread.php') {
                        that.displayQuickReply();
                        event.preventDefault();
                    }
                    break;
            }
        //}
    });
};

HotKeyManager.prototype.enableHotKeys = function() {
    jQuery(document).data("enableSALRHotkeys", true);
};

HotKeyManager.prototype.disableHotKeys = function() {
    jQuery(document).data("enableSALRHotkeys", false);
};

HotKeyManager.prototype.nextPage = function() {
    this.pageCount = countPages();

    switch(findCurrentPage()) {
        case 'forumdisplay.php':
        case 'showthread.php':
            var currentPage = Number(jQuery('span.curpage').html());
            if (currentPage <= 0)
                currentPage = 1;

            if (currentPage >= this.pageCount)
                return;

            jumpToPage(nextPageUrl());
    }
};



HotKeyManager.prototype.previousPage = function() {
    this.pageCount = countPages();

    switch(findCurrentPage()) {
        case 'forumdisplay.php':
        case 'showthread.php':
            var currentPage = Number(jQuery('span.curpage').html());
            if (currentPage <= 0)
                currentPage = 1;

            if (currentPage <= 1)
                return;

            jumpToPage(prevPageUrl());
    }
};

HotKeyManager.prototype.nextPost = function() {
    if (findCurrentPage() != 'showthread.php') {
        return;
    }

    if (this.first_keypress) {
        this.first_keypress = false;
    } else if (this.current_post < (this.thread_post_size - 1)) {
        this.current_post++;
    }

    var post = jQuery('div#thread > table.post');
    var previous_post = post.eq(this.current_post - 1);
    var current_post = post.eq(this.current_post);
    previous_post.removeClass('selected-post');
    current_post.addClass('selected-post');

    jQuery(window).scrollTop(current_post.offset().top);
};

HotKeyManager.prototype.previousPost = function() {
    if (findCurrentPage() != 'showthread.php') {
        return;
    }

    this.first_keypress = false;
    if (this.current_post > 0) {
        this.current_post--;
    }

    var post = jQuery('div#thread > table.post');
    var previous_post = post.eq(this.current_post + 1);
    var current_post = post.eq(this.current_post);
    previous_post.removeClass('selected-post');
    current_post.addClass('selected-post');

    jQuery(window).scrollTop(current_post.offset().top);
};

HotKeyManager.prototype.firstPost = function() {
    if (findCurrentPage() != 'showthread.php') {
        return;
    }

    var post = jQuery('div#thread > table.post');
    var current_post = post.eq(this.current_post);

    if (this.current_post > 0) {
        var previous_post = post.eq(this.current_post);

        this.current_post=0;
        current_post = post.eq(this.current_post);

        previous_post.removeClass('selected-post');
        current_post.addClass('selected-post');
    }

    if (this.first_keypress) {
        current_post.addClass('selected-post');
    }
    jQuery(window).scrollTop(current_post.offset().top);
    this.first_keypress = false;
};

HotKeyManager.prototype.lastPost = function() {
    if (findCurrentPage() != 'showthread.php') {
        return;
    }

    var post = jQuery('div#thread > table.post');
    var current_post = post.eq(this.current_post);

    if (this.current_post < this.thread_post_size-1) {
        var previous_post = post.eq(this.current_post);

        this.current_post=this.thread_post_size-1;
        current_post = post.eq(this.current_post);

        previous_post.removeClass('selected-post');
        current_post.addClass('selected-post');
    }

    if (this.first_keypress) {
        current_post.addClass('selected-post');
    }
    jQuery(window).scrollTop(current_post.offset().top);
    this.first_keypress = false;
};

HotKeyManager.prototype.anchorThread = function() {
    if (findCurrentPage() != 'showthread.php') {
        return;
    } else if (this.current_post == -1) {
        return;
    }

    this.first_keypress = false;
    var post = jQuery('div#thread > table.post').eq(this.current_post);
    post.addClass('selected-post');

    jQuery(window).scrollTop(post.offset().top);
};

HotKeyManager.prototype.toggleSignatures = function() {
    jQuery('p.signature').each(function() {
        if (jQuery(this).css('display') == 'none')
            jQuery(this).css('display','');
        else
            jQuery(this).css('display','none');
    });
};

HotKeyManager.prototype.quoteCurrentPost = function() {
    if (this.current_post == -1) {
        return;
    }
    if (!this.quickReply)
        return;

    var current_post = jQuery('div#thread > table.post').eq(this.current_post);
    var postid = current_post.attr('id').substr(4);

    this.quickReply.appendQuote(postid);
    this.quickReply.show();
};

HotKeyManager.prototype.editCurrentPost = function() {
    if (this.current_post == -1) {
        return;
    }
    if (!this.quickReply)
        return;

    var current_post = jQuery('div#thread > table.post').eq(this.current_post);
    if (current_post.has('img[alt="Edit"]').length == 0)
        return;
    var postid = current_post.attr('id').substr(4);
    var subscribe = jQuery('.subscribe > a').html().indexOf('Unbookmark') == 0 ? true : false;

    this.quickReply.editPost(postid, subscribe);
    this.quickReply.show();
};

HotKeyManager.prototype.displayQuickReply = function() {
    if (!this.quickReply)
        return;
    if (findCurrentPage() == 'showthread.php') {
        this.quickReply.show();
    }
};

HotKeyManager.prototype.toggleQuickReply = function() {
    if (!this.quickReply)
        return;
    if (!this.quickReply.isVisible())
        return;
    if (findCurrentPage() == 'showthread.php') {
        this.quickReply.toggleView();
    }
};

HotKeyManager.prototype.hideQuickReply = function() {
    if (!this.quickReply)
        return;
    if (!this.quickReply.isVisible())
        return;
    if (findCurrentPage() == 'showthread.php') {
        this.quickReply.hide();
    }
};
