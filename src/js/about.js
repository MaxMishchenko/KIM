$(function () {
    const wrapper = $('.health__video-wrapper');

    wrapper.on('click', '.health__video-play', function () {
        const parent = $(this).closest('.health__video-wrapper');
        const video = parent.find('.health__video-element')[0];

        parent.find('.health__video-preview').fadeOut(300);
        $(video).fadeIn(300);
        video.play();
    });
});