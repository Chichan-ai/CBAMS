// js/core/nav-dropdowns.js — extracted from CBAMS index.html

/* =========================================================
   NAV DROPDOWNS
   ========================================================= */
function closeAllDropdowns(){
  document.querySelectorAll('.dropdown.show').forEach(d=>d.classList.remove('show'));
  document.querySelectorAll('.navitem.open').forEach(n=>n.classList.remove('open'));
  document.getElementById('dd-account').classList.remove('show');
}
function wireDropdown(navId, ddId){
  const nav = document.getElementById(navId), dd = document.getElementById(ddId);
  nav.addEventListener('click',(e)=>{
    e.stopPropagation();
    const willOpen = !dd.classList.contains('show');
    closeAllDropdowns();
    if(willOpen){ dd.classList.add('show'); nav.classList.add('open'); }
  });
}
wireDropdown('nav-records','dd-records');
wireDropdown('nav-forms','dd-forms');

const accCell = document.getElementById('account-cell');
const accDD = document.getElementById('dd-account');
accCell.addEventListener('click',(e)=>{ e.stopPropagation(); accDD.classList.toggle('show'); });
document.addEventListener('click', closeAllDropdowns);
