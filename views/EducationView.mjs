import { esc } from "../utils/dom.mjs";

const GROUPS = [
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

const bashLink = (href, cmd, arg) =>
    `<a class="card-link" href="${esc(href)}" target="_blank" rel="noopener"><span class="sh-cmd">${esc(cmd)}</span> <span class="sh-arg">${esc(arg)}</span></a>`;

export class EducationView {
    #manager;
    #projects;
    #container;

    constructor(manager, projects, container) {
        this.#manager = manager;
        this.#projects = projects;
        this.#container = container;
    }

    render() {
        this.#container.innerHTML = GROUPS.map(({ kind, cmd }) => {
            const items = this.#manager.ofKind(kind);
            return items.length
                ? `<h3 class="edu-heading">${esc(cmd)}</h3>${items.map((e) => this.#entry(e)).join("")}`
                : "";
        }).join("");
    }

    #entry(e) {
        const repoLinks = e.projects
            .map((n) => this.#projects.find(n))
            .filter((p) => p && p.url)
            .map((p) => bashLink(p.url, "cat", `./${p.name}/README.md`))
            .join("");
        const siteLink = e.url ? bashLink(e.url, "open", hostOf(e.url)) : "";
        const links = siteLink + repoLinks;
        const bullets = e.highlights.length
            ? `<ul class="edu-list">${e.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>`
            : "";
        const tags = e.courses.length
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
}
