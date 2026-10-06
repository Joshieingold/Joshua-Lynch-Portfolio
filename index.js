/* ---------- Content: edit this section ---------- */
const COMMANDS = {
    "": "cd ~",
    summary: "systemctl start summary",
    skills: "which skills",
    projects: "ls ./projects",
    education: "cat ./education",
};

// sig = the line shown in code style, note = description (TODO = fill in)
const SKILLS = {
    language: {
        title: "Languages",
        items: [
            {
                sig: "def Python:",
                note: "My first language. I use it for data analysis, quick mark-ups, and solving programming problems.",
            },
            {
                sig: "public void C#()",
                note: "I have a lot of experience with C# from NBCC and also using it at my past job for building applications.",
            },
            {
                sig: "function Javascript()",
                note: "A necessity in modern programming. I use it sparingly in projects but I'm competent with best practices, as this page shows. Formal education at NBCC.",
            },
            { sig: "<HTML>", note: "TODO" },
            { sig: ".CSS {", note: "TODO" },
            { sig: "function Bash {", note: "TODO" },
            { sig: "CREATE FUNCTION MySQL()", note: "TODO" },
            { sig: "CREATE FUNCTION SqlServer()", note: "TODO" },
            { sig: "public static void Java()", note: "TODO" },
            { sig: "func Go()", note: "TODO" },
            { sig: "public void C++()", note: "TODO" },
            { sig: "$function: { MongoDB: } ", note: "TODO" },
        ],
    },
    framework: {
        title: "Frameworks",
        items: [
            {
                sig: "import Framework",
                note: "TODO: list frameworks you've used.",
            },
        ],
    },
    tool: {
        title: "Tools",
        items: [
            {
                sig: "git commit -m",
                note: "TODO: list tools (Git, VS Code, Docker...).",
            },
        ],
    },
    technique: {
        title: "Techniques",
        items: [
            {
                sig: "// approach",
                note: "TODO: list techniques (testing, agile, API design...).",
            },
        ],
    },
};

const PROJECTS = [
    {
        name: "json_parser",
        desc: "A simple JSON parser built in C++.",
        stack: ["C++"],
        url: "https://github.com/Joshieingold/json-parser",
    },
    {
        name: "neovim_config",
        desc: "My personalized coding environment.",
        stack: ["lua"],
        url: "https://github.com/Joshieingold/Nvim",
    },
    {
        name: "autobox_4",
        desc: "General purpose warehouse automation software.",
        stack: ["C#", "WPF forms", "Firebase"],
        url: "https://github.com/Joshieingold/Autobox-4",
    },
    {
        name: "minesolver",
        desc: "Automation software for solving and finishing minesweeper games.",
        stack: ["C#", "WinUI"],
        url: "https://github.com/Joshieingold/Minesolver",
    },
    {
        name: "nbcc_obituary",
        desc: "Fun website for keeping track of studnets in our program.",
        stack: ["JavaScript", "HTML", "CSS"],
        url: "https://github.com/Joshieingold/NBCC-Obituary",
        site: "https://joshieingold.github.io/NBCC-Obituary/",
    },
    {
        name: "valentines_letter",
        desc: "small website for valentines yes or no.",
        stack: ["HTML", "CSS", "JavaScript"],
        url: "https://github.com/Joshieingold/Valentines",
    },
    {
        name: "finnovate_clone",
        desc: "UI clone of the company Finnovate's website.",
        stack: ["React", "HTML", "CSS", "JavaScript"],
        url: "https://github.com/Joshieingold/finnovate-clone",
    },
    {
        name: "node64",
        desc: "Open source chess database and analysis software.",
        stack: ["Tauri", "React", "Rust", "HTML", "CSS", "JavaScript"],
        url: "https://github.com/Joshieingold/node64",
    },
    {
        name: "cards_to_drink_by",
        desc: "Cards against humanity inspired web-socket integrated party game.",
        stack: ["React", "MySQL", "HTML", "CSS", "JavaScript"],
        url: "https://github.com/Joshieingold/cards-to-drink-by",
    },
    {
        name: "coders_crypt",
        desc: "A rouguelike game made for our OOP final.",
        stack: ["WPF", "C#"],
        url: "https://github.com/Joshieingold/oop-final-rpg-game",
    },
    {
        name: "this_portfolio",
        desc: "The terminal-themed site you're looking at.",
        stack: ["JavaScript", "HTML", "CSS"],
        url: "https://github.com/Joshieingold/Portfolio2026",
        site: "#",
    },
];

const EDUCATION = [
    {
        name: "NBCC",
        desc: "TODO: program name and years. Formal JavaScript training.",
        stack: [],
        url: "",
    },
];

/* ---------- Helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc = (t) =>
    t.replace(
        /[&<>"]/g,
        (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
    );

let current = null;
let busy = false;

/* ---------- Navigation ---------- */
async function go(page) {
    if (busy || page === current) return;
    busy = true;
    await openTerminal(COMMANDS[page]);
    showPage(page); // swap while the overlay still covers the screen
    await closeTerminal();
    busy = false;
}

function showPage(page) {
    resetSkills();
    current = page;
    document.body.classList.toggle("mini", page !== "");
    $$(".nav-list button").forEach((b) =>
        b.classList.toggle("highlight-nav", b.id === page),
    );
    $$("#content > section").forEach((s) => {
        const show = s.id === `${page}-content`;
        s.classList.toggle("hidden", !show);
        s.classList.toggle("content-flex", show);
    });
    $("#content").scrollTop = 0;
}

