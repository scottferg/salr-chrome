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

// Tracks the visibility state of the box
var quickReplyState = {
    expanded: false,
    visible: false,
    sidebar_visible: false
};

function QuickReplyBox(forum_post_key) {
    this.forum_post_key = forum_post_key;

    this.create();
}

QuickReplyBox.prototype.create = function(username, quote) {

    // Begin fetching and parsing the emotes as soon as we create the quick-reply
    var emote_parser = new EmoteParser(this);

    // window.open("chrome-extension://lbeflkohppahphcnpjfgffckhcmgelfo/quick-reply.html", "Quick Reply","menubar=no,width=720,height=425,toolbar=no");
    var html = '<div id="side-bar">' +
                '   <div id="sidebar-list">' +
                '   </div>' +
                '</div>' +
                '<div id="quick-reply"> ' + 
                '   <form enctype="multipart/form-data" action="newreply.php" name="vbform" method="POST" onsubmit="return validate(this)">' +
                '       <input type="hidden" name="action" value="postreply">' + 
                '       <input type="hidden" name="threadid" value="' + findThreadID() + '">' + 
                '       <input type="hidden" name="formkey" value="' + this.forum_post_key + '">' + 
                '       <input type="hidden" name="form_cookie" value="postreply">' + 
                '       <div id="title-bar">' + 
                '           Quick Reply' + 
                '       </div>' +
                '       <div id="view-buttons">' + 
                '          <a id="toggle-view"><img id="quick-reply-rollbutton" class="quick-reply-image" src="' + chrome.extension.getURL("images/") + "quick-reply-rolldown.gif" + '"></a>' +
                '          <a id="dismiss-quick-reply"><img class="quick-reply-image" src="' + chrome.extension.getURL("images/") + "quick-reply-close.gif" + '"></a>' +
                '       </div>' +
                '       <div id="smiley-menu" class="sidebar-menu">' +
                '           <img src="' + chrome.extension.getURL("images/") + "quick-reply-smiley.gif" + '" />' +
                '       </div>' +
                '       <div id="tag-menu" class="sidebar-menu">' +
                '           <img src="' + chrome.extension.getURL("images/") + "quick-reply-tags.gif" + '" />' +
                '       </div>' +
                '       <div id="waffle-images-menu" class="sidebar-menu">' +
                '           <img src="' + chrome.extension.getURL("images/") + "quick-reply-tags.gif" + '" />' +
                '       </div>' +
                '       <div id="post-input-field">' +
                '<textarea name="message" rows="18" size="10" id="post-message">' +
                '</textarea>' +
                '       </div>' +
                '       <div id="post-options">' +
                '           <input type="checkbox" name="parseurl" value="yes" checked>' +
                '              <span class="post-options">Automatically parse URLs</span>' +
                '           </input>' + 
                // TODO: Make the "bookmark threads" default an option
                '           <input type="checkbox" name="bookmark" value="yes">' + 
                '              <span class="post-options">Bookmark thread</span>' +
                '           </input>' + 
                '           <input type="checkbox" name="disablesmilies" value="yes">' + 
                '               <span class="post-options">Disable smilies</span>' +
                '           </input>' + 
                '           <input type="checkbox" name="signature" value="yes">' + 
                '               <span class="post-options">Show signature</span>' +
                '          </input>' + 
                '       </div>' +
                '       <div id="submit-buttons">' +
                '           <input type="submit" class="bginput" name="preview" value="Preview Reply">' + 
                '           <input type="submit" class="bginput" name="submit" value="Submit Reply">' + 
                '       </div>' +
                '   </form>' +
               '</div>';
               
    // Only append it if we haven't already
    if (jQuery('#quick-reply').length == 0) {
        jQuery('body').append(html);
    }

    jQuery('#dismiss-quick-reply').click(this.hide);
    
    jQuery('div#quick-reply').addClass('modal');

    jQuery('#title-bar').click(this.toggleView);
    jQuery('#toggle-view').click(this.toggleView);
    
    jQuery(document).keypress(function(event) {
        if (event.keyCode == '114') {
            jQuery('#quick-reply').show();
        }
    });

    jQuery(window).resize(function() {
        var quick_reply_position = jQuery('#quick-reply').offset().left;
        var offset = 350;

        if (quickReplyState.sidebar_visible) {
            offset += 200;
        }

        jQuery('#side-bar').css('left', (quick_reply_position + offset) + 'px');
    });

    var quick_reply_position = jQuery('#quick-reply').offset().left;

    jQuery('#side-bar').css('left', (quick_reply_position + 350) + 'px');

    var that = this;

    jQuery('.sidebar-menu').each(function() {
        jQuery(this).click(function() {
            that.toggleSidebar(jQuery(this));
        });
    });

    jQuery('div.sidebar-menu-item').live('click', function() {
        that.appendText(jQuery('div.menu-item-code', this).first().html());
    });

    this.sidebar_html = '<img class="loading-spinner" src="' + chrome.extension.getURL("images/") + 'loading-spinner.gif" />';
    this.emotes = null;
    
    jQuery('#side-bar').hide();
    jQuery('#quick-reply').hide();
};

