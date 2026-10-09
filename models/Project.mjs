export class Project {
    ////////////
    // Fields //
    ////////////
    #name;
    #desc;
    #stack;
    #url;
    #site;
    #long;
    #image;
    #snippet;

    /////////////////
    // Constructor //
    /////////////////
    constructor({
        name,
        desc = "",
        stack = [],
        url = "",
        site = "",
        long = [],
        image = "",
        snippet = null,
    }) {
        this.#name = name;
        this.#desc = desc;
        this.#stack = [...stack];
        this.#url = url;
        this.#site = site;
        this.#long = [].concat(long);
        this.#image = image;
        this.#snippet = snippet;
    }

    /////////////
    // Getters //
    /////////////
    get name() {
        return this.#name;
    }
    get desc() {
        return this.#desc;
    }
    get stack() {
        return this.#stack;
    }
    get url() {
        return this.#url;
    }
    get site() {
        return this.#site;
    }
    get long() {
        return this.#long;
    }
    get image() {
        return this.#image;
    }
    get snippet() {
        return this.#snippet;
    }
    get hasDetails() {
        return (
            this.#long.length > 0 ||
            Boolean(this.#image) ||
            Boolean(this.#snippet)
        );
    }

    /////////////
    // Methods //
    /////////////
    usesAll(tags) {
        return tags.every((t) => this.#stack.includes(t));
    }

    toJSON() {
        return {
            name: this.#name,
            desc: this.#desc,
            stack: this.#stack,
            url: this.#url,
            site: this.#site,
            long: this.#long,
            image: this.#image,
            snippet: this.#snippet,
        };
    }
}
