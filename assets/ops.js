const audience = document.getElementById('audience');
const pain = document.getElementById('pain');
const cta = document.getElementById('cta');
const copyOut = document.getElementById('copyOut');
const savedKits = document.getElementById('savedKits');
const makeCopy = document.getElementById('makeCopy');
const exportData = document.getElementById('exportData');

function val(el, fallback){ return (el.value || fallback || '').trim(); }
function allData(){
  return {
    leads: JSON.parse(localStorage.getItem('newmrr_leads') || '[]'),
    previews: JSON.parse(localStorage.getItem('newmrr_preview_kits') || '[]'),
    paid: JSON.parse(localStorage.getItem('newmrr_paid_kits') || '[]'),
    saved: JSON.parse(localStorage.getItem('newmrr_kits') || '[]')
  };
}
function lowCopy(a,p,c){
  return `SOCIAL POST\n\nYou have skill.\nThat skill may earn each mo.\n\nIf you are ${a},\nand ${p} is in the way,\nstart small.\n\nMap the skill.\nShape the offer.\nBuild the tool.\nTest the path.\n\n${c}\n\n---\n\nEMAIL\nSubject: quick skill map?\n\nHi [Name],\n\nYou have real skill.\n\nIf ${p} is in the way,\nwe can help map the paid part.\n\nNo tech class.\nNo new job.\nNo wild leap.\n\nJust a first map:\nskill, offer, tool, pitch, and rec rev path.\n\n${c}\n\n- NewMRR\n\n---\n\nYOUTUBE SHORT SCRIPT\n\nHook:\nYou do not need one more job.\n\nBody:\nYou need a smart use of the work you know.\nAt NewMRR, we help ${a} turn skill into a rec rev path.\nWe map the paid part.\nWe shape the offer.\nWe build the tool.\nWe test the pitch.\n\nClose:\nStart with the Skill Map.\n${c}\n\nTitle:\nYou Have Skill. Build Rec Rev.\n\nDesc:\nNewMRR helps folk turn real skill into a clear offer, tool, pitch, and rec rev path. Start small. Test the path. ${c}`;
}
function renderSaved(){
  const data = allData();
  const items = [...data.paid, ...data.saved, ...data.previews, ...data.leads].slice(0,20);
  if(!items.length){ savedKits.innerHTML = '<p>No saved kits yet.</p>'; return; }
  savedKits.innerHTML = items.map((item, idx) => `<article class="saved-item"><b>Item ${idx+1}</b><small>${item.createdAt || 'no date'}</small><p>${String(item.text || item.skill || 'lead').slice(0,220)}</p></article>`).join('');
}
makeCopy.addEventListener('click', () => {
  copyOut.textContent = lowCopy(val(audience,'skilled folk'), val(pain,'no clear rec rev path'), val(cta,'Try the $10 Founder Kit'));
});
exportData.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(allData(), null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `newmrr-local-data-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
});
renderSaved();
