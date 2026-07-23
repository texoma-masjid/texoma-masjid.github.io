import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   ISLAMIC CENTER OF TEXOMA — Moon & Stars Edition
   Palette: midnight indigo · moonlit silver · gold stars · twilight blue
   Motifs: crescent moon, 4-point sparkle stars, twinkling starfields
────────────────────────────────────────────────────────────────────────── */

const HEAD_INJECT = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,600&family=Jost:wght@200;300;400;500&family=Scheherazade+New:wght@400;700&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<style>
  :root {
    --night:#10173A; --nightD:#0A0F28; --indigo:#222C5E; --twilight:#34407A;
    --peri:#8E9ED6; --periD:#5A6BB0; --silver:#C4CCE6;
    --star:#E6D7A2; --gold:#C9A85C; --goldL:#DCC07A;
    --moon:#EDE8D6; --cream:#F1F2F8; --creamD:#E6E9F4;
    --mist:#FAFAFE; --ink:#1A1F38; --inkL:#6B7290;
  }
  *,*::before,*::after { box-sizing:border-box; }
  html { scroll-behavior:smooth; overflow-x:hidden; }
  html,body { margin:0; padding:0; width:100%; max-width:100%; }
  body { font-family:'Jost',sans-serif; background:var(--cream); color:var(--ink); }
  img { max-width:100%; }
  ::selection { background:#8E9ED655; }
  /* ── Responsive helpers (mobile ≤860px) ───────────────────────────── */
  .nav-burger { display:none; }
  .nav-mobile-menu { display:none; }
  @media (max-width:860px){
    .nav-links { display:none !important; }
    .nav-burger { display:flex !important; }
    .nav-mobile-menu { display:flex !important; }
    .resp-2col { grid-template-columns:1fr !important; gap:44px !important; }
    .resp-svc  { grid-template-columns:1fr !important; gap:4px !important; }
    .resp-cal  { grid-template-columns:1fr !important; }
    .resp-foot { grid-template-columns:1fr 1fr !important; gap:32px !important; }
    .hero-inner { padding:110px 24px 70px !important; }
  }
  @media (max-width:480px){
    .resp-foot { grid-template-columns:1fr !important; }
    .resp-2fields { grid-template-columns:1fr !important; }
  }
  .night-texture {
    background-image:
      radial-gradient(circle at 18% 30%, rgba(196,204,230,.05) 0%, transparent 8%),
      radial-gradient(circle at 72% 60%, rgba(230,215,162,.04) 0%, transparent 9%),
      radial-gradient(circle at 45% 85%, rgba(142,158,214,.04) 0%, transparent 7%);
  }
  .reveal       { opacity:0; transform:translateY(24px);  transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1); }
  .reveal-left  { opacity:0; transform:translateX(-28px); transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1); }
  .reveal-right { opacity:0; transform:translateX(28px);  transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1); }
  .reveal.in,.reveal-left.in,.reveal-right.in { opacity:1; transform:none; }
  .nav-link { position:relative; padding-bottom:3px; }
  .nav-link::after { content:''; position:absolute; bottom:0; left:0; right:100%; height:1px; background:var(--periD); transition:right .3s ease; }
  .nav-link:hover::after { right:0; }
  .nav-link:hover { color:var(--periD) !important; }
  .svc-row { border-top:1px solid rgba(90,107,176,.16); }
  .svc-row:last-child { border-bottom:1px solid rgba(90,107,176,.16); }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-thumb { background:#8E9ED666; border-radius:10px; }
  .prayer-active { background:linear-gradient(105deg,rgba(142,158,214,.20) 0%,rgba(201,168,92,.12) 100%) !important; }
  @keyframes twinkle  { 0%,100%{opacity:.25; transform:scale(.8);} 50%{opacity:1; transform:scale(1.1);} }
  @keyframes twinkle2 { 0%,100%{opacity:.9; transform:scale(1.05);} 50%{opacity:.3; transform:scale(.85);} }
  @keyframes float-m  { 0%,100%{transform:translateY(0) rotate(0deg);} 50%{transform:translateY(-10px) rotate(2deg);} }
  @keyframes drift-s  { 0%,100%{transform:translateX(0) translateY(0);} 50%{transform:translateX(5px) translateY(-4px);} }
  .tw1 { animation:twinkle  4s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
  .tw2 { animation:twinkle2 5.5s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
  .tw3 { animation:twinkle  6.5s ease-in-out infinite 1s; transform-box:fill-box; transform-origin:center; }
  .floatM { animation:float-m 11s ease-in-out infinite; }
  .driftS { animation:drift-s 14s ease-in-out infinite; }
</style>
`;

/* ── 4-point sparkle star ─────────────────────────────────────────────── */
function Star({ cx, cy, r=6, color="#E6D7A2", op=0.9, cls="" }) {
  const d = `M ${cx},${cy-r} Q ${cx},${cy} ${cx+r},${cy} Q ${cx},${cy} ${cx},${cy+r} Q ${cx},${cy} ${cx-r},${cy} Q ${cx},${cy} ${cx},${cy-r} Z`;
  return <path d={d} fill={color} opacity={op} className={cls}/>;
}
/* ── tiny round star ──────────────────────────────────────────────────── */
function Dot({ cx, cy, r=1.5, color="#C4CCE6", op=0.8, cls="" }) {
  return <circle cx={cx} cy={cy} r={r} fill={color} opacity={op} className={cls}/>;
}
/* ── 5-point star ─────────────────────────────────────────────────────── */
function Star5({ cx, cy, r=8, color="#E6D7A2", op=0.9, cls="" }) {
  let pts=[];
  for(let i=0;i<10;i++){ const ang=-Math.PI/2+i*Math.PI/5; const rad=i%2?r*0.42:r; pts.push(`${(cx+rad*Math.cos(ang)).toFixed(1)},${(cy+rad*Math.sin(ang)).toFixed(1)}`); }
  return <polygon points={pts.join(" ")} fill={color} opacity={op} className={cls}/>;
}

/* ── Crescent Moon ────────────────────────────────────────────────────── */
function Crescent({ cx, cy, R=44, d=0.72, color="#EDE8D6", op=1, glow=true, flip=false }) {
  const off=R*d, h=Math.sqrt(Math.max(R*R-(off/2)**2,0)), tx=off/2;
  const path=`M ${tx},${-h} A ${R},${R} 0 1 0 ${tx},${h} A ${R},${R} 0 0 1 ${tx},${-h} Z`;
  return (
    <g transform={`translate(${cx},${cy})${flip?" scale(-1,1)":""}`} opacity={op}>
      {glow && <circle cx={0} cy={0} r={R*1.15} fill={color} opacity={0.08}/>}
      <path d={path} fill={color}/>
    </g>
  );
}

/* ── Hero Night Sky (moon + scattered stars over the bottom) ──────────── */
function HeroSky() {
  return (
    <svg width="100%" viewBox="0 0 1400 600" preserveAspectRatio="xMidYMid slice"
      style={{position:"absolute",inset:0,zIndex:2,pointerEvents:"none"}}>
      {/* big crescent, upper right */}
      <g className="floatM"><Crescent cx={1140} cy={150} R={70} d={0.74} color="#EDE8D6" op={0.96}/></g>
      {/* scattered sparkle stars */}
      <Star cx={1240} cy={90}  r={9}  color="#E6D7A2" op={0.95} cls="tw1"/>
      <Star cx={1050} cy={250} r={6}  color="#C4CCE6" op={0.8}  cls="tw2"/>
      <Star cx={1280} cy={230} r={7}  color="#E6D7A2" op={0.85} cls="tw3"/>
      <Star cx={300}  cy={120} r={8}  color="#E6D7A2" op={0.9}  cls="tw2"/>
      <Star cx={180}  cy={300} r={6}  color="#C4CCE6" op={0.75} cls="tw1"/>
      <Star cx={520}  cy={80}  r={5}  color="#E6D7A2" op={0.8}  cls="tw3"/>
      <Star cx={760}  cy={170} r={6}  color="#C4CCE6" op={0.7}  cls="tw1"/>
      <Star5 cx={950} cy={120} r={7}  color="#E6D7A2" op={0.7}  cls="tw2"/>
      <Star5 cx={420} cy={230} r={6}  color="#C4CCE6" op={0.6}  cls="tw3"/>
      {/* dust of tiny stars */}
      {[[120,180],[250,210],[380,150],[600,120],[680,260],[840,90],[900,230],[1010,150],[1180,300],[1320,160],[1360,310],[80,240],[480,300],[720,300],[560,200]].map(([x,y],i)=>(
        <Dot key={i} cx={x} cy={y} r={1.6} color="#DDE3F2" op={0.7} cls={["tw1","tw2","tw3"][i%3]}/>
      ))}
    </svg>
  );
}

/* ── Starfield Divider ────────────────────────────────────────────────── */
function StarDivider({ topBg="#F1F2F8", botBg="#E6E9F4" }) {
  const uid=topBg.replace("#","t")+botBg.replace("#","b");
  return (
    <div style={{position:"relative",height:104,overflow:"hidden",background:topBg,flexShrink:0}}>
      <svg width="100%" height="100%" viewBox="0 0 1400 104" preserveAspectRatio="xMidYMid slice" style={{position:"absolute",inset:0,display:"block",width:"100%",height:"100%"}}>
        <defs>
          <linearGradient id={`sd${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={topBg} stopOpacity="1"/>
            <stop offset="100%" stopColor={botBg} stopOpacity="1"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="1400" height="104" fill={`url(#sd${uid})`}/>
        {/* faint connecting constellation line */}
        <path d="M120,58 L320,40 L520,62 L760,44 L1000,60 L1240,42 L1380,58"
          stroke="rgba(90,107,176,.18)" strokeWidth="1" fill="none"/>
        <Star cx={120}  cy={58} r={8} color="#C9A85C" op={0.6} cls="tw1"/>
        <Star cx={320}  cy={40} r={6} color="#8E9ED6" op={0.5} cls="tw2"/>
        <Star cx={520}  cy={62} r={9} color="#C9A85C" op={0.62} cls="tw3"/>
        <Star cx={760}  cy={44} r={6} color="#8E9ED6" op={0.5} cls="tw1"/>
        <Star cx={1000} cy={60} r={8} color="#C9A85C" op={0.58} cls="tw2"/>
        <Star cx={1240} cy={42} r={6} color="#8E9ED6" op={0.5} cls="tw3"/>
        <Crescent cx={1380} cy={58} R={16} d={0.72} color="#C9A85C" op={0.5} glow={false}/>
        {[[220,70],[420,52],[640,72],[880,52],[1120,70],[1320,52]].map(([x,y],i)=>(
          <Dot key={i} cx={x} cy={y} r={1.6} color="#9BA6CF" op={0.55} cls={["tw1","tw2","tw3"][i%3]}/>
        ))}
      </svg>
    </div>
  );
}

/* ── Corner Constellation ─────────────────────────────────────────────── */
function CornerStars({ side="left", op=0.5 }) {
  const L=side==="left", f=v=>L?v:220-v;
  return (
    <svg width="220" height="260" viewBox="0 0 220 260"
      style={{position:"absolute",[L?"left":"right"]:0,bottom:0,opacity:op,pointerEvents:"none",zIndex:1}}>
      <path d={`M${f(40)},220 L${f(95)},170 L${f(70)},110 L${f(140)},80 L${f(120)},30`}
        stroke="rgba(90,107,176,.3)" strokeWidth="1" fill="none"/>
      <Crescent cx={f(40)} cy={222} R={22} d={0.7} color="#C9A85C" op={0.7} glow={false} flip={!L}/>
      <Star cx={f(95)}  cy={170} r={9} color="#C9A85C" op={0.7} cls="tw2"/>
      <Star cx={f(70)}  cy={110} r={6} color="#8E9ED6" op={0.6} cls="tw1"/>
      <Star cx={f(140)} cy={80}  r={8} color="#C9A85C" op={0.65} cls="tw3"/>
      <Star5 cx={f(120)} cy={30} r={7} color="#8E9ED6" op={0.55} cls="tw2"/>
      <Dot cx={f(60)} cy={150} r={1.8} color="#9BA6CF" op={0.6} cls="tw1"/>
      <Dot cx={f(160)} cy={120} r={1.8} color="#9BA6CF" op={0.6} cls="tw3"/>
    </svg>
  );
}

/* ── Star Row (between sections) ──────────────────────────────────────── */
function StarRow({ bg="#F1F2F8" }) {
  return (
    <div style={{background:bg,paddingTop:16,overflow:"hidden",flexShrink:0}}>
      <svg width="100%" viewBox="0 0 1400 70" preserveAspectRatio="xMidYMid meet" style={{display:"block"}}>
        <path d="M80,40 L300,26 L520,44 L740,28 L960,44 L1180,28 L1340,42"
          stroke="rgba(90,107,176,.16)" strokeWidth="1" fill="none"/>
        {[[80,40,8,"#C9A85C"],[300,26,6,"#8E9ED6"],[520,44,9,"#C9A85C"],[740,28,6,"#8E9ED6"],[960,44,8,"#C9A85C"],[1180,28,6,"#8E9ED6"],[1340,42,7,"#C9A85C"]].map(([x,y,r,c],i)=>(
          <Star key={i} cx={x} cy={y} r={r} color={c} op={0.6} cls={["tw1","tw2","tw3"][i%3]}/>
        ))}
        {[[190,36],[410,34],[630,38],[850,34],[1070,38],[1260,34]].map(([x,y],i)=>(
          <Dot key={`d${i}`} cx={x} cy={y} r={1.6} color="#9BA6CF" op={0.5} cls={["tw2","tw3","tw1"][i%3]}/>
        ))}
      </svg>
    </div>
  );
}

/* ── Google Calendar ───────────────────────────────────────────────────
   API_KEY comes from the VITE_GCAL_API_KEY env var (see .env.example): set it
   in .env.local for local dev and as a GitHub Actions secret for the deploy,
   so the real key stays out of the committed source. NOTE: a browser API key
   is still visible in the shipped bundle — protect it by restricting the key
   in Google Cloud (HTTP-referrer + Calendar API only), not by hiding it.
   The calendar must be set to "public" for the key to read it; the calendar
   ID is not secret, so it stays inline. */
const GCAL = {
  API_KEY: import.meta.env.VITE_GCAL_API_KEY || "",
  CALENDAR_ID: "6a0d68de6cc4ba47bc83b926e5c04340b26245c3a298a4504753f345dc51d977@group.calendar.google.com",
};

/* ── Formspree (volunteer + contact forms) ────────────────────────────────
   Forms created at https://formspree.io — submissions arrive by email and in
   the Formspree dashboard. CONTACT reuses the form originally created for
   the newsletter (now handled by beehiiv); rename it in Formspree. ──────── */
const FORMSPREE = {
  VOLUNTEER: "https://formspree.io/f/mvzeowkd",
  CONTACT:   "https://formspree.io/f/mbdnjzoe",
};

/* Contact + volunteer forms are TEMPORARILY DISABLED until the masjid has an
   established email address to receive submissions. The forms show a notice
   instead. Flip this to `true` (and confirm the Formspree endpoints above
   point at the masjid email) to bring them back. */
const FORMS_ENABLED = false;

/* ── beehiiv newsletter ────────────────────────────────────────────────────
   FORM_ID is the data-beehiiv-form id from the embed snippet beehiiv
   generates (Grow → Subscribe Forms → embed code). Their v3 loader script is
   injected into the signup container after mount and renders a correctly
   sized, auto-resizing form there. Style the form's colors/fonts in
   beehiiv's form builder — it lives in a cross-origin iframe, so site CSS
   can't reach inside it. ───────────────────────────────────────────────── */
const BEEHIIV = {
  FORM_ID:    "1019754b-fa20-484e-b06b-b090f79fda74",
  LOADER_SRC: "https://subscribe-forms.beehiiv.com/v3/loader.js",
};
const BEEHIIV_READY = !BEEHIIV.FORM_ID.includes("YOUR_BEEHIIV");

/* ── Zeffy donations (free for nonprofits, PCI handled by Zeffy) ───────────
   The site keeps its own donation-card styling; the gold button opens Zeffy's
   secure form in an on-page popup we control (a React overlay around Zeffy's
   embed iframe). EMBED_URL is the form's iframe embed src — same slug as your
   Zeffy share link, without the ?modal=true suffix. We render the popup
   ourselves rather than loading Zeffy's DOMContentLoaded-based loader script,
   which doesn't bind to React-rendered buttons and auto-fires in an SPA. ── */
const ZEFFY = {
  EMBED_URL: "https://www.zeffy.com/embed/donation-form/invest-in-the-akhirah",
};
const ZEFFY_READY = !ZEFFY.EMBED_URL.includes("YOUR_ZEFFY");

const VOLUNTEER_AREAS = [
  "Youth Programs","Islamic School","Event Planning & Hospitality",
  "Facilities & Maintenance","Media & Outreach","New Muslim Support",
  "Food Pantry & Social Services","Fundraising & Admin",
];

async function submitToFormspree(endpoint, data) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Submission failed");
}

const DEFAULT_PRAYERS = [
  { name:"Fajr",    ar:"الفجر",  time:"5:43 AM", h:5,  m:43 },
  { name:"Dhuhr",   ar:"الظهر",  time:"1:15 PM", h:13, m:15 },
  { name:"Asr",     ar:"العصر",  time:"5:00 PM", h:17, m:0  },
  { name:"Maghrib", ar:"المغرب", time:"8:22 PM", h:20, m:22 },
  { name:"Isha",    ar:"العشاء", time:"9:45 PM", h:21, m:45 },
];
const PRAYER_META = [
  ["Fajr","الفجر"],["Dhuhr","الظهر"],["Asr","العصر"],["Maghrib","المغرب"],["Isha","العشاء"],
];
// Sherman, TX coordinates + ISNA method (method=2). Swap lat/long for the masjid's exact location.
const ADHAN_URL = "https://api.aladhan.com/v1/timings?latitude=33.6357&longitude=-96.6089&method=2";

function to12h(hhmm) {
  const [h,m] = hhmm.split(":").map(Number);
  const time = new Date(0,0,0,h,m).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});
  return { time, h, m };
}
function getNextPrayer(list) {
  const now=new Date(), cur=now.getHours()*60+now.getMinutes();
  for(const p of list) if(p.h*60+p.m>cur) return p.name;
  return list[0]?.name;
}

