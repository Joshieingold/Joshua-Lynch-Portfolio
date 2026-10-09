import { $ } from "./utils/dom.mjs";
import { SkillsManager } from "./models/SkillsManager.mjs";
import { ProjectsManager } from "./models/ProjectsManager.mjs";
import { EducationManager } from "./models/EducationManager.mjs";
import { ThemeManager } from "./models/ThemeManager.mjs";
import { SkillsView } from "./views/SkillsView.mjs";
import { ProjectsView } from "./views/ProjectsView.mjs";
import { EducationView } from "./views/EducationView.mjs";
import { ThemeView } from "./views/ThemeView.mjs";
import { ContactView } from "./views/ContactView.mjs";
import { PageNavigator } from "./controllers/PageNavigator.mjs";

const COMMANDS = {
    "": "cd ~",
    summary: "systemctl start summary",
    skills: "which skills",
    projects: "ls ./projects",
    education: "cat ./education",
    contact: 'mail -s "hello" joshua',
};

// Contact information for email
const CONTACT = {
    to: "",
    endpoint: "https://formspree.io/f/xyekwlbw",
};

// Theme first so the saved colours are applied before anything is shown
const themes = new ThemeManager();
const themeView = new ThemeView(themes, $("#theme-picker"));
themeView.render();

// Models
const skills = new SkillsManager();
const projects = new ProjectsManager();
const education = new EducationManager();

// Views
const skillsView = new SkillsView(skills, $("#skill-container"));
const projectsView = new ProjectsView(projects, $("#project-grid"));
const educationView = new EducationView(
    education,
    projects,
    $("#education-grid"),
);
const contactView = new ContactView($("#contact-container"), CONTACT);
contactView.render();

// Navigation
const nav = new PageNavigator({
    commands: COMMANDS,
    onShow: () => {
        skillsView.reset();
        projectsView.closeDetails();
    },
});
nav.bind();
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") skillsView.collapse();
});

const results = await Promise.allSettled([
    skills.populate(),
    projects.populate(),
    education.populate(),
]);
results.forEach((r) => r.status === "rejected" && console.error(r.reason));

skillsView.render();
projectsView.render();
educationView.render();
