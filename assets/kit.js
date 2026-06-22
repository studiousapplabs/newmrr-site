const kitForm = document.getElementById('kitForm');
const kitResult = document.getElementById('kitResult');
const kitOutput = document.getElementById('kitOutput');
const copyKit = document.getElementById('copyKit');
const saveKit = document.getElementById('saveKit');
const mailKit = document.getElementById('mailKit');
let lastKitText = '';

function v(obj, key){ return String(obj[key] || '').trim(); }
function words(str){ return v({x:str},'x').split(/\s+/).filter(Boolean); }
function money(goal){
  const n = Number(String(goal || '').replace(/[^0-9.]/g,''));
  return Number.isFinite(n) && n > 0 ? n : 1000;
}
function cap(str){ return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''; }
function makeOfferName(skill, model){
  const base = words(skill).slice(0,3).join(' ') || 'Skill';
  return `${cap(base)} ${model}`;
}
function pickTool(model){
  const map = {
    'Care plan':'book page + client list + monthly plan',
    'Book plan':'book page + pay link + time slots',
    'Member plan':'member page + lesson vault + pay wall',
    'Coach plan':'call page + plan tracker + client notes',
    'Tool fee':'simple web tool + login + pay link',
    'Lead plan':'lead form + auto reply + client board',
    'Serv plan':'order form + route/task board + pay link',
    'Pack plan':'order page + file send + client portal'
  };
  return map[model] || 'lead page + pay link + client board';
}
function score(data){
  const checks = [v(data,'skill'), v(data,'buyer'), v(data,'pain'), v(data,'paidProof'), v(data,'goal'), v(data,'model'), v(data,'load')];
  let s = 35 + checks.filter(Boolean).length * 8;
  if (words(v(data,'skill')).length > 5) s += 5;
  if (words(v(data,'buyer')).length > 5) s += 5;
  if (words(v(data,'pain')).length > 5) s += 5;
  return Math.min(96, s);
}
function priceSet(goal){
  const g = money(goal);
  const low = Math.max(49, Math.round(g / 20 / 5) * 5);
  const mid = Math.max(99, Math.round(g / 10 / 5) * 5);
  const high = Math.max(199, Math.round(g / 5 / 5) * 5);
  return {low, mid, high};
}
function needCount(goal, price){ return Math.max(1, Math.ceil(money(goal) / price)); }
function buildKit(data){
  const name = v(data,'name') || 'Client';
  const skill = v(data,'skill') || 'real skill';
  const buyer = v(data,'buyer') || 'folk who need this skill';
  const pain = v(data,'pain') || 'a pain they want gone';
  const model = v(data,'model') || 'Care plan';
  const tool = pickTool(model);
  const offerName = makeOfferName(skill, model);
  const prices = priceSet(v(data,'goal'));
  const proofScore = score(data);
  const firstPitch = `I help ${buyer} fix ${pain} with a simple ${model.toLowerCase()} built from ${skill}.`;
  const lowPitch = `You have ${pain}.\nI can help.\nOne clear plan.\nEach mo.`;
  const text = `${name} Rec Rev Kit\n\nONE LINE OFFER\n${firstPitch}\n\nOFFER NAME\n${offerName}\n\nBUYER\n${buyer}\n\nPAIN\n${pain}\n\nPAID PART\n${skill}\n\nTOOL TO BUILD\n${tool}\n\nREC REV MODEL\n${model}\n\nPRICE TEST\nStart: $${prices.low}/mo needs ${needCount(v(data,'goal'), prices.low)} yes to hit goal.\nGrow: $${prices.mid}/mo needs ${needCount(v(data,'goal'), prices.mid)} yes to hit goal.\nPro: $${prices.high}/mo needs ${needCount(v(data,'goal'), prices.high)} yes to hit goal.\n\nPITCH\n${firstPitch}\n\nLOW LOAD PITCH\n${lowPitch}\n\nTEXT MSG\nHey, I am testing a simple plan for ${buyer}. It helps with ${pain}. Want me to send the short info?\n\nEMAIL\nSubject: quick help with ${pain}\n\nHi, I am testing a simple ${model.toLowerCase()} for ${buyer}. It helps with ${pain}. If useful, I can send a short one-page plan.\n\nFIRST 10 LEAD PLAN\n1. List 10 folk who know, like, or trust you.\n2. Send the text msg.\n3. Ask who else has this pain.\n4. Book 3 short talks.\n5. Ask for one paid test.\n\nRISK CUT\nIdea risk: cut by naming the buyer and pain.\nPrice risk: cut by testing 3 price points.\nTech risk: cut by building only the first tool.\nLoad risk: cut by keeping work to one lead test.\nSale risk: cut by using a short pitch.\n\nPROOF SCORE\n${proofScore}/100\n\nNEXT STEP\nNewMRR should build the first page, pitch sheet, and lead test plan. Then test with 10 warm leads before a big build.\n`;
  return {text, proofScore, offerName, firstPitch};
}
function renderKit(data, kit){
  const lines = kit.text.split('\n');
  const html = [];
  html.push(`<div class="kit-score"><b>Proof score</b><span>${kit.proofScore}/100</span><meter value="${kit.proofScore}" min="0" max="100"></meter></div>`);
  html.push('<div class="kit-doc">');
  for (const line of lines) {
    if (!line) { html.push('<br>'); continue; }
    if (line === line.toUpperCase() && line.length < 40) html.push(`<h3>${line}</h3>`);
    else html.push(`<p>${line.replace(/</g,'&lt;')}</p>`);
  }
  html.push('</div>');
  kitOutput.innerHTML = html.join('');
}
kitForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(kitForm).entries());
  const kit = buildKit(data);
  lastKitText = kit.text;
  renderKit(data, kit);
  const body = encodeURIComponent(kit.text + '\n\nLead email: ' + v(data,'email'));
  mailKit.href = `mailto:studiousapplabs@gmail.com?subject=NewMRR Rec Rev Kit - ${encodeURIComponent(v(data,'name') || 'Lead')}&body=${body}`;
  kitResult.hidden = false;
  kitResult.scrollIntoView({behavior:'smooth', block:'start'});
});
copyKit.addEventListener('click', async () => {
  if (!lastKitText) return;
  await navigator.clipboard.writeText(lastKitText);
  copyKit.textContent = 'Copied';
  setTimeout(()=> copyKit.textContent = 'Copy kit', 1200);
});
saveKit.addEventListener('click', () => {
  if (!lastKitText) return;
  const kits = JSON.parse(localStorage.getItem('newmrr_kits') || '[]');
  kits.unshift({text:lastKitText, createdAt:new Date().toISOString()});
  localStorage.setItem('newmrr_kits', JSON.stringify(kits));
  saveKit.textContent = 'Saved';
  setTimeout(()=> saveKit.textContent = 'Save kit', 1200);
});
