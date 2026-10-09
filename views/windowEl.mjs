import { esc } from "../utils/dom.mjs";

export function windowEl(id, title, bodyHtml, withButtons, headerExtra = "") {
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
