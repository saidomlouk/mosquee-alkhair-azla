import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const TARGET = window.TARGET_AMOUNT || 270600;
let firebaseReady = false;
let auth, db;
let localList = JSON.parse(localStorage.getItem("alkhair_contributors_admin") || "[]");

function fmt(n){ return Number(n || 0).toLocaleString("fr-FR"); }
function stats(list){
  const total = list.reduce((s,c)=>s+Number(c.amount||0),0);
  document.getElementById("adminCount").innerText = list.length;
  document.getElementById("adminTotal").innerText = fmt(total);
  document.getElementById("adminRemaining").innerText = fmt(Math.max(0, TARGET-total));
}
function render(list){
  stats(list);
  document.getElementById("adminList").innerHTML = list.map(c => `
    <tr>
      <td>${c.name}</td>
      <td>${fmt(c.amount)} درهم</td>
      <td>
        <button onclick="editContributor('${c.id || ""}','${String(c.name).replaceAll("'","")}','${c.amount}')">تعديل</button>
        <button class="danger" onclick="deleteContributor('${c.id || ""}')">حذف</button>
      </td>
    </tr>`).join("");
}
function localSave(){ localStorage.setItem("alkhair_contributors_admin", JSON.stringify(localList)); render(localList); }

try{
  if(window.FIREBASE_CONFIG && window.FIREBASE_CONFIG.configured){
    const app = initializeApp(window.FIREBASE_CONFIG);
    auth = getAuth(app);
    db = getFirestore(app);
    firebaseReady = true;

    onAuthStateChanged(auth, user => {
      document.getElementById("loginBox").style.display = user ? "none" : "block";
      document.getElementById("adminBox").style.display = user ? "block" : "none";
      if(user){
        const q = query(collection(db, "contributors"), orderBy("createdAt", "desc"));
        onSnapshot(q, snap => {
          const list = snap.docs.map(d => ({id:d.id, ...d.data()}));
          render(list);
        });
      }
    });
  } else {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("adminBox").style.display = "block";
    render(localList);
  }
}catch(e){
  console.warn(e);
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("adminBox").style.display = "block";
  render(localList);
}

window.adminLogin = async function(){
  if(!firebaseReady){ alert("Firebase غير مفعّل بعد"); return; }
  await signInWithEmailAndPassword(auth, document.getElementById("email").value, document.getElementById("password").value);
}
window.adminLogout = async function(){
  if(firebaseReady) await signOut(auth);
}
window.adminAddContributor = async function(){
  const name = document.getElementById("cName").value.trim();
  const amount = Number(document.getElementById("cAmount").value);
  if(!name || !amount){ alert("دخل الاسم والمبلغ"); return; }
  if(firebaseReady){
    await addDoc(collection(db, "contributors"), {name, amount, createdAt: serverTimestamp()});
  } else {
    localList.unshift({id:crypto.randomUUID(), name, amount});
    localSave();
  }
  document.getElementById("cName").value = "";
  document.getElementById("cAmount").value = "";
}
window.deleteContributor = async function(id){
  if(!confirm("حذف هذا المساهم؟")) return;
  if(firebaseReady){
    await deleteDoc(doc(db, "contributors", id));
  } else {
    localList = localList.filter(c=>c.id!==id);
    localSave();
  }
}
window.editContributor = async function(id, oldName, oldAmount){
  const name = prompt("الاسم:", oldName);
  if(!name) return;
  const amount = Number(prompt("المبلغ:", oldAmount));
  if(!amount) return;
  if(firebaseReady){
    await updateDoc(doc(db, "contributors", id), {name, amount});
  } else {
    localList = localList.map(c=>c.id===id ? {...c,name,amount} : c);
    localSave();
  }
}
