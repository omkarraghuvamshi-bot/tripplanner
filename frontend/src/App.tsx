import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, BadgeCheck, BedDouble, CalendarDays, CarFront,
  Check, CheckCircle2, ChevronDown, CircleDot, Clock3, Compass, Coffee, Heart, Hotel, Landmark,
  Map, MapPin, Menu, Mountain, Navigation, Plus, Route as RouteIcon, Search, SlidersHorizontal,
  Sparkles, Star, Sun, Trees, Users, Wallet, Waves, Wifi, X, Utensils, Luggage, Footprints,
  ParkingCircle, Share2, ShieldCheck, Leaf, Camera, MapPinned
} from 'lucide-react';
import './index.css';

type Destination = { slug: string; name: string; state: string; tag: string; image: string; rating: string; days: number; description: string; highlights: string[]; lat: number; lng: number };
type HotelItem = { id: string; name: string; location: string; area: string; price: number; rating: number; reviews: number; type: string; image: string; amenities: string[]; badge?: string; description: string };
type RouteStop = { name: string; type: string; note: string; lat: number; lng: number; image: string; detour: string };
type RouteOption = { id: string; name: string; label: string; distance: number; time: string; extra: string; toll: number; rating: number; description: string; cities: string[]; color: string; coords: [number, number][]; stops: RouteStop[] };
type SavedTrip = { id: string; origin: string; destination: string; days: number; travellers: number; budget: number; startDate: string; routeName: string; createdAt: string; itinerary: { day: number; title: string; activities: string[] }[] };

const image = (id: string, width = 1000) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
// Wikimedia Commons destination photography. See the footer and README for attribution.
const hampiImage = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6a/Hampi%2C_Virupaksha_Temple%2C_Karnataka%2C_India.jpg/1280px-Hampi%2C_Virupaksha_Temple%2C_Karnataka%2C_India.jpg?utm_campaign=index&utm_content=thumbnail&utm_source=commons.wikimedia.org';
const chitradurgaFortImage = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0e/The_magnificent_fort_of_Chitradurga.jpg/1280px-The_magnificent_fort_of_Chitradurga.jpg?utm_campaign=index&utm_content=thumbnail&utm_source=commons.wikimedia.org';
const destinations: Destination[] = [
  { slug: 'goa', name: 'Goa', state: 'West Coast, India', tag: 'Coastal escapes', image: image('photo-1512343879784-a960bf40e7f2'), rating: '4.9', days: 4, description: 'Slow mornings by the sea, Portuguese-era lanes, cliffside sunsets and seafood shacks. Goa rewards travellers who leave room for the unplanned.', highlights: ['Palolem Beach', 'Fontainhas', 'Chapora Fort', 'Dudhsagar Falls'], lat: 15.2993, lng: 74.1240 },
  { slug: 'coorg', name: 'Coorg', state: 'Karnataka, India', tag: 'Misty highlands', image: image('photo-1582510003544-4d00b7f74220'), rating: '4.9', days: 3, description: 'A green pocket of coffee estates, forest trails and tumbling waterfalls. Come for the mist, stay for the hospitality and slow plantation life.', highlights: ['Abbey Falls', 'Raja’s Seat', 'Dubare Elephant Camp', 'Coffee Estate Walk'], lat: 12.3375, lng: 75.8069 },
  { slug: 'gokarna', name: 'Gokarna', state: 'Karnataka, India', tag: 'Quiet coastline', image: image('photo-1507525428034-b723cf961d3e'), rating: '4.8', days: 3, description: 'A gentler stretch of the Arabian Sea, where beach trails connect quiet coves and the days end in copper-coloured sunsets.', highlights: ['Om Beach', 'Kudle Beach', 'Half Moon Beach', 'Mahabaleshwar Temple'], lat: 14.5479, lng: 74.3188 },
  { slug: 'hampi', name: 'Hampi', state: 'Karnataka, India', tag: 'Living history', image: hampiImage, rating: '4.9', days: 2, description: 'An open-air museum of giant boulders, temple corridors and stories carved into stone. Explore by bicycle and watch the ruins glow at dusk.', highlights: ['Virupaksha Temple', 'Vittala Temple', 'Matanga Hill', 'Lotus Mahal'], lat: 15.3350, lng: 76.4600 },
  { slug: 'munnar', name: 'Munnar', state: 'Kerala, India', tag: 'Tea country', image: image('photo-1500530855697-b586d89ba3ee'), rating: '4.8', days: 4, description: 'Rolling tea gardens, cool mountain air and winding roads through the Western Ghats. A natural reset with beautiful viewpoints at every turn.', highlights: ['Eravikulam National Park', 'Top Station', 'Mattupetty Dam', 'Tea Museum'], lat: 10.0889, lng: 77.0595 },
  { slug: 'ooty', name: 'Ooty', state: 'Tamil Nadu, India', tag: 'Mountain hideaway', image: image('photo-1571896349842-33c89424de2d'), rating: '4.7', days: 3, description: 'A classic hill-station escape of eucalyptus-scented roads, botanical gardens, lake views and heritage train journeys.', highlights: ['Botanical Garden', 'Ooty Lake', 'Doddabetta Peak', 'Nilgiri Mountain Railway'], lat: 11.4064, lng: 76.6932 },
];

const hotels: HotelItem[] = [
  { id: 'h1', name: 'Misty Canopy Coffee Estate', location: 'Coorg', area: 'Madikeri', price: 4200, rating: 4.8, reviews: 286, type: 'Estate stay', image: image('photo-1445019980597-93fa8acb246c', 900), amenities: ['Breakfast', 'Wi-Fi', 'Parking', 'Nature trails'], badge: 'Guest favourite', description: 'A quiet plantation hideaway wrapped in coffee greenery and birdsong.' },
  { id: 'h2', name: 'Coastal Drift Beach Cottages', location: 'Gokarna', area: 'Om Beach Road', price: 3500, rating: 4.7, reviews: 194, type: 'Beach cottage', image: image('photo-1499793983690-e29da59ef1c2', 900), amenities: ['Beach access', 'Restaurant', 'Parking'], badge: 'Near the beach', description: 'Simple, airy cottages with a short walk to the shoreline.' },
  { id: 'h3', name: 'Tungabhadra Riverside Retreat', location: 'Hampi', area: 'Sanapur', price: 5100, rating: 4.9, reviews: 321, type: 'Boutique resort', image: image('photo-1566073771259-6a8506099945', 900), amenities: ['Pool', 'Breakfast', 'Wi-Fi', 'Restaurant'], badge: 'Top rated', description: 'A considered riverside stay with open courtyards and sunset views.' },
  { id: 'h4', name: 'Palmline Boutique Villa', location: 'Goa', area: 'Assagao', price: 8900, rating: 4.9, reviews: 412, type: 'Boutique villa', image: image('photo-1613490493576-7fde63acd811', 900), amenities: ['Pool', 'Breakfast', 'Wi-Fi', 'Restaurant'], badge: 'Design stay', description: 'A leafy villa with a calm pool deck and thoughtful coastal interiors.' },
  { id: 'h5', name: 'Garden City Urban Suites', location: 'Bengaluru', area: 'Indiranagar', price: 3200, rating: 4.5, reviews: 168, type: 'City hotel', image: image('photo-1564501049412-61c2a3083791', 900), amenities: ['Wi-Fi', 'Parking', 'Breakfast'], description: 'A comfortable city base close to cafés, shopping and metro links.' },
  { id: 'h6', name: 'Tea Valley Hideaway', location: 'Munnar', area: 'Pothamedu', price: 6800, rating: 4.8, reviews: 257, type: 'Hill resort', image: image('photo-1510798831971-661eb04b3739', 900), amenities: ['Breakfast', 'Restaurant', 'Nature trails', 'Parking'], badge: 'Mountain views', description: 'Hill-facing rooms set among tea slopes and quiet walking paths.' },
  { id: 'h7', name: 'The Fern & Stone', location: 'Ooty', area: 'Lovedale', price: 5900, rating: 4.7, reviews: 203, type: 'Heritage stay', image: image('photo-1449158743715-0a90ebb6d2d8', 900), amenities: ['Breakfast', 'Wi-Fi', 'Parking', 'Restaurant'], description: 'A warm heritage-style retreat with fireplaces and garden corners.' },
];

