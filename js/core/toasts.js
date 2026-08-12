// js/core/toasts.js — extracted from CBAMS index.html

/* =========================================================
   TOASTS
   ========================================================= */
function showToast(msg, type){
  type = type || 'info';
  const stack = document.getElementById('toastStack');
  const t = document.createElement('div');
  t.className = 'toast '+type;
  t.innerHTML = `<span class="tdot"></span><span>${msg}</span>`;
  stack.appendChild(t);
  setTimeout(()=>{
    t.style.transition='opacity .25s, transform .25s';
    t.style.opacity='0'; t.style.transform='translateY(6px)';
    setTimeout(()=>t.remove(), 260);
  }, 3600);
}
