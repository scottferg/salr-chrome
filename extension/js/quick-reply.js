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

// http://forums.somethingawful.com/newreply.php?action=newreply&postid=379818033
// http://forums.somethingawful.com/newreply.php?s=&action=newreply&threadid=3208437

function QuickReplyBox(forum_post_key, base_image_uri, bookmark) {
    this.forum_post_key = forum_post_key;
    this.base_image_uri = base_image_uri;
    this.bookmark = bookmark;
    this.reply_url = 'http://forums.somethingawful.com/newreply.php';
    this.edit_url = 'http://forums.somethingawful.com/editpost.php';

    this.quickReplyState = {
        expanded: false,
        visible: false,
        sidebar_visible: false,
        topbar_visible: false,
        first_quote: true
    };

    // TODO: Pull these from the extension, cache them there
    this.bbcodes = new Array();

    this.bbcodes['url'] = 'url';
    this.bbcodes['email'] = 'email';
    this.bbcodes['img'] = 'img';
    this.bbcodes['timg'] = 'timg';
    this.bbcodes['video'] = 'video';
    this.bbcodes['b'] = 'b';
    this.bbcodes['s'] = 's';
    this.bbcodes['u'] = 'u';
    this.bbcodes['i'] = 'i';
    this.bbcodes['spoiler'] = 'spoiler';
    this.bbcodes['fixed'] = 'fixed';
    this.bbcodes['super'] = 'super';
    this.bbcodes['sub'] = 'sub';
    this.bbcodes['size'] = 'size';
    this.bbcodes['color'] = 'color';
    this.bbcodes['quote'] = 'quote';
    this.bbcodes['pre'] = 'pre';
    this.bbcodes['code'] = 'code';
    this.bbcodes['php'] = 'php';
    this.bbcodes['list'] = 'list';

    this.create();
}