const corridorRoutes: Record<string, RouteOption[]> = {
  'bengaluru-goa': [
    { id: 'coast', name: 'Coast & Forest Route', label: 'Most scenic', distance: 665, time: '12h 40m', extra: '+2h 10m', toll: 510, rating: 4.9, description: 'Trade a little time for forest roads, waterfalls and a dramatic coastal approach.', cities: ['Tumakuru', 'Chitradurga', 'Yellapur', 'Gokarna', 'Karwar'], color: '#e77b54', coords: [[77.5946,12.9716],[76.8958,14.2251],[75.7461,14.7937],[74.7460,14.9630],[74.3188,14.5479],[74.1240,15.2993]], stops: [ {name:'Chitradurga Fort',type:'Heritage',note:'Massive hill fort with sweeping ramparts.',lat:14.2251,lng:76.3980,image:chitradurgaFortImage,detour:'25 min'}, {name:'Yellapur Forest Drive',type:'Nature',note:'Green ghats and quiet viewpoints.',lat:14.9630,lng:74.7130,image:image('photo-1448375240586-882707db888b',600),detour:'15 min'}, {name:'Gokarna Beach Trail',type:'Coast',note:'Stretch your legs on a beautiful beach walk.',lat:14.5479,lng:74.3188,image:image('photo-1507525428034-b723cf961d3e',600),detour:'35 min'} ] },
    { id: 'fast', name: 'Express Highway Route', label: 'Fastest', distance: 560, time: '10h 30m', extra: 'Fastest', toll: 690, rating: 4.5, description: 'A practical highway-first drive with dependable fuel, food and rest stops.', cities: ['Tumakuru', 'Chitradurga', 'Hubballi', 'Belagavi'], color: '#377f73', coords: [[77.5946,12.9716],[77.1010,13.3379],[76.3980,14.2251],[75.1376,15.3647],[74.4977,15.8497],[74.1240,15.2993]], stops: [ {name:'Chitradurga Fort',type:'Heritage',note:'A memorable fort stop just off the highway.',lat:14.2251,lng:76.3980,image:chitradurgaFortImage,detour:'25 min'}, {name:'Unkal Lake',type:'Nature',note:'A relaxed waterside break near Hubballi.',lat:15.3647,lng:75.1376,image:image('photo-1501785888041-af3ef285b470',600),detour:'20 min'} ] },
    { id: 'heritage', name: 'Deccan Heritage Route', label: 'Culture trail', distance: 615, time: '11h 50m', extra: '+1h 20m', toll: 560, rating: 4.8, description: 'Add a little Deccan history with temple towns and old trading centres along the way.', cities: ['Tumakuru', 'Chitradurga', 'Dharwad', 'Yellapur'], color: '#6c79a8', coords: [[77.5946,12.9716],[76.8958,14.2251],[76.3980,14.2251],[75.0078,15.4589],[74.7130,14.9630],[74.1240,15.2993]], stops: [ {name:'Chitradurga Fort',type:'Heritage',note:'Explore the old fort complex and gateways.',lat:14.2251,lng:76.3980,image:chitradurgaFortImage,detour:'25 min'}, {name:'Dharwad Food Trail',type:'Food',note:'Pause for famous local pedha and North Karnataka flavours.',lat:15.4589,lng:75.0078,image:image('photo-1668236543090-82eba5ee5976',600),detour:'30 min'} ] },
  ],
  'bengaluru-coorg': [
    { id:'forest',name:'Mysuru & Coffee Country',label:'Most scenic',distance:265,time:'5h 45m',extra:'+35m',toll:180,rating:4.9,description:'A relaxed route via Mysuru with room for a heritage stop and coffee-country scenery.',cities:['Mysuru','Hunsur','Kushalnagar'],color:'#e77b54',coords:[[77.5946,12.9716],[76.6394,12.2958],[76.0990,12.3030],[75.9590,12.4570],[75.8069,12.3375]],stops:[{name:'Mysuru Palace',type:'Heritage',note:'A quick look at one of Karnataka’s great landmarks.',lat:12.3052,lng:76.6552,image:image('photo-1600100397608-f010e421d418',600),detour:'20 min'},{name:'Dubare Riverside',type:'Nature',note:'Forest and river landscapes near Kushalnagar.',lat:12.4580,lng:75.9630,image:image('photo-1448375240586-882707db888b',600),detour:'25 min'}]},
    { id:'quick',name:'Direct Highway Route',label:'Fastest',distance:250,time:'5h 10m',extra:'Fastest',toll:160,rating:4.6,description:'The most direct drive into Madikeri with fewer planned detours.',cities:['Ramanagara','Mysuru bypass','Kushalnagar'],color:'#377f73',coords:[[77.5946,12.9716],[77.2800,12.7200],[76.6394,12.2958],[76.0990,12.3030],[75.8069,12.3375]],stops:[{name:'Ramanagara Hills',type:'Nature',note:'Granite hill views close to the highway.',lat:12.7200,lng:77.2800,image:image('photo-1470770841072-f978cf4d019e',600),detour:'15 min'}]},
  ],
  'bengaluru-gokarna': [
    {id:'coast',name:'Western Ghats & Coast',label:'Most scenic',distance:485,time:'9h 20m',extra:'+1h 15m',toll:390,rating:4.9,description:'A green ghat crossing with a chance to pause at forest viewpoints.',cities:['Tumakuru','Chitradurga','Sirsi','Yana'],color:'#e77b54',coords:[[77.5946,12.9716],[76.3980,14.2251],[75.1300,14.6200],[74.9000,14.5500],[74.3188,14.5479]],stops:[{name:'Yana Rock Formations',type:'Nature',note:'Distinctive limestone formations in dense forest.',lat:14.5810,lng:74.5700,image:image('photo-1448375240586-882707db888b',600),detour:'40 min'},{name:'Mirjan Fort',type:'Heritage',note:'A moss-covered laterite fort close to the coast.',lat:14.5000,lng:74.4200,image:image('photo-1600100397608-f010e421d418',600),detour:'20 min'}]},
    {id:'fast',name:'Hubballi Highway Route',label:'Fastest',distance:445,time:'8h 45m',extra:'Fastest',toll:420,rating:4.6,description:'A faster, more direct highway approach to the coast.',cities:['Tumakuru','Chitradurga','Hubballi','Yellapur'],color:'#377f73',coords:[[77.5946,12.9716],[76.3980,14.2251],[75.1376,15.3647],[74.7130,14.9630],[74.3188,14.5479]],stops:[{name:'Unkal Lake',type:'Nature',note:'An easy city-side pause near Hubballi.',lat:15.3647,lng:75.1376,image:image('photo-1501785888041-af3ef285b470',600),detour:'20 min'}]},
  ]
,
  'bengaluru-hampi': [
    {id:'forts',name:'Deccan Fort Trail',label:'Most scenic',distance:350,time:'6h 40m',extra:'+40m',toll:260,rating:4.9,description:'A relaxed drive with time to explore the great fort at Chitradurga.',cities:['Tumakuru','Chitradurga','Hospet'],color:'#e77b54',coords:[[77.5946,12.9716],[77.1010,13.3379],[76.3980,14.2251],[76.0430,15.2670],[76.4600,15.3350]],stops:[{name:'Chitradurga Fort',type:'Heritage',note:'A sprawling hill fort with gateways, temples and granite views.',lat:14.2251,lng:76.3980,image:chitradurgaFortImage,detour:'25 min'},{name:'Tungabhadra Riverside',type:'Nature',note:'A peaceful river pause before exploring the ruins.',lat:15.3200,lng:76.4600,image:image('photo-1501785888041-af3ef285b470',600),detour:'15 min'}]},
    {id:'fast',name:'Direct Deccan Highway',label:'Fastest',distance:330,time:'6h 05m',extra:'Fastest',toll:310,rating:4.6,description:'A quicker highway-led approach with fewer planned stops.',cities:['Tumakuru','Chitradurga bypass','Hospet'],color:'#377f73',coords:[[77.5946,12.9716],[77.1010,13.3379],[76.3980,14.2251],[76.0430,15.2670],[76.4600,15.3350]],stops:[{name:'Hospet Local Food Stop',type:'Food',note:'Take a break for a North Karnataka meal before Hampi.',lat:15.2680,lng:76.3900,image:image('photo-1668236543090-82eba5ee5976',600),detour:'15 min'}]}
  ],
  'bengaluru-ooty': [
    {id:'nilgiri',name:'Mysuru & Nilgiri Route',label:'Most scenic',distance:285,time:'6h 20m',extra:'+45m',toll:210,rating:4.9,description:'Pass through Mysuru and the green edges of the Nilgiri Biosphere Reserve.',cities:['Ramanagara','Mysuru','Bandipur','Gudalur'],color:'#e77b54',coords:[[77.5946,12.9716],[77.2800,12.7200],[76.6552,12.3052],[76.6290,11.6650],[76.5100,11.5000],[76.6932,11.4064]],stops:[{name:'Mysuru Palace',type:'Heritage',note:'A landmark palace and an easy cultural stop.',lat:12.3052,lng:76.6552,image:image('photo-1600100397608-f010e421d418',600),detour:'20 min'},{name:'Bandipur Forest Edge',type:'Nature',note:'A scenic forest stretch on the way into the hills.',lat:11.6650,lng:76.6290,image:image('photo-1448375240586-882707db888b',600),detour:'10 min'}]},
    {id:'direct',name:'Direct Hill Highway',label:'Fastest',distance:270,time:'5h 50m',extra:'Fastest',toll:240,rating:4.6,description:'The more direct drive towards Ooty with fewer planned scenic pauses.',cities:['Mysuru bypass','Nanjangud','Gudalur'],color:'#377f73',coords:[[77.5946,12.9716],[76.6552,12.3052],[76.6800,11.7200],[76.5100,11.5000],[76.6932,11.4064]],stops:[{name:'Nanjangud Riverside',type:'Culture',note:'A peaceful riverside and temple-town pause.',lat:12.1200,lng:76.6800,image:image('photo-1609137144813-7d9921338f24',600),detour:'15 min'}]}
  ],
  'bengaluru-munnar': [
    {id:'ghats',name:'Western Ghats Escape',label:'Most scenic',distance:555,time:'10h 55m',extra:'+1h 05m',toll:470,rating:4.9,description:'A long but rewarding cross-state drive through foothills and tea country.',cities:['Salem','Dindigul','Theni','Adimali'],color:'#e77b54',coords:[[77.5946,12.9716],[78.1460,11.6643],[77.9500,10.3670],[77.4800,10.0100],[77.0600,10.0100],[77.0595,10.0889]],stops:[{name:'Theni Valley View',type:'Nature',note:'A lovely transition from plains to mountain scenery.',lat:10.0100,lng:77.4800,image:image('photo-1470770841072-f978cf4d019e',600),detour:'20 min'},{name:'Tea Garden Walk',type:'Nature',note:'Stretch your legs among Munnar’s rolling tea slopes.',lat:10.0889,lng:77.0595,image:image('photo-1500530855697-b586d89ba3ee',600),detour:'25 min'}]},
    {id:'express',name:'Salem Express Route',label:'Fastest',distance:530,time:'10h 10m',extra:'Fastest',toll:520,rating:4.6,description:'A more direct highway option with practical food and fuel breaks.',cities:['Salem','Dindigul','Bodi'],color:'#377f73',coords:[[77.5946,12.9716],[78.1460,11.6643],[77.9500,10.3670],[77.2800,10.0000],[77.0595,10.0889]],stops:[{name:'Dindigul Food Stop',type:'Food',note:'Pause for local flavours before the climb into the hills.',lat:10.3670,lng:77.9500,image:image('photo-1668236543090-82eba5ee5976',600),detour:'15 min'}]}
  ]
};

