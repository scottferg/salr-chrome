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

var usernameFieldDeployed = false;

/**
 * Message event listener so that we can talk to the content-script
 *
 */
chrome.extension.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(data) {
        // Respond with the username
        port.postMessage({
            'username': localStorage.getItem('username')
        });
    });
});

/**
 * Initialize event callbacks for the page
 *
 */
jQuery(document).ready(function() {
    // Set click handler for the button
    jQuery('.toolstrip-button > img').click(function() {
        onToolbarClick(jQuery(this).parent());
    });

    // Set focus handler for the text input
    jQuery('.toolstrip-button > input#username').focus(function() {
        onUsernameSelect(jQuery(this));
    });

    // Set blur handler for the text input
    jQuery('.toolstrip-button > input#username').blur(function() {
        onUsernameDeSelect(jQuery(this));
    });

    // Set click handler for the okay button
    jQuery('.toolstrip-button > input#submit').click(function() {
        onSubmitClicked(jQuery(this));
    });
});

/**
 * Event handler for clicking on the toolstrip logo
 *
 * @param element - Toolstrip element
 */
function onToolbarClick(element) {
    var usernameInput = jQuery('input#username', element);
    var okayButton = jQuery('input#submit', element);

    // If the input fields are visible hide them,
    // otherwise display them
    if (usernameFieldDeployed) {
        usernameInput.css('display', 'none');
        okayButton.css('display', 'none');
    } else {
        usernameInput.css('display', 'block');
        okayButton.css('display', 'block');

		var username = localStorage.getItem('username');

		if (username) {
			usernameInput.val(username);
		}
    }

    usernameFieldDeployed = !usernameFieldDeployed;
}

/**
 * Event handler for focusing on the username input
 *
 * @param element - Input element
 */
function onUsernameSelect(element) {
    element.css('color', '#000000');
    element.val('');
}

/**
 * Event handler for blurring the username input
 *
 * @param element - Input element
 */
function onUsernameDeSelect(element) {
    element.css('color', '#999999');
}

/**
 * Event handler for clicking the submit button 
 *
 * @param element - Input element
 */
function onSubmitClicked(element) {
    var usernameField = jQuery('input#username', element.parent());
    var okayButton = jQuery('input#submit', element.parent());

    usernameField.css('display', 'none');
    okayButton.css('display', 'none');

    // Store the username locally so that the page can
    // request it
    localStorage.setItem('username', usernameField.val());
}
