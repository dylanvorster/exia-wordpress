<?php
    $data = [
        'name' => get_bloginfo('name'),
        'description' => get_bloginfo('description'),
        'adminBar' => is_admin_bar_showing(),
        'menus' => []
    ];

    // custom logo
    $custom_logo_id = get_theme_mod( 'custom_logo' );
    $image = wp_get_attachment_image_src( $custom_logo_id , 'full' );
    if($image && count($image) > 0){
        $data['customLogo'] = $image[0];
    }

    //wp_get_nav_menu_items($name)
    $menus = wp_get_nav_menus();
    foreach($menus as $menu){
        $data['menus'][$menu->name] = [];
        foreach(wp_get_nav_menu_items($menu) as $menuItem){
            $data['menus'][$menu->name][] = [
                'name' => $menuItem->title,
                'link' => $menuItem->url
            ];
        }
    }
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
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
