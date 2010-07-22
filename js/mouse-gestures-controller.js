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

function MouseGesturesController() {
    var that = this;

    this.gesture_overlay_html = this.buildOverlay();
    this.disabled_gestures = new Array();

    this.pageCount = countPages();

    this.rootPageType = null;
    this.basePageID = null;
    this.currentPageName = findCurrentPage();

    // Page navigation functions are provided globally
    // in page-navigator.js
    //
    // TODO: Catch this on user control panel as well
    switch(this.currentPageName) {
        case 'forumdisplay.php':
        case 'showthread.php':
            this.rootPageType = (this.currentPageName == 'forumdisplay.php') ? 'forumid' : 'threadid';
            this.basePageID = findForumID();
        case 'usercp.php':
            break;
        default:
            break;
    }
    // Current page
    this.currentPage = Number(jQuery('span.curpage').html());
    if (this.currentPage <= 0)
        this.currentPage = 1;

    jQuery('div#container').each(function() {
        var removeOverlay = function(x, y) {
            var handler = that.findFunction(x, y);
            
            jQuery('div#gesture-overlay').each(function() {
                jQuery(this).remove();
            });

            if (handler) {
                handler.call(that);
            }
        };

        var drawIndicator = function(event) {
            canvas = document.getElementById('gesture-indicator');

            var overlay_left = jQuery('div#gesture-overlay').offset().left;
            var overlay_top = jQuery('div#gesture-overlay').offset().top;

            var x_coord = event.offsetX;
            var y_coord = event.offsetY;

            // If we are out of bounds of the overlay then we need
            // to adjust accordingly
            if (event.pageX < (overlay_left + 77)) {
                x_coord = 0;
            }
            
            if (event.pageY < (overlay_top + 77)) {
                y_coord = 0;
            }

            if (event.pageX > (overlay_left + 153)) {
                x_coord = 77;
            }

            if (event.pageY > (overlay_top + 153)) {
                y_coord = 77;
            }

            context = canvas.getContext('2d');

            // Clear the rectangle and draw the stroke
            context.clearRect(0, 0, 77, 77);
            context.lineWidth = '6';

            context.strokeStyle = "rgba(0, 0, 0, .5)";
            context.beginPath();
            context.moveTo(38, 38);
            context.lineTo(x_coord, y_coord);
            context.stroke();
            context.closePath();

            that.updateButtonStyles(event.pageX, event.pageY);
        }

        jQuery(this).rightMouseDown(function(event) {
            jQuery('body').append(that.gesture_overlay_html);
            jQuery('div#gesture-overlay').css({'left': event.pageX - 115,
                                 'top': event.pageY - 115});

            that.setPageSpecificCSS();

            jQuery('div#gesture-overlay').rightMouseUp(function(event) {
                removeOverlay(event.pageX, event.pageY);
            });
            
            // jQuery('div#gesture-overlay').noContext();

            jQuery('div#gesture-overlay').mousemove(drawIndicator);
        });

        jQuery(this).rightMouseUp(function(event) {
            removeOverlay(event.pageX, event.pageY);
        });
    });
}

MouseGesturesController.prototype.buildOverlay = function() {
    html = '<div id="gesture-overlay">' +
           '    <div id="gesture-top">' +
           '        <img id="top-image" src="' + chrome.extension.getURL("images/") + 'gesturenav-top.png">' +
           '    </div>' +
           '    <div id="gesture-left">' +
           '        <img id="left-image" src="' + chrome.extension.getURL("images/") + 'gesturenav-left.png">' +
           '    </div>' +
           '    <canvas id="gesture-indicator" width="77" height="77">' +
           '    </canvas>' +
           '    <div id="gesture-right">' +
           '        <img id="right-image" src="' + chrome.extension.getURL("images/") + 'gesturenav-right.png">' +
           '    </div>' +
           '    <div id="gesture-bottom">' +
           '        <img id="bottom-image" src="' + chrome.extension.getURL("images/") + 'gesturenav-bottom.png">' +
           '    </div>' +
           '</div>';

    return html;
};

MouseGesturesController.prototype.bindCanvasEvent = function() {
    canvas.addEventListener('mousemove', gestureMouseMove, false);

    var gestureMouseMove = function(event) {
        var x, y;

        // Get the mouse position relative to the canvas element.
        if (event.layerX || event.layerX == 0) { // Firefox
          x = event.layerX;
          y = event.layerY;
        }

    }
};

MouseGesturesController.prototype.setPageSpecificCSS = function() {
    if (window.location.href == 'http://forums.somethingawful.com/') {
        this.disableGesture('up');
        this.disableGesture('left');
        this.disableGesture('right');
    }

    if (this.currentPageName == 'usercp.php') {
        this.disableGesture('left');
        this.disableGesture('right');
    }

    if (this.currentPage == 1) {
        this.disableGesture('left');
    }

    if (this.currentPage == this.pageCount) {
        this.disableGesture('right');
    }
};

