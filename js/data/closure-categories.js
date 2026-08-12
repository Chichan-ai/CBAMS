// js/data/closure-categories.js — extracted from CBAMS index.html

/* =========================================================
   CLOSURE CATEGORIES & SUBCATEGORIES
   ========================================================= */
let CLOSURE_CATEGORIES = {
  'Natural Disruption': ['Flood','Typhoon','Volcanic Activity','Earthquake','Landslide','Storm Surge','Other'],
  'Political Disruption': ['Rally / Protest','Transport Strike','Election-related','Civil Disturbance','Other'],
  'Disaster': ['Fire','Explosion','Structural Damage','Other'],
  'Security Incident': ['Robbery','Theft','Bomb Threat','Armed Threat','Other'],
  'Operational': ['Power Outage','Connectivity / System Outage','Scheduled System Maintenance','Other'],
  'Other': ['Other']
};

function populateCategorySelect(preserveValue){
  const sel = document.getElementById('reqCategory');
  const current = preserveValue ? sel.value : null;
  sel.innerHTML = Object.keys(CLOSURE_CATEGORIES).map(c=>`<option value="${c}">${c}</option>`).join('')
    + `<option value="__add__">+ Add new category…</option>`;
  if(current && CLOSURE_CATEGORIES[current]) sel.value = current;
}

function populateSubcategorySelect(preserveValue){
  const cat = document.getElementById('reqCategory').value;
  const sel = document.getElementById('reqSubcategory');
  const current = preserveValue ? sel.value : null;
  const subs = CLOSURE_CATEGORIES[cat] || ['Other'];
  sel.innerHTML = subs.map(s=>`<option value="${s}">${s}</option>`).join('')
    + `<option value="__add__">+ Add new subcategory…</option>`;
  if(current && subs.includes(current)) sel.value = current;
}

document.getElementById('reqCategory').addEventListener('change', function(){
  if(this.value === '__add__'){
    document.getElementById('newCategoryGroup').style.display = 'block';
    document.getElementById('subcategoryGroup').style.display = 'none';
    document.getElementById('newSubcategoryGroup').style.display = 'none';
    document.getElementById('newCategoryInput').focus();
  } else {
    document.getElementById('newCategoryGroup').style.display = 'none';
    document.getElementById('subcategoryGroup').style.display = 'block';
    populateSubcategorySelect(false);
  }
});

document.getElementById('addCategoryBtn').addEventListener('click', function(){
  const input = document.getElementById('newCategoryInput');
  const name = input.value.trim();
  if(!name){ showToast('Enter a category name.', 'error'); return; }
  if(!CLOSURE_CATEGORIES[name]) CLOSURE_CATEGORIES[name] = ['Other'];
  populateCategorySelect(false);
  document.getElementById('reqCategory').value = name;
  input.value = '';
  document.getElementById('newCategoryGroup').style.display = 'none';
  document.getElementById('subcategoryGroup').style.display = 'block';
  populateSubcategorySelect(false);
  showToast(`Category "${name}" added.`, 'success');
});
document.getElementById('cancelCategoryBtn').addEventListener('click', function(){
  document.getElementById('newCategoryInput').value = '';
  document.getElementById('newCategoryGroup').style.display = 'none';
  document.getElementById('reqCategory').value = Object.keys(CLOSURE_CATEGORIES)[0];
  document.getElementById('subcategoryGroup').style.display = 'block';
  populateSubcategorySelect(false);
});

document.getElementById('reqSubcategory').addEventListener('change', function(){
  document.getElementById('newSubcategoryGroup').style.display = this.value==='__add__' ? 'block' : 'none';
  if(this.value==='__add__') document.getElementById('newSubcategoryInput').focus();
});

document.getElementById('addSubcategoryBtn').addEventListener('click', function(){
  const cat = document.getElementById('reqCategory').value;
  const input = document.getElementById('newSubcategoryInput');
  const name = input.value.trim();
  if(!name){ showToast('Enter a subcategory name.', 'error'); return; }
  if(!CLOSURE_CATEGORIES[cat]) CLOSURE_CATEGORIES[cat] = [];
  if(!CLOSURE_CATEGORIES[cat].includes(name)){
    const list = CLOSURE_CATEGORIES[cat];
    const otherIdx = list.indexOf('Other');
    if(otherIdx>-1) list.splice(otherIdx,0,name); else list.push(name);
  }
  populateSubcategorySelect(false);
  document.getElementById('reqSubcategory').value = name;
  input.value = '';
  document.getElementById('newSubcategoryGroup').style.display = 'none';
  showToast(`Subcategory "${name}" added.`, 'success');
});
document.getElementById('cancelSubcategoryBtn').addEventListener('click', function(){
  document.getElementById('newSubcategoryInput').value = '';
  document.getElementById('newSubcategoryGroup').style.display = 'none';
  document.getElementById('reqSubcategory').value = (CLOSURE_CATEGORIES[document.getElementById('reqCategory').value]||['Other'])[0];
});

