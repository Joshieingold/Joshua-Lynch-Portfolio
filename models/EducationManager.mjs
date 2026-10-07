import { EducationEntry } from "./Education.mjs";
import { loadJson } from "../utils/http.mjs";

export class EducationManager {
    ////////////
    // Fields //
    ////////////
    #dataSource = new URL("../data/educationData.json", import.meta.url);
    #entries = [];

    /////////////
    // Getters //
    /////////////
    get all() {
        return [...this.#entries];
    }

    /////////////
    // Methods //
    /////////////
    async populate() {
        const data = await loadJson(this.#dataSource);
        this.#entries = data.map((d) => new EducationEntry(d));
    }

    ofKind(kind) {
        return this.#entries.filter((e) => e.kind === kind);
    }

    toJSON() {
        return this.#entries;
    }
}
