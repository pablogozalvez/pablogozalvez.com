import test from "node:test";
import assert from "node:assert/strict";
import { animationVisibility } from "../src/lib/animation-visibility.js";

test("pausar fuera de pantalla, en pestañas ocultas y con movimiento reducido; liberar listeners", (t) => {
    let callback;
    let disconnected = false;
    const listeners = new Map();
    const motion = { matches: false, addEventListener: (key, fn) => listeners.set(key, fn), removeEventListener: key => listeners.delete(key) };
    globalThis.window = { matchMedia: () => motion };
    globalThis.document = { hidden: false, addEventListener: (key, fn) => listeners.set(key, fn), removeEventListener: key => listeners.delete(key) };
    globalThis.IntersectionObserver = class {
        constructor(cb) { callback = cb; }
        observe() {}
        disconnect() { disconnected = true; }
    };
    t.after(() => { delete globalThis.window; delete globalThis.document; delete globalThis.IntersectionObserver; });
    let paused;
    const states = [];
    const action = animationVisibility({ toggleAttribute: (_, value) => (paused = value), removeAttribute() {} }, value => states.push(value));
    assert.equal(paused, true);
    callback([{ isIntersecting: true }]);
    assert.equal(paused, false);
    document.hidden = true;
    listeners.get("visibilitychange")();
    assert.equal(paused, true);
    document.hidden = false;
    listeners.get("visibilitychange")();
    assert.equal(paused, false);
    motion.matches = true;
    listeners.get("change")();
    assert.equal(paused, true);
    motion.matches = false;
    callback([{ isIntersecting: false }]);
    assert.equal(paused, true);
    action.destroy();
    assert.equal(disconnected, true);
    assert.equal(listeners.size, 0);
    assert.equal(states.at(-1), false);
});
