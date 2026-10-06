const WHO = { kids: "Діти", teens: "Підлітки", adult: "Дорослі" };
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const SOON = '<span class="soon">буде додано</span>';
const mapsLink = (q) => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);

// Кнопки запису
document.querySelectorAll("[data-book]").forEach((a) => {
  a.href = CONTACTS.booking;
  a.target = "_blank";
  a.rel = "noopener";
});

// Напрямки
function renderGroups(filter) {
  const host = $("#groups");
  host.innerHTML = GROUPS.map((g) => {
    const items = g.items.filter((i) => filter === "all" || i.who.includes(filter));
    if (!items.length) return "";
    return `<div class="group"><h3>${esc(g.title)}</h3><div class="cards">${items.map((i) => `
      <article class="card">
        <div class="card-head"><h4>${esc(i.name)}</h4>${i.en ? `<span class="en">${esc(i.en)}</span>` : ""}</div>
        <p>${esc(i.text)}</p>
        <div class="tags">${i.who.map((w) => `<span class="tag ${w}">${WHO[w]}</span>`).join("")}</div>
      </article>`).join("")}</div></div>`;
  }).join("");
}

let filter = "all";
try { filter = localStorage.getItem("pz-filter") || "all"; } catch (e) {}
if (filter !== "all" && !WHO[filter]) filter = "all";
document.querySelectorAll(".chip").forEach((b) => {
  b.setAttribute("aria-pressed", String(b.dataset.f === filter));
  b.addEventListener("click", () => {
    filter = b.dataset.f;
    document.querySelectorAll(".chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    try { localStorage.setItem("pz-filter", filter); } catch (e) {}
    renderGroups(filter);
  });
});
renderGroups(filter);

// Ціни
$("#prices").innerHTML = PRICES.map((p) => `
  <div><span>${esc(p.name)}${p.note ? `<small>${esc(p.note)}</small>` : ""}</span>
  <b>${p.price ? p.price.toLocaleString("uk-UA") + " грн" : '<span class="soon">уточнюється</span>'}</b></div>`).join("");

// Розклад
$("#schedule").innerHTML = HALLS.map((h) => {
  const rows = SCHEDULE[h.id] || [];
  const body = rows.length
    ? `<table><tbody>${rows.map((r) => `<tr><td>${esc(r.day)}</td><td>${esc(r.time)}</td><td>${esc(r.title)}</td><td>${esc(r.who || "")}</td></tr>`).join("")}</tbody></table>`
    : `<p class="soon">Розклад цього залу буде додано. Поки що підкажемо в повідомленнях.</p>`;
  return `<div class="hall-sched"><h4>${esc(h.name)} <span>${esc(h.address)}</span></h4><div class="table-wrap">${body}</div></div>`;
}).join("");

// Тренери
$("#coaches").innerHTML = (COACHES.length ? COACHES : [{}, {}, {}]).map((c) => `
  <article class="coach">
    <div class="photo">${c.photo ? `<img src="${esc(c.photo)}" alt="${esc(c.name)}" loading="lazy">` : `<span>фото</span>`}</div>
    <h4>${c.name ? esc(c.name) : "Тренер"}</h4>
    <p class="role">${c.role ? esc(c.role) : SOON}</p>
    ${c.about ? `<p>${esc(c.about)}</p>` : ""}
  </article>`).join("");

// Галерея
const placeholders = ["Полотна", "Кільце", "Гамак", "Пілон", "Акробатика", "Виступи"];
$("#gallery").innerHTML = GALLERY.length
  ? GALLERY.map((g) => `<figure><img src="${esc(g.src)}" alt="${esc(g.alt || "")}" loading="lazy"></figure>`).join("")
  : placeholders.map((t, i) => `<figure class="ph ph${i % 3}"><figcaption>${t}<small>фото буде додано</small></figcaption></figure>`).join("");

// Зали
$("#halls").innerHTML = HALLS.map((h) => `
  <article class="loc">
    <div class="district">${esc(h.name)}</div>
    <address>${esc(h.address)}${h.hint ? `<span>${esc(h.hint)}</span>` : ""}</address>
    <iframe class="map" title="Карта: ${esc(h.address)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
      src="https://maps.google.com/maps?q=${encodeURIComponent(h.map)}&z=16&output=embed"></iframe>
    <a class="btn ghost" href="${mapsLink(h.map)}" target="_blank" rel="noopener">Прокласти маршрут</a>
  </article>`).join("");

// Контакти
const contactCards = [
  ["Написати нам", CONTACTS.booking, "mssg.me/pole_zen_school"],
  ["Instagram", CONTACTS.instagram, "@pole_zen_school"],
  ["Telegram", CONTACTS.telegram, CONTACTS.telegram.replace(/^https?:\/\/t\.me\//, "@")],
  ["Viber", CONTACTS.viber, "Написати у Viber"],
  ["Телефон", CONTACTS.phone && "tel:" + CONTACTS.phone.replace(/[^\d+]/g, ""), CONTACTS.phone]
];
$("#contacts").innerHTML = contactCards.map(([k, href, label]) => href
  ? `<a href="${esc(href)}"${href.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}><span class="k">${k}</span><span class="v">${esc(label)}</span></a>`
  : `<div><span class="k">${k}</span><span class="v">${SOON}</span></div>`).join("");

$("#year").textContent = new Date().getFullYear();
