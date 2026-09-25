/* ============================================================
   VIBHOR — State & Union Territory Knowledge Base
   All 28 States + 8 Union Territories (post-2019/24: J&K a UT,
   Ladakh a UT, Dadra & Nagar Haveli and Daman & Diu merged).
   Every entry connects to: Search · Map · State profile ·
   Recommendations (journey) · Quiz · Passport.
   t.* = translated narrative (en/hi/te/ta/bn).
   Other fields are proper nouns (places, dishes, dances,
   crafts) and stay the same in every language.
   Facts only — no invented data.
   ============================================================ */
window.HERITAGE_STATES = [
  /* ================= NORTH ================= */
  {
    id: "uttar-pradesh", name: "Uttar Pradesh", ut: false,
    t: {
      en: { name: "Uttar Pradesh", about: "The heartland of the Gangetic plain — where the Mughals built the Taj Mahal, the Kashi ghats keep their dawn rituals, and the Mughal ghost city of Fatehpur Sikri stands empty and complete.", famous: "Taj Mahal, Kashi ghats and the Mughal era", practice: "Kashi's ghat rituals, the Ayodhya Ramlila and Mathura's Holi keep a continuous calendar of devotion alive." },
      hi: { name: "उत्तर प्रदेश", about: "गंगा मैदान का हृदय — यहीं मुगलों ने ताजमहल बनाया, काशी के घाट पर भोर के अनुष्ठान चलते हैं, और खाली मग़ल शहर फतेहपुर सीकरी खड़ा है।", famous: "ताजमहल, काशी के घाट, मुगल युग", practice: "काशी के घाट अनुष्ठान, अयोध्या की रामलीला और मथुरा की होली भक्ति-वर्ष को जीवित रखती हैं।" },
      te: { name: "ఉత్తర ప్రదేశ్", about: "గంగా సమతలం హృదయం — ముఘళ్లు తాజ్‌మహల్ నిర్మించిన ప్రదేశం, కాశీ గట్టలపరిచయాలు నిరంతరం జరుగుతూ ఉన్నాయి, ఖాళీగా కనిపించే ముఘల్ నగరం ఐతారాహ్‌సిక్రీ నిలబడి ఉంది.", famous: "తాజ్‌మహల్, కాశీ గట్టలు, ముఘల్ కాలం", practice: "కాశీ గట్ట ఆచారాలు, అయోధ్య రామలిల, మధుర హోలీ భక్తి కాలాన్ని ప్రతిరోజూ సజీవంగా ఉంచుతాయి." },
      ta: { name: "ஊட்டரப்ரதேசம்", about: "கங்கை சமவெளியின் இதயம் — முகலாயர்கள் தாஜ்மகாலை கட்டிய இடம்; காசியின் கரைகளில் விடியற்காலை சடங்குகள் தொடர்கின்றன; தூணிய முகலாய நகரம் ஃபதேபூர் சிக்ரீய் உயர்ந்து நிற்கிறது.", famous: "தாஜ்மகால், காசி கரைகள், முகலாய காலம்", practice: "காசி கரைச் சடங்குகள், ஐதோட்யாவின் ராமலீலா, மதுராவின் ஹோலி பக்தி நாட்காட்டியை உயிர்ப்பிக்கின்றன." },
      bn: { name: "উত্তরপ্রদেশ", about: "গঙ্গা ময়দানের হৃদয়ভাগ — মুঘলরা এখানে তাজমহল নির্মাণ করেছেন, কাশীর ঘাটে ভোরের আচার চলতে থাকে, আর খালি মুঘল শহর ফতেহপুর সিক্রী ঠিক আছে।", famous: "তাজমহল, কাশীর ঘাট, মুঘল যুগ", practice: "কাশীর ঘাট আচার, অযোধ্যার রামলীলা, মথুরার হোলি ভক্তিকালকে সচল রাখে।" }
    },
    capital: "Lucknow", region: "north", emoji: "🕌", color: "#3a5ca0",
    heritage: ["Taj Mahal, Agra", "Fatehpur Sikri (Mughal ghost city)", "Kashi Vishwanath temple, Varanasi", "Sarnath (Buddhist stupa)"],
    food: ["Galouti kebabs (Lucknow)", "Banarasi paan", "Kachori-sabzi (Lucknow)"],
    festivals: ["Kumbh Mela (Prayagraj)", "Ramlila (Ayodhya)", "Holi (Mathura)"],
    dance: ["Kathak", "Nautanki (folk theatre)"],
    music: ["Hindustani classical (Gwalior & Banaras gharanas)", "Banarasi kirtan"],
    crafts: ["Banarasi brocade weaving", "Chikan embroidery (Lucknow)", "Blue pottery (Agra)"],
    textiles: ["Banarasi silk", "Chikan"],
    languages: ["Hindi", "Awadhi", "Braj", "Urdu"],
    museums: ["Bara Imambara (museum), Lucknow"],
    lesserKnown: ["Sarnath (Buddhist stupa)", "Brij region temples (Mathura-Vrindavan)"]
  },
  {
    id: "madhya-pradesh", name: "Madhya Pradesh", ut: false,
    t: {
      en: { name: "Madhya Pradesh", about: "'The heart of India' — a state of dense forests, the UNESCO temples of Khajuraho, the great Stupa at Sanchi and the ruined sultanate city of Mandu.", famous: "Khajuraho temples, Sanchi Stupa, Mandu", practice: "The Basant fairs of Gwalior, the Sohal folk dance of Malwa and dhul-tasha beats mark the farming calendar." },
      hi: { name: "मध्य प्रदेश", about: "'भारत का हृदय' — घने जंगलों, खजुराहो के यूनेस्को मंदिरों, संचि के महान स्तूप और मंडू के सुल्तानी खंडहरों का राज्य।", famous: "खजुराहो मंदिर, संचि स्तूप, मंडू", practice: "गुवारी के बासंत मेले, मालवा की सोहल और ढुल-तशा के ताल फसल-काल का संकेत हैं।" },
      te: { name: "మధ్య ప్రదేశ్", about: "'భారత హృదయం' — సాంద్ర అటవీ, ఖజురాహో యునెస్కో ఆలయాలు, సాంఛి ప్రసిద్ధ స్తుపం, మండు సుల్తానేత పట్టణం.", famous: "ఖజురాహో ఆలయాలు, సాంఛి స్తుపం, మండు", practice: "గ్వాలియర్ బసంత మేళాలు, మల్వా సోహల్ నృత్యం, ధుల్-తశా తాళాలు రైతు కాలాన్ని గుర్తిస్తాయి." },
      ta: { name: "மத்தியப் பிரதேசம்", about: "'இந்தியாவின் இதயம்' — அடர்ந்த காடுகள், கஞ்சராஹோ யுனெஸ்கோ கோவில்கள், சாந்தியின் பெரிய ஸ்தூபி, மாண்டூ தகவல்.", famous: "கஞ்சராஹோ கோவில்கள், சாந்தி ஸ்தூபி, மாண்டூ", practice: "கவாலியரின் பசந்த் திருவிழாக்கள், மால்வாவின் சோஹல் நடனம், டுல்-தசா இசை விவசாய நாட்காட்டியை குறிக்கின்றன." },
      bn: { name: "মধ্যপ্রদেশ", about: "'ভারতের হৃদয়' — ঘন বন, খজুরাহোর ইউনেস্কো মন্দির, সান্চির বড় স্তুপ এবং মন্দুর ধ্বংসস্তূপ।", famous: "খজুরাহো মন্দির, সান্চি স্তুপ, মন্দু", practice: "গোয়ালিয়ারের বসন্ত মেলা, মালওয়ার সোহাল নৃত্য, ধুল-তাসার তাল কৃষি ক্যালেন্ডারের চিহ্ন।" }
    },
    capital: "Bhopal", region: "north", emoji: "🗿", color: "#7a3b2e",
    heritage: ["Khajuraho temples", "Sanchi Stupa", "Mandu (ruined sultanate city)", "Gwalior Fort"],
    food: ["Dal bafti (Chhandpur)", "Pithla-bhaji (Satna thali)", "Baghela (Bhopal)"],
    festivals: ["Dev Deepawali (Ujjain)", "Teej (Malwa)", "Basant Utsav (Gwalior)"],
    dance: ["Raukta (Mahar folk)", "Sohal (Malwa)"],
    music: ["Hindustani classical (Gwalior gharana)", "Sohal folk songs"],
    crafts: ["Gond painting", "Bagh block print", "Pith (Sagar)"],
    textiles: ["Maheshwari silk", "Bagh-print cotton"],
    languages: ["Hindi", "Marathi (NW corner)", "Bagheli"],
    museums: ["State Museum, Bhopal"],
    lesserKnown: ["Pachmarhi (Satpura hills)", "Orchha (Mughal-Rajput tombs)"]
  },
  {
    id: "rajasthan", name: "Rajasthan", ut: false,
    t: {
      en: { name: "Rajasthan", about: "The land of forts and desert — the pink city of Jaipur, the golden fort of Jaisalmer and the blue city of Jodhpur give it three royal capitals, with the Thar beyond.", famous: "Forts, the Thar desert and three royal cities", practice: "The 24-day Pushkar fair, the maroon-sari Teej and Sufi qawwali nights of the desert keep the calendar loud." },
      hi: { name: "राजस्थान", about: "किलों और रेगिस्तान का राज्य — गुलाबी जयपुर, सुनहरा जैसलमेर और नीला जोधपुर, इसके तीन राजधानी; इसके पीछे थार है।", famous: "किले, थार, तीन राजधानी", practice: "24 दिन का पुष्कर मेला, लाल साड़ी वाला तीज और रेगिस्तान की सूफ़ी रातें वर्ष को शोर से भरती हैं।" },
      te: { name: "రాజస్థాన్", about: "కోటలు, మోసం ప్రదేశం రాజ్యం — గులాబీ జైపూర్, బంగారు జైసల్మెర్, నీలం జోధ్‌పూర్, మూడు రాజధానులు; అది థార్.", famous: "కోటలు, థార్, మూడు రాజధానులు", practice: "24 రోజుల పుష్కర్ మేళ, మెరుపు సారీ తీజ్, డెజర్ట్ సూఫి రాతలు కాలాన్ని ప్రకాశవంతంగా ఉంచుతాయి." },
      ta: { name: "ராஜஸ்தான்", about: "கோட்டைகள் மற்றும் பாலைவனங்களின் நிலம் — லவங்க நிற ஜெய்ப்பூர், பொன்னிற ஜெய்ஸலமர், நீல நிற ஜோத்பூர், மூன்று தலைநகரங்கள்; அதன் பின் தார் பாலைவனம்.", famous: "கோட்டைகள், தார், மூன்று தலைநகரங்கள்", practice: "24 நாள் புஷ்கர் திருவிழா, சிவப்பு சாரி தீஜ், பாலைவன சூஃபி இரவுகள் காலண்டரை ஒலிக்கச் செய்கின்றன." },
      bn: { name: "রাজস্থান", about: "দুর্গ এবং মরুভূমির দেশ — গোলাপি জয়পুর, সোনালি জৈসলমর, নীল জোধপুর, তিনটি রাজধানী; এর বাইরে থার।", famous: "দুর্গ, থার, তিন রাজধানী", practice: "24 দিনের পুষ্কার মেলা, লাল শাড়ির তীজ এবং মরুভূমির সূফি রাত ক্যালেন্ডারকে জীবন্ত রাখে।" }
    },
    capital: "Jaipur", region: "north", emoji: "🐪", color: "#b03a2e",
    heritage: ["Amer Fort (Jaipur)", "Jaisalmer Fort (desert)", "Chittorgarh Fort", "City Palace (Jaipur)"],
    food: ["Dal bati churma", "Pyaaz kachori", "Ghevar", "Laal maas"],
    festivals: ["Pushkar fair (24 days)", "Teej", "Uttarayan (kites)"],
    dance: ["Kalbeliya", "Ghoomar", "Manganiyar folk"],
    music: ["Manganiyar & Bhopa (itinerant musicians)", "Hindustani classical"],
    crafts: ["Blue pottery (Jaipur)", "Bandhani", "Mirror-work quilts"],
    textiles: ["Bandhani", "Rajput embroidery"],
    languages: ["Rajasthani", "Hindi"],
    museums: ["City Palace museum (Jaipur)"],
    lesserKnown: ["Dungar Fort (the 'star' of the Thar)", "Khejarli (Bishnoi village of the desert)"]
  },
  {
    id: "punjab", name: "Punjab", ut: false,
    t: {
      en: { name: "Punjab", about: "The 'land of five rivers' — cradle of the Khalsa, home of the Golden Temple at Amritsar, and the Wagah border ceremony. Its wheat belt feeds a large part of India.", famous: "Golden Temple, Bhangra and the five rivers", practice: "Lohri bonfires, Vaisakhi processions and the daily langar (community kitchen) make the year cycle sacred." },
      hi: { name: "पंजाब", about: "'पाँच नदियों की भूमि' — खालसे का जन्मस्थान, अमृतसर का स्वर्ण मंदिर, वाघ बॉर्डर। इसका गेहूं क्षेत्र भारत का बड़ा हिस्सा खिलाता है।", famous: "स्वर्ण मंदिर, भांगड़ा, पाँच नदियाँ", practice: "लोहड़ी की आग, बैसाखी की श्रृंखला और दैनिक लंगर वर्ष को पवित्र बनाते हैं।" },
      te: { name: "పంజాబ్", about: "'పైం నదుల ప్రాంతం' — ఖాలసా జన్మస్థానం, అమృత్‌సర్ గోల్డెన్ టెంప్లీ, వాగ్‌బోర్డర్. దాని గోదృమీ ప్రాంతం భారతాన్ని పోషిస్తుంది.", famous: "గోల్డెన్ టెంప్లీ, భాంగ్రా, పైం నదులు", practice: "లోహరి మంటలు, బైసఖి ప్రక్రమాలు, దినసరి లంగార్ సంవత్సరాన్ని పవిత్రంగా ఉంచుతాయి." },
      ta: { name: "பஞ்சாப்", about: "'ஐந்து நதிகள் நிலம்' — கார்க்காசா (காலசா) மரபின் பிறப்பிடம்; அமூர்த்சரின் பொன்னிற கோவில், வாக் எல்லை விழா. அதன் அரிசி பட்டை இந்தியாவின் பெரும் பகுதியைப் பசுக்கிறது.", famous: "பொன்னிற கோவில், பங்கரா, ஐந்து நதிகள்", practice: "லோஹரி தீ, வைசாக்கி முன்னேற்றம், நாளாநீள லாங்கார் (குழுசமூக கிடில்) ஆண்டை புனிதமாக்குகின்றன." },
      bn: { name: "পাঞ্জাব", about: "'পাঁচ নদীর দেশ' — খালসার জন্মস্থান, অমৃতসরের স্বর্ণ মন্দির, ভাগা সীমান্ত অনুষ্ঠান। এর গমের প্রান্তর ভারতের বড় অংশকে খাওয়ায়।", famous: "স্বর্ণ মন্দির, ভাঙ্গড়া, পাঁচ নদী", practice: "লোহারির আগুন, ভৈসাখির প্রক্রিয়া এবং দৈনিক লঙ্গার বছরকে পবিত্র করে।" }
    },
    capital: "Chandigarh (shared)", region: "north", emoji: "🌾", color: "#1e5f8a",
    heritage: ["Golden Temple (Harmandir Sahib)", "Wagah Border", "Jallianwala Bagh"],
    food: ["Sarson da saag with makki di roti", "Amritsari kulcha", "Lassi", "Dal-makkhi"],
    festivals: ["Lohri", "Vaisakhi", "Gurpurab"],
    dance: ["Bhangra", "Giddha (women's circle)"],
    music: ["Bhangra (dhol)", "Gurbani kirtan"],
    crafts: ["Phulkari embroidery", "Woodcarving (Jallandhar)"],
    textiles: ["Phulkari"],
    languages: ["Punjabi", "Hindi"],
    museums: ["Partition Museum (Amritsar)"],
    lesserKnown: ["Dera Baba Nanak (Guru Nanak's first settlement)"]
  },
  {
    id: "himachal-pradesh", name: "Himachal Pradesh", ut: false,
    t: {
      en: { name: "Himachal Pradesh", about: "A Himalayan state of valleys — Kullu, Spiti and Kangra — famous for its monasteries, the Kullu fair and the shawls of Chamba.", famous: "Kullu Valley, Spiti and the monasteries", practice: "Shobha Yatra night parades, the Kullu fair and the Maghi New Year folk songs mark the year." },
      hi: { name: "हिमाचल प्रदेश", about: "हिमालय की घाटियों का राज्य — कुल्लू, स्पिति, कांगड़ा — मठों, कुल्लू मेले, चम्बा शॉल्स के लिए प्रसिद्ध।", famous: "कुल्लू घाटी, स्पिति, मठ", practice: "शोभा यात्रा, कुल्लू मेला, माघी नए साल के गीत वर्ष के चिह्न हैं।" },
      te: { name: "హిమాచల ప్రదేశ్", about: "హిమాలయ లోయల రాష్ట్రం — కుల్లూ, స్పిటి, కాంగ్రా — మఠాలు, కుల్లూ యాత్రలు, చంబా షాల్‌ల కోసం ప్రసిద్ధి.", famous: "కుల్లూ లోయ, స్పిటి, మఠాలు", practice: "శోభ యాత్రలు, కుల్లూ మేళాలు, మాఘీ నవ్‌సంవత్సర గానాలు సంవత్సరం గుర్తింపు." },
      ta: { name: "ஹிமாச்சல் பிரதேசம்", about: "இமயப்பர் சந்தி — குலு, ஸ்பிதி, காங்ரா — மனைகள், குலு திருவிழா, சம்பா ஷால்‌களுக்குப் புகழ்.", famous: "குலு சந்தி, ஸ்பிதி, மனைகள்", practice: "சோபா யத்ரா இரவுப் பொதுவுடைமை, குலு திருவிழா, மாஜி புதிய ஆண்டு இசை ஆண்டைக் குறிக்கின்றன." },
      bn: { name: "হিমাচল প্রদেশ", about: "হিমালয়ের উপত্যকাজুড়ে রাজ্য — কুল্লু, স্পিতি, কাঙ্গড়া — বিহার, কুল্লু মেলা, চাম্বা শাড়ির জন্য পরিচিত।", famous: "কুল্লু উপত্যকা, স্পিতি, বিহার", practice: "শোভা যাত্রার রাত, কুল্লু মেলা এবং মাঘী নববর্ষের লোকগান বছরের চিহ্ন।" }
    },
    capital: "Shimla", region: "north", emoji: "⛰️", color: "#4a6741",
    heritage: ["Dharamshala (Tibetan Buddhist town)", "Kullu Valley", "Spiti (Key Monastery)"],
    food: ["Siddu", "Himachali dham", "Babru", "Trakta"],
    festivals: ["Kullu fair", "Shobha Yatra", "Maghi (New Year)"],
    dance: ["Dhaul chak (Kullu)"],
    music: ["Pahari bhawai", "Kullu folk songs"],
    crafts: ["Woodcarving (Joginder Nagar)"],
    textiles: ["Chamba shawls", "Pashmina"],
    languages: ["Pahari (Himachali)", "Hindi"],
    museums: [],
    lesserKnown: ["Kazinagar (the 'Kashi of the hills')", "Narkanda (miniature painting)"]
  },
  {
    id: "uttarakhand", name: "Uttarakhand", ut: false,
    t: {
      en: { name: "Uttarakhand", about: "'Dev Bhoomi' (Land of the Gods) — the Himalayan shrines of Kedarnath and Badrinath, the hill stations of Mussoorie, and the Ganga's birth at Gangotri.", famous: "Kedarnath, Badrinath and the Ganga", practice: "The Char Dham yatra, the Basant fair and the Garhwali 'Alo' welcome song make the state a pilgrimage of its own." },
      hi: { name: "उत्तराखंड", about: "'देवभूमि' — केदारनाथ, बद्रीनाथ के हिमालयी मंदिर, मसूरी की पहाड़ी बस्ती और गंगोत्री पर गंगा का जन्म।", famous: "केदारनाथ, बद्रीनाथ, गंगा", practice: "चार धाम यात्रा, बासंत मेला और गढ़वाली 'अलो' गीत राज्य को तीर्थ बनाते हैं।" },
      te: { name: "ఉత్తరాఖండ్", about: "'దేవభూమి' — కేదార్‌నాథ్, బద్రినాథ్ హిమాలయ ఆలయాలు, మసూరి పర్వత ప్రాంతాలు, గంగాత్రీలో గంగా జన్మ.", famous: "కేదార్‌నాథ్, బద్రినాథ్, గంగా", practice: "చార్‌ధామ యాత్రలు, బసంట్ మేళాలు, గార్హవాలీ 'అలో' స్వాగత పాటలను ధర్మస్థానంగా చేస్తాయి." },
      ta: { name: "ஊட்டராக்காண்ட்", about: "'தேவ் பூமி' (தேவர்களின் நிலம்) — கேடார்நாத், பத்ரிநாத் இமயக்கோவில்கள், மசூரி மலையக நகரங்கள், காங்காட்ரில் கங்கை பிறப்பு.", famous: "கேடார்நாத், பத்ரிநாத், கங்கை", practice: "சார் தாம் யாத்திரை, பசந்த் திருவிழா, கார்ஹவாலி 'அலோ' வரவேற்பு பாடல் இந்த நிலைக்கு பக்தி சேர்க்கிறது." },
      bn: { name: "উত্তরাখণ্ড", about: "'দেভভূমি' (দেবতাদের দেশ) — কেদারনাথ এবং বদ্রীনাথের হিমালয়ের মন্দির, মুসৌরির পাহাড়ি শহর এবং গঙ্গোত্রীতে গঙ্গার জন্ম।", famous: "কেদারনাথ, বদ্রীনাথ, গঙ্গা", practice: "চার ধাম যাত্রা, বসন্ত মেলা এবং গারওয়ালি 'আলো' স্বাগত গান রাজ্যকে তীর্থস্থান করে তোলে।" }
    },
    capital: "Dehradun", region: "north", emoji: "🧘", color: "#41688a",
    heritage: ["Kedarnath temple", "Badrinath temple", "Gangotri (Ganga source)"],
    food: ["Alo", "Kafuli", "Babru", "Jhaag"],
    festivals: ["Basant fair (Devprayag)", "Kumbh Mela (Haridwar)", "Dev Deepawali (Haridwar)"],
    dance: ["Chholi (Kumaon)", "Garhwali folk"],
    music: ["Garhwali & Kumaoni folk (sarangi)"],
    crafts: ["Woollen shawls (Chamoli)", "Woodcarving"],
    textiles: ["Woollen shawls"],
    languages: ["Hindi", "Garhwali", "Kumaoni"],
    museums: [],
    lesserKnown: ["Munsiyari (Himalayan meadow town)"]
  },
  {
    id: "haryana", name: "Haryana", ut: false,
    t: {
      en: { name: "Haryana", about: "The plains state of the Yamuna — known for its wrestlers (pehlwans), the Phulkari textile and the Surajkund international mela.", famous: "Pehlwani, Phulkari and Surajkund", practice: "Lohri bonfires, Teej swings and the spring 'Phag' folk songs keep the agrarian calendar bright." },
      hi: { name: "हरियाणा", about: "यमुना का मैदानी राज्य — पहलवानों, फुकारी और सुराजकुंद अंतर्राष्ट्रीय मेले के लिए प्रसिद्ध।", famous: "पहलवानी, फुकारी, सुराजकुंद", practice: "लोहड़ी की आग, तीज के झूले और फाग के गीत कृषि काल को रौशन रखते हैं।" },
      te: { name: "హర్యానా", about: "యమునా సమతల రాష్ట్రం — పహల్వాన్లు, ఫుల్కారి వస్త్రం, సురజ్‌కుంద్ అంతర్జాతీయ మేళం కోసం ప్రసిద్ధి.", famous: "పహల్వనీ, ఫుల్కారి, సురజ్‌కుంద్", practice: "లోహరి మంటలు, తీజ హల్కలు, ఫాగ్‌లో లోక గానాలు రైతు కాలాన్ని ప్రకాశవంతంగా ఉంచుతాయి." },
      ta: { name: "ஹரியானா", about: "யமுனா சமவெளி மாநிலம் — ரிஷ்டிகளின் (பெலுவான்களின்) பயிற்சி, ஃபுல்காரி, சூராஜ்கண்ட் திருவிழாக்குப் புகழ்.", famous: "ரிஷ்டிகளின் பயிற்சி, ஃபுல்காரி, சூராஜ்கண்ட்", practice: "லோஹரி தீ, தீஜ் உற்சாகம் மற்றும் ஃபாக் மக்கள் பாடல்கள் வேளாண் மண்டலத்தை ஒளிரச் செய்கின்றன." },
      bn: { name: "হরিয়ানা", about: "যমুনা ময়দানের রাজ্য — পহেলায়ন, ফুলকারী এবং সুরাজকুন্দ আন্তর্জাতিক মেলায় পরিচিত।", famous: "পহেলায়ন, ফুলকারী, সুরাজকুন্দ", practice: "লোহারির আগুন, তীজের ঝুলি এবং ফাগের লোকগান কৃষি ক্যালেন্ডারকে আলোকিত রাখে।" }
    },
    capital: "Chandigarh (shared)", region: "north", emoji: "🌾", color: "#6a4a8a",
    heritage: ["Pinjore Garden (Mughal)", "Surajkund (mela & lake)"],
    food: ["Chole kulcha", "Haryanvi paratha", "Kadhi-pakora", "Gur churma"],
    festivals: ["Lohri", "Teej", "Surajkund Mela"],
    dance: ["Giddha", "Phag (spring folk)"],
    music: ["Kirtan", "Dhol & folk (Haryanvi)"],
    crafts: ["Phulkari embroidery", "Pottery"],
    textiles: ["Phulkari", "Khadi"],
    languages: ["Haryanvi", "Hindi", "Punjabi (NE)"],
    museums: [],
    lesserKnown: ["The akharas (wrestling culture of Haryana)"]
  },
  {
    id: "delhi", name: "Delhi", ut: true,
    t: {
      en: { name: "Delhi", about: "Seven cities in one — Mughal Shahjahanabad, Lutyens' Delhi and New Delhi. The Red Fort, Qutub Minar and India Gate are its monuments, and its street food is famous across the world.", famous: "Red Fort, Qutub Minar, India Gate", practice: "Eid and Diwali processions, the Qawwali of Nizamuddin and the Sunday bazaars give Delhi its layered calendar." },
      hi: { name: "दिल्ली", about: "सात शहर एक में — मुगल शाहजहानबाद, ल्यूटींस की दिल्ली और नई दिल्ली। लाल किला, कुतुब मीनार, इंडिया गेट इसके चिह्न।", famous: "लाल किला, कुतुब मीनार, इंडिया गेट", practice: "ईद-दीपावली की श्रृंखला, नज़मुद्दीन का क़ुवाली और रविवार के बाज़ार दिल्ली की पढ़ती बनाते हैं।" },
      te: { name: "దీల్హీ", about: "ఒకటిలో ఏడు నగరాలు — ముఘల్ షాహ్‌జహాన్‌బాద్, ల్యూటిన్స్ దీల్హీ, నూతన దీల్హీ. లాల్ కిలా, కుతుబ్ మినార్, ఇండియా గేట్ దాని చిహ్నాలు.", famous: "లాల్ కిలా, కుతుబ్ మినార్, ఇండియా గేట్", practice: "ఈద్-దీపావళి ప్రక్రమాలు, నిజాముద్దీన్ కవాలీ, ఆదివార బజార్లు దీల్హీకు వైవిధ్యాన్ని ఇస్తాయి." },
      ta: { name: "டெல்லி", about: "ஒன்றில் ஏழு நகரங்கள் — முகலாய ஷாஜகான் பாட், லியூட்ஸ் டெல்லி, புதிய டெல்லி. லால் கில்லா, குதுப் மினார், இந்தியா கேட் அதன் குறியீடுகள்.", famous: "லால் கில்லா, குதுப் மினார், இந்தியா கேட்", practice: "ஈத் மற்றும் தீபாவளி பத்திரியங்கள், நிசாமுத்தின் கவாலி மற்றும் ஞாயிறு சந்தைகள் டெல்லிக்கு அடுக்கு நிறைந்த நாட்காட்டியை தருகின்றன." },
      bn: { name: "দিল্লী", about: "একটিতে সাতটি শহর — মুঘল শাহজাহানাবাদ, লিউটিন্সের দিল্লী, নতুন দিল্লী। লাল কিলা, কুতুব মিনার এবং ইন্ডিয়া গেট এর স্মারক।", famous: "লাল কিলা, কুতুব মিনার, ইন্ডিয়া গেট", practice: "ঈদ এবং দীপাবলির প্রক্রিয়া, নিজামুদ্দিনের কবালি এবং রবিবারের বাজার দিল্লীর স্তরযুক্ত ক্যালেন্ডার তৈরি করে।" }
    },
    capital: "New Delhi", region: "north", emoji: "🏛️", color: "#8a4a2a",
    heritage: ["Red Fort (Shahjahanabad)", "Qutub Minar", "India Gate", "Humayun's Tomb"],
    food: ["Butter chicken", "Chole kulcha (Paharganj)", "Doodh patti"],
    festivals: ["Eid (Nizamuddin)", "Diwali (old city)", "Qawwali nights (Nizamuddin)"],
    dance: ["Qawwali (Sufi)"],
    music: ["Qawwali", "Hindustani classical"],
    crafts: ["Chandni Chowk silver work"],
    textiles: ["Chandni Chowk embroidery"],
    languages: ["Hindi", "Urdu", "Punjabi"],
    museums: ["National Museum (New Delhi)"],
    lesserKnown: ["Tis Hazari (a landmark of the freedom struggle)"]
  },
  {
    id: "jammu-kashmir", name: "Jammu & Kashmir", ut: true,
    t: {
      en: { name: "Jammu & Kashmir", about: "A UT since 2019 — the Kashmir valley with its Dal Lake and shikara boats, the saffron fields of Pampore, the pine forests of Pahalgam and the ancient monasteries of Ladakh.", famous: "Dal Lake, saffron fields, the Wazwan feast", practice: "The Tulip festival, the spring festival of Baisakhi and the Buddhist Losar give the valley three seasons of celebration." },
      hi: { name: "जम्मू-कश्मीर", about: "2019 से केंद्र शासित प्रदेश — कश्मीर घाटी (डल झील, शिकारा), पुन्पोर के केसर के खेत, पाहलगाम के पाइन वन और लद्दाख के प्राचीन मठ।", famous: "डल झील, केसर के खेत, वाज़वान भोज", practice: "ट्यूलिप मेला, बैसाखी और बौद्ध लोसर घाटी में तीन सीज़न के उत्सव।" },
      te: { name: "జమ్మూ-కశ్మీర్", about: "2019 నుండి కేంద్ర నియంత్రణ — కశ్మీర్ లోయ (డల్ టాక్, శికారా పడవలు), పాంపూర్ సాఫ్రాన్, పాహల్‌గాం పైన్ అటవీ, లెడక్ మఠాలు.", famous: "డల్ టాక్, సాఫ్రాన్ పొలాలు, వాజ్‌వాన్ భోజనం", practice: "ట్యూలిప్ మేళాలు, బైసఖీ, బౌద్ధ లోసర్ లోయలో మూడు వసంతాలు." },
      ta: { name: "ஜம்மு-காசுமீர்", about: "2019 முதல் யூடி — காசுமீர் சந்தி (டால் அணையிறு, சிகாரா படகு), பாம்போர் சாப்பிரான், பாஹல்காம் பைன் காடுகள், லடாக்கின் மனைகள்.", famous: "டால் அணையிறு, சாப்பிரான் புனல்கள், வாஸ்வான் விருந்து", practice: "டேலிப் திருவிழா, பேசாகி, பௌத்த லோசர் சந்தியில் மூன்று பருவங்கள்." },
      bn: { name: "জম্মু-কশ্মীর", about: "2019 থেকে ইউনিয়ন ল্যান্ড — কশ্মীর উপত্যকা (দাল হ্রদ, শিকারা), পামপোরের জাফরান, পাহলগামের পাইন বন এবং লাদাখের প্রাচীন বিহার।", famous: "দাল হ্রদ, জাফরান ক্ষেত, বাজওয়ান ভোজ", practice: "টিউলিপ উৎসব, ভৈসাখী এবং বৌদ্ধ লোসার উপত্যকায় তিন মৌসুমের উৎসব আনে।" }
    },
    capital: "Srinagar (summer) / Jammu (winter)", region: "north", emoji: "🏔️", color: "#3a6a8a",
    heritage: ["Dal Lake (houseboats)", "Pampore (saffron fields)", "Pahalgam (valley)", "Amarnath cave"],
    food: ["Rogan josh", "Kashmiri pulao", "Wazwan (26-course feast)", "Kahwa (saffron tea)"],
    festivals: ["Tulip festival (Srinagar)", "Baisakhi (Kashmiri 'spring')", "Losar (Ladakh)"],
    dance: ["Bach (Kashmiri)"],
    music: ["Sufiana (classical)", "Rabab & santoor"],
    crafts: ["Pashmina shawls", "Saffron (Pampore)", "Papier-mâché"],
    textiles: ["Pashmina", "Kani shawls"],
    languages: ["Kashmiri", "Urdu", "Hindi"],
    museums: [],
    lesserKnown: ["Gurez Valley (the 'last frontier')", "Zanskar Valley (ice trek)"]
  },
  {
    id: "ladakh", name: "Ladakh", ut: true,
    t: {
      en: { name: "Ladakh", about: "The 'high cold desert' — a land of Buddhist monasteries, the Indus and Nubra rivers and Khardung La, one of the highest motorable roads in the world.", famous: "Khardung La, monasteries, the Indus", practice: "Losar (Tibetan New Year), the Hemis festival and the monastery Tsechu are the year's great events." },
      hi: { name: "लद्दाख", about: "'ऊँचा ठंडा रेगिस्तान' — बौद्ध मठों, सिंधु-नुबरा नदियों और खार्दुंग ला (दुनिया की सबसे ऊँची सड़कों में से एक) की भूमि।", famous: "खार्दुंग ला, मठ, सिंधु", practice: "लोसर (तिब्बति नया साल), हेमिस मेला और मठ टीछू वर्ष के बड़े आयोजन हैं।" },
      te: { name: "లెడక్", about: "'ఎత్తువర ఠాఠా మరుభూమి' — బౌద్ధ మఠాలు, ఇందస్-నూబ్రా నదులు, ఖర్దూంగ్ లా (ప్రపంచంలోనే అత్యంత ఎత్తు రహదారులలో ఒకటి).", famous: "ఖర్దూంగ్ లా, మఠాలు, ఇందస్", practice: "లోసర్ (తిబెటన్ నవ్‌సంవత్సరం), హెమిస్ యాత్ర, మఠ త్షీఛూ సంవత్సరం పెద్ద ఉత్సవాల." },
      ta: { name: "லடாக்க்", about: "'உயர்ந்த குளிர் பாலைவனம்' — பௌத்த மனைகள், இந்து-நூப்ரா நதிகள், கார்டுங் லா (உலகின் மிக உயர்ந்த சாலைகளில் ஒன்று).", famous: "கார்டுங் லா, மனைகள், இந்து", practice: "லோசர் (திபெத்திய புதிய ஆண்டு), ஹெமிஸ் திருவிழா, மனைத் த்ஷீச்சு ஆண்டு மிகப்பெரிய நிகழ்வுகள்." },
      bn: { name: "লাদাখ", about: "'উঁচু ঠান্ডা মরুভূমি' — বৌদ্ধ বিহার, ইন্দাস-নুবরা নদী এবং খারদং লা (বিশ্বের সর্বোচ্চ রাস্তার একটি)।", famous: "খারদং লা, বিহার, ইন্দাস", practice: "লোসার (তিব্বত নববর্ষ), হেমিস উৎসব এবং বিহারের ত্শ্যু বছরের বড় উৎসব।" }
    },
    capital: "Leh", region: "north", emoji: "🏔️", color: "#6a5a8a",
    heritage: ["Khardung La (pass)", "Hemis Monastery", "Nubra Valley", "Thiksey Monastery"],
    food: ["Thukpa", "Butter tea (Sood)", "Momo (Ladakhi)", "Skyu (noodle stew)"],
    festivals: ["Losar (Tibetan New Year)", "Hemis festival (Tiger dance)", "Tsechu (monastery)"],
    dance: ["Cham (Tiger)"],
    music: ["Tibetan singing bowls", "Damaru & drum"],
    crafts: ["Thangka painting", "Balti wool crafts"],
    textiles: ["Woolen chubas (blankets)"],
    languages: ["Ladakhi (Tibetan)", "Balti", "Hindi"],
    museums: ["Ladakh Museum (Leh)"],
    lesserKnown: ["Zanskar Valley (ice trek)"]
  },
  {
    id: "chandigarh", name: "Chandigarh", ut: true,
    t: {
      en: { name: "Chandigarh", about: "The first planned city of independent India, designed by Le Corbusier as the shared capital of Punjab and Haryana — its Sector grid, the Capitol Complex and the Rock Garden are its landmarks.", famous: "Le Corbusier design, the Rock Garden, the Sector grid", practice: "Sunday bazaars, the Rock Garden (built from industrial waste) and the Capitol art scene give the city its character." },
      hi: { name: "चंडीगढ़", about: "स्वतंत्र भारत का पहला नियोजित शहर — ली कॉर्बूज़ियर द्वारा पंजाब-हरियाणा की साझा राजधानी के रूप में डिज़ाइन किया गया।", famous: "ली कॉर्बूज़ियर डिज़ाइन, रॉक गार्डन, सेक्टर ग्रिड", practice: "रविवार के बाज़ार, रॉक गार्डन (औद्योगिक कचरे से बना) और कैपिटल कला शहर की पहचान हैं।" },
      te: { name: "చండీగఢ్", about: "స్వాతంత్ర భారత మొదటి ప్లాన్డ్ సిటీ — లీ కోర్బుజియర్ ద్వారా పంజాబ్-హర్యానా ఉపాధ్యాయ రాజధానిగా రూపొందించబడింది.", famous: "లీ కోర్బుజియర్ రూపం, రక్ గార్డెన్, సెక్టర్ గ్రిడ్", practice: "ఆదివార మార్కెట్లు, రక్ గార్డెన్ (వినియోగిత చెత్తతో నిర్మించబడింది), క్యాపిటల్ కళ నగర గుర్తింపు." },
      ta: { name: "சண்டிகர்", about: "சுதந்திர இந்தியாவின் முதல் திட்டமிடப்பட்ட நகரம் — லி கொர்புஜியர் கட்டடக் கலைஞரால் பஞ்சாப்-ஹரியானா தலைநகரமாக வடிவமைக்கப்பட்டது.", famous: "லி கொர்புஜியர் வடிவமைப்பு, பாறை தோட்டம், சேக்டர் கட்டமைப்பு", practice: "ஞாயிறு சந்தைகள், பாறை தோட்டம் (தயாரிப்பு தூள்) மற்றும் கேபிட்டல் கலை நகரத்தை வரையறுக்கின்றன." },
      bn: { name: "চণ্ডীগড়", about: "স্বাধীন ভারতের প্রথম পরিকল্পিত নগর — লি করবুজিয়ের দ্বারা পাঞ্জাব-হরিয়ানার সাধারণ রাজধানী হিসেবে ডিজাইন করা।", famous: "লি করবুজিয়ের ডিজাইন, রক গার্ডেন, সেক্টর গ্রিড", practice: "রবিবারের বাজার, রক গার্ডেন (প্রযোজিত বর্জ্যে নির্মিত) এবং ক্যাপিটালের কলা শহরের চরিত্র।" }
    },
    capital: "Chandigarh", region: "north", emoji: "🏛️", color: "#5a7a8a",
    heritage: ["Capitol Complex (Le Corbusier)", "Rock Garden (sculpture park)"],
    food: ["Pahari & Punjabi street food"],
    festivals: [],
    dance: [],
    music: [],
    crafts: ["Recycled-art sculpture (Rock Garden)"],
    textiles: [],
    languages: ["Hindi", "Punjabi"],
    museums: ["Capitol Art Museum"],
    lesserKnown: []
  },

  {
    id: "west-bengal", name: "West Bengal", ut: false,
    t: {
      en: { name: "West Bengal", about: "The land of the Hooghly — Kolkata's Durga Puja pandals, the Tagore legacy, the terracotta temples of Barddhaman and the Sundarbans, the world's largest mangrove forest.", famous: "Durga Puja, Tagore's legacy, the Sundarbans", practice: "Durga Puja, Adda (the art of conversation) and the Rabindra Sangeet concerts of Rabindra Janmabotsob keep the calendar literary and festive." },
      hi: { name: "पश्चिम बंगाल", about: "होगली का देश — कोलकाता के दुर्गा पूजा पांडल, टैगोर विरासत, बड़साल के टेर्राकोटा मंदिर और सुंदरबन (दुनिया का सबसे बड़ा मैंग्रोव)।", famous: "दुर्गा पूजा, टैगोर विरासत, सुंदरबन", practice: "दुर्गा पूजा, अड्डा (बातचीत की कला) और रवींद्र जन्मोत्सव वर्ष को साहित्यिक और उत्सवमय बनाते हैं।" },
      te: { name: "పశ్చిమ బెంగాల్", about: "హోగ్లీ నది ప్రాంతం — కోల్‌కాతా దుర్గా పూజ పాండల్‌లు, టాగోర్ వారసత్వం, బార్డసాల్ టెరాకోటా ఆలయాలు, సుందరబన్ (ప్రపంచంలోనే అతి పెద్ద మెంగ్రోవ్)।", famous: "దుర్గా పూజ, టాగోర్ వారసత్వం, సుందరబన్", practice: "దుర్గా పూజ, అడ్డ (సంభాషణ కళ), రవీంద్ర జన్మోత్సవం సంవత్సరం సాహిత్య-ఉత్సవంగా చేస్తాయి." },
      ta: { name: "மேற்கு வங்கம்", about: "ஹோகி நதிக் கரை — கொல்கத்தாவின் துர்கா பூஜா டோள்கள், டாகோர் மரபு, பாரஸட் டெராகோட்டா கோவில்கள், சுந்தரவனம் (உலகின் மிகப்பெரிய மேங்கிர்வ்).", famous: "துர்கா பூஜா, டாகோர் மரபு, சுந்தரவனம்", practice: "துர்கா பூஜா, அட்டா (அரட்டைக் கலை) மற்றும் ரவீந்திர சங்கீதம் ஆண்டுக்கல் எழுத்தையும் விழாவையும் சேர்த்து வைக்கின்றன." },
      bn: { name: "পশ্চিমবঙ্গ", about: "হোগলীর দেশ — কলকাতার দুর্গাপূজার পাণ্ডাল, তাগোরের ঐতিহ্য, বরদসালের টেরাকোটা মন্দির এবং সুন্দরবন (বিশ্বের বৃহত্তম ম্যানগ্রোব)।", famous: "দুর্গাপূজা, তাগোরের ঐতিহ্য, সুন্দরবন", practice: "দুর্গাপূজা, আড্ডা (আলোচনার কলা) এবং রবীন্দ্র জন্মোৎসব বছরকে সাহিত্যিক ও উৎসবময় রাখে।" }
    },
    capital: "Kolkata", region: "east", emoji: "🎨", color: "#8a2e4a",
    heritage: ["Victoria Memorial (Kolkata)", "Dakshineswar & Kalighat temples", "Barddhaman terracotta temples", "Sundarbans (mangrove forest)"],
    food: ["Machher jhol (fish curry)", "Rosogolla", "Mishti doi"],
    festivals: ["Durga Puja (Kolkata)", "Rabindra Janmabotsob (Purusottampur)", "Kartik Panchami (Kalighat)"],
    dance: ["Dhul (Santhal)", "Gaudiya Sankirtan (devotional)"],
    music: ["Rabindra Sangeet", "Bhatiyali (boatmen's)"],
    crafts: ["Kantha (Dak) embroidery", "Shantiniketan pottery"],
    textiles: ["Baluchari", "Kadhua"],
    languages: ["Bengali", "Hindi", "Santhali", "English"],
    museums: ["Indian Museum (Kolkata — the oldest in India)", "Science City (Kolkata)"],
    lesserKnown: ["Bishnupur (the terracotta town)", "Kalimpong (the tea hills)"]
  },
  {
    id: "odisha", name: "Odisha", ut: false,
    t: {
      en: { name: "Odisha", about: "The temple state of the east — Konark's Sun Temple, the Puri Jagannath and the Kalinga architecture. The Odia script and the Chhau dance are its signature art forms.", famous: "Konark Sun Temple, Rath Yatra, the Kalinga style", practice: "The Puri Rath Yatra, Chhau night performances and the Mangala Gauri Jhanjhi ritual mark the year." },
      hi: { name: "ओडिशा", about: "पूर्व का मंदिर राज्य — कोणार्क का सूर्य मंदिर, पुरी जगन्नाथ और कलिंगा वास्तुकला। ओडिआ लिपि और छहू नृत्य इसकी पहचान हैं।", famous: "कोणार्क सूर्य मंदिर, रथ यात्रा, कलिंगा शैली", practice: "पुरी रथ यात्रा, छहू रंगमंच और मंगला गौरी जघुली वर्ष को निशान करते हैं।" },
      te: { name: "ఒడిశా", about: "తూర్పు ఆలయ రాష్ట్రం — కోనార్క్ సూర్య ఆలయం, పూరి జగన్నాథ్, కలింగ సర్వస్వం. ఒడియా లిపి, చౌ నృత్యం దాని గుర్తింపు.", famous: "కోనార్క్ సూర్య ఆలయం, రథ యాత్ర, కలింగ శైలి", practice: "పూరి రథ యాత్ర, చౌ నృత్యం, మంగల గౌరి జాంజి సంవత్సరం గుర్తింపు." },
      ta: { name: "ஒடிஷா", about: "கிழக்கு கோவில் மாநிலம் — கொணார்க் சூரிய கோவில், புரி ஜகந்நாத், கலிங்க கட்டடம். ஒடியா எழுத்து மற்றும் சாவ் நடனம் அதன் குறியீடு.", famous: "கொணார்க் சூரிய கோவில், ரத்த யாத்திரை, கலிங்க பாணி", practice: "புரி ரத்த யாத்திரை, சாவ் நடனம், மங்கலா கவுரி ஜெஞ்ஜி நாட்காட்டியை குறிக்கின்றன." },
      bn: { name: "ওড়িশা", about: "পূর্বের মন্দির রাজ্য — কনাকের সূর্য মন্দির, পুরীর জগন্নাথ এবং কলিঙ্গ স্থাপত্য। ওড়িয়া লিপি এবং চৌ নৃত্য এর স্বতন্ত্র কলা।", famous: "কনাক সূর্য মন্দির, রথ যাত্রা, কলিঙ্গ ধাঁচ", practice: "পুরীর রথ যাত্রা, চৌ নৃত্য এবং মাঙ্গলা গৌরীর জাঁজি আচার বছরের চিহ্ন।" }
    },
    capital: "Bhubaneswar", region: "east", emoji: "☀️", color: "#c07818",
    heritage: ["Konark Sun Temple", "Jagannath Temple (Puri)", "Lingaraj Temple (Bhubaneswar)", "Udayagiri caves"],
    food: ["Chhena poha", "Machha chura", "Pitha", "Mahaprasad (Puri)"],
    festivals: ["Rath Yatra (Puri)", "Chhath Puja", "Makar Sankranti"],
    dance: ["Chhau (Mayurbhanji)"],
    music: ["Odissi classical", "Sohar (folk)"],
    crafts: ["Pattachitra", "Kalinga stone carving"],
    textiles: ["Sambalpuri", "Bamra silk"],
    languages: ["Odia", "Hindi", "English"],
    museums: ["State Museum (Bhubaneswar)"],
    lesserKnown: ["Raghurajpur (the pattachitra village)", "Koraput (the tribal highlands)"]
  },
  {
    id: "bihar", name: "Bihar", ut: false,
    t: {
      en: { name: "Bihar", about: "The land of Buddha's enlightenment at Bodh Gaya, the Nalanda university, and Magadha — the political heart of ancient India. Its terracotta and temple traditions span over a millennium.", famous: "Bodh Gaya, Nalanda and the Buddhist circuit", practice: "Chhath worship of the Sun, Chaumagha Mela for the departed, and Mithila's wedding rituals keep the calendar alive with song and story." },
      hi: { name: "बिहार", about: "बोधगया के बुद्ध ज्ञान, नालंदा विश्वविद्यालय और मगध का भूमि — प्राचीन भारत का राजनीतिक हृदय।", famous: "बोधगया, नालंदा, बौद्ध परिक्रमा", practice: "चतुर्थ के सूर्य पूजा, चौमाघा मेला और मिथिला की शादी-समारोह वर्ष को गाने-कहानी से जीवित रखते हैं।" },
      te: { name: "బిహార్", about: "బోధగయ్యలో బుద్ధ జ్ఞానం, నలండా విశ్వవిద్యాలయం, మగధ — పురాతన భారత రాజకీయ హృదయం.", famous: "బోధగయ్య, నలండా, బౌద్ధ వలయ", practice: "చత్ర సూర్య పూజ, చౌమాఘ మేళం, మిథిల పెళ్లి ఆచారాలు సంవత్సరాన్ని పాటలతో సజీవంగా ఉంచుతాయి." },
      ta: { name: "பீகார்", about: "போத்காயாவில் புத்தர் காட்சி, நலந்தா பல்கலைக்கழகம், மகாதா — பழந்தமிழக அரசியல் இதயம்.", famous: "போத்காயா, நலந்தா, புத்த வட்டம்", practice: "சத்க சூரிய வழிபாடு, சௌமார்கா திருவிழா, மிதிலா திருமண மரபுகள் காலண்டரைப் பாடல்களுடன் உயிர்ப்பிக்கின்றன." },
      bn: { name: "বিহার", about: "বোদ্ধের জ্ঞানের দেশ — বোধগয়া, নালন্দা বিশ্ববিদ্যালয় এবং মগধ — প্রাচীন ভারতের রাজনৈতিক হৃদয়।", famous: "বোধগয়া, নালন্দা, বৌদ্ধ পথচলা", practice: "ছাত সূর্য উপাসনা, চৌমাঘা মেলা এবং মিথিলাদের বিয়ে আচার বছরকে গান ও গল্পে সচল রাখে।" }
    },
    capital: "Patna", region: "east", emoji: "🪷", color: "#8a2f57",
    heritage: ["Mahabodhi Temple (Bodh Gaya)", "Nalanda ruins", "Rajgir (Venu Vana)", "Vaishali", "Barabar caves"],
    food: ["Litti chokha", "Sattu", "Thekua", "Makhana"],
    festivals: ["Chhath Puja", "Chaumagha Mela (Munger)"],
    dance: ["Jatra (folk play)", "Hathiya", "Barha"],
    music: ["Sohar (winter)", "Sorati (spring)", "Hemiya (wedding)"],
    crafts: ["Madhubani (Mithila) painting", "Mithila scroll painting"],
    textiles: ["Dohar (handwoven cotton)", "Khadi"],
    languages: ["Hindi", "Maithili", "Magahi", "Bhojpuri", "Angika"],
    museums: ["Bihar Museum (Patna)"],
    lesserKnown: ["Kumhrar Mauryan ruins (Patna)", "Pawapuri (Jain Tirthankara sites)", "Maner (Shah Daulat Dargah)"]
  },

  {
    id: "jharkhand", name: "Jharkhand", ut: false,
    t: {
      en: { name: "Jharkhand", about: "'Land of Forests' — the Chota Nagpur Plateau of tribal cultures, diamonds and iron, and the makhana (fox nut) that makes it famous worldwide.", famous: "Makhana, Netarhat, Unakot", practice: "The Santhal's Sohrai and Sarhul, the Ho's rituals and the Munda's Karma keep the tribal calendar alive." },
      hi: { name: "झारखंड", about: "'वन का राज्य' — छोटा नागपुर पठार, जनजातीय संस्कृति, हीरे-लोहा और मखाना।", famous: "मखाना, नेतारहत्, उनाकोट", practice: "संथाली सहरै, सरहुल और मुंडा कर्म पूजा जनजातीय काल को जीवित रखते हैं।" },
      te: { name: "జర్ఖండ్", about: "'అటవీ రాష్ట్రం' — చోటా నాగుర్ పట్టం, పట్టణ సంస్కృతి, డైమండ్, ఇనుము మరియు మఖానా.", famous: "మఖానా, నెతార్హత్, ఉనకోట్", practice: "సంథాల్ సోహ్రై, సర్హుల్ మరియు ముండా కర్మ ఉత్సవం స్థానిక సంస్కృతిని కాపాడతాయి." },
      ta: { name: "ஜர்கண்ட்", about: "'வனங்களின் மாநிலம்' — சோட்டா நாவுபூர் மேட்டை, பழங்குலங்கள், வைரம், இரும்பு மற்றும் மகானா.", famous: "மகானா, நெட்டார்கட், ஊனாக்கோட்", practice: "சந்தால் சொஹ்ரை, சர்புல் மற்றும் முண்டா கர்மா பண்டிகைகள் பழங்குல காலப்போக்கை வாழ்வில் வைக்கின்றன." },
      bn: { name: "ঝাড়খণ্ড", about: "'বনভূমির রাজ্য' — ছোটা নাগপুর প্লেটো, আদিবাসী সংস্কৃতি, ডায়মন্ড, লোহা এবং মখানা।", famous: "মখানা, নেতারহাট, উনাগড়", practice: "সাঁথাল সোহরাই, সরহুল এবং মুন্ডা কর্ম উৎসব আদিবাসী ক্যালেন্ডারকে সচল রাখে।" }
    },
    capital: "Ranchi", region: "east", emoji: "🪨", color: "#8a5a2a",
    heritage: ["Unakot (rock art)", "Hundru Falls", "Netarhat"],
    food: ["Handwa", "Kuaka", "Makhana", "Singori"],
    festivals: ["Sohrai (Santhal)", "Sarhul", "Chhath"],
    dance: ["Sohrai", "Chhandi", "Jaru"],
    music: ["Sohrai songs", "Chakaria (Santhal)"],
    crafts: ["Bamboo craft (Santhal)", "Kanga (Santal comb)"],
    textiles: ["Handwoven cotton", "Khadi"],
    languages: ["Hindi", "Santhali", "Ho", "Munda", "English"],
    museums: [],
    lesserKnown: ["Netarhat (the 'Queen of Chota Nagpur')"]
  },
  {
    id: "chhattisgarh", name: "Chhattisgarh", ut: false,
    t: {
      en: { name: "Chhattisgarh", about: "The 'Rice Bowl of India' — a land of dense forests, rivers and the Sarguja temples. Bastar in the south is a tribal heartland of its own.", famous: "Sarguja temples, Sitanadi, Bastar", practice: "Pandavani dance-drama, the Karma ritual and the Sarhul celebration of the tribal new year keep the calendar alive." },
      hi: { name: "छत्तीसगढ़", about: "'भारत का चावल का कटोरा' — घने जंगल, नदियाँ और सरगुजा के मंदिर। दक्षिण में बास्तर अपनी जनजातीय भूमि है।", famous: "सरगुजा मंदिर, सितनादी, बास्तर", practice: "पंडवानी, कर्म पूजा और जनजातीय नववर्ष सरहुल वर्ष को जीवित रखते हैं।" },
      te: { name: "ఛత్తీస్‌గఢ్", about: "'భారత అన్నభాండం' — సాంద్ర అటవీ, నదులు మరియు సర్గుజ ఆలయాలు. దక్షిణ బస్తర్ ఒక తెలియని స్థానిక ప్రాంతం.", famous: "సర్గుజ ఆలయాలు, సిత్తానది, బస్తర్", practice: "పాండవనీ నృత్యం, కర్మ పూజ మరియు సర్హుల్ స్థానిక కాలాన్ని సజీవంగా ఉంచుతాయి." },
      ta: { name: "சட்டீஸ்கர்", about: "'இந்தியாவின் அரிசி தொட்டி' — அடர்ந்த காடுகள், நதிகள் மற்றும் சரகுவா கோவில்கள். தெற்கு பாஸ்தர் ஒரு பழங்குல பகுதி.", famous: "சரகுவா கோவில்கள், சித்தானதி, பாஸ்தர்", practice: "பாண்டவனி நடனம், கர்மா சடங்கு மற்றும் சர்புல் பழங்குல புதிய ஆண்டு நாட்காட்டியை உயிர்ப்பிக்கின்றன." },
      bn: { name: "ছত্তিশগড়", about: "'ভারতের চালের কৌটো' — ঘন বন, নদী এবং সার্গুজা মন্দির। দক্ষিণে বাস্তর একটি আদিবাসী রাজ্য।", famous: "সার্গুজা মন্দির, সিতানদি, বাস্তর", practice: "পান্ডবানী নৃত্যনাট্য, কর্ম আচার এবং সরহুল আদিবাসী নববর্ষ বছরকে সচল রাখে।" }
    },
    capital: "Raipur", region: "east", emoji: "🥁", color: "#2a6a5e",
    heritage: ["Rajim Jagannath Temple", "Sarguja (Bharatpur) temples", "Mahamaya Temple (Mahasamund)"],
    food: ["Bhurki", "Khaman", "Dahi puri", "Bagiya"],
    festivals: ["Jagdalpur Ramlila", "Sarhul", "Karma"],
    dance: ["Charkuli", "Pandavani"],
    music: ["Pandavani songs", "Raut wagh nartak"],
    crafts: ["Bhurja leaf art (Bastar)", "Bamboo craft"],
    textiles: ["Handwoven cotton", "Khadi"],
    languages: ["Hindi", "Chhattisgarhi", "Gondi", "Kuku"],
    museums: ["Tribal Museum (Dhamtari)"],
    lesserKnown: ["Barna cave rock paintings (Sukma)", "Jashbhan Fort (Korba)"]
  },
  {
    id: "assam", name: "Assam", ut: false,
    t: {
      en: { name: "Assam", about: "The gateway to the northeast, on the Brahmaputra. It is famous for its tea gardens, the one-horned rhino of Kaziranga, the world's largest river island Majuli, and the three Bihu New Year festivals.", famous: "Kaziranga, tea gardens, Majuli, Bihu", practice: "The gamusa towel is a mark of respect, and the Bihu season — Bohag, Katik and Agrahai — fills the year with dhol beats and folk songs." },
      hi: { name: "असम", about: "उत्तर-पूर्व का द्वार, ब्रह्मपुत्र पर। चाय बागान, काज़िरांगे के एक-शृंखल हाथी, दुनिया की सबसे बड़ी नदी द्वीप मजूलि और तीन बिहू नववर्ष उत्सव के लिए प्रसिद्ध।", famous: "काज़िरांघा, चाय बागान, मजूलि, बिहू", practice: "गामूसा टोपी सम्मान का चिह्न है, और बिहू मौसम — बोहाग, कटिक और अग्राहै — वर्ष को ढोल और लोक गीतों से भरती है।" },
      te: { name: "అస్సాం", about: "ఉత్తర-తూర్పు ద్వారం, బ్రహ్మపుత్రపై. టీ తోటలు, కజిరంగా ఒక-శ్రేణి జంతువులు, ప్రపంచంలోనే అతి పెద్ద నది ద్వీపం మజూలి, మూడు బిహూ ఉత్సవాలు.", famous: "కజిరంగా, టీ తోటలు, మజూలి, బిహూ", practice: "గమ్ముసా వొళ్ల కిరాణ గౌరవ చిహ్నం, బిహూ సీజన్ — బోహగ్, కట్టిక్, అగ్రహై — సంవత్సరం ధోలెలు, లోక గానాలతో నిండి ఉంటాయి." },
      ta: { name: "அசாம்", about: "வடக்கு-கிழக்கு இலங்கை, ப்ரம்மபுத்திர ஆற்றின் கரையில். தேயிலை தோட்டங்கள், காழிர்ங்கா தூதரின் ஒற்றைக் குளிர், உலகின் மிகப்பெரிய நதிக் கரையோரக் கடலும் மஜூலியும் மூன்று பிஹூ புதிய ஆண்டு திருவிழாக்களும்.", famous: "காழிர்ங்கா, தேயிலை தோட்டங்கள், மஜூலி, பிஹூ", practice: "கமசுவா துணை மரியாதையின் குறியீடு; பிஹூ பருவம் — போஹாக், கட்டிக், அக்ரஹை — ஆண்டை டோல் இசை மற்றும் மக்கள் பாடல்களால் நிரப்புகிறது." },
      bn: { name: "আসাম", about: "উত্তর-পূর্বের দরজা, ব্রহ্মপুতরের ধারে। চা বাগান, কাজিরাঙার একশৃঙ্গ গণ্ডা, বিশ্বের বৃহত্তম নদী দ্বীপ মাজুলি এবং তিনটি বিহু নববর্ষ উৎসবের জন্য পরিচিত।", famous: "কাজিরাঙা, চা বাগান, মাজুলি, বিহু", practice: "গামুসাপা মোমো সম্মানের চিহ্ন; বিহু মৌসুম — বোহাগ, কাতিক, অগ্রহাই — বছরকে ঢোল ও লোকগানে ভরে তোলে।" }
    },
    capital: "Dispur", region: "east", emoji: "🍃", color: "#7a5c1e",
    heritage: ["Kaziranga National Park", "Kamakhya Temple", "Majuli (Satras)", "Sivasagar (Ahom capital)"],
    food: ["Xaak ghat", "Maas tanga", "Til pitha", "Laru"],
    festivals: ["Rongali (Bohag) Bihu", "Kongali Bihu", "Magh Bihu", "Durga Puja"],
    dance: ["Bihu dance"],
    music: ["Bihu songs", "Bodo folk"],
    crafts: ["Cane & bamboo craft", "Gamusa weaving"],
    textiles: ["Muga silk", "Eri silk", "Pat (handspun cotton)"],
    languages: ["Assamese", "Bodo", "Hindi", "English"],
    museums: ["Assam State Museum (Guwahati)"],
    lesserKnown: ["Manas National Park", "Gaugahati (sacred plateau, Guwahati)"]
  }
,

  {
    id: "meghalaya", name: "Meghalaya", ut: false,
    t: {
      en: { name: "Meghalaya", about: "The 'Abode of Clouds' — living root bridges, the sacred hills of Mawlynnong, and the matrilineal Khasi and Jaintia cultures.", famous: "Living root bridges, Mawlynnong, Dawki", practice: "Shnong, the Khasi new year, and the harvest of root bridges keep the calendar green." },
      hi: { name: "मेघालय", about: "'बादलों का निवास' — जड़ों के सेतु, माव्लिन्यॉनग की पवित्र पहाड़ियाँ, मातापरंपरा खसी संस्कृति।", famous: "जड़ों के सेतु, माव्लिन्यॉनग, डव्की", practice: "श्नॉंग नववर्ष और जड़ सेतु फसल वर्ष को हरा रखती हैं।" },
      te: { name: "మెఘాలయ", about: "'మేఘాలయం' — మూలబ్రిడ్జ్లు, మావ్లెనోంగ్ పవిత్ర కొండలు, ఖాసీ సంస్కృతి.", famous: "మూలబ్రిడ్జ్లు, మావ్లెనోంగ్, డావ్కీ", practice: "శ్నోంగ్ నవసంవత్సరం, మూలబ్రిడ్జ్ పంటలు సంవత్సరంకు ప్రకాశం చేస్తాయి." },
      ta: { name: "மேகாலயா", about: "'மேகங்களின் குடியிருப்பு' — லிவிங் ரூட் பாலங்கள், மாவ்லிந்ங் புனித மலைகள், தாய்வழி காஷ் மற்றும் ஜாய்ந்தியா கலாச்சாரங்கள்.", famous: "லிவிங் ரூட் பாலங்கள், மாவ்லிந்ங், டாக்கி", practice: "ஷ்னோங் — காஷ் புதிய ஆண்டு; மூலகட்டிப் பாரம்பரியம் ஆண்டை இயக்கமாக வைக்கிறது." },
      bn: { name: "মেঘালয়", about: "'মেঘের আবাস' — লিভিং রুট ব্রিজ, মাউলিননঙের পবিত্র পাহাড়, খাশি সংস্কৃতি।", famous: "লিভিং রুট ব্রিজ, মাউলিননং, দাওকি", practice: "শনং নববর্ষ এবং লিভিং রুট ব্রিজের ফসল বছরকে সবুজ রাখে।" }
    },
    capital: "Shillong", region: "east", emoji: "🌉", color: "#356b46",
    heritage: ["Living root bridges (Riwai)", "Mawlynnong (cleanest village)", "Dawki river"],
    food: ["Jadoh", "Tungrymbai", "Dohkhlei"],
    festivals: ["Shnong (Khasi new year)", "Sekreniem (Jaintia)"],
    dance: ["Khasi folk dance"],
    music: ["Khasi folk song (dhol)"],
    crafts: ["Bamboo craft"],
    textiles: ["Khasi woven shawls"],
    languages: ["Khasi", "Jaintia", "Hindi", "English"],
    museums: ["State Museum (Shillong)"],
    lesserKnown: ["Cherrapunji (waterfall town)", "Nongriat (seven-tier falls)"]
  },
  {
    id: "tripura", name: "Tripura", ut: false,
    t: {
      en: { name: "Tripura", about: "A small state of the northeast, known for the Tripuri culture, the Unakot rock art, and the rivers of the Barak basin.", famous: "Unakot rock art, Tripura's rivers", practice: "The Turob royal wedding festival and the Tripuri new year give the calendar a royal touch." },
      hi: { name: "त्रिपुरा", about: "उत्तर-पूर्व का छोटा राज्य — त्रिपुरी संस्कृति, उनाकोट की शिला-कला, बरक नदी की घाटी।", famous: "उनाकोट शिला-कला, त्रिपुरा की नदियाँ", practice: "टुरोब शाही विवाह उत्सव और त्रिपुरी नववर्ष कैलेंडर को राजसी स्पर्श देते हैं।" },
      te: { name: "త్రిపుర", about: "ఉత్తర-తూర్పు చిన్న రాష్ట్రం — త్రిపురీ సంస్కృతి, ఉనకోట్ రాతి చిత్రకళ, బరక్ నది.", famous: "ఉనకోట్ రాతి చిత్రకళ, త్రిపుర నదులు", practice: "ట్రోబ్ రాజ వివాహ ఉత్సవం, త్రిపురీ నవసంవత్సరం సంవత్సరం వైభవంగా చేస్తాయి." },
      ta: { name: "திரிபூர", about: "வடக்கு-கிழக்கின் சிறிய மாநிலம் — திரிபூரி மரபு, யுனாகோட் பாறைக் கலை, பராக் ஆறு.", famous: "யுனாகோட் பாறைக் கலை, திரிபூரின் ஆறுகள்", practice: "சுரோப் அரச திருமண விழா திரிபூரி புதிய ஆண்டு நாட்காட்டியை மன்னராக வைக்கின்றன." },
      bn: { name: "ত্রিপুরা", about: "উত্তর-পূর্বের ছোট রাজ্য — ত্রিপুরী সংস্কৃতি, উনাগড়ের পাথরের শিল্প, বরাক নদীর অববাহিকা।", famous: "উনাগড়ের শিলাকলার চিত্র, ত্রিপুরার নদী", practice: "টুর্বোব রাজবিবাহ উৎসব এবং ত্রিপুরী নববর্ষ বছরকে রাজকীয় রাখে।" }
    },
    capital: "Agartala", region: "east", emoji: "🪔", color: "#2a7a6a",
    heritage: ["Unakot Rock Art", "Tripura Royal Palace (Agartala)"],
    food: ["Khanu (fish and pork stew)", "Mura pitha"],
    festivals: ["Turob (royal wedding festival)"],
    dance: ["Tripuri folk dance"],
    music: ["Tripuri folk songs"],
    crafts: ["Bamboo craft (Tripura)"],
    textiles: ["Khadi"],
    languages: ["Tripuri", "Bengali", "Hindi", "English"],
    museums: ["Tripura State Museum (Agartala)"],
    lesserKnown: []
  },
  {
    id: "mizoram", name: "Mizoram", ut: false,
    t: {
      en: { name: "Mizoram", about: "A hilly state of the northeast, known for the Mizo culture, bamboo craft, and the Homas feast tradition.", famous: "Mizo culture, bamboo craft, Homas", practice: "The Homas feast and the Mizo new year keep the calendar alive." },
      hi: { name: "मिजोरम", about: "उत्तर-पूर्व का पहाड़ी राज्य — मिजो संस्कृति, बांस कला, होमा उत्सव परंपरा।", famous: "मिजो संस्कृति, बांस कला, होमा", practice: "होमा परंपरा और मिजो नववर्ष वर्ष को जीवित रखते हैं।" },
      te: { name: "మిజోరం", about: "ఉత్తర-తూర్పు పర్వత రాష్ట్రం — మిజో సంస్కృతి, బాంబు కళ, హోమాస్ ఊరట్టు.", famous: "మిజో సంస్కృతి, బాంబు కళ, హోమాస్", practice: "హోమాస్ ఊరట్టు, మిజో నవసంవత్సరం సంవత్సరం సజీవంగా ఉంచుతాయి." },
      ta: { name: "மிசோரம்", about: "வடக்கு-கிழக்கின் மலையுயரமான மாநிலம் — மிசோ மரபு, ஆடம்பர கலை, ஹோமாஸ் விழா மரபு.", famous: "மிசோ மரபு, ஆடம்பர கலை, ஹோமாஸ்", practice: "ஹோமாஸ் மரபு மிசோ புதிய ஆண்டு நாட்காட்டியை உயிர்ப்பிக்கின்றன." },
      bn: { name: "মিজোরাম", about: "উত্তর-পূর্বের পাহাড়ি রাজ্য — মিজো সংস্কৃতি, বাঁশ শিল্প, হোমাস উৎসব ঐতিহ্য।", famous: "মিজো সংস্কৃতি, বাঁশ শিল্প, হোমাস", practice: "হোমাস ঐতিহ্য মিজো নববর্ষ বছরকে সচল রাখে।" }
    },
    capital: "Aizawl", region: "east", emoji: "🎋", color: "#5c7a3a",
    heritage: ["Champhui Park (Aizawl)", "Villages of the Mizo Hills"],
    food: ["Ponnam (fermented fish)"],
    festivals: ["Homas (feast)"],
    dance: ["Mizo folk dance"],
    music: ["Mizo folk song (guitar and drum)"],
    crafts: ["Bamboo craft (Mizo)"],
    textiles: ["Mizo woven textiles"],
    languages: ["Mizo", "Hindi", "English"],
    museums: ["Mizoram State Museum (Aizawl)"],
    lesserKnown: []
  },
  {
    id: "manipur", name: "Manipur", ut: false,
    t: {
      en: { name: "Manipur", about: "A state of the northeast, known for the Manipuri culture, the sword art Thang Ta, and the Imphal Valley.", famous: "Manipuri culture, sword art, Imphal", practice: "The sword art Thang Ta and the Manipuri new year give the calendar its flavour." },
      hi: { name: "मणिपुर", about: "उत्तर-पूर्व का राज्य — मणिपुरी संस्कृति, तलवार कला, इम्फाल घाटी।", famous: "मणिपुरी संस्कृति, तलवार कला, इम्फाल", practice: "तलवार कला और मणिपुरी नववर्ष वर्ष को रस देते हैं।" },
      te: { name: "మణిపూర్", about: "ఉత్తర-తూర్పు రాష్ట్రం — మణిపూరి సంస్కృతి, కత్తి కళ, ఇంఫల్ లోయ.", famous: "మణిపూరి సంస్కృతి, కత్తి కళ, ఇంఫల్", practice: "కత్తి కళ, మణిపూరి నవసంవత్సరం సంవత్సరంకు ప్రకాశం చేస్తాయి." },
      ta: { name: "மணிப்பூர்", about: "வடக்கு-கிழக்கின் மாநிலம் — மணிப்பூரி மரபு, கத்தி கலை, இம்ப்ஃபால் சந்தி.", famous: "மணிப்பூரி மரபு, கத்தி கலை, இம்ப்ஃபால்", practice: "கத்தி கலை மணிப்பூரி புதிய ஆண்டு நாட்காட்டியை ருசி சேர்க்கின்றன." },
      bn: { name: "মণিপুর", about: "উত্তর-পূর্বের রাজ্য — মণিপুরী সংস্কৃতি, তলবার কলা, ইম্ফল উপত্যকা।", famous: "মণিপুরী সংস্কৃতি, তলবার কলা, ইম্ফল", practice: "তলবার কলা এবং মণিপুরী নববর্ষ বছরকে স্বাদ দেয়।" }
    },
    capital: "Imphal", region: "east", emoji: "⚔️", color: "#2e5f8a",
    heritage: ["Kangla Fort", "Imphal (Valley)"],
    food: ["Eru (fermented fish dish)"],
    festivals: [],
    dance: ["Sword dance (Thang Ta)"],
    music: ["Pung and drum (Manipuri)"],
    crafts: ["Bamboo craft", "Pottery"],
    textiles: ["Manipuri textiles"],
    languages: ["Manipuri", "Hindi", "English"],
    museums: ["Manipur State Museum (Imphal)"],
    lesserKnown: []
  },

  {
    id: "nagaland", name: "Nagaland", ut: false,
    t: {
      en: { name: "Nagaland", about: "A hilly state of the northeast, known for the Naga culture, the Hornbill Festival, and tribal drums.", famous: "Naga culture, Hornbill Festival, tribal drums", practice: "The Hornbill Festival in December and the Naga new year fill the year with drums and dance." },
      hi: { name: "नागालैंड", about: "उत्तर-पूर्व का पहाड़ी राज्य — नागा संस्कृति, हॉर्नबिल मेला, जनजातीय ढोल।", famous: "नागा संस्कृति, हॉर्नबिल मेला, जनजातीय ढोल", practice: "हॉर्नबिल मेला (दिसंबर) और नागा नववर्ष वर्ष को शोर से भरते हैं।" },
      te: { name: "నాగాలాండ్", about: "ఉత్తర-తూర్పు పర్వత రాష్ట్రం — నాగా సంస్కృతి, హార్న్బిల్ మేళం, టమట", famous: "నాగా సంస్కృతి, హార్న్బిల్ మేళం, టమట", practice: "హార్న్బిల్ మేళం (డిసెంబర్) నాగా నవసంవత్సరం సంవత్సరం డమడమ ధ్వనితో నింపుతాయి" },
      ta: { name: "நாகலாந்து", about: "வடக்கு-கிழக்கின் மலையுயரமான மாநிலம் — நாகா மரபு, ஹார்ன்‌பில் திருவிழா, பழங்குல மோச்சம்.", famous: "நாகா மரபு, ஹார்ன்‌பில் திருவிழா, பழங்குல மோச்சம்", practice: "டிசம்பரில் நடக்கும் ஹார்ன்‌பில் திருவிழா நாகா புதிய ஆண்டு ஆண்டை மோச்சத்துடன் நிரப்புகிறது." },
      bn: { name: "নাগাল্যান্ড", about: "উত্তর-পূর্বের পাহাড়ি রাজ্য — নাগা সংস্কৃতি, হর্নবিল উৎসব, আদিবাসী ঢোল।", famous: "নাগা সংস্কৃতি, হর্নবিল উৎসব, আদিবাসী ঢোল", practice: "ডিসেম্বরের হর্নবিল উৎসব এবং নাগা নববর্ষ বছরকে ঢোল ও নৃত্যে ভরে তোলে।" },
    },
    capital: "Kohima", region: "east", emoji: "📯", color: "#9c4a1a",
    heritage: ["Hornbill Festival venue (Kezuri, Kohima)", "Mokokchung village (oldest Naga settlement)"],
    food: ["Smoked pork & chili (angak)", "Jhon (fermented pork)"],
    festivals: ["Hornbill Festival (December)", "Tokhom (Naga new year)"],
    dance: ["Naga folk dance (drums)"],
    music: ["Naga folk songs (drums & horns)"],
    crafts: ["Bamboo craft (Naga)", "Woven shawls (khess)"],
    textiles: ["Naga woven shawls (khess)"],
    languages: ["Naga languages (16+)", "English", "Hindi"],
    museums: ["Naga Heritage Museum (Kohima)"],
    lesserKnown: ["Mokokchung (the oldest Naga town)"],
  },
  {
    id: "arunachal-pradesh", name: "Arunachal Pradesh", ut: false,
    t: {
      en: { name: "Arunachal Pradesh", about: "The far-east Himalayan state of monasteries, dense forests and the indigenous cultures of many tribes. Tawang Monastery, the largest in India, crowns the north.", famous: "Tawang Monastery, Dibang Valley, Namdapha", practice: "Losar, Sagai and Torgya mark the new year and harvest; village life turns around barley, millet and the monasteries." },
      hi: { name: "अरुणाचल प्रदेश", about: "उत्तर-पूर्व हिमालय का राज्य — मठ, घने जंगल और बहुत से जनजातीय संस्कृतियाँ। तावांग मठ भारत का सबसे बड़ा है।", famous: "तावांग मठ, दिबांग घाटी, नामदाफा", practice: "लोसर, सागै और टोर्ग्या नववर्ष और फसल चिह्नित करते हैं; गांव की ज़िंदगी जौ, मक्का और मठों पर चरती है।" },
      te: { name: "అరుణాచల ప్రదేశం", about: "ఉత్తర-తూర్పు హిమాలయ రాష్ట్రం — మోనాస్టరీలు, అడవీలు, స్థానిక సంస్కృతులు", famous: "తవంగ్ మోనాస్టరీ, డిబాంగ్ లోయ, నమ్దాఫా", practice: "లోసర్, సగై, టోర్గ్యా ఉత్సవాలు సంవత్సరంను ఆభరణాలుగా చేస్తాయి" },
      ta: { name: "அருணாசலப் பிரதேசம்", about: "பொருந்தியுள்ள ஹிமாலையா சந்தி — மனைகள், அடர்ந்த காடுகள், பழங்குல மரபுகள். தவாங் மனே இந்தியாவின் மிகப்பெரியது.", famous: "தவாங் மனே, திபாங் சந்தி, நம்மடபா", practice: "லோசர், சாகை மற்றும் டோர்யா புதிய ஆண்டு மற்றும் விளைச்சலைக் குறிக்கின்றன; கிராம வாழ்க்கை மக்கா, பச்சை மற்றும் மனைகள் சுற்றி நிகழ்கிறது." },
      bn: { name: "অরুনাচল প্রদেশ", about: "দূর-পূর্ব হিমালয়ের রাজ্য — বিহার, ঘন বন এবং অনেক আদিবাসী সংস্কৃতি। ভারতের বৃহত্তম তাজাং বিহার এখানে।", famous: "তাজাং বিহার, দিবঙ্গ উপত্যকা, নামদাফা", practice: "লোসার, সাগাই এবং টর্গয়া নববর্ষ ও ফসলের চিহ্ন; গ্রামের জীবন জোয়ার, মাহ এবং বিহারের চারদিকে ঘোরে।" },
    },
    capital: "Itanagar", region: "east", emoji: "🏔️", color: "#3d6b35",
    heritage: ["Tawang Monastery", "Namdapha National Park", "Dibang Valley"],
    food: ["Pork momo", "Thukpa", "Phagshapa", "Erase"],
    festivals: ["Losar (Tawang)", "Sagai (Apatani)", "Torgya"],
    dance: ["Mony (Tawang)"],
    music: ["Folk songs (drums & horns)"],
    crafts: ["Bamboo craft", "Wool weaving"],
    textiles: ["Woolen shawls"],
    languages: ["Tagin", "Galo", "Nocte", "Hindi", "English"],
    museums: ["State Museum (Itanagar)"],
    lesserKnown: ["Kargyilo (the double-level lake)", "Sangtu Monastery"],
  },
  {
    id: "sikkim", name: "Sikkim", ut: false,
    t: {
      en: { name: "Sikkim", about: "A small Himalayan state of monasteries, tea gardens and the town of Gangtok. Kanchenjunga, the world's third-highest peak, stands to the east.", famous: "Rumtek Monastery, Kanchenjunga, tea gardens", practice: "Buddhist Losar and the Dashain fairs keep the year in festival." },
      hi: { name: "सिकिम", about: "छोटा हिमालयी राज्य — मठ, चाय बागान, गंग्‌टोक शहर। कंचनजंगा (दुनिया का तीसरा सबसे ऊँचा शिखर) पूर्व में खड़ा है।", famous: "रुमटेक मठ, कंचनजंगा, चाय बागान", practice: "बौद्ध लोसर और दशैन मेले वर्ष को उत्सव में रखते हैं।" },
      te: { name: "సిక్కిమ్", about: "చిన్న హిమాలయ రాష్ట్రం — మోనాస్టరీలు, చాయ తోటలు, గ్యాంగ్‌టోక్", famous: "రంటెక్ మోనాస్టరీ, చాయ తోటలు", practice: "బూత్ హోల్, డాసెమ్ తెర్రీ ఉత్సవాలు సంవత్సరంను వైభవంగా చేస్తాయి" },
      ta: { name: "சிகிம்", about: "சிறிய ஹிமாலியா சந்தி — மனைகள், தேயிலை தோட்டங்கள், காங்‌டோக் நகரம். காஞ்சன்கங்கா (உலகின் மூன்றாவது உயரமான தோட்டம்) கிழக்கில் உள்ளது.", famous: "ரம்டெக் மனே, காஞ்சன்கங்கா, தேயிலை தோட்டங்கள்", practice: "பௌத்த லோசர் மற்றும் தசைன் திருவிழாக்கள் ஆண்டை விழாவில் வைக்கின்றன." },
      bn: { name: "সিকিম", about: "ছোট হিমালয়ের রাজ্য — বিহার, চা বাগান এবং গ্যাংটক শহর। কান্চেনজঙ্ঘা (বিশ্বের তৃতীয় সর্বোচ্চ পর্বত) পূর্বে অবস্থিত।", famous: "রুমটেক বিহার, কান্চেনজঙ্ঘা, চা বাগান", practice: "বৌদ্ধ লোসার এবং দশাই মেলা বছরকে উৎসবে রাখে।" },
    },
    capital: "Gangtok", region: "east", emoji: "🏔️", color: "#4a5c8a",
    heritage: ["Rumtek Monastery", "Tsomgo Lake", "Kanchenjunga (viewpoint, Nathula)"],
    food: ["Gundruk with dal (Nepali)"],
    festivals: ["Buddhist Losar", "Dashain"],
    dance: ["Sikkimese folk dance"],
    music: ["Sikkimese folk songs"],
    crafts: ["Bamboo craft (Lepcha)"],
    textiles: ["Woolen shawls (Sikkim)"],
    languages: ["Lepcha", "Nepali (Sikkimese)", "Hindi", "English"],
    museums: ["Sikkim State Museum (Gangtok)"],
    lesserKnown: ["Yumthang Valley (the 'Switzerland of Sikkim')"],
  },
  {
    id: "andaman-and-nicobar", name: "Andaman and Nicobar Islands", ut: true,
    t: {
      en: { name: "Andaman and Nicobar Islands", about: "A union territory of islands in the Bay of Bengal — rainforest, coral reefs, and the culture of the Great Nicobar and the settled communities of Port Blair.", famous: "Cellular Jail, Port Blair, coral reefs", practice: "The islands' fishing and diving seasons, and the festivals of the settled communities keep the calendar coastal." },
      hi: { name: "अंडमान-निकोबार", about: "बंगाल की खाड़ी के द्वीप समूह — वर्षावन, प्रवाल भूमि और पोर्ट ब्लेयर की संस्कृति।", famous: "सेल्युलर जेल, पोर्ट ब्लेयर, प्रवाल भूमि", practice: "द्वीपों की मछली-पकड़ और डायविंग फसलें काल को तटीय बनाती हैं।" },
      te: { name: "అండమాన్ మరియు నికోబార్ దీవులు", about: "హిందూమహాసముద్ర దీవులు — అడవీలు, సముద్ర జీవ వైవిధ్యం, పట్టణ సంస్కృతి", famous: "పాయ్ బే, హావోర్, మోరిస్ ఐలాండ్", practice: "సముద్ర సంస్కృతి, అటవీ సంస్కృతి, దీవ నివాసజీవుల జీవనం కాలాన్ని నిలుపుతాయి" },
      ta: { name: "அண்டமான்-நிக்கோபார்", about: "பிரான்ஸ் வளைகுடாவின் தீவுகளின் கூட்டாண்மை பகுதி — மழைக்காடு, பூமியின் சூரியன், மற்றும் போர்ட் புளேர் மரபு.", famous: "செலுலார் சிறை, போர்ட் புளேர், பூமியின் சூரியன்", practice: "தீவுகளின் மீன் பிடித்தல் மற்றும் டைவிங் மாதங்கள் காலண்டரைக் கடலோரமாக வைக்கின்றன." },
      bn: { name: "আন্দামান ও নিকোবார்", about: "বঙ্গোপসাগরের দ্বীপ ইউনিয়ন — বর্ষা বন, পলল প্রাচীর এবং পোর্ট ব্লেয়ারের সংস্কৃতি।", famous: "সেলুলার জেল, পোর্ট ব্লেয়ার, পলল প্রাচীর", practice: "দ্বীপের মাছ ধরা এবং ডাইভিং মৌসুম ক্যালেন্ডারকে উপকূলীয় রাখে।" },
    },
    capital: "Port Blair", region: "east", emoji: "🏝️", color: "#1e6b7a",
    heritage: ["Cellular Jail (Port Blair)", "Ross Island (ruins)", "Havelock Island (beaches)"],
    food: ["Fish curry (Andaman style)"],
    festivals: ["Tribal festivals (Nicobarese)"],
    dance: ["Nicobarese dance"],
    music: ["Nicobarese folk songs"],
    crafts: ["Shell craft (Nicobarese)"],
    textiles: ["Woven mats (shell)"],
    languages: ["Nicobarese", "Hindi", "English"],
    museums: ["Cellular Jail National Memorial (Port Blair)"],
    lesserKnown: ["Little Andaman (the quiet islands)"],
  },

  {
    id: "tamil-nadu", name: "Tamil Nadu", ut: false,
    t: {
      en: { name: "Tamil Nadu", about: "A state with 2,000 years of continuous Tamil civilization — the Chola temple cities, Madurai's gopurams, Carnatic music and the Chola temple cities, Madurai's gopurams, Carnatic music and the Coromandel coast.", famous: "Chola temples, Madurai gopurams, Carnatic music", practice: "Pongal, Madurai's temple festivals and the Carnatic concert season keep the calendar musical." },
      hi: { name: "तमिलनाडु", about: "2000 वर्षों की अखंड तमिल सभ्यता — चोल मंदिर, मदुरै के गूपूरम, कर्नाटक संगीत और कोरोमैंडल तट।", famous: "चोल मंदिर, मदुरै गूपूरम, कर्नाटक संगीत", practice: "पोंगाल, मदुरै के मंदिर उत्सव और कर्नाटक सत्र वर्ष को संगीतमय बनाते हैं।" },
      te: { name: "తమిళనాడు", about: "2000 సంవత్సరాల అఖండ తమిళ సంస్కృతి — చోళ ఆలయాలు, మదురై గోపురాలు, కర్ణాటక సంగీతం.", famous: "చోళ ఆలయాలు, మదురై గోపురాలు, కర్ణాటక సంగీతం", practice: "పంకల్, మదురై ఆలయ ఉత్సవాలు, కర్ణాటక సమావేశాలు సంవత్సరం సంగీతంగా చేస్తాయి." },
      ta: { name: "தமிழ்நாடு", about: "2000 ஆண்டுகள் தொடர்ச்சியான தமிழ் பண்பாடு — சோழ கோவில்கள், மதுரை கோபுரங்கள், கர்நாடக இசை.", famous: "சோழ கோவில்கள், மதுரை கோபுரங்கள், கர்நாடக இசை", practice: "பொங்கல், மதுரை கோவில் திருவிழாக்கள், கர்நாடக இசை விழாக்கள் ஆண்டை இசையாக வைக்கின்றன." },
      bn: { name: "তামিলনাড়ু", about: "2000 বছরের অবিরত তামিল সভ্যতা — চোলা মন্দির,মধুরাইয়েরগুপুরাম, কার্নাটিক সংগীত।", famous: "চোলা মন্দির, মধুরাইয়ের গুপুরাম, কার্নাটিক সংগীত", practice: "পাংগাল, মধুরাইয়ের মন্দির উৎসব এবং কার্নাটিক মৌসুম বছরকে সংগীতময় রাখে।" }
    },
    capital: "Chennai", region: "south", emoji: "🛕", color: "#a0322e",
    heritage: ["Brihadeeswarar Temple (Thanjavur)", "Meenakshi Temple (Madurai)", "Mahabalipuram (Pallava caves)"],
    food: ["Idli-sambar", "Masala dosa", "Pongal (the dish)", "Filter coffee"],
    festivals: ["Pongal", "Madurai festival (Chithirai)", "Car festival (Thanjavur)"],
    dance: ["Bharatanatyam", "Temple dance traditions"],
    music: ["Carnatic classical", "Tamil folk (Parai)"],
    crafts: ["Tanjore painting", "Stone carving (Chola)"],
    textiles: ["Kanjivaram silk", "Kora cotton"],
    languages: ["Tamil", "Hindi", "English"],
    museums: ["State Museum (Chennai)", "Government Museum (Madurai)"],
    lesserKnown: ["Sriperumbudur (Chola-era records)", "Kanyakumari (the southern tip)"]
  },
  {
    id: "karnataka", name: "Karnataka", ut: false,
    t: {
      en: { name: "Karnataka", about: "A southern state of the Vijayanagara stone — Hampi, the Hoysala temples, Mysore Palace, and the Carnatic concert season.", famous: "Hampi, Mysore Palace, Carnatic music", practice: "Mysore Dasara, Ratha Saptami (Mandya) and the Carnatic season keep the calendar grand." },
      hi: { name: "कर्नाटक", about: "दक्षिण का राज्य — विजमदागर का पत्थर — हम्पी, होयसल मंदिर, माईसूर प़ेलेस, कर्नाटक सत्र।", famous: "हम्पी, माईसूर प़ेलेस, कर्नाटक संगीत", practice: "माईसूर दशह्रा, रथ सप्तमी (मंद्या) और कर्नाटक सत्र वर्ष को महान बनाते हैं।" },
      te: { name: "కర్ణాటక", about: "దక్షిణ రాష్ట్రం — విజయనగరం రాతి — హంపి, హోయసాల ఆలయాలు, మైసూరు ప్యాలెస్, కర్ణాటక సమావేశాలు.", famous: "హంపి, మైసూరు ప్యాలెస్, కర్ణాటక సంగీతం", practice: "మైసూరు దశరా, రథ సప్తమి (మండియా), కర్ణాటక సమావేశాలు సంవత్సరం గొప్పగా చేస్తాయి." },
      ta: { name: "கர்நாடக", about: "தெற்கின் மாநிலம் — வீஜயனகர பாறை — ஹம்பி, ஹொய்சலா கோவில்கள், மைசூர் அரண்மனை, கர்நாடக இசை.", famous: "ஹம்பி, மைசூர் அரண்மனை, கர்நாடக இசை", practice: "மைசூர் தசரா, ரத்த சப்தமி (மண்டியா), கர்நாடக இசை விழா ஆண்டைப் பெரியதாக வைக்கின்றன." },
      bn: { name: "কರ್ণাটক", about: "দক্ষিণের রাজ্য — বিজয়নগরের পাথর — হাম্পি, হোয়সালা মন্দির, মাইসোর প্রাসাদ, কার্নাটিক।", famous: "হাম্পি, মাইসোর প্রাসাদ, কার্নাটিক সংগীত", practice: "মাইসোর দশাহ, রথা সপ্তমি (মন্দিয়া) এবং কার্নাটিক মৌসুম বছরকে মহান রাখে।" }
    },
    capital: "Bengaluru", region: "south", emoji: "🪔", color: "#a0522d",
    heritage: ["Hampi (Vijayanagara)", "Mysore Palace", "Hoysaleswara Temple (Belur)"],
    food: ["Masala dosa", "Bisi bele bath", "Mysore pak", "Idli"],
    festivals: ["Mysore Dasara", "Ratha Saptami (Mandya)", "Kambala (coast)"],
    dance: ["Dollu Kunitha", "Yakshagana"],
    music: ["Carnatic classical", "Dharavati (folk)"],
    crafts: ["Channapatna toys", "Kalamekhala (twin-loom silk)"],
    textiles: ["Mysore silk", "Haabu (Kodagu)"],
    languages: ["Kannada", "Tulu", "Kodava", "Hindi", "English"],
    museums: ["Government Museum (Bengaluru)", "Government Museum (Mysore)"],
    lesserKnown: ["Talakadu (the 'City of Gold')", "Sringeri (ancient university)"]
  },
  {
    id: "kerala", name: "Kerala", ut: false,
    t: {
      en: { name: "Kerala", about: "'God's Own Country' — a narrow coastal strip of backwaters, coconut groves and the Kathakali art. Onam is the harvest festival, and the sadya (banana-leaf feast) is a way of life.", famous: "Backwaters, Kathakali, Onam", practice: "Onam's Pookalam, the Nehru Trophy Boat Race and Theyyam (ritual art) are the year's highlights." },
      hi: { name: "केरल", about: "'भगवान का अपना राज्य' — बैकवॉटर, नारियल की चारागाहों, काठकली कला की एक संकीर्ण तटीय पट्टी।", famous: "बैकवॉटर, काठकली, ओनम्", practice: "ओनम् का पुक्कलाम, नेहरू ट्रॉफी नाव दौड़ और टहय्याम  (आस्था कला) वर्ष के चिह्न हैं।'" },
      te: { name: "కేరళ", about: "'భగవంతుని రాష్ట్రం' — బ్యాక్‌వాటర్లు, కొబ్బరి తోటలు, కాఠకళీ కళ. ఓనమ్ పండుగ, సాధ్య (అల్లం ఆకు భోజనం).", famous: "బ్యాక్‌వాటర్లు, కాఠకళీ, ఓనమ్", practice: "ఓనమ్ పుక్కలమ్, నెహ్రూ ట్రోఫీ బోటు పరుగు, థియ్యం (ఆరాధన కళ) సంవత్సరం గుర్తింపు." },
      ta: { name: "கேரளம்", about: "'இறைவனின் சொந்த நாடு' — பின்னணிகள், நரம்பு தோட்டங்கள், காத்தகலி கலை. ஓணம் விளைச்சல் திருவிழா, சாத்ய (காய் இலை விருந்து).", famous: "பின்னணிகள், காத்தகலி, ஓணம்", practice: "ஓணத்தின் பூக்களம், நேரு பரிசு படகோட்டம், தைய்யம் (பக்தி கலை) ஆண்டு மிகப்பெரியவை." },
      bn: { name: "কেরালা", about: "'পারদেবের নিজ দেশ' — ব্যাকওয়াটার, নারকেল বাগান এবং কাথাকালি কলা।", famous: "ব্যাকওয়াটার, কাথাকালি, অনাম", practice: "অনামের পুক্কালম, নেহরু ট্রফি নৌ দৌড় এবং থিয়েয়াম (ঐশ্বর্য কলা) বছরের চূড়ান্ত।" }
    },
    capital: "Thiruvananthapuram", region: "south", emoji: "🛶", color: "#1e6b52",
    heritage: ["Guruvayur Temple", "Padmanabhaswamy Temple (Thiruvananthapuram)"],
    food: ["Sadya (banana-leaf feast)", "Appam with stew", "Karimeen pollichathu", "Puttu"],
    festivals: ["Onam", "Nehru Trophy Boat Race", "THEYYAM (ritual art)"],
    dance: ["Kathakali", "Mohiniyattam", "Thiruvathira", "THEYYAM (ritual)"],
    music: ["Carnatic classical", "Chenda Melam", "Nadaswaram"],
    crafts: ["Bronze sculpture (Nagercoil)", "Coir (coconut fibre)", "Kathakali masks"],
    textiles: ["Kasavu (silk-cotton)", "Mundum Neriyathu"],
    languages: ["Malayalam", "English", "Hindi"],
    museums: ["State Museum (Thiruvananthapuram)"],
    lesserKnown: ["Edakkal Caves (Wayanad, rock engravings)", "Kuttanad (the rice bowl)"]
  }
,

  {
    id: "andhra-pradesh", name: "Andhra Pradesh", ut: false,
    t: {
      en: { name: "Andhra Pradesh", about: "The Telugu-speaking heartland — home to the Tirumala Venkateswara Temple, one of the world's most visited shrines, and the Krishna-Godavari delta.", famous: "Tirumala temple, the Krishna delta, Kuchipudi dance", practice: "Bathukamma flower festivals, temple festivals at Srinivasa Kalyana, and the Telugu community feasts (annadaanam) mark the calendar." },
      hi: { name: "आंध्र प्रदेश", about: "तेलुगु भाषी क्षेत्र — तीर्थमला वेंकटेश्वर मंदिर और कृष्णा-गोदावरी तट का घर।", famous: "तीर्थमला मंदिर, कृष्णा तट, कुचीपुड़ी नृत्य", practice: "बथुकम्मा फूल उत्सव, मंदिर उत्सव और तेलुगु सामुदायिक भोजन काल का चिह्न हैं।" },
      te: { name: "అంధ్ర ప్రదేశ్", about: "తెలుగు మూల రాష్ట్రం — తిరుమల వెంకటేశ్వర ఆలయం, కృష్ణా-గోదావరి తీరం.", famous: "తిరుమల ఆలయం, కృష్ణా తీరం, కుచిపూడి నృత్యం", practice: "బత్తుకమ్మ పూల ఉత్సవాలు, ఆలయ ఉత్సవాలు, తెలుగు సమూహ భోజనాలు సంవత్సరం గుర్తింపు." },
      ta: { name: "அந்தப்ரதேசம்", about: "தமிழ் மரபின் மூலம் — திருமலை வேங்கடேஸ்வர் கோவில் மற்றும் கிருஷ்ணா-கோதாவரி தீரம்.", famous: "திருமலை கோவில், கிருஷ்ணா தீரம், குசுபூரி நடனம்", practice: "பத்துகம்மா பூ திருவிழாக்கள், கோவில் திருவிழாக்கள், தமிழ் சமூக விருந்து நாட்காட்டியை குறிக்கின்றன." },
      bn: { name: "আন্দ্র প্রদেশ", about: "তেলেগু ভাষার রাজ্য — তিরুমলা বেঙ্কটেশ্বর মন্দির এবং কৃষ্ণা-গোদাবরী তীরের আবাস।", famous: "তিরুমলা মন্দির, কৃষ্ণা তীর, কুচিপুড়ি নৃত্য", practice: "বথুকম্মা ফুল উৎসব, মন্দির উৎসব এবং তেলেগু কমিউনিটির ভোজ ক্যালেন্ডারের চিহ্ন।" }
    },
    capital: "Amaravati", region: "south", emoji: "🛕", color: "#c2571b",
    heritage: ["Tirumala Venkateswara Temple", "Sri Varadaramana Temple (Pithapuram)", "Lepakshi (Virupaksha Temple)"],
    food: ["Guntur biryani", "Pappu", "Gutti vankaya kura", "Gunna"],
    festivals: ["Bathukamma", "Srimangala Utsavam (Rajahmundry)", "Sankranti"],
    dance: ["Kuchipudi", "Bonati Natyam"],
    music: ["Carnatic classical", "Kuchipudi music"],
    crafts: ["Kondapalli toys", "Bommalata puppetry"],
    textiles: ["Pochampally ikat", "Maheshwari silk"],
    languages: ["Telugu", "Hindi", "English"],
    museums: ["AP State Museum (Visakhapatnam)"],
    lesserKnown: ["Sri Varadaramana Temple (Pithapuram)"]
  },
  {
    id: "telangana", name: "Telangana", ut: false,
    t: {
      en: { name: "Telangana", about: "A state formed in 2014, capital Hyderabad — the city of the Charminar, the Nizams' palaces and the Deccan's granite forts.", famous: "Charminar, Hyderabad, Bidriware", practice: "Bathukamma, the Hyderabad food culture and the Deccan festivals keep the calendar busy." },
      hi: { name: "तेलंगाना", about: "2014 में बना राज्य, राजधानी हैदराबाद — चारमीनार, निज़ामों के पैलेस और देक्कान की पत्थर की दुर्ग।", famous: "चारमीनार, हैदराबाद, बिद्रीवेयर", practice: "बथुकम्मा, हैदराबाद खाद्य संस्कृति और देक्कान मेले काल को व्यस्त रखते हैं।" },
      te: { name: "తెలంగాణ", about: "2014లో ఏర్పడిన రాష్ట్రం, రాజధాని హైదరాబాద్ — చార్మినార్, నిజాంల ప్యాలెస్లు, దేక్‌కాన్ రాజ్యాలు.", famous: "చార్మినార్, హైదరాబాద్, బిద్రివేర్", practice: "బత్తుకమ్మ, హైదరాబాద్ భోజన సంస్కృతి, దేక్‌కాన్ ఉత్సవాలు సంవత్సరం ప్రకాశవంతంగా ఉంచుతాయి." },
      ta: { name: "தெலங்காணம்", about: "2014-இல் உருவான மாநிலம், தலைநகர் ஹைதராபாத் — சார்மினார், நிஜாமை அரண்மனை, தெக்கான் பாறை கோட்டைகள்.", famous: "சார்மினார், ஹைதராபாத், பித்ரிவேர்", practice: "பத்துகம்மா, ஹைதராபாத் உணவு மரபு, தெக்கான் திருவிழாக்கள் நாட்காட்டியை நிறைய வைக்கின்றன." },
      bn: { name: "তেলেঙ্গানা", about: "2014-এ গঠিত রাজ্য, রাজধানী হায়দরাবাদ — চারমিনার, নিজামদের প্রাসাদ এবং দেক্কানের পাথুরে দুর্গ।", famous: "চারমিনার, হায়দরাবাদ, বিদ্রিওয়্যার", practice: "বথুকম্মা, হায়দরাবাদ খাদ্য সংস্কৃতি এবং দেক্কান মেলা ক্যালেন্ডারকে ব্যস্ত রাখে।" }
    },
    capital: "Hyderabad", region: "south", emoji: "🕌", color: "#6e4a8a",
    heritage: ["Charminar", "Gol Gumbaz", "Golconda Fort (ruins)"],
    food: ["Hyderabadi biryani", "Haleem", "Irani chai", "Double ka meetha"],
    festivals: ["Bathukamma"],
    dance: ["Kuchipudi (shared)", "Bharatanatyam"],
    music: ["Carnatic classical", "Qawwali (Nizami)"],
    crafts: ["Bidriware"],
    textiles: ["Pochampally ikat"],
    languages: ["Telugu", "Urdu", "Hindi", "English"],
    museums: ["Salar Jung Museum (Hyderabad)"],
    lesserKnown: ["Qutb Shahi tombs (Golconda)"]
  },
  {
    id: "puducherry", name: "Puducherry", ut: true,
    t: {
      en: { name: "Puducherry", about: "A union territory of four enclaves on the Coromandel coast — French colonial architecture, the Auroville township, and the yoga tradition of Sri Aurobindo.", famous: "French quarter, Auroville, Sri Aurobindo", practice: "The Auroville community life, the yoga ashrams and the coastal festivals keep the calendar calm." },
      hi: { name: "पुडुचेरी", about: "कोरोमैंडल तट पर चार एन्क्लेव का केंद्र शासित प्रदेश — फ्रेंच कालीन वास्तुकला, औरोविल और श्री अरुबिंदो योग परंपरा।", famous: "फ्रेंच क्वार्टर, औरोविल, श्री अरुबिंदो", practice: "औरोविल समुदाय, योग आश्रम और तटीय मेले काल को शांत रखते हैं।" },
      te: { name: "పుదుచేరి", about: "కోరోమండల్ తీరంలో నాలుగు ఎంక్లేవ్‌ల కేంద్ర నియంత్రణ — ఫ్రెంచ్ వాస్తుశిల్పం, ఆరోవిల్, శ్రీ అరూబిందో ధ్యానం.", famous: "ఫ్రెంచ్ క్వార్టర్, ఆరోవిల్, శ్రీ అరూబిందో", practice: "ఆరోవిల్ సమూహ జీవనం, ధ్యాన అశ్రమాలు, తీరోత్సవాలు సంవత్సరం శాంతంగా ఉంచుతాయి." },
      ta: { name: "புதுச்சேரி", about: "கோரோமண்டல் கடலோரத்தில் நான்கு என்‌கிளேவ்களின் கூட்டாண்மை — பிரெஞ்சு கட்டடம், ஆரோவில், ஸ்ரீ அரூபிந்தோ யோகம்.", famous: "பிரெஞ்சு கட்டடம், ஆரோவில், ஸ்ரீ அரூபிந்தோ", practice: "ஆரோவில் சமூக வாழ்க்கை, யோகம் ஆச்சிரமம், கடலோர திருவிழாக்கள் நாட்காட்டியை அமைதியாக வைக்கின்றன." },
      bn: { name: "পুদুচேরি", about: "কোরোমান্ডেল উপকূলে চারটি এঙ্ক্লেভের ইউনিয়ন — ফরাসি স্থাপত্য, অরোভিল এবং শ্রী অরুবিন্দোর যোগ ঐতিহ্য।", famous: "ফরাসি কুয়ার্টার, অরোভিল, শ্রী অরুবিন্দো", practice: "অরোভিল কমিউনিটির জীবন, যোগ আশ্রম এবং উপকূলীয় উৎসব ক্যালেন্ডারকে প্রশান্ত রাখে।" }
    },
    capital: "Puducherry", region: "south", emoji: "🏛️", color: "#8a6a4a",
    heritage: ["French Quarter (Pondicherry)", "Auroville", "Sri Aurobindo Ashram"],
    food: ["French-Indian fusion (Pondicherry)", "Coastal fish thali"],
    festivals: [],
    dance: [],
    music: [],
    crafts: ["French-Indian fusion (Pondicherry)", "Coastal fish thali"],
    textiles: [],
    languages: ["Tamil", "French", "English"],
    museums: ["Sri Aurobindo Ashram museum"],
    lesserKnown: ["Auroville (the experimental township)"]
  },
  {
    id: "lakshadweep", name: "Lakshadweep", ut: true,
    t: {
      en: { name: "Lakshadweep", about: "A union territory of 36 islands in the Arabian Sea — coral atolls, coconut groves and a Muslim-Mappila coastal culture.", famous: "Coral atolls, coconut, Mappila culture", practice: "The island fishing seasons and the Mappila music tradition keep the calendar coastal." },
      hi: { name: "लक्षद्वीप", about: "अरब सागर में 36 द्वीपों का केंद्र शासित प्रदेश — प्रवाल भूमि, नारियल और मुस्लिम-मपिला तटीय संस्कृति।", famous: "प्रवाल भूमि, नारियल, मपिला संस्कृति", practice: "द्वीपों की मछली-पकड़ फसलें और मपिला संगीत काल को तटीय बनाते हैं।" },
      te: { name: "లక్షద్వీప్", about: "అరేబియన్ సముద్రంలో 36 దీవుల కేంద్ర నియంత్రణ — కొరల్ ఆటోల్, కొబ్బరి, మస్లిం-మప్పిల తీర సంస్కృతి.", famous: "కొరల్ ఆటోల్, కొబ్బరి, మప్పిల సంస్కృతి", practice: "దీవల మత్స్య దవాలు, మప్పిల సంగీతం సంవత్సరం తీరంగా ఉంచుతాయి." },
      ta: { name: "லட்சத்தீவு", about: "அரேபிய கடலில் 36 தீவுகளின் கூட்டாண்மை — பூமியின் சூரியன், நரம்பு, முஸ்லிம்-மப்பில் கடலோர மரபு.", famous: "பூமியின் சூரியன், நரம்பு, மப்பில் மரபு", practice: "தீவுகளின் மீன் பிடித்தல் மாதங்கள் மற்றும் மப்பில் இசை நாட்காட்டியைக் கடலோரமாக வைக்கின்றன." },
      bn: { name: "লক্ষদ্বীপ", about: "আরব সাগরে ৩৬টি দ্বীপের ইউনিয়ন — পলল প্রাচীর, নারকেল এবং মুসলিম-মপ্পিলা উপকূলীয় সংস্কৃতি।", famous: "পলল প্রাচীর, নারকেল, মপ্পিলা সংস্কৃতি", practice: "দ্বীপের মাছ ধরার মৌসুম এবং মপ্পিলা সংগীত ক্যালেন্ডারকে উপকূলীয় রাখে।" }
    },
    capital: "Kavaratti", region: "south", emoji: "🏝️", color: "#2a7a8a",
    heritage: ["Coral atolls (36 islands)", "Kavaratti (capital island)"],
    food: ["Malabar fish curry", "Coconut products"],
    festivals: ["Mappila festivals", "Fishing season festivals"],
    dance: ["Mappila dance"],
    music: ["Mappila music (Duff)"],
    crafts: ["Coir craft", "Fish drying (tradition)"],
    textiles: ["Coir textiles"],
    languages: ["Malayalam", "Arabian (Mappila dialect)", "English"],
    museums: [],
    lesserKnown: ["Minicoy (the western atoll)"]
  },
  {
    id: "maharashtra", name: "Maharashtra", ut: false,
    t: {
      en: { name: "Maharashtra", about: "A state of the Maratha forts, the Ellora and Elephanta caves, Lavani and the Mumbai metropolis. The Deccan plateau and the Konkan coast give it two personalities.", famous: "Ellora caves, Maratha forts, Lavani", practice: "Ganesh Chaturthi (Pune), Gudi Padwa and the dhol-tasha beats keep the year festive." },
      hi: { name: "महाराष्ट्र", about: "मराठा दुर्ग, एलोरा और एलेफैंटा गुफाएँ, लावानी और मुंबई शहर।", famous: "एलोरा गुफाएँ, मराठा दुर्ग, लावानी", practice: "गणेश चतुर्थी (पुणे), गुड़ी पाडवा और ढोल-तशा ताल वर्ष को उत्सवमय बनाते हैं।" },
      te: { name: "మహారాష్ట్ర", about: "మరాఠా కోటలు, ఎల్లోరె మరియు ఎలెఫాంటా గుహలు, లావనీ మరియు ముంబై.", famous: "ఎల్లోరె గుహలు, మరాఠా కోటలు, లావనీ", practice: "గణేష్ చతుర్థీ (పూణే), గూడీ పద్వా, ధోలె-తశా తాళాలు సంవత్సరం ఉత్సవంగా చేస్తాయి." },
      ta: { name: "மாஹாராஷ்டிர", about: "மராட்கா கோட்டைகள், எலோரே மற்றும் எலெபாண்டா குகைகள், லவானி மற்றும் மும்பை.", famous: "எலோரே குகைகள், மராட்கா கோட்டைகள், லவானி", practice: "கணேஷ் சதுர்த்தி (புனே), குடி பாத்வா மற்றும் டோல்-தசா தாளம் ஆண்டை விழாவாக வைக்கின்றன." },
      bn: { name: "মহারাষ্ট্র", about: "মারাঠা দুর্গ, এলোর এবং এলেফান্টা গুহা, লাবানী এবং মুম্বাই শহর।", famous: "এলোর গুহা, মারাঠা দুর্গ, লাবানী", practice: "গণেশ চতুর্থী (পুণে), গুডি পদওয়া এবং ঢোল-তাসার তাল বছরকে উৎসবময় রাখে।" }
    },
    capital: "Mumbai", region: "west", emoji: "🏰", color: "#5b3a6e",
    heritage: ["Ellora Caves", "Elephanta Caves", "Raigad Fort", "Siddhi Vinayak Temple (Mumbai)"],
    food: ["Vada pav", "Misal pav", "Pav bhaji", "Modak"],
    festivals: ["Ganesh Chaturthi (Pune)", "Gudi Padwa"],
    dance: ["Lavani", "Dhol-tasha", "Bhav (Marathi theatre)"],
    music: ["Lavani songs", "Abhang (Saint Tukaram)"],
    crafts: ["Warli painting", "Paithani weaving"],
    textiles: ["Paithani silk"],
    languages: ["Marathi", "Hindi", "English"],
    museums: ["Chhatrapati Shivaji Maharaj Vastu Sangrahalaya (Mumbai)"],
    lesserKnown: ["Panchgani (the hill station of the Sahyadris)"]
  },
  {
    id: "gujarat", name: "Gujarat", ut: false,
    t: {
      en: { name: "Gujarat", about: "A state of the Rann of Kutch, the Statue of Unity, the Gir lions and the Sufi tradition of Junagadh. Its 1,600 km coastline is the longest in India.", famous: "Rann of Kutch, Statue of Unity, Gir lions", practice: "The 24-day Rann Utsav, the Garba of Navratri and the Sufi qawwali of Junagadh keep the calendar loud." },
      hi: { name: "गुजरात", about: "रन्न ऑफ़ कुच, स्टैच्यू ऑफ़ यूनिटी, गिर शेर और जूनागढ़ सूफ़ी परंपरा का राज्य।", famous: "रन्न ऑफ़ कुच, स्टैच्यू ऑफ़ यूनिटी, गिर शेर", practice: "24 दिन का रन्न उत्सव, नवरात्रि का गरबा और जूनागढ़ क़ुवाली वर्ष को शोर से भरते हैं।" },
      te: { name: "గుజరాత్", about: "రన్న్ ఆఫ్ కుచ్, స్టాచు ఆఫ్ యూనిటీ, గిర్ సింహాలు, జూనాగఢ్ సూఫి వారసత్వం రాష్ట్రం.", famous: "రన్న్ ఆఫ్ కుచ్, స్టాచు ఆఫ్ యూనిటీ, గిర్ సింహాలు", practice: "24 రోజుల రన్న్ ఉత్సవం, నవరాత్రి గార్బా, జూనాగఢ్ కవాలీ సంవత్సరం ప్రకాశవంతంగా ఉంచుతాయి." },
      ta: { name: "குஜராத்", about: "ரான்ன் ஆஃப் குச்சு, ஸ்டேச்சு ஆஃப் யூனிட்டி, கிர் சிங்கங்கள் மற்றும் ஜூனாகத் சூஃபி மரபின் மாநிலம்.", famous: "ரான்ன் ஆஃப் குச்சு, ஸ்டேச்சு ஆஃப் யூனிட்டி, கிர் சிங்கங்கள்", practice: "24 நாள் ரான்ன் உத்சவ், நவராத்திரி கர்பா மற்றும் ஜூனாகத் கவாலி ஆண்டை ஒலிக்கச் செய்கின்றன." },
      bn: { name: "গুজরাট", about: "রান্ন অফ কুচ, স্ট্যাচু অব ইউনিটি, গির সিংহ এবং জুনাপুর সূফি ঐতিহ্যের রাজ্য।", famous: "রান্ন অফ কুচ, স্ট্যাচু অব ইউনিটি, গির সিংহ", practice: "24 দিনের রান্ন উৎসব, নবরাত্রির গরবা এবং জুনাপুর কবালি ক্যালেন্ডারকে জীবন্ত রাখে।" }
    },
    capital: "Gandhinagar", region: "west", emoji: "🐫", color: "#0a5c8a",
    heritage: ["Statue of Unity (Kevadia)", "Rann of Kutch", "Gir National Park (Asiatic lion)"],
    food: ["Kutchi thali", "Khandvi", "Dhokla", "Bajra rotla"],
    festivals: ["Rann Utsav (Kutch)", "Navratri (Garba)", "Uttarayan (kites)"],
    dance: ["Garba", "Dandiya", "Raas Leela"],
    music: ["Surti Hindustani classical", "Dhol-folk"],
    crafts: ["Kutch embroidery", "Kutch blue pottery"],
    textiles: ["Bandhani", "Ajrakh", "Patola", "Bhujodi"],
    languages: ["Gujarati", "Kutchi", "Hindi", "English"],
    museums: ["Calico Museum of Textiles (Ahmedabad)"],
    lesserKnown: ["Lothal (Indus Valley port)", "Girnar (the sacred mountain)"]
  },
  {
    id: "goa", name: "Goa", ut: false,
    t: {
      en: { name: "Goa", about: "A small coastal state where Portuguese baroque churches stand beside Hindu temple towns, and the fado nights meet the Shigmo processions.", famous: "Basilica of Bom Jesus, beaches, Fort Aguada", practice: "The Latin Quarter of Fontainhas, Carnival and Shigmo processions keep the Portuguese-Indian blend alive." },
      hi: { name: "गोवा", about: "छोटा तटीय राज्य — पुर्तगाली बरोक चर्च और हिंदू मंदिर शहर, फादो रातें और शिगमो प्रकृति।", famous: "बेसिलिका ऑफ़ बॉम जेसस, समुद्र तट, फोर्ट अगुआडा", practice: "फोन्तेनहास् का लैटिन क्वार्टर, कैर्नवल और शिगमो श्रृंखला पुर्तगाली-भारतीय मिश्रण को जीवित रखती हैं।" },
      te: { name: "గోవా", about: "చిన్న తీర రాష్ట్రం — పోర్చుగీస్ బరోక్ చర్చులు మరియు హిందూ ఆలయ నగరాలు, ఫాడో రాతలు మరియు శిగ్మో ప్రక్రమాలు.", famous: "బేసిలికా ఆఫ్ బం జెస్సస్, సముద్ర తీరాలు, ఫోర్ట్ అగువాడా", practice: "ఫోంటెనాహాస్ లాటిన్ క్వార్టర్, కార్నీవల్, శిగ్మో ప్రక్రమాలు పోర్చుగీస్-భారతీయ కలయ్యాన్ని సజీవంగా ఉంచుతాయి." },
      ta: { name: "கோவா", about: "சிறிய கடலோர மாநிலம் — போர்ச்சுகீஸ் பரோக் தேவாலயங்கள் மற்றும் இந்து கோவில் நகரங்கள், ஃபாடோ இரவுகள் மற்றும் சிஷ்மோ முன்னேற்றங்கள்.", famous: "பேசிலிக்கா ஆஃப் பாம் ஜேசஸ், கடலோரம், ஃபோர்ட் அகுவாடா", practice: "ஃபோண்டெனாசின் லேட்டின் கர்டர், கர்னல் மற்றும் சிஷ்மோ முன்னேற்றங்கள் போர்ச்சுகீஸ்-இந்திய கலவைக்கு உயிர் சேர்க்கின்றன." },
      bn: { name: "গোয়া", about: "ছোট উপকূলীয় রাজ্য — পুর্তগালি বারোক গির্জা এবং হিন্দু মন্দির শহর, ফাদো রাত এবং শিগমো প্রক্রিয়া।", famous: "বেসিলিকা অফ বম জেসাস, সমুদ্র সৈকত, ফোর্ট আগুয়াডা", practice: "ফন্টাইনহাসের ল্যাটিন কুয়ার্টার, কার্নিভাল এবং শিগমো প্রক্রিয়া পুর্তগালি-ভারতীয় সংমিশ্রণকে সচল রাখে।" }
    },
    capital: "Panaji", region: "west", emoji: "🏖️", color: "#b8860b",
    heritage: ["Basilica of Bom Jesus", "Se Cathedral", "Fontainhas (Latin Quarter)", "Chapora Fort"],
    food: ["Fish curry rice", "Pork vindaloo", "Bebinca", "Xacuti", "Feni (cashew liquor)"],
    festivals: ["Carnival (Panaji)", "Shigmo", "Ganesh Chaturthi"],
    dance: ["Dilli (folk)", "Fado (Portuguese, nights)"],
    music: ["Fado", "Dilli songs"],
    crafts: ["Cashew craft", "Filigree (silver)"],
    textiles: ["Korvai (Konkani weaving)"],
    languages: ["Konkani", "Marathi", "Hindi", "English"],
    museums: ["Goa State Museum (Panaji)"],
    lesserKnown: ["Aguada Lighthouse (17th century)", "Chorao Island (sacred groves)"]
  },
  {
    id: "dadra-daman", name: "Dadra and Nagar Haveli and Daman and Diu", ut: true,
    t: {
      en: { name: "Dadra and Nagar Haveli and Daman and Diu", about: "Two small union territories — the former on the Sahyadri foothills, the latter on the Arabian coast — with the Portuguese heritage of Old Daman.", famous: "Old Daman (Portuguese), Moti Daman (island), the Sahyadri foothills", practice: "The Daman carnival, the Diu fishing culture and the DNH folk fairs keep the calendar small and sweet." },
      hi: { name: "दादरा और नागर हवेली और दामान और दीव", about: "दो छोटे केंद्र शासित प्रदेश — सायद्रि पहाड़ियों और अरब तट पर — ओल्ड दामान की पुर्तगाली विरासत।", famous: "ओल्ड दामान (पुर्तगाली), मोती दामान (द्वीप), सायद्रि पहाड़ियाँ", practice: "दामान कैर्नवल, दीव मछली-पकड़ संस्कृति और डीएनएच लोक मेले काल को छोटा और मीठा रखते हैं।" },
      te: { name: "దాద్రా మరియు నగర్ హవేలీ మరియు దామన్ మరియు దీవ్", about: "రెండు చిన్న కేంద్ర నియంత్రణ — సాహ్యద్రీ పర్వతాలు మరియు అరేబియన్ తీరం — ఆల్డ్ దామన్ పోర్చుగీస్ వారసత్వం.", famous: "ఆల్డ్ దామన్ (పోర్చుగీస్), మోతి దామన్ (దీవ), సాహ్యద్రీ పర్వతాలు", practice: "దామన్ కార్నీవల్, దీవ్ మత్స్య సంస్కృతి, డి ఎన్ హెచ్ లోక మేళాలు సంవత్సరం చిన్న, మిగులగా ఉంచుతాయి." },
      ta: { name: "டாடரா மற்றும் நகர் ஹவெலி மற்றும் டாமன் மற்றும் டியூ", about: "இரண்டு சிறிய கூட்டாண்மைப் பகுதிகள் — சாஹ்யத்திரி மலைகள் மற்றும் அரேபிய கடலோரம் — ஒல்ட் டாமனின் போர்ச்சுகீஸ் மரபு.", famous: "ஒல்ட் டாமன் (போர்ச்சுகீஸ்), மோதி டாமன் (தீவ்), சாஹ்யத்திரி மலைகள்", practice: "டாமன் கர்நல், டியூ மீன் பிடித்தல் மரபு மற்றும் டி என் எச் மக்கள் திருவிழாக்கள் நாட்காட்டியைச் சிறியதாகவும் இனிமையாகவும் வைக்கின்றன." },
      bn: { name: "দাদরা ও নাগর হাভেলি এবং দামান ও দিউ", about: "দুটি ছোট ইউনিয়ন — সাহ্যাদ্রি পাহাড় এবং আরব উপকূলে — পুরাতন দামানের পুর্তগালি ঐতিহ্য।", famous: "পুরাতন দামান (পুর্তগালি), মোতি দামান (দ্বীপ), সাহ্যাদ্রি পাহাড়", practice: "দামান কার্নিভাল, দিউ মাছ ধরার সংস্কৃতি এবং ডিএনএচ লোক মেলা ক্যালেন্ডারকে ছোট ও মিষ্টি রাখে।" }
    },
    capital: "Dadra (DNH) / Daman (D&D)", region: "west", emoji: "🏰", color: "#7a5a3a",
    heritage: ["Old Daman (Portuguese quarter)", "Moti Daman (island)"],
    food: [],
    festivals: ["Daman Carnival (Portuguese)"],
    dance: [],
    music: [],
    crafts: [],
    textiles: [],
    languages: ["Gujarati", "Konkani", "Hindi", "English"],
    museums: [],
    lesserKnown: []
  }
]

/* ---------- lookup: map feature names (GeoJSON) -> entry ---------- */
window.HERITAGE_STATES.byName = (function () {
  const m = {};
  window.HERITAGE_STATES.forEach((st) => { m[st.name] = st; });
  m["Jammu and Kashmir"] = m["Jammu & Kashmir"];
  m["Jammu & Kashmir (UT)"] = m["Jammu & Kashmir"];
  m["Andaman and Nicobar"] = m["Andaman and Nicobar Islands"];
  m["Andaman & Nicobar"] = m["Andaman and Nicobar Islands"];
  m["Dadra & Nagar Haveli"] = m["Dadra and Nagar Haveli and Daman and Diu"];
  m["Daman & Diu"] = m["Dadra and Nagar Haveli and Daman and Diu"];
  return m;
})();
window.HERITAGE_STATES.get = (name) => (name && window.HERITAGE_STATES.byName[name]) || null;
