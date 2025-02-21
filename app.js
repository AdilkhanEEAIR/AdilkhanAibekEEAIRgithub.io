
document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.querySelector('.header-toggle');
    const menu = document.querySelector('.header-menu');
    const menuItems = document.querySelectorAll('.header-menu a');

    toggle.addEventListener('click', function() {
        menu.classList.toggle('active');
        toggle.classList.toggle('active');
    });

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            menu.classList.remove('active');
            toggle.classList.remove('active');
        });
    });
});
