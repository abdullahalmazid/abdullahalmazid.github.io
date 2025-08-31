document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

document.querySelectorAll('.project').forEach(project => {
    project.addEventListener('mouseenter', () => {
        project.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    });
    project.addEventListener('mouseleave', () => {
        project.style.boxShadow = 'none';
    });
});