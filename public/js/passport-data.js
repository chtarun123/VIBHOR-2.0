/* ============================================================
   VIBHOR — Heritage Passport data
   28 states · sample-rich data for AP, Bihar, Rajasthan,
   Kerala, Tamil Nadu · levels & badges
   ============================================================ */
window.HERITAGE_PASSPORT = {

  states: [
    { name: "Andhra Pradesh",    region: "south", landmark: "Tirumala Temple",  famous: "Temple circuits & the Krishna delta",     color: "#c2571b", emoji: "🛕", sample: true },
    { name: "Arunachal Pradesh", region: "east",  landmark: "Dibang Valley",    famous: "Himalayan forests & monasteries",       color: "#3d6b35", emoji: "🏔️" },
    { name: "Assam",             region: "east",  landmark: "Kamakhya Temple",  famous: "Tea gardens of the Brahmaputra",        color: "#7a5c1e", emoji: "🍃" },
    { name: "Bihar",             region: "east",  landmark: "Mahabodhi Temple", famous: "Buddhist heritage of Bodh Gaya",        color: "#8a2f57", emoji: "🪷", sample: true },
    { name: "Chhattisgarh",      region: "east",  landmark: "Sarguja Temples",  famous: "Folk arts & tribal crafts",             color: "#2a6a5e", emoji: "🥁" },
    { name: "Goa",               region: "west",  landmark: "Basilica of Bom Jesus", famous: "Beaches & Portuguese heritage",   color: "#b8860b", emoji: "🏖️" },
    { name: "Gujarat",           region: "west",  landmark: "Rann of Kutch",    famous: "Kutch crafts & the white desert",       color: "#0a5c8a", emoji: "🐫" },
    { name: "Haryana",           region: "north", landmark: "Pinjore Garden",   famous: "Lok kirtan & folk fairs",               color: "#6a4a8a", emoji: "🌾" },
    { name: "Himachal Pradesh",  region: "north", landmark: "Dharamshala",       famous: "Himalayan monasteries & trails",        color: "#4a6741", emoji: "⛰️" },
    { name: "Jharkhand",         region: "east",  landmark: "Unakot Hills",     famous: "Rock carvings & tribal arts",           color: "#8a5a2a", emoji: "🪨" },
    { name: "Karnataka",         region: "south", landmark: "Hampi Ruins",      famous: "Vijayanagara stone & Kanchi silk",     color: "#a0522d", emoji: "🪔" },
    { name: "Kerala",            region: "south", landmark: "Guruvayur Temple", famous: "Backwaters & Kathakali",                color: "#1e6b52", emoji: "🛶", sample: true },
    { name: "Madhya Pradesh",    region: "north", landmark: "Khajuraho Temples",famous: "Temple sculpture & dense forests",      color: "#7a3b2e", emoji: "🗿" },
    { name: "Maharashtra",       region: "west",  landmark: "Ellora Caves",     famous: "Maratha forts & Lavani",                color: "#5b3a6e", emoji: "🏰" },
    { name: "Manipur",           region: "east",  landmark: "Kangla Fort",      famous: "Classical dance & sword craft",         color: "#2e5f8a", emoji: "⚔️" },
    { name: "Meghalaya",         region: "east",  landmark: "Mawsynram",        famous: "Living root bridges",                   color: "#356b46", emoji: "🌉" },
    { name: "Mizoram",           region: "east",  landmark: "Champhui Park",    famous: "Bamboo crafts & Homas",                 color: "#5c7a3a", emoji: "🎋" },
    { name: "Nagaland",          region: "east",  landmark: "Tsokdiri Museum",  famous: "Hornbill Festival & tribal drums",      color: "#9c4a1a", emoji: "📯" },
    { name: "Odisha",            region: "east",  landmark: "Konark Sun Temple",famous: "Rath Yatra & stone dance",              color: "#c07818", emoji: "☀️" },
    { name: "Punjab",            region: "north", landmark: "Golden Temple",    famous: "Harvest fairs & Bhangra",               color: "#1e5f8a", emoji: "🌾" },
    { name: "Rajasthan",         region: "north", landmark: "Amer Fort",        famous: "Forts, deserts & blue pottery",         color: "#b03a2e", emoji: "🐪", sample: true },
    { name: "Sikkim",            region: "east",  landmark: "Rumtek Monastery", famous: "Gangtok & high Himalayan trails",       color: "#4a5c8a", emoji: "🏔️" },
    { name: "Tamil Nadu",        region: "south", landmark: "Brihadeeswarar Temple", famous: "Chola temples & Carnatic music",  color: "#a0322e", emoji: "🛕", sample: true },
    { name: "Telangana",         region: "south", landmark: "Charminar",        famous: "Biryani capital & Bidriware",           color: "#6e4a8a", emoji: "🕌" },
    { name: "Tripura",           region: "east",  landmark: "Unakot Rock Art",  famous: "Tripuri culture & rivers",              color: "#2a7a6a", emoji: "🪔" },
    { name: "Uttar Pradesh",     region: "north", landmark: "Taj Mahal",        famous: "Taj Mahal & Ganga ghats",               color: "#3a5ca0", emoji: "🕌" },
    { name: "Uttarakhand",       region: "north", landmark: "Kedarnath",        famous: "Himalayan shrines & yoga land",         color: "#41688a", emoji: "🧘" },
    { name: "West Bengal",       region: "east",  landmark: "Victoria Memorial",famous: "Durga Puja & literary legacy",          color: "#8a2e4a", emoji: "🎨" },
    /* -------- 8 Union Territories (post-2019/24) -------- */
    { name: "Chandigarh",        region: "north", landmark: "Capitol Complex",  famous: "Le Corbusier design & Rock Garden",     color: "#5a7a8a", emoji: "🏛️", ut: true },
    { name: "Delhi",             region: "north", landmark: "Red Fort",         famous: "Seven cities & Qutub Minar",            color: "#8a4a2a", emoji: "🏰", ut: true },
    { name: "Jammu & Kashmir",   region: "north", landmark: "Dal Lake",         famous: "Saffron fields & the valley",           color: "#3a6a8a", emoji: "🏔️", ut: true },
    { name: "Ladakh",            region: "north", landmark: "Hemis Monastery",  famous: "High cold desert & Khardung La",        color: "#6a5a8a", emoji: "⛰️", ut: true },
    { name: "Puducherry",        region: "south", landmark: "French Quarter",   famous: "Auroville & Sri Aurobindo",               color: "#8a6a4a", emoji: "🏛️", ut: true },
    { name: "Lakshadweep",       region: "south", landmark: "Kavaratti",        famous: "Coral atolls of the Arabian Sea",       color: "#2a7a8a", emoji: "🏝️", ut: true },
    { name: "Dadra and Nagar Haveli and Daman and Diu", region: "west", landmark: "Old Daman", famous: "Portuguese heritage on two coasts", color: "#7a5a3a", emoji: "🏰", ut: true },
    { name: "Andaman and Nicobar Islands", region: "east", landmark: "Cellular Jail", famous: "Coral reefs of the Bay of Bengal", color: "#1e6b7a", emoji: "🏝️", ut: true }
  ],

  /* map/URL names that resolve to the canonical passport entry */
  canonical: {
    "Dadra & Nagar Haveli": "Dadra and Nagar Haveli and Daman and Diu",
    "Daman & Diu": "Dadra and Nagar Haveli and Daman and Diu",
    "Andaman and Nicobar": "Andaman and Nicobar Islands"
  },

  levels: [
    { min: 36,  name: "India Expert",       e: "🏆", line: "All 36 states & UTs stamped — a true citizen of the subcontinent!" },
    { min: 28,  name: "Culture Champion",   e: "🏅", line: "Nearly the whole map is yours. A few states still wait." },
    { min: 20,  name: "Nation Wanderer",    e: "🧭", line: "You've crossed most regions — the full map is close." },
    { min: 16,  name: "Heritage Explorer",  e: "🗺️", line: "Serious mileage on the heritage route!" },
    { min: 10,  name: "Culture Voyager",    e: "🧭", line: "You're crossing regions now — keep the stamps coming." },
    { min: 5,   name: "Heritage Traveler",  e: "🎒", line: "Your passport is filling up nicely." },
    { min: 1,   name: "Sprouting Wanderer", e: "🌱", line: "First steps on the road — the map is waiting." },
    { min: 0,   name: "Blank Passport",     e: "📘", line: "Every journey begins with the first stamp." }
  ],

  badges: [
    { id: "explorer", name: "Heritage Explorer", e: "🗺️", need: 5,  bonus: 100, line: "Stamp 5 states to earn this badge." },
    { id: "champion", name: "Culture Champion",  e: "🏅", need: 12, bonus: 250, line: "Stamp 12 states to earn this badge." },
    { id: "expert",   name: "India Expert",      e: "🏆", need: 36, bonus: 500, line: "Stamp all 36 states & UTs — the grand badge." }
  ],

  avatars: ["🧑‍🎓", "👩‍🦱", "👨‍🦰", "🧑‍🎨", "👦", "🧕", "👩‍🎨", "🧔"],

  /* first-visit demo: the 5 sample states arrive pre-stamped */
  seed: [
    { state: "Tamil Nadu",     daysAgo: 45 },
    { state: "Rajasthan",      daysAgo: 32 },
    { state: "Bihar",          daysAgo: 21 },
    { state: "Andhra Pradesh", daysAgo: 10 },
    { state: "Kerala",         daysAgo: 4  }
  ]
};
