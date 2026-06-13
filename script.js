

function copyRib(){
  const text=document.getElementById('rib').innerText;
  navigator.clipboard.writeText(text).then(()=>alert('تم نسخ RIB بنجاح'));
}
function closeLightbox(){document.getElementById('lightbox').classList.remove('show')}
document.addEventListener('DOMContentLoaded',()=>{
  renderContributors(contributors);
  const search=document.getElementById('search');
  if(search){
    search.addEventListener('input',()=>{
      const q=search.value.trim();
      renderContributors(contributors.filter(c=>c.name.includes(q) || String(c.amount).includes(q)));
    });
  }
  document.querySelectorAll('.zoom-img').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const img=btn.querySelector('img');
      document.getElementById('lightboxImg').src=img.src;
      document.getElementById('lightbox').classList.add('show');
    });
  });
  document.getElementById('lightbox').addEventListener('click',e=>{
    if(e.target.id==='lightbox') closeLightbox();
  });
});
const TARGET_AMOUNT = 270600;
const STORAGE_KEY = 'alkhair_contributors_v1';

function getContributors(){
  const saved = localStorage.getItem(STORAGE_KEY);
  if(saved){
    try { return JSON.parse(saved); } catch(e) {}
  }
  return contributors.slice();
}
function saveContributors(list){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
function formatAmount(n){
  return Number(n).toLocaleString('fr-FR');
}
function updateStats(list){
  const total = list.reduce((s,c)=>s+Number(c.amount||0),0);
  const remaining = Math.max(0, TARGET_AMOUNT - total);
  const count = list.length;
  const countEl=document.getElementById('statCount');
  const totalEl=document.getElementById('statTotal');
  const remainingEl=document.getElementById('statRemaining');
  if(countEl) countEl.innerText=count;
  if(totalEl) totalEl.innerText=formatAmount(total);
  if(remainingEl) remainingEl.innerText=formatAmount(remaining);
}
function renderContributors(list){
  const body=document.getElementById('contributorsBody');
  if(!body) return;
  body.innerHTML=list.map((c,i)=>`<tr><td>${c.n || i+1}</td><td>${c.name}</td><td>${formatAmount(c.amount)} درهم</td></tr>`).join('');
}
function refreshContributors(){
  const list = getContributors();
  const q = (document.getElementById('search')?.value || '').trim();
  const filtered = q ? list.filter(c => c.name.includes(q) || String(c.amount).includes(q)) : list;
  renderContributors(filtered);
  updateStats(list);
}
function addContributor(){
  const name = document.getElementById('newName').value.trim();
  const amount = Number(document.getElementById('newAmount').value);
  if(!name || !amount || amount <= 0){
    alert('دخل الاسم والمبلغ بشكل صحيح');
    return;
  }
  const list = getContributors();
  list.push({n:list.length+1, name, amount});
  saveContributors(list);
  document.getElementById('newName').value='';
  document.getElementById('newAmount').value='';
  refreshContributors();
}
function resetContributors(){
  if(confirm('واش بغيتي ترجع اللائحة الأصلية وتحذف الإضافات المحلية؟')){
    localStorage.removeItem(STORAGE_KEY);
    refreshContributors();
  }
}
function exportContributors(){
  const data = JSON.stringify(getContributors(), null, 2);
  const blob = new Blob([data], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'contributors_alkhair_azla.json';
  a.click();
  URL.revokeObjectURL(a.href);
}
document.addEventListener('DOMContentLoaded',()=>{
  refreshContributors();
  const search=document.getElementById('search');
  if(search) search.addEventListener('input', refreshContributors);
});


// Public Firebase live contributors support (optional)
async function loadFirebaseContributorsIfConfigured(){
  if(!window.FIREBASE_CONFIG || !window.FIREBASE_CONFIG.configured) return;
  try{
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js");
    const { getFirestore, collection, onSnapshot, query, orderBy } = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js");
    const app = initializeApp(window.FIREBASE_CONFIG);
    const db = getFirestore(app);
    const q = query(collection(db, "contributors"), orderBy("createdAt", "desc"));
    onSnapshot(q, snap => {
      const live = snap.docs.map((d,i)=>({n:i+1, id:d.id, ...d.data()}));
      window.liveContributors = live;
      renderContributors(live);
      updateStats(live);
    });
  }catch(e){ console.warn("Firebase public load failed", e); }
}
document.addEventListener('DOMContentLoaded', loadFirebaseContributorsIfConfigured);
