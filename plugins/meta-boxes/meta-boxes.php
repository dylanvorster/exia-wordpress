<?php

add_filter('rwmb_meta_boxes', function ($meta_boxes) {

    $prefix = 'exia_mb_';

    /**
     * 1.2 - Video format
     * -----------------------------------------------------------------------------
     */
    $meta_boxes[] = array(
        'id' => "{$prefix}video_format",
        'title' => esc_html__('Video Format', 'exia'),
        'pages' => array('post'),
        'context' => 'normal',
        'priority' => 'high',
        'fields' => array(

            /**
             * 1.2.1 - Thumbnail type
             * -----------------------------------------------------------------------------
             */
            array(
                'name' => esc_html__('Thumbnail type', 'exia'),
                'id' => "{$prefix}video_thumb_type",
                'type' => 'select_advanced',
                'options' => array(
                    'iframe' => esc_html__('Video player (Iframe)', 'exia'),
                    'featured_image' => esc_html__('Featured Image', 'exia'),
                ),
                'multiple' => false,
                'placeholder' => esc_html__('Video player / Featured Image', 'exia'),
            ),

            /**
             * 1.2.2 - Video URL
             * -----------------------------------------------------------------------------
             */
            array(
                'name' => esc_html__('Video URL', 'exia'),
                'id' => "{$prefix}video_url",
                'desc' => esc_html__('Insert a link (URL) on a video from the popular video hosting (YouTube, Vimeo, and etc.)', 'exia'),
                'type' => 'oembed',
            ),

        )
    );


    /**
     * 1.3 - Audio format
     * -----------------------------------------------------------------------------
     */
    $meta_boxes[] = array(
        'id' => "{$prefix}audio_format",
        'title' => esc_html__('Audio Format', 'exia'),
        'pages' => array('post'),
        'context' => 'normal',
        'priority' => 'high',
        'fields' => array(

            /**
             * 1.3.1 - Thumbnail type
             * -----------------------------------------------------------------------------
             */
            array(
                'name' => esc_html__('Thumbnail type', 'exia'),
                'id' => "{$prefix}audio_thumb_type",
                'type' => 'select_advanced',
                'options' => array(
                    'iframe' => esc_html__('Audio player (Iframe)', 'exia'),
                    'featured_image' => esc_html__('Featured Image', 'exia'),
                ),
                'multiple' => false,
                'placeholder' => esc_html__('Audio player / Featured Image', 'exia'),
            ),

            /**
             * 1.3.2 - Audio URL (from https://soundcloud.com)
             * -----------------------------------------------------------------------------
             */
            array(
                'name' => esc_html__('SoundCloud URL', 'exia'),
                'id' => "{$prefix}audio_url",
                'desc' => esc_html__('Insert a link (URL) on a song from the SoundCloud service', 'exia'),
            ),

        )
    );
    
    return $meta_boxes;
});


add_action( 'rest_api_init', function () {
    register_rest_field( 'post', 'metabox_soundcloud', array(
        'get_callback' => function( $post_arr ) {
            if($post_arr['format'] === 'audio'){
                return rwmb_meta('exia_mb_audio_url' , [], $post_arr['id'] );
            }
        },
        'schema' => array(
            'description' => __( 'Soundcloud URL.' ),
            'type'        => 'string'
        ),
    ) );

    register_rest_field( 'post', 'metabox_video', array(
            'get_callback' => function( $post_arr ) {
                if($post_arr['format'] === 'video'){
                    return rwmb_meta('exia_mb_video_url' , [], $post_arr['id'] );
                }
            },
            'schema' => array(
                'description' => __( 'Youtube URL.' ),
                'type'        => 'string'
            ),
        ) );
} );