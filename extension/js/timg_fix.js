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

function timg_fix() {
	this.max_img_width = 170;
	this.max_img_height = 200;
	this.tfix = 0;
}

timg_fix.prototype = {
	init: function() {/*
		if(this.timg_fix) return;
		
		var that = this;
		jQuery('.postbody img.timg')
			.removeClass('timg peewee expanded loading complete')
			.addClass('timg-fix')
			.each(function(idx) {
				that.adjustImage(this);
			});
		
		
		timg_fix = true;*/
	},
	
	adjustImage: function(img) {/*
		// image less than max width
		if(img.naturalWidth && img.naturalWidth < this.max_img_width) {
			img.width = img.naturalWidth;
		}
		// overwidth, then overheight checks
		if(img.naturalWidth && img.naturalWidth > this.max_img_width) {
			img.width = this.max_img_width;
			jQuery(img).addClass('tf-expandable');
		} else if(img.naturalHeight && img.naturalHeight > this.max_img_height) {
			img.height = this.max_img_height;
			jQuery(img).addClass('tf-expandable');
		}*/
	}
};