QuickReplyBox.prototype.create = function(username, quote) {

    var that = this;
    // Begin fetching and parsing the emotes as soon as we create the quick-reply
    var emote_parser = new EmoteParser(this);

    // window.open("chrome-extension://lbeflkohppahphcnpjfgffckhcmgelfo/quick-reply.html", "Quick Reply","menubar=no,width=720,height=425,toolbar=no");
    var html = '<div id="side-bar">' +
                '   <div id="sidebar-list">' +
                '   </div>' +
                '</div>' +
                '<div id="top-bar">' +
                '   <div id="topbar-preview">' +
                '   </div>' +
                '</div>' + 
                '<div id="quick-reply"> ' + 
                '   <form id="quick-reply-form" enctype="multipart/form-data" action="newreply.php" name="vbform" method="POST" onsubmit="return validate(this)">' +
                '       <input id="quick-reply-action" type="hidden" name="action" value="postreply">' + 
                '       <input type="hidden" name="threadid" value="' + findThreadID() + '">' + 
                '       <input id="quick-reply-postid" type="hidden" name="postid" value="">' + 
                '       <input type="hidden" name="formkey" value="' + this.forum_post_key + '">' + 
                '       <input type="hidden" name="form_cookie" value="formcookie">' + 
                '       <div id="title-bar">' + 
                '           Quick Reply' + 
                '       </div>' +
                '       <div id="view-buttons">' + 
                '          <a id="toggle-view"><img id="quick-reply-rollbutton" class="quick-reply-image" src="' + this.base_image_uri + "quick-reply-rolldown.gif" + '"></a>' +
                '          <a id="dismiss-quick-reply"><img class="quick-reply-image" src="' + this.base_image_uri + "quick-reply-close.gif" + '"></a>' +
                '       </div>' +
                '       <div id="smiley-menu" class="sidebar-menu">' +
                '           <img src="' + this.base_image_uri + "quick-reply-smiley.gif" + '" />' +
                '       </div>' +
                '       <div id="tag-menu" class="sidebar-menu">' +
                '           <img src="' + this.base_image_uri + "quick-reply-tags.gif" + '" />' +
                '       </div>' +
                /************************WAFFLE IMAGES************************
                '       <div id="waffle-images-menu" class="sidebar-menu">' +
                '           <img src="' + this.base_image_uri + "quick-reply-waffle.gif" + '" />' +
                '       </div>' +
                *************************************************************/
                '       <div id="post-input-field">' +
                '<textarea name="message" rows="18" size="10" id="post-message">' +
                '</textarea>' +
                '       </div>' +
                '       <div id="post-options">' +
                '           <label>' +
                '           <input type="checkbox" name="parseurl" value="yes" checked>' +
                '              <span class="post-options">Parse URLs</span>' +
                '           </input>' + 
                '           </label>' + 
                '           <label>' +
                '           <input type="checkbox" id="quickReplyBookmark" name="bookmark" value="yes">' + 
                '              <span class="post-options">Bookmark thread</span>' +
                '           </input>' + 
                '           </label>' + 
                '           <label>' +
                '           <input type="checkbox" name="disablesmilies" value="yes">' + 
                '               <span class="post-options">Disable smilies</span>' +
                '           </input>' + 
                '           </label>' + 
                '           <label>' +
                '           <input type="checkbox" name="signature" value="yes">' + 
                '               <span class="post-options">Show signature</span>' +
                '          </input>' + 
                '           </label>' + 
                '           <label>' +
                '           <input type="checkbox" id="live-preview" value="yes">' + 
                '               <span class="post-options">Show live preview</span>' +
                '          </input>' + 
                '           </label>' + 
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

    if (this.bookmark) {
        jQuery('input#quickReplyBookmark').attr('checked', true);
    }

    jQuery('#dismiss-quick-reply').click(function() {
        that.hide();
    });
    
    jQuery('div#quick-reply').addClass('modal');

    jQuery('#title-bar').click(function() {
        that.toggleView();
    });
    jQuery('#toggle-view').click(function() {
        that.toggleView();
    });

    jQuery(window).resize(function() {
        var quick_reply_position = jQuery('#quick-reply').offset().left;
        var offset = 350;

        if (that.quickReplyState.sidebar_visible) {
            offset += 200;
        }

        jQuery('#side-bar').css('left', (quick_reply_position + offset) + 'px');
    });

    var quick_reply_position = jQuery('#quick-reply').offset().left;

    jQuery('#side-bar').css('left', (quick_reply_position + 350) + 'px');

    jQuery('.sidebar-menu').each(function() {
        jQuery(this).click(function() {
            that.toggleSidebar(jQuery(this));
        });
    });

    jQuery('#live-preview').change(function() {
        that.toggleTopbar();
    });

    jQuery('div.sidebar-menu-item').live('click', function() {
        var selected_item = jQuery('div.menu-item-code', this).first().html();

        if (jQuery(this).is('.bbcode')) {
            var text_area = jQuery('textarea#post-message');
            var selection = text_area.getSelection();

            if (selection.text) {
                var replacement_text = '[' + that.bbcodes[selected_item] + ']' + selection.text + '[/' + that.bbcodes[selected_item] + ']';
        
                text_area.replaceSelection(replacement_text, true);
            } else {
                var replacement_text = '[' + that.bbcodes[selected_item] + '][/' + that.bbcodes[selected_item] + ']';

                that.appendText(replacement_text);
            }
        } else {
            that.appendText(selected_item);
        }
    });

    this.sidebar_html = '<img class="loading-spinner" src="' + this.base_image_uri + 'loading-spinner.gif" />';
    this.emotes = null;
    
    this.fetchFormCookie(findThreadID());
    jQuery('#side-bar').hide();
    jQuery('#quick-reply').hide();
};

QuickReplyBox.prototype.show = function() {
    this.quickReplyState.expanded = true;
    jQuery(document).trigger('disableSALRHotkeys');
    jQuery('#quick-reply').show("slow");
	jQuery('#post-message').focus().putCursorAtEnd();
};

QuickReplyBox.prototype.hide = function() {
    jQuery('#side-bar').first().hide();
    jQuery('#top-bar').first().hide();
    jQuery('#live-preview').attr('checked', '');
    if (salr_client.pageNavigator) {
        salr_client.pageNavigator.display();
    }
    jQuery(document).trigger('enableSALRHotkeys');
    jQuery('#quick-reply').hide("slow");
    jQuery('#post-message').val('');

    // Return to quick reply mode
    jQuery('div#title-bar').text('Quick Reply');
    jQuery('form#quick-reply-form').attr('action', 'newreply.php');
    jQuery('input#quick-reply-action').val('postreply');
    jQuery('input#quick-reply-postid').val('');

    this.quickReplyState.expanded = false;
    this.quickReplyState.first_quote = true;
};

QuickReplyBox.prototype.fetchFormCookie = function(threadid) {
    var that = this;

    var parseFormCookie = function(html) {
        return jQuery('input[name="form_cookie"]', html).val();
    };

    jQuery.get(this.reply_url,
               {
                   action: 'newreply',
                   threadid: threadid
               },
               function(response) {
                   that.notifyReplyReady(parseFormCookie(response));
               });
};

