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

function WaffleImagesUploader() {
    this.dashdash = '--';
    this.crlf = '\r\n';
    this.boundary = '------multipartformboundary' + (new Date).getTime(),

    this.mode = 'file';
    this.tg_format = 'xml';
    this.url = 'http://waffleimages.com/upload';

    this._listeners = {};
}

WaffleImagesUploader.prototype.bind = function(event, subject) {
    if (typeof this._listeners[event] == "undefined") {
        this._listeners[event] = [];
    }

    this._listeners[event].push(subject);
};

WaffleImagesUploader.prototype.fireEvent = function(event) {
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

WaffleImagesUploader.prototype.addParameter = function(title, param) {
    result = '';

    result += this.dashdash;
    result += this.boundary;
    result += this.crlf;
    result += 'Content-Disposition: form-data; name="' + title + '"';
    result += this.crlf;
    result += param;
    result += this.crlf;

    return result;
}

WaffleImagesUploader.prototype.getRequest = function(filename, filedata) {
    var result = '';

    result += this.addParameter('mode', this.mode);
    result += this.addParameter('mode', this.mode);
    
    
    result += this.dashdash;
    result += this.boundary;
    result += this.crlf;
    result += 'Content-Disposition: form-data; name="file"';
    result += '; filename="' + filename + '"';
    result += this.crlf;

    result += 'Content-Type: application/octet-stream';
    result += this.crlf;
    result += this.crlf; 

    result += filedata;
    result += this.crlf;

    result += this.dashdash;
    result += this.boundary;
    result += this.crlf;
    
    result += this.dashdash;
    result += this.boundary;
    result += this.dashdash;
    result += this.crlf;

    return result;
};

WaffleImagesUploader.prototype.upload = function(image) {
    var that = this;

    var xhr = new XMLHttpRequest();
    var upload = xhr.upload;
    var request = this.getRequest(image.file.name, image.result);

    upload.index = image.index;
    upload.file = image.file;
    /*
    upload.downloadStartTime = new Date().getTime();
    upload.currentStart = start_time;
    */
    upload.currentProgress = 0;
    upload.startData = 0;

    console.log('Starting to transfer');

    xhr.open("POST", this.url, true);
    xhr.setRequestHeader('content-type', 'multipart/form-data; boundary=' + this.boundary);
    xhr.send(request);  

    xhr.onload = function() { 
        var result = {};

        switch (xhr.status) {
            case 500:
                result = {
                    type: 'onError'
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