function readStore<T>(key: string, fallback: T): T { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; } catch { return fallback; } }
function useStoredState<T>(key: string, initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => readStore(key, initial));
  useEffect(() => {
    const sync = (event: Event) => {
      const detail = (event as CustomEvent<{ key: string; value: unknown }>).detail;
      if (detail?.key === key) setValue(detail.value as T);
    };
    const syncOtherTab = (event: StorageEvent) => {
      if (event.key === key) setValue(event.newValue ? JSON.parse(event.newValue) as T : initial);
    };
    window.addEventListener('gb-local-storage', sync);
    window.addEventListener('storage', syncOtherTab);
    return () => {
      window.removeEventListener('gb-local-storage', sync);
      window.removeEventListener('storage', syncOtherTab);
    };
  }, [key]);
  const setStoredValue: React.Dispatch<React.SetStateAction<T>> = (action) => {
    const next = typeof action === 'function' ? (action as (current: T) => T)(value) : action;
    localStorage.setItem(key, JSON.stringify(next));
    setValue(next);
    window.dispatchEvent(new CustomEvent('gb-local-storage', { detail: { key, value: next } }));
  };
  return [value, setStoredValue];
}
const money = (value: number) => `₹${value.toLocaleString('en-IN')}`;
const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const knownDestination = (name: string) => destinations.find(d => d.name.toLowerCase() === name.toLowerCase() || d.slug === slugify(name)) || destinations[0];
const routesFor = (from: string, to: string): RouteOption[] => corridorRoutes[`${slugify(from)}-${slugify(to)}`] || corridorRoutes['bengaluru-goa'];

function Navbar({ savedCount }: { savedCount: number }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);
  return <header className="site-header"><div className="nav-shell">
    <Link to="/" className="brand"><span className="brand-mark"><Compass size={22}/></span><span>go<span className="brand-light">beyond</span><small>FIND YOUR WAY OUT THERE</small></span></Link>
    <nav className={`nav-links ${open ? 'nav-open' : ''}`}>
      <NavLink to="/destinations">Explore</NavLink><NavLink to="/routes">Route finder</NavLink><NavLink to="/hotels">Stays</NavLink><NavLink to="/my-trips">My journeys {savedCount > 0 && <span className="nav-count">{savedCount}</span>}</NavLink>
    </nav>
    <div className="nav-actions"><Link to="/plan" className="nav-cta">Plan a trip <ArrowUpRight size={16}/></Link><button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X/> : <Menu/>}</button></div>
  </div></header>;
}
function Footer() { return <footer className="footer"><div className="footer-top"><Link to="/" className="brand brand-footer"><span className="brand-mark"><Compass size={22}/></span><span>go<span className="brand-light">beyond</span><small>FIND YOUR WAY OUT THERE</small></span></Link><p>Take the scenic route. Collect the stories.</p><div className="footer-links"><Link to="/destinations">Destinations</Link><Link to="/routes">Route finder</Link><Link to="/hotels">Stays</Link><Link to="/my-trips">My journeys</Link></div></div><div className="footer-bottom"><span>© 2026 GoBeyond. Made for the curious.</span><span>Demo experience · Sample route and hotel information · Photos: <a href="https://commons.wikimedia.org/wiki/File:Hampi,_Virupaksha_Temple,_Karnataka,_India.jpg" target="_blank" rel="noreferrer">Hampi · Vyacheslav Argenberg</a> (CC BY 4.0) and <a href="https://commons.wikimedia.org/wiki/File:The_magnificent_fort_of_Chitradurga.jpg" target="_blank" rel="noreferrer">Chitradurga Fort · Shivashankar S Bannikoppa</a> (CC BY-SA 4.0)</span></div></footer>; }
function AppShell() {
  const [trips] = useStoredState<SavedTrip[]>('gb-trips', []);
  return <><Navbar savedCount={trips.length}/><Routes>
    <Route path="/" element={<HomePage/>}/><Route path="/destinations" element={<ExplorePage/>}/><Route path="/destinations/:slug" element={<DestinationPage/>}/><Route path="/routes" element={<RouteFinderPage/>}/><Route path="/plan" element={<PlanPage/>}/><Route path="/hotels" element={<HotelsPage/>}/><Route path="/my-trips" element={<MyTripsPage/>}/><Route path="/itinerary/:id" element={<ItineraryPage/>}/><Route path="*" element={<NotFound/>}/>
  </Routes><Footer/></>;
}