QuickReplyBox.prototype.appendText = function(text) {
    var current_message = jQuery('#post-message').val();

    jQuery('#post-message').val(current_message + text);

    var parser = new PreviewParser(jQuery('#post-message').val(), this.emotes);
    jQuery('#topbar-preview').html(parser.fetchResult());
};

QuickReplyBox.prototype.prependText = function(text) {
    var current_message = jQuery('#post-message').val();

    jQuery('#post-message').val(text + current_message);

    var parser = new PreviewParser(jQuery('#post-message').val(), this.emotes);
    jQuery('#topbar-preview').html(parser.fetchResult());
};

QuickReplyBox.prototype.appendQuote = function(postid) {
    var that = this;

    // Call up SA's quote page
    jQuery.get(this.reply_url,
                {
                    action: 'newreply',
                    postid: postid
                },
                function(response) {
                    // Pull quoted text from reply box
                    var textarea = jQuery(response).find('textarea[name=message]')
                    var quote = '';
                    if (textarea.length)
                        quote = textarea.val();

                    if (that.quickReplyState.first_quote) {
                        that.prependText(quote);
                        that.quickReplyState.first_quote=false;
                    } else {
                        that.appendText(quote);
                    }
                });
};

QuickReplyBox.prototype.editPost = function(postid) {
    var that = this;

    // Call up SA's quote page
    jQuery.get(this.edit_url,
                {
                    action: 'editpost',
                    postid: postid
                },
                function(response) {
                    // Pull quoted text from reply box
                    var textarea = jQuery(response).find('textarea[name=message]')
                    var edit = '';
                    if (textarea.length)
                        edit = textarea.val();
                    jQuery('#post-message').val(edit);
                });

    jQuery('div#title-bar').text('Quick Edit');
    jQuery('form#quick-reply-form').attr('action', 'editpost.php');
    jQuery('input#quick-reply-action').val('updatepost');
    jQuery('input#quick-reply-postid').val(postid);
};

