/*
	Strata by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var $window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		settings = {

			// Parallax background effect?
				parallax: true,

			// Parallax factor (lower = more intense, higher = less intense).
				parallaxFactor: 20

		};

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1800px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ '481px',   '736px'  ],
			xsmall:  [ null,      '480px'  ],
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Touch?
		if (browser.mobile) {

			// Turn on touch mode.
				$body.addClass('is-touch');

			// Height fix (mostly for iOS).
				window.setTimeout(function() {
					$window.scrollTop($window.scrollTop() + 1);
				}, 0);

		}

	// Footer.
		breakpoints.on('<=medium', function() {
			$footer.insertAfter($main);
		});

		breakpoints.on('>medium', function() {
			$footer.appendTo($header);
		});

	// Header.

		// Parallax background.

			// Disable parallax on IE (smooth scrolling is jerky), and on mobile platforms (= better performance).
				if (browser.name == 'ie'
				||	browser.mobile)
					settings.parallax = false;

			if (settings.parallax) {

				breakpoints.on('<=medium', function() {

					$window.off('scroll.strata_parallax resize.strata_parallax');
					$header.css({ 'background-position': '', 'background-size': '' });

				});

				// Scale the photo to cover the sidebar and pan it in proportion to
				// scroll progress, so it never runs out on a long page.
					var bg = { w: 3000, h: 3857 },
						bgImg = new Image();

					bgImg.onload = function() {
						bg.w = bgImg.naturalWidth;
						bg.h = bgImg.naturalHeight;
						$window.triggerHandler('scroll');
					};
					bgImg.src = 'images/bg.jpg';

					var parallax = function() {
						var hw = $header.outerWidth(), hh = $header.outerHeight(),
							w = hw * 1.5, h = w * bg.h / bg.w;

						if (h < hh * 1.15) { h = hh * 1.15; w = h * bg.w / bg.h; }

						var max = $(document).height() - $window.height(),
							p = max > 0 ? Math.min(1, Math.max(0, $window.scrollTop() / max)) : 0;

						$header.css({
							'background-size': 'auto, ' + w + 'px ' + h + 'px',
							'background-position': 'left top, left ' + (-p * (h - hh)) + 'px'
						});
					};

				breakpoints.on('>medium', function() {

					$window.on('scroll.strata_parallax resize.strata_parallax', parallax);
					parallax();

				});

				$window.on('load', function() {
					$window.triggerHandler('scroll');
				});

			}

	// Main Sections: Two.

		// Lightbox gallery.
			$window.on('load', function() {

				$('#two').poptrox({
					caption: function($a) { return $a.next('h3').text(); },
					overlayColor: '#2c2c2c',
					overlayOpacity: 0.85,
					popupCloserText: '',
					popupLoaderText: '',
					selector: '.work-item a.image',
					usePopupCaption: true,
					usePopupDefaultStyling: false,
					usePopupEasyClose: false,
					usePopupNav: true,
					windowMargin: (breakpoints.active('<=small') ? 0 : 50)
				});

			});

})(jQuery);