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

/*
 * Project fields:
 *   name, desc, stack, url        required-ish (as before)
 *   site                          optional live link
 *   long                          optional: string or array of paragraphs
 *   image                         optional: screenshot path (16:9 works best)
 *   snippet                       optional: { caption, code }
 * Any project with long / image / snippet gets an "open ./details" window.
 * Escape backticks and ${ inside snippet code with a backslash.
 * Keep stack names consistent: filter chips use them verbatim.
 */
const PROJECTS = [
    {
        name: "json_parser",
        desc: "A simple JSON parser built in C++.",
        long: [
            "Built to understand how parsers work from the ground up, without any libraries.",
            "Uses recursive descent to handle nested objects and arrays.",
        ],
        image: "./assets//json_parser.png",
        stack: ["C++"],
        url: "https://github.com/Joshieingold/json-parser",
        snippet: {
            lang: "C++", // optional: defaults to the project's first stack entry
            caption: "Recursive descent on values",
            code: `JsonValue parseValue() {
    skipWhitespace();
    switch (peek()) {
        case '{': return parseObject();
        case '[': return parseArray();
        case '"': return parseString();
        default:  return parseLiteral();
    }
}`,
        },
    },
    {
        name: "coders_crypt",
        desc: "A roguelike game made for our OOP final.",
        long: "In this project I learned about Model View Controller frameworks, unit testing, documentation, and project planning. I acted project manager and primary programmer.",
        stack: ["WPF", "C#"],
        url: "https://github.com/Joshieingold/oop-final-rpg-game",
        image: "./assets/ProjectScreenshots/coders_crypt.png",
        snippet: {
            lang: "C#",
            caption: "GameManager class",
            code: ` 
using Core.Entities;
using Core.State;
using Core.Factories;
using GameData;

namespace Core.Managers
{
    public class GameManager // Manages the session the entire game will be using.
    {
        ///////////////
        // Constants //
        ///////////////
        public const int GAME_ROUNDS = 8;

        /////////////////
        // Constructor //
        /////////////////
        public GameManager(string playerName, bool gender)
        {
            CurrentPlayer = new Player(playerName, gender);
            CurrentState = GameState.Battle; // Starts as a battle
            Round = 1;
            CurrentShopManager = new ShopManager();
            AllEnemies = EnemyFactory.RequestXNewEnemies(GAME_ROUNDS);
            AllEnemies.Sort(); // Sorted for difficulty
        }

        ////////////////
        // Properties //
        ////////////////
        public GameState CurrentState { get; private set; } 
        public Player CurrentPlayer { get; set; } 
        public List<Enemy> AllEnemies { get; set; } // Contains all enemies for each round
        public BattleManager CurrentBattleManager { get; set; } 
        public ShopManager CurrentShopManager { get; set; }
        public int Round { get; set; }

        /////////////
        // Methods //
        /////////////
        public Enemy GetCurrentEnemy() // Gets reference to the enemy for the upcoming round.
        {
            return AllEnemies[Round - 1];
        }
        public void UpdateState(GameState newState) // Creates appropriate new managers for game state.
        {
            if (newState == GameState.Battle)
            {
                CurrentState = GameState.Battle;
                CurrentBattleManager = new BattleManager(CurrentPlayer, GetCurrentEnemy());
            }
            else if (newState == GameState.Shop)
            {
                CurrentState = GameState.Shop;
                CurrentShopManager = new ShopManager();
            }
            else if (newState == GameState.Victory)
            {
                CurrentState = GameState.Victory;
                UploadGame();

            }
            else if (newState == GameState.Defeat)
            {
                CurrentState = GameState.Defeat;
                UploadGame();
            }
        }
        private void UploadGame() // Saves game data to text document for record keeping.
        {
            string newRecord = $"{CurrentState} | {CurrentPlayer.Name} | {DateTime.Now} | Round {Round} " + Environment.NewLine;
            string path = DataPasser.GeneralLocation() + "GameRecord.txt";
            File.AppendAllText(path, newRecord);
        }
        public void OnShopOver(Player updatedPlayer) // Updates round when window is closed.
        {
            CurrentPlayer = updatedPlayer;
            Round++;
            CurrentShopManager = new ShopManager();
        }
    }`,
        },
    },
    {
        name: "neovim_config",
        desc: "My personalized coding environment.",
        long: "Used as my primary editor, everything is custom to my own specifications and easily portable regardless of the computer I am using.",
        stack: ["Lua"],
        url: "https://github.com/Joshieingold/Nvim",
        image: "./assets/ProjectScreenshots/nvim_config.png",
    },
    {
        name: "nbcc_obituary",
        desc: "Fun website for keeping track of students in our program.",
        stack: ["JavaScript", "HTML", "CSS"],
        url: "https://github.com/Joshieingold/NBCC-Obituary",
        site: "https://joshieingold.github.io/NBCC-Obituary/",
        image: "./assets/ProjectScreenshots/nbcc_obiturary.png",
    },
    {
        name: "autobox_4",
        desc: "General purpose warehouse automation software.",
        stack: ["C#", "WPF", "Firebase"],
        url: "https://github.com/Joshieingold/Autobox-4",
    },
    {
        name: "minesolver",
        desc: "Automation software for solving and finishing minesweeper games.",
        stack: ["C#", "WinUI"],
        url: "https://github.com/Joshieingold/Minesolver",
    },
    {
        name: "valentines_letter",
        desc: "Small website for a Valentine's yes or no.",
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
        desc: "Cards Against Humanity inspired web-socket integrated party game.",
        stack: ["React", "MySQL", "HTML", "CSS", "JavaScript"],
        url: "https://github.com/Joshieingold/cards-to-drink-by",
    },
    {
        name: "this_portfolio",
        desc: "The terminal-themed site you're looking at.",
        stack: ["JavaScript", "HTML", "CSS"],
        url: "https://github.com/Joshieingold/Portfolio2026",
        site: "#",
    },
    {
        name: "chess_visualization_trainer",
        desc: "Chess app that reads moves played out loud.",
        stack: ["JavaScript", "HTML", "CSS"],
        url: "https://github.com/Joshieingold/chess-visualization-trainer",
    },
    {
        name: "obs_chess",
        desc: "OBS plugin for keeping track of wins and losses on chess.com.",
        stack: ["JavaScript", "HTML", "CSS"],
        url: "https://github.com/Joshieingold/obs-chess",
    },
    {
        name: "go_with_friends",
        desc: "Local multiplayer game of Go.",
        stack: ["JavaScript", "HTML", "CSS", "React"],
        url: "https://github.com/Joshieingold/GoWithFriends",
    },
    {
        name: "rojers_the_snake_method",
        desc: "Online snake game with leaderboard and characters.",
        stack: ["JavaScript", "HTML", "CSS", "React"],
        url: "https://github.com/Joshieingold/Rojers-The-Snake-Method",
    },
    {
        name: "poker_trainer",
        desc: "Poker game that helps identify hands and best moves.",
        stack: ["JavaScript", "HTML", "CSS", "React"],
        url: "https://github.com/Joshieingold/poker-trainer",
    },
];

