// js/modules/branch-directory.js — extracted from CBAMS index.html

/* =========================================================
   BRANCH DIRECTORY — grouped by region
   ========================================================= */
let directorySelectedCode = null;
let directoryCollapsed = {};
let directoryListInitialized = false;
let directorySearchActive = false;
function renderDirectoryList(filterText){
  const list = document.getElementById('directoryList');
  const q = (filterText||'').trim().toLowerCase();
  const filtered = q ? branches.filter(b=>b.name.toLowerCase().includes(q) || b.code.toLowerCase().includes(q)) : branches;
  if(filtered.length===0){
    list.innerHTML = `<div class="directory-empty">No branches match your search.</div>`;
    return;
  }
  const groups = {};
  filtered.forEach(b=>{
    if(!groups[b.region]) groups[b.region] = [];
    groups[b.region].push(b);
  });
  const regionNames = Object.keys(groups).sort();
  if(!directoryListInitialized){
    regionNames.forEach(region => { directoryCollapsed[region] = true; });
    directoryListInitialized = true;
  }
  if(q){
    regionNames.forEach(region => { directoryCollapsed[region] = false; });
    directorySearchActive = true;
  } else if(directorySearchActive){
    // search was just cleared — go back to the collapsed per-region list
    Object.keys(directoryCollapsed).forEach(region => { directoryCollapsed[region] = true; });
    directorySearchActive = false;
  }
  list.innerHTML = regionNames.map(region=>{
    const items = groups[region].sort((a,b)=>a.name.localeCompare(b.name));
    const isCollapsed = !!directoryCollapsed[region];
    return `
      <div class="directory-group ${isCollapsed?'collapsed':''}" data-region="${region}">
        <div class="directory-group-head">
          <span>${region}</span>
          <span class="dg-count">${items.length} <span class="dg-chev">▾</span></span>
        </div>
        <div class="directory-group-body">
          ${items.map(b=>`
            <div class="region-branch-item ${b.code===directorySelectedCode?'selected':''}" data-code="${b.code}">
              <div><div class="rb-name">${b.name}</div><div class="rb-code">${b.code}</div></div>
            </div>`).join('')}
        </div>
      </div>`;
  }).join('');
  list.querySelectorAll('.directory-group-head').forEach(head=>{
    head.addEventListener('click', ()=>{
      const group = head.closest('.directory-group');
      const region = group.getAttribute('data-region');
      directoryCollapsed[region] = !directoryCollapsed[region];
      group.classList.toggle('collapsed', directoryCollapsed[region]);
    });
  });
  list.querySelectorAll('.region-branch-item').forEach(item=>{
    item.addEventListener('click', (e)=>{
      e.stopPropagation();
      const code = item.getAttribute('data-code');
      const b = branches.find(x=>x.code===code);
      if(b) showDirectoryDetail(b);
    });
  });
}
function showDirectoryDetail(b){
  directorySelectedCode = b.code;
  document.querySelectorAll('#directoryList .region-branch-item').forEach(item=>{
    item.classList.toggle('selected', item.getAttribute('data-code')===b.code);
  });
  const detail = document.getElementById('directoryDetail');
  detail.innerHTML = `
    <div class="dd-name">${b.name}</div>
    <div class="dd-code">${b.code}</div>
    <div class="info-row"><span class="k">Date Opened</span><span class="v">${b.anniversary||'—'}</span></div>
    <div class="info-row"><span class="k">Region</span><span class="v">${b.region}</span></div>
    <div class="info-row"><span class="k">Address</span><span class="v">${b.address||'—'}</span></div>
    <div class="info-row"><span class="k">Coordinates</span><span class="v">${b.lat.toFixed(3)}, ${b.lng.toFixed(3)}</span></div>
  `;
}
document.getElementById('directorySearch').addEventListener('input',(e)=>{
  renderDirectoryList(e.target.value);
});
