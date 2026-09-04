// jsdom gives us localStorage, but each test file should start from a clean slate.
import { beforeEach } from 'vitest';

beforeEach(() => {
  localStorage.clear();
});
