import { esc, sleep, reduceMotion } from "../utils/dom.mjs";
import { windowEl } from "./windowEl.mjs";

const wait = (ms) => sleep(reduceMotion ? 0 : ms);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class ContactView {
    #container;
    #to;
    #endpoint;
    #form;
    #log;
    #sending = false;
    constructor(container, { to = "", endpoint = "" } = {}) {
        this.#container = container;
        this.#to = to;
        this.#endpoint = endpoint;
    }

    render() {
        const body = `<form class="mail" novalidate>
            <div class="mail-row">
                <span class="mail-key">to:</span>
                <span class="mail-static">${esc(this.#to || "joshua")}</span>
            </div>
            <div class="mail-row">
                <label class="mail-key" for="mail-name">name:</label>
                <input id="mail-name" name="name" type="text" maxlength="80" autocomplete="name" placeholder="Ada Lovelace" />
            </div>
            <div class="mail-row">
                <label class="mail-key" for="mail-from">from:</label>
                <input id="mail-from" name="email" type="email" maxlength="120" autocomplete="email" placeholder="you@example.com" />
            </div>
            <div class="mail-row">
                <label class="mail-key" for="mail-subject">subject:</label>
                <input id="mail-subject" name="subject" type="text" maxlength="120" placeholder="Let's work together" />
            </div>
            <div class="mail-row mail-body">
                <label class="mail-key" for="mail-message">body:</label>
                <textarea id="mail-message" name="message" rows="7" maxlength="4000" placeholder="Write your message here..."></textarea>
            </div>
            <div class="hp" aria-hidden="true">
                <input name="_gotcha" type="text" tabindex="-1" autocomplete="off" />
            </div>
            <div class="mail-actions">
                <button type="submit" class="card-link"><span class="sh-cmd">sendmail</span> <span class="sh-arg">--send</span></button>
                <button type="reset" class="card-link"><span class="sh-cmd">clear</span></button>
                <span class="mail-hint">ctrl+enter to send</span>
            </div>
            <div class="mail-log" aria-live="polite"></div>
        </form>`;

        this.#container.innerHTML = windowEl("", "mail", body, false);
        this.#form = this.#container.querySelector("form");
        this.#log = this.#container.querySelector(".mail-log");

        this.#form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.#send();
        });
        this.#form.addEventListener("reset", () => {
            if (!this.#sending) this.#log.innerHTML = "";
        });
        this.#form.elements.message.addEventListener("keydown", (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                e.preventDefault();
                this.#form.requestSubmit();
            }
        });
    }

    /////////////
    // Private //
    /////////////

    async #print(text, cls = "", delay = 250) {
        const line = document.createElement("div");
        if (cls) line.className = cls;
        line.textContent = text;
        this.#log.append(line);
        await wait(delay);
    }

    #setBusy(busy) {
        this.#sending = busy;
        this.#form.setAttribute("aria-busy", String(busy));
        this.#form.querySelector('[type="submit"]').disabled = busy;
    }

    async #send() {
        if (this.#sending) return;
        const f = this.#form.elements;
        if (f._gotcha.value) return; // honeypot: bots fill this in, people can't see it

        const msg = {
            name: f.name.value.trim(),
            email: f.email.value.trim(),
            subject: f.subject.value.trim(),
            message: f.message.value.trim(),
        };
        this.#log.innerHTML = "";

        const errors = [];
        if (!msg.name) errors.push(["name", 'error: "name" is required']);
        if (!EMAIL_RE.test(msg.email))
            errors.push([
                "email",
                'error: "from" needs a valid email address so I can reply',
            ]);
        if (!msg.message) errors.push(["message", 'error: "body" is empty']);
        if (errors.length) {
            for (const [, text] of errors) await this.#print(text, "err", 100);
            f[errors[0][0]].focus();
            return;
        }
        msg.subject ||= `Hello from ${msg.name}`;

        this.#setBusy(true);
        try {
            const bytes = new Blob([msg.message]).size;
            await this.#print(
                `$ sendmail --to ${this.#to || "joshua"} --subject "${msg.subject}"`,
                "dim",
            );
            await this.#print("connecting to mail server...", "dim", 400);
            await this.#print(`sending ${bytes} bytes...`, "dim", 300);

            const how = await this.#deliver(msg);
            this.#form.reset(); // #sending is true, so the log is kept

            if (how === "sent") {
                await this.#print("250 OK: message queued for delivery", "ok");
                await this.#print(
                    `thanks ${msg.name}, I'll get back to you soon.`,
                );
            } else {
                await this.#print(
                    "no mail server configured: opened your mail client instead",
                    "ok",
                );
                await this.#print("press send there to finish the message.");
            }
        } catch (err) {
            await this.#print(`error: ${err.message}`, "err");
            if (this.#to)
                await this.#print(`you can also reach me at ${this.#to}`);
        } finally {
            this.#setBusy(false);
        }
    }

    async #deliver(msg) {
        if (this.#endpoint) {
            const res = await fetch(this.#endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ ...msg, _subject: msg.subject }),
            });
            if (!res.ok) throw new Error(`server responded ${res.status}`);
            return "sent";
        }
        if (!this.#to) throw new Error("no recipient configured");
        const body = `${msg.message}\n\n- ${msg.name} (${msg.email})`;
        location.href = `mailto:${this.#to}?subject=${encodeURIComponent(msg.subject)}&body=${encodeURIComponent(body)}`;
        return "handoff";
    }
}
