<?php

if(!is_admin()) {
    wp_enqueue_style('ExiaCSS', get_template_directory_uri() . '/dist/main.css');
    wp_enqueue_script('ExiaJS', get_template_directory_uri() . '/dist/main.js');
}else{
    wp_enqueue_script('MetaBoxJS', get_template_directory_uri() . '/plugins/meta-boxes/meta-boxes.js');
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
    $output = '<div class="exia-gallery-placeholder" data-columns="'.$attr['columns'].'" data-light="'.($attr['light_mode'] === true?'true':'false').'">';
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


require_once __DIR__ . '/plugins/class-tgm-plugin-activation.php';
add_action( 'tgmpa_register', 'prefix_register_required_plugins' );
function prefix_register_required_plugins() {
    $plugins = [
        [
            'name'     => 'Meta Box',
            'slug'     => 'meta-box',
            'required' => true,
        ]
    ];
    $config  = [
        'id' => 'your-id',
    ];
    tgmpa( $plugins, $config );
}



require_once __DIR__ . '/plugins/meta-boxes/meta-boxes.php';

add_action( 'do_meta_boxes', 'remove_default_custom_fields_meta_box', 1, 3 );
function remove_default_custom_fields_meta_box( $post_type, $context, $post ) {
    remove_meta_box( 'postcustom', $post_type, $context );
}


add_filter( 'rest_prepare_post', function( $response, $post, $request ) {
  // Only do this for single post requests.
    global $post;
    // Get the so-called next post.
    $next = get_adjacent_post( false, '', false );
    // Get the so-called previous post.
    $previous = get_adjacent_post( false, '', true );
    // Format them a bit and only send id and slug (or null, if there is no next/previous post).
    $response->data['next'] = ( is_a( $next, 'WP_Post') ) ? array( "id" => $next->ID, "link" => get_permalink($next) ) : null;
    $response->data['previous'] = ( is_a( $previous, 'WP_Post') ) ? array( "id" => $previous->ID, "link" => get_permalink($previous) ) : null;
    return $response;
}, 10, 3 );