/* ===== BUSINESS INFORMATION (edit here only) ===== */
const BUSINESS = {
  name: "The Food House",
  tagline: "Homestyle Food. Made Fresh Every Day.",
  address: "Kolkata, West Bengal",
  phone: "+91 98765 43210",
  whatsapp: "919876543210",           // country code + number, no + or spaces
  email: "hello@thefoodhouse.in",
  hours1: "Mon–Sat: 7:00 AM – 10:00 PM",
  hours2: "Sun: 8:00 AM – 10:00 PM"
};
/* ===== SOCIAL LINKS ===== */
const LINKS = { maps: "#", insta: "#", fb: "#" };   // paste real URLs
/* ===== MENU DATA ===== */
const MENU = {
  Breakfast: [["Masala Omelette","Spiced eggs with onion and green chilli",70,0,"breakfast"],["Aloo Paratha","Stuffed flatbread with curd and pickle",80,1,"breakfast"],["Bread & Egg","Toasted bread with fried egg",60,0,"breakfast"]],
  Lunch: [["Bengali Veg Thali","Rice, dal, seasonal sabzi, salad",120,1,"thali"],["Chicken Meal","Rice, dal, chicken curry",180,0,"thali"],["Fish Thali","Rice, dal, fish curry, fry",170,0,"thali"]],
  Dinner: [["Chicken Curry & Rice","Home-style curry with steamed rice",160,0,"curry"],["Egg Curry & Rice","Egg curry with steamed rice",110,0,"curry"],["Veg Meal","Rice, dal, vegetables",100,1,"curry"]],
  Snacks: [["Chicken Roll","Paratha roll with spiced chicken",100,0,"roll"],["Egg Roll","Paratha roll with egg and onion",70,0,"roll"],["French Fries","Crisp salted fries",90,1,"roll"]],
  Drinks: [["Fresh Lime Soda","Sweet, salted or mixed",50,1,"drink"],["Cold Coffee","Chilled and creamy",80,1,"drink"],["Tea","Freshly brewed",30,1,"drink"]]
};
/* ===== GALLERY (file, alt text) ===== */
const GALLERY = [["thali","Thali served with rice and curries"],["curry","Chicken curry and rice"],["interior","Restaurant interior"],["roll","Freshly made rolls"],["drink","Cold drinks"],["special","Signature chicken thali"]];
/* ===== END CONFIG ===== */

const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const wa = t => `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(t)}`;
const href = {
  tel: `tel:${BUSINESS.phone.replace(/\s/g, "")}`, wa: wa("Hi, I would like to enquire about your food/menu."),
  "wa-special": wa("Hi, what is today's special?"), mail: `mailto:${BUSINESS.email}`,
  maps: LINKS.maps, insta: LINKS.insta, fb: LINKS.fb
};
$$("[data-b]").forEach(e => e.textContent = BUSINESS[e.dataset.b]);
$$("[data-b-link]").forEach(e => e.href = href[e.dataset.bLink]);
document.title = `${BUSINESS.name} | ${BUSINESS.address}`;

/* nav */
const nav = $("#nav"), burger = $("#burger"), links = $("#links");
const setMenu = o => { links.classList.toggle("open", o); burger.setAttribute("aria-expanded", o); };
burger.onclick = () => setMenu(!links.classList.contains("open"));
$$("a", links).forEach(a => a.onclick = () => setMenu(false));
document.addEventListener("keydown", e => e.key === "Escape" && setMenu(false));
addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", scrollY > 30); $("#top").hidden = scrollY < 600;
}, { passive: true });
$("#top").onclick = () => scrollTo({ top: 0 });
const spy = new IntersectionObserver(es => es.forEach(e => e.isIntersecting &&
  $$("a", links).forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id))), { rootMargin: "-45% 0px -50% 0px" });
$$("main section[id]").forEach(s => spy.observe(s));

/* menu tabs */
const tabs = $("#tabs"), grid = $("#menu-grid");
function showCat(c) {
  $$("button", tabs).forEach(b => b.setAttribute("aria-selected", b.textContent === c));
  grid.innerHTML = MENU[c].map(([n, d, p, v, img]) => `<article class="item"><img src="assets/images/${img}.svg" alt="${n}" loading="lazy"><div>
    <h3><span>${n}</span><span>₹${p}</span></h3><p><span class="dot ${v ? "" : "nv"}" role="img" aria-label="${v ? "Vegetarian" : "Non-vegetarian"}"></span>${d}</p></div></article>`).join("");
}
Object.keys(MENU).forEach(c => { const b = document.createElement("button"); b.textContent = c; b.setAttribute("role", "tab"); b.onclick = () => showCat(c); tabs.append(b); });
showCat(Object.keys(MENU)[0]);

/* gallery + lightbox */
const gg = $("#gallery-grid"), lb = $("#lb"); let cur = 0;
gg.innerHTML = GALLERY.map(([f, a], i) => `<button data-i="${i}" aria-label="Open image: ${a}"><img src="assets/images/${f}.svg" alt="${a}" loading="lazy"></button>`).join("");
const show = i => { cur = (i + GALLERY.length) % GALLERY.length; $("#lb-img").src = `assets/images/${GALLERY[cur][0]}.svg`; $("#lb-img").alt = GALLERY[cur][1]; };
const close = () => { lb.hidden = true; document.body.style.overflow = ""; };
$$("button", gg).forEach(b => b.onclick = () => { show(+b.dataset.i); lb.hidden = false; document.body.style.overflow = "hidden"; $("#lb-x").focus(); });
$("#lb-x").onclick = close; $("#lb-p").onclick = () => show(cur - 1); $("#lb-n").onclick = () => show(cur + 1);
lb.onclick = e => e.target === lb && close();
document.addEventListener("keydown", e => { if (lb.hidden) return; if (e.key === "Escape") close(); if (e.key === "ArrowLeft") show(cur - 1); if (e.key === "ArrowRight") show(cur + 1); });

/* reveal + counters */
const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))), { threshold: .12 });
$$(".sec h2,.why article,.rev blockquote").forEach(e => { e.classList.add("reveal"); io.observe(e); });
const co = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; co.unobserve(e.target);
  const el = e.target, end = +el.dataset.count, dec = +el.dataset.dec || 0, t0 = performance.now();
  (function tick(t) { const p = Math.min((t - t0) / 1200, 1); el.textContent = (end * p).toFixed(dec); if (p < 1) requestAnimationFrame(tick); })(t0);
}));
$$("[data-count]").forEach(e => co.observe(e));

/* enquiry form -> WhatsApp */
$("#form").onsubmit = e => {
  e.preventDefault();
  const n = $("#f-name").value.trim(), p = $("#f-phone").value.trim(), m = $("#f-msg").value.trim(), err = $("#err");
  if (!n || !m) return err.textContent = "Please enter your name and a message.";
  if (!/^[+\d][\d\s-]{7,14}$/.test(p)) return err.textContent = "Please enter a valid phone number.";
  err.textContent = "";
  window.open(wa(`Hi, I'm ${n} (${p}). ${m}`), "_blank", "noopener");
};