const STORAGE_KEY = "portfolio-theme";

// Order of the values in each palette below
const KEYS = [
    "background",
    "alt-background",
    "black",
    "foreground",
    "white",
    "comment",
    "red",
    "orange",
    "yellow",
    "green",
    "cyan",
    "blue",
    "teal",
    "purple",
];

const VAR_NAMES = [...KEYS, "variable-color"];

const make = (id, label, mode, values) => {
    const colors = Object.fromEntries(KEYS.map((k, i) => [k, values[i]]));
    colors["variable-color"] =
        mode === "dark" ? colors.teal : colors.foreground;
    return {
        id,
        label,
        mode,
        colors,
        preview: [colors.background, colors.blue, colors.green],
    };
};

export const THEMES = [
    {
        id: "system",
        label: "system",
        mode: null,
        colors: null,
        preview: ["#e6e7ed", "#24283b", "#7aa2f7"],
    },
    make("tokyo-night", "tokyo night", "dark", [
        "#24283b",
        "#1a1b26",
        "#1a1b26",
        "#a9b1d6",
        "#c0caf5",
        "#565f89",
        "#f7768e",
        "#ff9e64",
        "#e0af68",
        "#9ece6a",
        "#7dcfff",
        "#7aa2f7",
        "#73daca",
        "#bb9af7",
    ]),
    make("tokyo-day", "tokyo day", "light", [
        "#e6e7ed",
        "#f2f3f7",
        "#343b58",
        "#343b58",
        "#ffffff",
        "#6c6e75",
        "#8c4351",
        "#965027",
        "#8f5e15",
        "#385f0d",
        "#0f4b6e",
        "#2959aa",
        "#33635c",
        "#5a3e8e",
    ]),
    make("dracula", "dracula", "dark", [
        "#282a36",
        "#21222c",
        "#191a21",
        "#f8f8f2",
        "#ffffff",
        "#6272a4",
        "#ff5555",
        "#ffb86c",
        "#f1fa8c",
        "#50fa7b",
        "#8be9fd",
        "#bd93f9",
        "#8be9fd",
        "#ff79c6",
    ]),
    make("phosphor", "phosphor", "dark", [
        "#0b140d",
        "#050a06",
        "#000000",
        "#3ddc6c",
        "#c8ffd8",
        "#3d8f57",
        "#ff6b6b",
        "#ffb454",
        "#e6db74",
        "#7dff9b",
        "#5ffbd8",
        "#5fd7ff",
        "#5ffbd8",
        "#d58cff",
    ]),
];

export class ThemeManager {
    #current = "system";

    constructor() {
        let saved = null;
        try {
            saved = localStorage.getItem(STORAGE_KEY);
        } catch {
            /* storage blocked: just use the default */
        }
        this.#apply(saved);
    }

    get all() {
        return THEMES;
    }
    get current() {
        return this.#current;
    }

    set(id) {
        this.#apply(id);
        try {
            localStorage.setItem(STORAGE_KEY, this.#current);
        } catch {
            /* ignore */
        }
    }

    #apply(id) {
        const theme = THEMES.find((t) => t.id === id) ?? THEMES[0];
        const root = document.documentElement;

        VAR_NAMES.forEach((k) => root.style.removeProperty(`--${k}`));
        if (theme.colors) {
            Object.entries(theme.colors).forEach(([k, v]) =>
                root.style.setProperty(`--${k}`, v),
            );
            root.dataset.mode = theme.mode;
            root.style.colorScheme = theme.mode;
        } else {
            delete root.dataset.mode;
            root.style.removeProperty("color-scheme");
        }
        this.#current = theme.id;
    }
}
