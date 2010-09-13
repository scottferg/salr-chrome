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

function PreviewParser(post_text, emote_list) {
    this.post_text = post_text;
    this.emote_list = emote_list;
    
    this.parseSmilies();
    this.parseBBCodes();
    this.parseQuotes();
    this.parseImages();
    this.parseFormatting();
    this.parseCodeblocks();
}

PreviewParser.prototype.fetchResult = function() {
    return this.post_text;
};

PreviewParser.prototype.parseSmilies = function() {
    for (var index in this.emote_list) {
        var title = this.emote_list[index].emote;
        var img = this.emote_list[index].image;

        if (this.post_text.indexOf(title) != -1) {
            this.post_text = this.post_text.replace(title, '<img src="' + img + '" title="' + title + '" border="0" alt="" />');
        }
    }
};

PreviewParser.prototype.parseBBCodes = function() {
    this.post_text = parseBBCode(this.post_text);
};

PreviewParser.prototype.parseQuotes = function() {
    var quote_re = /\[quote\="?(.*?)"?\](.*?)\[\/quote\]/g;
    var quote_format = '<div style="margin: 0px 6px;" class="bbc-block"><h4>$1 posted:</h4><blockquote>$2</blockquote></div>'

    this.post_text = this.post_text.replace(quote_re, quote_format);
};

PreviewParser.prototype.parseImages = function() {
    var image_re = /\[img\](.*?)\[\/img\]/g;
    var thumb_image_re = /\[timg\](.*?)\[\/timg\]/g;
    var image_format = '<img src="$1" />'
    var thumb_image_format = '<img class="timg loading" src="$1" />'

    this.post_text = this.post_text.replace(image_re, image_format);
    this.post_text = this.post_text.replace(thumb_image_re, thumb_image_format);
};

PreviewParser.prototype.parseFormatting = function() {
    var re = [
        /\[spoiler\](.*?)\[\/spoiler\]/g,
        /\[fixed\](.*?)\[\/fixed\]/g,
        /\[super\](.*?)\[\/super\]/g,
        /\[sub\](.*?)\[\/sub\]/g,
        /\[email\](.*?)\[\/email\]/g,
    ];

    var format = [
        '<span class="bbc-spoiler" onmouseover="this.style.color=\'#FFFFFF\';"' +
                                                 'onmouseout="this.style.color=this.style.backgroundColor=\'#000000\'"' +
                                                 'style="background-color: rgb(0, 0, 0); color: rgb(0, 0, 0);">$1</span>',
        '<tt class="bbc">$1</tt>',
        '<sup>$1</sup>',
        '<sub>$1</sub>',
        '<a href="mailto:$1">$1</a>',
    ];

    for (var index in re) {
        this.post_text = this.post_text.replace(re[index], format[index]);
    }
};

PreviewParser.prototype.parseCodeblocks = function() {
    var re = [
        /\[pre\](.*?)\[\/pre\]/g,
        /\[code\](.*?)\[\/code\]/g,
        /\[php\](.*?)\[\/php\]/g,
    ];

    var format = [
        '<div class="bbc-block pre"><h5>pre:</h5><pre>$1</pre></div>',
        '<div class="bbc-block code"><h5>code:</h5><code>$1</code></div>',
        '<div class="bbc-block php"><h5>php:</h5><code>$1</code></div>',
    ];

    for (var index in re) {
        this.post_text = this.post_text.replace(re[index], format[index]);
    }
};