/*
 * Education entries. kind decides which group heading it sits under:
 *   "formal" | "cert" | "self"
 * Fields (all optional except name, kind, desc):
 *   program     the line shown under the title (degree, certificate, etc.)
 *   years       e.g. "2023 - 2025"
 *   highlights  array of short bullet points
 *   courses     array of tags (courses, topics, technologies)
 *   projects    names from PROJECTS, shown as links to the repos
 *   url         link to the school / certificate / credential
 * Anything marked TODO is a placeholder for you to fill in.
 */
const EDUCATION = [
    {
        kind: "academic",
        name: "NBCC",
        program: "Programmer Analyst", // TODO: confirm the exact program name
        years: "2025 - 2027",
        desc: "Well rounded training in all aspects of programming including C#, JavaScript, Java EE and Programming architecture.",
        highlights: [
            "Final OOP project: a roguelike built with C# and WPF.",
            "Built a site for keeping track of students in our program.",
            "Class Representitive, 3.96 GPA",
        ],
        courses: [
            "C#",
            "JavaScript",
            "OOP",
            "Bash",
            "MVC-Framework",
            "Java EE",
            "MySql",
            "Software Engineering",
            "AWS Cloud",
        ],
        projects: ["coders_crypt", "nbcc_obituary"],
        url: "",
    },
    {
        kind: "cert",
        name: "TODO: Certification name",
        program: "TODO: issuer",
        years: "TODO: year",
        desc: "TODO: what it covers and why it matters.",
        courses: [],
        url: "",
    },
    {
        kind: "self",
        name: "Self-directed learning",
        program: "Projects & side work",
        desc: "Beyond coursework I learn by building things, usually in languages I haven't used in class.",
        highlights: [
            "Wrote a JSON parser in C++ to learn how parsing works.",
            "Building a chess database in Rust and Tauri.",
            "Tuned my own Neovim setup in Lua.",
        ],
        courses: ["C++", "Rust", "Lua", "React"],
        projects: ["json_parser", "node64", "neovim_config"],
    },
];

