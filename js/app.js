// --- CONFIG ---
const INVITE = {
  name: 'Mthabisi Dube',
  age: '21',
  date: '2025-08-30',
  time: '14:00',
  venue: 'Jullies Venue',
  mapsLink: '',
  rsvpName: 'Dube Family',
  rsvpPhone: '+27 71 423 2261',
  dressCode: '“Look sharp — it’s party time!” ✨',
  gallery: [
'https://af6815798a.imgdist.com/pub/bfra/knkjywkm/6xw/rh1/kat/Mthabisi%20Dube%20y1-Picsart.jpg',
'https://af6815798a.imgdist.com/pub/bfra/knkjywkm/5ux/ejd/d08/Mthabisi%20Dube%20y2-Picsart.jpg',
'https://af6815798a.imgdist.com/pub/bfra/knkjywkm/1qw/p9o/0jn/HBD%203%20Mthabisi%20Dube.PNG',
'https://af6815798a.imgdist.com/pub/bfra/knkjywkm/pcy/8an/t3w/HBD%201%20Mthabisi%20Dube.PNG'
]
};

// --- Init UI ---
const kidName = document.getElementById('kidName');
const age = document.getElementById('age');
const turningText = document.getElementById('turningText');
const venue = document.getElementById('venue');
const whenDate = document.getElementById('whenDate');
const whenTime = document.getElementById('whenTime');
const dateHuman = document.getElementById('dateHuman');
const rsvpTo = document.getElementById('rsvpTo');
const dress = document.getElementById('dress');

if (INVITE.name && INVITE.name !== 'Birthday Party') kidName.textContent = `${INVITE.name}'s Birthday`;
if (INVITE.age) age.textContent = INVITE.age; else turningText.style.display='none';
if (INVITE.venue) venue.innerHTML = INVITE.mapsLink ? `<a href="${INVITE.mapsLink}" target="_blank" rel="noopener">${INVITE.venue}</a>` : INVITE.venue;

const eventDate = new Date(`${INVITE.date}T${INVITE.time || '00:00'}:00+02:00`);
const longDate = eventDate.toLocaleDateString(undefined,{weekday:'short', day:'2-digit', month:'short', year:'numeric'});
whenDate.textContent = longDate;
whenTime.textContent = eventDate.toLocaleTimeString([], {hour:'numeric', minute:'2-digit'});
dateHuman.textContent = longDate;
rsvpTo.textContent = INVITE.rsvpName || 'Host';
dress.textContent = INVITE.dressCode || 'Pink & White';

// --- Countdown ---
const dEl = document.getElementById('d');
const hEl = document.getElementById('h');
const mEl = document.getElementById('m');
const sEl = document.getElementById('s');
function tick(){
  const now = new Date();
  const diff = Math.max(0, eventDate - now);
  const d = Math.floor(diff/86400000);
  const h = Math.floor((diff%86400000)/3600000);
  const m = Math.floor((diff%3600000)/60000);
  const s = Math.floor((diff%60000)/1000);
  dEl.textContent = String(d).padStart(2,'0');
  hEl.textContent = String(h).padStart(2,'0');
  mEl.textContent = String(m).padStart(2,'0');
  sEl.textContent = String(s).padStart(2,'0');
}
tick(); setInterval(tick, 1000);

// --- Slider (FADE + blurred bg) ---
const slides = document.getElementById('slides');
const dots = document.getElementById('dots');

INVITE.gallery.slice(0,4).forEach((src,i)=>{
  const s = document.createElement('div'); s.className='slide' + (i===0 ? ' active' : '');

  const bg = document.createElement('div'); bg.className='bg';
  bg.style.backgroundImage = `url('${src}')`;
  s.appendChild(bg);

  const img = document.createElement('img'); img.src = src; img.alt = `Photo ${i+1}`; img.loading = 'lazy';
  s.appendChild(img);

  slides.appendChild(s);

  const d = document.createElement('div'); d.className='dot' + (i===0?' active':'');
  d.addEventListener('click', ()=> show(i));
  dots.appendChild(d);
});

let idx = 0, count = Math.min(4, INVITE.gallery.length), auto;
const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function show(n){
  idx = (n + count) % count;
  [...slides.children].forEach((el,i)=> el.classList.toggle('active', i===idx));
  [...dots.children].forEach((d,i)=> d.classList.toggle('active', i===idx));
}
function next(){ show(idx + 1); }
function prev(){ show(idx - 1); }
function play(){ stop(); auto = setInterval(next, 6000); }
function stop(){ if(auto){ clearInterval(auto); auto = null; } }

if(!prefersReducedMotion) play();

