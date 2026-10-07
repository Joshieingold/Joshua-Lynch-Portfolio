import { $ } from "./utils/dom.mjs";
import { SkillsManager } from "./models/SkillsManager.mjs";
import { ProjectsManager } from "./models/ProjectsManager.mjs";
import { EducationManager } from "./models/EducationManager.mjs";
import { SkillsView } from "./views/SkillsView.mjs";
import { ProjectsView } from "./views/ProjectsView.mjs";
import { EducationView } from "./views/EducationView.mjs";
import { PageNavigator } from "./controllers/PageNavigator.mjs";

const COMMANDS = {
    "": "cd ~",
    summary: "systemctl start summary",
    skills: "which skills",
    projects: "ls ./projects",
    education: "cat ./education",
};

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