const SERVICES = [
  { n:"01", title:"Daily Prayer & Jumu'ah",    body:"Isha prayer is held daily in congregation daily at 10 PM. Friday Jumu'ah begins at 2:00 PM — doors open at 1:45." },
  { n:"02", title:"Youth & Family Programs",   body:"Monthly sisterhood circles for women and children learning Arabic tajweed and rules of Quran recitation." },
  { n:"03", title:"New Muslim Support",        body:"Shahada guidance, one-on-one mentorship pairing, and a resource library — you are never starting alone." },
];

function useReveal() {
  useEffect(()=>{
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add("in"); });
    },{threshold:0.07});
    document.querySelectorAll(".reveal,.reveal-left,.reveal-right").forEach(el=>obs.observe(el));
    return ()=>obs.disconnect();
  });
}

function Calendar({ events }) {
  const today=new Date();
  const [view,setView]=useState(new Date(today.getFullYear(),today.getMonth(),1));
  const [sel,setSel]=useState(null);
  const y=view.getFullYear(),m=view.getMonth();
  const firstDay=new Date(y,m,1).getDay(),dim=new Date(y,m+1,0).getDate();
  const ml=view.toLocaleDateString("en-US",{month:"long",year:"numeric"});
  const evMap={};
  events.forEach(ev=>{
    if(ev.start.getFullYear()===y&&ev.start.getMonth()===m){
      const d=ev.start.getDate(); if(!evMap[d]) evMap[d]=[]; evMap[d].push(ev);
    }
  });
  const dc={indigo:"#34407A",gold:"#C9A85C"};
  const up=events.filter(ev=>ev.start>=today).sort((a,b)=>a.start-b.start).slice(0,6);
  const fT=d=>d.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});
  const fD=d=>d.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});
  const cells=[];
  for(let i=0;i<firstDay;i++) cells.push(null);
  for(let d=1;d<=dim;d++) cells.push(d);
  const isTod=d=>d===today.getDate()&&m===today.getMonth()&&y===today.getFullYear();

  return (
    <div className="resp-cal" style={{display:"grid",gridTemplateColumns:"3fr 2fr",border:"1px solid rgba(90,107,176,.2)",borderRadius:18,overflow:"hidden",boxShadow:"0 8px 48px rgba(16,23,58,.1)"}}>
      <div style={{background:"#FAFAFE"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 22px",borderBottom:"1px solid rgba(90,107,176,.1)"}}>
          <button onClick={()=>setView(new Date(y,m-1,1))} style={{width:32,height:32,borderRadius:"50%",border:"none",background:"none",cursor:"pointer",fontSize:18,color:"#34407A",display:"flex",alignItems:"center",justifyContent:"center"}}
            onMouseOver={e=>e.currentTarget.style.background="rgba(90,107,176,.1)"} onMouseOut={e=>e.currentTarget.style.background="none"}>‹</button>
          <span style={{fontFamily:'"Cormorant Garamond",serif',fontSize:19,color:"#1A1F38",fontWeight:400}}>{ml}</span>
          <button onClick={()=>setView(new Date(y,m+1,1))} style={{width:32,height:32,borderRadius:"50%",border:"none",background:"none",cursor:"pointer",fontSize:18,color:"#34407A",display:"flex",alignItems:"center",justifyContent:"center"}}
            onMouseOver={e=>e.currentTarget.style.background="rgba(90,107,176,.1)"} onMouseOut={e=>e.currentTarget.style.background="none"}>›</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",borderBottom:"1px solid rgba(90,107,176,.08)"}}>
          {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=>(
            <div key={d} style={{textAlign:"center",padding:"8px 0",fontSize:10,fontWeight:400,letterSpacing:".15em",color:"#5A6BB0",textTransform:"uppercase"}}>{d}</div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",padding:"4px 8px 10px"}}>
          {cells.map((day,i)=>{
            if(!day) return <div key={`e${i}`} style={{aspectRatio:"1"}}/>;
            const tod=isTod(day),has=!!evMap[day],isSel=sel===day;
            return (
              <div key={day} onClick={()=>setSel(isSel?null:day)}
                style={{aspectRatio:"1",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",cursor:"pointer",borderRadius:"50%",transition:"background .15s",
                  background:tod?"#34407A":isSel?"rgba(142,158,214,.24)":"transparent"}}
                onMouseOver={e=>{ if(!tod&&!isSel) e.currentTarget.style.background="rgba(142,158,214,.14)"; }}
                onMouseOut={e=>{ if(!tod&&!isSel) e.currentTarget.style.background="transparent"; }}>
                <span style={{fontSize:13,fontWeight:tod?"500":"300",color:tod?"#F1F2F8":"#1A1F38"}}>{day}</span>
                {has&&<span style={{position:"absolute",bottom:3,left:"50%",transform:"translateX(-50%)",width:3,height:3,borderRadius:"50%",background:tod?"#E6D7A2":dc[evMap[day][0].color]}}/>}
              </div>
            );
          })}
        </div>
        {sel&&(
          <div style={{borderTop:"1px solid rgba(90,107,176,.1)",padding:"14px 22px"}}>
            <p style={{fontFamily:'"Cormorant Garamond",serif',fontSize:14,color:"#5A6BB0",marginBottom:10,fontStyle:"italic"}}>{fD(new Date(y,m,sel))}</p>
            {(evMap[sel]||[]).length===0
              ? <p style={{fontSize:13,color:"rgba(26,31,56,.35)",fontWeight:300}}>No events this day.</p>
              : (evMap[sel]||[]).map(ev=>(
                  <div key={ev.id} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:8}}>
                    <span style={{width:4,height:4,borderRadius:"50%",background:dc[ev.color],marginTop:7,flexShrink:0}}/>
                    <div><p style={{fontSize:13,fontWeight:400,color:"#1A1F38"}}>{ev.summary}</p>
                    <p style={{fontSize:12,color:"rgba(26,31,56,.4)",fontWeight:300}}>{fT(ev.start)} · {ev.location}</p></div>
                  </div>
                ))
            }
          </div>
        )}
      </div>
      <div style={{background:"#10173A",padding:"26px 22px",display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"}}>
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",opacity:.8}} viewBox="0 0 260 400" preserveAspectRatio="xMidYMid slice">
          <Crescent cx={210} cy={50} R={26} d={0.72} color="#E6D7A2" op={0.5} glow={false}/>
          <Star cx={60} cy={40} r={6} color="#E6D7A2" op={0.5} cls="tw1"/>
          <Star cx={150} cy={90} r={5} color="#8E9ED6" op={0.4} cls="tw2"/>
          <Dot cx={100} cy={60} r={1.5} color="#C4CCE6" op={0.5} cls="tw3"/>
          <Dot cx={230} cy={140} r={1.5} color="#C4CCE6" op={0.5} cls="tw1"/>
        </svg>
        <p style={{fontSize:10,letterSpacing:".2em",textTransform:"uppercase",color:"#E6D7A2",fontWeight:400,marginBottom:18,position:"relative",zIndex:1}}>Upcoming Events</p>
        <div style={{flex:1,position:"relative",zIndex:1}}>
          {up.length===0
            ? <p style={{fontSize:13,color:"rgba(241,242,248,.3)",fontWeight:300}}>No upcoming events.</p>
            : up.map((ev,i)=>(
                <div key={ev.id} style={{paddingBottom:14,marginBottom:14,borderBottom:i<up.length-1?"1px solid rgba(241,242,248,.07)":"none"}}>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:3}}>
                    <p style={{fontFamily:'"Cormorant Garamond",serif',fontSize:17,color:"rgba(241,242,248,.88)",lineHeight:1.3}}>{ev.summary}</p>
                    {ev.recurring&&<span style={{fontSize:9,letterSpacing:".1em",textTransform:"uppercase",color:"rgba(230,215,162,.8)",background:"rgba(230,215,162,.12)",padding:"2px 7px",borderRadius:20,flexShrink:0,marginTop:3}}>Weekly</span>}
                  </div>
                  <p style={{fontSize:12,color:"rgba(241,242,248,.34)",fontWeight:300}}>{fD(ev.start)}</p>
                  <p style={{fontSize:11,color:"rgba(241,242,248,.22)",fontWeight:300}}>{fT(ev.start)} · {ev.location}</p>
                </div>
              ))
          }
        </div>
        <div style={{marginTop:12,paddingTop:14,borderTop:"1px solid rgba(241,242,248,.06)",position:"relative",zIndex:1}}>
          <p style={{fontSize:11,color:"rgba(241,242,248,.2)",fontWeight:300,lineHeight:1.6}}>
            ✓ Live from Google Calendar
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── MAIN ─────────────────────────────────────────────────────────────── */
export default function ICTExoma() {
  const [events,  setEvents] =useState([]);
  const [calSt,   setCalSt]  =useState(GCAL.API_KEY ? "loading" : "error");
  const [prayers, setPrayers]=useState(DEFAULT_PRAYERS);
  const [dAmt,    setDAmt]   =useState("$50");
  const [donateOpen,setDonateOpen]=useState(false);
  const [menuOpen,setMenuOpen]=useState(false);
  const beehiivRef=useRef(null);

  const [volData,setVolData]=useState({firstName:"",lastName:"",email:"",phone:"",availability:"",interests:[],message:""});
  const [volStatus,setVolStatus]=useState("idle"); // idle | sending | success | error

  const [ctcData,setCtcData]=useState({firstName:"",lastName:"",email:"",subject:"General Inquiry",message:""});
  const [ctcStatus,setCtcStatus]=useState("idle"); // idle | sending | success | error

  const toggleInterest=area=>setVolData(v=>({...v,interests:v.interests.includes(area)?v.interests.filter(a=>a!==area):[...v.interests,area]}));

  const submitVolunteer=async e=>{
    e.preventDefault();
    if(!volData.firstName||!volData.email) return;
    setVolStatus("sending");
    try{ await submitToFormspree(FORMSPREE.VOLUNTEER,volData); setVolStatus("success"); }
    catch{ setVolStatus("error"); }
  };

  const submitContact=async e=>{
    e.preventDefault();
    if(!ctcData.email||!ctcData.message) return;
    setCtcStatus("sending");
    try{ await submitToFormspree(FORMSPREE.CONTACT,{...ctcData,_subject:`[ictexoma.org] ${ctcData.subject}`}); setCtcStatus("success"); }
    catch{ setCtcStatus("error"); }
  };

  useReveal();

  useEffect(()=>{
    if(!document.getElementById("ict-head")){
      const d=document.createElement("div"); d.id="ict-head"; d.innerHTML=HEAD_INJECT;
      document.head.append(...Array.from(d.children));
    }
  },[]);

  // Inject beehiiv's v3 loader into the signup container after mount; the
  // loader replaces its own <script> tag with a correctly sized subscribe
  // form. Cleanup empties the container so StrictMode's double-mount (and
  // any future remount) can't create a second form.
  useEffect(()=>{
    const host=beehiivRef.current;
    if(!BEEHIIV_READY||!host) return;
    const s=document.createElement("script");
    s.async=true; s.src=BEEHIIV.LOADER_SRC;
    s.setAttribute("data-beehiiv-form",BEEHIIV.FORM_ID);
    host.appendChild(s);
    return ()=>{ host.replaceChildren(); };
  },[]);

  // Close the donation popup on Escape, and lock background scroll while open.
  useEffect(()=>{
    if(!donateOpen) return;
    const onKey=e=>{ if(e.key==="Escape") setDonateOpen(false); };
    document.addEventListener("keydown",onKey);
    const prev=document.body.style.overflow;
    document.body.style.overflow="hidden";
    return ()=>{ document.removeEventListener("keydown",onKey); document.body.style.overflow=prev; };
  },[donateOpen]);

  useEffect(()=>{
    if(!GCAL.API_KEY) return; // no key configured (e.g. secret missing at build); calSt already "error"
    const now=new Date().toISOString();
    fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(GCAL.CALENDAR_ID)}/events?key=${GCAL.API_KEY}&singleEvents=true&orderBy=startTime&timeMin=${now}&maxResults=50`)
      .then(r=>{ if(!r.ok) throw new Error("Calendar request failed"); return r.json(); })
      .then(data=>{ setEvents((data.items||[]).map(it=>({id:it.id,summary:it.summary||"Untitled",start:new Date(it.start?.dateTime||it.start?.date),end:new Date(it.end?.dateTime||it.end?.date),location:it.location||"",color:"indigo",recurring:!!it.recurringEventId}))); setCalSt("ok"); })
      .catch(()=>{ setEvents([]); setCalSt("error"); });
  },[]);

  useEffect(()=>{
    fetch(ADHAN_URL)
      .then(r=>r.json())
      .then(d=>{
        const t=d.data.timings;
        setPrayers(PRAYER_META.map(([name,ar])=>({ name, ar, ...to12h(t[name]) })));
      })
      .catch(()=>{}); // keep DEFAULT_PRAYERS on failure
  },[]);

  const go=id=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
  const next=getNextPrayer(prayers);

  const tag  ={fontSize:11,letterSpacing:".22em",textTransform:"uppercase",color:"#5A6BB0",fontWeight:400};
  const h2   ={fontFamily:'"Cormorant Garamond",serif',fontWeight:400,color:"#1A1F38",lineHeight:1.12};
  const h2d  ={fontFamily:'"Cormorant Garamond",serif',fontWeight:400,color:"#F1F2F8",lineHeight:1.12};
  const bar  ={width:36,height:1,background:"linear-gradient(90deg,#34407A,#C9A85C)",margin:"18px 0 28px"};
  const body ={fontSize:15.5,fontWeight:300,color:"rgba(26,31,56,.58)",lineHeight:1.95};
  const iL   ={width:"100%",background:"#FAFAFE",border:"1px solid rgba(90,107,176,.2)",borderRadius:6,padding:"10px 14px",fontSize:14,color:"#1A1F38",fontFamily:"'Jost',sans-serif",outline:"none"};
  const lbL  ={fontSize:11,color:"rgba(26,31,56,.4)",letterSpacing:".08em",display:"block",marginBottom:5};
  const bIndigo=(x={})=>({background:"#34407A",color:"#F1F2F8",border:"none",borderRadius:6,fontSize:14,fontWeight:400,fontFamily:"'Jost',sans-serif",cursor:"pointer",letterSpacing:".04em",transition:"background .2s",...x});
  const bNight=(x={})=>({background:"#10173A",color:"#F1F2F8",border:"none",borderRadius:6,fontSize:14,fontWeight:400,fontFamily:"'Jost',sans-serif",cursor:"pointer",letterSpacing:".04em",transition:"background .2s",...x});
  const bGold=(x={})=>({background:"#C9A85C",color:"#10173A",border:"none",borderRadius:6,fontSize:14,fontWeight:500,fontFamily:"'Jost',sans-serif",cursor:"pointer",letterSpacing:".04em",transition:"background .2s",...x});

  return (
    <div style={{fontFamily:"'Jost',sans-serif",background:"#F1F2F8",color:"#1A1F38"}}>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,height:96,padding:"0 5%",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(241,242,248,.96)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(90,107,176,.13)",boxShadow:"0 1px 32px rgba(16,23,58,.06)"}}>
        <div className="nav-links" style={{display:"flex",alignItems:"center",gap:28,flex:1,justifyContent:"flex-start"}}>
          {["about","services"].map(s=>(
            <button key={s} onClick={()=>go(s)} className="nav-link"
              style={{background:"none",border:"none",cursor:"pointer",fontSize:13,fontFamily:"'Jost',sans-serif",color:"rgba(26,31,56,.6)",letterSpacing:".06em",padding:"2px 0",transition:"color .3s"}}>
              {s[0].toUpperCase()+s.slice(1)}
            </button>
          ))}
        </div>
        <div style={{width:160,flexShrink:0}}/>
        <div style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",width:150,height:96,zIndex:250,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <button onClick={()=>go("hero")} style={{background:"none",border:"none",cursor:"pointer",padding:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <img src={`${import.meta.env.BASE_URL}ict_logo5.png`} alt="ICT Logo" style={{width:90,height:118,objectFit:"contain"}}/>
          </button>
        </div>
        <div className="nav-links" style={{display:"flex",alignItems:"center",gap:28,flex:1,justifyContent:"flex-end"}}>
          {["events","volunteer","contact"].map(s=>(
            <button key={s} onClick={()=>go(s)} className="nav-link"
              style={{background:"none",border:"none",cursor:"pointer",fontSize:13,fontFamily:"'Jost',sans-serif",color:"rgba(26,31,56,.6)",letterSpacing:".06em",padding:"2px 0",transition:"color .3s"}}>
              {s[0].toUpperCase()+s.slice(1)}
            </button>
          ))}
          <button onClick={()=>go("donate")} style={bGold({padding:"8px 20px",fontSize:13})}
            onMouseOver={e=>e.currentTarget.style.background="#DCC07A"}
            onMouseOut={e=>e.currentTarget.style.background="#C9A85C"}>Donate</button>
        </div>
        {/* Mobile hamburger (shown ≤860px via .nav-burger) */}
        <button className="nav-burger" aria-label="Menu" aria-expanded={menuOpen} onClick={()=>setMenuOpen(o=>!o)}
          style={{position:"absolute",right:"5%",top:"50%",transform:"translateY(-50%)",zIndex:260,background:"none",border:"none",cursor:"pointer",padding:8,flexDirection:"column",gap:5}}>
          <span style={{display:"block",width:24,height:2,borderRadius:2,background:"#1A1F38",transition:"transform .25s",transform:menuOpen?"translateY(7px) rotate(45deg)":"none"}}/>
          <span style={{display:"block",width:24,height:2,borderRadius:2,background:"#1A1F38",transition:"opacity .2s",opacity:menuOpen?0:1}}/>
          <span style={{display:"block",width:24,height:2,borderRadius:2,background:"#1A1F38",transition:"transform .25s",transform:menuOpen?"translateY(-7px) rotate(-45deg)":"none"}}/>
        </button>
      </nav>

      {/* Mobile menu (shown ≤860px when open) */}
      {menuOpen && (
        <div className="nav-mobile-menu" style={{position:"fixed",top:96,left:0,right:0,zIndex:190,flexDirection:"column",background:"rgba(241,242,248,.98)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(90,107,176,.13)",boxShadow:"0 12px 32px rgba(16,23,58,.1)",padding:"10px 5% 18px"}}>
          {["about","services","events","volunteer","contact"].map(s=>(
            <button key={s} onClick={()=>{ go(s); setMenuOpen(false); }}
              style={{background:"none",border:"none",cursor:"pointer",textAlign:"left",fontSize:15,fontFamily:"'Jost',sans-serif",color:"rgba(26,31,56,.7)",letterSpacing:".04em",padding:"13px 4px",borderBottom:"1px solid rgba(90,107,176,.1)"}}>
              {s[0].toUpperCase()+s.slice(1)}
            </button>
          ))}
          <button onClick={()=>{ go("donate"); setMenuOpen(false); }} style={bGold({padding:"13px",marginTop:14})}>Donate</button>
        </div>
      )}

      {/* HERO */}
      <section id="hero" style={{minHeight:"100vh",paddingTop:64,position:"relative",overflow:"hidden",display:"flex",alignItems:"center"}}>
        <div style={{position:"absolute",inset:0,zIndex:0,backgroundImage:`url('${import.meta.env.BASE_URL}masjid.png')`,backgroundSize:"cover",backgroundPosition:"center 60%"}}/>
        <div style={{position:"absolute",inset:0,zIndex:1,background:"linear-gradient(160deg,rgba(7,11,30,.92) 0%,rgba(16,23,58,.85) 45%,rgba(52,64,122,.55) 100%)"}}/>
        <HeroSky/>
        <div className="hero-inner" style={{maxWidth:1140,margin:"0 auto",padding:"80px 5%",position:"relative",zIndex:4,width:"100%"}}>
          <div className="reveal" style={{maxWidth:600}}>
            <span style={{fontFamily:'"Scheherazade New",serif',fontSize:28,color:"rgba(230,215,162,.82)",display:"block",marginBottom:22,lineHeight:1.7}}>بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</span>
            <span style={{...tag,color:"rgba(196,204,230,.65)",display:"block",marginBottom:14,fontSize:10}}>Sherman · Denison · Texoma Region</span>
            <h1 style={{fontFamily:'"Cormorant Garamond",serif',fontSize:"clamp(48px,6.5vw,80px)",fontWeight:300,color:"#F1F2F8",lineHeight:1.05,marginBottom:10,letterSpacing:"-.01em"}}>
              Islamic Center<br/><em style={{fontStyle:"italic",fontWeight:300,color:"#E6D7A2"}}>of Texoma</em>
            </h1>
            <p style={{fontFamily:'"Cormorant Garamond",serif',fontSize:"clamp(18px,2.2vw,23px)",fontWeight:300,color:"rgba(241,242,248,.52)",marginBottom:24,fontStyle:"italic"}}>A place of worship, learning &amp; belonging</p>
            <p style={{fontSize:15,fontWeight:300,color:"rgba(241,242,248,.52)",lineHeight:1.95,maxWidth:440,marginBottom:38}}>Serving the Muslim community of Sherman, Denison, and the greater Texoma region through prayer, education, and compassionate service.</p>
            <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
              <button onClick={()=>go("services")} style={bGold({padding:"13px 28px"})}
                onMouseOver={e=>e.currentTarget.style.background="#DCC07A"} onMouseOut={e=>e.currentTarget.style.background="#C9A85C"}>Explore our programs →</button>
              <button onClick={()=>go("about")}
                style={{background:"transparent",color:"rgba(241,242,248,.75)",padding:"13px 28px",borderRadius:6,fontSize:14,fontWeight:300,border:"1px solid rgba(241,242,248,.25)",cursor:"pointer",fontFamily:"'Jost',sans-serif",transition:"all .2s",letterSpacing:".04em"}}
                onMouseOver={e=>{ e.currentTarget.style.borderColor="rgba(230,215,162,.55)"; e.currentTarget.style.background="rgba(230,215,162,.08)"; }}
                onMouseOut={e=>{ e.currentTarget.style.borderColor="rgba(241,242,248,.25)"; e.currentTarget.style.background="transparent"; }}>Our story</button>
            </div>
          </div>
        </div>
        <div style={{position:"absolute",bottom:28,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:6,opacity:.32,zIndex:4}}>
          <span style={{fontSize:9,letterSpacing:".22em",textTransform:"uppercase",color:"#F1F2F8"}}>Scroll</span>
          <div style={{width:1,height:28,background:"linear-gradient(#F1F2F8,transparent)"}}/>
        </div>
      </section>

      {/* PRAYER TIMES */}
      <section id="prayers" style={{padding:"80px 5%",background:"#F1F2F8",borderBottom:"1px solid rgba(90,107,176,.08)"}}>
        <div style={{maxWidth:500,margin:"0 auto"}} className="reveal">
          <div style={{borderRadius:16,overflow:"hidden",border:"1px solid rgba(142,158,214,.28)",boxShadow:"0 12px 56px rgba(16,23,58,.08)"}}>
            <div style={{background:"#10173A",padding:"22px",borderBottom:"1px solid rgba(241,242,248,.07)",position:"relative",overflow:"hidden"}}>
              <svg style={{position:"absolute",right:14,top:8,opacity:.7}} width="90" height="60" viewBox="0 0 90 60">
                <Crescent cx={64} cy={28} R={20} d={0.72} color="#E6D7A2" op={0.55} glow={false}/>
                <Star cx={20} cy={20} r={5} color="#E6D7A2" op={0.5} cls="tw1"/>
                <Star cx={40} cy={40} r={4} color="#8E9ED6" op={0.45} cls="tw2"/>
              </svg>
              <p style={{fontSize:10,letterSpacing:".2em",textTransform:"uppercase",color:"#E6D7A2",fontWeight:400,marginBottom:4,position:"relative",zIndex:1}}>Prayer Times</p>
              <p style={{fontFamily:'"Cormorant Garamond",serif',fontSize:14,color:"rgba(241,242,248,.62)",position:"relative",zIndex:1}}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</p>
            </div>
            {prayers.map(p=>{
              const isNext=p.name===next;
              return (
                <div key={p.name} className={isNext?"prayer-active":""} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"15px 22px",background:isNext?"":"#FAFAFE",borderBottom:"1px solid rgba(90,107,176,.08)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:14,fontWeight:isNext?"400":"300",color:"#1A1F38"}}>{p.name}</span>
                    <span style={{fontFamily:'"Scheherazade New",serif',fontSize:16,color:"#5A6BB0"}}>{p.ar}</span>
                    {isNext&&<span style={{fontSize:9,background:"#C9A85C",color:"#10173A",padding:"2px 9px",borderRadius:20,letterSpacing:".06em",fontWeight:500}}>Next</span>}
                  </div>
                  <span style={{fontSize:14,fontWeight:isNext?"500":"300",letterSpacing:".05em",color:isNext?"#34407A":"rgba(26,31,56,.45)"}}>{p.time}</span>
                </div>
              );
            })}
            <div style={{background:"#FAFAFE",padding:"13px 22px",textAlign:"center"}}>
              <p style={{fontSize:12,color:"#5A6BB0",fontWeight:300,letterSpacing:".03em"}}>Jumu'ah every Friday · 2:00 PM</p>
            </div>
          </div>
        </div>
      </section>

      <StarDivider topBg="#F1F2F8" botBg="#F1F2F8"/>

      {/* ABOUT */}
      <section id="about" style={{padding:"60px 5% 100px",background:"#F1F2F8",position:"relative",overflow:"hidden"}}>
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}} viewBox="0 0 1400 580" preserveAspectRatio="xMidYMid slice">
          <ellipse cx={90} cy={290} rx={210} ry={160} fill="#8E9ED6" opacity={0.05}/>
          <ellipse cx={1340} cy={180} rx={190} ry={145} fill="#C9A85C" opacity={0.045}/>
          <ellipse cx={700} cy={510} rx={310} ry={115} fill="#34407A" opacity={0.035}/>
        </svg>
        <CornerStars side="right" op={0.5}/>
        <div className="resp-2col" style={{maxWidth:1140,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1.1fr",gap:80,alignItems:"start",position:"relative",zIndex:2}}>
          <div className="reveal-left">
            <span style={tag}>Our Story</span>
            <h2 style={{...h2,fontSize:"clamp(36px,4.5vw,56px)",margin:"10px 0"}}>
              Rooted in faith,<br/><em style={{fontStyle:"italic",color:"#34407A"}}>built by community</em>
            </h2>
            <div style={bar}/>
            <p style={{...body,marginBottom:18}}>The Islamic Center of Texoma was founded in the 1990s to serve the growing Muslim community of North Texas — a welcoming home for worship, education, and meaningful connection, bringing together families from diverse backgrounds united by faith.</p>
            <p style={body}>We are committed to fostering understanding between all faiths, serving our neighbors, and nurturing the next generation of Muslims who are proud of both their heritage and their identity as Americans.</p>
          </div>
          <div className="reveal-right" style={{transitionDelay:".1s"}}>
            {["Daily Congregational Prayer","Quran & Islamic Education","Youth, Family & Community Programs","New Muslim Support & Mentorship"].map((v,i)=>(
              <div key={v} style={{display:"flex",alignItems:"center",gap:16,padding:"12px 0",borderBottom:"1px solid rgba(90,107,176,.1)"}}>
                <span style={{fontFamily:'"Cormorant Garamond",serif',fontSize:22,color:"rgba(90,107,176,.35)",minWidth:28}}>{String(i+1).padStart(2,"0")}</span>
                <span style={{fontSize:14,fontWeight:300,color:"rgba(26,31,56,.62)",letterSpacing:".02em"}}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StarDivider topBg="#F1F2F8" botBg="#E6E9F4"/>

      {/* SERVICES */}
      <section id="services" style={{padding:"60px 5% 100px",background:"#E6E9F4",position:"relative",overflow:"hidden"}}>
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}} viewBox="0 0 1400 680" preserveAspectRatio="xMidYMid slice">
          <ellipse cx={180} cy={90} rx={260} ry={185} fill="#C9A85C" opacity={0.045}/>
          <ellipse cx={1220} cy={590} rx={230} ry={165} fill="#8E9ED6" opacity={0.06}/>
          <ellipse cx={700} cy={340} rx={360} ry={205} fill="#34407A" opacity={0.03}/>
        </svg>
        <CornerStars side="left" op={0.45}/>
        <div style={{maxWidth:1140,margin:"0 auto",position:"relative",zIndex:1}}>
          <div className="reveal" style={{marginBottom:58}}>
            <span style={tag}>What we offer</span>
            <h2 style={{...h2,fontSize:"clamp(34px,4vw,52px)",margin:"10px 0 0"}}>
              Programs &amp; <em style={{fontStyle:"italic",color:"#34407A"}}>services</em>
            </h2>
          </div>
          {SERVICES.map((s,i)=>(
            <div key={s.n} className="svc-row reveal resp-svc" style={{transitionDelay:`${i*.07}s`,padding:"28px 0",display:"grid",gridTemplateColumns:"72px 220px 1fr",gap:32,alignItems:"baseline"}}>
              <span style={{fontFamily:'"Cormorant Garamond",serif',fontSize:"3rem",color:"rgba(90,107,176,.25)",lineHeight:1,fontWeight:300}}>{s.n}</span>
              <h3 style={{fontFamily:'"Cormorant Garamond",serif',fontSize:22,fontWeight:400,color:"#1A1F38",lineHeight:1.35}}>{s.title}</h3>
              <p style={{fontSize:14.5,fontWeight:300,color:"rgba(26,31,56,.55)",lineHeight:1.92}}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <StarRow bg="#E6E9F4"/>

      {/* EVENTS */}
      <section id="events" style={{padding:"60px 5% 100px",background:"#F1F2F8",position:"relative",overflow:"hidden"}}>
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}} viewBox="0 0 1400 680" preserveAspectRatio="xMidYMid slice">
          <ellipse cx={1310} cy={140} rx={205} ry={155} fill="#8E9ED6" opacity={0.05}/>
          <ellipse cx={90} cy={610} rx={185} ry={135} fill="#C9A85C" opacity={0.045}/>
        </svg>
        <div style={{maxWidth:1140,margin:"0 auto",position:"relative",zIndex:1}}>
          <div className="reveal" style={{marginBottom:48,display:"flex",alignItems:"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
            <div>
              <span style={tag}>Community Calendar</span>
              <h2 style={{...h2,fontSize:"clamp(34px,4vw,52px)",margin:"10px 0 0"}}>
                Upcoming <em style={{fontStyle:"italic",color:"#34407A"}}>events</em>
              </h2>
            </div>
            {calSt==="error"&&<span style={{fontSize:12,color:"#5A6BB0",background:"rgba(90,107,176,.1)",padding:"4px 14px",borderRadius:20}}>⚠ Calendar unavailable</span>}
            {calSt==="ok"&&<span style={{fontSize:12,color:"#34407A",background:"rgba(52,64,122,.1)",padding:"4px 14px",borderRadius:20}}>✓ Live from Google Calendar</span>}
          </div>
          <div className="reveal" style={{transitionDelay:".1s"}}>
            {events.length>0
              ? <Calendar events={events}/>
              : <div style={{textAlign:"center",padding:60,color:"rgba(26,31,56,.3)",fontFamily:'"Cormorant Garamond",serif',fontSize:20,fontStyle:"italic"}}>
                  {calSt==="loading"?"Loading events…":calSt==="error"?"Events calendar is temporarily unavailable. Please check back soon.":"No upcoming events scheduled — check back soon."}
                </div>}
          </div>
        </div>
      </section>

      <StarDivider topBg="#F1F2F8" botBg="#E6E9F4"/>

      {/* VOLUNTEER */}
      <section id="volunteer" style={{padding:"60px 5% 100px",background:"#E6E9F4",position:"relative",overflow:"hidden"}}>
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}} viewBox="0 0 1400 680" preserveAspectRatio="xMidYMid slice">
          <ellipse cx={130} cy={110} rx={230} ry={170} fill="#8E9ED6" opacity={0.05}/>
          <ellipse cx={1290} cy={580} rx={210} ry={155} fill="#C9A85C" opacity={0.045}/>
        </svg>
        <CornerStars side="left" op={0.4}/>
        <div style={{maxWidth:1140,margin:"0 auto",position:"relative",zIndex:1}}>
          <div className="reveal" style={{marginBottom:52}}>
            <span style={tag}>Get involved</span>
            <h2 style={{...h2,fontSize:"clamp(34px,4vw,52px)",margin:"10px 0 0"}}>
              Volunteer <em style={{fontStyle:"italic",color:"#34407A"}}>with us</em>
            </h2>
          </div>
          <div className="resp-2col" style={{display:"grid",gridTemplateColumns:"1fr 1.3fr",gap:64}}>
            <div className="reveal-left">
              <div style={bar}/>
              <p style={{...body,marginBottom:22}}>Our community runs on the generosity of volunteers. Whether you have an hour a month or a few hours a week, there's a place for you — tell us where your interests lie and we'll be in touch.</p>
              {["Flexible scheduling around your availability","No experience required — just willingness","Great for teens, students & families alike"].map(p=>(
                <div key={p} style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                  <div style={{width:17,height:17,borderRadius:3,border:"1px solid rgba(90,107,176,.3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{color:"#34407A",fontSize:9}}>✓</span>
                  </div>
                  <span style={{fontSize:14,color:"rgba(26,31,56,.55)",fontWeight:300}}>{p}</span>
                </div>
              ))}
            </div>
            <div className="reveal-right" style={{transitionDelay:".1s"}}>
              {!FORMS_ENABLED
                ? <div style={{background:"#FAFAFE",border:"1px solid rgba(90,107,176,.2)",borderRadius:14,padding:"40px 30px",textAlign:"center"}}>
                    <p style={{fontFamily:'"Cormorant Garamond",serif',fontSize:22,color:"#34407A",marginBottom:10}}>Volunteer sign-up coming soon</p>
                    <p style={{fontSize:14,color:"rgba(26,31,56,.55)",fontWeight:300,lineHeight:1.7}}>We don't yet have an established masjid email to receive submissions, so this form is temporarily paused. Please check back soon, in shā' Allah — and jazakum Allahu khayran for your willingness to serve.</p>
                  </div>
                : volStatus==="success"
                ? <div style={{background:"#FAFAFE",border:"1px solid rgba(90,107,176,.2)",borderRadius:14,padding:"40px 30px",textAlign:"center"}}>
                    <p style={{fontFamily:'"Cormorant Garamond",serif',fontSize:24,color:"#34407A",marginBottom:8}}>Jazakum Allahu Khayran</p>
                    <p style={{fontSize:14,color:"rgba(26,31,56,.55)",fontWeight:300}}>Your interest has been received — we'll reach out soon.</p>
                  </div>
                : <form onSubmit={submitVolunteer} style={{display:"flex",flexDirection:"column",gap:12}}>
                    <div className="resp-2fields" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      <div><label style={lbL}>First name</label><input required type="text" placeholder="Your name" value={volData.firstName} onChange={e=>setVolData(v=>({...v,firstName:e.target.value}))} style={iL}/></div>
                      <div><label style={lbL}>Last name</label><input type="text" placeholder="Last name" value={volData.lastName} onChange={e=>setVolData(v=>({...v,lastName:e.target.value}))} style={iL}/></div>
                    </div>
                    <div className="resp-2fields" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      <div><label style={lbL}>Email</label><input required type="email" placeholder="you@email.com" value={volData.email} onChange={e=>setVolData(v=>({...v,email:e.target.value}))} style={iL}/></div>
                      <div><label style={lbL}>Phone</label><input type="tel" placeholder="(XXX) XXX-XXXX" value={volData.phone} onChange={e=>setVolData(v=>({...v,phone:e.target.value}))} style={iL}/></div>
                    </div>
                    <div>
                      <label style={lbL}>Availability</label>
                      <input type="text" placeholder="e.g. Weekday evenings & Saturday mornings" value={volData.availability} onChange={e=>setVolData(v=>({...v,availability:e.target.value}))} style={iL}/>
                    </div>
                    <div>
                      <label style={lbL}>Areas of interest</label>
                      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                        {VOLUNTEER_AREAS.map(area=>{
                          const sel=volData.interests.includes(area);
                          return (
                            <button key={area} type="button" onClick={()=>toggleInterest(area)}
                              style={{background:sel?"rgba(52,64,122,.12)":"#FAFAFE",border:sel?"1px solid #34407A":"1px solid rgba(90,107,176,.2)",borderRadius:20,padding:"7px 14px",fontSize:12.5,fontWeight:sel?"400":"300",color:sel?"#34407A":"rgba(26,31,56,.55)",cursor:"pointer",fontFamily:"'Jost',sans-serif",transition:"all .15s"}}>
                              {area}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div><label style={lbL}>Anything else we should know?</label><textarea placeholder="Optional" rows={3} value={volData.message} onChange={e=>setVolData(v=>({...v,message:e.target.value}))} style={{...iL,resize:"vertical"}}/></div>
                    <button type="submit" disabled={volStatus==="sending"} style={bIndigo({padding:"13px 28px",textAlign:"left",opacity:volStatus==="sending"?0.6:1})}
                      onMouseOver={e=>{ if(volStatus!=="sending") e.currentTarget.style.background="#2A3560"; }}
                      onMouseOut={e=>{ if(volStatus!=="sending") e.currentTarget.style.background="#34407A"; }}>
                      {volStatus==="sending"?"Sending…":"Submit interest →"}
                    </button>
                    {volStatus==="error"&&<p style={{fontSize:12.5,color:"#B0453F",fontWeight:300}}>Something went wrong — please try again in a moment.</p>}
                  </form>
              }
            </div>
          </div>
        </div>
      </section>

      <StarDivider topBg="#E6E9F4" botBg="#10173A"/>

      {/* DONATE */}
      <section id="donate" style={{padding:"60px 5% 110px",background:"#10173A",position:"relative",overflow:"hidden"}}>
        <div className="night-texture" style={{position:"absolute",inset:0,opacity:.8}}/>
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}} viewBox="0 0 1400 600" preserveAspectRatio="xMidYMid slice">
          <ellipse cx={700} cy={120} rx={420} ry={160} fill="#34407A" opacity={0.25}/>
          <g className="floatM"><Crescent cx={1230} cy={120} R={56} d={0.74} color="#E6D7A2" op={0.55} glow={true}/></g>
          <Star cx={140} cy={90} r={10} color="#E6D7A2" op={0.6} cls="tw1"/>
          <Star cx={340} cy={180} r={7} color="#8E9ED6" op={0.5} cls="tw2"/>
          <Star cx={520} cy={70} r={6} color="#E6D7A2" op={0.5} cls="tw3"/>
          <Star cx={900} cy={150} r={7} color="#8E9ED6" op={0.45} cls="tw1"/>
          <Star5 cx={1050} cy={80} r={8} color="#E6D7A2" op={0.5} cls="tw2"/>
          {[[80,160],[260,110],[460,200],[660,90],[820,230],[1000,210],[1180,260],[1330,180],[420,260],[600,250]].map(([x,y],i)=>(
            <Dot key={i} cx={x} cy={y} r={1.8} color="#C4CCE6" op={0.55} cls={["tw1","tw2","tw3"][i%3]}/>
          ))}
        </svg>
        <div className="resp-2col" style={{maxWidth:1140,margin:"0 auto",position:"relative",zIndex:2,display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"start"}}>
          <div className="reveal-left">
            <span style={{...tag,color:"rgba(230,215,162,.75)"}}>Support our mission</span>
            <h2 style={{...h2d,fontSize:"clamp(36px,4.5vw,56px)",margin:"10px 0"}}>
              Invest in<br/><em style={{fontStyle:"italic",fontWeight:300,color:"#E6D7A2"}}>the Akhirah</em>
            </h2>
            <div style={{...bar,background:"linear-gradient(90deg,#8E9ED6,#C9A85C)",marginTop:22}}/>
            <p style={{fontSize:15,fontWeight:300,color:"rgba(241,242,248,.52)",lineHeight:1.95,marginBottom:28}}>Your generosity keeps our doors open, classrooms filled, and community supported. Every contribution is a sadaqah jariyah.</p>
            {["501(c)(3) tax-exempt organization","Secure encrypted payment processing","One-time or monthly giving","Tax receipt sent automatically"].map(p=>(
              <div key={p} style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                <div style={{width:17,height:17,borderRadius:3,border:"1px solid rgba(230,215,162,.3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{color:"#E6D7A2",fontSize:9}}>✓</span>
                </div>
                <span style={{fontSize:14,color:"rgba(241,242,248,.48)",fontWeight:300}}>{p}</span>
              </div>
            ))}
          </div>
          <div className="reveal-right" style={{transitionDelay:".14s"}}>
            <div style={{background:"rgba(241,242,248,.04)",border:"1px solid rgba(230,215,162,.15)",borderRadius:16,padding:"36px 30px"}}>
              <h3 style={{fontFamily:'"Cormorant Garamond",serif',fontSize:26,fontWeight:300,color:"#F1F2F8",marginBottom:4}}>Make a Donation</h3>
              <p style={{fontSize:13,color:"rgba(241,242,248,.28)",fontWeight:300,marginBottom:22}}>All amounts in USD</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:18}}>
                {["$25","$50","$100","$250","$500","Custom"].map(a=>(
                  <button key={a} onClick={()=>setDAmt(a)}
                    style={{background:dAmt===a?"rgba(230,215,162,.18)":"rgba(241,242,248,.04)",border:dAmt===a?"1px solid #E6D7A2":"1px solid rgba(241,242,248,.1)",borderRadius:6,padding:"12px 6px",textAlign:"center",fontSize:15,fontWeight:dAmt===a?"400":"300",color:dAmt===a?"#E6D7A2":"rgba(241,242,248,.55)",cursor:"pointer",fontFamily:"'Jost',sans-serif",transition:"all .15s"}}>
                    {a}
                  </button>
                ))}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:11}}>
                <div>
                  <label style={{fontSize:11,color:"rgba(241,242,248,.3)",letterSpacing:".08em",display:"block",marginBottom:5}}>Designate gift</label>
                  <select style={{width:"100%",background:"rgba(241,242,248,.06)",border:"1px solid rgba(241,242,248,.12)",borderRadius:6,padding:"10px 14px",fontSize:14,color:"rgba(241,242,248,.75)",fontFamily:"'Jost',sans-serif",outline:"none",cursor:"pointer"}}>
                    {["General Fund","Masjid Operations","Islamic School","Youth Programs","Social Services","Masjid Expansion"].map(o=><option key={o} style={{background:"#10173A"}}>{o}</option>)}
                  </select>
                </div>
                <button onClick={()=>{ if(ZEFFY_READY) setDonateOpen(true); }}
                  style={bGold({padding:"14px",opacity:ZEFFY_READY?1:0.55,cursor:ZEFFY_READY?"pointer":"not-allowed"})}
                  onMouseOver={e=>{ if(ZEFFY_READY) e.currentTarget.style.background="#DCC07A"; }}
                  onMouseOut={e=>{ if(ZEFFY_READY) e.currentTarget.style.background="#C9A85C"; }}>
                  Donate {dAmt!=="Custom"?dAmt:""} →
                </button>
                <p style={{fontSize:11.5,color:"rgba(241,242,248,.4)",fontWeight:300,lineHeight:1.6,textAlign:"center"}}>
                  {ZEFFY_READY
                    ? "A secure Zeffy window opens right here — 100% of your gift reaches the masjid."
                    : <>Online giving is being set up. Email <a href="mailto:info@ictexoma.org" style={{color:"#E6D7A2",textDecoration:"none"}}>info@ictexoma.org</a> to give in the meantime.</>}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StarDivider topBg="#10173A" botBg="#E6E9F4"/>

      {/* CONTACT */}
      <section id="contact" style={{padding:"60px 5% 100px",background:"#E6E9F4",position:"relative",overflow:"hidden"}}>
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}} viewBox="0 0 1400 680" preserveAspectRatio="xMidYMid slice">
          <ellipse cx={1310} cy={95} rx={225} ry={165} fill="#C9A85C" opacity={0.045}/>
          <ellipse cx={95} cy={610} rx={205} ry={155} fill="#8E9ED6" opacity={0.06}/>
        </svg>
        <CornerStars side="right" op={0.4}/>
        <div style={{maxWidth:1140,margin:"0 auto",position:"relative",zIndex:1}}>
          <div className="reveal" style={{marginBottom:52}}>
            <span style={tag}>Find us</span>
            <h2 style={{...h2,fontSize:"clamp(34px,4vw,52px)",margin:"10px 0 0"}}>
              Get in <em style={{fontStyle:"italic",color:"#34407A"}}>touch</em>
            </h2>
          </div>
          <div className="resp-2col" style={{display:"grid",gridTemplateColumns:"1fr 1.3fr",gap:64}}>
            <div className="reveal-left">
              {[
                {l:"Address",      v:<>6544 FM1417<br/>Denison, TX 75090</>},
                {l:"Phone",        v:"(XXX) XXX-XXXX"},
                {l:"Email",        v:"Coming soon, in shā’ Allah"},
                {l:"Office Hours", v:<>Mon–Fri: 10 AM – 5 PM<br/>Sat: 9 AM – 2 PM<br/>Masjid open for Isha prayers daily, and Jummah prayers weekly</>},
              ].map(d=>(
                <div key={d.l} style={{marginBottom:26}}>
                  <span style={{fontSize:10,fontWeight:400,letterSpacing:".16em",textTransform:"uppercase",color:"#5A6BB0",display:"block",marginBottom:5}}>{d.l}</span>
                  <span style={{fontSize:15,fontWeight:300,color:"rgba(26,31,56,.6)",lineHeight:1.7}}>{d.v}</span>
                </div>
              ))}
              <div style={{marginTop:36,paddingTop:28,borderTop:"1px solid rgba(90,107,176,.15)"}}>
                <p style={{fontFamily:'"Cormorant Garamond",serif',fontSize:20,color:"#1A1F38",marginBottom:4,fontWeight:400}}>Stay connected</p>
                <p style={{fontSize:13,color:"rgba(26,31,56,.42)",fontWeight:300,marginBottom:14,lineHeight:1.7}}>Announcements, prayer times, and events in your inbox.</p>
                {BEEHIIV_READY
                  ? <>
                      <div ref={beehiivRef} style={{width:"100%",minHeight:56}}/>
                      <p style={{fontSize:11,color:"rgba(26,31,56,.35)",fontWeight:300,marginTop:6,lineHeight:1.6}}>Powered by beehiiv. Unsubscribe anytime.</p>
                    </>
                  : <p style={{fontSize:13,color:"rgba(26,31,56,.45)",fontWeight:300,lineHeight:1.7}}>
                      Our newsletter sign-up is being set up — check back soon, or email <a href="mailto:info@ictexoma.org" style={{color:"#34407A",textDecoration:"none"}}>info@ictexoma.org</a> to be added.
                    </p>
                }
              </div>
            </div>
            <div className="reveal-right" style={{transitionDelay:".1s"}}>
              {!FORMS_ENABLED
                ? <div style={{background:"#FAFAFE",border:"1px solid rgba(90,107,176,.2)",borderRadius:14,padding:"40px 30px",textAlign:"center"}}>
                    <p style={{fontFamily:'"Cormorant Garamond",serif',fontSize:22,color:"#34407A",marginBottom:10}}>Contact form coming soon</p>
                    <p style={{fontSize:14,color:"rgba(26,31,56,.55)",fontWeight:300,lineHeight:1.7}}>The Islamic Center of Texoma doesn't yet have an established email address to receive messages, so our contact form is temporarily unavailable. Please check back soon, in shā' Allah — you're always welcome to visit us at the masjid in the meantime.</p>
                  </div>
                : ctcStatus==="success"
                ? <div style={{background:"#FAFAFE",border:"1px solid rgba(90,107,176,.2)",borderRadius:14,padding:"40px 30px",textAlign:"center"}}>
                    <p style={{fontFamily:'"Cormorant Garamond",serif',fontSize:24,color:"#34407A",marginBottom:8}}>Message sent</p>
                    <p style={{fontSize:14,color:"rgba(26,31,56,.55)",fontWeight:300}}>Thank you for reaching out — we'll get back to you soon, in shā’ Allah.</p>
                  </div>
                : <form onSubmit={submitContact} style={{display:"flex",flexDirection:"column",gap:12}}>
                    <div className="resp-2fields" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      <div><label style={lbL}>First Name</label><input type="text" placeholder="Your name" value={ctcData.firstName} onChange={e=>setCtcData(c=>({...c,firstName:e.target.value}))} style={iL}/></div>
                      <div><label style={lbL}>Last Name</label><input type="text" placeholder="Last name" value={ctcData.lastName} onChange={e=>setCtcData(c=>({...c,lastName:e.target.value}))} style={iL}/></div>
                    </div>
                    <div><label style={lbL}>Email</label><input required type="email" placeholder="you@email.com" value={ctcData.email} onChange={e=>setCtcData(c=>({...c,email:e.target.value}))} style={iL}/></div>
                    <div>
                      <label style={lbL}>Subject</label>
                      <select value={ctcData.subject} onChange={e=>setCtcData(c=>({...c,subject:e.target.value}))} style={{...iL,cursor:"pointer"}}>
                        {["General Inquiry","Prayer Times","School Enrollment","Volunteering","Marriage Services","New to Islam","Media / Press"].map(o=><option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div><label style={lbL}>Message</label><textarea required placeholder="How can we help you?" rows={5} value={ctcData.message} onChange={e=>setCtcData(c=>({...c,message:e.target.value}))} style={{...iL,resize:"vertical"}}/></div>
                    <button type="submit" disabled={ctcStatus==="sending"} style={bNight({padding:"13px 28px",textAlign:"left",opacity:ctcStatus==="sending"?0.6:1})}
                      onMouseOver={e=>{ if(ctcStatus!=="sending") e.currentTarget.style.background="#0A0F28"; }}
                      onMouseOut={e=>{ if(ctcStatus!=="sending") e.currentTarget.style.background="#10173A"; }}>
                      {ctcStatus==="sending"?"Sending…":"Send message →"}
                    </button>
                    {ctcStatus==="error"&&<p style={{fontSize:12.5,color:"#B0453F",fontWeight:300}}>Something went wrong — please try again in a moment.</p>}
                  </form>
              }
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:"#070B1E",padding:"60px 5% 26px",position:"relative",overflow:"hidden"}}>
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0,opacity:.8}} viewBox="0 0 1400 300" preserveAspectRatio="xMidYMid slice">
          <Crescent cx={1280} cy={80} R={40} d={0.74} color="#E6D7A2" op={0.4} glow={false}/>
          <Star cx={120} cy={60} r={8} color="#E6D7A2" op={0.4} cls="tw1"/>
          <Star cx={300} cy={120} r={6} color="#8E9ED6" op={0.35} cls="tw2"/>
          <Star cx={1050} cy={70} r={6} color="#E6D7A2" op={0.35} cls="tw3"/>
          {[[200,90],[420,60],[640,110],[860,70],[980,130],[1150,100]].map(([x,y],i)=>(
            <Dot key={i} cx={x} cy={y} r={1.6} color="#C4CCE6" op={0.4} cls={["tw1","tw2","tw3"][i%3]}/>
          ))}
        </svg>
        <div style={{maxWidth:1140,margin:"0 auto",position:"relative",zIndex:1}}>
          <div className="resp-foot" style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:48,paddingBottom:36,borderBottom:"1px solid rgba(241,242,248,.05)",marginBottom:24}}>
            <div>
              <span style={{fontFamily:'"Scheherazade New",serif',fontSize:22,color:"#E6D7A2",display:"block",marginBottom:10}}>بِسْمِ ٱللَّهِ</span>
              <p style={{fontFamily:'"Cormorant Garamond",serif',fontSize:17,color:"rgba(241,242,248,.42)",marginBottom:10,fontStyle:"italic"}}>Islamic Center of Texoma</p>
              <p style={{fontSize:13,fontWeight:300,color:"rgba(241,242,248,.2)",lineHeight:1.85}}>Serving Muslims and neighbors across Sherman, Denison, and the greater Texoma region through faith, knowledge, and service.</p>
            </div>
            {[
              {title:"Navigate",links:["About Us","Services","Events","Donate","Contact"]},
              {title:"Programs",links:["Prayer Schedule","Islamic School","Sisterhood","New Muslims"]},
              {title:"Connect", links:["Facebook","Instagram","YouTube","WhatsApp","Newsletter"]},
            ].map(col=>(
              <div key={col.title}>
                <p style={{fontSize:10,fontWeight:400,letterSpacing:".18em",textTransform:"uppercase",color:"#5A6BB0",marginBottom:16}}>{col.title}</p>
                <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:9}}>
                  {col.links.map(l=>(
                    <li key={l}><a href="#" style={{fontSize:13,fontWeight:300,color:"rgba(241,242,248,.26)",textDecoration:"none",transition:"color .2s"}}
                      onMouseOver={e=>e.currentTarget.style.color="rgba(230,215,162,.8)"} onMouseOut={e=>e.currentTarget.style.color="rgba(241,242,248,.26)"}>{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10,fontSize:12,color:"rgba(241,242,248,.14)",fontWeight:300}}>
            <span>© {new Date().getFullYear()} Islamic Center of Texoma. All rights reserved.</span>
            <span>501(c)(3) Non-Profit Organization</span>
          </div>
        </div>
      </footer>

      {/* DONATION POPUP — Zeffy embed in a React-controlled overlay */}
      {donateOpen && (
        <div onClick={()=>setDonateOpen(false)}
          style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(7,11,30,.72)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
          <div onClick={e=>e.stopPropagation()}
            style={{position:"relative",width:"100%",maxWidth:520,height:"88vh",maxHeight:840,background:"#FAFAFE",borderRadius:16,overflow:"hidden",boxShadow:"0 24px 90px rgba(7,11,30,.55)"}}>
            <button onClick={()=>setDonateOpen(false)} aria-label="Close donation form"
              style={{position:"absolute",top:12,right:12,zIndex:2,width:34,height:34,borderRadius:"50%",border:"none",background:"rgba(16,23,58,.10)",color:"#10173A",fontSize:20,lineHeight:1,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}
              onMouseOver={e=>e.currentTarget.style.background="rgba(16,23,58,.18)"}
              onMouseOut={e=>e.currentTarget.style.background="rgba(16,23,58,.10)"}>×</button>
            <iframe title="Donate to the Islamic Center of Texoma" src={ZEFFY.EMBED_URL} allow="payment"
              style={{width:"100%",height:"100%",border:"none",display:"block"}}/>
          </div>
        </div>
      )}
    </div>
  );
}