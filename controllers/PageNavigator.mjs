import { $, $$, sleep, reduceMotion } from "../utils/dom.mjs";

// For tuning the terminal window.
const TIMING = { open: 150, perChar: 60, hold: 110, close: 200 };
const wait = (ms) => sleep(reduceMotion ? 0 : ms);

export class PageNavigator {
    #commands;
    #onShow;
    #current = null;
    #busy = false;
    #pending = null;

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
        if (this.#busy) {
            this.#pending = page;
            return;
        }
        this.#busy = true;
        let next = page;
        while (next !== null) {
            this.#pending = null;
            if (next !== this.#current) {
                await this.#openTerminal(this.#commands[next]);
                this.#show(next);
                await this.#closeTerminal();
            }
            next = this.#pending;
        }
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
        await wait(TIMING.open);
        for (const ch of text) {
            out.textContent += ch;
            await wait(TIMING.perChar);
        }
        await wait(TIMING.hold);
    }

    async #closeTerminal() {
        $("#terminal").classList.remove("open");
        await wait(TIMING.close);
    }
}
