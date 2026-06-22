const form = document.getElementById('skillForm');
const result = document.getElementById('result');

function clean(v){ return String(v || '').trim(); }
function clip(v,n=120){ return clean(v).slice(0,n); }

function buildMap(data){
  const skill = clip(data.skill, 160) || 'your skill';
  const buyer = clip(data.buyer, 120) || 'the folk who need it most';
  const load = clip(data.load, 140) || 'time, tech, price, or sales';
  return `Your Skill Map draft\n\nSkill:\n${skill}\n\nBuyer:\n${buyer}\n\nRisk to cut:\n${load}\n\nPath:\n1. Find the paid part.\n2. Shape one clear offer.\n3. Pick a simple tool.\n4. Set a first price.\n5. Make a short pitch.\n6. Test with 10 warm leads.\n\nNext step:\nBook a short call with NewMRR.\n\nSend this lead:\nmailto:studiousapplabs@gmail.com?subject=NewMRR Skill Map Lead&body=${encodeURIComponent('Name: '+data.name+'\nEmail: '+data.email+'\nSkill: '+data.skill+'\nBuyer: '+data.buyer+'\nLoad: '+data.load)}`;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(form);
  const data = Object.fromEntries(fd.entries());
  const leads = JSON.parse(localStorage.getItem('newmrr_leads') || '[]');
  leads.unshift({...data, createdAt: new Date().toISOString()});
  localStorage.setItem('newmrr_leads', JSON.stringify(leads));
  result.hidden = false;
  result.textContent = buildMap(data);
  result.scrollIntoView({behavior:'smooth', block:'center'});
});
