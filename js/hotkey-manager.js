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

function HotKeyManager() {
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
    this.bindHotKeys();
}

HotKeyManager.prototype.bindHotKeys = function() {
    var that = this;

    jQuery(document).keypress(function(event) {
        switch(event.keyCode) {
            case 110:
                // Next post
                break;
            case 112:
            case 109:
                // Previous post
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
                break;
            case 113:
                // Quick quote current post
                break;
            case 101:
                // Quick edit current post
                break;
            case 114:
                // TODO: Conditionalize on quick reply being enabled
                quickReply.show();
                break;
            case 27:
                // TODO: Conditionalize on quick reply being enabled
                quickReply.hide();
                break;
        }
    });
};

HotKeyManager.prototype.nextPage = function() {
    this.pageCount = countPages();

    switch(findCurrentPage()) {
        case 'forumdisplay.php':
        case 'showthread.php':
            this.rootPageType = (findCurrentPage() == 'forumdisplay.php') ? 'forumid' : 'threadid';
            this.basePageID = findForumID();
            this.currentPage = Number(jQuery('span.curpage').html());
            jumpToPage(this.rootPageType, this.basePageID, this.currentPage + 1);
            break;
    }
};

HotKeyManager.prototype.previousPage = function() {
    this.pageCount = countPages();

    switch(findCurrentPage()) {
        case 'forumdisplay.php':
        case 'showthread.php':
            this.rootPageType = (findCurrentPage() == 'forumdisplay.php') ? 'forumid' : 'threadid';
            this.basePageID = findForumID();
            this.currentPage = Number(jQuery('span.curpage').html());
            jumpToPage(this.rootPageType, this.basePageID, this.currentPage - 1);
            break;
    }
};
