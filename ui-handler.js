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
