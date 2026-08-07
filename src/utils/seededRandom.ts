/**
 * Deterministic pseudo-random numbers.
 *
 * Stadium layout generation used `Math.random()` to pick things like whether a
 * park has a berm and what its berm/party-deck is called. Those values end up in
 * rendered markup, so the server and the client each rolled their own dice and
 * React reported a hydration mismatch — and the "facts" shown about a park
 * changed on every reload.
 *
 * Seeding from a stable key (the stadium id) makes the same park always produce
 * the same layout, on both sides of the wire and across reloads, while keeping
 * the varied-looking distribution the generators were after.
 */

/** FNV-1a: small, fast, well-distributed string hash. */
export function hashString(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    // 32-bit FNV prime multiply, done with shifts to stay in int range.
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/**
 * mulberry32 PRNG — returns a function yielding numbers in [0, 1), exactly like
 * Math.random() but reproducible for a given seed.
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function next(): number {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A reproducible `Math.random()` replacement keyed on a stable string. */
export function seededRandom(key: string): () => number {
  return mulberry32(hashString(key));
}

/** Deterministically pick one element of `items` for a given key. */
export function seededPick<T>(items: readonly T[], key: string): T {
  return items[Math.floor(seededRandom(key)() * items.length)];
}
