import { Skill, SkillItem } from "./Skill.mjs";
import { loadJson } from "../utils/http.mjs";

export class SkillsManager {
    ////////////
    // Fields //
    ////////////
    #dataSource = new URL("../data/skillData.json", import.meta.url);
    #language;
    #framework;
    #tool;
    #technique;

    /////////////////////
    // Getters/Setters //
    /////////////////////
    get language() {
        return this.#language;
    }
    set language(inLanguage) {
        this.#language = inLanguage;
    }

    get framework() {
        return this.#framework;
    }
    set framework(inFramework) {
        this.#framework = inFramework;
    }

    get tool() {
        return this.#tool;
    }
    set tool(inTool) {
        this.#tool = inTool;
    }

    get technique() {
        return this.#technique;
    }
    set technique(inTechnique) {
        this.#technique = inTechnique;
    }

    // Every loaded category, in display order (this is what the view renders)
    get all() {
        return [
            this.#language,
            this.#framework,
            this.#tool,
            this.#technique,
        ].filter(Boolean);
    }

    /////////////
    // Methods //
    /////////////
    async populate() {
        const categories = await loadJson(this.#dataSource);

        for (const category of categories) {
            const skill = new Skill(category.title);
            for (const item of category.items) {
                skill.addItem(new SkillItem(item.signature, item.note));
            }
            this.initializeProperty(skill.title, skill);
        }
    }

    toJSON() {
        return {
            language: this.#language,
            framework: this.#framework,
            tool: this.#tool,
            technique: this.#technique,
        };
    }

    initializeProperty(propName, propData) {
        switch (propName) {
            case "Languages":
                this.language = propData;
                break;
            case "Frameworks":
                this.framework = propData;
                break;
            case "Tools":
                this.tool = propData;
                break;
            case "Techniques":
                this.technique = propData;
                break;
            default:
                throw new Error(`Unable to initialize property "${propName}"`);
        }
    }
}
