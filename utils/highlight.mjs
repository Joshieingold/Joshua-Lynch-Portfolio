import { esc } from "./dom.mjs";

const words = (s) => new Set(s.split(" "));
const TYPES = words(
    "int uint long short char byte bool boolean float double string str void auto size_t usize isize u8 u16 u32 u64 i8 i16 i32 i64 f32 f64 object decimal",
);
const LANGS = {
    clike: {
        comment: /\/\/.*|\/\*[\s\S]*?\*\//,
        kw: words(
            "if else for foreach while do switch case default break continue return new delete class struct enum union interface extends implements public private protected static const let var function async await try catch finally throw throws namespace using import from export typeof this self null nullptr true false fn pub mut impl use mod match loop in as where override virtual final template typename sizeof go func defer range package type chan select goto lambda override readonly abstract get set",
        ),
    },
    python: {
        comment: /#.*/,
        kw: words(
            "def class if elif else for while return import from as with try except finally raise lambda yield pass break continue in is not and or None True False self async await global nonlocal assert del",
        ),
    },
    lua: {
        comment: /--\[\[[\s\S]*?\]\]|--.*/,
        kw: words(
            "function local end if then else elseif for while do repeat until return break in and or not nil true false",
        ),
    },
};
const LANG_ALIAS = { py: "python", python: "python", lua: "lua" };
const STRING_RE = /"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`/;

// lang is optional; unknown languages fall back to a C-style grammar
export function highlight(code, lang = "") {
    const L = LANGS[LANG_ALIAS[String(lang).toLowerCase()] || "clike"];
    const re = new RegExp(
        `(${L.comment.source})|(${STRING_RE.source})|(\\b\\d[\\w.]*)|([A-Za-z_]\\w*)`,
        "g",
    );
    let out = "",
        last = 0;
    for (const m of code.matchAll(re)) {
        let cls;
        if (m[1]) cls = "comment";
        else if (m[2]) cls = "string";
        else if (m[3]) cls = "number";
        else {
            const w = m[0];
            if (L.kw.has(w)) cls = "keyword";
            else if (code[m.index + w.length] === "(") cls = "function";
            else if (TYPES.has(w) || /^[A-Z]/.test(w)) cls = "type";
        }
        out += esc(code.slice(last, m.index));
        out += cls ? `<span class="tok-${cls}">${esc(m[0])}</span>` : esc(m[0]);
        last = m.index + m[0].length;
    }
    return out + esc(code.slice(last));
}
