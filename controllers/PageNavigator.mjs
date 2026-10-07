import { $, $$, sleep, reduceMotion } from "../utils/dom.mjs";

export class PageNavigator {
    #commands;
    #onShow;
    #current = null;
    #busy = false;

    // commands: { pageId: "text typed in the overlay" }
    // onShow: called whenever the visible page changes (for cleanup)
    constructor({ commands, onShow = () => {} }) {
        this.#commands = commands;
        this.#onShow = onShow;
    }

    bind() {
        const title = $("#header-title");
        title.addEventListener("click", () => this.go(""));
        title.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") this.go("");
        });
        Object.keys(this.#commands)
            .filter(Boolean)
            .forEach((id) =>
                $(`#${id}`).addEventListener("click", () => this.go(id)),
            );
    }

    async go(page) {
        if (this.#busy || page === this.#current) return;
        this.#busy = true;
        await this.#openTerminal(this.#commands[page]);
        this.#show(page); // swap while the overlay still covers the screen
        await this.#closeTerminal();
        this.#busy = false;
    }

    #show(page) {
        this.#onShow();
        this.#current = page;
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

    async #openTerminal(text) {
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

    async #closeTerminal() {
        $("#terminal").classList.remove("open");
        await sleep(reduceMotion ? 0 : 500);
    }
}
