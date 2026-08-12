// js/modules/approval.js — extracted from CBAMS index.html

/* =========================================================
   APPROVE / REJECT — this is what auto-updates the map + feed
   ========================================================= */
function approveRequest(id){
  const req = requests.find(r=>r.id===id);
  if(!req || req.status!=='pending') return;
  const b = branches.find(x=>x.code===req.branchCode);
  if(!b){ showToast('Branch not found.', 'error'); return; }

  const reviewer = USERS[currentRole].name;
  if(req.requestedStatus==='closed'){
    b.status = 'closed';
    b.closedFrom = req.closedFrom;
    b.closedUntil = req.closedUntil;
    const catLabel = req.category || 'Other';
    const subLabel = req.subcategory || '';
    const untilDate = req.closedUntil ? fmtDateTime(req.closedUntil, req.closedUntilTime) : '';
    b.hours = subLabel==='Scheduled System Maintenance' ? 'Suspended for scheduled maintenance'
      : subLabel==='Power Outage' ? 'Suspended — power outage'
      : subLabel==='Connectivity / System Outage' ? 'Suspended — network outage'
      : subLabel==='Flood' ? 'Suspended — flooding'
      : untilDate ? `Suspended until ${untilDate}`
      : 'Suspended until further notice';
    const reasonWithSub = subLabel ? `[${subLabel}] ${req.reason}` : req.reason;
    b.history.unshift([`Closed — ${catLabel}`, reasonWithSub, 'Just now', `${reviewer} (Approved ${req.id})`]);
    b.emergency = subLabel !== 'Scheduled System Maintenance';
  } else {
    b.status = 'open';
    b.closedFrom = null;
    b.closedUntil = null;
    b.hours = '9:00 AM – 3:00 PM';
    b.history.unshift(['Opened', req.reason || 'Regular operating hours resumed', 'Just now', `${reviewer} (Approved ${req.id})`]);
    b.emergency = false;
  }

  req.status = 'approved';
  req.reviewedBy = reviewer;
  req.reviewedAt = 'Just now';
  req.reviewedAtDate = new Date();

  refreshAll();
  renderPendingList();
  updatePendingBadge();
  showToast(`${req.branchName} updated on the map and alert feed.`, 'success');
}

function rejectRequest(id){
  const req = requests.find(r=>r.id===id);
  if(!req || req.status!=='pending') return;
  req.status = 'rejected';
  req.reviewedBy = USERS[currentRole].name;
  req.reviewedAt = 'Just now';
  req.reviewedAtDate = new Date();
  renderPendingList();
  updatePendingBadge();
  showToast(`Request ${req.id} rejected.`, 'info');
}
