class CVGenerator {
    constructor(data) {
        this.data = data;
    }

    generateHTML() {
        return `
            <div class="cv-container">
                ${this.generatePersonalInfo()}
                ${this.generateSummary()}
                ${this.generateSkills()}
                ${this.generateExperience()}
                ${this.generateEducation()}
                ${this.generateLanguages()}
            </div>
        `;
    }

    generatePersonalInfo() {
        const { name, title, email, phone, location, website } = this.data.personalInfo;
        return `
            <div class="cv-section personal-info">
                <h1>${name}</h1>
                <h2>${title}</h2>
                <div class="contact-info">
                    <p><i class="fas fa-envelope"></i> ${email}</p>
                    <p><i class="fas fa-globe"></i> ${website}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${location}</p>
                </div>
            </div>
        `;
    }

    generateSummary() {
        return `
            <div class="cv-section summary">
                <h3>Professional Summary</h3>
                <p>${this.data.summary}</p>
            </div>
        `;
    }

    generateExperience() {
        const experiences = this.data.experience
            .map(
                (exp) => `
            <div class="experience-item">
                <h4>${exp.title} at ${exp.company}</h4>
                <p class="date">${exp.startDate} - ${exp.endDate}</p>
                <p class="location">${exp.location}</p>
                <p>${exp.description}</p>
                <div class="technologies">
                    ${exp.technologies.map((tech) => `<span class="tech-tag">${tech}</span>`).join("")}
                </div>
            </div>
        `
            )
            .join("");

        return `
            <div class="cv-section experience">
                <h3>Work Experience</h3>
                ${experiences}
            </div>
        `;
    }

    generateEducation() {
        const education = this.data.education
            .map(
                (edu) => `
            <div class="education-item">
                <h4>${edu.degree}</h4>
                <p>${edu.institution}</p>
                <p class="date">${edu.startDate} - ${edu.endDate}</p>
                <p class="location">${edu.location}</p>
                <p>${edu.description}</p>
            </div>
        `
            )
            .join("");

        return `
            <div class="cv-section education">
                <h3>Education</h3>
                ${education}
            </div>
        `;
    }

    generateSkills() {
        const { technical, soft } = this.data.skills;
        return `
            <div class="cv-section skills">
                <h3>Skills</h3>
                <div class="skills-container">
                    <div class="technical-skills">
                        <h4>Technical Skills</h4>
                        <div class="skill-list">
                            ${technical.map((skill) => `<p class="skill-item">${skill}</p>`).join("")}
                        </div>
                    </div>
                    <div class="soft-skills">
                        <h4>Soft Skills</h4>
                        <div class="skill-list">
                            ${soft.map((skill) => `<p class="skill-item">${skill}</p>`).join("")}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateLanguages() {
        const languages = this.data.languages
            .map(
                (lang) => `
            <div class="language-item">
                <span class="language-name">${lang.name}</span>
                <span class="language-level">${lang.level}</span>
            </div>
        `
            )
            .join("");

        return `
            <div class="cv-section languages">
                <h3>Languages</h3>
                <div class="languages-container">
                    ${languages}
                </div>
            </div>
        `;
    }
}

async function initCV() {
    try {
        const response = await fetch("/assets/js/data/cv.json");
        const cvData = await response.json();
        const cvGenerator = new CVGenerator(cvData);

        const cvContent = document.getElementById("cv-content");
        if (cvContent) {
            cvContent.innerHTML = cvGenerator.generateHTML();
        }

        // Setup download button
        const downloadBtn = document.getElementById("downloadCV");
        if (downloadBtn) {
            downloadBtn.addEventListener("click", async () => {
                try {
                    const printWindow = window.open("", "Print CV");
                    printWindow.document.write(`
                        <html>
                            <head>
                                <title>CV - ${cvData.personalInfo.name}</title>
                                <link rel="stylesheet" href="/assets/css/style.css">
                                <style>
                                    body { padding: 20px; background: white; }
                                    .cv-actions { display: none; }
                                    @media print {
                                        body { padding: 0; }
                                        .cv-container { max-width: none; }
                                    }
                                </style>
                            </head>
                            <body>
                                ${cvGenerator.generateHTML()}
                            </body>
                        </html>
                    `);
                    printWindow.document.close();

                    setTimeout(() => {
                        printWindow.print();
                        printWindow.close();
                    }, 1000);
                } catch (error) {
                    console.error("Error generating PDF:", error);
                    alert("Error generating PDF. Please try again.");
                }
            });
        }
    } catch (error) {
        console.error("Error loading CV data:", error);
    }
}

document.addEventListener("DOMContentLoaded", initCV);
