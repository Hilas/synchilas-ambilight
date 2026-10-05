// Runs in every frame, but only acts inside iframes embedded by sync.hilas.cl.
// Reads the biggest <video> of the frame and sends a tiny frame to the parent page.
(() => {
	if (window === top) return;
	const PARENT = "https://sync.hilas.cl";
	const anc = location.ancestorOrigins;
	let topOrigin = "";
	if (anc && anc.length) topOrigin = anc[anc.length - 1];
	else if (document.referrer) {
		try { topOrigin = new URL(document.referrer).origin; } catch (e) {}
	}
	if (topOrigin !== PARENT) return;

	const W = 96, H = 54;
	const c = document.createElement("canvas");
	c.width = W;
	c.height = H;
	const x = c.getContext("2d", {willReadFrequently: true});
	let lastPing = 0, timer = 0;

	function bestVideo() {
		let best = null, area = 0;
		for (const v of document.querySelectorAll("video")) {
			if (v.readyState < 2 || !v.videoWidth) continue;
			const r = v.getBoundingClientRect();
			const a = r.width * r.height;
			if (a > area) { area = a; best = v; }
		}
		return best;
	}

	function tick() {
		if (Date.now() - lastPing > 5000) { clearInterval(timer); timer = 0; return; }
		const v = bestVideo();
		if (!v) return;
		try {
			x.drawImage(v, 0, 0, W, H);
			const img = x.getImageData(0, 0, W, H);
			window.top.postMessage({ambilight: "frame", w: W, h: H, buf: img.data.buffer}, PARENT, [img.data.buffer]);
		} catch (e) {
			// tainted or protected video: nothing to send
		}
	}

	window.addEventListener("message", e => {
		if (e.origin !== PARENT || e.data?.ambilight !== "on") return;
		lastPing = Date.now();
		if (!timer) timer = setInterval(tick, 66);
	});

	window.top.postMessage({ambilight: "ready"}, PARENT);
})();
