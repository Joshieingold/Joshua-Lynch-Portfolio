async function load(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load ${url}: HTTP ${response.status}`);
    }
    return response;
}

export const loadJson = async (url) => (await load(url)).json();
export const loadText = async (url) => (await load(url)).text();