/* ---------- Helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc = (t) =>
    String(t).replace(
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
    if (dialog.open) dialog.close();
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
function windowEl(id, title, bodyHtml, withButtons, headerExtra = "") {
    return `<div class="skill-box-wrapper"${id ? ` id="${id}"` : ""}>
    <div class="mini-nav"><h3 class="terminal-name">${esc(title)}</h3>
    ${headerExtra}
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

/* ---------- Projects & education: cards ---------- */
const tagHtml = (p, clickable) =>
    p.stack
        .map((s) =>
            clickable
                ? `<button class="tag" data-tag="${esc(s)}">${esc(s)}</button>`
                : `<span class="tag">${esc(s)}</span>`,
        )
        .join("");

// Project links: exactly as they were originally
const linkHtml = (p) =>
    [
        p.url &&
            `<a class="card-link" href="${esc(p.url)}" target="_blank" rel="noopener">cat ./${esc(p.name)}</a>`,
        p.site &&
            `<a class="card-link" href="${esc(p.site)}" target="_blank" rel="noopener">exec ./${esc(p.name)}</a>`,
    ]
        .filter(Boolean)
        .join("");

// Education links: styled like a bash command, `$ cmd arg`
const bashLink = (href, cmd, arg) =>
    `<a class="card-link" href="${esc(href)}" target="_blank" rel="noopener"><span class="sh-cmd">${esc(cmd)}</span> <span class="sh-arg">${esc(arg)}</span></a>`;

const hasDetails = (p) => p.long || p.image || p.snippet;

// clickable = tags act as filters (projects only)
function renderCards(target, list, clickable = false) {
    $(target).innerHTML = list
        .map((p) => {
            const thumb = p.image
                ? `<button class="thumb" data-project="${esc(p.name)}" aria-label="Open details for ${esc(p.name)}">
                     <img src="${esc(p.image)}" alt="" loading="lazy" onerror="this.closest('.thumb').remove()" />
                   </button>`
                : "";
            const more = hasDetails(p)
                ? `<button class="see-more" data-project="${esc(p.name)}" aria-label="See more about ${esc(p.name)}">see more</button>`
                : "";
            const links = linkHtml(p);
            return windowEl(
                "",
                p.name,
                `${thumb}<p class="note">${esc(p.desc)}</p>
                 <div class="tags">${tagHtml(p, clickable)}</div>
                 ${links ? `<div class="card-links">${links}</div>` : ""}`,
                false,
                more,
            );
        })
        .join("");
}

