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

function QuickReplyBox() {
    this.create();
}

QuickReplyBox.prototype.create = function(username, quote) {

    // window.open("chrome-extension://lbeflkohppahphcnpjfgffckhcmgelfo/quick-reply.html", "Quick Reply","menubar=no,width=720,height=425,toolbar=no");
    var html = '<div id="quick-reply"> ' + 
                '   <form enctype="multipart/form-data" action="newreply.php" name="vbform" method="POST" onsubmit="return validate(this)">' +
                '       <input type="hidden" name="action" value="postreply">' + 
                '       <input type="hidden" name="threadid" value="' + findThreadID() + '">' + 
                '       <input type="hidden" name="formkey" value="37ef682d135b13b5e76d357a8e9e8cc2">' + 
                '       <input type="hidden" name="form_cookie" value="postreply">' + 
                '       <input type="hidden" name="parseurl" value="yes">' + 
                '       <input type="hidden" name="bookmark" value="yes">' + 
                '       <div id="title-bar">' + 
                '           Quick Reply' + 
                '       </div>' +
                '       <div id="post-input-field">' +
                '<textarea name="message" style="width: 520px;" rows="15" size="10" id="post-message">' +
                '</textarea>' +
                '       </div>' +
                '       <input type="submit" class="bginput" name="submit" value="Submit Reply">' + 
                '       <input type="submit" class="bginput" name="preview" value="Preview Reply">' + 
                '       <a id="dismiss-quick-reply">Dismiss</a>' +
                '   </form>' +
               '</div>';

    // Only append it if we haven't already
    if (jQuery('#quick-reply').length == 0) {
        jQuery('body').append(html);
    }

    jQuery('#dismiss-quick-reply').click(this.hide);

    jQuery('#quick-reply').css({
        'width': '560px',
        'display': 'block',
        'float': 'left',
        'position': 'fixed',
        'left': '25%',
        'bottom': '0px',
        'margin': '0 auto',
        'padding': '20px',
        'border': 'solid 1px #999',
        'background': '-webkit-gradient(linear, left top, left bottom, from(rgb(255,255,255)), to(rgb(230,230,230)))',
        '-webkit-box-shadow': '-1px -1px 12px rgba(0,0,0,0.25)',
        '-webkit-border-top-left-radius': '6px',
        '-webkit-border-top-right-radius': '6px',
    });

    this.hide();
};

QuickReplyBox.prototype.appendQuote = function(username, quote) {

    username = username || false;
    quote = quote || false;

    var quote_string = '';

    if (username && quote) {
        var current_message = jQuery('#post-message').html();

        if (current_message.length > 0) {
            quote_string += '\n\n';
        }

        quote_string += '[quote="' + username + '"]\n' + jQuery.trim(quote) + '\n[/quote]';

        jQuery('#post-message').html(current_message + quote_string);
    }
};

QuickReplyBox.prototype.show = function() {
    jQuery('#quick-reply').show();
};

QuickReplyBox.prototype.hide = function() {
    jQuery('#quick-reply').hide();
};
