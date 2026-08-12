// js/modules/add-branch.js — extracted from CBAMS index.html

/* =========================================================
   ADD BRANCH — modal form
   ========================================================= */
function getKnownRegions(){
  return [...new Set(branches.map(b=>b.region))].sort();
}
function populateAddBranchRegions(){
  const sel = document.getElementById('abRegion');
  const current = sel.value;
  const regions = getKnownRegions();
  sel.innerHTML = regions.map(r=>`<option value="${r}">${r}</option>`).join('')
    + `<option value="__add__">+ Add new region…</option>`;
  if(current && regions.includes(current)) sel.value = current;
}
document.getElementById('abRegion').addEventListener('change', function(){
  if(this.value === '__add__'){
    const name = prompt('Enter the new region name:');
    if(name && name.trim()){
      const trimmed = name.trim();
      populateAddBranchRegions();
      if(![...this.options].some(o=>o.value===trimmed)){
        const opt = document.createElement('option');
        opt.value = trimmed; opt.textContent = trimmed;
        this.insertBefore(opt, this.lastElementChild);
      }
      this.value = trimmed;
    } else {
      this.value = getKnownRegions()[0] || '';
    }
  }
});

function openAddBranchModal(){
  document.getElementById('addBranchForm').reset();
  populateAddBranchRegions();
  document.getElementById('addBranchScrim').classList.add('show');
  document.getElementById('addBranchModal').classList.add('show');
}
function closeAddBranchModal(){
  document.getElementById('addBranchScrim').classList.remove('show');
  document.getElementById('addBranchModal').classList.remove('show');
}
document.getElementById('openAddBranchBtn').addEventListener('click', openAddBranchModal);
document.getElementById('addBranchModalClose').addEventListener('click', closeAddBranchModal);
document.getElementById('addBranchCancelBtn').addEventListener('click', closeAddBranchModal);
document.getElementById('addBranchScrim').addEventListener('click', closeAddBranchModal);

document.getElementById('addBranchSaveBtn').addEventListener('click', function(){
  const code = document.getElementById('abCode').value.trim();
  const name = document.getElementById('abName').value.trim();
  const region = document.getElementById('abRegion').value;
  const anniversary = document.getElementById('abAnniversary').value;
  const lat = parseFloat(document.getElementById('abLat').value);
  const lng = parseFloat(document.getElementById('abLng').value);
  const address = document.getElementById('abAddress').value.trim();
  const manager = document.getElementById('abManager').value.trim();
  const managerPhone = document.getElementById('abManagerPhone').value.trim();
  const managerEmail = document.getElementById('abManagerEmail').value.trim();
  const ops = document.getElementById('abOps').value.trim();
  const opsPhone = document.getElementById('abOpsPhone').value.trim();
  const hotline = document.getElementById('abHotline').value.trim();

  if(!code || !name){ showToast('Branch code and name are required.', 'error'); return; }
  if(!region || region==='__add__'){ showToast('Select or add a region.', 'error'); return; }
  if(isNaN(lat) || isNaN(lng)){ showToast('Enter valid latitude and longitude.', 'error'); return; }
  if(branches.some(b=>b.code.toLowerCase()===code.toLowerCase())){
    showToast(`Branch code "${code}" already exists.`, 'error');
    return;
  }

  const newBranch = {
    code, name, region, lat, lng, status:'open',
    anniversary: anniversary || new Date().toISOString().split('T')[0],
    address: address || `${name} Office`,
    hours: '9:00 AM – 3:00 PM',
    manager: manager || '—', managerPhone: managerPhone || '—', managerEmail: managerEmail || '—',
    ops: ops || '—', opsPhone: opsPhone || '—', hotline: hotline || '—',
    history:[['Opened', 'Branch added to directory', 'Just now', `${USERS[currentRole].name} (Added new branch)`]]
  };
  branches.push(newBranch);

  closeAddBranchModal();
  populateBranchSelect();
  renderDirectoryList(document.getElementById('directorySearch').value);
  showDirectoryDetail(newBranch);
  refreshAll();
  showToast(`Branch "${name}" (${code}) added to the directory.`, 'success');
});
