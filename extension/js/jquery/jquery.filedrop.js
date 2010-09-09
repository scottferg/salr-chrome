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
    
	var opts = {};

	var default_opts = {
			url: '',
			paramname: 'userfile',
			data: {},
			onDrop: empty,
			onDragEnter: empty,
			onDragOver: empty,
			onDragLeave: empty,
		};

	$.fn.filedrop = function(options) {
		opts = $.extend({}, default_opts, options);
		
		this.get(0).addEventListener("drop", onDrop, true);
		this.bind('dragenter', onDragEnter);
        this.bind('dragover', onDragOver);
        this.bind('dragleave', onDragLeave);
	};
     
	function onDrop(e) {
		opts.onDrop(e);
		e.preventDefault();
		return false;
	}
    
	function onDragEnter(e) {
		e.preventDefault();
		opts.onDragEnter(e);
	}
	
	function onDragOver(e) {
		e.preventDefault();
		opts.onDragOver(e);
	}
	 
	function onDragLeave(e) {
		opts.onDragLeave(e);
		e.stopPropagation();
	}
	 
	function empty(){}
     
})(jQuery);