populateCategorySelect(false);
populateSubcategorySelect(false);

let reqIdCounter = 1;
let requests = [];

document.getElementById('requestForm').addEventListener('submit', function(e){
  e.preventDefault();
  const branchCode = reqBranchSel.value;
  const b = branches.find(x=>x.code===branchCode);
  const statusInput = document.querySelector('input[name=reqStatus]:checked');
  if(!b){ showToast('Select a branch first.', 'error'); return; }
  if(!statusInput){ showToast('Choose whether the branch is closing or reopening.', 'error'); return; }
  const reason = document.getElementById('reqReason').value.trim();
  if(!reason){ showToast('Add a short description of what happened.', 'error'); return; }

  const requestedStatus = statusInput.value;
  const category = requestedStatus==='closed' ? document.getElementById('reqCategory').value : null;
  const subcategory = requestedStatus==='closed' ? document.getElementById('reqSubcategory').value : null;
  const closedFrom = requestedStatus==='closed' ? document.getElementById('reqClosedFrom').value : null;
  const closedUntil = requestedStatus==='closed' ? document.getElementById('reqClosedUntil').value : null;
  const closedFromTime = requestedStatus==='closed' ? (document.getElementById('reqClosedFromTime').value || '08:00') : null;
  const closedUntilTime = requestedStatus==='closed' ? (document.getElementById('reqClosedUntilTime').value || '15:00') : null;
  if(requestedStatus==='closed' && category==='__add__'){
    showToast('Finish adding the new category, or choose an existing one.', 'error');
    return;
  }
  if(requestedStatus==='closed' && subcategory==='__add__'){
    showToast('Finish adding the new subcategory, or choose an existing one.', 'error');
    return;
  }
  if(requestedStatus==='closed' && !closedFrom){
    showToast('Select a "Closed from" date.', 'error');
    return;
  }
  if(requestedStatus==='closed' && !closedUntil){
    showToast('Select a "Closed until" date.', 'error');
    return;
  }

  const now = new Date();
  const req = {
    id: 'REQ-'+String(1000+reqIdCounter++),
    branchCode: b.code,
    branchName: b.name,
    region: b.region,
    currentStatus: b.status,
    requestedStatus, category, subcategory, reason, closedFrom, closedUntil, closedFromTime, closedUntilTime,
    submittedBy: USERS[currentRole].name,
    submittedByRole: currentRole,
    submittedByPosition: USERS[currentRole].roleLabel,
    submittedAt: 'Just now',
    submittedAtDate: now,
    status: 'pending',
    reviewedBy: null, reviewedAt: null, reviewedAtDate: null
  };
  requests.unshift(req);
  showToast(`Request ${req.id} submitted for approval.`, 'success');
  this.reset();
  branchPreview.classList.remove('show');
  document.getElementById('optClosed').classList.remove('disabled');
  document.getElementById('optOpen').classList.remove('disabled');
  document.getElementById('optClosed').querySelector('input').disabled = false;
  document.getElementById('optOpen').querySelector('input').disabled = false;
  document.getElementById('reqClosedFrom').value = '';
  document.getElementById('reqClosedUntil').value = '';
  document.getElementById('holidayIndicator').style.display = 'none';
  document.getElementById('holidayOverlap').style.display = 'none';
  document.getElementById('holidaySuggest').style.display = 'none';
  syncStatusChoiceUI();
  updatePendingBadge();
  renderMySubmissions();
});
document.getElementById('reqResetBtn').addEventListener('click', ()=>{
  setTimeout(()=>{
    branchPreview.classList.remove('show');
    document.getElementById('optClosed').classList.remove('disabled');
    document.getElementById('optOpen').classList.remove('disabled');
    document.getElementById('optClosed').querySelector('input').disabled = false;
    document.getElementById('optOpen').querySelector('input').disabled = false;
    document.getElementById('reqClosedFrom').value = '';
    document.getElementById('reqClosedUntil').value = '';
    document.getElementById('holidayIndicator').style.display = 'none';
    document.getElementById('holidayOverlap').style.display = 'none';
    document.getElementById('holidaySuggest').style.display = 'none';
    syncStatusChoiceUI();
  }, 0);
});

