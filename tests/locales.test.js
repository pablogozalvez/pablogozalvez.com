import test from "node:test";
import assert from "node:assert/strict";
import { getLocaleFromPath, localizePath } from "../src/lib/locales.js";

test("el idioma depende del segmento de la URL", () => {
    assert.equal(getLocaleFromPath("/"), "en");
    assert.equal(getLocaleFromPath("/es"), "es");
    assert.equal(getLocaleFromPath("/es/"), "es");
    assert.equal(getLocaleFromPath("/essential"), "en");
});

test("cambiar de idioma conserva la ruta, consulta y ancla", () => {
    assert.equal(localizePath("/?ref=portfolio#projects", "es"), "/es?ref=portfolio#projects");
    assert.equal(localizePath("/es?ref=portfolio#contact", "en"), "/?ref=portfolio#contact");
    assert.equal(localizePath("/es/project?id=1#demo", "es"), "/es/project?id=1#demo");
});
