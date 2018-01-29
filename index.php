<?php
    $data = [
        'name' => get_bloginfo('name'),
        'description' => get_bloginfo('description'),
        'adminBar' => is_admin_bar_showing()
    ];

    // custom logo
    $custom_logo_id = get_theme_mod( 'custom_logo' );
    $image = wp_get_attachment_image_src( $custom_logo_id , 'full' );
    if($image && count($image) > 0){
        $data['customLogo'] = $image[0];
    }
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
    <head>
        <meta charset="<?php bloginfo( 'charset' ); ?>" />
        <link rel="profile" href="http://gmpg.org/xfn/11" />
        <link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />
        <?php wp_head(); ?>
        <script>
            window.Exia = <?php echo json_encode($data); ?>;
        </script>
    </head>
    <body>
        <div id="application"></div>
    </body>
    <footer>
        <?php wp_footer(); ?>
    </footer>
</html>