QuickReplyBox.prototype.toggleView = function() {

    var that = this;
    var quick_reply_box = jQuery(".modal").first();
    var min = '18px';
    var max = '390px';
    var imgId = jQuery("img#quick-reply-rollbutton").first();

    if(this.quickReplyState.expanded) {
        var hideBox = function() {
            jQuery('#side-bar').first().hide();
            jQuery('#top-bar').first().hide();
            jQuery('#live-preview').attr('checked', '');
            quick_reply_box.animate( { height: min } );
            (imgId).attr("src", that.base_image_uri + "quick-reply-rollup.gif");
            that.quickReplyState.expanded = false;
        };

        // Keep trying to close the sidebar until we're ready
        if(this.quickReplyState.sidebar_visible) {
            jQuery('#side-bar').animate( { left: '-=200px' }, 500, function() {
                that.quickReplyState.sidebar_visible = null;
                if (salr_client.pageNavigator) {
                    salr_client.pageNavigator.display();
                }

                that.toggleView();
            });
        } else if (this.quickReplyState.topbar_visible) {
            jQuery('#top-bar').animate( { bottom: '-=320px' }, 500, function() {
                that.quickReplyState.topbar_visible = false;
                that.toggleView();
            });
        } else {
            hideBox();
        }
    } else {
        quick_reply_box.animate( { height: max }, 500, function() {
                // Only display the sidebar after the box is shown
                jQuery('#side-bar').first().show();
        });
        (imgId).attr("src", this.base_image_uri + "quick-reply-rolldown.gif");
        jQuery('#post-message').focus().putCursorAtEnd();
        this.quickReplyState.expanded = true;
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
    var that = this;

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
    if ((this.quickReplyState.sidebar_visible) && (this.quickReplyState.sidebar_visible == element.attr('id'))) {
        side_bar.animate( { left: '-=200px' } );
        if (salr_client.pageNavigator) {
            salr_client.pageNavigator.display();
        }
        this.quickReplyState.sidebar_visible = false;
    } else if ((this.quickReplyState.sidebar_visible) && (this.quickReplyState.sidebar_visible != element.attr('id'))) {
        side_bar.animate( { left: '-=200px' }, 500, function() {
            populate_method.call(that);
            side_bar.animate( { left: '+=200px' } );
            that.quickReplyState.sidebar_visible = element.attr('id');
        });
    } else {
        populate_method.call(this);
        side_bar.animate( { left: '+=200px' } );
        if (salr_client.pageNavigator) {
            salr_client.pageNavigator.hide();
        }
        this.quickReplyState.sidebar_visible = element.attr('id');
    }

};

QuickReplyBox.prototype.toggleTopbar = function() {
    top_bar = jQuery('#top-bar');

    if (!top_bar.is(':visible')) {
        top_bar.css('display', 'block');
    }
    
    if (this.quickReplyState.topbar_visible) {
        top_bar.animate( { bottom: '-=320px' } );
        if (salr_client.pageNavigator) {
            salr_client.pageNavigator.display();
        }
        this.quickReplyState.topbar_visible = false;
    } else {
        top_bar.animate( { bottom: '+=320px' } );
        this.quickReplyState.topbar_visible = true;
    }
};

QuickReplyBox.prototype.notify = function(emotes) {
    var that = this;
    this.emotes = emotes;

    jQuery('#post-message').keyup(function() {
        var parser = new PreviewParser(jQuery(this).val(), emotes);
        jQuery('#topbar-preview').html(parser.fetchResult());
    });

    this.setEmoteSidebar();
};

QuickReplyBox.prototype.notifyReplyReady = function(form_cookie) {
    jQuery('input[name="form_cookie"]').attr('value', form_cookie);
};

QuickReplyBox.prototype.setEmoteSidebar = function() {
    var html = '';

    for (var emote in this.emotes) { 
        html += '<div class="sidebar-menu-item emote">' +
                '   <div><img src="' + this.emotes[emote].image + '" /></div>' +
                '   <div class="menu-item-code">' + this.emotes[emote].emote + '</div>' +
                '</div>';
    }

    jQuery('#sidebar-list').html(html);

    this.sidebar_html = html;
};

QuickReplyBox.prototype.setBBCodeSidebar = function() {
    var html = '';

    for (var code in this.bbcodes) { 
        html += '<div class="sidebar-menu-item bbcode">' +
                '   <div class="menu-item-code">' + code + '</div>' +
                '</div>';
    }

    jQuery('#sidebar-list').html(html);

    this.sidebar_html = html;
};

QuickReplyBox.prototype.setWaffleImagesSidebar = function() {
    html = '<div id="dropzone">' +
           '    <h1>Drop files here</h1>' +
           '    <p>To add them as attachments</p>' +
           '    <input type="file" multiple="true" id="filesUpload" />' +
           '</div>';

    jQuery('#sidebar-list').html(html);

    this.sidebar_html = html;

    $('div#dropzone').filedrop({
        url: 'http://waffleimages.com/upload',              // upload handler, handles each file separately
        paramname: 'file',          // POST parameter name used on serverside to reference file
        data: { 
            mode: 'file',           // send POST variables
            tg_format: 'xml',
        },
        error: function(err, file) {
            switch(err) {
                case 'BrowserNotSupported':
                    alert('browser does not support html5 drag and drop')
                    break;
                case 'TooManyFiles':
                    // user uploaded more than 'maxfiles'
                    break;
                case 'FileTooLarge':
                    // program encountered a file whose size is greater than 'maxfilesize'
                    // FileTooLarge also has access to the file which was too large
                    // use file.name to reference the filename of the culprit file
                    break;
                default:
                    break;
            }
        },
        maxfiles: 25,
        maxfilesize: 20,    // max file size in MBs
        dragOver: function() {
            // user dragging files over #dropzone
        },
        dragLeave: function() {
            // user dragging files out of #dropzone
        },
        docOver: function() {
            // user dragging files anywhere inside the browser document window
        },
        docLeave: function() {
            // user dragging files out of the browser document window
        },
        drop: function() {
            // user drops file
        },
        uploadStarted: function(i, file, len){
            // a file began uploading
            // i = index => 0, 1, 2, 3, 4 etc
            // file is the actual file of the index
            // len = total files user dropped
        },
        uploadFinished: function(i, file, response, time) {
            // response is the data you got back from server in JSON format.
            console.log(response);
        },
        progressUpdated: function(i, file, progress) {
            // this function is used for large files and updates intermittently
            // progress is the integer value of file being uploaded percentage to completion
        },
        speedUpdated: function(i, file, speed) {
            // speed in kb/s
        }
    });
};

QuickReplyBox.prototype.isExpanded = function() {
    return this.quickReplyState.expanded;
};

QuickReplyBox.prototype.isVisible = function() {
    return this.quickReplyState.visible;
};
