export class EducationEntry {
    ////////////
    // Fields //
    ////////////
    #kind;
    #name;
    #program;
    #years;
    #desc;
    #highlights;
    #courses;
    #projects; // project names, resolved to links by the view
    #url;

    /////////////////
    // Constructor //
    /////////////////
    constructor({
        kind,
        name,
        program = "",
        years = "",
        desc = "",
        highlights = [],
        courses = [],
        projects = [],
        url = "",
    }) {
        this.#kind = kind;
        this.#name = name;
        this.#program = program;
        this.#years = years;
        this.#desc = desc;
        this.#highlights = [...highlights];
        this.#courses = [...courses];
        this.#projects = [...projects];
        this.#url = url;
    }

    /////////////
    // Getters //
    /////////////
    get kind() {
        return this.#kind;
    }
    get name() {
        return this.#name;
    }
    get program() {
        return this.#program;
    }
    get years() {
        return this.#years;
    }
    get desc() {
        return this.#desc;
    }
    get highlights() {
        return this.#highlights;
    }
    get courses() {
        return this.#courses;
    }
    get projects() {
        return this.#projects;
    }
    get url() {
        return this.#url;
    }

    toJSON() {
        return {
            kind: this.#kind,
            name: this.#name,
            program: this.#program,
            years: this.#years,
            desc: this.#desc,
            highlights: this.#highlights,
            courses: this.#courses,
            projects: this.#projects,
            url: this.#url,
        };
    }
}
