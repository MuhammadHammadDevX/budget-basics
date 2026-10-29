const DATA_URL = `${import.meta.env.BASE_URL}data/`;
const cache = new Map();

export async function fetchJSON(name) {
  if (cache.has(name)) return cache.get(name);
  const response = await fetch(`${DATA_URL}${name}.json`);
  if (!response.ok) {
    throw new Error(`Could not load ${name}.json (status ${response.status})`);
  }
  const data = await response.json();
  cache.set(name, data);
  return data;
}

export const DATA_FILES = ['site', 'basics', 'needsWants', 'mistakes', 'tips', 'gallery', 'chatbot', 'habits'];

export async function fetchAllContent() {
  const results = await Promise.all(DATA_FILES.map((name) => fetchJSON(name)));
  return Object.fromEntries(DATA_FILES.map((name, i) => [name, results[i]]));
}

export function assetUrl(path) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}
