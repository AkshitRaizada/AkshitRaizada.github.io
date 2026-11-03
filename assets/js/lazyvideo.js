/* Card clips download and play only when they come near the screen, and pause once scrolled away,
   so the page doesn't pull every video at load. The <video> tags carry preload="none" and no autoplay. */
(function() {

	function play(v) {
		var p = v.play();
		if (p && p.catch) p.catch(function() {});
	}

	document.addEventListener('DOMContentLoaded', function() {

		var videos = document.querySelectorAll('.work-item video');

		if (!('IntersectionObserver' in window)) {
			videos.forEach(play);
			return;
		}

		var watcher = new IntersectionObserver(function(entries) {
			entries.forEach(function(e) {
				if (e.isIntersecting) play(e.target);
				else if (!e.target.paused) e.target.pause();
			});
		}, { rootMargin: '400px 0px' });

		videos.forEach(function(v) { watcher.observe(v); });
	});

})();
