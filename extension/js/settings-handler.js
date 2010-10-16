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
 * Initialize event callbacks for the page
 *
 */
jQuery(document).ready(function() {
    // Don't wipe the settings made by previous versions
    if (localStorage.getItem('username')) {
        localStorage.setItem('salrInitialized', 'true');
    }

  // Setting names.
    var defaultSettings = [];
    defaultSettings['userQuote']                    = '#a2cd5a';
    defaultSettings['darkRead']                     = '#6699cc';
    defaultSettings['lightRead']                    = '#99ccff';
    defaultSettings['darkNewReplies']               = '#99cc99';
    defaultSettings['lightNewReplies']              = '#ccffcc';
    defaultSettings['youtubeHighlight']             = '#ff00ff';
    defaultSettings['displayConfigureSalr']         = 'true';
    defaultSettings['highlightFriendsColor']        = '#f2babb';
    defaultSettings['highlightSelfColor']           = '#f2babb';
    defaultSettings['highlightAdminColor']          = '#ff7256';
    defaultSettings['highlightModeratorColor']      = '#b4eeb4';
    defaultSettings['inlinePostCounts']             = 'false';
    defaultSettings['displayCustomButtons']         = 'true';
    defaultSettings['highlightOPColor']             = '#fff2aa';
    defaultSettings['displayPageNavigator']         = 'true';
    defaultSettings['userNotesEnabled']             = 'true';
    defaultSettings['salrInitialized']              = 'true';
    defaultSettings['topPurchaseAcc']               = 'true';
    defaultSettings['topPurchasePlat']              = 'true';
    defaultSettings['topPurchaseAva']               = 'true';
    defaultSettings['topPurchaseOtherAva']          = 'true';
    defaultSettings['topPurchaseArchives']          = 'true';
    defaultSettings['topPurchaseNoAds']             = 'true';
    defaultSettings['topPurchaseUsername']          = 'true';
    defaultSettings['topPurchaseBannerAd']          = 'true';
    defaultSettings['topPurchaseEmoticon']          = 'true';
    defaultSettings['topPurchaseSticky']            = 'true';
    defaultSettings['topPurchaseGiftCert']          = 'true';
    defaultSettings['topSAForums']                  = 'true';
    defaultSettings['topSearch']                    = 'true';
    defaultSettings['topUserCP']                    = 'true';
    defaultSettings['topPrivMsgs']                  = 'true';
    defaultSettings['topForumRules']                = 'true';
    defaultSettings['topSaclopedia']                = 'true';
    defaultSettings['topGloryhole']                 = 'true';
    defaultSettings['topLepersColony']              = 'true';
    defaultSettings['topSupport']                   = 'true';
    defaultSettings['topLogout']                    = 'true';
    defaultSettings['showPurchases']                = 'true';
    defaultSettings['showNavigation']               = 'true';
    defaultSettings['autoTLDR']                     = 'false';
	defaultSettings['showLastThreePages']			= 'false';
	defaultSettings['postsPerPage']					= 'default';
    defaultSettings['quickReplyFormat']             = 'true';
  
    // Check stored settings, if value not set, set to default value
    for ( var key in defaultSettings ) {
        if ( localStorage.getItem(key) == undefined ) {
            localStorage.setItem(key, defaultSettings[key]);
        }
    }

    // Initialize text entry fields
    jQuery('input.text-entry').each(function() {
        // Pre-populate settings field
        populateValues(jQuery(this));

        // Set focus handler for the entry fields
        jQuery(this).focus(function() {
            onInputSelect(jQuery(this));
        });
        
        // Set blur handler for the entry fields
        jQuery(this).blur(function() {
            onInputDeselect(jQuery(this));
        });

        jQuery(this).change(function() {
            localStorage.setItem(jQuery(this).attr('id'), jQuery(this).val());
            highlightExamples();
        });
    });

    // Initialize checkbox fields
    jQuery('div.display-preference input').each(function() {
        populateCheckboxes(jQuery(this));

        jQuery(this).click(function() {
            localStorage.setItem(jQuery(this).attr('id'), jQuery(this).attr('checked'));
            highlightExamples();
        });
    });

    // Initialize drop down menus
    jQuery('div.display-preference select').each(function() {
        populateDropDownMenus(jQuery(this));

        jQuery(this).change(function() {
            localStorage.setItem(jQuery(this).attr('id'), jQuery(this).val());
        });
    });

    // Setup color picker handles on the text boxes
	jQuery('.color-select-text').ColorPicker({
            onSubmit: function(hsb, hex, rgb, el) {
				jQuery(el).val('#' + hex);
				jQuery(el).ColorPickerHide();
                var box = jQuery('#'+jQuery(el).attr('id')+'-box');
				box.css('background-color', '#' + hex);
                localStorage.setItem(jQuery(el).attr('id'), jQuery(el).val());
                highlightExamples();
			},
			onBeforeShow: function () { 
				jQuery(this).ColorPickerSetColor(this.value);
			}
	})
	.bind('keyup', function() {
		jQuery(this).ColorPickerSetColor(this.value);
	});

    jQuery('div.color-select-box').each(function() {
        var backgroundColor = jQuery(this).parent().parent().find('input.color-select-text').val();

        jQuery(this).css('background-color', backgroundColor);
    });
 
    // Set click handler for the okay button
    jQuery('.submit-panel > input#submit').click(function() {
        onSubmitClicked();
    });

	// once to initialize and once to bind click

	jQuery('div.display-preference input[type=checkbox]').each(function() {
		onParentOptionSelect(jQuery(this));
	}).click(function() {
		onParentOptionSelect(jQuery(this));
	});

    highlightExamples();
});

