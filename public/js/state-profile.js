/* ============================================================
   VIBHOR — State / Union Territory profile (tabbed card)
   Rendered on the region page whenever a state/UT is in focus
   (?state=...). Content comes from js/data-states.js —
   narrative fields in the active language, proper-noun lists
   the same in every language. Re-renders on language change.
   ============================================================ */
(function () {
  "use strict";
  const qs = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>\"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function activeLang() { try { return window.VIBHOR_I18N ? VIBHOR_I18N.getLang() : "en"; } catch (e) { return "en"; } }
  function ui(key, fb) { try { const v = window.VIBHOR_I18N ? VIBHOR_I18N.t(key) : ""; return (v && v !== key) ? v : fb; } catch (e) { return fb; } }
  function field(st, k) {
    const l = activeLang();
    const t = st.t || {};
    return ((t[l] && t[l][k]) || (t.en && t.en[k]) || "");
  }
  function regionName(key) {
    try {
      if (window.VH_CONTENT) { const v = VH_CONTENT.regionName(key); if (v) return v; }
    } catch (e) {}
    try { const D = window.HERITAGE; return (D.regions[key] && D.regions[key].name) || ""; } catch (e) { return ""; }
  }
  function itemsFor(name) {
    try { return (window.HERITAGE.items || []).filter((i) => i.state === name); } catch (e) { return []; }
  }

  function chip(label, value) {
    if (!value) return "";
    return `<span class="sp-chip"><b>${esc(label)}:</b> ${esc(value)}</span>`;
  }
  function listBlock(title, items, icon) {
    if (!items || !items.length) return "";
    return `<div class="sp-list">
      <h4>${icon} ${esc(title)}</h4>
      <ul>${items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
    </div>`;
  }

  function render() {
    const host = qs("#stateProfile");
    if (!host) return;
    let stateName = "";
    try { stateName = new URLSearchParams(location.search).get("state") || ""; } catch (e) {}
    const st = window.HERITAGE_STATES && window.HERITAGE_STATES.get(stateName);
    if (!st) { host.style.display = "none"; host.innerHTML = ""; return; }

    const D = window.HERITAGE;
    const items = itemsFor(st.name);
    const rKey = D.stateRegion[st.name] || st.region;
    const rn = regionName(rKey);
    const L = (k) => field(st, k);

    host.style.display = "";
    host.innerHTML = `
    <div class="sp-card" style="border-top:4px solid ${st.color}">
      ${st.image ? `<div class="sp-photo" style="background:#1b0f0a url('${st.image}') center/cover no-repeat;min-height:140px;border-radius:14px 14px 0 0;" role="img" aria-label="${esc(L("name"))}"></div>` : ""}
      <div class="sp-head">
        <span class="sp-emoji" aria-hidden="true">${st.emoji}</span>
        <div class="sp-title">
          <h2>${esc(L("name"))}${st.ut ? ' <small class="sp-ut">' + esc(ui("st.ut", "Union Territory")) + "</small>" : ""}</h2>
          <div class="sp-chips">
            ${chip(ui("st.capital", "Capital"), st.capital)}
            ${chip(ui("st.region", "Region"), rn)}
            ${chip(ui("st.languages", "Languages"), st.languages.length ? st.languages.join(", ") : "")}
            ${items.length ? chip(ui("st.stories", "Curated stories"), String(items.length)) : ""}
          </div>
        </div>
        <span class="sp-famous" title="${esc(ui("st.famous", "Known for"))}">★ ${esc(L("famous"))}</span>
      </div>

      <div class="sp-tabs" role="tablist">
        <button class="sp-tab active" data-sp="overview" role="tab">${esc(ui("st.tab.overview", "Overview"))}</button>
        <button class="sp-tab" data-sp="food" role="tab">${esc(ui("st.tab.food", "Food & Festivals"))}</button>
        <button class="sp-tab" data-sp="arts" role="tab">${esc(ui("st.tab.arts", "Music, Dance & Arts"))}</button>
        <button class="sp-tab" data-sp="crafts" role="tab">${esc(ui("st.tab.crafts", "Crafts & Textiles"))}</button>
        <button class="sp-tab" data-sp="places" role="tab">${esc(ui("st.tab.places", "Places & Museums"))}</button>
      </div>

      <div class="sp-body" id="spBody"></div>

      ${items.length
        ? `<a class="btn btn-gold btn-sm sp-more" href="#stateStories">${esc(ui("st.seeStories", "See the curated stories below"))} ↓</a>`
        : `<p class="sp-nostories">${esc(ui("st.noStories", "No curated stories for this state/UT yet — its culture is covered above and in the quiz."))}</p>`}
    </div>`;

    const body = qs("#spBody", host);
    const panels = {
      overview: `
        <p class="sp-about">${esc(L("about"))}</p>
        <p class="sp-practice"><b>${esc(ui("st.practice", "Cultural life"))}:</b> ${esc(L("practice"))}</p>`,
      food: listBlock(ui("st.kb.food", "Food"), st.food, "🍛") +
            listBlock(ui("st.kb.festivals", "Festivals"), st.festivals, "🪔"),
      arts: listBlock(ui("st.kb.dance", "Dance"), st.dance, "💃") +
            listBlock(ui("st.kb.music", "Music"), st.music, "🎵"),
      crafts: listBlock(ui("st.kb.crafts", "Arts & Crafts"), st.crafts, "🎨") +
              listBlock(ui("st.kb.textiles", "Textiles"), st.textiles, "🧵"),
      places: listBlock(ui("st.kb.heritage", "Heritage & Monuments"), st.heritage, "🏛️") +
              listBlock(ui("st.kb.museums", "Museums"), st.museums, "🖼️") +
              listBlock(ui("st.kb.lesser", "Lesser-known heritage"), st.lesserKnown, "🔍")
    };
    body.innerHTML = panels.overview;
    host.querySelectorAll(".sp-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        host.querySelectorAll(".sp-tab").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        body.innerHTML = panels[btn.dataset.sp] || panels.overview;
      });
    });
  }

  document.addEventListener("DOMContentLoaded", render);
  document.addEventListener("vh:langchange", render);
})();
