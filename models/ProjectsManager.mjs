import { Project } from "./Project.mjs";
import { loadJson } from "../utils/http.mjs";

export class ProjectsManager {
    ////////////
    // Fields //
    ////////////
    #dataSource = new URL("../data/projectData.json", import.meta.url);
    #projects = [];
    #activeFilters = new Set();

    /////////////
    // Getters //
    /////////////
    get all() {
        return [...this.#projects];
    }
    get activeFilters() {
        return [...this.#activeFilters];
    }
    get filtered() {
        return this.#projects.filter((p) => p.usesAll(this.activeFilters));
    }
    get tagCounts() {
        const counts = new Map();
        for (const p of this.#projects) {
            for (const t of p.stack) counts.set(t, (counts.get(t) || 0) + 1);
        }
        return [...counts].sort(
            (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
        );
    }

    /////////////
    // Methods //
    /////////////
    async populate() {
        const data = await loadJson(this.#dataSource);
        this.#projects = data.map((d) => new Project(d));
    }

    find(name) {
        return this.#projects.find((p) => p.name === name);
    }

    toggleFilter(tag) {
        this.#activeFilters.has(tag)
            ? this.#activeFilters.delete(tag)
            : this.#activeFilters.add(tag);
    }

    clearFilters() {
        this.#activeFilters.clear();
    }

    toJSON() {
        return this.#projects;
    }
}
