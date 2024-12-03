const menuLinks = document.querySelectorAll('a[href^="#"]');
const projectCardTemplate = document.getElementById('project-card-template');
const projectContainer = document.getElementById('project-container');

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
    setupLinksAnimation();
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


function setupLinksAnimation() {
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            menuLinks.forEach(link => {
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.classList.remove('active');
                }
            });
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.classList.add('active');
                
                const topOffset = targetSection.offsetTop - 50;
                window.scrollTo({
                    top: topOffset,
                    behavior: 'smooth'
                });
            }
        });
    });
}