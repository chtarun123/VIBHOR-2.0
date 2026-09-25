/* ============================================================
   VIBHOR — Heritage Data Core
   Regions · Categories · Image pools · State mappings
   ============================================================ */
window.HERITAGE = {
  brand: "VIBHOR",
  tagline: "One India. Four Regions. Endless Heritage.",

  regions: {
    north: {
      key: "north", name: "North India",
      tagline: "Snow-crowned peaks, golden plains & Mughal grandeur",
      image: "",
      blurb: "Home of the Himalayas, the sacred Ganga, the Mughal capitals and the world's most beloved monument.",
      states: ["Uttar Pradesh", "Rajasthan", "Punjab", "Himachal Pradesh", "Uttarakhand", "Delhi", "Madhya Pradesh", "Jammu & Kashmir"]
    },
    south: {
      key: "south", name: "South India",
      tagline: "Temple cities, backwaters & the birthplace of Carnatic",
      image: "",
      blurb: "A land of gopurams, classical dance, royal palaces and coconut groves — the cradle of unbroken temple traditions.",
      states: ["Tamil Nadu", "Karnataka", "Kerala", "Andhra Pradesh", "Telangana"]
    },
    east: {
      key: "east", name: "East India",
      tagline: "The Ganga delta, terracotta temples & tribal heartland",
      image: "",
      blurb: "From the banks of the Hooghly to the Sal forests of the East — a region of great rivers, ancient universities and folk art.",
      states: ["West Bengal", "Odisha", "Bihar", "Jharkhand", "Assam", "Chhattisgarh"]
    },
    west: {
      key: "west", name: "West India",
      tagline: "Arabian coasts, desert crafts & palaces of the Deccan",
      image: "",
      blurb: "Goan beaches, Kutchi embroidery, Maratha forts and the colonial arches of Bombay — a coastline of contrasts.",
      states: ["Maharashtra", "Gujarat", "Goa"]
    }
  },

  categories: [
    { id: "dances", name: "Dances", icon: "💃", image: "",
      blurb: "From Bharatanatyam's sculptural grace to Bhangra's explosive harvest energy." },
    { id: "music", name: "Music", icon: "🎵", image: "",
      blurb: "Carnatic and Hindustani classical traditions, plus the folk songs of every valley." },
    { id: "foods", name: "Foods", icon: "🍛", image: "",
      blurb: "Royal thalis, coastal curries, mountain stews and legendary street snacks." },
    { id: "festivals", name: "Festivals", icon: "🪔", image: "",
      blurb: "A year-round calendar of colour, faith, harvest and celebration." },
    { id: "temples", name: "Temples", icon: "🛕", image: "",
      blurb: "Gopurams, shikharas and cave shrines carved in living stone." },
    { id: "historical", name: "Historical Places", icon: "🏛️", image: "",
      blurb: "Ancient cities, sacred rivers and the ruins of forgotten empires." },
    { id: "architecture", name: "Architecture", icon: "📐", image: "",
      blurb: "Havelis, stepwells, forts and palaces of astonishing detail." },
    { id: "forts", name: "Forts & Palaces", icon: "🏯", image: "",
      blurb: "Hilltop ramparts, royal courts and the thrones of kings." },
    { id: "crafts", name: "Arts & Crafts", icon: "🎨", image: "",
      blurb: "Madhubani, Pattachitra, Warli and a thousand other living traditions." },
    { id: "textiles", name: "Textiles", icon: "🧵", image: "",
      blurb: "Kanjivaram silks, Kutch embroidery and the looms of India." },
    { id: "monuments", name: "Monuments", icon: "🗿", image: "",
      blurb: "Memorials, gateways and architectural icons of a nation." },
    { id: "gardens", name: "Gardens & Parks", icon: "🌿", image: "",
      blurb: "Mughal charbaghs, tea estates, backwaters and wild reserves." }
  ],

  /* Image pools per category — used for main images & auto-built galleries */
  pools: {
    dances: ["","","","","","","","","",""],
    music: ["","","","","","",""],
    foods: ["","","","","","","","","","","","","",""],
    festivals: ["","","","","","","","","","","","","","","","",""],
    temples: ["","","","","","","","","","","",""],
    historical: ["","","","","",""],
    architecture: ["","","","",""],
    forts: ["","","","","",""],
    crafts: ["","","","","","","","","","","","","",""],
    textiles: ["","","","","","","","","","","","","","",""],
    monuments: ["","","","","","","","",""],
    gardens: ["","","","","","","","",""]
  },

  /* Gallery: related categories for cross-pool variety */
  relatedPools: {
    dances: "festivals", music: "festivals", foods: "festivals", festivals: "music",
    temples: "historical", historical: "temples", architecture: "historical",
    forts: "architecture", crafts: "textiles", textiles: "crafts",
    monuments: "historical", gardens: "historical"
  },

  /* Gallery captions per category (6 each — rotated per item so captions never repeat) */
  captions: {
    dances: ["Grace in motion","Costume & ornament","The performance hall","Rhythmic footwork","Festival celebrations","Stage tradition"],
    music: ["Instruments of the tradition","The live performance","Melodic forms","Cycles of rhythm","Ensemble playing","The concert hall"],
    foods: ["Aromatic spices","The royal presentation","Street-side charm","Festive sweets","The cooking heritage","Flavours of the region"],
    festivals: ["Lamps of celebration","Community ritual","Colour & craft","Grand processions","Music of the season","The festive spirit"],
    temples: ["The sanctum","Stone carvings","Gateway towers","Inner courtyards","Divine iconography","Pilgrims at dawn"],
    historical: ["Ancient lanes","Ruins of the empire","Sacred waters","Living heritage","Archaeological treasure","Echoes of the past"],
    architecture: ["Facade detail","Carved lattices","Courtyard life","Structural marvels","Royal interiors","Master craftsmanship"],
    forts: ["Ramparts & gates","Hilltop views","Palace courtyards","Defensive design","Royal chambers","Sunset over the walls"],
    crafts: ["The artist's hands","Natural pigments","Finishing details","Work in progress","Traditional motifs","A gallery of craft"],
    textiles: ["Woven patterns","At the loom","Zari borders","Dye & thread","Wedding finery","The weaver's heritage"],
    monuments: ["The monument","Memorial inscriptions","Ceremonial grounds","Evening glow","Visitors' view","A national memory"],
    gardens: ["Terraced walks","Fountains & waters","Chinar shade","Lake views","Flowering paths","Morning mist"]
  },

  /* Every state/UT on the map → one of the four cultural regions */
  stateRegion: {
    "Uttar Pradesh": "north", "Rajasthan": "north", "Punjab": "north", "Himachal Pradesh": "north",
    "Uttarakhand": "north", "Delhi": "north", "Haryana": "north", "Jammu & Kashmir": "north",
    "Ladakh": "north", "Chandigarh": "north", "Madhya Pradesh": "north",
    "Tamil Nadu": "south", "Kerala": "south", "Karnataka": "south", "Andhra Pradesh": "south",
    "Telangana": "south", "Puducherry": "south", "Lakshadweep": "south",
    "West Bengal": "east", "Odisha": "east", "Bihar": "east", "Jharkhand": "east",
    "Chhattisgarh": "east", "Assam": "east", "Meghalaya": "east", "Tripura": "east",
    "Mizoram": "east", "Manipur": "east", "Arunachal Pradesh": "east", "Nagaland": "east",
    "Sikkim": "east", "Andaman and Nicobar": "east", "Andaman and Nicobar Islands": "east",
    "Maharashtra": "west", "Gujarat": "west", "Goa": "west",
    "Daman & Diu": "west", "Dadra & Nagar Haveli": "west",
    "Dadra and Nagar Haveli and Daman and Diu": "west"
  }
};

/* ---------- Item builders (shared by data-items-*.js) ---------- */
window.H = function (id, name, cat, region, state, city, img, desc, hist, feat, imp, wiki) {
  return { id, name, cat, region, state, city, img, desc, hist, feat, imp, wiki };
};

window.HERITAGE.items = [];
