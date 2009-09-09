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
    // Initialize text entry fields
    jQuery('.settings-panel > .username-field > input.text-entry').each(function() {
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
    });
  
    // Initialize color entry fields
	//
	// I'd really rather not do the exact same thing twice, but potentially
	// this functionality could differ from the username field, so it's
	// probably the better approach for the future.
    jQuery('.settings-panel > .color-preference > .color-select-input > input.color-select-text').each(function() {
        populateValues(jQuery(this));
        // Set focus handler for the entry fields
        jQuery(this).focus(function() {
            onInputSelect(jQuery(this));
        });
        
        // Set blur handler for the entry fields
        jQuery(this).blur(function() {
            onInputDeselect(jQuery(this));
        });
    });

    // Initialize checkbox fields
    jQuery('div.display-preference > input').each(function() {
        populateCheckboxes(jQuery(this));
    });

    // Set color selectors
    jQuery('div.color-picker-box').ColorPicker({
        flat: true,
        color: '#dddddd',
        onShow: function(colorpicker) {
            jQuery(colorpicker).fadeIn(500);
        },
        onHide: function(colorpicker) {
            jQuery(colorpicker).fadeOut(500);
        },
        onSubmit: function(hsb, hex, rgb, element) {
            // Set the box to the chosen color
            jQuery(this).parent().find('div.color-select-box').css('background-color', '#' + hex);
            jQuery(element).ColorPickerHide();
        }
    });
    jQuery('div.color-picker-box > div').css('position', 'absolute');

    jQuery('div.color-select-box').each(function() {
        var backgroundColor = jQuery(this).parent().parent().find('input.color-select-text').val();
        var that = jQuery(this).parent();

        jQuery(this).click(function() {
            jQuery('div.color-picker-box', that).ColorPickerShow();
        });

        jQuery(this).css('background-color', backgroundColor);
    });
 
    // Set click handler for the okay button
    jQuery('.submit-panel > input#submit').click(function() {
        onSubmitClicked(jQuery(this));
    });
    
    // Setup menu tabs
    jQuery('#tabs').tabs();
});

/**
 * Event handler for focusing on the input
 *
 * @param element - Input element
 *
 */
function onInputSelect(element) {
    element.css('color', '#000000');
    element.val('');
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
    var value = window.opener.localStorage.getItem(element.attr('id'));

    if (!value) {
        // If there is no stored setting, use the default
        // value stored within the DOM
        element.val(element.attr('default'));
    } else {
        // Otherwise, write the stored preference
        element.val(value);
    }
}

/**
 * Populates any checkboxes with their stored value
 *
 * @param element - Input (checkbox) element
 *
 */
function populateCheckboxes(element) {
    var value = window.opener.localStorage.getItem(element.attr('id'));

    // Make sure we're getting passed a checkbox
    if (element.attr('type') != 'checkbox')
        return;

    // If there is a value in localStorage, then set it,
    // otherwise leave it unchecked
    if (value == 'true') {
        element.attr('checked', true);
    }
}

/**
 * Event handler for clicking the submit button 
 *
 * @param element - Input element
 *
 */
function onSubmitClicked(element) {
    var usernameField = jQuery('#username', element.parent().parent());
    var usernameQuote = jQuery('#user-quote', element.parent().parent());
    var darkReadField = jQuery('#dark-read', element.parent().parent());
    var lightReadField = jQuery('#light-read', element.parent().parent());
    var darkNewRepliesField = jQuery('#dark-new-replies', element.parent().parent());
    var lightNewRepliesField = jQuery('#light-new-replies', element.parent().parent());

    // Set checkbox values
    var hideAdvertisements = jQuery('#hide-advertisements').attr('checked');
    var headerLinks = jQuery('#hide-header-links').attr('checked');

    // Store the preferences locally so that the page can
    // request it
    // We use window.opener to assign it to the toolstrip localStorage, since
    // the toolstrip handles all communication with the page
    window.opener.localStorage.setItem('username', usernameField.val());
    window.opener.localStorage.setItem('user-quote', usernameQuote.val());
    window.opener.localStorage.setItem('dark-read', darkReadField.val());
    window.opener.localStorage.setItem('light-read', lightReadField.val());
    window.opener.localStorage.setItem('dark-new-replies', darkNewRepliesField.val());
    window.opener.localStorage.setItem('light-new-replies', lightNewRepliesField.val());
    window.opener.localStorage.setItem('hide-advertisements', hideAdvertisements);
    window.opener.localStorage.setItem('hide-header-links', headerLinks);

    // Close the settings window
    window.close();
}
