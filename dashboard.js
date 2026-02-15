(function () {
    function initSidebarToggle() {
        var toggle = document.querySelector('.sidebar-toggle');
        var overlay = document.querySelector('.sidebar-overlay');
        var navItems = document.querySelectorAll('.sidebar .nav-item');

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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSidebarToggle);
    } else {
        initSidebarToggle();
    }
})();
