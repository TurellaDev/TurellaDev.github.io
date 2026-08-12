import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import * as d3 from "d3";
import * as THREE from "three";
import {
  Home as HomeIcon, Image as ImageIcon, Share2, Users as UsersIcon, Clock, CalendarDays,
  PlusCircle, Settings as SettingsIcon, Search, X, ChevronRight, ChevronLeft, Play, MapPin,
  User, ZoomIn, ZoomOut, Maximize2, RotateCcw, Video, Upload, Check, ArrowLeft, ArrowRight,
  Heart, Tag, Calendar, Trash2, Link2, Filter, Menu, ChevronDown, BookOpen, Star, Sparkles,
  Coffee, Sun, Moon, Leaf, Camera, Music, MessageCircle, Bookmark, Brain, Lightbulb
} from "lucide-react";

/* ============================================================
   BRAINHEIMER — Dark theme with word learning
   ============================================================ */

const TODAY = new Date(2026, 7, 12);

/* ---------------------------- Demo data ---------------------------- */

const PEOPLE = [
  { id: "maria", name: "Maria", relationship: "Daughter", color: "#E8A87C", desc: "Your eldest, lives in Lisbon. Visits most Sundays." },
  { id: "daniel", name: "Daniel", relationship: "Son", color: "#85C7A8", desc: "Lives in Porto. Calls every Wednesday evening." },
  { id: "john", name: "John", relationship: "Husband", color: "#7B8FA1", desc: "Married 42 years. Still does the crossword with you." },
  { id: "sofia", name: "Sofia", relationship: "Sister", color: "#D4A5B8", desc: "Your younger sister. You speak almost every day." },
  { id: "ana", name: "Ana", relationship: "Old friend", color: "#B8A9C9", desc: "Friends since school. She taught you to make caldo verde." },
  { id: "drcosta", name: "Dr. Costa", relationship: "Doctor", color: "#A8C4D4", desc: "Your family doctor for over fifteen years." },
  { id: "rosa", name: "Rosa", relationship: "Neighbour", color: "#D4B8A8", desc: "Lives two doors down. Waters your plants when you travel." },
  { id: "tomas", name: "Tomás", relationship: "Grandson", color: "#A8D4C4", desc: "Maria's son, age 9. Mad about football." },
  { id: "beatriz", name: "Beatriz", relationship: "Granddaughter", color: "#C9A8D4", desc: "Daniel's daughter, just graduated. Loves painting." },
  { id: "miguel", name: "Miguel", relationship: "Brother", color: "#A8B8D4", desc: "Your older brother. Still lives in the house you grew up in." },
];

const PLACES = [
  { id: "lisbon", name: "Lisbon", desc: "Your home city for over forty years." },
  { id: "porto", name: "Porto", desc: "Where Daniel and his family live." },
  { id: "familyhome", name: "Family Home", desc: "The house on Rua das Flores." },
  { id: "sintra", name: "Sintra", desc: "A favourite day-trip, all palaces and cool green hills." },
  { id: "ribeira", name: "Ribeira", desc: "The riverside quarter of Porto." },
  { id: "jardimestrela", name: "Jardim da Estrela", desc: "The park near your home." },
  { id: "cafenicola", name: "Café Nicola", desc: "Your regular coffee spot in Rossio." },
  { id: "algarve", name: "Algarve Beach House", desc: "The family's summer house near Lagos." },
];

// Word definitions for the learning feature
const WORD_DEFINITIONS = {
  "pastéis": "Traditional Portuguese custard tarts, made with egg yolks and puff pastry.",
  "nata": "Cream or custard; pastéis de nata are the famous Portuguese custard tarts.",
  "caldo": "Broth or soup; caldo verde is a traditional Portuguese soup with kale.",
  "verde": "Green; caldo verde is a green soup made with kale and potatoes.",
  "ribeira": "Riverbank or riverside area; a historic district in Porto.",
  "fado": "Traditional Portuguese music style, often melancholic and expressive.",
  "saudade": "A deep emotional state of nostalgic longing for something absent.",
  "bacalhau": "Codfish, especially salted cod, a staple in Portuguese cuisine.",
  "rossio": "A famous square in central Lisbon, known for its wave-patterned pavement.",
  "sintra": "A picturesque town near Lisbon with palaces and castles.",
  "algarve": "The southernmost region of Portugal, known for beautiful beaches.",
  "porto": "The second-largest city in Portugal, famous for port wine.",
  "lisbon": "The capital city of Portugal, built on seven hills.",
  "estrela": "Star; Jardim da Estrela is a park in Lisbon.",
  "dom luís": "A famous bridge in Porto, connecting the city across the Douro River.",
  "fado": "Traditional Portuguese music, often sung in restaurants and cafes.",
  "folclore": "Folk traditions, music, and dance of Portugal.",
  "azulejo": "Decorated ceramic tiles, a hallmark of Portuguese architecture.",
  "manueline": "A Portuguese Gothic architectural style, rich in ornamentation.",
  "pombaline": "An architectural style in Lisbon after the 1755 earthquake.",
};

const img = (seed, w = 640, h = 420) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

const d = (y, m, day) => new Date(y, m - 1, day);

const MEMORIES = [
  {
    id: "porto-summer-25", title: "Summer in Porto", category: "Trip",
    date: d(2025, 6, 14), dateEnd: d(2025, 6, 16),
    place: "porto", people: ["maria", "daniel"],
    description: "You spent a wonderful weekend in Porto with Maria and Daniel — long lunches by the river and an evening walk across the Dom Luís bridge.",
    tags: ["family", "travel", "summer"],
    media: [
      { type: "image", url: img("porto1"), caption: "Dinner at Ribeira" },
      { type: "image", url: img("porto2"), caption: "The Dom Luís bridge at sunset" },
    ],
    connections: ["maria-birthday-25", "family-trip-25", "dinner-ribeira-25"],
    mood: "joyful"
  },
  {
    id: "dinner-ribeira-25", title: "Dinner at Ribeira", category: "Event",
    date: d(2025, 6, 15), place: "ribeira", people: ["maria", "daniel"],
    description: "A long, unhurried dinner of grilled fish by the water.",
    tags: ["food", "family"], media: [{ type: "image", url: img("ribeira1"), caption: "Grilled fish by the river" }],
    connections: ["porto-summer-25"],
    mood: "content"
  },
  {
    id: "family-trip-25", title: "Family Trip 2025", category: "Trip",
    date: d(2025, 6, 13), dateEnd: d(2025, 6, 17), place: "porto", people: ["maria", "daniel", "john"],
    description: "The whole family travelled up to Porto together for a rare few days all under one roof.",
    tags: ["family", "travel"], media: [{ type: "image", url: img("famtrip"), caption: "Everyone at the station" }],
    connections: ["porto-summer-25"],
    mood: "joyful"
  },
  {
    id: "maria-birthday-25", title: "Maria's Birthday", category: "Milestone",
    date: d(2025, 3, 22), place: "familyhome", people: ["maria", "daniel", "john", "sofia"],
    description: "Maria turned 45. You made her favourite orange cake and she cried a little, in a good way.",
    tags: ["birthday", "family"], media: [{ type: "image", url: img("mariabday"), caption: "Maria and her cake" }],
    connections: ["porto-summer-25", "christmas-25"],
    mood: "celebratory"
  },
  {
    id: "christmas-25", title: "Christmas Dinner 2025", category: "Celebration",
    date: d(2025, 12, 25), place: "familyhome", people: ["maria", "daniel", "john"],
    description: "The whole family at the table again — twelve of you this year, counting the grandchildren.",
    tags: ["christmas", "family"], media: [
      { type: "image", url: img("xmas25a"), caption: "The table, set for twelve" },
      { type: "image", url: img("xmas25b"), caption: "Tomás opening presents" },
    ],
    connections: ["christmas-24", "maria-birthday-25", "family-dinner-routine"],
    mood: "joyful"
  },
  {
    id: "christmas-24", title: "Christmas 2024", category: "Celebration",
    date: d(2024, 12, 25), place: "familyhome", people: ["maria", "daniel", "john", "miguel"],
    description: "A quieter Christmas, just the close family, with Miguel visiting from the old house.",
    tags: ["christmas", "family"], media: [{ type: "image", url: img("xmas24"), caption: "Miguel carving the turkey" }],
    connections: ["christmas-25"],
    mood: "content"
  },
  {
    id: "family-dinner-routine", title: "Sunday Family Lunch", category: "Routine",
    date: d(2026, 8, 9), place: "familyhome", people: ["maria", "john"],
    description: "Your regular Sunday — Maria brought pastéis de nata and you sat in the garden until the light went.",
    tags: ["routine", "family"], media: [{ type: "image", url: img("sundaylunch"), caption: "Coffee in the garden" }],
    connections: ["christmas-25"],
    mood: "peaceful"
  },
  {
    id: "walk-park-w", title: "Walk in the Park", category: "Routine",
    date: d(2026, 8, 4), place: "jardimestrela", people: ["john"],
    description: "A slow morning walk around Jardim da Estrela with John, feeding the ducks as always.",
    tags: ["routine", "park"], media: [{ type: "image", url: img("parkwalk"), caption: "The pond at Jardim da Estrela" }],
    connections: [],
    mood: "peaceful"
  },
  {
    id: "call-daniel-w", title: "Family Phone Call", category: "Routine",
    date: d(2026, 8, 5), place: null, people: ["daniel"],
    description: "Your Wednesday call with Daniel — he told you about Beatriz's new painting.",
    tags: ["routine", "family"], media: [], connections: ["beatriz-graduation"],
    mood: "content"
  },
  {
    id: "dinner-daniel-w", title: "Dinner with Daniel", category: "Event",
    date: d(2026, 8, 7), place: "familyhome", people: ["daniel"],
    description: "Daniel came down from Porto for the evening; you cooked his favourite bacalhau.",
    tags: ["family", "food"], media: [{ type: "image", url: img("dandinner"), caption: "Bacalhau on the stove" }],
    connections: [],
    mood: "warm"
  },
  {
    id: "sintra-daytrip", title: "Day Trip to Sintra", category: "Trip",
    date: d(2024, 9, 14), place: "sintra", people: ["john", "sofia"],
    description: "A cool, misty day exploring the Pena Palace with John and Sofia, and a long lunch after.",
    tags: ["travel", "day trip"], media: [{ type: "image", url: img("sintra1"), caption: "Pena Palace in the mist" }],
    connections: [],
    mood: "adventurous"
  },
  {
    id: "cafe-nicola-routine", title: "Morning Coffee at Café Nicola", category: "Routine",
    date: d(2026, 7, 30), place: "cafenicola", people: ["ana"],
    description: "Your weekly coffee with Ana at Rossio, the same corner table you've had for years.",
    tags: ["routine", "friends"], media: [{ type: "image", url: img("cafenicola"), caption: "Ana at the corner table" }],
    connections: [],
    mood: "content"
  },
  {
    id: "algarve-summer-23", title: "Summer at the Beach House", category: "Trip",
    date: d(2023, 8, 5), dateEnd: d(2023, 8, 12), place: "algarve", people: ["maria", "daniel", "john", "tomas", "beatriz"],
    description: "Two weeks at the Algarve house, the grandchildren in and out of the sea all day.",
    tags: ["summer", "family", "travel"], media: [
      { type: "image", url: img("algarve1"), caption: "Tomás building sandcastles" },
      { type: "image", url: img("algarve2"), caption: "Sunset from the terrace" },
    ],
    connections: [],
    mood: "joyful"
  },
  {
    id: "tomas-football", title: "Tomás's First Match", category: "Milestone",
    date: d(2026, 4, 18), place: "lisbon", people: ["tomas", "maria"],
    description: "You watched Tomás play his first proper football match — he scored in the second half.",
    tags: ["grandchildren", "milestone"], media: [{ type: "image", url: img("tomasfootball"), caption: "Tomás mid-match" }],
    connections: [],
    mood: "proud"
  },
  {
    id: "beatriz-graduation", title: "Beatriz's Graduation", category: "Milestone",
    date: d(2025, 7, 10), place: "porto", people: ["beatriz", "daniel"],
    description: "Beatriz graduated in Fine Arts. She gave you one of her paintings — it hangs in the hallway now.",
    tags: ["grandchildren", "milestone"], media: [{ type: "image", url: img("beatrizgrad"), caption: "Beatriz with her painting" }],
    connections: ["call-daniel-w"],
    mood: "proud"
  },
];

