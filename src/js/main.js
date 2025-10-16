//  Mobile burger menu //
const $burger = $('#burger-menu');
$burger.on('click', function () {
    $(this).toggleClass('close');
    $('#mobileMenu').toggleClass('open');
    $('body').toggleClass('lock');
    $('.header').toggleClass('open');

    if ($('#mobileMenuDropdownChevron').hasClass('open')) {
        $('#mobileMenuDropdownBtn').trigger('click');
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

    $(document).on('click', '.btn--more-js', function (e) {
        e.preventDefault();

        const $btn = $(this);
        const $parent = $btn.parent();
        const $wrap = $parent.find('.more-wrap');
        const $p = $wrap.find('p');
        const $p1 = $p.eq(0);
        const $p2 = $p.eq(1);
        const isOpen = $btn.data('open') === true;

        const collapsedH = $wrap.data('collapsedH') || $p1.outerHeight();
        const h1Unclamped = measureUnclampedP1Height($p1);

        let h2 = 0;
        if ($p2.length) {
            const wasHidden = $p2.is(':hidden');
            if (wasHidden) $p2.show();
            h2 = $p2.outerHeight();
            if (wasHidden) $p2.hide();
        }

        const expandedH = h1Unclamped + h2;

        if (!isOpen) {
            $p1.css({
                display: 'block',
                overflow: 'visible',
                '-webkit-box-orient': 'unset',
                '-webkit-line-clamp': 'unset'
            });
            if ($p2.length) $p2.show();

            $wrap
                .stop(true, true)
                .css('height', collapsedH)
                .animate({ height: expandedH }, 300, function () {
                    $(this).css('height', 'auto');
                });

            $btn.data('open', true).text('Hide').attr('aria-expanded', 'true');
        } else {
            const currentH = $wrap.outerHeight();

            $wrap
                .stop(true, true)
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

            $btn.data('open', false).text('More details').attr('aria-expanded', 'false');
        }
    });
});

// Autoclose button "More details" //
$(function () {
    const $sliderBtns = $('.swiper-button-prev, .swiper-button-next');
    $sliderBtns.on('click', function () {
        $('.btn--more-js[aria-expanded="true"]').trigger('click');
    });
});

// Testimonials slider //
const swiper = new Swiper('.swiper', {
    direction: 'horizontal',
    loop: true,
    slidesPerView: 1,
    allowTouchMove: true,
    autoplay: false,
    effect: 'slide',
    spaceBetween: 32,
    centeredSlides: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
    },
    a11y: {
        prevSlideMessage: 'Previous slide',
        nextSlideMessage: 'Next slide'
    }
});

// Main popup //
$(function () {
    const popup = $('#popup');
    const closeBtn = popup.find('.popup__close');
    const delayBeforeFirstPopup = 10 * 1000; // 10 секунд перед першим показом
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