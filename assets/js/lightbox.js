/* Click a project image or clip to view it large over a dimmed page.
   Close with the backdrop, the x button or Esc. */
(function() {

	var overlay = document.createElement('div');
	overlay.className = 'lightbox-overlay';
	overlay.innerHTML =
		'<button type="button" class="lightbox-close" aria-label="Close">&times;</button>' +
		'<figure class="lightbox-figure"><div class="lightbox-media"></div><figcaption></figcaption></figure>';
	overlay.setAttribute('role', 'dialog');
	overlay.setAttribute('aria-modal', 'true');

	var holder = overlay.querySelector('.lightbox-media'),
		caption = overlay.querySelector('figcaption'),
		lastFocus = null;

	function fit(el, w, h) {
		if (w && h) el.style.setProperty('--ar', w / h);
	}

	function open(src, kind, title, startAt, withSound) {
		var el;
		holder.innerHTML = '';

		if (kind === 'video') {
			el = document.createElement('video');
			el.src = src;
			el.loop = !withSound;
			el.muted = !withSound;
			el.autoplay = true;
			el.controls = true;
			el.playsInline = true;
			el.setAttribute('controlslist', 'nodownload noremoteplayback');
			el.disablePictureInPicture = true;
			el.addEventListener('loadedmetadata', function() {
				fit(el, el.videoWidth, el.videoHeight);
				if (startAt) el.currentTime = startAt;
			});
		}
		else {
			el = document.createElement('img');
			el.alt = title || '';
			el.addEventListener('load', function() { fit(el, el.naturalWidth, el.naturalHeight); });
			el.src = src;
		}

		holder.appendChild(el);
		caption.textContent = title || '';
		caption.style.display = title ? '' : 'none';

		lastFocus = document.activeElement;
		document.documentElement.classList.add('lightbox-open');
		overlay.classList.add('visible');
		overlay.querySelector('.lightbox-close').focus({ preventScroll: true });
	}

	function close() {
		if (!overlay.classList.contains('visible')) return;
		overlay.classList.remove('visible');
		document.documentElement.classList.remove('lightbox-open');
		var v = holder.querySelector('video');
		if (v) v.pause();
		window.setTimeout(function() {
			if (!overlay.classList.contains('visible')) holder.innerHTML = '';
		}, 250);
		if (lastFocus) lastFocus.focus({ preventScroll: true });
	}

	function titleOf(el) {
		var card = el.closest('.work-item'),
			h = card && card.querySelector('h3');
		return h ? h.textContent.trim() : '';
	}

	document.addEventListener('DOMContentLoaded', function() {

		document.body.appendChild(overlay);

		overlay.addEventListener('click', function(e) {
			if (!e.target.closest('.lightbox-media')) close();
		});

		document.addEventListener('keydown', function(e) {
			if (e.key === 'Escape') close();
		});

		// Card media. The theme's hover overlay sits on top of the clip, so listen on its wrapper.
		document.querySelectorAll('.work-item .image.fit').forEach(function(box) {
			var el = box.querySelector('video, img');
			if (!el) return;
			box.addEventListener('click', function(e) {
				e.preventDefault();
				if (el.tagName === 'VIDEO') {
					var s = el.currentSrc || (el.querySelector('source') || {}).src;
					open(s, 'video', titleOf(box), el.currentTime, false);
				}
				else open(el.currentSrc || el.src, 'image', titleOf(box));
			});
		});

		// Links to a full video (e.g. ORIO's system video) play in the same viewer, with sound.
		document.querySelectorAll('a.lightbox').forEach(function(a) {
			a.addEventListener('click', function(e) {
				e.preventDefault();
				open(a.getAttribute('href'), 'video', titleOf(a), 0, true);
			});
		});

	});

})();
