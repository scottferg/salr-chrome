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

/**
 * Event listener for when a user enters their username within
 * the extension UI.  Currently this only works when you're
 * viewing forums.somethingawful.com since we don't have any
 * events that can be fired on a localStorage event that occurs
 * within the extension.
 *
 */
var port = chrome.extension.connect();

port.onMessage.addListener(function(data) {
    // Set the localStorage at the forums.somethingawful.com domain
    localStorage.setItem('username', data.username);
});

// Request the username from the extension UI
port.postMessage({
    'message': 'GetUsername'
});

// If a post has the user quoted, highlight it a pleasant green
jQuery('.bbc-block h4').each(function() {
    var username = localStorage.getItem('username');

    console.log(username);
    if (jQuery(this).html() == username + ' posted:') {
        jQuery(this).parent().css("background-color", "#a2cd5a");
    }
});

var newPosts = false;
var newPostCount = 0;

// Iterate over each .thread .seen td element.  This is necessary
// so we can track each thread's designated color (read/not read)
jQuery('tr.thread.seen').each(function() {
	// Re-style the "mark unread" link
	jQuery(this).find('a.x').each(function() {
		// Set the image styles
		jQuery(this).css("background", "none");
		jQuery(this).css("background-image", "url('" + chrome.extension.getURL("images/") + "unvisit.png')");
		jQuery(this).css("height", "16px");
		jQuery(this).css("width", "14px");

		// Remove the 'X' from the anchor tag
		jQuery(this).html('');
	});

	// Re-style the new post count link
	jQuery(this).find('a.count').each(function() {
		// If we find an a.count, then we have new posts
		newPosts = true;
		newPostCount = jQuery(this).html();

		// Remove the left split border
		jQuery(this).css("border-left", "none");

		// Resize, shift, and add in the background image
		jQuery(this).css("width", "7px");
		jQuery(this).css("height", "16px");
		jQuery(this).css("padding-right", "11px");
		jQuery(this).css("background-image", "url('" + chrome.extension.getURL("images/") + "lastpost.png')");
		
		// Remove the count from the element
		jQuery(this).html('');
	});
	
	// If the thread has new posts, display the green shade,
	// otherwise show the blue shade
	var darkShade = (newPosts) ? "#99CC99" : "#6699CC";
	var lightShade = (newPosts) ? "#CCFFCC" : "#99CCFF";

	// Thread icon
	jQuery(this).children('td.icon').each(function() {
		jQuery(this).css({ "background-color" : darkShade, 
						   "background-image" : "url('" + chrome.extension.getURL("images/") + "gradient.png')",
						   "background-repeat" : "repeat-x"
						 });
	});

	// Thread title
	jQuery(this).find('td.title').each(function() {
		jQuery(this).css({ "background-color" : lightShade, 
						   "background-image" : "url('" + chrome.extension.getURL("images/") + "gradient.png')",
						   "background-repeat" : "repeat-x"
						 });
	});

	// Thread author
	jQuery(this).find('td.author').each(function() {
		jQuery(this).css({ "background-color" : darkShade, 
						   "background-image" : "url('" + chrome.extension.getURL("images/") + "gradient.png')",
						   "background-repeat" : "repeat-x"
						 });
	});

	// Thread reply count
	jQuery(this).find('td.replies').each(function() {
		jQuery(this).css({ "background-color" : lightShade, 
						   "background-image" : "url('" + chrome.extension.getURL("images/") + "gradient.png')",
						   "background-repeat" : "repeat-x"
						 });

		// Add in number of new replies
		if (newPostCount != 0) {
			var currentHtml = jQuery(this).html();

			// Strip HTML tags
			newPostCount = parseInt(newPostCount.replace(/(<([^>]+)>)/ig, ""));
			// Set the HTML value
			jQuery(this).html(currentHtml + "<br /><div style='font-size: 12px;'>(" + newPostCount + ")</div>");
		}
	});

	// Thread view count
	jQuery(this).find('td.views').each(function() {
		jQuery(this).css({ "background-color" : darkShade, 
						   "background-image" : "url('" + chrome.extension.getURL("images/") + "gradient.png')",
						   "background-repeat" : "repeat-x"
						 });
	});

	// Thread rating
	jQuery(this).find('td.rating').each(function() {
		jQuery(this).css({ "background-color" : lightShade, 
						   "background-image" : "url('" + chrome.extension.getURL("images/") + "gradient.png')",
						   "background-repeat" : "repeat-x"
						 });
	});

	// Last post
	jQuery(this).find('td.lastpost').each(function() {
		jQuery(this).css({ "background-color" : darkShade, 
						   "background-image" : "url('" + chrome.extension.getURL("images/") + "gradient.png')",
						   "background-repeat" : "repeat-x"
						 });
	});

	// Eliminate last-seen styling
	jQuery(this).find('.lastseen').each(function() {
		jQuery(this).css("background", "none");
		jQuery(this).css("border", "none");
	});

    // Reset post counts
	newPosts = false;
	newPostCount = 0;
});
