import { createLocalStorage } from '../lib/storage';
import type { TrackerStorage } from '../lib/storage';

/** An in-memory Storage, so tests never depend on a real browser backend. */
export function memoryBackend(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k) => map.get(k) ?? null,
    key: (i) => [...map.keys()][i] ?? null,
    removeItem: (k) => void map.delete(k),
    setItem: (k, v) => void map.set(k, String(v)),
  };
}

export function memoryStorage(backend: Storage = memoryBackend()): { storage: TrackerStorage; backend: Storage } {
  return { storage: createLocalStorage(backend), backend };
}
