const host = document.getElementById("groups");

function render(filter){
  host.innerHTML = "";
  for (const g of GROUPS){
    const items = g.items.filter(i => filter === "all" || i.who.includes(filter));
    if (!items.length) continue;
    const el = document.createElement("div");
    el.className = "group";
    el.innerHTML = `<h3>${g.title}</h3><div class="cards">${items.map(i => `
      <article class="card">
        <h4>${i.name}</h4>
        <p>${i.text}</p>
        <div class="tags">${i.who.map(w => `<span class="tag ${w}">${LABEL[w]}</span>`).join("")}</div>
      </article>`).join("")}</div>`;
    host.appendChild(el);
  }
}

let current = "all";
try { current = localStorage.getItem("pz-filter") || "all"; } catch (e) {}
document.querySelectorAll(".chip").forEach(b => {
  b.setAttribute("aria-pressed", String(b.dataset.f === current));
  b.addEventListener("click", () => {
    current = b.dataset.f;
    document.querySelectorAll(".chip").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    try { localStorage.setItem("pz-filter", current); } catch (e) {}
    render(current);
  });
});
render(current);