/* ---------- Syntax highlighting (tiny, no library) ---------- */
const words = (s) => new Set(s.split(" "));
const TYPES = words(
    "int uint long short char byte bool boolean float double string str void auto size_t usize isize u8 u16 u32 u64 i8 i16 i32 i64 f32 f64 object decimal",
);
const LANGS = {
    clike: {
        comment: /\/\/.*|\/\*[\s\S]*?\*\//,
        kw: words(
            "if else for foreach while do switch case default break continue return new delete class struct enum union interface extends implements public private protected static const let var function async await try catch finally throw throws namespace using import from export typeof this self null nullptr true false fn pub mut impl use mod match loop in as where override virtual final template typename sizeof go func defer range package type chan select goto lambda override readonly abstract get set",
        ),
    },
    python: {
        comment: /#.*/,
        kw: words(
            "def class if elif else for while return import from as with try except finally raise lambda yield pass break continue in is not and or None True False self async await global nonlocal assert del",
        ),
    },
    lua: {
        comment: /--\[\[[\s\S]*?\]\]|--.*/,
        kw: words(
            "function local end if then else elseif for while do repeat until return break in and or not nil true false",
        ),
    },
};
const LANG_ALIAS = { py: "python", python: "python", lua: "lua" };
const STRING_RE = /"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`/;

// lang is optional; unknown languages fall back to a C-style grammar
function highlight(code, lang = "") {
    const L = LANGS[LANG_ALIAS[String(lang).toLowerCase()] || "clike"];
    const re = new RegExp(
        `(${L.comment.source})|(${STRING_RE.source})|(\\b\\d[\\w.]*)|([A-Za-z_]\\w*)`,
        "g",
    );
    let out = "",
        last = 0;
    for (const m of code.matchAll(re)) {
        let cls;
        if (m[1]) cls = "comment";
        else if (m[2]) cls = "string";
        else if (m[3]) cls = "number";
        else {
            const w = m[0];
            if (L.kw.has(w)) cls = "keyword";
            else if (code[m.index + w.length] === "(") cls = "function";
            else if (TYPES.has(w) || /^[A-Z]/.test(w)) cls = "type";
        }
        out += esc(code.slice(last, m.index));
        out += cls ? `<span class="tok-${cls}">${esc(m[0])}</span>` : esc(m[0]);
        last = m.index + m[0].length;
    }
    return out + esc(code.slice(last));
}

/* ---------- Education ---------- */
const EDU_GROUPS = [
    { kind: "academic", cmd: "ls ./academic" },
    { kind: "cert", cmd: "ls ./certifications" },
    { kind: "self", cmd: "ls ./self_taught" },
];

const hostOf = (u) => {
    try {
        return new URL(u).hostname;
    } catch {
        return u;
    }
};

function eduCard(e) {
    const repoLinks = (e.projects || [])
        .map((n) => PROJECTS.find((p) => p.name === n))
        .filter((p) => p && p.url)
        .map((p) => bashLink(p.url, "cat", `./${p.name}/README.md`))
        .join("");
    const siteLink = e.url ? bashLink(e.url, "open", hostOf(e.url)) : "";
    const links = siteLink + repoLinks;
    const bullets = e.highlights?.length
        ? `<ul class="edu-list">${e.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>`
        : "";
    const tags = e.courses?.length
        ? `<div class="tags">${e.courses.map((c) => `<span class="tag">${esc(c)}</span>`).join("")}</div>`
        : "";
    return `<article class="edu-entry">
        <div class="edu-head">
          <h4 class="edu-name">${esc(e.name)}</h4>
          ${e.years ? `<span class="edu-years">${esc(e.years)}</span>` : ""}
        </div>
        ${e.program ? `<code class="sig">${esc(e.program)}</code>` : ""}
        <p class="note">${esc(e.desc)}</p>
        ${bullets}${tags}
        ${links ? `<div class="card-links">${links}</div>` : ""}
      </article>`;
}

function renderEducation() {
    $("#education-grid").innerHTML = EDU_GROUPS.map((g) => {
        const items = EDUCATION.filter((e) => e.kind === g.kind);
        return items.length
            ? `<h3 class="edu-heading">${esc(g.cmd)}</h3>${items.map(eduCard).join("")}`
            : "";
    }).join("");
}

