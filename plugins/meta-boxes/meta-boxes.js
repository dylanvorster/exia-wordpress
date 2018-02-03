jQuery.noConflict()(function($) {
    $(document).ready(function() {
        'use strict';

        function showMetaBox() {
            var
                $videoBox = $('#exia_mb_video_format'),
                $audioBox = $('#exia_mb_audio_format');

            // Video format box
            if ($('input#post-format-video').is(':checked')) {
                $videoBox.show();
            } else {
                $videoBox.hide();
            }

            // Audio format box
            if ($('input#post-format-audio').is(':checked')) {
                $audioBox.show();
            } else {
                $audioBox.hide();
            }
        }

        // start "showMetaBox" function
        showMetaBox();

        // formats click
        $('#post-formats-select input').on('click', function() {
            showMetaBox();
        });

    });
});
