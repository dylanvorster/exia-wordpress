<?php

if(!is_admin()) {
    wp_enqueue_style('GundamCSS', get_template_directory_uri() . '/dist/main.css');
    wp_enqueue_script('GundamJS', get_template_directory_uri() . '/dist/main.js');
}

add_theme_support('automatic-feed-links');

//pages should be prefixed
add_action( 'init', 'custom_page_rules' );
function custom_page_rules() {
    global $wp_rewrite;
    $wp_rewrite->page_structure = $wp_rewrite->root . 'page/%pagename%';
}

add_theme_support('post-formats', [
    'image', 'gallery', 'video', 'audio'
]);

//allow a custom logo
add_theme_support( 'custom-logo', [
    'height'      => 100,
    'width'       => 400,
    'flex-height' => true,
    'flex-width'  => true,
    'header-text' => array( 'site-title', 'site-description' ),
]);

add_theme_support( 'post-thumbnails' );


add_action('print_media_templates', function(){
?>
<script type="text/html" id="tmpl-custom-gallery-setting">
    <h3 style="z-index: -1;">___________________________________________________________________________________________</h3>
    <h3>Custom Settings</h3>

    <label class="setting">
        <span><?php _e('Light Mode'); ?></span>
        <input type="checkbox" data-setting="light_mode">
    </label>

</script>

<script>
    jQuery(document).ready(function(){
        _.extend(wp.media.gallery.defaults, {
            light_mode: false,
        });

        wp.media.view.Settings.Gallery = wp.media.view.Settings.Gallery.extend({
            template: function(view){
              return wp.media.template('gallery-settings')(view)
                   + wp.media.template('custom-gallery-setting')(view);
            }
        });

    });
</script>
<?php

});



add_filter('post_gallery','customFormatGallery',10,2);
function customFormatGallery($string,$attr){
    $output = '<div class="exia-gallery-placeholder" data-light="'.($attr['light_mode'] === true?'true':'false').'">';
    $posts = get_posts(array('include' => $attr['ids'],'post_type' => 'attachment'));
    foreach($posts as $imagePost){
        $output .= '<div
            data-id="'.$imagePost->ID.'"
            data-medium="'.wp_get_attachment_image_src($imagePost->ID, 'medium')[0].'"
            data-large="'.wp_get_attachment_image_src($imagePost->ID, 'large')[0].'"
         ></div>';

    }
    return $output.'</div>';
}
