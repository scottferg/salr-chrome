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
var emotes = new Array();

function EmoteParser(observer) {
    this.emote_url = "http://forums.somethingawful.com/misc.php"
    this.observer = observer;

    this.construct()
}

EmoteParser.prototype.construct = function() {
     var that = this;

     jQuery.get(this.emote_url, { action: 'showsmilies' },
       function(response) {
           that.parseResponse(response)
       }
    );
};

EmoteParser.prototype.parseResponse = function(response) {
    var that = this;
    var index = 0;

    jQuery('li.smilie', response).each(function() {
        var emote = jQuery('div.text', this).first().html();
        var image = jQuery('img', this).first().attr('src');
        var title = 'emote-' + index;

        emotes[title] = {'emote': emote, 'image': image};    

        index++;
    });

    this.observer.notify(emotes);
};

EmoteParser.prototype.getEmotes = function() {
    return emotes;
};
