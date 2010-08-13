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

function SALR(settings, base_image_uri) {
    this.settings = settings;
    this.base_image_uri = base_image_uri;

    this.pageNavigator = null;
    this.quickReply = null;
    this.mouseGesturesContoller = null;
    this.hotKeyManager = null;

    this.pageInit();
};

SALR.prototype.pageInit = function() {
    // Update the styles now that we have
    // the settings
    this.updateStyling();
	this.modifyImages();
	
    jQuery.expr[":"].econtains = function(obj, index, meta, stack){
        return (obj.textContent || obj.innerText || $(obj).text() || "").toLowerCase() == meta[3].toLowerCase();
    }

    switch (findCurrentPage()) {
        case '':
        case 'index.php':
            if (this.settings.highlightModAdmin == 'true') {
                this.skimModerators();
            }

            break;
        case 'forumdisplay.php':
        case 'showthread.php':
            if (this.settings.inlineVideo == 'true') {
                this.inlineYoutubes();
            }

            if (this.settings.displayPageNavigator == 'true') {
                this.pageNavigator = new PageNavigator(this.base_image_uri);
            }

            this.updateForumsList();
            
            if (this.settings.highlightFriends == 'true') {
                this.highlightFriendPosts();    
            }
        
            if (this.settings.highlightOP == 'true') {
                this.highlightOPPosts();    
            }

            if (this.settings.highlightSelf == 'true') {
                this.highlightOwnPosts();
            }

            if (this.settings.highlightModAdmin == 'true') {
                this.skimModerators();
                this.highlightModAdminPosts();
            }

            if (this.settings.enableUserNotes == 'true') {
                this.displayUserNotes();
            }

            if (this.settings.boxQuotes == 'true') {
                this.boxQuotes();
            }

            if (this.settings.highlightOwnUsername == 'true') {
                this.highlightOwnUsername();
            }

            if (this.settings.highlightOwnQuotes == 'true') {
                this.highlightOwnQuotes();
            }

            this.displaySinglePostLink();

            if (this.settings.enableQuickReply == 'true') {
                if (this.settings.forumPostKey) {
                    this.quickReply = new QuickReplyBox(this.settings.forumPostKey, this.base_image_uri, this.settings.quickReplyBookmark == 'true');
                    this.bindQuickReply();
                }
            }
            
            if (this.settings.enableThreadNotes == 'true') {
                this.threadNotes();
            }

            if (this.settings.searchThreadHide != 'true') {
                this.addSearchThreadForm();
            }

            this.renderWhoPostedInThreadLink();

            break;
        case 'newreply.php':
            if (!this.settings.forumPostKey) {
                this.findFormKey();
            }
            
            if (this.settings.qneProtection == 'true') {
                this.quoteNotEditProtection();
            }

            break;
        case 'usercp.php':
            this.updateUsernameFromCP();
            this.updateFriendsList();

            if (this.settings.openAllUnreadLink == 'true') {
                this.renderOpenUpdatedThreadsButton();
            }

            if (this.settings.highlightModAdmin == 'true') {
                this.highlightModAdminPosts();
            }

            break;
        case 'bookmarkthreads.php':
            if (this.settings.openAllUnreadLink == 'true') {
                this.renderOpenUpdatedThreadsButton();
            }

            if (this.settings.highlightModAdmin == 'true') {
                this.highlightModAdminPosts();
            }

            break;
        case 'misc.php':
            if (window.location.href.indexOf('action=whoposted') >= 0) {
                this.highlightModAdminPosts();
            }

        break;
    }

    if (this.pageNavigator) {
        this.pageNavigator.display();
    }

    if (this.settings.enableMouseGestures == 'true') {
        this.mouseGesturesController = new MouseGesturesController(this.base_image_uri);
    }

    if (this.settings.enableKeyboardShortcuts == 'true') {
        this.hotKeyManager = new HotKeyManager(this.quickReply);
    }

    if (this.settings.displayOmnibarIcon == 'true') {
        // Display the page action
        postMessage({
            'message': 'ShowPageAction'
        });
    }
};

SALR.prototype.openSettings = function() {
    postMessage({'message': 'OpenSettings'});
};