QuickReplyBox.prototype.show = function() {
    jQuery('#quick-reply').show("slow");
    quickReplyState.expanded = true;
};

QuickReplyBox.prototype.hide = function() {
    jQuery('#side-bar').first().hide();
    jQuery('#quick-reply').hide("slow");
    jQuery('#post-message').val('');
    quickReplyState.expanded = false;
};

QuickReplyBox.prototype.appendText = function(text) {
    var current_message = jQuery('#post-message').val();

    jQuery('#post-message').html(current_message + text);
};

QuickReplyBox.prototype.appendQuote = function(username, quote) {

    username = username || false;
    quote = this.parseQuote(quote) || false;

    var quote_string = '';

    if (username && quote) {
        var current_message = jQuery('#post-message').val();

        quote_string += '[quote="' + username + '"]\n' + jQuery.trim(quote) + '\n[/quote]\n\n';

        jQuery('#post-message').html(current_message + quote_string);
    }
};

QuickReplyBox.prototype.parseQuote = function(quote_string) {
    var result = quote_string;
    var that = this;

    // Remove any quote blocks within the quote
    jQuery('div.bbc-block', result).each(function() {
        jQuery(this).remove();
    });

    jQuery('img', result).each(function() {
        var emoticon = that.parseSmilies(jQuery(this).attr('title'));

        if (emoticon) {
            jQuery(this).replaceWith(emoticon);
        }
    });

    // TODO: Need additional parsers

    return result.text();
};

QuickReplyBox.prototype.parseSmilies = function(quote_string) {
    var result = false;
    var end_index = quote_string.length - 1;

    var smilies = {
        ':(': '',
        ':)': '',
        ':D': '',
        ';)': '',
        ';-*': '',
    };

    if (quote_string[0] == ':' && quote_string[end_index] == ':') {
        result = quote_string;
    } else if (quote_string in smilies) {
        result = quote_string;
    }

    return result;
};

QuickReplyBox.prototype.toggleView = function() {

    var quick_reply_box = jQuery(".modal").first();
    var min = '18px';
    var max = '390px';
    var imgId = jQuery("img#quick-reply-rollbutton").first();

    if(quickReplyState.expanded) {
        var hideBox = function() {
            jQuery('#side-bar').first().hide();
            quick_reply_box.animate( { height: min } );
            (imgId).attr("src", chrome.extension.getURL("images/") + "quick-reply-rollup.gif");
            quickReplyState.expanded = false;
        };

        // If the sidebar is open when we're trying to rolldown the box, animate
        // the sidebar as we tuck it away
        if(quickReplyState.sidebar_visible) {
            jQuery('#side-bar').animate( { left: '-=200px' }, 500, function() {
                quickReplyState.sidebar_visible = null;
                hideBox();
            });
        } else {
            hideBox();
        }
    } else {
        quick_reply_box.animate( { height: max }, 500, function() {
                // Only display the sidebar after the box is shown
                jQuery('#side-bar').first().show();
        });
        (imgId).attr("src", chrome.extension.getURL("images/") + "quick-reply-rolldown.gif");
        quickReplyState.expanded = true;
    }
};

