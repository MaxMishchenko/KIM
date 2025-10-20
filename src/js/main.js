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

// Button "More details" //
$(function () {
    const $moreBtns = $('.btn--more-js');

    $moreBtns.each(function () {
        const $btn = $(this);
        const $parent = $btn.parent();
        const $p = $parent.find('p');
        const $p1 = $p.eq(0);
        const $p2 = $p.eq(1);

        if (!$p1.length) return;

        if (!$parent.find('.more-wrap').length) {
            $p1.add($p2).wrapAll('<div class="more-wrap" />');
        }

        const $wrap = $parent.find('.more-wrap').css({ overflow: 'hidden' });
        if ($p2.length) $p2.hide();

        const collapsedH = $p1.outerHeight();
        $wrap.data('collapsedH', collapsedH);
    });

    function measureUnclampedP1Height($p1) {
        const $clone = $p1
            .clone()
            .css({
                position: 'absolute',
                visibility: 'hidden',
                height: 'auto',
                display: 'block',
                overflow: 'visible',
                '-webkit-line-clamp': 'unset',
                '-webkit-box-orient': 'unset'
            })
            .appendTo(document.body);

        const h = $clone.outerHeight();
        $clone.remove();
        return h;
    }
});

// Main popup //
$(function () {
    const popup = $('#popup');
    const closeBtn = popup.find('.popup__close');
    const delayBeforeFirstPopup = 1 * 1000; // 10 секунд перед першим показом
    const intervalMinutes = 15 * 60 * 1000;  // 15 хвилин між показами
    const storageKey = 'popupClosedAt';

    function showPopup() {
        if ($('body').hasClass('lock')) return;

        $('body').addClass('lock');
        popup.addClass('active');
        closeBtn.focus();
    }

    function hidePopup() {
        $('body').removeClass('lock');
        popup.removeClass('active');
        localStorage.setItem(storageKey, Date.now());
    }

    function shouldShowPopup() {
        const lastClosed = localStorage.getItem(storageKey);
        if (!lastClosed) return true;
        const diff = Date.now() - Number(lastClosed);
        return diff >= intervalMinutes;
    }

    closeBtn.on('click', hidePopup);

    function tryShowPopup() {
        if ($('body').hasClass('lock')) {
            setTimeout(tryShowPopup, 10 * 1000);
            return;
        }
        if (shouldShowPopup()) showPopup();
    }

    const lastClosed = localStorage.getItem(storageKey);

    if (!lastClosed) {
        setTimeout(tryShowPopup, delayBeforeFirstPopup);
    } else {
        const diff = Date.now() - Number(lastClosed);

        if (diff >= intervalMinutes) {
            setTimeout(tryShowPopup, delayBeforeFirstPopup);
        } else {
            const timeLeft = intervalMinutes - diff;
            setTimeout(tryShowPopup, timeLeft + delayBeforeFirstPopup);
        }
    }

    setInterval(() => {
        const isPopupVisible = popup.hasClass('active');
        if (!isPopupVisible && shouldShowPopup() && !$('body').hasClass('lock')) {
            setTimeout(showPopup, delayBeforeFirstPopup);
        }
    }, 10 * 1000);
});

// Mobile menu dropdown list //
$('#mobileMenuDropdownBtn').click(function () {
    $('#mobileMenuDropdownChevron').toggleClass('open');
    $('#mobileMenuDropdownList').slideToggle();
});

// Testimonials slider //
$(function () {
    const swiper = new Swiper('.swiper', {
        direction: 'horizontal',
        loop: true,
        slidesPerView: 1,
        slidesPerGroup: 1,
        allowTouchMove: true,
        spaceBetween: 32,
        centeredSlides: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        a11y: {
            prevSlideMessage: 'Previous slide',
            nextSlideMessage: 'Next slide'
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
                slidesPerGroup: 2,
                centeredSlides: false
            }
        },
        on: {
            slideChangeTransitionStart() {
                $('.btn--more-js[aria-expanded="true"]').each(function () {
                    $(this).trigger('click');
                });
            }
        }
    });

    $(document).on('click', '.btn--more-js', function (e) {
        e.preventDefault();

        const $btn = $(this);
        const $parent = $btn.parent();
        const $wrap = $parent.find('.more-wrap');
        const $p1 = $wrap.find('p').eq(0);
        const $p2 = $wrap.find('p').eq(1);
        const isOpen = $btn.attr('data-open') === 'true';

        if (!$wrap.data('collapsedH')) {
            const wasAuto = $wrap.css('height') === 'auto';
            if (wasAuto) $wrap.css('height', $wrap[0].scrollHeight);
            const collapsedH = $wrap.outerHeight();
            $wrap.data('collapsedH', collapsedH);
            if (wasAuto) $wrap.css('height', '');
        }

        const collapsedH = $wrap.data('collapsedH');

        $p1.css({
            display: 'block',
            overflow: 'visible',
            '-webkit-box-orient': 'unset',
            '-webkit-line-clamp': 'unset'
        });
        if ($p2.length) $p2.show();

        const expandedH = $wrap[0].scrollHeight;

        if (!isOpen) {
            $wrap.stop(true, true)
                .css('height', collapsedH)
                .animate({ height: expandedH }, 300, function () {
                    $(this).css('height', 'auto');
                });

            $btn.attr({
                'data-open': 'true',
                'aria-expanded': 'true'
            }).text('Hide');
        } else {
            const currentH = $wrap.outerHeight();
            $wrap.stop(true, true)
                .css('height', currentH)
                .animate({ height: collapsedH }, 300, function () {
                    $p1.css({
                        display: '-webkit-box',
                        overflow: 'hidden',
                        '-webkit-box-orient': 'vertical',
                        '-webkit-line-clamp': '14'
                    });
                    if ($p2.length) $p2.hide();
                    $(this).css('height', '');
                });

            $btn.attr({
                'data-open': 'false',
                'aria-expanded': 'false'
            }).text('More details');
        }
    });
});

$(function () {
    function toggleMoreButtons() {
        $('.testimonials__slide').each(function () {
            const $slide = $(this);
            const $texts = $slide.find('.testimonials__text');
            const $btn = $slide.find('.btn--more-js');

            if ($texts.length === 1) {
                const textHeight = $texts.eq(0).outerHeight();

                if (textHeight < 336) {
                    $btn.addClass('hidden');
                } else {
                    $btn.removeClass('hidden');
                }
            } else {
                $btn.removeClass('hidden');
            }
        });
    }

    toggleMoreButtons();

    let resizeTimer;
    $(window).on('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(toggleMoreButtons, 150);
    });
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