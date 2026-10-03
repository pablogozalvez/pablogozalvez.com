import test from "node:test";
import assert from "node:assert/strict";
import { reveal } from "../src/lib/actions.js";

test("el reveal conserva contenido visible, respeta movimiento reducido y libera observaciones", (t) => {
    const observations = new Map();
    let callback;
    globalThis.window = { innerHeight: 800, matchMedia: () => ({ matches: false }) };
    globalThis.IntersectionObserver = class {
        constructor(cb) { callback = cb; }
        observe(el) { observations.set(el, true); }
        unobserve(el) { observations.delete(el); }
    };
    t.after(() => { delete globalThis.window; delete globalThis.IntersectionObserver; });
    const element = (top) => ({
        dataset: {},
        getBoundingClientRect: () => ({ top, bottom: top + 100 }),
        addEventListener() {}, removeEventListener() {},
    });
    const visible = element(200);
    reveal(visible);
    assert.deepEqual(visible.dataset, {});

    const below = element(1000);
    const action = reveal(below);
    assert.equal(below.dataset.revealPending, "");
    callback([{ target: below, isIntersecting: true }]);
    assert.equal(below.dataset.revealed, "");
    assert.equal(below.dataset.revealPending, undefined);
    assert.equal(observations.size, 0);
    action.destroy();

    window.matchMedia = () => ({ matches: true });
    const reduced = element(1000);
    reveal(reduced);
    assert.deepEqual(reduced.dataset, {});
});
