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

    settings = data;
    
    // Update the styles now that we have
    // the settings
    updateStyling();
    displayBanHistoryLink();
	modifyImages();
	
	if (settings.inlineVideo == 'true') {
		inlineYoutubes();
	}
    
    if (settings.highlightFriends == 'true') {
        highlightFriendPosts();    
    }

    if (findCurrentPage() == 'forumdisplay.php' || findCurrentPage() == 'showthread.php') {
        displayPageNavigator();
        updateForumsList();
    }
    
    if (findCurrentPage() == 'usercp.php') {
        updateFriendsList();
    }
});

// Request the username from the extension UI
port.postMessage({
    'message': 'GetPageSettings'
});

function openSettings() {
    port.postMessage({'message': 'OpenSettings'});
}

// Since we have to wait to receive the settings from the extension,
// stash the styling logic in it's own function that we can call
// once we're ready
function updateStyling() {
    jQuery(window).resize(function() {
        displayPageNavigator();
    });

    // If a post has the user quoted, highlight it a pleasant green
    jQuery('.bbc-block h4').each(function() {
        if (jQuery(this).html() == settings.username + ' posted:') {
            jQuery(this).parent().css("background-color", settings.userQuote);
        }
    });

    var newPosts = false;
    var newPostCount = 0;

    // TODO: The thread highlighting is a conditionalized mess

    // Iterate over each .thread .seen td element.  This is necessary
    // so we can track each thread's designated color (read/not read)
    jQuery('tr.thread.seen').each(function() {
        if (settings.disableCustomButtons == 'false' || !settings.disableCustomButtons) {
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
        }

        // Re-style the new post count link
        jQuery(this).find('a.count').each(function() {
            // If we find an a.count, then we have new posts
            newPosts = true;
            newPostCount = jQuery(this).html();

            if (settings.disableCustomButtons == 'false' || !settings.disableCustomButtons) {
                // Remove the left split border
                jQuery(this).css("border-left", "none");

                // Resize, shift, and add in the background image
                jQuery(this).css("width", "7px");
                jQuery(this).css("height", "16px");
                jQuery(this).css("padding-right", "11px");
                jQuery(this).css("background-image", "url('" + chrome.extension.getURL("images/") + "lastpost.png')");

                // Remove the count from the element
                jQuery(this).html('');
            }
        });
        
        if (settings.disableCustomButtons == 'false' || !settings.disableCustomButtons) {
            // Eliminate last-seen styling
            jQuery(this).find('.lastseen').each(function() {
                jQuery(this).css("background", "none");
                jQuery(this).css("border", "none");
            });
        }

        // Don't do inline post counts if the user has custom jump buttons disabled
        if (settings.inlinePostCounts == 'true' && settings.disableCustomButtons == 'false') {
            jQuery(this).find('div.lastseen').each(function() {
                // Add in number of new replies
                if (newPostCount != 0) {
                    var currentHtml = jQuery(this).html();
        
                    // Strip HTML tags
                    newPostCount = parseInt(newPostCount.replace(/(<([^>]+)>)/ig, ""));
                    // Set the HTML value
                    jQuery(this).html("<div style='font-size: 12px; float: left; margin-top: 4px; padding-right: 4px;'>(" + newPostCount + ")</div>" + currentHtml);
                }
            });
        }

        if (!newPosts && settings.displayNewPostsFirst == 'true') {
            var currentThread = jQuery(this);

            currentThread.parent().append(currentThread);
        }
	
    	// If the thread has new posts, display the green shade,
    	// otherwise show the blue shade
    	var darkShade = (newPosts) ? settings.darkNewReplies : settings.darkRead;
    	var lightShade = (newPosts) ? settings.lightNewReplies : settings.lightRead;

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

        if (settings.inlinePostCounts == 'false') {
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
        }

        // Reset post counts
    	newPosts = false;
    	newPostCount = 0;
    });
	
	if(settings.displayConfigureSalr == 'true') {
		jQuery('#navigation li.first').next('li').next('li').after(" - <a id='configure' href='#'>Configure SALR</a>");
	}
	
	jQuery('#configure').click(function() {
		openSettings();
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
    
    getWidestPost();
}

function modifyImages() {

	// Replace Links with Images
	if (settings.replaceLinksWithImages == 'true') {

		var subset = jQuery('.postbody a');

		//NWS/NMS links
		if(settings.dontReplaceLinkNWS == 'true')
		{
			subset = subset.not(".postbody:has(img[title=':nws:']) a").not(".postbody:has(img[title=':nms:']) a");
		}

		//
		if(settings.dontReplaceLinkSpoiler == 'true') {
			subset = subset.not('.bbc-spoiler a');	
		}

		if(settings.dontReplaceLinkRead == 'true') {
			subset = subset.not('.seen1 a').not('.seen2 a');
		}

		subset.each(function() {

			var match = jQuery(this).attr('href').match(/https?\:\/\/(?:[-_0-9a-zA-Z]+\.)+[a-z]{2,6}(?:\/[^/#?]+)+\.(?:jpe?g|gif|png|bmp)/);
			if(match != null) {
				jQuery(this).after("<img src='" + match[0] + "' />");
				jQuery(this).remove();
			}
		});
	}

	// Replace inline Images with Links
	if (settings.replaceImagesWithLinks == 'true') {
		var subset = jQuery('.postbody img');
		
		if(settings.replaceImagesReadOnly == 'true') {
			subset = subset.filter('.seen1 img, .seen2 img');
		}
		
		//if(settings.dontReplaceEmoticons == 'true') {
			subset = subset.not('img[src*=http://i.somethingawful.com/forumsystem/emoticons/]');
			subset = subset.not('img[src*=http://fi.somethingawful.com/images/smilies/]');
		//}

		subset.each(function() {
			var source = jQuery(this).attr('src');
			jQuery(this).after("<a href='" + source + "'>" + source + "</a>");
			jQuery(this).remove();
		});
	}

	if (settings.restrictImageSize == 'true') {
		jQuery('.postbody img').css({'max-width':'800px'});
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

/**
 * Display Ban History link under a users post
 *
 *
 */
function displayBanHistoryLink() {
    
    var getUserID = function(element) {
        var queryString = jQuery('li:first > a', element).attr('href');

        // Holy hardcore string manipulation, Batman!
        return (queryString.split('&')[1]).split('=')[1];
    };

    jQuery('ul.profilelinks').each(function() {
        jQuery(this).append('<li><a href="http://forums.somethingawful.com/banlist.php?userid=' + getUserID(jQuery(this)) + '">Ban History</li>');
    });
}

/**
 * Extract friends list from the User CP
 */
function updateFriendsList() {
    var friends = new Array();
    
    jQuery('div#buddylist td:nth-child(2)>a').each( function() {
        friends.push(this.title);
    });
    
    port.postMessage({ 'message': 'ChangeSetting',
                       'option' : 'friendsList', 
                       'value'  : friends });
}

/**
 * Highlight the posts of friends
 */
function highlightFriendPosts() {
    var friends = settings.friendsList.split(','); // When arrays get stored in settings, it flattens to a ,-separated string.
    
    var selector = '';
    
    jQuery(friends).each(function() {
        if (selector != '') {
            selector += ', ';
        }
        selector += "dt.author:contains('" +  this + "')";
    });

    jQuery('table.post:has('+selector+') td').each(function () {
        jQuery(this).css({
            'border-collapse' : 'collapse',
            'background-color' : settings.highlightFriendsColor
        });
    });
}

/**
 * Update the list of forums.
 */
function updateForumsList() {
    var forums = new Array();
    jQuery('select[name="forumid"]>option').each(function() {
        if (this.text == "Please select one:")
            return;
            
        forums.push({ 'name' : this.text,
                       'id'  : this.value });
    });
    
    if (forums.length > 0) {
        port.postMessage({ 'message': 'ChangeSetting',
                           'option' : 'forumsList', 
                           'value'  : JSON.stringify(forums) });    
    }
}