/*
 * Default text - jQuery plugin for html5 dragging files from desktop to browser
 *
 * Author: Weixi Yen
 *
 * Email: [Firstname][Lastname]@gmail.com
 * 
 * Copyright (c) 2010 Resopollution
 * 
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.github.com/weixiyen/jquery-filedrop
 *
 * Version:  0.1.0
 *
 * Features:
 *      Allows sending of extra parameters with file.
 *      Works with Firefox 3.6+
 *      Future-compliant with HTML5 spec (will work with Webkit browsers and IE9)
 * Usage:
 * 	See README at project homepage
 *
 */
(function($){
    
	var opts = {},
		default_opts = {
			url: '',
			refresh: 1000,
			paramname: 'userfile',
			maxfiles: 25,
			maxfilesize: 1, // MBs
			data: {},
			drop: empty,
			dragEnter: empty,
			dragOver: empty,
			dragLeave: empty,
			docEnter: empty,
			docOver: empty,
			docLeave: empty,
			error: function(err, file){alert(err);},
			uploadStarted: empty,
			uploadFinished: empty,
			progressUpdated: empty,
			speedUpdated: empty
		},
		errors = ["BrowserNotSupported", "TooManyFiles", "FileTooLarge"],
		doc_leave_timer,
		stop_loop = false;

	$.fn.filedrop = function(options) {
		opts = $.extend( {}, default_opts, options );
		
		this.get(0).addEventListener("drop", drop, true);
		this.bind('dragenter', dragEnter).bind('dragover', dragOver).bind('dragleave', dragLeave);
		
		document.addEventListener("drop", docDrop, true);
		$(document).bind('dragenter', docEnter).bind('dragover', docOver).bind('dragleave', docLeave);
	};
     
	function drop(e) {
		opts.drop(e);

        // Prepare the file for upload before sending it
        // to the extension for the actual upload
        var reader = new FileReader();
        reader.index = 0;
        reader.file = e.dataTransfer.files[0];
        reader.len = e.dataTransfer.files.length;

        reader.onloadend = function(e) {
            postMessage({
                'message': 'UploadWaffleImages',
                'file': e.target
            });
        };

        reader.readAsBinaryString(e.dataTransfer.files[0]);
        
		e.preventDefault();
		return false;
	}
    
	function dragEnter(e) {
		clearTimeout(doc_leave_timer);
		e.preventDefault();
		opts.dragEnter(e);
	}
	
	function dragOver(e) {
		clearTimeout(doc_leave_timer);
		e.preventDefault();
		opts.docOver(e);
		opts.dragOver(e);
	}
	 
	function dragLeave(e) {
		clearTimeout(doc_leave_timer);
		opts.dragLeave(e);
		e.stopPropagation();
	}
	 
	function docDrop(e) {
		e.preventDefault();
		opts.docLeave(e);
		return false;
	}
	 
	function docEnter(e) {
		clearTimeout(doc_leave_timer);
		e.preventDefault();
		opts.docEnter(e);
		return false;
	}
	 
	function docOver(e) {
		clearTimeout(doc_leave_timer);
		e.preventDefault();
		opts.docOver(e);
		return false;
	}
	 
	function docLeave(e) {
		doc_leave_timer = setTimeout(function(){
			opts.docLeave(e);
		}, 200);
	}
	 
	function empty(){}
     
})(jQuery);
