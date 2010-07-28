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
    jQuery('.username-field > input.text-entry').each(function() {
        var that = this;

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
            localStorage.setItem(jQuery(that).attr('id'), jQuery(that).val());
        });
    });
  
    // Initialize color entry fields
	//
	// I'd really rather not do the exact same thing twice, but potentially
	// this functionality could differ from the username field, so it's
	// probably the better approach for the future.
    jQuery('section.settings-panel > div.settings-group > div.color-preference > div.color-select-input > input.color-select-text').each(function() {
        var that = this;

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
            localStorage.setItem(jQuery(that).attr('id'), jQuery(that).val());
        });
    });

    // Initialize checkbox fields
    jQuery('div.display-preference input').each(function() {
        var that = this;

        populateCheckboxes(jQuery(this));

        jQuery(this).click(function() {
            localStorage.setItem(jQuery(that).attr('id'), jQuery(that).attr('checked'));
        });
    });

    // Initialize drop down menus
    jQuery('div.display-preference select').each(function() {
        var that = this;

        populateDropDownMenus(jQuery(this));

        jQuery(this).change(function() {
            localStorage.setItem(jQuery(that).attr('id'), jQuery(that).val());
        });
    });

    // Setup color picker handles on the text boxes
	jQuery('.color-select-text').ColorPicker({
            onSubmit: function(hsb, hex, rgb, el) {
				jQuery(el).val('#' + hex);
				jQuery(el).ColorPickerHide();
				jQuery(el).parent().next().children().css('background-color', '#' + hex); //TODO fix this monstrosity.
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
});

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
    // otherwise leave it unchecked
    if (value == 'true') {
        element.attr('checked', true);
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