async function openTerminal(text) {
    const term = $("#terminal"),
        out = $("#terminal-text");
    out.textContent = "";
    term.classList.add("open");
    await sleep(reduceMotion ? 0 : 500);
    for (const ch of text) {
        out.textContent += ch;
        await sleep(reduceMotion ? 0 : 70);
    }
    await sleep(reduceMotion ? 0 : 250);
}
async function closeTerminal() {
    $("#terminal").classList.remove("open");
    await sleep(reduceMotion ? 0 : 500);
}

/* ---------- Skills ---------- */
function windowEl(id, title, bodyHtml, withButtons) {
    return `<div class="skill-box-wrapper" id="${id}">
    <div class="mini-nav"><h3 class="terminal-name">${esc(title)}</h3>
    ${
        withButtons
            ? `<div class="button-container">
      <button class="button expand" aria-label="Expand ${esc(title)}">⧠</button>
      <button class="button exit" aria-label="Close ${esc(title)}">X</button></div>`
            : ""
    }
    </div><div class="skill-box">${bodyHtml}</div></div>`;
}

function renderSkills() {
    $("#skill-container").innerHTML = Object.entries(SKILLS)
        .map(([key, cat]) => {
            const body = cat.items
                .map(
                    (i) =>
                        `<div class="skill-item"><code class="sig">${esc(i.sig)}</code><p class="note">${esc(i.note)}</p></div>`,
                )
                .join("");
            return windowEl(`${key}-terminal`, cat.title, body, true);
        })
        .join("");
    $$(".skill-box-wrapper").forEach((box) => {
        $(".expand", box).addEventListener("click", (e) => {
            e.stopPropagation();
            activeSkill === box ? collapseSkills() : pickSkill(box);
        });
        $(".exit", box).addEventListener("click", (e) => {
            e.stopPropagation();
            collapseSkills();
        });
        box.addEventListener("click", () => pickSkill(box));
    });
}
const SKILL_MS = reduceMotion ? 0 : 400;
const SKILL_TRANSITION = ["left", "top", "width", "height"]
    .map((p) => `${p} ${SKILL_MS}ms ease-in-out`)
    .join(", ");
let activeSkill = null,
    placeholder = null,
    skillBusy = false;

async function pickSkill(box) {
    if (skillBusy || activeSkill) return;
    skillBusy = true;
    const c = $("#skill-container"),
        cr = c.getBoundingClientRect(),
        r = box.getBoundingClientRect();
    // Hold the box's spot so the others don't reflow while it grows over them
    placeholder = document.createElement("div");
    placeholder.style.cssText = `flex:none;width:${r.width}px;height:${r.height}px`;
    box.before(placeholder);
    Object.assign(box.style, {
        position: "absolute",
        zIndex: 5,
        maxHeight: "none",
        left: `${r.left - cr.left}px`,
        top: `${r.top - cr.top}px`,
        width: `${r.width}px`,
        height: `${r.height}px`,
    });
    box.classList.add("active");
    box.offsetWidth; // flush styles so the transition starts from here
    box.style.transition = SKILL_TRANSITION;
    Object.assign(box.style, {
        left: "0px",
        top: "0px",
        width: `${c.clientWidth}px`,
        height: `${c.clientHeight}px`,
    });
    await sleep(SKILL_MS);
    box.style.transition = "";
    Object.assign(box.style, { width: "100%", height: "100%" });
    activeSkill = box;
    skillBusy = false;
}

async function collapseSkills() {
    if (skillBusy || !activeSkill) return;
    skillBusy = true;
    const box = activeSkill,
        c = $("#skill-container"),
        cr = c.getBoundingClientRect(),
        r = placeholder.getBoundingClientRect();
    Object.assign(box.style, {
        width: `${c.clientWidth}px`,
        height: `${c.clientHeight}px`,
    });
    box.offsetWidth;
    box.style.transition = SKILL_TRANSITION;
    Object.assign(box.style, {
        left: `${r.left - cr.left}px`,
        top: `${r.top - cr.top}px`,
        width: `${r.width}px`,
        height: `${r.height}px`,
    });
    await sleep(SKILL_MS);
    resetSkills();
    skillBusy = false;
}

function resetSkills() {
    // instant, used after collapsing and when leaving the page
    if (activeSkill || placeholder) {
        const box = $(".skill-box-wrapper.active");
        if (box) {
            box.removeAttribute("style");
            box.classList.remove("active");
        }
        placeholder?.remove();
        placeholder = activeSkill = null;
    }
}

/* ---------- Projects & education ---------- */
function renderCards(target, list) {
    $(target).innerHTML = list
        .map((p) => {
            const tags = p.stack
                .map((s) => `<span class="tag">${esc(s)}</span>`)
                .join("");
            const repo = p.url
                ? `<a class="card-link" href="${esc(p.url)}" target="_blank" rel="noopener">cat ./${esc(p.name)}</a>`
                : "";
            const site = p.site
                ? `<a class="card-link" href="${esc(p.site)}" target="_blank" rel="noopener">exec ./${esc(p.name)}</a>`
                : "";
            const links =
                repo || site
                    ? `<div class="card-links">${repo}${site}</div>`
                    : "";
            return windowEl(
                "",
                p.name,
                `<p class="note">${esc(p.desc)}</p><div class="tags">${tags}</div>${links}`,
                false,
            );
        })
        .join("");
}
/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
    renderSkills();
    renderCards("#project-grid", PROJECTS);
    renderCards("#education-grid", EDUCATION);
    $("#header-title").addEventListener("click", () => go(""));
    $("#header-title").addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") go("");
    });
    Object.keys(COMMANDS)
        .filter(Boolean)
        .forEach((id) => $(`#${id}`).addEventListener("click", () => go(id)));
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") collapseSkills();
    });
});