function highlightExamples() {
    // Thread highlighting samples
    jQuery('tr#thread-read td#thread-light').each(function() {
        if (localStorage.getItem('highlightThread')=='true') {
            jQuery(this).css({ "background-color" : localStorage.getItem('lightRead'), 
                               "background-image" : "url('images/gradient.png')",
                               "background-repeat" : "repeat-x"
                             });
        } else {
            jQuery(this).css({ "background-color" : '', 
                               "background-image" : '',
                               "background-repeat" : ''
                             });
        }
    });
    jQuery('tr#thread-read td#thread-dark').each(function() {
        if (localStorage.getItem('highlightThread')=='true') {
            jQuery(this).css({ "background-color" : localStorage.getItem('darkRead'), 
                               "background-image" : "url('images/gradient.png')",
                               "background-repeat" : "repeat-x"
                             });
        } else {
            jQuery(this).css({ "background-color" : '', 
                               "background-image" : '',
                               "background-repeat" : ''
                             });
        }
    });
    jQuery('tr#thread-unread td#thread-light').each(function() {
        if (localStorage.getItem('highlightThread')=='true') {
            jQuery(this).css({ "background-color" : localStorage.getItem('lightNewReplies'), 
                               "background-image" : "url('images/gradient.png')",
                               "background-repeat" : "repeat-x"
                             });
        } else {
            jQuery(this).css({ "background-color" : '', 
                               "background-image" : '',
                               "background-repeat" : ''
                             });
        }
    });
    jQuery('tr#thread-unread td#thread-dark').each(function() {
        if (localStorage.getItem('highlightThread')=='true') {
            jQuery(this).css({ "background-color" : localStorage.getItem('darkNewReplies'), 
                               "background-image" : "url('images/gradient.png')",
                               "background-repeat" : "repeat-x"
                             });
        } else {
            jQuery(this).css({ "background-color" : '', 
                               "background-image" : '',
                               "background-repeat" : ''
                             });
        }
    });
    jQuery('div#lastseen-forum').each(function() {
        if (localStorage.getItem('displayCustomButtons')=='true') {
            jQuery(this).css('display','none');
        } else {
            jQuery(this).css('display','');
        }
    });
    jQuery('div#lastseen-custom').each(function() {
        if (localStorage.getItem('displayCustomButtons')=='true') {
            jQuery(this).css({
                'display' : '',
                'background' : 'none',
                'border' : 'none'
            });
            jQuery('div#lastseen-inline',this).each(function() {
                if (localStorage.getItem('inlinePostCounts') == 'true') {
                    jQuery(this).css('display','');
                } else {
                    jQuery(this).css('display','none');
                }
            });
            jQuery('a#lastseen-count',this).each(function () {
                jQuery(this).css({
                    'border-left' : 'none',
                    'width' : '7px',
                    'height' : '16px',
                    'padding-right' : '11px',
                    'background-image' : "url('images/lastpost.png')"
                });
            });
            jQuery('a#lastseen-x',this).each(function() {
                jQuery(this).css({
                    'background' : 'none',
                    'background-image' : "url('images/unvisit.png')",
                    'height' : '16px',
                    'width' : '14px'
                });
            });
        } else {
            jQuery(this).css('display','none');
        }
    });
    jQuery('div#lastseen-custom-count').each(function() {
        if (localStorage.getItem('displayCustomButtons') == 'true' && localStorage.getItem('inlinePostCounts') != 'true') {
            jQuery(this).css('display', 'inline');
        } else {
            jQuery(this).css('display', 'none');
        }
    });

    // Post highlighting samples
    jQuery('div#your-quote').each(function() {
        if (localStorage.getItem('highlightOwnQuotes')=='true') {
            jQuery(this).css('background-color', localStorage.getItem('userQuote'));
        } else {
            jQuery(this).css('background-color', '');
        }
    });
    jQuery('dt#own-name').each(function() {
        if (localStorage.getItem('username') != '') {
            jQuery(this).text(localStorage.getItem('username'));
        }
    });
    jQuery('span#your-name').each(function() {
        if (localStorage.getItem('username') != '') {
            jQuery(this).text(localStorage.getItem('username'));
        }
        if (localStorage.getItem('highlightOwnUsername')=='true') {
            jQuery(this).css('color', localStorage.getItem('usernameHighlight'));
        } else {
            jQuery(this).css('color', '');
        }
    });
    jQuery('span#your-name-quote').each(function() {
        if (localStorage.getItem('username') != '') {
            jQuery(this).text(localStorage.getItem('username'));
        }
        if (localStorage.getItem('highlightOwnQuotes')!='true' && localStorage.getItem('highlightOwnUsername')=='true') {
            jQuery(this).css('color', localStorage.getItem('usernameHighlight'));
        } else {
            jQuery(this).css('color', '');
        }
    });
    jQuery('table#own-post td').each(function() {
        if (localStorage.getItem('highlightSelf')=='true') {
            jQuery(this).css('background-color', localStorage.getItem('highlightSelfColor'));
        } else {
            jQuery(this).css('background-color', '');
        }
    });
    jQuery('table#friend-post td').each(function() {
        if (localStorage.getItem('highlightFriends')=='true') {
            jQuery(this).css('background-color', localStorage.getItem('highlightFriendsColor'));
        } else {
            jQuery(this).css('background-color', '');
        }
    });
    jQuery('table#op-post td').each(function() {
        if (localStorage.getItem('highlightOP')=='true') {
            jQuery(this).css('background-color', localStorage.getItem('highlightOPColor'));
        } else {
            jQuery(this).css('background-color', '');
        }
    });
    jQuery('dt#mod-name').each(function() {
        if (localStorage.getItem('highlightModAdminUsername') == 'true' && localStorage.getItem('highlightModAdmin')=='true') {
            jQuery(this).css('color', localStorage.getItem('highlightModeratorColor'));
        } else {
            jQuery(this).css('color', '');
        }
    });
    jQuery('dt#admin-name').each(function() {
        if (localStorage.getItem('highlightModAdminUsername') == 'true' && localStorage.getItem('highlightModAdmin')=='true') {
            jQuery(this).css('color', localStorage.getItem('highlightAdminColor'));
        } else {
            jQuery(this).css('color', '');
        }
    });
    jQuery('table#mod-post td').each(function() {
        if (localStorage.getItem('highlightModAdminUsername') != 'true' && localStorage.getItem('highlightModAdmin')=='true') {
            jQuery(this).css('background-color', localStorage.getItem('highlightModeratorColor'));
        } else {
            jQuery(this).css('background-color', '');
        }
    });
    jQuery('table#admin-post td').each(function() {
        if (localStorage.getItem('highlightModAdminUsername') != 'true' && localStorage.getItem('highlightModAdmin')=='true') {
            jQuery(this).css('background-color', localStorage.getItem('highlightAdminColor'));
        } else {
            jQuery(this).css('background-color', '');
        }
    });
}

