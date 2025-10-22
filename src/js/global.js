//  Mobile burger menu //
const $burger = $('#burger-menu');
const $mobileMenu = $('#mobileMenu');
const $body = $('body');
const $header = $('.header');
const $dropdownBtn = $('#mobileMenuDropdownBtn');
const $dropdownChevron = $('#mobileMenuDropdownChevron');

$burger.on('click', function () {
    $(this).toggleClass('close');
    $mobileMenu.toggleClass('open');
    $body.toggleClass('lock');
    $header.toggleClass('open');

    if ($dropdownChevron.hasClass('open')) {
        $dropdownBtn.trigger('click');
    }
});

$(window).on('resize', function () {
    if (window.innerWidth >= 1024) {
        $burger.removeClass('close');
        $mobileMenu.removeClass('open');
        $body.removeClass('lock');
        $header.removeClass('open');

        if ($dropdownChevron.hasClass('open')) {
            $dropdownBtn.trigger('click');
        }
    }
});

// Mobile menu dropdown list //
$('#mobileMenuDropdownBtn').click(function () {
    $('#mobileMenuDropdownChevron').toggleClass('open');
    $('#mobileMenuDropdownList').slideToggle();
});

// Header menu dropdown //
$(function() {
    const $item = $('#dropdownServices');
    const $menu = $('#dropdownServicesList');
    const $icon = $('#dropdownServicesIcon');

    $item.hover(
        function() {
            $menu.addClass('visible');
            $icon.addClass('rotated');
        },
        function() {
            setTimeout(() => {
                if (!$menu.is(':hover') && !$item.is(':hover')) {
                    $menu.removeClass('visible');
                    $icon.removeClass('rotated');
                }
            }, 100);
        }
    );

    $menu.hover(
        function() {
            $menu.addClass('visible');
            $icon.addClass('rotated');
        },
        function() {
            $menu.removeClass('visible');
            $icon.removeClass('rotated');
        }
    );
});

$(function() {
    const $item = $('#dropdownResources');
    const $menu = $('#dropdownResourcesList');
    const $icon = $('#dropdownResourcesIcon');

    $item.hover(
        function() {
            $menu.addClass('visible');
            $icon.addClass('rotated');
        },
        function() {
            setTimeout(() => {
                if (!$menu.is(':hover') && !$item.is(':hover')) {
                    $menu.removeClass('visible');
                    $icon.removeClass('rotated');
                }
            }, 100);
        }
    );

    $menu.hover(
        function() {
            $menu.addClass('visible');
            $icon.addClass('rotated');
        },
        function() {
            $menu.removeClass('visible');
            $icon.removeClass('rotated');
        }
    );
});