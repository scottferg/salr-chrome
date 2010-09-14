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

function ImageUploader(url, params) {
    this.dashdash = '--';
    this.crlf = '\r\n';
    this.boundary = '------multipartformboundary' + (new Date).getTime(),

    this.params = params;
    this.url = url;

    this._listeners = {};
}

ImageUploader.prototype.bind = function(event, subject) {
    if (typeof this._listeners[event] == "undefined") {
        this._listeners[event] = [];
    }

    this._listeners[event].push(subject);
};

ImageUploader.prototype.fireEvent = function(event) {
    if (typeof event == "string") {
        event = {
            type: event
        };
    }

    if (!event.target) {
        event.target = this;
    }

    if (this._listeners[event.type] instanceof Array) {
        var listeners = this._listeners[event.type];

        for (var index in listeners) {
            listeners[index].call(this, event);
        }
    }
};

ImageUploader.prototype.addParam = function(key, value) {
    this.params[key] = value;
};

ImageUploader.prototype.upload = function(image, paramname) {
    var that = this;

    var xhr = new XMLHttpRequest();
    var upload = xhr.upload;

    upload.onprogress = function(event) {
        that.fireEvent({
            type: 'onProgress',
            loaded: event.loaded,
            total: event.total
        });
    };

    // TODO: There needs to be a better way to send parameters
    // in the POST header but FormData seems to drop the file
    // when appending it.
    var parameter_url = this.url + "?";

    for (var key in this.params) {
        parameter_url += key + "=" + this.params[key];
    }

    console.log(parameter_url);
    xhr.open("POST", parameter_url, true);
    xhr.setRequestHeader("Content-Type", "multipart/form-data");

    console.log(image);
    
    xhr.send(image);  

    xhr.onload = function() { 
        console.log(xhr.responseText);
        var result = {};

        switch (xhr.status) {
            case 500:
            case 400:
                result = {
                    type: 'onError',
                    response: xhr.responseText
                };
                break;
            default:
                result = { 
                    type: 'onComplete',
                    response: xhr.responseText
                };
                break;
        }

        that.fireEvent(result);
    };
};

ImageUploader.prototype.uploadUrl = function(image_url, paramname) {
    var that = this;

    this.params[paramname] = image_url;

    jQuery.post(this.url,
               this.params,
               function(response) {
                   that.fireEvent({
                       type: 'onComplete',
                       response: response 
                   });
               });
};