/**
 *
 * Event handler for sub-options
 *
 */
function onParentOptionSelect(element) {

	var nextDiv = element.parent('div').next('div');
	if(nextDiv.is('.sub-options')) {

		if (element.is(':checked')) {
			nextDiv.removeClass('disabled-options');
   	    	nextDiv.find('input').removeAttr('disabled');
    	} else {
			nextDiv.addClass('disabled-options');
			nextDiv.find('input').attr('disabled', true);
    	} 
	
	}
}
	
/**
 * Event handler for focusing on the input
 *
 * @param element - Input element
 *
 */
function onInputSelect(element) {
    element.css('color', '#000000');
    //element.val('');
}

/**
 * Event handler for blurring the input
 *
 * @param element - Input element
 *
 */
function onInputDeselect(element) {
    // If the user didn't enter anything,
    // reset it to the saved value
    if (element.val() == '') {
        var value = localStorage.getItem(element.attr('id'));

        element.val(value);
    }

    element.css('color', '#999999');
}

/**
 * Populates the stored settings value into the element
 *
 * @param element - Input element
 *
 */
function populateValues(element) {
    var value = localStorage.getItem(element.attr('id'));

    if (!value) {
        // If there is no stored setting, use the default
        // value stored within the DOM
		var defaultCol = element.attr('default');
        element.attr('value', defaultCol);
    } else {
        // Otherwise, write the stored preference
        element.attr('value',value);
    }
}

