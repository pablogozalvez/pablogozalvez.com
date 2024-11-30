const menuItems = document.querySelectorAll('#menu ul li a');
const projectCardTemplate = document.getElementById('project-card-template');
const projectContainer = document.getElementById('project-container');

menuItems.forEach(item => {
    item.addEventListener('click', function() {
        menuItems.forEach(item => item.classList.remove('active'));
        this.classList.add('active');
        document.querySelectorAll('.card').forEach(card => card.classList.remove('active'));
        document.getElementById(this.dataset.category).classList.add('active');
    });
});

document.addEventListener('scroll', function() {
    var menu = document.getElementById('menu');
    if (window.scrollY > 0) {
        menu.classList.add('nav');
    } else {
        menu.classList.remove('nav');
    }
});

document.addEventListener('DOMContentLoaded', (event) => {
    hljs.highlightAll();
    loadProjects();
});

function loadProjects() {
    fetch('../data/projects.json')
        .then(response => response.json())
        .then(data => {
            data.projects.forEach(project => {
                const newCard = projectCardTemplate.content.cloneNode(true);
                const card = newCard.querySelector('.card');
                card.querySelector('.project-title').textContent = project.name;
                const cardImg = card.querySelector('.project-image');
                cardImg.src = project.image;
                cardImg.alt = project.name;
                card.querySelector('.project-description').textContent = project.description;
                const cardBtn = card.querySelector('.project-url');
                cardBtn.href = project.url;

                // Append the new card to the project container
                projectContainer.appendChild(newCard);
            });
        })
        .catch(error => {
            console.error('Error loading projects:', error);
        });
}