MouseGesturesController.prototype.updateButtonStyles = function(x_coord, y_coord) {
    var gesture_top = jQuery('div#gesture-top');
    var gesture_bottom = jQuery('div#gesture-bottom');
    var gesture_left = jQuery('div#gesture-left');
    var gesture_right = jQuery('div#gesture-right');
    
    jQuery('img#top-image', gesture_top).first().attr('src', chrome.extension.getURL("images/") + 'gesturenav-top.png');
    jQuery('img#bottom-image', gesture_bottom).first().attr('src', chrome.extension.getURL("images/") + 'gesturenav-bottom.png');
    jQuery('img#left-image', gesture_left).first().attr('src', chrome.extension.getURL("images/") + 'gesturenav-left.png');
    jQuery('img#right-image', gesture_right).first().attr('src', chrome.extension.getURL("images/") + 'gesturenav-right.png');

    switch (this.determineLocation(x_coord, y_coord)) {
        case 'top':
            jQuery('img#top-image', gesture_top).first().attr('src', chrome.extension.getURL("images/") + 'gesturenav-top-press.png');
            break;
        case 'bottom':
            jQuery('img#bottom-image', gesture_bottom).first().attr('src', chrome.extension.getURL("images/") + 'gesturenav-bottom-press.png');
            break;
        case 'left':
            jQuery('img#left-image', gesture_left).first().attr('src', chrome.extension.getURL("images/") + 'gesturenav-left-press.png');
            break;
        case 'right':
            jQuery('img#right-image', gesture_right).first().attr('src', chrome.extension.getURL("images/") + 'gesturenav-right-press.png');
            break;
        default:
            break;
    }
};

MouseGesturesController.prototype.findFunction = function(x_coord, y_coord) {
    switch (this.determineLocation(x_coord, y_coord)) {
        case 'top':
            return this.topAction;
            break;
        case 'bottom':
            return this.bottomAction;
            break;
        case 'left':
            return this.leftAction;
            break;
        case 'right':
            return this.rightAction;
            break;
    }
};

MouseGesturesController.prototype.determineLocation = function(x_coord, y_coord) {
    var top_button = jQuery('div#gesture-top');
    var left_button = jQuery('div#gesture-left');
    var right_button = jQuery('div#gesture-right');
    var bottom_button = jQuery('div#gesture-bottom');

    // First find if it is in a valid X coordinate, then determine if
    // it is also in a valid Y coordinate
    if (x_coord > top_button.offset().left && x_coord < top_button.offset().left + 77) {
        if (y_coord > top_button.offset().top && y_coord < top_button.offset().top + 77) {
            return 'top';
        }
    } else if (x_coord > left_button.offset().left && x_coord < left_button.offset().left + 77) {
        if (y_coord > left_button.offset().top && y_coord < left_button.offset().top + 77) {
            return 'left';
        }
    } else if (x_coord > right_button.offset().left && x_coord < right_button.offset().left + 77) {
        if (y_coord > right_button.offset().top && y_coord < right_button.offset().top + 77) {
            return 'right';
        }
    } else if (x_coord > bottom_button.offset().left && x_coord < bottom_button.offset().left + 77) {
        if (y_coord > bottom_button.offset().top && y_coord < bottom_button.offset().top + 77) {
            return 'bottom';
        }
    }
};

MouseGesturesController.prototype.is_enabled = function(a_function) {
    for (var i = 0; i < this.disabled_gestures.length; i++) {
        if (this.disabled_gestures[i] == a_function) {
            return false;
        }
    }

    return true;
};

MouseGesturesController.prototype.topAction = function() {
    // If page is showthread.php, goto forumdisplay.php
    // If page is forumdisplay.php, goto forums.somethingawful.com
    // If page is forums.somethingawful.com, do nothing
    if (this.is_enabled(this.topAction)) {
        if (this.currentPageName == 'showthread.php' 
            || this.currentPageName == 'usercp.php'
            || this.currentPageName == 'forumdisplay.php') 
        {
            var href = jQuery('span.mainbodytextlarge a').slice(-2, -1).attr('href');

            if (href == '/' || href === undefined) {
                href = '';
            }

            location.href = 'http://forums.somethingawful.com/' + href;
        }
    }
};

MouseGesturesController.prototype.rightAction = function() {
    if (this.is_enabled(this.rightAction)) {
        jumpToPage(buildUrl(this.rootPageType, this.basePageID, this.currentPage + 1));
    }
};

MouseGesturesController.prototype.leftAction = function() {
    if (this.is_enabled(this.leftAction)) {
        jumpToPage(buildUrl(this.rootPageType, this.basePageID, this.currentPage - 1));
    }
};

MouseGesturesController.prototype.disableGesture = function(gesture) {
    var button = false;

    switch(gesture) {
        case 'up':
            button = jQuery('div#gesture-top');
            this.disabled_gestures.push(this.topAction);
            break;
        case 'left':
            button = jQuery('div#gesture-left');
            this.disabled_gestures.push(this.leftAction);
            break;
        case 'right':
            button = jQuery('div#gesture-right');
            this.disabled_gestures.push(this.rightAction);
            break;
        case 'down':
            button = jQuery('div#gesture-down');
            this.disabled_gestures.push(this.bottomAction);
            break;
    }

    button.css('opacity', '0.5');
};
