// Viewer Logic
(function () {
    // Determine Base Path (for GitHub Pages)
    // If path contains /class_notes/, that's our base.
    const path = window.location.pathname;
    const isGithub = path.includes('/class_notes/');
    const BASE_URL = isGithub ? '/class_notes/' : '/';

    const state = {
        mode: 'default',
        src: '',
        download: '',
        currentSlide: 1,
        totalSlides: 1,
        prefix: 'Slide',
        ext: '.jpg'
    };

    // Helper to fix paths
    function withBase(url) {
        if (!url) return '';
        if (url.startsWith('http')) return url;

        // Remove leading slash if base ends with slash
        const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
        const cleanBase = BASE_URL.endsWith('/') ? BASE_URL : BASE_URL + '/';

        // If already prefixed, return
        if (url.startsWith(cleanBase)) return url;
        if (url.startsWith('/class_notes/')) return url; // Hardcoded safety

        return cleanBase + cleanUrl;
    }

    function init() {
        const params = new URLSearchParams(window.location.search);

        state.mode = params.get('mode') || 'default';
        state.src = params.get('src') || '';
        state.download = withBase(params.get('download') || '');
        state.count = parseInt(params.get('count')) || 1;
        state.prefix = params.get('prefix') || 'Slide';
        state.ext = params.get('ext') || '.jpg';
        state.totalSlides = state.count;

        // Update Download Button
        const dlBtn = document.getElementById('download-btn');
        if (state.download) {
            dlBtn.href = state.download;
            dlBtn.style.display = 'inline-block';
        } else {
            dlBtn.style.display = 'none';
        }

        if (state.mode === 'image') {
            setupImageMode();
        } else {
            document.getElementById('image-mode').style.display = 'none';
            document.getElementById('message').innerText = "Only Image Mode is supported in this static version.";
        }
    }

    function setupImageMode() {
        document.getElementById('image-mode').style.display = 'flex';
        renderSidebar();
        updateMainSlide();

        // Bind Controls
        document.getElementById('prev-btn').addEventListener('click', prevSlide);
        document.getElementById('next-btn').addEventListener('click', nextSlide);
    }

    function renderSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.innerHTML = '';

        for (let i = 1; i <= state.totalSlides; i++) {
            const el = document.createElement('div');
            el.className = 'sidebar-item';
            el.dataset.slide = i;
            el.innerHTML = `
                <span class="sidebar-num">${i}</span>
                <img src="${getSlideSrc(i)}" class="sidebar-thumb" loading="lazy">
            `;
            el.onclick = () => goToSlide(i);
            sidebar.appendChild(el);
        }
    }

    function getSlideSrc(n) {
        let base = state.src;
        if (base && !base.endsWith('/')) base += '/';
        const src = `${base}${state.prefix}${n}${state.ext}`;
        return withBase(src);
    }

    function updateMainSlide() {
        // Update Image
        const img = document.getElementById('main-image');
        img.src = getSlideSrc(state.currentSlide);

        // Update Counter
        document.getElementById('slide-counter').innerText = `${state.currentSlide} / ${state.totalSlides}`;

        // Update Sidebar Active state
        document.querySelectorAll('.sidebar-item').forEach(el => {
            el.classList.toggle('active', parseInt(el.dataset.slide) === state.currentSlide);
        });

        // Scroll Sidebar
        const active = document.querySelector('.sidebar-item.active');
        if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Update Buttons
        document.getElementById('prev-btn').disabled = state.currentSlide <= 1;
        document.getElementById('next-btn').disabled = state.currentSlide >= state.totalSlides;

        // Preload next
        if (state.totalSlides > state.currentSlide) {
            new Image().src = getSlideSrc(state.currentSlide + 1);
        }
    }

    function nextSlide() {
        if (state.currentSlide < state.totalSlides) {
            state.currentSlide++;
            updateMainSlide();
        }
    }

    function prevSlide() {
        if (state.currentSlide > 1) {
            state.currentSlide--;
            updateMainSlide();
        }
    }

    function goToSlide(n) {
        state.currentSlide = n;
        updateMainSlide();
    }

    // Run
    window.addEventListener('DOMContentLoaded', init);

})();
