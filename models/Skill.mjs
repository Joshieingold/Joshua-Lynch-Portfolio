export class Skill {
    ////////////
    // Fields //
    ////////////
    #title;
    #items = [];

    // Constructor //
    constructor(inTitle) {
        this.title = inTitle;
    }

    /////////////////////
    // Getters/Setters //
    /////////////////////
    get title() {
        return this.#title;
    }
    set title(inTitle) {
        this.#title = inTitle;
    }

    get items() {
        return this.#items;
    }
    set items(inItems) {
        this.#items = inItems;
    }

    /////////////
    // Methods //
    /////////////
    addItem(item) {
        this.#items.push(item);
    }

    // Private fields are skipped by JSON.stringify, so expose them here
    toJSON() {
        return { title: this.#title, items: this.#items };
    }
}

export class SkillItem {
    ////////////
    // Fields //
    ////////////
    #signature;
    #note;

    // Constructor //
    constructor(inSignature, inNote) {
        this.signature = inSignature;
        this.note = inNote;
    }

    /////////////////////
    // Getters/Setters //
    /////////////////////
    get signature() {
        return this.#signature;
    }
    set signature(inSignature) {
        this.#signature = inSignature;
    }

    get note() {
        return this.#note;
    }
    set note(inNote) {
        this.#note = inNote;
    }

    toJSON() {
        return { signature: this.#signature, note: this.#note };
    }
}