function HomePage() {
  const navigate = useNavigate();
  const [from, setFrom] = useState('Bengaluru'); const [to, setTo] = useState('Goa'); const [days, setDays] = useState('4');
  const heroSlides = [
    { label: 'WESTERN GHATS', eyebrow: 'THE ART OF GOING FURTHER', title: 'Take the road', accent: 'less ordinary.', copy: 'Discover the places between here and there. Build thoughtful trips, find remarkable stays and turn the journey into the story.', image: image('photo-1470770841072-f978cf4d019e', 2200) },
    { label: 'TROPICAL COASTLINES', eyebrow: 'FIND YOUR OWN BLUE', title: 'Chase the', accent: 'coastline.', copy: 'Find quiet beaches, winding coastal roads and little places that make you want to stay one more day.', image: image('photo-1507525428034-b723cf961d3e', 2200) },
    { label: 'HAMPI, KARNATAKA', eyebrow: 'HISTORY IN EVERY HORIZON', title: 'Wander through', accent: 'living stories.', copy: 'Follow ancient stone paths, discover remarkable architecture and let every detour tell you something new.', image: hampiImage },
    { label: 'COFFEE COUNTRY', eyebrow: 'SLOW DOWN, LOOK UP', title: 'Wake up somewhere', accent: 'wonderful.', copy: 'Trade the usual rush for forest trails, misty mornings and stays tucked into the green heart of the hills.', image: image('photo-1448375240586-882707db888b', 2200) },
    { label: 'MOUNTAIN ESCAPES', eyebrow: 'MAKE ROOM FOR THE VIEW', title: 'Let the long way', accent: 'lead the way.', copy: 'Pick a horizon, find the scenic route and collect all the beautiful stops in between.', image: image('photo-1500530855697-b586d89ba3ee', 2200) },
  ];
  const [heroIndex, setHeroIndex] = useState(0);
  const activeHero = heroSlides[heroIndex];
  const showPrevious = () => setHeroIndex(index => (index - 1 + heroSlides.length) % heroSlides.length);
  const showNext = () => setHeroIndex(index => (index + 1) % heroSlides.length);
  useEffect(() => {
    const timer = window.setInterval(() => setHeroIndex(index => (index + 1) % heroSlides.length), 6500);
    return () => window.clearInterval(timer);
  }, [heroSlides.length]);
  return <main className="home-page">
    <section className="hero" aria-roledescription="carousel" aria-label="Featured travel destinations">
      <div key={activeHero.image} className="hero-bg" style={{ backgroundImage: `url("${activeHero.image}")` }} />
      <div className="hero-overlay" />
      <div className="hero-content wrap">
        <div className="eyebrow eyebrow-light"><span className="eyebrow-dot"/> {activeHero.eyebrow}</div>
        <h1>{activeHero.title}<br/><em>{activeHero.accent}</em></h1>
        <p className="hero-copy">{activeHero.copy}</p>
        <div className="hero-search-card">
          <form onSubmit={(e) => { e.preventDefault(); navigate(`/routes?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`); }}>
            <div className="search-field"><span className="field-icon"><MapPin size={17}/></span><label>STARTING POINT</label><input value={from} onChange={e=>setFrom(e.target.value)} list="cities" required/><datalist id="cities"><option>Bengaluru</option><option>Mysuru</option><option>Hyderabad</option><option>Chennai</option><option>Mumbai</option></datalist></div>
            <div className="search-divider"/><div className="search-field"><span className="field-icon destination-icon"><Navigation size={17}/></span><label>WHERE TO?</label><input value={to} onChange={e=>setTo(e.target.value)} list="destinations" required/><datalist id="destinations">{destinations.map(d=><option key={d.slug}>{d.name}</option>)}</datalist></div>
            <div className="search-divider"/><div className="search-field search-days"><span className="field-icon"><CalendarDays size={17}/></span><label>HOW LONG?</label><select value={days} onChange={e=>setDays(e.target.value)}><option value="2">Weekend · 2 days</option><option value="3">3 days</option><option value="4">4 days</option><option value="5">5 days</option><option value="7">A week · 7 days</option></select></div>
            <button className="search-submit" type="submit">Find my route <ArrowRight size={18}/></button>
          </form>
        </div>
        <div className="hero-note"><span><ShieldCheck size={15}/> Thoughtful travel planning</span><span><MapPinned size={15}/> More than A to B</span><span><Sparkles size={15}/> Hidden gems included</span></div>
      </div>
      <div className="hero-carousel-tools">
        <div className="hero-carousel-caption"><span>{activeHero.label}</span><b>{String(heroIndex + 1).padStart(2, '0')} <i/> {String(heroSlides.length).padStart(2, '0')}</b></div>
        <div className="hero-carousel-controls">
          <button type="button" onClick={showPrevious} aria-label="Previous hero image"><ArrowLeft size={17}/></button>
          <div className="hero-carousel-dots">{heroSlides.map((slide, index) => <button type="button" key={slide.label} onClick={() => setHeroIndex(index)} className={index === heroIndex ? 'active' : ''} aria-label={`Show ${slide.label}`} aria-current={index === heroIndex ? 'true' : undefined}/>)}</div>
          <button type="button" onClick={showNext} aria-label="Next hero image"><ArrowRight size={17}/></button>
        </div>
      </div>
      <a href="#discover" className="scroll-cue"><ArrowDown size={15}/> SCROLL TO EXPLORE</a>
    </section>
    <section className="intro-strip" id="discover"><div className="wrap intro-grid"><div><div className="eyebrow">A BETTER WAY TO GET THERE</div><h2>Every great trip has<br/><em>a few happy detours.</em></h2></div><p>Most maps help you arrive. GoBeyond helps you experience everything worth seeing along the way. Choose a route, find a beautiful place to stay, and make every stop count.</p><div className="intro-stats"><div><strong>3×</strong><span>route perspectives</span></div><div><strong>100s</strong><span>ideas for detours</span></div><div><strong>1</strong><span>trip worth remembering</span></div></div></div></section>
    <section className="section wrap"><div className="section-heading"><div><div className="eyebrow">PLACES WITH A PULSE</div><h2>Somewhere <em>worth going.</em></h2></div><Link to="/destinations" className="text-link">Explore all places <ArrowUpRight size={16}/></Link></div>
      <div className="destination-grid home-destinations">{destinations.slice(0,4).map((d,i)=><DestinationCard key={d.slug} destination={d} featured={i===0}/>)}</div>
    </section>
    <section className="route-feature"><div className="route-feature-image"/><div className="route-feature-content"><div className="eyebrow eyebrow-light">THE JOURNEY IS THE DESTINATION</div><h2>Three ways to get there.<br/><em>One unforgettable trip.</em></h2><p>Compare the fastest road, the scenic way and the stops in between. Your route should feel like yours.</p><Link to="/routes" className="button button-light">Explore routes <ArrowRight size={17}/></Link><div className="route-feature-caption"><span>WESTERN GHATS, INDIA</span><span>15° 10' N / 75° 05' E</span></div></div></section>
    <section className="section wrap"><div className="section-heading"><div><div className="eyebrow">STAY A LITTLE LONGER</div><h2>Places to <em>call yours.</em></h2></div><Link to="/hotels" className="text-link">Find your stay <ArrowUpRight size={16}/></Link></div><div className="stay-grid">{hotels.slice(0,3).map(h=><HotelCard key={h.id} hotel={h}/>)}</div></section>
    <section className="closing-cta"><div className="closing-orbit orbit-one"/><div className="closing-orbit orbit-two"/><div className="wrap closing-inner"><span className="eyebrow eyebrow-light">YOUR NEXT CHAPTER STARTS HERE</span><h2>Go a little <em>further.</em></h2><p>Pick a place. We'll help with the beautiful bits in between.</p><Link to="/plan" className="button button-coral">Start planning <ArrowRight size={17}/></Link></div></section>
  </main>;
}