function fmtDateTime(dateStr, timeStr){
  if(!dateStr) return '';
  const d = new Date(dateStr+'T'+(timeStr||'00:00')+':00');
  return d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) + (timeStr ? ', '+d.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit',hour12:true}) : '');
}

function reqCardHTML(r, withActions){
  const closedFromDate = r.closedFrom ? fmtDateTime(r.closedFrom, r.closedFromTime) : '';
  const closedUntilDate = r.closedUntil ? fmtDateTime(r.closedUntil, r.closedUntilTime) : '';
  const changeHTML = r.requestedStatus==='closed'
    ? `<span class="pill open">OPEN</span><span class="arrow">→</span><span class="pill closed">CLOSED</span>${r.category?`<span class="pill cat">${r.category}</span>`:''}${r.subcategory?`<span class="pill cat">${r.subcategory}</span>`:''}${closedFromDate?`<span class="pill cat">from ${closedFromDate}</span>`:''}${closedUntilDate?`<span class="pill cat">until ${closedUntilDate}</span>`:''}`
    : `<span class="pill closed">CLOSED</span><span class="arrow">→</span><span class="pill open">OPEN</span>`;
  const statusPillHTML = r.status==='pending'
    ? `<span class="pill pending">PENDING</span>`
    : r.status==='approved' ? `<span class="pill approved">APPROVED</span>` : `<span class="pill rejected">REJECTED</span>`;
  let actionsOrStatus = '';
  if(withActions && r.status==='pending'){
    actionsOrStatus = `<div class="req-actions admin-only flex">
        <button class="btn btn-approve btn-sm" onclick="approveRequest('${r.id}')">Approve</button>
        <button class="btn btn-danger btn-sm" onclick="rejectRequest('${r.id}')">Reject</button>
      </div>`;
  } else if(r.status!=='pending'){
    actionsOrStatus = `<div class="req-status-line">${r.status==='approved'?'Approved':'Rejected'} by ${r.reviewedBy} · ${r.reviewedAt}</div>`;
  }
  return `<div class="req-card">
      <div class="req-top">
        <div><div class="req-branch">${r.branchName}</div><div class="req-code">${r.branchCode} · ${r.region}</div></div>
        ${statusPillHTML}
      </div>
      <div class="req-change">${changeHTML}</div>
      <div class="req-reason">${r.reason}</div>
      <div class="req-meta"><span>${r.id}</span><span>Submitted by ${r.submittedBy}${r.submittedByPosition?` (${r.submittedByPosition})`:''} · ${r.submittedAt}</span></div>
      ${actionsOrStatus}
    </div>`;
}

function renderMySubmissions(){
  const mine = requests.filter(r=>r.submittedByRole===currentRole);
  const el = document.getElementById('mySubmissions');
  if(mine.length===0){ el.innerHTML = '<div class="empty">No submissions yet this session.</div>'; return; }
  el.innerHTML = mine.map(r=>reqCardHTML(r,false)).join('');
}

function renderPendingList(){
  const pending = requests.filter(r=>r.status==='pending');
  const el = document.getElementById('pendingList');
  if(pending.length===0){ el.innerHTML = '<div class="empty">No pending requests. New submissions will appear here.</div>'; return; }
  el.innerHTML = pending.map(r=>reqCardHTML(r,true)).join('');
}

let archiveFilter = 'all';
function renderArchiveList(){
  let list = requests.filter(r=>r.status!=='pending');
  if(archiveFilter!=='all') list = list.filter(r=>r.status===archiveFilter);
  const el = document.getElementById('archiveList');
  if(list.length===0){ el.innerHTML = '<div class="empty">No archived requests yet.</div>'; return; }
  el.innerHTML = list.map(r=>reqCardHTML(r,false)).join('');
}
document.querySelectorAll('.filter-chip').forEach(chip=>{
  chip.addEventListener('click',()=>{
    document.querySelectorAll('.filter-chip').forEach(c=>c.classList.remove('active'));
    chip.classList.add('active');
    archiveFilter = chip.dataset.filter;
    renderArchiveList();
  });
});

function updatePendingBadge(){
  const n = requests.filter(r=>r.status==='pending').length;
  const badge = document.getElementById('pendingCountBadge');
  if(n>0){ badge.style.display='inline-flex'; badge.textContent = n; }
  else { badge.style.display='none'; }
}