// Swipe
let startX=0, swiping=false;
slides.addEventListener('touchstart',e=>{ startX=e.touches[0].clientX; swiping=true; stop(); },{passive:true});
slides.addEventListener('touchmove',e=>{
  if(!swiping) return;
  const dx=e.touches[0].clientX-startX;
  if(Math.abs(dx)>40){ (dx<0?next:prev)(); swiping=false; }
},{passive:true});
slides.addEventListener('touchend',()=>{ swiping=false; if(!prefersReducedMotion) play(); });

// Keyboard
slides.tabIndex = 0;
slides.addEventListener('keydown', e=>{
  if(e.key==='ArrowRight'){ stop(); next(); if(!prefersReducedMotion) play(); }
  if(e.key==='ArrowLeft'){ stop(); prev(); if(!prefersReducedMotion) play(); }
});

// --- RSVP on WhatsApp (exact copy you wanted) ---
document.getElementById('btnRsvp').addEventListener('click',()=>{
  const msg = encodeURIComponent(
    `Hi Dube Family,\n` +
    `We'd like to RSVP for Mthabisi Dube's birthday on Sat, Aug 30, 2025 at Jullies Venue.\n` +
    `Looking forward to it!`
  );
  const phone = (INVITE.rsvpPhone||'').replace(/[^\d+]/g,'');
  const url = phone 
    ? `https://wa.me/${phone.replace('+','')}/?text=${msg}`
    : `https://wa.me/?text=${msg}`;
  window.open(url, '_blank');
});

// ---------------- Add to Calendar (AUTO-DETECT) ----------------
function toUtcStamp(d){
  return d.toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z';
}
function icsEscape(str){
  return String(str || '')
    .replace(/\\/g,'\\\\')
    .replace(/\n/g,'\\n')
    .replace(/,/g,'\\,')
    .replace(/;/g,'\\;');
}
document.getElementById('btnAddCal').addEventListener('click', ()=>{
  // Build event times (Africa/Johannesburg +02:00)
  const start = new Date(`${INVITE.date}T${INVITE.time || '00:00'}:00+02:00`);
  const end   = new Date(start.getTime() + 2*60*60*1000); // default 2 hours

  const title = `${INVITE.name ? INVITE.name + "'s " : ''}Birthday Party`;
  const desc  = "Let's celebrate!";
  const loc   = INVITE.venue || '';

  // ANDROID → Google Calendar
  const isAndroid = /android/i.test(navigator.userAgent);
  if (isAndroid) {
    const gcalUrl =
      `https://calendar.google.com/calendar/render?action=TEMPLATE` +
      `&text=${encodeURIComponent(title)}` +
      `&dates=${toUtcStamp(start)}/${toUtcStamp(end)}` +
      `&location=${encodeURIComponent(loc)}` +
      `&details=${encodeURIComponent(desc)}`;
    window.open(gcalUrl, '_blank');
    return;
  }

  // OTHERS → ICS file
  const ics =
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//PinkWhite Invite//EN
BEGIN:VEVENT
UID:${Date.now()}@invite
DTSTAMP:${toUtcStamp(new Date())}
DTSTART:${toUtcStamp(start)}
DTEND:${toUtcStamp(end)}
SUMMARY:${icsEscape(title)}
LOCATION:${icsEscape(loc)}
DESCRIPTION:${icsEscape(desc)}
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([ics], { type:'text/calendar;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'birthday-invite.ics';
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
});
// ----------------------------------------------------------------

// Hearts
const hearts = document.querySelector('.hearts');
for(let i=0;i<26;i++){
  const h = document.createElement('div'); h.className='heart';
  const size = 8 + Math.random()*12; h.style.width=h.style.height=size+'px';
  h.style.left = Math.random()*100 + 'vw';
  h.style.bottom = '-10vh';
  const dur = 8 + Math.random()*10; h.style.animation = `float ${dur}s linear ${Math.random()*-dur}s infinite`;
  h.style.background = Math.random()>.5 ? 'var(--pink)' : 'var(--pink-dark)';
  hearts.appendChild(h);
}

// --- Dad Message (play/stop toggle) ---
(() => {
  const btn = document.getElementById('playDadMessage');
  const audio = document.getElementById('dadAudio');
  if(!btn || !audio) return;

  const setLabel = (playing) => {
    btn.textContent = playing ? '⏸ Stop Message' : '▶ Message from Dad';
    btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
  };

  btn.addEventListener('click', async () => {
    try {
      if (audio.paused) {
        audio.currentTime = 0;
        await audio.play();
        setLabel(true);
      } else {
        audio.pause();
        audio.currentTime = 0;
        setLabel(false);
      }
    } catch (e) {
      alert('Please tap again to play the message.');
    }
  });

  audio.addEventListener('ended', () => setLabel(false));
})();
