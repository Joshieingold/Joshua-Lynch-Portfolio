import { $, $$, esc, sleep, reduceMotion } from "../utils/dom.mjs";
import { windowEl } from "./windowEl.mjs";

const MS = reduceMotion ? 0 : 400;
const TRANSITION = ["left", "top", "width", "height"]
    .map((p) => `${p} ${MS}ms ease-in-out`)
    .join(", ");

export class SkillsView {
    #manager;
    #container;
    #active = null;
    #placeholder = null;
    #busy = false;

    constructor(manager, container) {
        this.#manager = manager;
        this.#container = container;
    }

    render() {
        this.reset();
        this.#container.innerHTML = this.#manager.all
            .map((skill) => {
                const body = skill.items
                    .map(
                        (i) =>
                            `<div class="skill-item"><code class="sig">${esc(i.signature)}</code><p class="note">${esc(i.note)}</p></div>`,
                    )
                    .join("");
                return windowEl(
                    `${skill.title.toLowerCase()}-terminal`,
                    skill.title,
                    body,
                    true,
                );
            })
            .join("");

        $$(".skill-box-wrapper", this.#container).forEach((box) => {
            $(".expand", box).addEventListener("click", (e) => {
                e.stopPropagation();
                this.#active === box ? this.collapse() : this.pick(box);
            });
            $(".exit", box).addEventListener("click", (e) => {
                e.stopPropagation();
                this.collapse();
            });
            box.addEventListener("click", () => this.pick(box));
        });
    }

    async pick(box) {
        if (this.#busy || this.#active) return;
        this.#busy = true;
        const c = this.#container,
            cr = c.getBoundingClientRect(),
            r = box.getBoundingClientRect();
        // Hold the box's spot so the others don't reflow while it grows over them
        this.#placeholder = document.createElement("div");
        this.#placeholder.style.cssText = `flex:none;width:${r.width}px;height:${r.height}px`;
        box.before(this.#placeholder);
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
        box.style.transition = TRANSITION;
        Object.assign(box.style, {
            left: "0px",
            top: "0px",
            width: `${c.clientWidth}px`,
            height: `${c.clientHeight}px`,
        });
        await sleep(MS);
        box.style.transition = "";
        Object.assign(box.style, { width: "100%", height: "100%" });
        this.#active = box;
        this.#busy = false;
    }

    async collapse() {
        if (this.#busy || !this.#active) return;
        this.#busy = true;
        const box = this.#active,
            c = this.#container,
            cr = c.getBoundingClientRect(),
            r = this.#placeholder.getBoundingClientRect();
        Object.assign(box.style, {
            width: `${c.clientWidth}px`,
            height: `${c.clientHeight}px`,
        });
        box.offsetWidth;
        box.style.transition = TRANSITION;
        Object.assign(box.style, {
            left: `${r.left - cr.left}px`,
            top: `${r.top - cr.top}px`,
            width: `${r.width}px`,
            height: `${r.height}px`,
        });
        await sleep(MS);
        this.reset();
        this.#busy = false;
    }

    reset() {
        if (this.#active || this.#placeholder) {
            const box = $(".skill-box-wrapper.active", this.#container);
            if (box) {
                box.removeAttribute("style");
                box.classList.remove("active");
            }
            this.#placeholder?.remove();
            this.#placeholder = this.#active = null;
        }
    }
}
