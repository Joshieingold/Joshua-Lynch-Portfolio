import { SkillItem } from "./Skill.mjs";

export class SkillsManager {
    // Constructor //
    constructor() {
        this.populate();
    }
    ////////////
    // Fields //
    ////////////
    #dataSource = "../data/skillData.json";
    #language;
    #framework;
    #tool;
    #technique;

    /////////////////////
    // Getters/Setters //
    /////////////////////
    get language() {}
    set language(inLangauge) {
        this.language = inLangauge;
    }

    get framework() {}
    set framework(inFramework) {
        this.framework = inFramework;
    }

    get tool() {}
    set tool(inTool) {
        this.tool = inTool;
    }

    get technique() {}
    set technique(inTechnique) {
        this.technique = inTechnique;
    }

    /////////////
    // Methods //
    /////////////
    async populate() {
        try {
            let data = fetch(this.#dataSource);
            for (let i = 0; i < data.length; i++) {
                let currentDataSet = data[i];
                let skillObj = new Skill(currentDataSet.title);
                for (let j = 0; j < currentDataSet.items.length; j++) {
                    let currentItem = currentDataSet.items[j];
                    let itemObj = new SkillItem(
                        currentItem.signature,
                        currentItem.note,
                    );
                    skillObj.addItem(itemObj);
                }
                this.initializeProperty(skillObj.title, skillObj);
            }
        } catch (skillManagerPopulateErr) {
            console.error("ERROR: ", skillManagerPopulateErr);
        }
    }
    toJSON() {
        return {
            langauge: this.#language,
            framework: this.#framework,
            tool: this.#tool,
            technique: this.#technique,
        };
    }
    initializeProperty(propName, propData) {
        switch (propName) {
            case "language":
                this.language = propData;
            case "framework":
                this.framework = propData;
            case "tool":
                this.tool = propData;
            case "technique":
                this.technique = propData;
            default:
                throw new Error(
                    "ERROR: Unable to intialize property ",
                    propName,
                );
        }
    }
}
