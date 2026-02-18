// Viewer Logic - EduVault (PowerPoint-style)
(function () {
    'use strict';

    // Determine Base Path (for GitHub Pages)
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
        ext: '.jpg',
        loading: false,
        title: 'Presentation'
    };

    // DOM Elements cache
    let elements = {};

    // Helper to fix paths for GitHub Pages
    function withBase(url) {
        if (!url) return '';
        if (url.startsWith('http')) return url;

        const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
        const cleanBase = BASE_URL.endsWith('/') ? BASE_URL : BASE_URL + '/';

        if (url.startsWith(cleanBase)) return url;
        if (url.startsWith('/class_notes/')) return url;

        return cleanBase + cleanUrl;
    }

    // Extract title from source path
    function extractTitle(src) {
        if (!src) return 'Presentation';
        const parts = src.split('/').filter(p => p);
        // Try to find meaningful name
        for (let i = parts.length - 1; i >= 0; i--) {
            const part = parts[i];
            if (part && !part.includes('_slides') && !part.includes('slides') && part !== 'public' && part !== 'subjects') {
                return part.replace(/_/g, ' ').replace(/(\w+)(\d+)/gi, '$1 $2').trim();
            }
        }
        return 'Presentation';
    }

    function init() {
        // Cache DOM elements with new IDs
        elements = {
            slidesPanel: document.getElementById('slidesPanel'),
            slidesList: document.getElementById('slidesList'),
            mainSlide: document.getElementById('mainSlide'),
            slideFrame: document.getElementById('slideFrame'),
            currentSlideNum: document.getElementById('currentSlide'),
            totalSlidesNum: document.getElementById('totalSlides'),
            prevBtn: document.getElementById('prevBtn'),
            nextBtn: document.getElementById('nextBtn'),
            downloadBtn: document.getElementById('download-btn'),
            message: document.getElementById('message'),
            slideLoading: document.getElementById('slideLoading'),
            statusBar: document.getElementById('statusBar'),
            presentationTitle: document.getElementById('presentationTitle'),
            slideInfo: document.getElementById('slideInfo')
        };

        // Parse URL parameters
        const params = new URLSearchParams(window.location.search);

        state.mode = params.get('mode') || 'default';
        state.src = params.get('src') || '';
        state.download = withBase(params.get('download') || '');
        state.count = parseInt(params.get('count')) || 1;
        state.prefix = params.get('prefix') || 'Slide';
        state.ext = params.get('ext') || '.jpg';
        state.totalSlides = state.count;
        state.title = extractTitle(state.src);

        // Update title
        if (elements.presentationTitle) {
            elements.presentationTitle.textContent = state.title;
        }
        document.title = `${state.title} - EduVault`;

        // Update Download Button
        if (state.download && elements.downloadBtn) {
            elements.downloadBtn.href = state.download;
            elements.downloadBtn.style.display = 'inline-flex';
        }

        if (state.mode === 'image') {
            setupImageMode();
        } else {
            showMessage("Only Image Mode is supported in this static version.");
        }

        // Keyboard navigation
        document.addEventListener('keydown', handleKeydown);
    }

    function showMessage(text) {
        if (elements.message) {
            elements.message.textContent = text;
            elements.message.style.display = 'flex';
        }
    }

    function hideMessage() {
        if (elements.message) {
            elements.message.style.display = 'none';
        }
    }

    function showLoading(show) {
        state.loading = show;
        if (elements.slideLoading) {
            elements.slideLoading.style.display = show ? 'flex' : 'none';
        }
        if (elements.mainSlide) {
            elements.mainSlide.style.opacity = show ? '0.3' : '1';
            elements.mainSlide.style.transition = 'opacity 0.2s';
        }
    }

    function setupImageMode() {
        // Show the panels
        if (elements.slidesPanel) {
            elements.slidesPanel.style.display = 'flex';
        }
        if (elements.statusBar) {
            elements.statusBar.style.display = 'flex';
        }
        
        hideMessage();
        renderThumbnails();
        updateMainSlide();

        // Bind Navigation Controls
        if (elements.prevBtn) {
            elements.prevBtn.addEventListener('click', prevSlide);
        }
        if (elements.nextBtn) {
            elements.nextBtn.addEventListener('click', nextSlide);
        }

        // Image load handlers
        if (elements.mainSlide) {
            elements.mainSlide.addEventListener('load', () => {
                showLoading(false);
            });
            elements.mainSlide.addEventListener('error', () => {
                showLoading(false);
            });
        }

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        if (elements.slideFrame) {
            elements.slideFrame.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            elements.slideFrame.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });
        }

        function handleSwipe() {
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }
    }

    function renderThumbnails() {
        if (!elements.slidesList) return;
        
        elements.slidesList.innerHTML = '';

        for (let i = 1; i <= state.totalSlides; i++) {
            const thumb = document.createElement('div');
            thumb.className = 'slide-thumb';
            thumb.dataset.slide = i;
            thumb.innerHTML = `
                <span class="slide-thumb-num">${i}</span>
                <img src="${getSlideSrc(i)}" loading="lazy" alt="Slide ${i}">
            `;
            thumb.addEventListener('click', () => goToSlide(i));
            elements.slidesList.appendChild(thumb);
        }
    }

    function getSlideSrc(n) {
        let base = state.src;
        if (base && !base.endsWith('/')) base += '/';
        const src = `${base}${state.prefix}${n}${state.ext}`;
        return withBase(src);
    }

    function updateMainSlide() {
        showLoading(true);

        // Update Image
        if (elements.mainSlide) {
            elements.mainSlide.src = getSlideSrc(state.currentSlide);
        }

        // Update Counter
        if (elements.currentSlideNum) {
            elements.currentSlideNum.textContent = state.currentSlide;
        }
        if (elements.totalSlidesNum) {
            elements.totalSlidesNum.textContent = state.totalSlides;
        }

        // Update Slide Info
        if (elements.slideInfo) {
            elements.slideInfo.textContent = `Slide ${state.currentSlide} of ${state.totalSlides}`;
        }

        // Update Thumbnails Active state
        const thumbs = document.querySelectorAll('.slide-thumb');
        thumbs.forEach(thumb => {
            const isActive = parseInt(thumb.dataset.slide) === state.currentSlide;
            thumb.classList.toggle('active', isActive);
        });

        // Scroll active thumbnail into view
        const activeThumb = document.querySelector('.slide-thumb.active');
        if (activeThumb) {
            activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Update Button States
        if (elements.prevBtn) {
            elements.prevBtn.disabled = state.currentSlide <= 1;
        }
        if (elements.nextBtn) {
            elements.nextBtn.disabled = state.currentSlide >= state.totalSlides;
        }

        // Preload adjacent slides
        preloadSlides();
    }

    function preloadSlides() {
        // Preload next slide
        if (state.currentSlide < state.totalSlides) {
            const nextImg = new Image();
            nextImg.src = getSlideSrc(state.currentSlide + 1);
        }
        // Preload previous slide
        if (state.currentSlide > 1) {
            const prevImg = new Image();
            prevImg.src = getSlideSrc(state.currentSlide - 1);
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
        if (n >= 1 && n <= state.totalSlides && n !== state.currentSlide) {
            state.currentSlide = n;
            updateMainSlide();
        }
    }

    function handleKeydown(e) {
        // Ignore if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        switch (e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
            case ' ':
            case 'PageDown':
                e.preventDefault();
                nextSlide();
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                prevSlide();
                break;
            case 'Home':
                e.preventDefault();
                goToSlide(1);
                break;
            case 'End':
                e.preventDefault();
                goToSlide(state.totalSlides);
                break;
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