const TODAY_ITEMS = [
  { time: "12:30", title: "Lunch with Maria", icon: "person", personId: "maria" },
  { time: "15:00", title: "Check-up with Dr. Costa", icon: "event", memoryId: "checkup-routine" },
  { time: "17:00", title: "Walk in the park", icon: "place", placeId: "jardimestrela" },
  { time: "19:30", title: "Call with Daniel", icon: "person", personId: "daniel" },
];

/* ---------------------------- Utilities ---------------------------- */

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function fmtDate(dt, opts = {}) {
  if (!dt) return "";
  const { withWeekday = false, withYear = true } = opts;
  let s = "";
  if (withWeekday) s += DAYS[dt.getDay()] + ", ";
  s += `${MONTHS[dt.getMonth()]} ${dt.getDate()}`;
  if (withYear) s += `, ${dt.getFullYear()}`;
  return s;
}

function fmtRange(a, b) {
  if (!b) return fmtDate(a);
  if (a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()) {
    return `${MONTHS[a.getMonth()]} ${a.getDate()}–${b.getDate()}, ${a.getFullYear()}`;
  }
  return `${fmtDate(a, { withYear: false })} – ${fmtDate(b)}`;
}

function greeting() {
  const h = TODAY.getHours() || 9;
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function personById(id) { return PEOPLE.find(p => p.id === id); }
function placeById(id) { return PLACES.find(p => p.id === id); }
function memoryById(id, memories) { return memories.find(m => m.id === id); }

const CATEGORY_COLOR = {
  Trip: "#E8A87C", Event: "#A8C4D4", Milestone: "#D4A5B8",
  Celebration: "#B8A9C9", Routine: "#85C7A8",
};

const MOOD_EMOJI = {
  joyful: "✨", content: "😊", peaceful: "🌿", 
  celebratory: "🎉", warm: "☀️", proud: "🌟", adventurous: "🗺️"
};

/* ------------------------- Scroll reveal hook ------------------------ */

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { setVisible(true); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={`reveal ${visible ? "reveal-in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ------------------------------ Avatar ------------------------------ */

function Avatar({ person, size = 44 }) {
  const initials = person.name.split(" ").map(w => w[0]).join("").slice(0, 2);
  return (
    <div className="avatar" style={{ width: size, height: size, background: person.color, fontSize: size * 0.38 }}>
      {initials}
    </div>
  );
}

/* ---------------------- Word Learning / Definition ---------------------- */

function WordDefinitionTooltip({ word, definition, onClose, position }) {
  if (!definition) return null;
  
  return (
    <div 
      className="word-tooltip"
      style={{ 
        left: position.x, 
        top: position.y,
        transform: 'translate(-50%, -100%)'
      }}
    >
      <div className="word-tooltip-header">
        <Brain size={16} />
        <span className="word-tooltip-word">{word}</span>
        <button className="word-tooltip-close" onClick={onClose}>
          <X size={14} />
        </button>
      </div>
      <p className="word-tooltip-definition">{definition}</p>
      <div className="word-tooltip-footer">
        <Lightbulb size={12} />
        <span>Tap to remember</span>
      </div>
    </div>
  );
}

/* ---------------------------- Memory Card ---------------------------- */

function MemoryCard({ memory, onOpen, size = "md" }) {
  const place = memory.place ? placeById(memory.place) : null;
  const people = memory.people.map(personById).filter(Boolean);
  
  return (
    <button className={`memory-card memory-card-${size}`} onClick={() => onOpen(memory)}>
      {memory.media[0] ? (
        <div className="memory-card-img" style={{ backgroundImage: `url(${memory.media[0].url})` }}>
          <span className="memory-card-tag" style={{ background: CATEGORY_COLOR[memory.category] }}>
            {memory.category}
          </span>
          {memory.mood && (
            <span className="memory-card-mood">{MOOD_EMOJI[memory.mood]}</span>
          )}
        </div>
      ) : (
        <div className="memory-card-img memory-card-img-empty">
          <span className="memory-card-tag" style={{ background: CATEGORY_COLOR[memory.category] }}>
            {memory.category}
          </span>
        </div>
      )}
      <div className="memory-card-body">
        <h3>{memory.title}</h3>
        <p className="memory-card-date">
          {fmtRange(memory.date, memory.dateEnd)}
          {place && <span className="memory-card-place"> · {place.name}</span>}
        </p>
        <p className="memory-card-desc">{memory.description}</p>
        {people.length > 0 && (
          <div className="memory-card-people">
            {people.slice(0, 4).map(p => <Avatar key={p.id} person={p} size={26} />)}
            {people.length > 4 && <span className="memory-card-people-more">+{people.length - 4}</span>}
          </div>
        )}
      </div>
    </button>
  );
}

/* ------------------------------ Sidebar ------------------------------ */

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "memories", label: "My Memories", icon: BookOpen },
  { id: "map", label: "Memory Map", icon: Share2 },
  { id: "people", label: "People", icon: UsersIcon },
  { id: "timeline", label: "Timeline", icon: Clock },
  { id: "recap", label: "Weekly Recap", icon: CalendarDays },
  { id: "add", label: "Add Memory", icon: PlusCircle },
];

function Sidebar({ view, setView, collapsed, setCollapsed }) {
  return (
    <nav className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-header">
        <button 
          className="sidebar-toggle" 
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
        {!collapsed && (
          <div className="sidebar-brand">
            <div className="brand-mark">🧠</div>
            <span>Brainheimer</span>
          </div>
        )}
        {collapsed && (
          <div className="sidebar-brand-compact">
            <div className="brand-mark">🧠</div>
          </div>
        )}
      </div>
      
      <div className="sidebar-items">
        {NAV_ITEMS.map(item => (
          <button 
            key={item.id} 
            className={`sidebar-item ${view === item.id ? "active" : ""}`} 
            onClick={() => setView(item.id)}
          >
            <item.icon size={20} strokeWidth={1.8} />
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </div>
      
      <div className="sidebar-footer">
        <button className={`sidebar-item ${view === "settings" ? "active" : ""}`} onClick={() => setView("settings")}>
          <SettingsIcon size={20} strokeWidth={1.8} />
          {!collapsed && <span>Settings</span>}
        </button>
      </div>
    </nav>
  );
}

function MobileNav({ view, setView }) {
  const items = NAV_ITEMS.filter(i => ["home","memories","map","people","recap"].includes(i.id));
  return (
    <nav className="mobile-nav">
      {items.map(item => (
        <button key={item.id} className={`mobile-nav-item ${view === item.id ? "active" : ""}`} onClick={() => setView(item.id)}>
          <item.icon size={21} strokeWidth={1.8} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

/* ----------------------------- Top bar ----------------------------- */

function TopBar({ onSearch, query, setQuery, onAdd }) {
  return (
    <div className="topbar">
      <div className="topbar-search">
        <Search size={18} strokeWidth={2} />
        <input
          placeholder="Search people, places, memories..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {query && <button onClick={() => setQuery("")}><X size={16} /></button>}
      </div>
      <button className="btn btn-primary topbar-add" onClick={onAdd}>
        <PlusCircle size={18} /> Add Memory
      </button>
    </div>
  );
}

function SearchResults({ query, memories, onOpenMemory, onOpenPerson, onClose }) {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  const people = PEOPLE.filter(p => p.name.toLowerCase().includes(q) || p.relationship.toLowerCase().includes(q));
  const places = PLACES.filter(p => p.name.toLowerCase().includes(q));
  const mems = memories.filter(m => m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q) || m.tags.some(t => t.includes(q)));
  const nothing = people.length === 0 && places.length === 0 && mems.length === 0;
  return (
    <div className="search-panel">
      {nothing && <p className="search-empty">No matches for “{query}”. Try a different name or place.</p>}
      {people.length > 0 && (
        <div className="search-group">
          <h4>People</h4>
          {people.map(p => (
            <button key={p.id} className="search-row" onClick={() => { onOpenPerson(p); onClose(); }}>
              <Avatar person={p} size={32} /> <span>{p.name}</span><span className="muted">{p.relationship}</span>
            </button>
          ))}
        </div>
      )}
      {places.length > 0 && (
        <div className="search-group">
          <h4>Places</h4>
          {places.map(p => (
            <div key={p.id} className="search-row"><MapPin size={18} /> <span>{p.name}</span></div>
          ))}
        </div>
      )}
      {mems.length > 0 && (
        <div className="search-group">
          <h4>Memories</h4>
          {mems.map(m => (
            <button key={m.id} className="search-row" onClick={() => { onOpenMemory(m); onClose(); }}>
              <Clock size={18} /> <span>{m.title}</span><span className="muted">{fmtDate(m.date, { withYear: true })}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------- Text with Long Press ---------------------------- */

function TextWithLearning({ children, className = "" }) {
  const [pressTimer, setPressTimer] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const wordRef = useRef(null);
  
  const handleMouseDown = (e, word) => {
    const timer = setTimeout(() => {
      const rect = e.currentTarget.getBoundingClientRect();
      const definition = WORD_DEFINITIONS[word.toLowerCase()];
      if (definition) {
        setTooltip({ word, definition });
        setPosition({
          x: rect.left + rect.width / 2,
          y: rect.top
        });
      }
    }, 2000); // 2 second hold
    setPressTimer(timer);
  };
  
  const handleMouseUp = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };
  
  const handleMouseLeave = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };
  
  // Split text into words and wrap each with long-press handler
  const renderText = (text) => {
    if (!text) return text;
    return text.split(/\s+/).map((word, index) => {
      const cleanWord = word.replace(/[.,!?;:]/g, '');
      const hasDefinition = WORD_DEFINITIONS[cleanWord.toLowerCase()];
      if (hasDefinition) {
        return (
          <span
            key={index}
            className="learnable-word"
            onMouseDown={(e) => handleMouseDown(e, cleanWord)}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={(e) => {
              const touch = e.touches[0];
              const timer = setTimeout(() => {
                const rect = e.currentTarget.getBoundingClientRect();
                const definition = WORD_DEFINITIONS[cleanWord.toLowerCase()];
                if (definition) {
                  setTooltip({ word: cleanWord, definition });
                  setPosition({
                    x: rect.left + rect.width / 2,
                    y: rect.top
                  });
                }
              }, 2000);
              setPressTimer(timer);
            }}
            onTouchEnd={handleMouseUp}
            onTouchCancel={handleMouseLeave}
          >
            {word}
          </span>
        );
      }
      return <span key={index}>{word} </span>;
    });
  };
  
  return (
    <div className={`text-with-learning ${className}`} ref={wordRef}>
      {typeof children === 'string' ? renderText(children) : children}
      {tooltip && (
        <WordDefinitionTooltip
          word={tooltip.word}
          definition={tooltip.definition}
          onClose={() => setTooltip(null)}
          position={position}
        />
      )}
    </div>
  );
}

/* ------------------------------ Home view ------------------------------ */

function HomeView({ memories, onOpenMemory, onGoMap }) {
  const recent = [...memories].sort((a, b) => b.date - a.date).slice(0, 6);
  const stats = {
    total: memories.length,
    people: new Set(memories.flatMap(m => m.people)).size,
    places: new Set(memories.map(m => m.place).filter(Boolean)).size,
  };
  
  return (
    <div className="view">
      <Reveal>
        <div className="home-header">
          <h1 className="page-title">{greeting()}, James.</h1>
          <p className="page-subtitle">Your memories are waiting for you.</p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="home-stats">
          <div className="stat-card">
            <BookOpen size={24} />
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Memories</span>
          </div>
          <div className="stat-card">
            <UsersIcon size={24} />
            <span className="stat-number">{stats.people}</span>
            <span className="stat-label">People</span>
          </div>
          <div className="stat-card">
            <MapPin size={24} />
            <span className="stat-number">{stats.places}</span>
            <span className="stat-label">Places</span>
          </div>
        </div>
      </Reveal>

      <Reveal delay={140} className="today-card">
        <div className="today-head">
          <CalendarDays size={20} />
          <span>{fmtDate(TODAY, { withWeekday: true })}</span>
        </div>
        <p className="today-lead">Today's gentle rhythm</p>
        <ul className="today-list">
          {TODAY_ITEMS.map((it, i) => (
            <li key={i}>
              <span className="today-time">{it.time}</span>
              <span className="today-title">{it.title}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      <div className="section-head">
        <Reveal><h2>Recent memories</h2></Reveal>
        <button className="link-btn" onClick={onGoMap}>
          See them on the map <ChevronRight size={16} />
        </button>
      </div>
      
      <div className="card-grid">
        {recent.map((m, i) => (
          <Reveal key={m.id} delay={i * 60}>
            <MemoryCard memory={m} onOpen={onOpenMemory} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------- Memories view ---------------------------- */

function MemoriesView({ memories, onOpenMemory }) {
  const [filter, setFilter] = useState("All");
  const cats = ["All", ...Array.from(new Set(memories.map(m => m.category)))];
  const shown = filter === "All" ? memories : memories.filter(m => m.category === filter);
  const sorted = [...shown].sort((a, b) => b.date - a.date);
  
  return (
    <div className="view">
      <Reveal><h1 className="page-title">My Memories</h1></Reveal>
      <Reveal delay={60}><p className="page-subtitle">Everything you've chosen to remember.</p></Reveal>
      
      <div className="filter-row">
        {cats.map(c => (
          <button key={c} className={`chip ${filter === c ? "chip-active" : ""}`} onClick={() => setFilter(c)}>
            {c}
          </button>
        ))}
      </div>
      
      <div className="card-grid">
        {sorted.map((m, i) => (
          <Reveal key={m.id} delay={Math.min(i, 8) * 50}>
            <MemoryCard memory={m} onOpen={onOpenMemory} />
          </Reveal>
        ))}
      </div>
      
      {sorted.length === 0 && (
        <div className="empty-state">
          <BookOpen size={48} />
          <p>No memories in this category yet.</p>
        </div>
      )}
    </div>
  );
}

/* ---------------------------- Memory detail ---------------------------- */

function MemoryDetail({ memory, memories, onClose, onOpenMemory, onOpenPerson }) {
  const place = memory.place ? placeById(memory.place) : null;
  const people = memory.people.map(personById).filter(Boolean);
  const connected = (memory.connections || []).map(id => memoryById(id, memories)).filter(Boolean);
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal detail-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        
        <div className="detail-hero" style={{ backgroundImage: memory.media[0] ? `url(${memory.media[0].url})` : undefined }}>
          <span className="detail-hero-tag" style={{ background: CATEGORY_COLOR[memory.category] }}>
            {memory.category}
          </span>
          {memory.mood && (
            <span className="detail-hero-mood">{MOOD_EMOJI[memory.mood]}</span>
          )}
        </div>
        
        <div className="detail-body">
          <Reveal><h1>{memory.title}</h1></Reveal>
          
          <Reveal delay={60}>
            <p className="detail-meta">
              {fmtRange(memory.date, memory.dateEnd)}
              {place && <> · <MapPin size={14} style={{ verticalAlign: "-2px" }} /> {place.name}</>}
            </p>
          </Reveal>
          
          <Reveal delay={100}>
            <TextWithLearning className="detail-desc">
              {memory.description}
            </TextWithLearning>
          </Reveal>

          {memory.media.length > 0 && (
            <Reveal delay={140}>
              <h4 className="detail-h4">Memories from this moment</h4>
              <div className="media-strip">
                {memory.media.map((m, i) => (
                  <div key={i} className="media-thumb">
                    {m.type === "video" ? (
                      <div className="media-video-placeholder"><Play size={22} /></div>
                    ) : (
                      <img src={m.url} alt={m.caption} loading="lazy" />
                    )}
                    <span>{m.caption}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          {people.length > 0 && (
            <Reveal delay={180}>
              <h4 className="detail-h4">People</h4>
              <div className="people-row">
                {people.map(p => (
                  <button key={p.id} className="people-chip" onClick={() => onOpenPerson(p)}>
                    <Avatar person={p} size={30} /> {p.name}
                  </button>
                ))}
              </div>
            </Reveal>
          )}

          {connected.length > 0 && (
            <Reveal delay={240}>
              <h4 className="detail-h4">Connected memories</h4>
              <div className="connected-list">
                {connected.map(c => (
                  <button key={c.id} className="connected-row" onClick={() => onOpenMemory(c)}>
                    <ArrowRight size={15} /> {c.title}
                  </button>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ People view ------------------------------ */

function PeopleView({ memories, onOpenPerson }) {
  return (
    <div className="view">
      <Reveal><h1 className="page-title">People</h1></Reveal>
      <Reveal delay={60}><p className="page-subtitle">The people who matter most in your life.</p></Reveal>
      
      <div className="people-grid">
        {PEOPLE.map((p, i) => {
          const count = memories.filter(m => m.people.includes(p.id)).length;
          return (
            <Reveal key={p.id} delay={i * 40}>
              <button className="person-card" onClick={() => onOpenPerson(p)}>
                <Avatar person={p} size={64} />
                <h3>{p.name}</h3>
                <p className="muted">{p.relationship}</p>
                <p className="person-count">{count} {count === 1 ? "memory" : "memories"} together</p>
              </button>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

function PersonProfile({ person, memories, onClose, onOpenMemory, onRemember }) {
  const related = memories.filter(m => m.people.includes(person.id)).sort((a, b) => b.date - a.date);
  const places = Array.from(new Set(related.map(m => m.place).filter(Boolean))).map(placeById);
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal profile-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        
        <div className="profile-head">
          <Avatar person={person} size={84} />
          <h1>{person.name}</h1>
          <p className="muted">{person.relationship}</p>
          <TextWithLearning className="detail-desc" style={{ maxWidth: 480 }}>
            {person.desc}
          </TextWithLearning>
          <p className="person-count">You have {related.length} {related.length === 1 ? "memory" : "memories"} together.</p>
          <button className="btn btn-secondary" onClick={() => onRemember(person)}>
            Remember mode
          </button>
        </div>
        
        <h4 className="detail-h4">Recent memories</h4>
        <div className="card-grid card-grid-tight">
          {related.slice(0, 6).map(m => (
            <MemoryCard key={m.id} memory={m} onOpen={onOpenMemory} size="sm" />
          ))}
        </div>
        
        {places.length > 0 && (
          <>
            <h4 className="detail-h4">Connected places</h4>
            <div className="people-row">
              {places.map(pl => (
                <span key={pl.id} className="people-chip">
                  <MapPin size={16} /> {pl.name}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ Remember mode ------------------------------ */

function RememberMode({ person, memories, onClose }) {
  const related = memories.filter(m => m.people.includes(person.id)).sort((a, b) => b.date - a.date);
  const [stage, setStage] = useState(0);
  const highlight = related[0];
  
  return (
    <div className="modal-overlay recall-overlay" onClick={onClose}>
      <div className="recall-panel" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={22} /></button>
        
        {stage === 0 && (
          <div className="recall-stage">
            <Avatar person={person} size={140} />
            <h1 className="recall-question">Who is {person.name}?</h1>
            <p className="recall-answer">{person.name} is your {person.relationship.toLowerCase()}.</p>
            <button className="btn btn-primary btn-xl" onClick={() => setStage(1)}>Continue</button>
          </div>
        )}
        
        {stage === 1 && highlight && (
          <div className="recall-stage">
            {highlight.media[0] && (
              <img className="recall-photo" src={highlight.media[0].url} alt="" />
            )}
            <p className="recall-answer">
              You spent time together: <strong>{highlight.title}</strong>, {fmtDate(highlight.date)}.
            </p>
            <p className="recall-question-sm">Would you like to see more memories with {person.name}?</p>
            <div className="recall-choices">
              <button className="btn btn-primary btn-xl" onClick={() => setStage(2)}>Yes</button>
              <button className="btn btn-secondary btn-xl" onClick={onClose}>Not now</button>
            </div>
          </div>
        )}
        
        {stage === 2 && (
          <div className="recall-stage">
            <h2 className="recall-question-sm">Memories with {person.name}</h2>
            <div className="recall-list">
              {related.map(m => (
                <div key={m.id} className="recall-list-item">
                  <span>{m.title}</span>
                  <span className="muted">{fmtDate(m.date, { withYear: true })}</span>
                </div>
              ))}
            </div>
            <button className="btn btn-secondary btn-xl" onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ Timeline view ------------------------------ */

function TimelineView({ memories, onOpenMemory }) {
  const byYear = useMemo(() => {
    const groups = {};
    [...memories].sort((a, b) => b.date - a.date).forEach(m => {
      const y = m.date.getFullYear();
      const mo = MONTHS[m.date.getMonth()];
      groups[y] = groups[y] || {};
      groups[y][mo] = groups[y][mo] || [];
      groups[y][mo].push(m);
    });
    return groups;
  }, [memories]);
  const years = Object.keys(byYear).sort((a, b) => b - a);

  return (
    <div className="view">
      <Reveal><h1 className="page-title">Timeline</h1></Reveal>
      <Reveal delay={60}><p className="page-subtitle">Your life, in order.</p></Reveal>
      
      <div className="timeline">
        {years.map(y => (
          <div key={y} className="timeline-year-block">
            <Reveal><h2 className="timeline-year">{y}</h2></Reveal>
            {Object.keys(byYear[y]).map(mo => (
              <div key={mo} className="timeline-month-block">
                <Reveal><h3 className="timeline-month">{mo}</h3></Reveal>
                <div className="timeline-items">
                  {byYear[y][mo].map((m, i) => (
                    <Reveal key={m.id} delay={i * 60}>
                      <button className="timeline-item" onClick={() => onOpenMemory(m)}>
                        <span className="timeline-dot" style={{ background: CATEGORY_COLOR[m.category] }} />
                        <span className="timeline-item-title">{m.title}</span>
                        <span className="muted">{m.date.getDate()}</span>
                      </button>
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ Weekly recap ------------------------------ */

function startOfWeek(dt) {
  const d2 = new Date(dt);
  const day = d2.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d2.setDate(d2.getDate() + diff);
  d2.setHours(0, 0, 0, 0);
  return d2;
}

function WeeklyRecapView({ memories, onOpenMemory }) {
  const monday = startOfWeek(new Date(2026, 7, 9));
  const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6);
  const weekMemories = memories.filter(m => m.date >= monday && m.date <= sunday);
  const byDay = {};
  weekMemories.forEach(m => {
    const key = DAYS[m.date.getDay()];
    byDay[key] = byDay[key] || [];
    byDay[key].push(m);
  });
  const peopleSeen = new Set(weekMemories.flatMap(m => m.people)).size;
  const placesSeen = new Set(weekMemories.map(m => m.place).filter(Boolean)).size;

  return (
    <div className="view">
      <Reveal><h1 className="page-title">Your week in memories</h1></Reveal>
      <Reveal delay={60}><p className="page-subtitle">{fmtRange(monday, sunday)}</p></Reveal>
      
      <Reveal delay={100} className="recap-narrative">
        <p>
          You spent time with {peopleSeen} of the people closest to you, 
          visited {placesSeen} familiar places, and enjoyed several quiet moments at home.
        </p>
      </Reveal>
      
      <div className="recap-days">
        {DAYS.slice(1).concat(DAYS[0]).map((day, i) => {
          const items = byDay[day];
          if (!items) return null;
          return (
            <Reveal key={day} delay={i * 70} className="recap-day">
              <div className="recap-day-label">{day}</div>
              <div className="recap-day-items">
                {items.map(m => (
                  <button key={m.id} className="recap-item" onClick={() => onOpenMemory(m)}>
                    {m.media[0] && <img src={m.media[0].url} alt="" loading="lazy" />}
                    <div>
                      <p className="recap-item-title">{m.title}</p>
                      <p className="muted">{m.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------ Add memory wizard ------------------------------ */

const MEMORY_KINDS = ["Person", "Place", "Event", "Experience", "Routine", "Important date", "Other"];

function AddMemoryWizard({ memories, onClose, onSave }) {
  const [step, setStep] = useState(0);
  const [kind, setKind] = useState(null);
  const [form, setForm] = useState({
    title: "", description: "", date: "", location: "", people: "", tags: "",
    media: [], connections: [], mood: "content"
  });
  const [saved, setSaved] = useState(false);

  const suggestions = useMemo(() => {
    if (!form.title && !form.people) return [];
    const q = (form.title + " " + form.people).toLowerCase();
    return memories.filter(m => q.split(/[\s,]+/).some(w => w.length > 2 && m.title.toLowerCase().includes(w))).slice(0, 4);
  }, [form.title, form.people, memories]);

  function update(field, value) { setForm(f => ({ ...f, [field]: value })); }

  function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    const items = files.map(f => ({
      type: f.type.startsWith("video") ? "video" : "image",
      url: URL.createObjectURL(f), caption: f.name,
    }));
    setForm(f => ({ ...f, media: [...f.media, ...items] }));
  }

  function toggleConnection(id) {
    setForm(f => ({ ...f, connections: f.connections.includes(id) ? f.connections.filter(c => c !== id) : [...f.connections, id] }));
  }

  function save() {
    const memory = {
      id: "user-" + Date.now(),
      title: form.title || "Untitled memory",
      category: kind === "Person" ? "Event" : (kind || "Event"),
      date: form.date ? new Date(form.date) : new Date(),
      place: null,
      people: form.people ? form.people.split(",").map(s => s.trim()).filter(Boolean) : [],
      description: form.description,
      tags: form.tags ? form.tags.split(",").map(s => s.trim()).filter(Boolean) : [],
      media: form.media,
      connections: form.connections,
      locationName: form.location,
      mood: form.mood
    };
    onSave(memory);
    setSaved(true);
    setTimeout(onClose, 1400);
  }

  const steps = ["What to remember", "Tell us about it", "Add memories", "Connect", "Preview"];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal wizard-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        
        {saved ? (
          <div className="wizard-saved">
            <div className="check-circle"><Check size={30} /></div>
            <h2>Memory saved</h2>
            <p className="muted">It's already appearing on your memory map.</p>
          </div>
        ) : (
          <>
            <div className="wizard-progress">
              {steps.map((s, i) => (
                <div key={s} className={`wizard-step-dot ${i <= step ? "done" : ""}`}>
                  {i + 1}
                </div>
              ))}
            </div>

            {step === 0 && (
              <div className="wizard-step">
                <h2>What do you want to remember?</h2>
                <div className="kind-grid">
                  {MEMORY_KINDS.map(k => (
                    <button 
                      key={k} 
                      className={`kind-card ${kind === k ? "kind-card-active" : ""}`} 
                      onClick={() => setKind(k)}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="wizard-step">
                <h2>Tell us about it.</h2>
                <label>
                  Title
                  <input 
                    value={form.title} 
                    onChange={e => update("title", e.target.value)} 
                    placeholder="e.g. Sunday lunch with Maria" 
                  />
                </label>
                <label>
                  Description
                  <textarea 
                    value={form.description} 
                    onChange={e => update("description", e.target.value)} 
                    rows={3} 
                    placeholder="What happened? Who was there?" 
                  />
                </label>
                <div className="wizard-row">
                  <label>
                    Date
                    <input type="date" value={form.date} onChange={e => update("date", e.target.value)} />
                  </label>
                  <label>
                    Location
                    <input value={form.location} onChange={e => update("location", e.target.value)} placeholder="e.g. Family Home" />
                  </label>
                </div>
                <label>
                  People (comma separated)
                  <input value={form.people} onChange={e => update("people", e.target.value)} placeholder="maria, daniel" />
                </label>
                <label>
                  Tags (comma separated)
                  <input value={form.tags} onChange={e => update("tags", e.target.value)} placeholder="family, food" />
                </label>
                <label>
                  How did this feel?
                  <select value={form.mood} onChange={e => update("mood", e.target.value)}>
                    <option value="joyful">Joyful ✨</option>
                    <option value="content">Content 😊</option>
                    <option value="peaceful">Peaceful 🌿</option>
                    <option value="celebratory">Celebratory 🎉</option>
                    <option value="warm">Warm ☀️</option>
                    <option value="proud">Proud 🌟</option>
                    <option value="adventurous">Adventurous 🗺️</option>
                  </select>
                </label>
              </div>
            )}

            {step === 2 && (
              <div className="wizard-step">
                <h2>Add memories.</h2>
                <p className="muted">Attach photos or videos of this moment.</p>
                <label className="upload-box">
                  <Upload size={22} />
                  <span>Choose photos or videos</span>
                  <input type="file" accept="image/*,video/*" multiple onChange={handleFiles} style={{ display: "none" }} />
                </label>
                {form.media.length > 0 && (
                  <div className="media-strip">
                    {form.media.map((m, i) => (
                      <div key={i} className="media-thumb">
                        {m.type === "video" ? (
                          <div className="media-video-placeholder"><Video size={20} /></div>
                        ) : (
                          <img src={m.url} alt="" />
                        )}
                        <span>{m.caption}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="wizard-step">
                <h2>Connect this memory.</h2>
                <p className="muted">This looks like it could be connected to:</p>
                <div className="connect-suggest">
                  {(suggestions.length ? suggestions : memories.slice(0, 4)).map(m => (
                    <button 
                      key={m.id} 
                      className={`connect-chip ${form.connections.includes(m.id) ? "connect-chip-active" : ""}`} 
                      onClick={() => toggleConnection(m.id)}
                    >
                      <Link2 size={14} /> {m.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="wizard-step">
                <h2>Preview</h2>
                <div className="preview-card">
                  <h3>{form.title || "Untitled memory"}</h3>
                  <p className="muted">
                    {form.date || "No date"} 
                    {form.location && ` · ${form.location}`}
                    {form.mood && ` · ${MOOD_EMOJI[form.mood]} ${form.mood}`}
                  </p>
                  <p>{form.description}</p>
                  {form.people && <p className="muted">With: {form.people}</p>}
                  {form.tags && <p className="muted">Tags: {form.tags}</p>}
                  <p className="muted">{form.media.length} attachment(s), {form.connections.length} connection(s)</p>
                </div>
              </div>
            )}

            <div className="wizard-nav">
              <button 
                className="btn btn-secondary" 
                disabled={step === 0} 
                onClick={() => setStep(s => s - 1)}
              >
                <ArrowLeft size={16} /> Back
              </button>
              {step < 4 ? (
                <button 
                  className="btn btn-primary" 
                  onClick={() => setStep(s => s + 1)} 
                  disabled={step === 0 && !kind}
                >
                  Next <ArrowRight size={16} />
                </button>
              ) : (
                <button className="btn btn-primary" onClick={save}>
                  Save Memory
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ Memory Map (graph) ------------------------------ */

function buildGraph(memories) {
  const nodes = [];
  const nodeIndex = {};
  function addNode(id, type, label, data) {
    if (nodeIndex[id] !== undefined) return nodeIndex[id];
    nodeIndex[id] = nodes.length;
    nodes.push({ id, type, label, data });
    return nodeIndex[id];
  }
  PEOPLE.forEach(p => addNode("p:" + p.id, "person", p.name, p));
  PLACES.forEach(pl => addNode("l:" + pl.id, "place", pl.name, pl));
  memories.forEach(m => addNode("m:" + m.id, "memory", m.title, m));

  const links = [];
  const seen = new Set();
  function addLink(a, b) {
    if (nodeIndex[a] === undefined || nodeIndex[b] === undefined) return;
    const key = [a, b].sort().join("|");
    if (seen.has(key)) return;
    seen.add(key);
    links.push({ source: a, target: b });
  }
  memories.forEach(m => {
    m.people.forEach(pid => addLink("m:" + m.id, "p:" + pid));
    if (m.place) addLink("m:" + m.id, "l:" + m.place);
    (m.connections || []).forEach(cid => addLink("m:" + m.id, "m:" + cid));
  });
  return { nodes, links };
}

const THREE_NODE_STYLE = {
  person: { color: 0x4a6fa5, hover: 0xe8a87c, r: 15 },
  place: { color: 0xe8a87c, hover: 0xe8a87c, r: 12.5 },
  memory: { color: 0x2d2d44, hover: 0xe8a87c, r: 11 },
};

function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return h;
}

function MemoryMapView({ memories, onOpenMemory, onOpenPerson }) {
  const { nodes: rawNodes, links: rawLinks } = useMemo(() => buildGraph(memories), [memories]);
  const containerRef = useRef(null);
  const labelsRef = useRef({});
  const threeRef = useRef({});
  const [selected, setSelected] = useState(null);
  const [typeFilter, setTypeFilter] = useState({ person: true, place: true, memory: true });
  const [labelNodes, setLabelNodes] = useState([]);
  const selectedRef = useRef(null);
  useEffect(() => { selectedRef.current = selected; }, [selected]);

  const selectedNode = selected ? rawNodes.find(n => n.id === selected) : null;
  const connectedIds = useMemo(() => {
    if (!selected) return null;
    const s = new Set([selected]);
    rawLinks.forEach(l => {
      if (l.source === selected) s.add(l.target);
      if (l.target === selected) s.add(l.source);
    });
    return s;
  }, [selected, rawLinks]);
  const connectedRef = useRef(null);
  useEffect(() => { connectedRef.current = connectedIds; }, [connectedIds]);

  // ---- one-time Three.js scene setup ----
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.touchAction = "none";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, 1, 1, 6000);
    scene.add(new THREE.AmbientLight(0x404060, 0.5));
    const dir1 = new THREE.DirectionalLight(0xffffff, 0.4);
    dir1.position.set(200, 260, 320);
    scene.add(dir1);
    const dir2 = new THREE.DirectionalLight(0x8a7a6a, 0.3);
    dir2.position.set(-260, -120, -200);
    scene.add(dir2);

    const controls = { theta: 0.7, phi: 1.15, radius: 560, target: new THREE.Vector3(0, 0, 0), autoRotate: true, lastInteract: 0 };

    function updateCamera() {
      const { theta, phi, radius, target } = controls;
      camera.position.x = target.x + radius * Math.sin(phi) * Math.sin(theta);
      camera.position.y = target.y + radius * Math.cos(phi);
      camera.position.z = target.z + radius * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(target);
    }
    updateCamera();

    function resize() {
      const w = container.clientWidth, h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    const dragPlane = new THREE.Plane();
    const dragPoint = new THREE.Vector3();

    let mode = null;
    let dragMesh = null;
    let downX = 0, downY = 0, moved = false;

    function ndcFromEvent(e) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }
    function pickMesh(e) {
      ndcFromEvent(e);
      raycaster.setFromCamera(pointerNdc, camera);
      const meshes = Object.values(threeRef.current.nodeMeshes || {}).filter(m => m.visible);
      const hits = raycaster.intersectObjects(meshes);
      return hits.length ? hits[0].object : null;
    }

    function onPointerDown(e) {
      downX = e.clientX; downY = e.clientY; moved = false;
      controls.autoRotate = false; controls.lastInteract = performance.now();
      const hit = pickMesh(e);
      if (hit) {
        mode = "node"; dragMesh = hit;
        const normal = new THREE.Vector3().subVectors(camera.position, hit.position).normalize();
        dragPlane.setFromNormalAndCoplanarPoint(normal, hit.position);
      } else {
        mode = "orbit";
      }
      renderer.domElement.setPointerCapture?.(e.pointerId);
    }
    function onPointerMove(e) {
      if (mode === "orbit") {
        const dx = e.clientX - downX, dy = e.clientY - downY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
        controls.theta -= dx * 0.0055;
        controls.phi = Math.min(2.7, Math.max(0.35, controls.phi - dy * 0.0055));
        downX = e.clientX; downY = e.clientY;
      } else if (mode === "node" && dragMesh) {
        moved = true;
        ndcFromEvent(e);
        raycaster.setFromCamera(pointerNdc, camera);
        if (raycaster.ray.intersectPlane(dragPlane, dragPoint)) {
          dragMesh.position.copy(dragPoint);
        }
      }
    }
    function onPointerUp(e) {
      if (!moved) {
        const hit = pickMesh(e);
        setSelected(hit ? hit.userData.id : null);
      }
      mode = null; dragMesh = null;
      controls.lastInteract = performance.now();
    }
    function onDoubleClick(e) {
      const hit = pickMesh(e);
      if (!hit) return;
      const n = hit.userData.nodeData;
      if (hit.userData.type === "memory") onOpenMemory(n);
      if (hit.userData.type === "person") onOpenPerson(n);
    }
    function onWheel(e) {
      e.preventDefault();
      controls.autoRotate = false; controls.lastInteract = performance.now();
      controls.radius = Math.min(1400, Math.max(180, controls.radius + e.deltaY * 0.4));
    }

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("dblclick", onDoubleClick);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

    let raf;
    const clock = new THREE.Clock();
    function animate() {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (controls.autoRotate) controls.theta += 0.0011;
      else if (performance.now() - controls.lastInteract > 2600) controls.autoRotate = true;
      updateCamera();

      const nodeMeshes = threeRef.current.nodeMeshes || {};
      const edgeLines = threeRef.current.edgeLines || [];
      const sel = selectedRef.current;
      const conn = connectedRef.current;

      // Smooth animation with interpolation
      Object.values(nodeMeshes).forEach(m => {
        if (!m.userData.dragging) {
          const bob = Math.sin(t * 0.6 + m.userData.seed) * 3.2;
          m.position.y += (m.userData.baseY + bob - m.position.y) * 0.1;
        }
        const isSel = m.userData.id === sel;
        const dim = sel && !(conn && conn.has(m.userData.id));
        const targetScale = isSel ? 1.35 + Math.sin(t * 3) * 0.05 : 1;
        m.scale.setScalar(m.scale.x + (targetScale - m.scale.x) * 0.18);
        m.material.emissiveIntensity += (isSel ? 0.9 : 0.15 - m.material.emissiveIntensity) * 0.15;
        m.material.opacity += (dim ? 0.22 : 1 - m.material.opacity) * 0.15;
      });

      edgeLines.forEach(({ line, a, b, source, target }) => {
        const pos = line.geometry.attributes.position;
        pos.setXYZ(0, a.position.x, a.position.y, a.position.z);
        pos.setXYZ(1, b.position.x, b.position.y, b.position.z);
        pos.needsUpdate = true;
        line.computeLineDistances();
        line.material.dashOffset -= 0.012;
        const active = sel && (source === sel || target === sel);
        const dim = sel && !active;
        const targetColor = active ? 0xe8a87c : 0x4a4a6a;
        const currentColor = line.material.color.getHex();
        line.material.color.setHex(currentColor + (targetColor - currentColor) * 0.1);
        line.material.opacity += (dim ? 0.08 : active ? 0.9 : 0.45 - line.material.opacity) * 0.15;
      });

      // Project labels to screen space with smooth interpolation
      const labelEls = labelsRef.current;
      const rect = container.getBoundingClientRect();
      
      // Store previous positions for smoothing
      if (!threeRef.current.labelPositions) {
        threeRef.current.labelPositions = {};
      }
      const prevPositions = threeRef.current.labelPositions;

      Object.values(nodeMeshes).forEach(m => {
        const el = labelEls[m.userData.id];
        if (!el) return;
        if (!m.visible) { el.style.display = "none"; return; }
        const v = m.position.clone().project(camera);
        if (v.z > 1) { el.style.display = "none"; return; }
        
        const x = (v.x * 0.5 + 0.5) * rect.width;
        const y = (-v.y * 0.5 + 0.5) * rect.height;
        
        // Smooth interpolation for label position
        const prev = prevPositions[m.userData.id];
        if (prev) {
          const smoothX = prev.x + (x - prev.x) * 0.15;
          const smoothY = prev.y + (y - prev.y) * 0.15;
          prevPositions[m.userData.id] = { x: smoothX, y: smoothY };
          
          const scale = THREE.MathUtils.clamp(1.15 - v.z, 0.55, 1.3);
          const dim = sel && !(conn && conn.has(m.userData.id));
          el.style.display = "flex";
          el.style.transform = `translate3d(${smoothX}px, ${smoothY}px, 0) translate(-50%, ${m.userData.r * scale + 6}px) scale(${scale})`;
          el.style.opacity = dim ? 0.25 : 1;
          el.style.zIndex = String(Math.round((1 - v.z) * 1000));
        } else {
          prevPositions[m.userData.id] = { x, y };
        }
      });

      renderer.render(scene, camera);
    }
    animate();

    threeRef.current = { ...threeRef.current, renderer, scene, camera, controls };

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("dblclick", onDoubleClick);
      renderer.domElement.removeEventListener("wheel", onWheel);
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  // ---- build / rebuild node + edge meshes when the memory graph changes ----
  useEffect(() => {
    const three = threeRef.current;
    if (!three.scene) return;
    const scene = three.scene;

    // clear previous
    (Object.values(three.nodeMeshes || {})).forEach(m => { scene.remove(m); m.geometry.dispose(); m.material.dispose(); });
    (three.edgeLines || []).forEach(({ line }) => { scene.remove(line); line.geometry.dispose(); line.material.dispose(); });

    // 2D layout via d3-force
    const nodes = rawNodes.map(n => ({ ...n }));
    const links = rawLinks.map(l => ({ ...l }));
    const sim = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(n => n.id).distance(l => (l.source.type === "person" || l.target.type === "person") ? 150 : 115).strength(0.55))
      .force("charge", d3.forceManyBody().strength(-320))
      .force("center", d3.forceCenter(0, 0))
      .force("collide", d3.forceCollide(n => (THREE_NODE_STYLE[n.type]?.r || 12) + 14))
      .stop();
    for (let i = 0; i < 260; i++) sim.tick();

    const zRange = { person: -70, place: 0, memory: 70 };
    const nodeMeshes = {};
    nodes.forEach(n => {
      const style = THREE_NODE_STYLE[n.type];
      const geo = new THREE.SphereGeometry(style.r, 24, 24);
      const mat = new THREE.MeshStandardMaterial({
        color: style.color, emissive: 0xe8a87c, emissiveIntensity: 0.15,
        roughness: 0.45, metalness: 0.08, transparent: true, opacity: 1,
      });
      const mesh = new THREE.Mesh(geo, mat);
      const jitter = (hashStr(n.id) % 60) - 30;
      mesh.position.set(n.x * 0.72, -(n.y * 0.72), zRange[n.type] + jitter);
      mesh.userData = { id: n.id, type: n.type, nodeData: n.data, seed: Math.random() * 10, baseY: mesh.position.y, r: style.r };
      scene.add(mesh);
      nodeMeshes[n.id] = mesh;
    });

    const edgeLines = [];
    links.forEach(l => {
      const a = nodeMeshes[l.source.id || l.source];
      const b = nodeMeshes[l.target.id || l.target];
      if (!a || !b) return;
      const geo = new THREE.BufferGeometry().setFromPoints([a.position.clone(), b.position.clone()]);
      const mat = new THREE.LineDashedMaterial({ color: 0x4a4a6a, dashSize: 6, gapSize: 4, transparent: true, opacity: 0.45 });
      const line = new THREE.Line(geo, mat);
      line.computeLineDistances();
      scene.add(line);
      edgeLines.push({ line, a, b, source: a.userData.id, target: b.userData.id });
    });

    threeRef.current = { ...three, nodeMeshes, edgeLines, labelPositions: {} };
    setLabelNodes(nodes.map(n => ({ id: n.id, type: n.type, label: n.label })));
  }, [rawNodes, rawLinks]);

  // ---- filter visibility ----
  useEffect(() => {
    const meshes = threeRef.current.nodeMeshes || {};
    Object.values(meshes).forEach(m => { m.visible = !!typeFilter[m.userData.type]; });
  }, [typeFilter, labelNodes]);

  function zoomBtn(delta) {
    const c = threeRef.current.controls;
    if (!c) return;
    c.autoRotate = false; c.lastInteract = performance.now();
    c.radius = Math.min(1400, Math.max(180, c.radius + delta));
  }
  function resetView() {
    const c = threeRef.current.controls;
    if (!c) return;
    c.theta = 0.7; c.phi = 1.15; c.radius = 560; c.autoRotate = true;
    setSelected(null);
  }
  function centerView() {
    const c = threeRef.current.controls;
    if (!c) return;
    c.target.set(0, 0, 0);
  }

  return (
    <div className="view map-view">
      <Reveal><h1 className="page-title">Memory Map</h1></Reveal>
      <Reveal delay={60}><p className="page-subtitle">Explore your memories in three dimensions.</p></Reveal>

      <div className="map-toolbar">
        <div className="map-filters">
          <Filter size={16} />
          {["person", "place", "memory"].map(t => (
            <button 
              key={t} 
              className={`chip chip-sm ${typeFilter[t] ? "chip-active" : ""}`} 
              onClick={() => setTypeFilter(f => ({ ...f, [t]: !f[t] }))}
            >
              {t === "person" ? "People" : t === "place" ? "Places" : "Memories"}
            </button>
          ))}
        </div>
        <div className="map-controls">
          <button onClick={() => zoomBtn(-90)} aria-label="Zoom in"><ZoomIn size={17} /></button>
          <button onClick={() => zoomBtn(90)} aria-label="Zoom out"><ZoomOut size={17} /></button>
          <button onClick={centerView} aria-label="Center graph"><Maximize2 size={17} /></button>
          <button onClick={resetView} aria-label="Reset"><RotateCcw size={17} /></button>
        </div>
      </div>

      <div className="map-canvas map-canvas-3d" ref={containerRef}>
        <div className="map-labels">
          {labelNodes.map(n => (
            <div
              key={n.id}
              className={`map-node-label-3d map-node-label-3d-${n.type}`}
              ref={el => { if (el) labelsRef.current[n.id] = el; else delete labelsRef.current[n.id]; }}
            >
              {n.label}
            </div>
          ))}
        </div>
      </div>

      {selectedNode && (
        <div className="map-panel">
          <button className="modal-close" onClick={() => setSelected(null)}><X size={18} /></button>
          {selectedNode.type === "memory" && (() => { const m = selectedNode.data; return (
            <>
              <span className="detail-hero-tag" style={{ background: CATEGORY_COLOR[m.category] }}>
                {m.category}
              </span>
              <h3>{m.title}</h3>
              <p className="muted">{fmtRange(m.date, m.dateEnd)}</p>
              <p>{m.description}</p>
              <button className="btn btn-secondary" onClick={() => onOpenMemory(m)}>
                Open memory
              </button>
            </>
          ); })()}
          {selectedNode.type === "person" && (() => { const p = selectedNode.data; return (
            <>
              <Avatar person={p} size={48} />
              <h3>{p.name}</h3>
              <p className="muted">{p.relationship}</p>
              <p>{p.desc}</p>
              <button className="btn btn-secondary" onClick={() => onOpenPerson(p)}>
                Open profile
              </button>
            </>
          ); })()}
          {selectedNode.type === "place" && (() => { const pl = selectedNode.data; return (
            <>
              <h3>{pl.name}</h3>
              <p>{pl.desc}</p>
            </>
          ); })()}
        </div>
      )}
    </div>
  );
}

/* ------------------------------ Settings ------------------------------ */

function SettingsView() {
  return (
    <div className="view">
      <Reveal><h1 className="page-title">Settings</h1></Reveal>
      <Reveal delay={60}><p className="page-subtitle">Keep Brainheimer comfortable for you.</p></Reveal>
      
      <div className="settings-list">
        <div className="settings-row">
          <span>Large text</span>
          <span className="muted">Off</span>
        </div>
        <div className="settings-row">
          <span>Reduced motion</span>
          <span className="muted">Follows system</span>
        </div>
        <div className="settings-row">
          <span>Dark mode</span>
          <span className="muted">Always on</span>
        </div>
        <div className="settings-row">
          <span>Name</span>
          <span className="muted">James</span>
        </div>
      </div>
      
      <p className="muted" style={{ marginTop: 24 }}>
        Brainheimer is a memory-assistance tool and is not a medical device. 
        It does not diagnose or treat any condition.
      </p>
    </div>
  );
}

/* ------------------------------ App shell ------------------------------ */

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');

    .brainheimer-root, .brainheimer-root * { box-sizing: border-box; }
    .brainheimer-root {
      --bg: #1a1a2e;
      --surface: #16213e;
      --surface-light: #1a2744;
      --border: #2a3a5c;
      --ink: #e8e6e3;
      --ink-muted: #8a8a9a;
      --primary: #4a6fa5;
      --primary-light: #6a8fb5;
      --secondary: #2a3a5c;
      --accent: #e8a87c;
      --coral: #d4a5b8;
      --success: #85c7a8;
      --warning: #d4b8a8;
      --shadow: rgba(0,0,0,0.6);
      font-family: 'Inter', sans-serif;
      color: var(--ink);
      background: var(--bg);
      display: flex;
      width: 100%;
      min-height: 640px;
      position: relative;
      -webkit-font-smoothing: antialiased;
    }
    
    .brainheimer-root h1, .brainheimer-root h2, .brainheimer-root h3 { 
      font-family: 'Playfair Display', serif; 
      font-weight: 600; 
      margin: 0; 
    }
    .brainheimer-root p { margin: 0; line-height: 1.6; }
    .brainheimer-root button { font-family: inherit; cursor: pointer; }
    .muted { color: var(--ink-muted); font-size: 14px; }

    /* ---- reveal animation ---- */
    .reveal { 
      opacity: 0; 
      transform: translateY(18px); 
      transition: opacity .7s cubic-bezier(.2,.7,.2,1), transform .7s cubic-bezier(.2,.7,.2,1); 
    }
    .reveal-in { opacity: 1; transform: translateY(0); }
    @media (prefers-reduced-motion: reduce) {
      .reveal { opacity: 1; transform: none; transition: none; }
      .brainheimer-root * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
    }

    /* ---- sidebar ---- */
    .sidebar { 
      width: 260px; 
      flex-shrink: 0; 
      background: var(--surface); 
      border-right: 1px solid var(--border); 
      display: flex; 
      flex-direction: column; 
      padding: 12px 10px; 
      gap: 4px;
      transition: width 0.3s ease;
    }
    .sidebar-collapsed { width: 72px; }
    .sidebar-header {
      display: flex;
      align-items: center;
      padding: 8px 12px 20px;
      gap: 8px;
    }
    .sidebar-toggle {
      background: none;
      border: none;
      color: var(--ink-muted);
      padding: 4px;
      border-radius: 6px;
      transition: background 0.2s;
    }
    .sidebar-toggle:hover { background: var(--secondary); }
    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: 'Playfair Display', serif;
      font-size: 20px;
      color: var(--ink);
      font-weight: 700;
    }
    .sidebar-brand-compact {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
    }
    .brand-mark {
      width: 32px;
      height: 32px;
      border-radius: 10px;
      background: var(--primary);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }
    .sidebar-items { 
      display: flex; 
      flex-direction: column; 
      gap: 2px; 
      flex: 1; 
    }
    .sidebar-footer {
      border-top: 1px solid var(--border);
      padding-top: 8px;
    }
    .sidebar-item { 
      display: flex; 
      align-items: center; 
      gap: 12px; 
      padding: 12px 14px; 
      border: none; 
      background: none; 
      border-radius: 12px; 
      color: var(--ink-muted); 
      font-size: 15px; 
      text-align: left; 
      transition: background .18s, color .18s; 
    }
    .sidebar-item:hover { background: var(--secondary); color: var(--ink); }
    .sidebar-item.active { background: var(--primary); color: #fff; }
    .sidebar-collapsed .sidebar-item { justify-content: center; padding: 12px; }

    /* ---- mobile nav ---- */
    .mobile-nav { display: none; }
    @media (max-width: 860px) {
      .sidebar { display: none; }
      .mobile-nav { 
        display: flex; 
        position: fixed; 
        bottom: 0; 
        left: 0; 
        right: 0; 
        background: var(--surface); 
        border-top: 1px solid var(--border); 
        padding: 6px 4px 10px; 
        justify-content: space-around; 
        z-index: 40; 
      }
      .mobile-nav-item { 
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        gap: 2px; 
        background: none; 
        border: none; 
        color: var(--ink-muted); 
        font-size: 11px; 
        padding: 6px 4px; 
        border-radius: 10px; 
      }
      .mobile-nav-item.active { color: var(--primary); }
      .main-area { padding-bottom: 80px !important; }
    }

    .main-area { 
      flex: 1; 
      min-width: 0; 
      display: flex; 
      flex-direction: column; 
      height: 100%; 
      overflow-y: auto; 
      padding: 24px 34px 60px; 
    }

    /* ---- topbar ---- */
    .topbar { 
      display: flex; 
      gap: 14px; 
      align-items: center; 
      margin-bottom: 8px; 
      position: relative; 
    }
    .topbar-search { 
      flex: 1; 
      display: flex; 
      align-items: center; 
      gap: 8px; 
      background: var(--surface); 
      border: 1px solid var(--border); 
      border-radius: 14px; 
      padding: 10px 14px; 
      color: var(--ink-muted); 
      max-width: 480px; 
    }
    .topbar-search input { 
      border: none; 
      outline: none; 
      flex: 1; 
      font-size: 14.5px; 
      background: none; 
      color: var(--ink); 
    }
    .topbar-search input::placeholder { color: var(--ink-muted); }
    .topbar-search button { background: none; border: none; color: var(--ink-muted); display: flex; }
    .topbar-add { white-space: nowrap; }

    .search-panel { 
      position: absolute; 
      top: 54px; 
      left: 0; 
      width: 420px; 
      max-width: 90vw; 
      background: var(--surface); 
      border: 1px solid var(--border); 
      border-radius: 16px; 
      box-shadow: 0 18px 40px var(--shadow); 
      padding: 14px; 
      z-index: 60; 
      max-height: 60vh; 
      overflow-y: auto; 
    }
    .search-group h4 { 
      font-size: 12px; 
      text-transform: uppercase; 
      letter-spacing: .04em; 
      color: var(--ink-muted); 
      margin: 10px 6px 6px; 
    }
    .search-row { 
      display: flex; 
      align-items: center; 
      gap: 10px; 
      width: 100%; 
      background: none; 
      border: none; 
      padding: 8px 6px; 
      border-radius: 10px; 
      text-align: left; 
      font-size: 14px; 
      color: var(--ink); 
    }
    .search-row:hover { background: var(--secondary); }
    .search-row .muted { margin-left: auto; }
    .search-empty { padding: 10px 6px; color: var(--ink-muted); font-size: 14px; }

    /* ---- buttons ---- */
    .btn { 
      display: inline-flex; 
      align-items: center; 
      gap: 8px; 
      padding: 10px 18px; 
      border-radius: 12px; 
      border: none; 
      font-size: 14.5px; 
      font-weight: 600; 
      transition: transform .15s, opacity .15s; 
    }
    .btn:active { transform: scale(.97); }
    .btn:disabled { opacity: .4; cursor: not-allowed; }
    .btn-primary { background: var(--primary); color: #fff; }
    .btn-primary:hover:not(:disabled) { opacity: .9; }
    .btn-secondary { background: var(--secondary); color: var(--ink); }
    .btn-secondary:hover { background: var(--border); }
    .btn-xl { padding: 15px 30px; font-size: 16px; border-radius: 16px; }
    .link-btn { 
      display: inline-flex; 
      align-items: center; 
      gap: 4px; 
      background: none; 
      border: none; 
      color: var(--primary-light); 
      font-weight: 600; 
      font-size: 14px; 
    }
    .link-btn:hover { color: var(--accent); }

    /* ---- generic view ---- */
    .view { max-width: 1100px; }
    .page-title { 
      font-size: 34px; 
      margin-bottom: 4px; 
      color: var(--ink); 
      font-weight: 700;
    }
    .page-subtitle { 
      color: var(--ink-muted); 
      font-size: 16px; 
      margin-bottom: 26px; 
    }
    .section-head { 
      display: flex; 
      align-items: baseline; 
      justify-content: space-between; 
      margin: 30px 0 14px; 
    }
    .section-head h2 { font-size: 22px; }

    /* ---- home stats ---- */
    .home-header { margin-bottom: 16px; }
    .home-stats { 
      display: grid; 
      grid-template-columns: repeat(3, 1fr); 
      gap: 12px; 
      margin-bottom: 24px; 
    }
    .stat-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 18px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }
    .stat-card svg { color: var(--primary-light); }
    .stat-number { font-size: 28px; font-weight: 700; font-family: 'Playfair Display', serif; }
    .stat-label { font-size: 13px; color: var(--ink-muted); }
    @media (max-width: 480px) {
      .home-stats { grid-template-columns: repeat(3, 1fr); gap: 8px; }
      .stat-card { padding: 12px; }
      .stat-number { font-size: 20px; }
    }

    /* ---- today card ---- */
    .today-card { 
      background: var(--surface-light); 
      border: 1px solid var(--border);
      border-radius: 20px; 
      padding: 24px 28px; 
      margin-bottom: 8px; 
    }
    .today-head { 
      display: flex; 
      align-items: center; 
      gap: 8px; 
      font-size: 14px; 
      color: var(--ink-muted); 
      margin-bottom: 8px; 
    }
    .today-lead { 
      font-family: 'Playfair Display', serif; 
      font-size: 20px; 
      margin-bottom: 14px; 
    }
    .today-list { 
      list-style: none; 
      margin: 0; 
      padding: 0; 
      display: flex; 
      flex-direction: column; 
      gap: 8px; 
    }
    .today-list li { 
      display: flex; 
      align-items: center; 
      gap: 14px; 
      background: var(--surface); 
      border: 1px solid var(--border);
      padding: 10px 14px; 
      border-radius: 12px; 
    }
    .today-time { 
      font-weight: 600; 
      font-variant-numeric: tabular-nums; 
      color: var(--primary-light);
      width: 52px; 
    }

    /* ---- card grid ---- */
    .card-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fill, minmax(260px,1fr)); 
      gap: 20px; 
    }
    .card-grid-tight { 
      grid-template-columns: repeat(auto-fill, minmax(200px,1fr)); 
      gap: 14px; 
    }
    .memory-card { 
      text-align: left; 
      background: var(--surface); 
      border: 1px solid var(--border); 
      border-radius: 16px; 
      overflow: hidden; 
      display: flex; 
      flex-direction: column; 
      transition: transform .25s cubic-bezier(.2,.7,.2,1), box-shadow .25s; 
    }
    .memory-card:hover { 
      transform: translateY(-4px); 
      box-shadow: 0 16px 34px var(--shadow); 
    }
    .memory-card-img { 
      height: 160px; 
      background-size: cover; 
      background-position: center; 
      position: relative; 
      background-color: var(--secondary); 
    }
    .memory-card-sm .memory-card-img { height: 120px; }
    .memory-card-img-empty { 
      display: flex; 
      align-items: center; 
      justify-content: center; 
    }
    .memory-card-tag { 
      position: absolute; 
      top: 10px; 
      left: 10px; 
      color: #fff; 
      font-size: 11px; 
      font-weight: 700; 
      padding: 4px 10px; 
      border-radius: 20px; 
      text-transform: uppercase; 
      letter-spacing: .03em; 
    }
    .memory-card-mood {
      position: absolute;
      bottom: 10px;
      right: 10px;
      font-size: 24px;
      filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5));
    }
    .memory-card-body { 
      padding: 16px 16px 18px; 
      display: flex; 
      flex-direction: column; 
      gap: 4px; 
    }
    .memory-card-body h3 { 
      font-size: 17px; 
      font-weight: 600;
    }
    .memory-card-date { 
      font-size: 12.5px; 
      color: var(--ink-muted); 
    }
    .memory-card-place { color: var(--primary-light); }
    .memory-card-desc { 
      font-size: 13.5px; 
      color: var(--ink-muted); 
      margin-top: 4px; 
      display: -webkit-box; 
      -webkit-line-clamp: 2; 
      -webkit-box-orient: vertical; 
      overflow: hidden; 
    }
    .memory-card-people { 
      display: flex; 
      align-items: center; 
      gap: -6px; 
      margin-top: 8px; 
      flex-wrap: wrap;
    }
    .memory-card-people .avatar { 
      margin-right: -8px; 
      border: 2px solid var(--surface); 
    }
    .memory-card-people-names { 
      margin-left: 10px; 
      font-size: 12px; 
      color: var(--ink-muted); 
    }
    .memory-card-people-more {
      font-size: 12px;
      color: var(--ink-muted);
      margin-left: 8px;
      font-weight: 600;
    }

    .avatar { 
      border-radius: 50%; 
      color: #fff; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-weight: 700; 
      flex-shrink: 0; 
    }

    /* ---- filter chips ---- */
    .filter-row, .map-filters { 
      display: flex; 
      gap: 8px; 
      flex-wrap: wrap; 
      margin-bottom: 22px; 
      align-items: center; 
    }
    .chip { 
      background: var(--surface); 
      border: 1px solid var(--border); 
      padding: 8px 15px; 
      border-radius: 20px; 
      font-size: 13.5px; 
      color: var(--ink-muted);
      transition: all 0.2s;
    }
    .chip:hover { border-color: var(--primary); color: var(--ink); }
    .chip-sm { padding: 6px 12px; font-size: 12.5px; }
    .chip-active { 
      background: var(--primary); 
      color: #fff; 
      border-color: var(--primary); 
    }

    .empty-state { 
      text-align: center; 
      padding: 60px 20px; 
      color: var(--ink-muted); 
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
    .empty-state svg { color: var(--border); }

    /* ---- modal ---- */
    .modal-overlay { 
      position: absolute; 
      inset: 0; 
      background: rgba(0,0,0,0.7); 
      backdrop-filter: blur(4px); 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      z-index: 100; 
      padding: 26px; 
      animation: fadeIn .25s ease; 
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .modal { 
      background: var(--surface); 
      border-radius: 20px; 
      max-width: 640px; 
      width: 100%; 
      max-height: 88%; 
      overflow-y: auto; 
      position: relative; 
      animation: modalIn .35s cubic-bezier(.2,.8,.2,1);
      border: 1px solid var(--border);
    }
    @keyframes modalIn { 
      from { opacity: 0; transform: translateY(24px) scale(.98); } 
      to { opacity: 1; transform: none; } 
    }
    .modal-close { 
      position: absolute; 
      top: 12px; 
      right: 12px; 
      background: var(--secondary); 
      border: none; 
      border-radius: 50%; 
      width: 36px; 
      height: 36px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      z-index: 5; 
      color: var(--ink-muted);
      transition: background 0.2s;
    }
    .modal-close:hover { background: var(--border); }

    .detail-hero { 
      height: 240px; 
      background-size: cover; 
      background-position: center; 
      background-color: var(--secondary); 
      border-radius: 20px 20px 0 0; 
      position: relative; 
    }
    .detail-hero-tag { 
      position: absolute; 
      bottom: 14px; 
      left: 20px; 
      color: #fff; 
      font-size: 12px; 
      font-weight: 700; 
      padding: 5px 12px; 
      border-radius: 20px; 
      text-transform: uppercase; 
    }
    .detail-hero-mood {
      position: absolute;
      bottom: 14px;
      right: 20px;
      font-size: 32px;
    }
    .detail-body { padding: 24px 28px 32px; }
    .detail-body h1 { font-size: 28px; margin-bottom: 6px; }
    .detail-meta { color: var(--ink-muted); font-size: 14px; margin-bottom: 14px; }
    .detail-desc { font-size: 15.5px; line-height: 1.7; }
    .detail-h4 { 
      font-size: 13px; 
      text-transform: uppercase; 
      letter-spacing: .04em; 
      color: var(--ink-muted); 
      margin: 24px 0 10px; 
    }

    .media-strip { 
      display: flex; 
      gap: 12px; 
      overflow-x: auto; 
      padding-bottom: 6px; 
    }
    .media-thumb { flex-shrink: 0; width: 150px; }
    .media-thumb img { 
      width: 150px; 
      height: 105px; 
      object-fit: cover; 
      border-radius: 12px; 
    }
    .media-video-placeholder { 
      width: 150px; 
      height: 105px; 
      border-radius: 12px; 
      background: var(--secondary); 
      color: var(--ink-muted); 
      display: flex; 
      align-items: center; 
      justify-content: center; 
    }
    .media-thumb span { 
      font-size: 12px; 
      color: var(--ink-muted); 
      display: block; 
      margin-top: 6px; 
    }

    .people-row { display: flex; gap: 10px; flex-wrap: wrap; }
    .people-chip { 
      display: flex; 
      align-items: center; 
      gap: 8px; 
      background: var(--secondary); 
      border: none; 
      padding: 6px 12px 6px 6px; 
      border-radius: 20px; 
      font-size: 13.5px; 
      color: var(--ink);
      transition: background 0.2s;
    }
    .people-chip:hover { background: var(--border); }
    .connected-list { display: flex; flex-direction: column; gap: 6px; }
    .connected-row { 
      display: flex; 
      align-items: center; 
      gap: 8px; 
      background: none; 
      border: 1px solid var(--border); 
      padding: 10px 14px; 
      border-radius: 12px; 
      text-align: left; 
      font-size: 14px; 
      color: var(--ink);
      transition: background 0.2s;
    }
    .connected-row:hover { background: var(--secondary); }

    /* ---- people ---- */
    .people-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fill, minmax(180px,1fr)); 
      gap: 18px; 
    }
    .person-card { 
      background: var(--surface); 
      border: 1px solid var(--border); 
      border-radius: 16px; 
      padding: 22px 16px; 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      gap: 6px; 
      text-align: center; 
      transition: transform .2s; 
    }
    .person-card:hover { 
      transform: translateY(-3px); 
      box-shadow: 0 14px 30px var(--shadow); 
    }
    .person-card h3 { font-size: 16px; margin-top: 4px; }
    .person-count { font-size: 12px; color: var(--accent); font-weight: 600; }
    .profile-head { 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      text-align: center; 
      gap: 8px; 
      padding: 34px 30px 10px; 
    }
    .profile-head h1 { font-size: 26px; margin-top: 8px; }
    .profile-modal .detail-h4 { padding: 0 30px; }
    .profile-modal .card-grid-tight { padding: 0 30px 20px; }
    .profile-modal .people-row { padding: 0 30px 30px; }

    /* ---- recall mode ---- */
    .recall-overlay { background: rgba(0,0,0,0.85); }
    .recall-panel { 
      background: var(--surface); 
      border: 1px solid var(--border);
      border-radius: 24px; 
      width: 560px; 
      max-width: 92%; 
      padding: 50px 40px; 
      position: relative; 
      text-align: center; 
    }
    .recall-stage { display: flex; flex-direction: column; align-items: center; gap: 18px; }
    .recall-question { font-size: 32px; }
    .recall-question-sm { font-size: 22px; font-family: 'Playfair Display', serif; }
    .recall-answer { font-size: 19px; line-height: 1.6; }
    .recall-photo { width: 100%; max-height: 260px; object-fit: cover; border-radius: 16px; }
    .recall-choices { display: flex; gap: 14px; margin-top: 6px; }
    .recall-list { width: 100%; display: flex; flex-direction: column; gap: 8px; text-align: left; margin: 10px 0; }
    .recall-list-item { 
      display: flex; 
      justify-content: space-between; 
      padding: 12px 16px; 
      background: var(--surface-light); 
      border: 1px solid var(--border);
      border-radius: 12px; 
      font-size: 15px; 
    }

    /* ---- word learning ---- */
    .learnable-word {
      cursor: help;
      border-bottom: 1px dashed var(--accent);
      transition: all 0.2s;
      display: inline;
    }
    .learnable-word:hover {
      background: var(--secondary);
      border-bottom-color: var(--primary-light);
    }
    .text-with-learning {
      display: inline;
    }
    .word-tooltip {
      position: fixed;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 16px 20px;
      max-width: 320px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.6);
      z-index: 200;
      animation: fadeIn 0.2s ease;
    }
    .word-tooltip::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 8px solid transparent;
      border-top-color: var(--surface);
    }
    .word-tooltip-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    .word-tooltip-word {
      font-weight: 700;
      font-size: 16px;
      color: var(--accent);
      flex: 1;
    }
    .word-tooltip-close {
      background: none;
      border: none;
      color: var(--ink-muted);
      padding: 2px;
    }
    .word-tooltip-definition {
      font-size: 14px;
      line-height: 1.6;
      color: var(--ink);
    }
    .word-tooltip-footer {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 10px;
      font-size: 12px;
      color: var(--ink-muted);
    }
    @media (max-width: 640px) {
      .word-tooltip {
        max-width: 90vw;
        left: 50% !important;
        top: auto !important;
        bottom: 80px;
        transform: translateX(-50%) !important;
      }
      .word-tooltip::after {
        top: auto;
        bottom: 100%;
        border-top-color: transparent;
        border-bottom-color: var(--surface);
      }
    }

    /* ---- timeline ---- */
    .timeline-year { 
      font-size: 28px; 
      color: var(--primary-light); 
      margin: 30px 0 6px; 
    }
    .timeline-month { 
      font-size: 15px; 
      color: var(--accent); 
      margin: 16px 0 8px; 
      text-transform: uppercase; 
      letter-spacing: .04em; 
      font-weight: 700; 
    }
    .timeline-items { 
      border-left: 2px solid var(--border); 
      margin-left: 6px; 
      padding-left: 20px; 
      display: flex; 
      flex-direction: column; 
      gap: 4px; 
    }
    .timeline-item { 
      display: flex; 
      align-items: center; 
      gap: 10px; 
      background: none; 
      border: none; 
      padding: 8px 10px; 
      border-radius: 10px; 
      text-align: left; 
      font-size: 14.5px; 
      width: 100%; 
      color: var(--ink);
      transition: background 0.2s;
    }
    .timeline-item:hover { background: var(--secondary); }
    .timeline-dot { 
      width: 9px; 
      height: 9px; 
      border-radius: 50%; 
      flex-shrink: 0; 
      margin-left: -25px; 
      box-shadow: 0 0 0 3px var(--bg); 
    }
    .timeline-item-title { flex: 1; }

    /* ---- weekly recap ---- */
    .recap-narrative { 
      background: var(--surface); 
      border: 1px solid var(--border);
      border-radius: 16px; 
      padding: 20px 24px; 
      margin-bottom: 30px; 
      font-size: 16.5px; 
      line-height: 1.7; 
      color: var(--ink); 
    }
    .recap-days { display: flex; flex-direction: column; gap: 22px; }
    .recap-day-label { 
      font-family: 'Playfair Display', serif; 
      font-size: 18px; 
      color: var(--primary-light); 
      margin-bottom: 10px; 
    }
    .recap-day-items { display: flex; flex-direction: column; gap: 10px; }
    .recap-item { 
      display: flex; 
      gap: 14px; 
      align-items: center; 
      background: var(--surface); 
      border: 1px solid var(--border); 
      border-radius: 14px; 
      padding: 12px; 
      text-align: left; 
      color: var(--ink);
      transition: background 0.2s;
    }
    .recap-item:hover { background: var(--secondary); }
    .recap-item img { 
      width: 74px; 
      height: 74px; 
      object-fit: cover; 
      border-radius: 12px; 
      flex-shrink: 0; 
    }
    .recap-item-title { font-weight: 600; margin-bottom: 2px; }

    /* ---- wizard ---- */
    .wizard-modal { padding: 28px 28px 24px; max-width: 560px; }
    .wizard-progress { display: flex; gap: 6px; margin-bottom: 22px; }
    .wizard-step-dot { 
      width: 28px; 
      height: 28px; 
      border-radius: 50%; 
      background: var(--secondary); 
      color: var(--ink-muted); 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-size: 12px; 
      font-weight: 700; 
    }
    .wizard-step-dot.done { background: var(--primary); color: #fff; }
    .wizard-step h2 { font-size: 22px; margin-bottom: 16px; }
    .wizard-step label { 
      display: flex; 
      flex-direction: column; 
      gap: 6px; 
      font-size: 13px; 
      color: var(--ink-muted); 
      margin-bottom: 14px; 
      font-weight: 600; 
    }
    .wizard-step input, .wizard-step textarea, .wizard-step select { 
      border: 1px solid var(--border); 
      border-radius: 12px; 
      padding: 10px 13px; 
      font-size: 14.5px; 
      font-family: inherit; 
      color: var(--ink); 
      resize: vertical; 
      background: var(--surface-light);
    }
    .wizard-step select { color: var(--ink); }
    .wizard-step textarea { min-height: 80px; }
    .wizard-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .kind-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; }
    .kind-card { 
      padding: 16px; 
      border-radius: 14px; 
      border: 1.5px solid var(--border); 
      background: var(--surface); 
      font-weight: 600; 
      text-align: left; 
      color: var(--ink-muted);
      transition: all 0.2s;
    }
    .kind-card:hover { border-color: var(--primary); color: var(--ink); }
    .kind-card-active { 
      border-color: var(--primary); 
      background: var(--secondary); 
      color: var(--primary-light); 
    }
    .upload-box { 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      gap: 8px; 
      border: 1.5px dashed var(--border); 
      border-radius: 16px; 
      padding: 30px; 
      color: var(--ink-muted); 
      margin-bottom: 14px; 
      cursor: pointer;
      transition: border-color 0.2s;
    }
    .upload-box:hover { border-color: var(--primary); }
    .connect-suggest { display: flex; flex-wrap: wrap; gap: 10px; }
    .connect-chip { 
      display: flex; 
      align-items: center; 
      gap: 6px; 
      border: 1.5px solid var(--border); 
      background: var(--surface); 
      padding: 8px 14px; 
      border-radius: 20px; 
      font-size: 13.5px; 
      color: var(--ink-muted);
      transition: all 0.2s;
    }
    .connect-chip:hover { border-color: var(--primary); color: var(--ink); }
    .connect-chip-active { 
      border-color: var(--accent); 
      background: var(--secondary); 
      color: var(--accent); 
    }
    .preview-card { 
      background: var(--surface-light); 
      border: 1px solid var(--border);
      border-radius: 16px; 
      padding: 20px; 
      display: flex; 
      flex-direction: column; 
      gap: 6px; 
    }
    .wizard-nav { display: flex; justify-content: space-between; margin-top: 26px; }
    .wizard-saved { 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      gap: 10px; 
      padding: 60px 20px; 
    }
    .check-circle { 
      width: 56px; 
      height: 56px; 
      border-radius: 50%; 
      background: var(--success); 
      color: #fff; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
    }

    /* ---- map ---- */
    .map-view { max-width: none; height: calc(100vh - 44px); display: flex; flex-direction: column; }
    .map-toolbar { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      margin-bottom: 14px; 
      flex-wrap: wrap; 
      gap: 10px; 
    }
    .map-controls { display: flex; gap: 6px; }
    .map-controls button { 
      background: var(--surface); 
      border: 1px solid var(--border); 
      width: 36px; 
      height: 36px; 
      border-radius: 10px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      color: var(--ink-muted);
      transition: all 0.2s;
    }
    .map-controls button:hover { background: var(--secondary); color: var(--ink); }
    .map-canvas { 
      position: relative; 
      flex: 1; 
      min-height: 420px; 
      background: radial-gradient(ellipse at 50% 30%, #1a2744 0%, var(--bg) 65%, #0f0f1a 100%); 
      border: 1px solid var(--border); 
      border-radius: 20px; 
      overflow: hidden; 
      cursor: grab; 
    }
    .map-canvas:active { cursor: grabbing; }
    .map-canvas-3d { touch-action: none; }
    .map-labels { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
    .map-node-label-3d { 
      position: absolute; 
      top: 0; 
      left: 0; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-size: 11px; 
      font-weight: 700; 
      padding: 4px 10px; 
      border-radius: 20px; 
      white-space: nowrap; 
      background: rgba(22, 33, 62, 0.9); 
      border: 1px solid var(--border); 
      color: var(--ink); 
      box-shadow: 0 3px 12px rgba(0,0,0,0.4); 
      transition: opacity .2s; 
      will-change: transform, opacity; 
    }
    .map-node-label-3d-person { border-color: var(--primary); color: var(--primary-light); }
    .map-node-label-3d-place { border-color: var(--accent); color: var(--accent); }
    .map-node-label-3d-memory { border-color: var(--coral); color: var(--coral); }
    .map-panel { 
      position: absolute; 
      right: 34px; 
      top: 150px; 
      width: 280px; 
      background: var(--surface); 
      border: 1px solid var(--border); 
      border-radius: 16px; 
      padding: 20px; 
      box-shadow: 0 20px 40px rgba(0,0,0,0.6); 
      animation: modalIn .3s ease; 
    }
    .map-panel h3 { margin: 10px 0 4px; font-size: 17px; }
    .map-panel p { font-size: 13.5px; margin-bottom: 10px; }
    @media (max-width: 860px) { 
      .map-panel { position: static; width: auto; margin-top: 14px; } 
    }

    /* ---- settings ---- */
    .settings-list { 
      display: flex; 
      flex-direction: column; 
      border: 1px solid var(--border); 
      border-radius: 16px; 
      overflow: hidden; 
      max-width: 460px; 
    }
    .settings-row { 
      display: flex; 
      justify-content: space-between; 
      padding: 14px 18px; 
      border-bottom: 1px solid var(--border); 
      font-size: 14.5px; 
      color: var(--ink);
    }
    .settings-row:last-child { border-bottom: none; }

    @media (max-width: 640px) {
      .main-area { padding: 16px 16px 60px; }
      .page-title { font-size: 28px; }
      .topbar-add span { display: none; }
    }
  `}</style>
);

export default function Brainheimer() {
  const [view, setView] = useState("home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [openMemory, setOpenMemory] = useState(null);
  const [openPerson, setOpenPerson] = useState(null);
  const [rememberPerson, setRememberPerson] = useState(null);
  const [showWizard, setShowWizard] = useState(false);
  const [userMemories, setUserMemories] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const memories = useMemo(() => [...MEMORIES, ...userMemories], [userMemories]);

  // Load persisted user memories
  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage?.get("brainheimer:user-memories", false);
        if (res?.value) {
          const parsed = JSON.parse(res.value).map(m => ({ ...m, date: new Date(m.date) }));
          setUserMemories(parsed);
        }
      } catch (e) { /* no saved data yet */ }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.storage?.set("brainheimer:user-memories", JSON.stringify(userMemories), false).catch(() => {});
  }, [userMemories, loaded]);

  function handleOpenMemory(m) { setOpenMemory(m); setOpenPerson(null); }
  function handleOpenPerson(p) { setOpenPerson(p); setOpenMemory(null); }
  function handleSaveMemory(m) { setUserMemories(prev => [...prev, m]); }

  return (
    <div className="brainheimer-root">
      <GlobalStyles />
      <Sidebar view={view} setView={setView} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className="main-area">
        <TopBar query={query} setQuery={(v) => { setQuery(v); setSearchOpen(!!v); }} onSearch={setSearchOpen} onAdd={() => setShowWizard(true)} />
        {searchOpen && query && (
          <SearchResults
            query={query} memories={memories}
            onOpenMemory={handleOpenMemory} onOpenPerson={handleOpenPerson}
            onClose={() => { setSearchOpen(false); setQuery(""); }}
          />
        )}
        {view === "home" && <HomeView memories={memories} onOpenMemory={handleOpenMemory} onGoMap={() => setView("map")} />}
        {view === "memories" && <MemoriesView memories={memories} onOpenMemory={handleOpenMemory} />}
        {view === "map" && <MemoryMapView memories={memories} onOpenMemory={handleOpenMemory} onOpenPerson={handleOpenPerson} />}
        {view === "people" && <PeopleView memories={memories} onOpenPerson={handleOpenPerson} />}
        {view === "timeline" && <TimelineView memories={memories} onOpenMemory={handleOpenMemory} />}
        {view === "recap" && <WeeklyRecapView memories={memories} onOpenMemory={handleOpenMemory} />}
        {view === "add" && (() => { setTimeout(() => setShowWizard(true), 0); return null; })()}
        {view === "settings" && <SettingsView />}
      </div>
      <MobileNav view={view} setView={setView} />

      {openMemory && (
        <MemoryDetail memory={openMemory} memories={memories} onClose={() => setOpenMemory(null)} onOpenMemory={handleOpenMemory} onOpenPerson={handleOpenPerson} />
      )}
      {openPerson && (
        <PersonProfile person={openPerson} memories={memories} onClose={() => setOpenPerson(null)} onOpenMemory={handleOpenMemory} onRemember={(p) => { setRememberPerson(p); setOpenPerson(null); }} />
      )}
      {rememberPerson && (
        <RememberMode person={rememberPerson} memories={memories} onClose={() => setRememberPerson(null)} />
      )}
      {showWizard && (
        <AddMemoryWizard memories={memories} onClose={() => { setShowWizard(false); if (view === "add") setView("home"); }} onSave={handleSaveMemory} />
      )}
    </div>
  );
}