QuickReplyBox.prototype.toggleSidebar = function(element) {
    side_bar = jQuery("#side-bar").first();

    if(!side_bar.is(':visible')) {
        side_bar.css('display', 'block');
    }

    var min = '20px';
    var max = '525px';
    var populate_method = null;

    switch (element.attr('id')) {
        case 'smiley-menu':
            populate_method = this.setEmoteSidebar;
            break;
        case 'tag-menu':
            populate_method = this.setBBCodeSidebar;
            break;
        case 'waffle-images-menu':
            populate_method = this.setWaffleImagesSidebar;
            break;
    }

    // If there is a sidebar open, and the button clicked is the same
    // one that is open, then close it

    // If there is a sidebar open, and the button clicked is different,
    // close what is open, then reopen the correct one

    // If no sidebar is open, open it
    if ((quickReplyState.sidebar_visible) && (quickReplyState.sidebar_visible == element.attr('id'))) {
        side_bar.animate( { left: '-=200px' } );
        quickReplyState.sidebar_visible = false;
    } else if ((quickReplyState.sidebar_visible) && (quickReplyState.sidebar_visible != element.attr('id'))) {
        side_bar.animate( { left: '-=200px' }, 500, function() {
            populate_method();
            side_bar.animate( { left: '+=200px' } );
            quickReplyState.sidebar_visible = element.attr('id');
        });
    } else {
        populate_method();
        side_bar.animate( { left: '+=200px' } );
        quickReplyState.sidebar_visible = element.attr('id');
    }

};

QuickReplyBox.prototype.notify = function(emotes) {
    this.emotes = emotes;

    this.setEmoteSidebar();
};

QuickReplyBox.prototype.setEmoteSidebar = function() {
    var html = '';

    for (var emote in this.emotes) { 
        html += '<div class="sidebar-menu-item">' +
                '   <div><img src="' + emotes[emote].image + '" /></div>' +
                '   <div class="menu-item-code">' + emotes[emote].emote + '</div>' +
                '</div>';
    }

    jQuery('#sidebar-list').html(html);

    this.sidebar_html = html;
};

QuickReplyBox.prototype.setBBCodeSidebar = function() {
    var html = '';

    var bbcodes = new Array();

    bbcodes['url'] = 'url';
    bbcodes['email'] = 'email';
    bbcodes['img'] = 'img';
    bbcodes['timg'] = 'timg';
    bbcodes['video'] = 'video';
    bbcodes['b'] = 'b';
    bbcodes['s'] = 's';
    bbcodes['u'] = 'u';
    bbcodes['i'] = 'i';
    bbcodes['spoiler'] = 'spoiler';
    bbcodes['fixed'] = 'fixed';
    bbcodes['super'] = 'super';
    bbcodes['sub'] = 'sub';
    bbcodes['size'] = 'size';
    bbcodes['color'] = 'color';
    bbcodes['quote'] = 'quote';
    bbcodes['pre'] = 'pre';
    bbcodes['code'] = 'code';
    bbcodes['php'] = 'php';
    bbcodes['list'] = 'list';

    for (var code in bbcodes) { 
        html += '<div class="sidebar-menu-item">' +
                '   <div class="menu-item-code">[' + code + '][/' + code + ']</div>' +
                '</div>';
    }

    jQuery('#sidebar-list').html(html);

    this.sidebar_html = html;
};

QuickReplyBox.prototype.setWaffleImagesSidebar = function() {
    html = '<div id="dropzone">' +
           '</div>';

    jQuery('#sidebar-list').html(html);
    
    jQuery('#dropzone').filedrop({
        url: 'http://waffleimages.com/upload',
        paramname: 'file',
        data: {
        },
        dragOver: function() {
            console.log('Over!');
            jQuery('#dropzone').css({
                'border': '4px solid #006600',
                'width': '160px',
                'background': '#009900'
            });
        },
        dragLeave: function() {
            console.log('Out!');
            jQuery('#dropzone').css({});
        },
        drop: function() {
            console.log('Dropped!');
        },
        uploadStarted: function(i, file, len) {
            console.log('Upload started');
        },
        uploadFinished: function(i, file, len) {
            console.log('Upload finished');
        },
    });
    
    this.sidebar_html = html;
};
