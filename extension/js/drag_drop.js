var port = chrome.extension.connect();
var uploader = new ImageUploader(
    'https://api.imgur.com/2/upload.xml',
    {
        key: 'c0f6805130359ed37a5dbf3832aee4bc'
    });

uploader.bind('onProgress', function(event) {
    jQuery('#progress-bar > span').each(function() {
        jQuery(this).css('width', ((event.loaded * 152 / event.total) >> 0) + "px");
    });
});

uploader.bind('onComplete', function(event) {
    var original_image = jQuery('original', event.response).text();
    var square_thumbnail = jQuery('small_square', event.response).text();

    console.log(event.response);

    jQuery('#dropzone').css('display', 'none');
    jQuery('#img-result').css('display', 'block');
    jQuery('#result-src').attr('src', square_thumbnail);
    jQuery('input#submit-button').click(function() {
        var type = $("input[@name=type]:checked").attr('value');

        port.postMessage({
            message: 'AppendUploadedImage',
            original: original_image,
            thumbnail: square_thumbnail,
            type: type
        });
    });
});

uploader.bind('onError', function(event) {
    var error_message = jQuery('message', event.response).text();

    jQuery('#dropzone').css('display', 'none');
    jQuery('#error').css('display', 'block');
    jQuery('#error').html(error_message);
});

jQuery('input#filesUpload').change(function(event) {
    jQuery('#dropzone').removeClass('drag-over');
    console.log(jQuery(this).get(0).files);

    uploader.upload(this.files[0], 'image');

    jQuery('#upload-label').css('display', 'block');
    jQuery('#dropzone > h1').css('display', 'none');
    jQuery('#enter-url').css('display', 'none');
});

jQuery('input#url-submit-button').click(function() {
    uploader.uploadUrl(jQuery('input#image-url').val(), 'image');            
    jQuery('#enter-url').css('display', 'none');
});

jQuery('#dropzone').bind('dragover', function(event) {
    jQuery('h1', this).html('Now drop it');
    jQuery(this).addClass('drag-over');
});

jQuery('#dropzone').bind('dragleave', function(event) {
    jQuery('h1', this).html('Drag an image here');
    jQuery(this).removeClass('drag-over');
});
