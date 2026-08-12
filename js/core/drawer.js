// js/core/drawer.js — extracted from CBAMS index.html

/* =========================================================
   DRAWER
   ========================================================= */
const drawer = document.getElementById('drawer');
const scrim = document.getElementById('scrim');
function openDrawer(b){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p=>p.classList.remove('active'));
  document.querySelector('.tab[data-tab="directory"]').classList.add('active');
  document.getElementById('pane-directory').classList.add('active');
  document.querySelector('.tabs').style.display='';

  document.getElementById('dCode').textContent = b.code;
  document.getElementById('dName').textContent = b.name;
  const pill = document.getElementById('dStatus');
  pill.className = 'status-pill '+b.status;
  document.getElementById('dStatusText').textContent = b.status==='open' ? 'Open' : 'Closed';

  document.getElementById('dManager').textContent = b.manager||'—';
  document.getElementById('dManagerPhone').textContent = b.managerPhone||'—';
  document.getElementById('dManagerEmail').textContent = b.managerEmail||'—';
  document.getElementById('dOps').textContent = b.ops||'—';
  document.getElementById('dOpsPhone').textContent = b.opsPhone||'—';
  document.getElementById('dHotline').textContent = b.hotline||'—';

  document.getElementById('lRegion').textContent = b.region;
  document.getElementById('lAddress').textContent = b.address||'—';
  document.getElementById('lCoords').textContent = b.lat.toFixed(3)+', '+b.lng.toFixed(3);
  document.getElementById('lHours').textContent = b.hours||'—';

  const hist = document.getElementById('historyList');
  hist.innerHTML='';
  (b.history||[]).forEach(([title,reason,when,by])=>{
    const item = document.createElement('div');
    item.className='hist-item';
    item.innerHTML = `<div class="h-title">${title}</div><div class="h-meta">${reason} — ${when} · ${by}</div>`;
    hist.appendChild(item);
  });

  drawer.classList.add('show');
  scrim.classList.add('show');
}
function openRegionDrawer(regionName){
  const regionBranches = branches.filter(b=>b.region===regionName);
  const openCount = regionBranches.filter(b=>b.status==='open').length;
  const closedCount = regionBranches.filter(b=>b.status==='closed').length;

  document.getElementById('dCode').textContent = regionBranches.length+' branches';
  document.getElementById('dName').textContent = regionName;
  const pill = document.getElementById('dStatus');
  pill.className = 'status-pill open';
  document.getElementById('dStatusText').textContent = openCount+' open · '+closedCount+' closed';

  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p=>p.classList.remove('active'));
  document.querySelector('.tabs').style.display='none';

  document.getElementById('pane-region').innerHTML =
    `<div class="region-drawer-hint">Click a branch to view its full details.</div>` +
    regionBranches.sort((a,b)=>a.name.localeCompare(b.name)).map(b=>
      `<div class="region-branch-item" data-code="${b.code}">
        <div><div class="rb-name">${b.name}</div><div class="rb-code">${b.code}</div></div>
        <span class="rb-status ${b.status}">${b.status==='open'?'Open':'Closed'}</span>
      </div>`
    ).join('');

  document.getElementById('pane-region').querySelectorAll('.region-branch-item').forEach(item=>{
    item.addEventListener('click',()=>{
      const code = item.getAttribute('data-code');
      const b = branches.find(x=>x.code===code);
      if(b) openDrawer(b);
    });
  });

  document.getElementById('pane-region').classList.add('active');

  drawer.classList.add('show');
  scrim.classList.add('show');
}
document.getElementById('closeDrawer').addEventListener('click',closeDrawer);
scrim.addEventListener('click',closeDrawer);
function closeDrawer(){ drawer.classList.remove('show'); scrim.classList.remove('show'); }

document.querySelectorAll('.tab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p=>p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('pane-'+tab.dataset.tab).classList.add('active');
  });
});