/**
 * Populates any checkboxes with their stored value
 *
 * @param element - Input (checkbox) element
 *
 */
function populateCheckboxes(element) {
    var value = localStorage.getItem(element.attr('id'));

    // Make sure we're getting passed a checkbox
    if (element.attr('type') != 'checkbox')
        return;

    // If there is a value in localStorage, then set it,
    // otherwise unchecked it
    if (value == 'true') {
        element.attr('checked', true);
    } else {
        element.attr('checked', false);
    }
}

/**
 * Populates any drop down menus with their stored value
 *
 * @param element - Input (select) element
 *
 */
function populateDropDownMenus(element) {
    var value = localStorage.getItem(element.attr('id'));

    // Make sure we're getting passed a checkbox
    if (element.attr('type') != 'select-one')
        return;
    if (value == null)
        value = '';

    // Set the selected value to the one from LocalStorage
    jQuery('option[value="' + value + '"]', element).first().attr('selected', 'selected');
}

/**
 * Event handler for clicking the submit button 
 *
 *
 */
function onSubmitClicked() {

	// Store the preferences locally so that the page can
    // request it
    // We use window.opener to assign it to the toolstrip localStorage, since
    // the toolstrip handles all communication with the page
    jQuery('.user-preference').each(function() {
        var preferenceID = jQuery(this).attr('id');
        var value = null;

        if (jQuery(this).attr('type') == 'checkbox') {
            value = jQuery(this).attr('checked');
        } else {
            value = jQuery(this).val();
        }

        localStorage.setItem(preferenceID, value);
    });
	
	// Close the settings window
	
    window.close();
}

/**
 * Dump the localStorage entries to a new window.
 *
 */
function configWindow() {
    win = window.open('background.html','config');
    win.document.writeln('<html><body><h1>SALR Configuration</h1>');
    win.document.writeln('<table border="1">');
    win.document.writeln('<tr><th>Key</th><th>Value</th></tr>');
    for (var key in localStorage) {
        if (key == 'forumsList')
            continue;
        if (key == 'modList')
            continue;
        if (key == 'userNotes')
            continue;
        win.document.write('<tr><td>'+key+'</td>');
        win.document.writeln('<td>'+localStorage[key]+'</td></tr>');
    }
    win.document.writeln('</table></body></html>');
    win.document.close();
}