function usePaged<T>(items: T[], size: number, resetKey: string) {
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil(items.length / size));
  useEffect(() => { setPage(1); }, [resetKey]);
  const current = Math.min(page, pages);
  return { page: current, pages, slice: items.slice((current - 1) * size, current * size), setPage };
}

function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange: (p: number) => void }) {
  if (pages <= 1) return null;
  const go = (p: number) => { onChange(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  return <nav className="pagination" aria-label="Pagination">
    <button type="button" className="page-btn page-arrow" disabled={page === 1} onClick={() => go(page - 1)} aria-label="Previous page"><ArrowLeft size={16}/></button>
    {Array.from({ length: pages }, (_, i) => i + 1).map(p => <button type="button" key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => go(p)} aria-label={`Page ${p}`} aria-current={p === page ? 'page' : undefined}>{String(p).padStart(2, '0')}</button>)}
    <button type="button" className="page-btn page-arrow" disabled={page === pages} onClick={() => go(page + 1)} aria-label="Next page"><ArrowRight size={16}/></button>
    <span className="page-count">PAGE {String(page).padStart(2, '0')} / {String(pages).padStart(2, '0')}</span>
  </nav>;
}

function DestinationCard({ destination, featured = false }: { destination: Destination; featured?: boolean }) {
  return <Link to={`/destinations/${destination.slug}`} className={`destination-card ${featured?'destination-featured':''}`}><img src={destination.image} alt={destination.name} loading="lazy"/><div className="destination-shade"/><div className="destination-top"><span>{destination.tag}</span><span className="rating-pill"><Star size={12} fill="currentColor"/> {destination.rating}</span></div><div className="destination-copy"><span>{destination.state}</span><h3>{destination.name}</h3><p>{destination.description.slice(0,86)}…</p><b>Explore place <ArrowUpRight size={16}/></b></div></Link>;
}

function ExplorePage() {
  const [query,setQuery] = useState(''); const [filter,setFilter] = useState('All places');
  const visible = destinations.filter(d => `${d.name} ${d.state} ${d.tag}`.toLowerCase().includes(query.toLowerCase()) && (filter==='All places' || (filter==='Coast' && d.tag.toLowerCase().includes('coast')) || (filter==='Nature' && ['coorg','munnar','ooty'].includes(d.slug)) || (filter==='Culture' && ['hampi','goa'].includes(d.slug))));
  const paged = usePaged(visible, 6, `${query}|${filter}`);
  return <main className="page-main explore-page"><section className="page-hero page-hero-dest"><div className="page-hero-bg"/><div className="wrap page-hero-content"><div className="eyebrow eyebrow-light">CURATED FOR THE CURIOUS</div><h1>Find your <em>somewhere.</em></h1><p>From slow coastlines to mountain mornings, find a place that feels like a world away.</p><div className="page-search"><Search size={18}/><input placeholder="Search places, states or experiences…" value={query} onChange={e=>setQuery(e.target.value)}/></div></div></section>
    <section className="section wrap"><div className="filter-row"><div><div className="eyebrow">THE GO BEYOND COLLECTION</div><h2>Places to <em>explore.</em></h2></div><div className="filter-chips">{['All places','Coast','Nature','Culture'].map(f=><button key={f} onClick={()=>setFilter(f)} className={`filter-chip ${filter===f?'active':''}`}>{f}</button>)}</div></div>
      {visible.length ? <><div className="destination-grid explore-grid">{paged.slice.map(d=><DestinationCard key={d.slug} destination={d}/>)}</div><Pagination page={paged.page} pages={paged.pages} onChange={paged.setPage}/></> : <EmptyState title="No places found" copy="Try another destination or clear your filters."/>}
    </section></main>;
}

function DestinationPage() {
  const {slug=''} = useParams(); const navigate=useNavigate(); const destination=destinations.find(d=>d.slug===slug) || destinations[0];
  const extraImages = [destination.image,image('photo-1470770841072-f978cf4d019e',900),image('photo-1501785888041-af3ef285b470',900)];
  return <main className="page-main detail-page"><section className="destination-detail-hero" style={{backgroundImage:`linear-gradient(90deg,rgba(15,32,25,.82),rgba(15,32,25,.16)),url(${destination.image})`}}><div className="wrap detail-hero-content"><Link to="/destinations" className="back-link back-light"><ArrowLeft size={15}/> All destinations</Link><div className="eyebrow eyebrow-light">{destination.state.toUpperCase()}</div><h1>{destination.name}<em>.</em></h1><p>{destination.description}</p><div className="detail-meta"><span><Star size={15} fill="currentColor"/> {destination.rating} traveller score</span><span><CalendarDays size={15}/> Ideal for {destination.days} days</span></div><button className="button button-coral" onClick={()=>navigate(`/plan?destination=${destination.name}&days=${destination.days}`)}>Plan this escape <ArrowRight size={17}/></button></div></section>
    <section className="section wrap"><div className="detail-columns"><div><div className="eyebrow">DON'T MISS THESE</div><h2>The <em>good stuff.</em></h2><p className="section-lede">A few memorable stops to make your time here count.</p><div className="highlight-list">{destination.highlights.map((h,i)=><div className="highlight-item" key={h}><span>0{i+1}</span><b>{h}</b><ArrowUpRight size={16}/></div>)}</div></div><div className="detail-gallery"><img src={extraImages[0]} alt={destination.name}/><img src={extraImages[1]} alt={`${destination.name} scenery`}/><img src={extraImages[2]} alt={`${destination.name} landscape`}/></div></div></section>
    <section className="detail-stay-band"><div className="wrap detail-stay-inner"><div><div className="eyebrow eyebrow-light">MAKE A NIGHT OF IT</div><h2>Find a stay <em>nearby.</em></h2></div><Link to={`/hotels?location=${destination.name}`} className="button button-light">Browse stays <ArrowRight size={16}/></Link></div></section>
  </main>;
}

function RouteFinderPage() {
  const [params] = useSearchParams(); const [from,setFrom]=useState(params.get('from')||'Bengaluru'); const [to,setTo]=useState(params.get('to')||'Goa'); const [selected,setSelected]=useState(0); const [searched,setSearched]=useState(true);
  const routeOptions = useMemo(()=>routesFor(from,to),[from,to]); const active=routeOptions[Math.min(selected,routeOptions.length-1)]; const navigate=useNavigate();
  useEffect(()=>setSelected(0),[from,to]);
  return <main className="page-main routes-page"><section className="route-page-head"><div className="wrap"><div className="eyebrow">GO BEYOND THE HIGHWAY</div><h1>Find your <em>way there.</em></h1><p>Compare route styles and find worthwhile stops along the way.</p><form className="route-form" onSubmit={e=>{e.preventDefault();setSearched(true);setSelected(0);}}><div className="route-input"><MapPin size={17}/><div><label>FROM</label><input value={from} onChange={e=>setFrom(e.target.value)} list="route-cities" required/></div></div><div className="route-swap"><ArrowRight size={17}/></div><div className="route-input"><Navigation size={17}/><div><label>TO</label><input value={to} onChange={e=>setTo(e.target.value)} list="route-dests" required/></div></div><button className="button button-dark">Discover routes <ArrowRight size={16}/></button><datalist id="route-cities"><option>Bengaluru</option><option>Mysuru</option></datalist><datalist id="route-dests">{destinations.map(d=><option key={d.slug}>{d.name}</option>)}</datalist></form><div className="route-hint"><Sparkles size={14}/> Currently featuring curated sample corridors. Custom entries use the closest demo corridor as a preview.</div></div></section>
    <section className="section wrap route-results"><div className="results-heading"><div><div className="eyebrow">{searched?'YOUR ROUTE OPTIONS':'ROUTE OPTIONS'}</div><h2>{from} <span>to</span> {to}</h2><p>Choose the route that fits the way you like to travel.</p></div><div className="results-count"><RouteIcon size={19}/><b>{routeOptions.length} ways</b><span>to make the journey</span></div></div>
      <div className="route-layout"><div className="route-options">{routeOptions.map((r,i)=><button key={r.id} onClick={()=>setSelected(i)} className={`route-option ${selected===i?'selected':''}`}><div className="route-option-top"><span className="route-label" style={{background:`${r.color}18`,color:r.color}}><span style={{background:r.color}}/>{r.label}</span><span className="route-distance">{r.distance} km</span></div><h3>{r.name}</h3><p>{r.description}</p><div className="route-option-stats"><span><Clock3 size={14}/>{r.time}</span><span><Wallet size={14}/>{money(r.toll)} toll</span><span><Star size={14} fill="currentColor"/>{r.rating}</span></div><div className="route-option-bottom"><span>{r.cities.join(' · ')}</span><span className="route-select-icon">{selected===i?<Check size={17}/>:<ArrowRight size={17}/>}</span></div></button>)}</div>
      <div className="route-map-column"><RouteMap route={active}/><div className="map-caption"><span><i className="map-legend-dot"/> Selected route</span><span><i className="map-legend-pin"/> Places to stop</span><span className="map-caption-note">Illustrative corridor map</span></div><div className="selected-route-summary"><div><span>YOUR ROUTE</span><b>{active.distance} km <small>·</small> {active.time}</b></div><button className="button button-coral" onClick={()=>navigate(`/plan?origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}&route=${active.id}`)}>Plan this journey <ArrowRight size={16}/></button></div></div></div>
      <div className="stops-heading"><div><div className="eyebrow">WORTH THE DETOUR</div><h2>Make a stop. <em>Make a memory.</em></h2></div><span>{active.stops.length} curated stops on this route</span></div><div className="stop-grid">{active.stops.map((s,i)=><div className="stop-card" key={s.name}><div className="stop-photo"><img src={s.image} alt={s.name}/><span>STOP 0{i+1}</span></div><div className="stop-copy"><div className="stop-type">{s.type} <span>· {s.detour} detour</span></div><h3>{s.name}</h3><p>{s.note}</p></div></div>)}</div>
    </section></main>;
}

function RouteMap({route}:{route:RouteOption}) {
  const container=useRef<HTMLDivElement>(null); const map=useRef<any>(null); const markers=useRef<any[]>([]); const [status,setStatus]=useState(''); const key=import.meta.env.VITE_MAPTILER_API_KEY as string|undefined;
  useEffect(()=>{
    if(!container.current) return;
    const lib=(window as any).maplibregl;
    if(!lib||!key){setStatus(!key?'Add a MapTiler key to load the interactive map.':'Map preview unavailable.');return;}
    const instance=new lib.Map({container:container.current,style:`https://api.maptiler.com/maps/streets-v2/style.json?key=${encodeURIComponent(key)}`,center:route.coords[0],zoom:5.5,attributionControl:true});
    map.current=instance; instance.addControl(new lib.NavigationControl({showCompass:false}),'top-right');
    instance.on('load',()=>{instance.addSource('gb-route',{type:'geojson',data:{type:'Feature',geometry:{type:'LineString',coordinates:route.coords},properties:{}}});instance.addLayer({id:'gb-route-casing',type:'line',source:'gb-route',layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':'#fff','line-width':9,'line-opacity':.9}});instance.addLayer({id:'gb-route-line',type:'line',source:'gb-route',layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':route.color,'line-width':5}});
      markers.current.forEach(marker=>marker.remove()); markers.current=[];
      route.stops.forEach((stop,i)=>{const el=document.createElement('div');el.className='gb-map-pin';el.innerHTML=`<span>${i+1}</span>`;markers.current.push(new lib.Marker({element:el,anchor:'bottom'}).setLngLat([stop.lng,stop.lat]).addTo(instance));});
      const bounds=new lib.LngLatBounds();route.coords.forEach((p)=>bounds.extend(p));instance.fitBounds(bounds,{padding:70,maxZoom:7.4});
    });
    instance.on('error',(e:any)=>{if(e?.error?.status===401||e?.error?.status===403)setStatus('MapTiler key rejected. Check its domain restrictions.');});
    return ()=>{markers.current.forEach(marker=>marker.remove());markers.current=[];instance.remove();map.current=null;};
  },[key]);
  useEffect(()=>{const instance=map.current;if(!instance||!instance.isStyleLoaded())return;const source=instance.getSource('gb-route');if(source){source.setData({type:'Feature',geometry:{type:'LineString',coordinates:route.coords},properties:{}});const lib=(window as any).maplibregl;markers.current.forEach(marker=>marker.remove());markers.current=[];route.stops.forEach((stop,i)=>{const el=document.createElement('div');el.className='gb-map-pin';el.innerHTML=`<span>${i+1}</span>`;markers.current.push(new lib.Marker({element:el,anchor:'bottom'}).setLngLat([stop.lng,stop.lat]).addTo(instance));});const b=new lib.LngLatBounds();route.coords.forEach(p=>b.extend(p));instance.fitBounds(b,{padding:70,maxZoom:7.4});}},[route]);
  return <div className="route-map-shell"><div ref={container} className="route-map"/>{status&&<div className="map-fallback"><MapPinned size={30}/><b>Map preview</b><span>{status}</span><small>{route.cities.join(' → ')}</small></div>}<div className="map-top-badge"><span/> ROUTE PREVIEW</div></div>;
}

function PlanPage() {
  const [params]=useSearchParams(); const [origin,setOrigin]=useState(params.get('origin')||'Bengaluru'); const [destination,setDestination]=useState(params.get('destination')||'Goa'); const [days,setDays]=useState(Number(params.get('days')||4)); const [travellers,setTravellers]=useState(2); const [budget,setBudget]=useState(25000); const [startDate,setStartDate]=useState(''); const [interest,setInterest]=useState('A little bit of everything'); const [generated,setGenerated]=useState(false); const [saved,setSaved]=useState(false); const [trips,setTrips]=useStoredState<SavedTrip[]>('gb-trips',[]); const navigate=useNavigate(); const route=routesFor(origin,destination)[0];
  const generate=()=>{setGenerated(true);setSaved(false);};
  const itinerary=Array.from({length:days},(_,i)=>({day:i+1,title:i===0?`Arrive & settle into ${destination}`:i===days-1?'One last beautiful morning':`${destination} at your own pace`,activities:i===0?['Check in and take a breather','Explore a nearby local favourite','Dinner somewhere worth lingering']:i===days-1?['Slow breakfast','One final local discovery','Head home with a camera roll full of memories']:['A signature local experience','A scenic stop or hidden gem','Free time to explore and unwind']}));
  const saveTrip=()=>{const trip:SavedTrip={id:`trip-${Date.now()}`,origin,destination,days,travellers,budget,startDate,routeName:route.name,createdAt:new Date().toISOString(),itinerary};setTrips([trip,...trips]);setSaved(true);};
  return <main className="page-main plan-page"><section className="plan-head"><div className="wrap"><div className="eyebrow">A TRIP THAT FEELS LIKE YOURS</div><h1>Let's make a <em>plan.</em></h1><p>Start with the basics. We'll sketch out a thoughtful trip you can make your own.</p></div></section><section className="section wrap plan-layout"><div className="plan-form-card"><div className="form-card-heading"><div><span className="eyebrow">01 / THE DETAILS</span><h2>Your next <em>escape.</em></h2></div><span className="form-step">STEP 1 OF 1</span></div>
    <div className="form-grid"><label className="form-field"><span>Starting from</span><div><MapPin size={17}/><input value={origin} onChange={e=>setOrigin(e.target.value)} required/></div></label><label className="form-field"><span>Going to</span><div><Navigation size={17}/><select value={destination} onChange={e=>setDestination(e.target.value)}>{destinations.map(d=><option key={d.slug}>{d.name}</option>)}</select></div></label><label className="form-field"><span>Departure date</span><div><CalendarDays size={17}/><input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)}/></div></label><label className="form-field"><span>Trip length</span><div><Clock3 size={17}/><select value={days} onChange={e=>setDays(Number(e.target.value))}>{[2,3,4,5,6,7,8,10].map(d=><option key={d} value={d}>{d} days</option>)}</select></div></label><label className="form-field"><span>Travellers</span><div><Users size={17}/><select value={travellers} onChange={e=>setTravellers(Number(e.target.value))}>{[1,2,3,4,5,6,7,8].map(n=><option key={n} value={n}>{n} {n===1?'traveller':'travellers'}</option>)}</select></div></label><label className="form-field"><span>Total trip budget</span><div><Wallet size={17}/><select value={budget} onChange={e=>setBudget(Number(e.target.value))}>{[12000,18000,25000,35000,50000,75000,100000].map(n=><option key={n} value={n}>{money(n)}</option>)}</select></div></label></div>
    <div className="interest-block"><span className="field-title">What sounds like your kind of trip?</span><div className="interest-options">{['A little bit of everything','Nature & outdoors','Food & local culture','Slow & restorative'].map(v=><button key={v} type="button" onClick={()=>setInterest(v)} className={interest===v?'active':''}>{v}</button>)}</div></div>
    <button className="button button-coral button-wide" onClick={generate}><Sparkles size={17}/> Build my trip <ArrowRight size={17}/></button><p className="form-disclaimer"><ShieldCheck size={14}/> No sign-up needed. Your plan stays on this device.</p></div>
    <aside className="plan-side"><div className="plan-side-image" style={{backgroundImage:`url(${knownDestination(destination).image})`}}><div className="plan-side-label"><Sparkles size={14}/> YOUR NEXT ESCAPE</div></div><div className="plan-side-copy"><div className="eyebrow">A QUICK LOOK</div><h3>{origin} <span>→</span> {destination}</h3><div className="plan-side-stats"><span><CalendarDays size={15}/>{days} days</span><span><Users size={15}/>{travellers} travellers</span><span><Wallet size={15}/>{money(budget)}</span></div><p>We'll use your preferences to suggest a comfortable pace, memorable places and a budget that makes sense.</p></div></aside>
    </section>
    {generated&&<section className="section wrap generated-section"><div className="generated-heading"><div><div className="eyebrow">YOUR FIRST DRAFT IS READY</div><h2>A little plan for <em>{destination}.</em></h2><p>Here's a flexible {days}-day outline based on {interest.toLowerCase()}.</p></div><span className="generated-badge"><CheckCircle2 size={16}/> Draft created</span></div><div className="generated-grid"><div className="itinerary-days">{itinerary.map(day=><div className="itinerary-day" key={day.day}><span className="day-number">DAY {String(day.day).padStart(2,'0')}</span><div><h3>{day.title}</h3><ul>{day.activities.map(a=><li key={a}>{a}</li>)}</ul></div></div>)}</div><aside className="budget-card"><span className="eyebrow">TRIP SNAPSHOT</span><h3>{destination}<br/><em>at your own pace.</em></h3><div className="budget-line"><span>Budget target</span><b>{money(budget)}</b></div><div className="budget-line"><span>Est. per traveller</span><b>{money(Math.round(budget/travellers))}</b></div><div className="budget-line"><span>Suggested route</span><b>{route.distance} km</b></div><button className="button button-dark button-wide" onClick={saveTrip}>{saved?<><Check size={17}/> Saved to My journeys</>:<>Save this trip <ArrowRight size={16}/></>}</button><button className="text-link budget-secondary" onClick={()=>navigate(`/routes?from=${encodeURIComponent(origin)}&to=${encodeURIComponent(destination)}`)}>Compare route options <ArrowUpRight size={15}/></button></aside></div></section>}
  </main>;
}

function HotelCard({hotel, compact=false}:{hotel:HotelItem;compact?:boolean}) {
  const [saved,setSaved]=useStoredState<string[]>('gb-saved-hotels',[]); const [detailsOpen,setDetailsOpen]=useState(false); const isSaved=saved.includes(hotel.id);
  return <><article className={`hotel-card ${compact?'hotel-card-compact':''}`}><div className="hotel-photo"><img src={hotel.image} alt={hotel.name} loading="lazy"/><button className={`save-heart ${isSaved?'saved':''}`} onClick={()=>setSaved(isSaved?saved.filter(x=>x!==hotel.id):[...saved,hotel.id])} aria-label={isSaved?'Remove from saved':'Save hotel'}><Heart size={17} fill={isSaved?'currentColor':'none'}/></button>{hotel.badge&&<span className="hotel-badge">{hotel.badge}</span>}</div><div className="hotel-info"><div className="hotel-location"><MapPin size={13}/>{hotel.area}, {hotel.location}</div><h3>{hotel.name}</h3><p>{hotel.description}</p><div className="hotel-rating"><Star size={14} fill="currentColor"/><b>{hotel.rating}</b><span>({hotel.reviews} reviews)</span><i/>{hotel.type}</div><div className="hotel-card-bottom"><div><span>FROM</span><strong>{money(hotel.price)}<small> / night</small></strong></div><button className="hotel-view" onClick={()=>setDetailsOpen(true)}>View stay <ArrowUpRight size={15}/></button></div></div></article>{detailsOpen&&<div className="modal-backdrop" onClick={()=>setDetailsOpen(false)}><div className="hotel-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setDetailsOpen(false)} aria-label="Close details"><X size={18}/></button><img src={hotel.image} alt={hotel.name}/><div className="hotel-modal-copy"><div className="hotel-location"><MapPin size={13}/>{hotel.area}, {hotel.location}</div><h2>{hotel.name}</h2><p>{hotel.description}</p><div className="modal-amenities">{hotel.amenities.map(a=><span key={a}><Check size={13}/>{a}</span>)}</div><div className="modal-price"><span>Indicative sample price</span><b>{money(hotel.price)} <small>/ night</small></b></div><small className="modal-disclaimer">Demo property only. Live availability and booking are not connected.</small></div></div></div>}</>;
}

function HotelsPage() {
  const [params]=useSearchParams(); const [location,setLocation]=useState(params.get('location')||''); const [maxPrice,setMaxPrice]=useState(10000); const [category,setCategory]=useState('All stays'); const [sort,setSort]=useState('Recommended'); const [savedOnly,setSavedOnly]=useState(false); const [saved]=useStoredState<string[]>('gb-saved-hotels',[]);
  const filtered=hotels.filter(h=>(!location||`${h.location} ${h.area}`.toLowerCase().includes(location.toLowerCase()))&&h.price<=maxPrice&&(category==='All stays'||h.type.toLowerCase().includes(category.toLowerCase()))&&(!savedOnly||saved.includes(h.id)));
  const sorted=[...filtered].sort((a,b)=>sort==='Price: low to high'?a.price-b.price:sort==='Top rated'?b.rating-a.rating:0);
  const paged = usePaged(sorted, 6, `${location}|${maxPrice}|${category}|${sort}|${savedOnly}`);
  return <main className="page-main hotels-page"><section className="hotels-hero"><div className="hotels-hero-photo"/><div className="hotels-hero-overlay"/><div className="wrap hotels-hero-content"><div className="eyebrow eyebrow-light">STAY SOMEWHERE SPECIAL</div><h1>Find your <em>place to land.</em></h1><p>Thoughtful stays for the nights that make a trip feel complete.</p><div className="hotel-searchbar"><div><MapPin size={17}/><div><label>DESTINATION OR AREA</label><input placeholder="Try Coorg, Goa, Gokarna…" value={location} onChange={e=>setLocation(e.target.value)}/></div></div><button onClick={()=>setLocation('')}><X size={15}/> Clear</button></div></div></section>
    <section className="section wrap"><div className="hotel-results-head"><div><div className="eyebrow">THE GOOD-NIGHT GUIDE</div><h2>Stays worth <em>staying for.</em></h2><p>{sorted.length} curated sample properties to browse</p></div><div className="hotel-sort"><label>SORT BY</label><select value={sort} onChange={e=>setSort(e.target.value)}><option>Recommended</option><option>Price: low to high</option><option>Top rated</option></select></div></div>
      <div className="hotel-filterbar"><div className="filter-group"><SlidersHorizontal size={16}/><span>FILTER BY</span>{['All stays','Resort','Beach','Estate'].map(f=><button onClick={()=>setCategory(f)} className={category===f?'active':''} key={f}>{f}</button>)}</div><label className="price-filter">UP TO {money(maxPrice)}<input type="range" min="2500" max="10000" step="500" value={maxPrice} onChange={e=>setMaxPrice(Number(e.target.value))}/></label><button className={`saved-filter ${savedOnly?'active':''}`} onClick={()=>setSavedOnly(!savedOnly)}><Heart size={15} fill={savedOnly?'currentColor':'none'}/> Saved ({saved.length})</button></div>
      {sorted.length?<><div className="hotel-grid">{paged.slice.map(h=><HotelCard key={h.id} hotel={h}/>)}</div><Pagination page={paged.page} pages={paged.pages} onChange={paged.setPage}/></>:<EmptyState title="No stays match just yet" copy="Try widening your location or price range." action={<button className="button button-dark" onClick={()=>{setLocation('');setMaxPrice(10000);setCategory('All stays');setSavedOnly(false);}}>Reset filters</button>}/>}</section>
    <section className="hotel-promo"><div className="wrap hotel-promo-inner"><div><div className="eyebrow eyebrow-light">A PLACE TO COME BACK TO</div><h2>Good trips need<br/><em>good nights.</em></h2></div><p>These are sample listings to help you explore the experience. Live inventory, rates and reservations are not connected in this demo.</p></div></section>
  </main>;
}

function MyTripsPage() {
  const [trips,setTrips]=useStoredState<SavedTrip[]>('gb-trips',[]); const navigate=useNavigate();
  const paged = usePaged(trips, 4, String(trips.length));
  return <main className="page-main trips-page"><section className="mytrips-head"><div className="wrap"><div className="eyebrow eyebrow-light">YOUR LITTLE COLLECTION OF GETAWAYS</div><h1>My <em>journeys.</em></h1><p>Trips you have saved on this device, ready when you are.</p></div></section><section className="section wrap"><div className="mytrips-bar"><div><div className="eyebrow">YOUR TRAVEL SHELF</div><h2>{trips.length?`${trips.length} saved ${trips.length===1?'journey':'journeys'}`:'A fresh page.'}</h2></div><button className="button button-coral" onClick={()=>navigate('/plan')}>Plan a new trip <Plus size={16}/></button></div>
    {trips.length?<><div className="saved-trip-grid">{paged.slice.map(t=><article className="saved-trip-card" key={t.id}><img src={knownDestination(t.destination).image} alt={t.destination}/><div className="saved-trip-info"><span className="eyebrow">{t.days} DAYS · {t.travellers} TRAVELLERS</span><h3>{t.origin} <span>→</span> {t.destination}</h3><p>{t.routeName}</p><div className="saved-trip-bottom"><span>{t.startDate||'Date flexible'} · {money(t.budget)}</span><button onClick={()=>navigate(`/itinerary/${t.id}`)}>Open trip <ArrowRight size={15}/></button></div></div><button className="delete-trip" title="Delete trip" onClick={()=>setTrips(trips.filter(x=>x.id!==t.id))}><X size={16}/></button></article>)}</div><Pagination page={paged.page} pages={paged.pages} onChange={paged.setPage}/></>:<EmptyState title="No journeys saved yet" copy="Your first road trip is only a few details away. Build a plan and save it here." action={<button className="button button-coral" onClick={()=>navigate('/plan')}>Create your first trip <ArrowRight size={16}/></button>}/>}
  </section></main>;
}

function ItineraryPage() {
  const {id=''}=useParams(); const [trips]=useStoredState<SavedTrip[]>('gb-trips',[]); const trip=trips.find(t=>t.id===id);
  if(!trip)return <main className="section wrap page-plain"><EmptyState title="This journey isn't here" copy="It may have been removed or saved in a different browser." action={<Link to="/my-trips" className="button button-dark">Back to My journeys</Link>}/></main>;
  return <main className="page-main trips-page"><section className="plan-head"><div className="wrap"><Link to="/my-trips" className="back-link"><ArrowLeft size={15}/> My journeys</Link><div className="eyebrow">YOUR SAVED TRIP</div><h1>{trip.origin} <em>to {trip.destination}.</em></h1><p>{trip.days} days · {trip.travellers} travellers · {money(trip.budget)} total budget</p></div></section><section className="section wrap generated-section"><div className="generated-heading"><div><div className="eyebrow">YOUR ITINERARY</div><h2>The shape of <em>your trip.</em></h2></div><span className="generated-badge"><CheckCircle2 size={16}/> Saved locally</span></div><div className="itinerary-days">{trip.itinerary.map(d=><div className="itinerary-day" key={d.day}><span className="day-number">DAY {String(d.day).padStart(2,'0')}</span><div><h3>{d.title}</h3><ul>{d.activities.map(a=><li key={a}>{a}</li>)}</ul></div></div>)}</div><div className="saved-trip-note">This is a flexible demo itinerary. You can keep it as a starting point and adjust the outline as you travel.</div></section></main>;
}

function EmptyState({title,copy,action}:{title:string;copy:string;action?:React.ReactNode}) { return <div className="empty-state"><div className="empty-icon"><Compass size={26}/></div><h3>{title}</h3><p>{copy}</p>{action}</div>; }
function NotFound() { return <main className="section wrap page-plain"><EmptyState title="Looks like we've wandered off route" copy="The page you're looking for isn't here." action={<Link to="/" className="button button-dark">Back home <ArrowRight size={15}/></Link>}/></main>; }

export default function App() { return <BrowserRouter><AppShell/></BrowserRouter>; }
