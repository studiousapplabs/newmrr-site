const kitForm = document.getElementById('kitForm');
const kitResult = document.getElementById('kitResult');
const kitOutput = document.getElementById('kitOutput');
const copyKit = document.getElementById('copyKit');
const saveKit = document.getElementById('saveKit');
const mailKit = document.getElementById('mailKit');
let lastKitText = '';

function v(obj, key){ return String(obj[key] || '').trim(); }
function words(str){ return v({x:str},'x').split(/\s+/).filter(Boolean); }
function money(goal){ const n = Number(String(goal || '').replace(/[^0-9.]/g,'')); return Number.isFinite(n) && n > 0 ? n : 1000; }
function cap(str){ return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''; }
function makeOfferName(skill, model){ const base = words(skill).slice(0,3).join(' ') || 'Skill'; return `${cap(base)} ${model}`; }
function pickTool(model){
  const map = {'Care plan':'book page + client list + monthly plan','Book plan':'book page + pay link + time slots','Member plan':'member page + lesson vault + pay wall','Coach plan':'call page + plan tracker + client notes','Tool fee':'simple web tool + login + pay link','Lead plan':'lead form + auto reply + client board','Serv plan':'order form + route/task board + pay link','Pack plan':'order page + file send + client portal'};
  return map[model] || 'lead page + pay link + client board';
}
function score(data){ const checks = [v(data,'skill'), v(data,'buyer'), v(data,'pain'), v(data,'paidProof'), v(data,'goal'), v(data,'model'), v(data,'load')]; let s = 35 + checks.filter(Boolean).length * 8; if (words(v(data,'skill')).length > 5) s += 5; if (words(v(data,'buyer')).length > 5) s += 5; if (words(v(data,'pain')).length > 5) s += 5; return Math.min(96, s); }
function priceSet(goal){ const g = money(goal); return {low:Math.max(49, Math.round(g / 20 / 5) * 5), mid:Math.max(99, Math.round(g / 10 / 5) * 5), high:Math.max(199, Math.round(g / 5 / 5) * 5)}; }
function needCount(goal, price){ return Math.max(1, Math.ceil(money(goal) / price)); }
function buildPreview(data){
  const skill = v(data,'skill') || 'real skill';
  const buyer = v(data,'buyer') || 'folk who need this skill';
  const pain = v(data,'pain') || 'a pain they want gone';
  const model = v(data,'model') || 'Care plan';
  const prices = priceSet(v(data,'goal'));
  const proofScore = score(data);
  return {proofScore, text:`Free preview\n\nSkill: ${skill}\nBuyer: ${buyer}\nPain: ${pain}\nModel: ${model}\nStart price idea: $${prices.low}/mo\nProof score: ${proofScore}/100\n\nUnlock the full Founder Rec Rev Kit for $100.\nIt gives offer, tool, 3 price tests, pitch, text msg, email, first 10 lead plan, risk cut, and next step.`};
}
function renderPreview(preview){
  kitOutput.innerHTML = `<div class="kit-score"><b>Preview score</b><span>${preview.proofScore}/100</span><meter value="${preview.proofScore}" min="0" max="100"></meter></div><div class="kit-doc"><h3>FREE PREVIEW</h3>${preview.text.split('\n').map(x => x ? `<p>${x.replace(/</g,'&lt;')}</p>` : '<br>').join('')}<br><a class="btn" href="checkout.html">Unlock full kit for $100</a></div>`;
}
kitForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(kitForm).entries());
  sessionStorage.setItem('newmrr_pending_kit', JSON.stringify(data));
  const preview = buildPreview(data);
  lastKitText = preview.text;
  renderPreview(preview);
  const body = encodeURIComponent('Preview lead\n\nName: '+v(data,'name')+'\nEmail: '+v(data,'email')+'\nSkill: '+v(data,'skill')+'\nBuyer: '+v(data,'buyer')+'\nPain: '+v(data,'pain'));
  mailKit.href = `mailto:studiousapplabs@gmail.com?subject=NewMRR Kit Lead - ${encodeURIComponent(v(data,'name') || 'Lead')}&body=${body}`;
  kitResult.hidden = false;
  kitResult.scrollIntoView({behavior:'smooth', block:'start'});
});
copyKit.addEventListener('click', async () => { if (!lastKitText) return; await navigator.clipboard.writeText(lastKitText); copyKit.textContent = 'Copied'; setTimeout(()=> copyKit.textContent = 'Copy kit', 1200); });
saveKit.addEventListener('click', () => { if (!lastKitText) return; const kits = JSON.parse(localStorage.getItem('newmrr_preview_kits') || '[]'); kits.unshift({text:lastKitText, createdAt:new Date().toISOString()}); localStorage.setItem('newmrr_preview_kits', JSON.stringify(kits)); saveKit.textContent = 'Saved'; setTimeout(()=> saveKit.textContent = 'Save kit', 1200); });
