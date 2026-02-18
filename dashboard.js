(function () {
    'use strict';

    // ============================================
    // Search Data - All searchable resources
    // ============================================
    const searchData = [
        // Subjects
        { type: 'subject', title: 'Machine Learning', subtitle: 'Subject', url: '/subjects/ML.html', icon: 'subject' },
        { type: 'subject', title: 'Operating Systems', subtitle: 'Subject', url: '/subjects/OS.html', icon: 'subject' },
        { type: 'subject', title: 'Web Technologies', subtitle: 'Subject', url: '/subjects/WT.html', icon: 'subject' },
        { type: 'subject', title: 'AI & Deep Learning', subtitle: 'Subject', url: '/subjects/AI_DL.html', icon: 'subject' },
        { type: 'subject', title: 'Cyber Security', subtitle: 'Subject', url: '/subjects/CS_CL.html', icon: 'subject' },
        { type: 'subject', title: 'Big Data Analytics', subtitle: 'Subject', url: '/subjects/BDA.html', icon: 'subject' },
        { type: 'subject', title: 'Basics of Entrepreneurship', subtitle: 'Subject', url: '/subjects/BOE.html', icon: 'subject' },
        
        // PDFs - General
        { type: 'pdf', title: 'ML Syllabus', subtitle: 'Machine Learning', url: '/public/subjects/ML_Syllabus.pdf', icon: 'pdf' },
        { type: 'pdf', title: 'WT Lab Manual', subtitle: 'Web Technologies', url: '/public/subjects/WT_LAB_9FC06.pdf', icon: 'pdf' },
        { type: 'pdf', title: 'OS/ML Lab Syllabus', subtitle: 'Operating Systems', url: '/public/subjects/OS_ML_LAB_SYLLABUS.pdf', icon: 'pdf' },
        
        // PDFs - Web Technologies
        { type: 'pdf', title: 'WT Unit 1 - HTML4 & CSS3', subtitle: 'Web Technologies', url: '/public/subjects/WT/Unit_1_HTML4_CSS3.pdf', icon: 'pdf' },
        { type: 'pdf', title: 'WT Unit 1 - HTML5 & CSS3', subtitle: 'Web Technologies', url: '/public/subjects/WT/Unit_1_HTML5_CSS3.pdf', icon: 'pdf' },
        { type: 'pdf', title: 'WT Unit 1 - Tailwind CSS', subtitle: 'Web Technologies', url: '/public/subjects/WT/Unit_1_TailwindCSS.pdf', icon: 'pdf' },
        { type: 'pdf', title: 'WT Unit 2 - JS Basics', subtitle: 'Web Technologies', url: '/public/subjects/WT/Unit_2_JS_Basics.pdf', icon: 'pdf' },
        { type: 'pdf', title: 'WT Unit 2 - JS Advanced', subtitle: 'Web Technologies', url: '/public/subjects/WT/Unit_2_JS_Advanced.pdf', icon: 'pdf' },
        { type: 'pdf', title: 'WT Unit 3 - Node.js', subtitle: 'Web Technologies', url: '/public/subjects/WT/Unit_3_Nodejs.pdf', icon: 'pdf' },
        { type: 'pdf', title: 'WT Unit 3 - MERN Stack', subtitle: 'Web Technologies', url: '/public/subjects/WT/Unit_3_MERN_STACK.pdf', icon: 'pdf' },
        
        // PDFs - Cyber Security
        { type: 'pdf', title: 'CS Unit 1 - Introduction', subtitle: 'Cyber Security', url: '/public/subjects/CS_CL/UNIT I.pdf', icon: 'pdf' },
        { type: 'pdf', title: 'CS Unit 1 - DES & Mode Operations', subtitle: 'Cyber Security', url: '/public/subjects/CS_CL/UNIT 1- DES^Jmode op^.pdf', icon: 'pdf' },
        { type: 'pdf', title: 'CS Unit 1 - Substitution & Transposition', subtitle: 'Cyber Security', url: '/public/subjects/CS_CL/UNIT 1- sub & tran.pdf', icon: 'pdf' },
        { type: 'pdf', title: 'CS Unit 2', subtitle: 'Cyber Security', url: '/public/subjects/CS_CL/Unit 2.pdf', icon: 'pdf' },
        { type: 'pdf', title: 'CS Unit 3', subtitle: 'Cyber Security', url: '/public/subjects/CS_CL/Unit 3.pdf', icon: 'pdf' },
        
        // Slides
        { type: 'ppt', title: 'ML Unit 1 Slides', subtitle: 'Machine Learning', url: '/viewer.html?mode=image&count=118&src=/public/subjects/ML/Unit1_slides/', icon: 'ppt' },
        { type: 'ppt', title: 'OS Unit 1 Slides', subtitle: 'Operating Systems', url: '/viewer.html?mode=image&count=54&src=/public/subjects/OS/OS_UNIT_1/', icon: 'ppt' },
        { type: 'ppt', title: 'OS Unit 2 Slides', subtitle: 'Operating Systems', url: '/viewer.html?mode=image&count=65&src=/public/subjects/OS/OS_UNIT_2/', icon: 'ppt' },
        { type: 'ppt', title: 'OS Unit 3 Slides', subtitle: 'Operating Systems', url: '/viewer.html?mode=image&count=56&src=/public/subjects/OS/Unit3_slides/', icon: 'ppt' },
        { type: 'ppt', title: 'AI/DL Unit 1 Slides', subtitle: 'AI & Deep Learning', url: '/viewer.html?mode=image&count=54&src=/public/subjects/AI_DL/Unit1_slides/', icon: 'ppt' },
    ];

    // ============================================
    // Utility Functions
    // ============================================
    
    /**
     * Debounce function to limit function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} str - String to escape
     */
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Highlight matching text
     * @param {string} text - Original text
     * @param {string} query - Search query
     */
    function highlightMatch(text, query) {
        if (!query) return escapeHtml(text);
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return escapeHtml(text).replace(regex, '<mark>$1</mark>');
    }

    // ============================================
    // Sidebar Toggle
    // ============================================
    function initSidebarToggle() {
        const toggle = document.querySelector('.sidebar-toggle');
        const overlay = document.querySelector('.sidebar-overlay');
        const navItems = document.querySelectorAll('.sidebar .nav-item');

        if (toggle) {
            toggle.addEventListener('click', function () {
                document.body.classList.toggle('sidebar-open');
            });
        }

        if (overlay) {
            overlay.addEventListener('click', function () {
                document.body.classList.remove('sidebar-open');
            });
        }

        navItems.forEach(function (item) {
            item.addEventListener('click', function () {
                document.body.classList.remove('sidebar-open');
            });
        });
    }

    // ============================================
    // Search Functionality
    // ============================================
    function initSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchBar = document.getElementById('searchBar');
        const searchResults = document.getElementById('searchResults');
        const searchClear = document.getElementById('searchClear');

        if (!searchInput || !searchResults) return;

        let currentIndex = -1;
        let filteredResults = [];

        // Perform search with debounce
        const performSearch = debounce(function(query) {
            query = query.trim().toLowerCase();
            
            if (!query) {
                hideResults();
                return;
            }

            // Show loading state briefly
            searchResults.innerHTML = `
                <div class="search-loading">
                    <div class="spinner"></div>
                    <p>Searching...</p>
                </div>
            `;
            searchResults.classList.add('active');

            // Simulate slight delay for UX (can be removed for instant search)
            setTimeout(() => {
                // Filter results - case insensitive, partial match
                filteredResults = searchData.filter(item => {
                    const searchStr = `${item.title} ${item.subtitle} ${item.type}`.toLowerCase();
                    return searchStr.includes(query);
                });

                // Sort by relevance (title match first)
                filteredResults.sort((a, b) => {
                    const aTitle = a.title.toLowerCase();
                    const bTitle = b.title.toLowerCase();
                    const aStarts = aTitle.startsWith(query);
                    const bStarts = bTitle.startsWith(query);
                    if (aStarts && !bStarts) return -1;
                    if (!aStarts && bStarts) return 1;
                    return 0;
                });

                renderResults(query);
            }, 100);
        }, 300);

        // Render search results
        function renderResults(query) {
            currentIndex = -1;

            if (filteredResults.length === 0) {
                searchResults.innerHTML = `
                    <div class="search-no-results">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <p>No results found for "${escapeHtml(query)}"</p>
                    </div>
                `;
                searchResults.classList.add('active');
                return;
            }

            let html = `<div class="search-results-header">${filteredResults.length} result${filteredResults.length !== 1 ? 's' : ''}</div>`;
            
            filteredResults.forEach((item, index) => {
                const iconClass = item.icon === 'pdf' ? 'pdf' : item.icon === 'ppt' ? 'ppt' : 'subject';
                const targetAttr = item.type === 'pdf' ? 'target="_blank" rel="noopener noreferrer"' : '';
                html += `
                    <a href="${item.url}" class="search-result-item" data-index="${index}" ${targetAttr}>
                        <div class="result-icon ${iconClass}">
                            ${getIconSvg(item.icon)}
                        </div>
                        <div class="result-content">
                            <div class="result-title">${highlightMatch(item.title, query)}</div>
                            <div class="result-subtitle">${escapeHtml(item.subtitle)}</div>
                        </div>
                    </a>
                `;
            });

            searchResults.innerHTML = html;
            searchResults.classList.add('active');
        }

        // Get icon SVG based on type
        function getIconSvg(type) {
            switch (type) {
                case 'pdf':
                    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>`;
                case 'ppt':
                    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="9" y1="3" x2="9" y2="21"></line>
                    </svg>`;
                default:
                    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>`;
            }
        }

        // Hide search results
        function hideResults() {
            searchResults.classList.remove('active');
            currentIndex = -1;
        }

        // Navigate results with keyboard
        function navigateResults(direction) {
            const items = searchResults.querySelectorAll('.search-result-item');
            if (items.length === 0) return;

            items.forEach(item => item.classList.remove('active'));

            if (direction === 'down') {
                currentIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
            } else {
                currentIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
            }

            items[currentIndex].classList.add('active');
            items[currentIndex].scrollIntoView({ block: 'nearest' });
        }

        // Select current result
        function selectResult() {
            const items = searchResults.querySelectorAll('.search-result-item');
            if (currentIndex >= 0 && currentIndex < items.length) {
                const selectedItem = items[currentIndex];
                if (selectedItem.target === '_blank') {
                    window.open(selectedItem.href, '_blank', 'noopener,noreferrer');
                } else {
                    window.location.href = selectedItem.href;
                }
                hideResults();
            }
        }

        // Event Listeners
        searchInput.addEventListener('input', function(e) {
            const value = e.target.value;
            if (value) {
                searchBar.classList.add('has-value');
            } else {
                searchBar.classList.remove('has-value');
            }
            performSearch(value);
        });

        searchInput.addEventListener('focus', function() {
            if (this.value.trim()) {
                performSearch(this.value);
            }
        });

        searchInput.addEventListener('keydown', function(e) {
            if (!searchResults.classList.contains('active')) return;

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    navigateResults('down');
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    navigateResults('up');
                    break;
                case 'Enter':
                    e.preventDefault();
                    selectResult();
                    break;
                case 'Escape':
                    hideResults();
                    searchInput.blur();
                    break;
            }
        });

        // Clear button
        if (searchClear) {
            searchClear.addEventListener('click', function() {
                searchInput.value = '';
                searchBar.classList.remove('has-value');
                hideResults();
                searchInput.focus();
            });
        }

        // Click outside to close
        document.addEventListener('click', function(e) {
            if (!searchBar.contains(e.target) && !searchResults.contains(e.target)) {
                hideResults();
            }
        });

        // Keyboard shortcut (Cmd/Ctrl + K)
        document.addEventListener('keydown', function(e) {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
                searchInput.select();
            }
        });
    }

    // ============================================
    // Toast Notifications
    // ============================================
    function showToast(message, type = 'success', duration = 3000) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                ${type === 'success' 
                    ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
                    : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>'
                }
            </div>
            <div class="toast-content">
                <div class="toast-title">${type === 'success' ? 'Success' : 'Error'}</div>
                <div class="toast-message">${escapeHtml(message)}</div>
            </div>
        `;

        container.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Remove toast after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // Make showToast globally available
    window.showToast = showToast;

    // ============================================
    // Initialize
    // ============================================
    function init() {
        initSidebarToggle();
        initSearch();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
