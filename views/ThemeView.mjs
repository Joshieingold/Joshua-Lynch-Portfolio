import { esc } from "../utils/dom.mjs";

export class ThemeView {
    #manager;
    #container;

    constructor(manager, container) {
        this.#manager = manager;
        this.#container = container;

        container.addEventListener("click", (e) => {
            const chip = e.target.closest("[data-theme]");
            if (!chip) return;
            const id = chip.dataset.theme;
            this.#manager.set(id);
            this.render();
            // render() replaced the buttons, so give keyboard focus back
            this.#container.querySelector(`[data-theme="${id}"]`)?.focus();
        });
    }

    render() {
        const current = this.#manager.current;
        const chips = this.#manager.all
            .map((t) => {
                const [a, b, c] = t.preview;
                return `<button class="theme-chip" data-theme="${esc(t.id)}" aria-pressed="${t.id === current}">
                    <span class="swatch" style="--a:${a};--b:${b};--c:${c}" aria-hidden="true"><i></i><i></i><i></i></span>${esc(t.label)}
                </button>`;
            })
            .join("");
        this.#container.innerHTML = `<span class="theme-label">$ theme --set</span>
            <div class="theme-options">${chips}</div>`;
    }
}
