/**
 * Midgard Create initialization
 */
/**
 * This file is generated automatically from Literate Programming code
 * stored in the README.txt documentation file in this repository.
 * Instead of modifying this file directly, modify the corresponding
 * code chunks in README.txt and regenerate it using the tangle command
 * of noweb.php:
 *
 *    $ noweb.php tangle README.txt
 *
 * Read more about the concept in:
 * @link http://bergie.iki.fi/blog/literate_programming_with_php/
 */

// Include dependencies of Midgard Create
document.write('<script type="text/javascript" src="/midgardmvc-static/midgardmvc_ui_create/js/deps/modernizr-1.6.min.js"></script>');
document.write('<link rel="stylesheet" href="/midgardmvc-static/midgardmvc_ui_create/themes/midgard-theme/jquery.ui.all.css">');
document.write('<link rel="stylesheet" href="/midgardmvc-static/midgardmvc_ui_create/themes/midgard-toolbar/midgardbar.css">');
document.write('<script type="text/javascript" src="/midgardmvc-static/midgardmvc_ui_create/js/objectmanager.js"></script>');
document.write('<script type="text/javascript" src="/midgardmvc-static/midgardmvc_ui_create/js/editable.js"></script>');
document.write('<script type="text/javascript" src="/midgardmvc-static/midgardmvc_ui_create/js/collections.js"></script>');
document.write('<script type="text/javascript" src="/midgardmvc-static/midgardmvc_ui_create/js/image.js"></script>');
document.write('<script type="text/javascript" src="/midgardmvc-static/midgardmvc_ui_create/js/imageplaceholders.js"></script>');

document.write('<script type="text/javascript" src="/midgardmvc-static/midgardmvc_ui_create/js/midgardToolbar.js"></script>');

// Initialize Midgard Create
jQuery(document).ready(function() {
    if (typeof midgardCreate === 'undefined') {
        midgardCreate = {};
    }
    midgardCreate.checkCapability = function(capability) {
        if (capability === 'contentEditable') {
            if (navigator.userAgent.match(/iPhone/i)) {
                return false;
            }
            if (navigator.userAgent.match(/iPod/i)) {
                return false;
            }
            if (navigator.userAgent.match(/iPad/i)) {
                return false;
            }
            return true;
        }
        if (capability === 'fileUploads') {
            if (navigator.userAgent.match(/iPhone/i)) {
                return false;
            }
            if (navigator.userAgent.match(/iPod/i)) {
                return false;
            }
            if (navigator.userAgent.match(/iPad/i)) {
                return false;
            }
            if (typeof FileReader === 'undefined') {
                return false;
            }
            if (typeof FormData === 'undefined') {
                return false;
            }
            return Modernizr.draganddrop;
        }
        return Modernizr[capability];
    };
    midgardCreate.highlightcolor = '#67cc08';
    jQuery('body').toolbar();
    midgardCreate.objectManager.init();
    midgardCreate.Collections.init();
    midgardCreate.Image.init();
    midgardCreate.ImagePlaceholders.init();
    midgardCreate.Editable.init();
});
