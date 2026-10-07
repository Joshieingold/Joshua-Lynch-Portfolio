export class Skill {
    // Constructor //
    constructor(inTitle) {
        this.title = inTitle;
        this.items = [];
    }

    ////////////
    // Fields //
    ////////////
    #title;
    #items;

    /////////////////////
    // Getters/Setters //
    /////////////////////
    get title() {
        return this.#title;
    }
    set title(inTitle) {
        this.title = inTitle;
    }

    get items() {
        return this.#items;
    }
    set items(inItems) {
        this.items = inItems;
    }

    /////////////
    // Methods //
    /////////////
    addItem(item) {
        this.items.push(item);
    }
}

export class SkillItem {
    // Constructor //
    constructor(inSignature, inNote) {
        this.signature = inSignature;
        this.note = inNote;
    }

    ////////////
    // Fields //
    ////////////
    #signature;
    #note;

    /////////////////////
    // Getters/Setters //
    /////////////////////
    get signature() {
        return this.#signature;
    }
    set signature(inSignature) {
        this.signature = inSignature;
    }
    get note() {
        return this.#note;
    }
    set note(inNote) {
        this.note = inNote;
    }
}
