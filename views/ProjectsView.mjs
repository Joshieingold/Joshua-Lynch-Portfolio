import { $, esc } from "../utils/dom.mjs";
import { loadText } from "../utils/http.mjs";
import { highlight } from "../utils/highlight.mjs";
import { windowEl } from "./windowEl.mjs";

const tagHtml = (project, clickable) =>
    project.stack
        .map((s) =>
            clickable
                ? `<button class="tag" data-tag="${esc(s)}">${esc(s)}</button>`
                : `<span class="tag">${esc(s)}</span>`,
        )
        .join("");

const linkHtml = (p) =>
    [
        p.url &&
            `<a class="card-link" href="${esc(p.url)}" target="_blank" rel="noopener">cat ./${esc(p.name)}</a>`,
        p.site &&
            `<a class="card-link" href="${esc(p.site)}" target="_blank" rel="noopener">exec ./${esc(p.name)}</a>`,
    ]
        .filter(Boolean)
        .join("");

export class ProjectsView {
    #manager;
    #grid;
    #bar;
    #dialog;

    constructor(manager, grid) {
        this.#manager = manager;
        this.#grid = grid;

        this.#bar = document.createElement("div");
        this.#bar.id = "project-filters";
        grid.before(this.#bar);

        this.#dialog = document.createElement("dialog");
        this.#dialog.id = "project-dialog";
        document.body.append(this.#dialog);

        this.#bindEvents();
    }

    render() {
        this.#renderFilters();
        this.#renderCards();
    }

    closeDetails() {
        if (this.#dialog.open) this.#dialog.close();
    }

    async openDetails(project) {
        if (!project) return;
        const paras = project.long
            .map((t) => `<p class="note">${esc(t)}</p>`)
            .join("");
        const img = project.image
            ? `<img class="shot" src="${esc(project.image)}" alt="Screenshot of ${esc(project.name)}" onerror="this.remove()" />`
            : "";
        const snip = await this.#snippetHtml(project);
        const links = linkHtml(project);

        this.#dialog.innerHTML = `<div class="skill-box-wrapper detail">
            <div class="mini-nav">
              <h3 class="terminal-name">${esc(project.name)}</h3>
              <div class="button-container">
                <button class="button exit" aria-label="Close">X</button>
              </div>
            </div>
            <div class="skill-box">
              ${img}
              <p class="note">${esc(project.desc)}</p>${paras}
              <div class="tags">${tagHtml(project, false)}</div>
              ${links ? `<div class="card-links">${links}</div>` : ""}
              ${snip}
            </div>
          </div>`;
        $(".exit", this.#dialog).addEventListener("click", () =>
            this.closeDetails(),
        );
        if (!this.#dialog.open) this.#dialog.showModal();
    }

    /////////////
    // Private //
    /////////////

    #bindEvents() {
        this.#bar.addEventListener("click", (e) => {
            if (e.target.closest("[data-clear]")) {
                this.#manager.clearFilters();
                return this.render();
            }
            const chip = e.target.closest("[data-tag]");
            if (chip) {
                this.#manager.toggleFilter(chip.dataset.tag);
                this.render();
            }
        });

        this.#grid.addEventListener("click", (e) => {
            const tag = e.target.closest(".tag[data-tag]");
            if (tag) {
                this.#manager.toggleFilter(tag.dataset.tag);
                return this.render();
            }
            const open = e.target.closest("[data-project]");
            if (open)
                this.openDetails(this.#manager.find(open.dataset.project));
        });

        this.#dialog.addEventListener("click", (e) => {
            if (e.target === this.#dialog) this.closeDetails(); // backdrop
        });
    }

    #renderFilters() {
        const active = new Set(this.#manager.activeFilters);
        this.#bar.innerHTML =
            this.#manager.tagCounts
                .map(([tag, count]) => {
                    const on = active.has(tag);
                    return `<button class="filter-chip${on ? " on" : ""}" data-tag="${esc(tag)}" aria-pressed="${on}">${esc(tag)} <span>${count}</span></button>`;
                })
                .join("") +
            (active.size
                ? `<button class="filter-chip clear" data-clear>clear</button>`
                : "");
    }

    #renderCards() {
        const list = this.#manager.filtered;
        if (!list.length) {
            this.#grid.innerHTML = `<p class="note">grep: no projects match ${this.#manager.activeFilters.map(esc).join(" + ")}</p>`;
            return;
        }
        this.#grid.innerHTML = list
            .map((p) => {
                const thumb = p.image
                    ? `<button class="thumb" data-project="${esc(p.name)}" aria-label="Open details for ${esc(p.name)}">
                         <img src="${esc(p.image)}" alt="" loading="lazy" onerror="this.closest('.thumb').remove()" />
                       </button>`
                    : "";
                const more = p.hasDetails
                    ? `<button class="see-more" data-project="${esc(p.name)}" aria-label="See more about ${esc(p.name)}">see more</button>`
                    : "";
                const links = linkHtml(p);
                return windowEl(
                    "",
                    p.name,
                    `${thumb}<p class="note">${esc(p.desc)}</p>
                     <div class="tags">${tagHtml(p, true)}</div>
                     ${links ? `<div class="card-links">${links}</div>` : ""}`,
                    false,
                    more,
                );
            })
            .join("");
    }

    // Snippets are actually files!
    async #snippetHtml(project) {
        const s = project.snippet;
        if (!s) return "";
        try {
            const code = await loadText(s.file);
            return `<div class="snippet">
                ${s.caption ? `<p class="note">// ${esc(s.caption)}</p>` : ""}
                <pre><code>${highlight(code, s.lang || project.stack[0])}</code></pre>
              </div>`;
        } catch (err) {
            console.warn(`Snippet for ${project.name} failed to load:`, err);
            return "";
        }
    }
}