/* ---------- Details dialog ---------- */
const dialog = document.createElement("dialog");
dialog.id = "project-dialog";
document.body.append(dialog);
dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close(); // backdrop click
});

function openDetails(p) {
    if (!p) return;
    const paras = []
        .concat(p.long || [])
        .map((t) => `<p class="note">${esc(t)}</p>`)
        .join("");
    const img = p.image
        ? `<img class="shot" src="${esc(p.image)}" alt="Screenshot of ${esc(p.name)}" onerror="this.remove()" />`
        : "";
    const snip = p.snippet
        ? `<div class="snippet">
             ${p.snippet.caption ? `<p class="note">// ${esc(p.snippet.caption)}</p>` : ""}
             <pre><code>${highlight(p.snippet.code, p.snippet.lang || p.stack[0])}</code></pre>
           </div>`
        : "";
    const links = linkHtml(p);
    dialog.innerHTML = `<div class="skill-box-wrapper detail">
        <div class="mini-nav">
          <h3 class="terminal-name">${esc(p.name)}</h3>
          <div class="button-container">
            <button class="button exit" aria-label="Close">X</button>
          </div>
        </div>
        <div class="skill-box">
          ${img}
          <p class="note">${esc(p.desc)}</p>${paras}
          <div class="tags">${tagHtml(p, false)}</div>
          ${links ? `<div class="card-links">${links}</div>` : ""}
          ${snip}
        </div>
      </div>`;
    $(".exit", dialog).addEventListener("click", () => dialog.close());
    dialog.showModal();
}

/* ---------- Project filtering ---------- */
const activeFilters = new Set();

function renderFilters() {
    let bar = $("#project-filters");
    if (!bar) {
        bar = document.createElement("div");
        bar.id = "project-filters";
        $("#project-grid").before(bar);
    }
    const counts = {};
    PROJECTS.forEach((p) =>
        p.stack.forEach((s) => (counts[s] = (counts[s] || 0) + 1)),
    );
    const tags = Object.keys(counts).sort(
        (a, b) => counts[b] - counts[a] || a.localeCompare(b),
    );
    bar.innerHTML =
        tags
            .map((t) => {
                const on = activeFilters.has(t);
                return `<button class="filter-chip${on ? " on" : ""}" data-tag="${esc(t)}" aria-pressed="${on}">${esc(t)} <span>${counts[t]}</span></button>`;
            })
            .join("") +
        (activeFilters.size
            ? `<button class="filter-chip clear" data-clear>clear</button>`
            : "");
}

function renderProjects() {
    // AND filter: a project must use every selected tag
    // (for OR, use .some and treat an empty selection as "show all")
    const list = PROJECTS.filter((p) =>
        [...activeFilters].every((t) => p.stack.includes(t)),
    );
    renderCards("#project-grid", list, true);
    if (!list.length) {
        $("#project-grid").innerHTML =
            `<p class="note">grep: no projects match ${[...activeFilters].map(esc).join(" + ")}</p>`;
    }
    renderFilters();
}

function toggleFilter(tag) {
    activeFilters.has(tag) ? activeFilters.delete(tag) : activeFilters.add(tag);
    renderProjects();
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
    renderSkills();
    renderProjects();
    renderEducation();

    $("#project-filters").addEventListener("click", (e) => {
        if (e.target.closest("[data-clear]")) {
            activeFilters.clear();
            return renderProjects();
        }
        const chip = e.target.closest("[data-tag]");
        if (chip) toggleFilter(chip.dataset.tag);
    });

    $("#project-grid").addEventListener("click", (e) => {
        const tag = e.target.closest(".tag[data-tag]");
        if (tag) return toggleFilter(tag.dataset.tag);

        const open = e.target.closest("[data-project]");
        if (open)
            openDetails(PROJECTS.find((p) => p.name === open.dataset.project));
    });

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
