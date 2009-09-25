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

var settings = {};

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
    settings.darkRead = data.darkRead;
    settings.lightRead = data.lightRead;
    settings.lightNew = data.lightNewReplies;
    settings.darkNew = data.darkNewReplies;
    settings.username = data.username;
    settings.userQuote = data.userQuote;
	settings.youtubeHighlight = data.youtubeHighlight;
    settings.hideAdvertisements = data.hideAdvertisements;
    settings.hideFooterLinks = data.hideFooterLinks;
    settings.hideHeaderLinks = data.hideHeaderLinks;
    settings.displayNewPostsFirst = data.displayNewPostsFirst;
	settings.replaceImages = data.replaceImages;
	settings.inlineVideo = data.inlineVideo;
	settings.replaceLinksWithImages = 'true';
    // Update the styles now that we have
    // the settings
    updateStyling();
	if (settings.inlineVideo == 'true') {
		inlineYoutubes();
	}
});

// Request the username from the extension UI
port.postMessage({
    'message': 'GetPageSettings'
});

// Since we have to wait to receive the settings from the extension,
// stash the styling logic in it's own function that we can call
// once we're ready
function updateStyling() {
    // If a post has the user quoted, highlight it a pleasant green
    jQuery('.bbc-block h4').each(function() {
        if (jQuery(this).html() == settings.username + ' posted:') {
            jQuery(this).parent().css("background-color", settings.userQuote);
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

        if (!newPosts && settings.displayNewPostsFirst == 'true') {
            var currentThread = jQuery(this);

            currentThread.parent().append(currentThread);
        }
	
    	// If the thread has new posts, display the green shade,
    	// otherwise show the blue shade
    	var darkShade = (newPosts) ? settings.darkNew : settings.darkRead;
    	var lightShade = (newPosts) ? settings.lightNew : settings.lightRead;

    	// Thread icon, author, view count, and last post
    	jQuery(this).children('td.icon, td.author, td.views, td.lastpost').each(function() {
    		jQuery(this).css({ "background-color" : darkShade, 
    						   "background-image" : "url('" + chrome.extension.getURL("images/") + "gradient.png')",
    						   "background-repeat" : "repeat-x"
    						 });
    	});

    	// Thread title, replies, and rating
    	jQuery(this).find('td.title, td.replies, td.rating').each(function() {
    		jQuery(this).css({ "background-color" : lightShade, 
    						   "background-image" : "url('" + chrome.extension.getURL("images/") + "gradient.png')",
    						   "background-repeat" : "repeat-x"
    						 });
    	});

    	// Display number of new replies for each thread
    	jQuery(this).find('td.replies').each(function() {
    		// Add in number of new replies
    		if (newPostCount != 0) {
    			var currentHtml = jQuery(this).html();
    
    			// Strip HTML tags
    			newPostCount = parseInt(newPostCount.replace(/(<([^>]+)>)/ig, ""));
    			// Set the HTML value
    			jQuery(this).html(currentHtml + "<br /><div style='font-size: 12px;'>(" + newPostCount + ")</div>");
    		}
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
    
    // If we need to, move all unseen posts to the end of the list
    if (settings.displayNewPostsFirst =='true') {
        jQuery('tr.thread').each(function() {
            if (jQuery(this).attr('class') == 'thread') {
                var currentThread = jQuery(this);

                currentThread.parent().append(currentThread);
            }
        });
    }   

    
    // Hide header/footer links
    if (settings.hideHeaderLinks == 'true') {
        jQuery('div#globalmenu').each(function() {
            jQuery(this).html('');
            jQuery(this).css('height', '0px');
        });

        jQuery('ul#nav_purchase').each(function() {
            jQuery(this).html('');
            jQuery(this).css('height', '0px');
        });
    }

    // Hide the advertisements
    if (settings.hideAdvertisements == 'true') {
        jQuery('div.oma_pal').each(function() {
            jQuery(this).html('');
            jQuery(this).css('height', '0px');
        });

        jQuery('div#ad_banner_user').each(function() {
            jQuery(this).html('');
            jQuery(this).css('height', '0px');
        });
    }

	modifyImages();
}

function modifyImages() {

	// Replace Links with Images
	if (settings.replaceLinksWithImages == 'true') {
		jQuery('.postbody a').each(function() {
				
				var match = jQuery(this).attr('href').match('https?://(?:[-_0-9a-zA-Z]+\.)+[a-z]{2,6}(?:/[^/#?]+)+\.(?:jpe?g|gif|png|bmp)');
				if(match != null) {
					jQuery(this).after("<img src='" + match[0] + "' />");
					jQuery(this).remove();
				}
		});
	}

	// Replace inline Images with Links
	if (settings.replaceImages == 'true') {
		jQuery('.postbody img').each(function() {
			var source = jQuery(this).attr('src');
			jQuery(this).after("<a href='" + source + "'>" + source + "</a>");
			jQuery(this).hide();
		});
	}


}

function inlineYoutubes() {
	//sort out youtube links
	jQuery('.postbody a[href*="youtube.com"]').each(function() {
			jQuery(this).css("background-color", settings.youtubeHighlight).addClass("salr-video");
	});
	
	jQuery(".salr-video").toggle(function(){ 
			var match = jQuery(this).attr('href').match(/^http\:\/\/((?:www|[a-z]{2})\.)?youtube\.com\/watch\?v=([-_0-9a-zA-Z]+)/); //get youtube video id
			var videoId = match[2];

			jQuery(this).after("<p><embed class = 'salr-player' /></p>"); //make new embed for video
			jQuery(".salr-player").attr("id",videoId);
			jQuery(".salr-player").attr("src","http://www.youtube.com/v/" + videoId);
			jQuery(".salr-player").attr("width","450");
			jQuery(".salr-player").attr("height","370");
			jQuery(".salr-player").attr("type","application/x-shockwave-flash");
			jQuery(".salr-player").attr("wmode","transparent");

			return false;
		},
		function() {
			// second state of toggle destroys player. should add a check for player existing before 
            // destroying it but seing as it's the second state of a toggle i'll leave it for now. 
			jQuery(this).next().remove();
		}
	);
}



   
