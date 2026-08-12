// js/core/view-switching.js — extracted from CBAMS index.html

/* =========================================================
   VIEW SWITCHING
   ========================================================= */
function switchView(name){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById('view-'+name).classList.add('active');
  document.getElementById('nav-dashboard').classList.toggle('current', name==='dashboard');
  document.getElementById('nav-directory').classList.toggle('current', name==='branch-directory');
  closeAllDropdowns();
  if(name==='approval') renderPendingList();
  if(name==='archive') renderArchiveList();
  if(name==='request') renderMySubmissions();
  if(name==='branch-directory') renderDirectoryList();
  if(name==='reports'){ populateReportCategoryFilter(); renderReportTable(); }
  window.scrollTo({top:0, behavior:'smooth'});
}
document.getElementById('nav-dashboard').addEventListener('click', ()=>switchView('dashboard'));
document.getElementById('nav-directory').addEventListener('click', ()=>switchView('branch-directory'));
document.getElementById('brand-home').addEventListener('click', ()=>switchView('dashboard'));
document.getElementById('link-request').addEventListener('click',(e)=>{e.preventDefault(); switchView('request');});
document.getElementById('link-approval').addEventListener('click',(e)=>{e.preventDefault(); switchView('approval');});
document.getElementById('link-approval-locked').addEventListener('click',(e)=>{
  e.preventDefault();
  showToast('Approval queue requires admin access. Switch role in the account menu.', 'error');
});
document.getElementById('link-archive').addEventListener('click',(e)=>{e.preventDefault(); switchView('archive');});
document.getElementById('link-sms').addEventListener('click',(e)=>{e.preventDefault(); switchView('sms'); renderSmsRecipientTags();});
document.getElementById('link-reports').addEventListener('click',(e)=>{e.preventDefault(); switchView('reports');});