// Since we have to wait to receive the settings from the extension,
// stash the styling logic in it's own function that we can call
// once we're ready
SALR.prototype.updateStyling = function() {

    var that = this;

    jQuery('tr.thread').each(function() {
        var thread = jQuery(this);
        var newPosts = false;

        if (!that.settings.disableCustomButtons || that.settings.disableCustomButtons == 'false') {

            // Re-style the new post count link
            jQuery('a.count', thread).each(function() {

                var other = that;

                newPosts = true;
                var newPostCount = jQuery(this).html();

                // Remove the count from the element
                jQuery(this).html('');

                // Remove the left split border
                jQuery(this).css("border-left", "none");

                // Resize, shift, and add in the background image
                jQuery(this).css("width", "7px");
                jQuery(this).css("height", "16px");
                jQuery(this).css("padding-right", "11px");
                jQuery(this).css("background-image", "url('" + other.base_image_uri + "lastpost.png')");

                if (that.settings.inlinePostCounts == 'true') {
                    jQuery('div.lastseen', thread).each(function() {
                        // Add in number of new replies
                        var currentHtml = jQuery(this).html();
            
                        // Strip HTML tags
                        newPostCount = parseInt(newPostCount.replace(/(<([^>]+)>)/ig, ""));

                        if (newPostCount) {
                            // Set the HTML value
                            jQuery(this).html("<div style='font-size: 12px; float: left; margin-top: 4px; padding-right: 4px;'>(" + newPostCount + ")</div>" + currentHtml);
                        }
                    });
                } else {
                    // Display number of new replies for each thread
                    jQuery('td.replies', thread).each(function() {
                        // Add in number of new replies
                        var currentHtml = jQuery(this).html();
            
                        // Strip HTML tags
                        newPostCount = parseInt(newPostCount.replace(/(<([^>]+)>)/ig, ""));

                        if (newPostCount) {
                            // Set the HTML value
                            jQuery(this).html(currentHtml + "<br /><div style='font-size: 12px;'>(" + newPostCount + ")</div>");
                        }
                    });
                }
            });

            // Re-style the "mark unread" link
            jQuery('a.x', thread).each(function() {
                var other = that;

                // Set the image styles
                jQuery(this).css("background", "none");
                jQuery(this).css("background-image", "url('" + other.base_image_uri + "unvisit.png')");
                jQuery(this).css("height", "16px");
                jQuery(this).css("width", "14px");

                // Remove the 'X' from the anchor tag
                jQuery(this).html('');
            });

            // Eliminate last-seen styling
            jQuery('.lastseen', thread).each(function() {
                jQuery(this).css("background", "none");
                jQuery(this).css("border", "none");
            });

        } else {
            if (jQuery('a.count', thread).length)
                newPosts = true;
        }

        // If thread coloring enabled in forum preferences
        // recolor according to SALR settings
        if (thread.attr('class') == 'thread seen') {
            // If the thread has new posts, display the green shade,
            // otherwise show the blue shade
            var darkShade = (newPosts) ? that.settings.darkNewReplies : that.settings.darkRead;
            var lightShade = (newPosts) ? that.settings.lightNewReplies : that.settings.lightRead;

            // Thread icon, author, view count, and last post
            jQuery(this).children('td.icon, td.author, td.views, td.lastpost').each(function() {
                var other = that;

                jQuery(this).css({ "background-color" : darkShade, 
                                   "background-image" : "url('" + other.base_image_uri + "gradient.png')",
                                   "background-repeat" : "repeat-x"
                                 });
            });

            // Thread title, replies, and rating
            jQuery(this).find('td.title, td.replies, td.rating').each(function() {
                var other = that;

                jQuery(this).css({ "background-color" : lightShade, 
                                   "background-image" : "url('" + other.base_image_uri + "gradient.png')",
                                   "background-repeat" : "repeat-x"
                                 });
            });
        }

        // Send threads without unread posts to the end of the list
        if (!newPosts && that.settings.displayNewPostsFirst == 'true') {
            thread.parent().append(thread);
        }
    });
	
	if(this.settings.displayConfigureSalr == 'true') {
		jQuery('#navigation li.first').next('li').next('li').after(" - <a id='configure' href='#'>Configure SALR</a>");
	}
	
	jQuery('#configure').click(function() {
		that.openSettings();
	});
    
    // Hide header/footer links
    if (this.settings.hideHeaderLinks == 'true') {
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
    if (this.settings.hideAdvertisements == 'true') {
        jQuery('div.oma_pal').each(function() {
            jQuery(this).remove();
        });

        jQuery('div#ad_banner_user').each(function() {
            jQuery(this).remove();
        });
    }
};

SALR.prototype.modifyImages = function() {
	// Replace Links with Images
	if (this.settings.replaceLinksWithImages == 'true') {

		var subset = jQuery('.postbody a');

		//NWS/NMS links
		if(this.settings.dontReplaceLinkNWS == 'true')
		{
			subset = subset.not(".postbody:has(img[title=':nws:']) a").not(".postbody:has(img[title=':nms:']) a");
		}

		//
		if(this.settings.dontReplaceLinkSpoiler == 'true') {
			subset = subset.not('.bbc-spoiler a');	
		}

		if(this.settings.dontReplaceLinkRead == 'true') {
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
	if (this.settings.replaceImagesWithLinks == 'true') {
		var subset = jQuery('.postbody img');
		
		if(this.settings.replaceImagesReadOnly == 'true') {
			subset = subset.filter('.seen1 img, .seen2 img');
		}
		
		//if(settings.dontReplaceEmoticons) {
			subset = subset.not('img[src*=http://i.somethingawful.com/forumsystem/emoticons/]');
			subset = subset.not('img[src*=http://fi.somethingawful.com/images/smilies/]');
		//}

		subset.each(function() {
			var source = jQuery(this).attr('src');
			jQuery(this).after("<a href='" + source + "'>" + source + "</a>");
			jQuery(this).remove();
		});
	}

	if (this.settings.restrictImageSize == 'true') {
		jQuery('.postbody img').each(function() {
            var width = jQuery(this).width();
            var height = jQuery(this).height();

            jQuery(this).click(function() {
                if (jQuery(this).width() == '800') {
                    jQuery(this).css({
                        'max-width': width + 'px',
                    });
                } else {
                    jQuery(this).css({'max-width': '800px'});
                }
            });

            if (jQuery(this).width() > '800') {
                jQuery(this).css({
                    'max-width': '800px',
                    'border': '1px dashed gray'
                });
            }
        });
	}
};

SALR.prototype.skimModerators = function() {
    var modList;
    var modupdate = false;
    if (this.settings.modList == null) {
        // Seed administrators. Is there a list for them?
        modList = { "12831" : {'username' :  'elpintogrande', 'mod' : 'A'},
                    "16393" : {'username' :  'Fistgrrl', 'mod' : 'A'},
                    "17553" : {'username' :  'Livestock', 'mod' : 'A'},
                    "22720" : {'username' :  'Ozma', 'mod' : 'A'},
                    "23684" : {'username' :  'mons all madden', 'mod' : 'A'},
                    "24587" : {'username' :  'hoodrow trillson', 'mod' : 'A'},
                    "27691" : {'username' :  'Lowtax', 'mod' : 'A'},
                    "51697" : {'username' :  'angerbotSD', 'mod' : 'A'},
                    "62392" : {'username' :  'Tiny Fistpump', 'mod' : 'A'},
                    "114975" : {'username' : 'SA Support Robot', 'mod' : 'A'},
                    "137488" : {'username' : 'Garbage Day', 'mod' : 'A'},
                    "147983" : {'username' : 'Peatpot', 'mod' : 'A'},
                    "158420" : {'username' : 'Badvertising', 'mod' : 'A'},
                   };
        modupdate = true;
    } else {
        modList = JSON.parse(this.settings.modList);
    }

    // TODO: How can you tell if a mod has been demodded?

    // Moderator list on forumdisplay.php
    jQuery('div#mods > b > a').each(function() {
        var userid = jQuery(this).attr('href').split('userid=')[1];
        var username = jQuery(this).html();
        if (modList[userid] == null) {
            modList[userid] = {'username' : username, 'mod' : 'M'};
            modupdate = true;
        } else if (modList[userid].username != username) {
            modList[userid].username = username;
            modupdate = true;
        }
    });

    // Moderator lists on index.php
    jQuery('td.moderators > a').each(function() {
        var userid = jQuery(this).attr('href').split('userid=')[1];
        var username = jQuery(this).html();
        if (modList[userid] == null) {
            modList[userid] = {'username' : username, 'mod' : 'M'};
            modupdate = true;
        } else if (modList[userid].username != username) {
            modList[userid].username = username;
            modupdate = true;
        }
    });

    if (modupdate) {
        postMessage({ 'message': 'ChangeSetting',
                           'option' : 'modList',
                           'value'  : JSON.stringify(modList) });
    }
};

SALR.prototype.inlineYoutubes = function() {
    var that = this;

	//sort out youtube links
	jQuery('.postbody a[href*="youtube.com"]').each(function() {
			jQuery(this).css("background-color", that.settings.youtubeHighlight).addClass("salr-video");
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
};

/**
 * Display Single Post View link under a users post
 *
 *
 */
SALR.prototype.displaySinglePostLink = function() {
    var getPostID = function(element) {
        return jQuery('a[href^=#post]', element).attr('href').split('#post')[1];
    };

    jQuery('td.postdate').each( function() {
        jQuery('a[href^=#post]', this).before('<a href="http://forums.somethingawful.com/showthread.php?action=showpost&postid='+getPostID(jQuery(this))+'">1</a> ');
    });
};

/**
 * Open the list of who posted in a thread
 *
 */
SALR.prototype.renderWhoPostedInThreadLink = function() {
    var threadbar = jQuery('div.threadbar.top');
    if (!threadbar.length)
        return;

    var threadid = findThreadID();
    var href = 'http://forums.somethingawful.com/misc.php?action=whoposted&threadid='+threadid;
    var linkHTML = '<div style="float:left;"><a href="'+href+'">Who Posted</a></div>';
    threadbar.prepend(linkHTML);
};

/**
 * Open all of your tracked and updated threads in a new tab
 *
 */
SALR.prototype.renderOpenUpdatedThreadsButton = function() {
    var that = this;

    jQuery('th.title:first').each( function() {
        var headerHTML = jQuery(this).html();
        var updatedHTML = headerHTML + '<div id="open-updated-threads"' +
                                       '     style="float:right; ' +
                                       '            cursor:pointer; ' +
                                       '            text-decoration: underline;">' +
                                       'Open updated threads</div>';

        jQuery(this).html(updatedHTML);

        // Open all updated threads in tabs
        jQuery('#open-updated-threads').click( function() {
            var other = that;

            jQuery('tr.thread').each( function() {
                var img_split = jQuery('td.star > img', this).attr('src').split('/');
                var img_name = img_split[img_split.length-1];
                if (other.settings.ignore_bookmark_star != img_name) {
                    if (jQuery('a[class*=count]', this).length > 0) {
                        var href = jQuery('a[class*=count]', this).attr('href');
                        // TODO: Fix this
                        postMessage({ 'message': 'OpenTab',
                                           'url'  : 'http://forums.somethingawful.com'+href });
                    }
                }
            });
        });
    });
};

/**
 * Extract friends list from the User CP
 */
SALR.prototype.updateFriendsList = function() {
    var friends = new Array();

    jQuery('div#buddylist td:nth-child(2)>a').each( function() {
        friends.push(this.title);
    });

    postMessage({ 'message': 'ChangeSetting',
                'option' : 'friendsList',
                'value'  : JSON.stringify(friends) });
};

/**
 * Highlight the posts of friends
 */
SALR.prototype.highlightFriendPosts = function() {
    var that = this;
    var friends = JSON.parse(this.settings.friendsList);
    var selector = '';

    if (friends == 0) {
        return;
    }

    jQuery(friends).each(function() {
        if (selector != '') {
            selector += ', ';
        }
        selector += "dt.author:econtains('" +  this + "')";
    });

    jQuery('table.post:has('+selector+') td').each(function () {
        jQuery(this).css({
            'border-collapse' : 'collapse',
            'background-color' : that.settings.highlightFriendsColor
        });
    });
};

/**
 * Highlight the posts by the OP
 */
SALR.prototype.highlightOPPosts = function() {
    var that = this;

    jQuery('table.post:has(dt.author.op) td').each(function () {
        jQuery(this).css({
            'border-collapse' : 'collapse',
            'background-color' : that.settings.highlightOPColor
        });
    });
};

/**
 * Highlight the posts by one self
 */
SALR.prototype.highlightOwnPosts = function() {
    var that = this;

    jQuery("table.post:has(dt.author:econtains('"+that.settings.username+"')) td").each(function () {
        jQuery(this).css({
            'border-collapse' : 'collapse',
            'background-color' : that.settings.highlightSelfColor
        });
    });
};

/**
 * Highlight the posts by moderators and admins
 */
SALR.prototype.highlightModAdminPosts = function() {
    switch (findCurrentPage()) {
        case 'forumdisplay.php':
        case 'usercp.php':
        case 'bookmarkthreads.php':
            this.highlightModAdminForumDisplay();
            break;
        case 'showthread.php':
            this.highlightModAdminShowThread();
            break;
        case 'misc.php':
            this.highlightModAdminWhoPosted();
            break;
    }
};

/**
 * Highlight the posts by moderators and admins
 * on the forum display page
 */
SALR.prototype.highlightModAdminForumDisplay = function() {
    var that = this;

    if (this.settings.modList == null)
        return;

    var modList = JSON.parse(this.settings.modList);

    // Highlight mods and admin thread OPs on forumdisplay.php
    jQuery('td.author > a').each(function() {
        var userid = jQuery(this).attr('href').split('userid=')[1];
        if (modList[userid] != null) {
            var color;
            switch (modList[userid].mod) {
                case 'M':
                    color = that.settings.highlightModeratorColor;
                    break;
                case 'A':
                    color = that.settings.highlightAdminColor;
                    break;
            }
            jQuery(this).css('color', color);
            jQuery(this).css('font-weight', 'bold');
        }
    });

    // Highlight mod and admin last posters on forumdisplay.php
    jQuery('td.lastpost > a.author').each(function() {
        var username = jQuery(this).html();
        // No userid in this column so we have to loop
        for(userid in modList) {
            if (username == modList[userid].username) {
                var color;
                switch (modList[userid].mod) {
                    case 'M':
                        color = that.settings.highlightModeratorColor;
                        break;
                    case 'A':
                        color = that.settings.highlightAdminColor;
                        break;
                }
                jQuery(this).css('color', color);
                jQuery(this).css('font-weight', 'bold');
                break;
            }
        }
    });
};

/**
 * Highlight the posts by moderators and admins
 * on the thread display page
 */
SALR.prototype.highlightModAdminShowThread = function() {
    var that = this;

    if (this.settings.highlightModAdminUsername != 'true') {
        jQuery('table.post:has(dt.author:has(img[title="Moderator"])) td').each(function () {
            jQuery(this).css({
                'border-collapse' : 'collapse',
                'background-color' : that.settings.highlightModeratorColor
            });
        });
        jQuery('table.post:has(dt.author:has(img[title="Admin"])) td').each(function () {
            jQuery(this).css({
                'border-collapse' : 'collapse',
                'background-color' : that.settings.highlightAdminColor
            });
        });
    } else {
        jQuery('dt.author > img[title="Moderator"]').each(function() {
            jQuery(this).parent().css('color', that.settings.highlightModeratorColor);
        });

        jQuery('dt.author > img[title="Admin"]').each(function() {
            jQuery(this).parent().css('color', that.settings.highlightAdminColor);
        });
    }
};

/**
 * Highlight the posts by moderators and admins
 * on the who posted page
 */
SALR.prototype.highlightModAdminWhoPosted = function() {
    var that = this;

    if (this.settings.modList == null)
        return;

    var modList = JSON.parse(this.settings.modList);

    jQuery('a[href*=member.php]').each(function() {
        var userid = jQuery(this).attr('href').split('userid=')[1];
        if (modList[userid] != null) {
            var color;
            switch (modList[userid].mod) {
                case 'M':
                    color = that.settings.highlightModeratorColor;
                    break;
                case 'A':
                    color = that.settings.highlightAdminColor;
                    break;
            }
            jQuery(this).css('color', color);
            jQuery(this).css('font-weight', 'bold');
        }
    });
};

/**
 * Update the list of forums.
 */
SALR.prototype.updateForumsList = function() {
    var forums = new Array();

    var stickyList = new Array();
    if (this.settings.forumsList != null) {
        var oldForums = JSON.parse(this.settings.forumsList);
        for(i in oldForums) {
            stickyList[oldForums[i].id] = oldForums[i].sticky;
        }
    }

    jQuery('select[name="forumid"]>option').each(function() {
        if (this.text == "Please select one:")
            return;

        var sticky = false;
        if (stickyList[this.value] == true)
            sticky = true;

        forums.push({ 'name' : this.text,
                       'id'  : this.value,
                       'sticky'  : sticky });
    });

    if (forums.length > 0) {
        postMessage({ 'message': 'ChangeSetting',
                           'option' : 'forumsList',
                           'value'  : JSON.stringify(forums) });
    }
};

/**
 * Fetches the username of the current user from the user CP
 */
SALR.prototype.updateUsernameFromCP = function() {
    var titleText = jQuery('title').text();
    var username = titleText.match(/- User Control Panel For (.+)/)[1];
    if (this.settings.username != username) {
        postMessage({ 'message' : 'ChangeSetting',
                           'option'  : 'username',
                           'value'   : username });
    }
};

/**
 * Displays notes under usernames.
 */
SALR.prototype.displayUserNotes = function() {
    var notes;

    if (this.settings.userNotes == null) {
        notes = { "50339" : {'text' : 'SALR Developer', 'color' : '#9933FF'},   // Sebbe
                  "3882420" : {'text' : 'SALR Developer', 'color' : '#9933FF'}, // Onoj
                  "143511" : {'text' : 'SALR Developer', 'color' : '#9933FF'},  // Sneaking Mission
                  "156041" : {'text' : 'SALR Developer', 'color' : '#9933FF'},  // wmbest2
                  "115838" : {'text' : 'SALR Developer', 'color' : '#9933FF'}}; // Ferg
        postMessage({ 'message': 'ChangeSetting',
                           'option' : 'userNotes',
                           'value'  : JSON.stringify(notes) });
    } else {
        notes = JSON.parse(this.settings.userNotes);
    }

    jQuery('body').append("<div id='salr-usernotes-config' title='Set note' style='display: none'>"+
        "<fieldset>"+
            "<p><label for='salr-usernotes-text'><strong>Note:</strong></label><br/><input type='text' id='salr-usernotes-text'/></p>"+
            "<p><label for='salr-usernotes-color'><strong>Color:</strong></label><br/><input type='text' id='salr-usernotes-color'/></p>"+
        "</fieldset>"+
    "</div>");
    
    jQuery('table.post').each(function () {
        var userid = jQuery(this).find('ul.profilelinks a')[0].href.match(/\d+$/)[0];
        var hasNote = notes[userid] != null;
        
        if (hasNote) {
            jQuery('dl.userinfo > dt.author', this).after(
                '<dd style="font-weight: bold; color: ' + notes[userid].color + '">' + notes[userid].text + '</dd>'
            );
        }

        var editLink = jQuery('<li><a href="javascript:;">Edit Note</a></li>');
        jQuery('a', editLink).click(function() {
            jQuery('#salr-usernotes-config').dialog({
                open: function(event, ui) {
                    jQuery('#salr-usernotes-text').val(hasNote ? notes[userid].text : '');
                    jQuery('#salr-usernotes-color').val(hasNote ? notes[userid].color : '#FF0000');
                },
                buttons: {
                    "OK" : function () {
                        notes[userid] = {'text' : jQuery('#salr-usernotes-text').val(), 
                                         'color' : jQuery('#salr-usernotes-color').val()};
                        // TODO: Fix this
                        postMessage({ 'message': 'ChangeSetting',
                                           'option' : 'userNotes',
                                           'value'  : JSON.stringify(notes) });
                        jQuery(this).dialog('destroy');
                    },
                    "Delete" : function () {
                        delete notes[userid];
                        // TODO: Fix this
                        postMessage({ 'message': 'ChangeSetting',
                                           'option' : 'userNotes',
                                           'value'  : JSON.stringify(notes) });
                        jQuery(this).dialog('destroy');                    
                    },
                    "Cancel" : function () { jQuery(this).dialog('destroy'); } }
            });
        });
        // append a space to create a new text node which fixes spacing problems you'll get otherwise
        jQuery('ul.profilelinks', this).append(' ').append(editLink).append(' '); 
    });
};

/**
 * Add boxes around blockquotes
 */
SALR.prototype.boxQuotes = function() {
    // CSS taken from http://forums.somethingawful.com/showthread.php?threadid=3208437&userid=0&perpage=40&pagenumber=3#post371892272
    jQuery('.bbc-block').css({
        'background-color': 'white',
        'border': '1px solid black',
        'padding': '0px'
    });

    jQuery('.bbc-block h4').css({
        'border': 'none',
        'border-bottom': '1px solid black',
        'font-style': 'normal',
        'padding': '3px'
    });

    jQuery('.bbc-block blockquote').css({
        'padding': '7px 7px 7px 7px'
    });
};

/**
 * Highlight the user's username in posts
 */
SALR.prototype.highlightOwnUsername = function() {
    var that = this;

    var selector = 'td.postbody:contains("'+this.settings.username+'")';
    var re = new RegExp(this.settings.username, 'g');
    jQuery(selector).each(function() {
        jQuery(this).html(jQuery(this).html().replace(re, '<span class="usernameHighlight" style="font-weight: bold; color: ' + that.settings.usernameHighlight + ';">' + that.settings.username + '</span>'));
    });
};

/**
 * Highlight the quotes of the user themselves.
 */
SALR.prototype.highlightOwnQuotes = function() {
    var that = this;

    jQuery('.bbc-block h4:contains(' + that.settings.username + ')').each(function() {
        jQuery(this).parent().css("background-color", that.settings.userQuote);

        // Replace the styling from username highlighting
        var previous = jQuery(this);
        jQuery('.usernameHighlight', previous).each(function() {
            jQuery(this).css('color', '#555');
        });
    });
};

/**
 * Binds quick-reply box to reply/quote buttons
 *
 */
SALR.prototype.bindQuickReply = function() {
    var that = this;

    jQuery('a > img[alt="Quote"]').each(function() {
        jQuery(this).parent().attr('href', 'javascript:;');

        var parentTable = jQuery(this).parent().parent().parent().parent().parent().parent().parent();

        // Query for the username
        var username = jQuery('tr > td.userinfo > dl > dt.author', parentTable).html();
        // Query for the quote
        var quote = jQuery('tr > td.postbody', parentTable).clone();

        // Bind the quick reply box to the button
        jQuery(this).parent().click(function() {
            that.quickReply.appendQuote(username, quote);
            that.quickReply.show();

            /***********TODO: FIX THIS*********
            if (!this.quickReply.isExpanded()) {
                this.quickReply.toggleView();
            } else {
                this.quickReply.show();
            }
            **********************************/
        });
    });
    
    jQuery('a > img[alt="Reply"]').each(function() {
        jQuery(this).parent().attr('href', 'javascript:void();');

        jQuery(this).parent().click(function() {
            that.quickReply.show();
        });
    });
};

SALR.prototype.findFormKey = function() {
    var that = this;

    jQuery('input[name="formkey"]').each(function() {
        postMessage({ 'message': 'ChangeSetting',
                           'option' : 'forumPostKey',
                           'value'  : jQuery(this).attr('value') });
    });
};

/**
 *  Displays a warning if the last poster in the thread was the current user, or
 *  the post contains a quote of the current user.
 **/
SALR.prototype.quoteNotEditProtection = function() {
    if(this.settings.username){
        if(jQuery("textarea[name='message']:contains('quote=\"" + this.settings.username + "\"')").length > 0 ||
            jQuery('table.post:first tr > td.userinfo > dl > dt.author:contains("' + this.settings.username + '")').length > 0)
        {
            jQuery("#main_full").after("<div class='qne_warn'><h4>Warning! Possible Quote/Edit mixup.</h4></div>");
        }
    }
};

/**
 *  Hide signatures
 **/
SALR.prototype.hideSignatures = function() {
    jQuery('p.signature').each(function() {
        jQuery(this).css('display','none');
    });
};

/**
 *
 *  Thread notes
 *
 *  Displys a widget for editing thread-specific notes.
 *
 *  @author Scott Lyons (Captain Capacitor)
 **/
SALR.prototype.threadNotes = function() {
    //  Only valid on thread pages
    if(findCurrentPage() == 'forumdisplay.php')
        return;
        
    if(jQuery("#container").data('showThreadNotes'))
    	return true;
    jQuery('#container').data('showThreadNotes', true);
    
    var notes;
    if(this.settings.threadNotes == null)
    {
       	notes = new Object();
       	postMessage({
			'message': 'ChangeSetting',
			'option': 'threadNotes',
			'value': JSON.stringify(notes)
		});
    }
    else {
    	notes = JSON.parse(this.settings.threadNotes);
    }
    var basePageID = findForumID();
    var hasNote = notes[String(basePageID)] != null;
    
    var notesHTML = '<nav id="threadnotes"> ' +
                    '   <div id="threadnotes-body">' +
                    '       <span><a id="threadnotes-show" style="color: #fff; text-shadow: #222 0px 1px 0px;">Show thread notes</a></span>' +
                    '   </div>' +
                    '</nav>';
    jQuery("#container").append(notesHTML);
    jQuery("#threadnotes").addClass('displayed');
    jQuery("#threadnotes-show").css({
        'background': 'url("' + chrome.extension.getURL('images/') + 'note.png") no-repeat left center'
    });
    
    jQuery('body').append("<div id='salr-threadnotes-config' title='Thread notes' style='display:none'>"+
    	"<textarea id='salr-threadnotes-text' rows='5' cols='20' style='width: 274px;'></textarea>"+
    "</div>");
    
    jQuery("#threadnotes-show").click(function(){
    	jQuery('#salr-threadnotes-config').dialog({
    		open: function(event, ui){
    		    jQuery(document).trigger('disableSALRHotkeys');
    			jQuery('#salr-threadnotes-text').val(hasNote ? notes[basePageID] : '');
    		},
    		buttons: {
    			"Save" : function() {
    				notes[String(basePageID)] = jQuery('#salr-threadnotes-text').val();
    				postMessage({ 'message': 'ChangeSetting',
                                       'option' : 'threadNotes',
                                       'value'  : JSON.stringify(notes) });
    				
    				jQuery(this).dialog('destroy');
                    jQuery(document).trigger('enableSALRHotkeys');
    				hasNote = true;
 				},
    			"Delete": function() { 
    				delete notes[String(basePageID)];
                    // TODO: Fix this
    				postMessage({ 'message': 'ChangeSetting',
                                       'option' : 'threadNotes',
                                       'value'  : JSON.stringify(notes) });
    				hasNote = false;
                    jQuery(document).trigger('enableSALRHotkeys');
    				jQuery(this).dialog('destroy');
    			},
    			"Cancel" : function() { 
    			    jQuery(this).dialog('destroy');
    			    jQuery(document).trigger('enableSALRHotkeys');
    			}
    		}
    	});
    });
};

/**
 *
 *  Add search bar to threads
 *
 **/
SALR.prototype.addSearchThreadForm = function() {
    //  Only valid on thread pages
    if(findCurrentPage() != 'showthread.php')
        return;

    var threadbar = jQuery('div.threadbar.top');
    if (!threadbar.length)
        return;

    threadbar.css('overflow','hidden');
    var forumid = findRealForumID();
    var threadid = findThreadID();
    searchHTML = '<form id="salrSearchForm" '+
            'action="http://forums.somethingawful.com/f/search/submit" '+
            'method="post" class="threadsearch">'+
           '<div style="margin-left: 100px">'+
           '<input type="hidden" name="forumids" value="'+forumid+'">'+
           '<input type="hidden" name="groupmode" value="0">'+
           '<input type="hidden" name="opt_search_posts" value="on">'+
           '<input type="hidden" name="opt_search_titles" value="on">'+
           '<input type="hidden" name="perpage" value="20">'+
           '<input type="hidden" name="search_mode" value="ext">'+
           '<input type="hidden" name="show_post_previews" value="1">'+
           '<input type="hidden" name="sortmode" value="1">'+
           '<input type="hidden" name="uf_posts" value="on">'+
           '<input type="hidden" name="userid_filters" value="">'+
           '<input type="hidden" name="username_filter" value="type a username">'+
           '<input id="salrSearch" name="keywords" size="25" style="">'+
           '<input type="submit" value="Search thread">'+
           '</div>'+
           '</form>';

    threadbar.prepend(searchHTML);

    jQuery('input#salrSearch').keypress( function(evt) {
        // Press Enter, Submit Form
        if (evt.keyCode == 13) {
            jQuery('form#salrSearchForm').submit();
            return false;
        }
        // Prevent hotkeys from receiving keypress
        evt.stopPropagation();
    });

    jQuery('form#salrSearchForm').submit( function() {
        var keywords = jQuery('input#salrSearch');
        // Don't submit a blank search
        if (keywords.val().trim() == '')
            return false;
        // Append threadid to search string
        keywords.val(keywords.val()+' threadid:'+threadid);
    });
};
