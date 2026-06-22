function v(obj, key){ return String((obj && obj[key]) || '').trim(); }
function words(str){ return String(str || '').trim().split(/\s+/).filter(Boolean); }
function money(goal){ const n = Number(String(goal || '').replace(/[^0-9.]/g,'')); return Number.isFinite(n) && n > 0 ? n : 1000; }
function cap(str){ return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''; }
function makeOfferName(skill, model){ return `${cap(words(skill).slice(0,3).join(' ') || 'Skill')} ${model || 'Plan'}`; }
function pickTool(model){ return ({'Care plan':'book page + client list + monthly plan','Book plan':'book page + pay link + time slots','Member plan':'member page + lesson vault + pay wall','Coach plan':'call page + plan tracker + client notes','Tool fee':'simple web tool + login + pay link','Lead plan':'lead form + auto reply + client board','Serv plan':'order form + route/task board + pay link','Pack plan':'order page + file send + client portal'}[model] || 'lead page + pay link + client board'); }
function score(data){ const checks = [v(data,'skill'),v(data,'buyer'),v(data,'pain'),v(data,'paidProof'),v(data,'goal'),v(data,'model'),v(data,'load')]; let s = 35 + checks.filter(Boolean).length * 8; if(words(v(data,'skill')).length>5)s+=5; if(words(v(data,'buyer')).length>5)s+=5; if(words(v(data,'pain')).length>5)s+=5; return Math.min(96,s); }
function priceSet(goal){ const g = money(goal); return {low:Math.max(49,Math.round(g/20/5)*5), mid:Math.max(99,Math.round(g/10/5)*5), high:Math.max(199,Math.round(g/5/5)*5)}; }
function needCount(goal, price){ return Math.max(1, Math.ceil(money(goal) / price)); }
function buildKit(data){
  const name=v(data,'name')||'Client', skill=v(data,'skill')||'real skill', buyer=v(data,'buyer')||'folk who need this skill', pain=v(data,'pain')||'a pain they want gone', model=v(data,'model')||'Care plan';
  const tool=pickTool(model), offerName=makeOfferName(skill,model), prices=priceSet(v(data,'goal')), proofScore=score(data);
  const firstPitch=`I help ${buyer} fix ${pain} with a simple ${model.toLowerCase()} built from ${skill}.`;
  return `${name} Rec Rev Kit\n\nONE LINE OFFER\n${firstPitch}\n\nOFFER NAME\n${offerName}\n\nBUYER\n${buyer}\n\nPAIN\n${pain}\n\nPAID PART\n${skill}\n\nTOOL TO BUILD\n${tool}\n\nREC REV MODEL\n${model}\n\nPRICE TEST\nStart: $${prices.low}/mo needs ${needCount(v(data,'goal'), prices.low)} yes to hit goal.\nGrow: $${prices.mid}/mo needs ${needCount(v(data,'goal'), prices.mid)} yes to hit goal.\nPro: $${prices.high}/mo needs ${needCount(v(data,'goal'), prices.high)} yes to hit goal.\n\nPITCH\n${firstPitch}\n\nLOW LOAD PITCH\nYou have ${pain}.\nI can help.\nOne clear plan.\nEach mo.\n\nTEXT MSG\nHey, I am testing a simple plan for ${buyer}. It helps with ${pain}. Want me to send the short info?\n\nEMAIL\nSubject: quick help with ${pain}\n\nHi, I am testing a simple ${model.toLowerCase()} for ${buyer}. It helps with ${pain}. If useful, I can send a short one-page plan.\n\nFIRST 10 LEAD PLAN\n1. List 10 folk who know, like, or trust you.\n2. Send the text msg.\n3. Ask who else has this pain.\n4. Book 3 short talks.\n5. Ask for one paid test.\n\nRISK CUT\nIdea risk: cut by naming the buyer and pain.\nPrice risk: cut by testing 3 price points.\nTech risk: cut by building only the first tool.\nLoad risk: cut by keeping work to one lead test.\nSale risk: cut by using a short pitch.\n\nPROOF SCORE\n${proofScore}/100\n\nNEXT STEP\nNewMRR should build the first page, pitch sheet, and lead test plan. Then test with 10 warm leads before a big build.\n`;
}
function render(text){
  const out=document.getElementById('paidOutput');
  const proof=(text.match(/PROOF SCORE\n(\d+)/)||[])[1]||'--';
  let html=`<div class="kit-score"><b>Proof score</b><span>${proof}/100</span><meter value="${proof}" min="0" max="100"></meter></div><div class="kit-doc">`;
  for(const line of text.split('\n')){ if(!line){ html+='<br>'; continue; } if(line===line.toUpperCase()&&line.length<40) html+=`<h3>${line}</h3>`; else html+=`<p>${line.replace(/</g,'&lt;')}</p>`; }
  out.innerHTML=html+'</div>';
}
const data=JSON.parse(sessionStorage.getItem('newmrr_pending_kit')||'{}');
let kitText='';
if(Object.keys(data).length){ kitText=buildKit(data); } else { kitText='No kit data found. Go back to kit.html and make a kit first.'; }
render(kitText);
document.getElementById('copyPaidKit').addEventListener('click',async()=>{await navigator.clipboard.writeText(kitText);});
document.getElementById('savePaidKit').addEventListener('click',()=>{const kits=JSON.parse(localStorage.getItem('newmrr_paid_kits')||'[]');kits.unshift({text:kitText,createdAt:new Date().toISOString()});localStorage.setItem('newmrr_paid_kits',JSON.stringify(kits));});
document.getElementById('mailPaidKit').href=`mailto:studiousapplabs@gmail.com?subject=Paid NewMRR Kit&body=${encodeURIComponent(kitText)}`;
