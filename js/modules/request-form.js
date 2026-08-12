// js/modules/request-form.js — extracted from CBAMS index.html

/* =========================================================
   REQUEST FORM
   ========================================================= */
const reqBranchSel = document.getElementById('reqBranch');
function populateBranchSelect(){
  const sorted = [...branches].sort((a,b)=>a.name.localeCompare(b.name));
  // Clear any previously-appended branch options (keep the placeholder option) so
  // re-calling this after adding a new branch doesn't duplicate the whole list.
  Array.from(reqBranchSel.querySelectorAll('option')).forEach(opt=>{
    if(opt.value) opt.remove();
  });
  const currentVal = reqBranchSel.value;
  sorted.forEach(b=>{
    const opt = document.createElement('option');
    opt.value = b.code;
    opt.textContent = b.name;
    reqBranchSel.appendChild(opt);
  });
  if(currentVal && sorted.some(b=>b.code===currentVal)) reqBranchSel.value = currentVal;
}
const branchPreview = document.getElementById('branchPreview');
reqBranchSel.addEventListener('change',()=>{
  const b = branches.find(x=>x.code===reqBranchSel.value);
  if(!b){ branchPreview.classList.remove('show'); return; }
  branchPreview.classList.add('show');
  branchPreview.innerHTML = `<b>${b.region}</b> · currently <b>${b.status.toUpperCase()}</b> · ${b.address||'—'}`;
  const optClosedLabel = document.getElementById('optClosed');
  const optOpenLabel = document.getElementById('optOpen');
  optClosedLabel.classList.remove('disabled');
  optOpenLabel.classList.remove('disabled');
  optClosedLabel.querySelector('input').disabled = false;
  optOpenLabel.querySelector('input').disabled = false;
  if(b.status==='open'){
    optOpenLabel.classList.add('disabled');
    optOpenLabel.querySelector('input').disabled = true;
    optClosedLabel.querySelector('input').checked = true;
  } else {
    optClosedLabel.classList.add('disabled');
    optClosedLabel.querySelector('input').disabled = true;
    optOpenLabel.querySelector('input').checked = true;
  }
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('reqClosedFrom').min = today;
  document.getElementById('reqClosedFrom').value = '';
  document.getElementById('reqClosedUntil').min = today;
  document.getElementById('reqClosedUntil').value = '';
  document.getElementById('holidayOverlap').style.display = 'none';
  document.getElementById('holidaySuggest').style.display = 'none';
  renderHolidayIndicator(b.code);
  syncStatusChoiceUI();
});

function syncStatusChoiceUI(){
  const val = (document.querySelector('input[name=reqStatus]:checked')||{}).value;
  document.getElementById('optOpen').classList.toggle('checked', val==='open');
  document.getElementById('optClosed').classList.toggle('checked', val==='closed');
  document.getElementById('categoryGroup').style.display = val==='closed' ? 'block' : 'none';
  document.getElementById('subcategoryGroup').style.display = val==='closed' ? 'block' : 'none';
  document.getElementById('closedFromGroup').style.display = val==='closed' ? 'block' : 'none';
  document.getElementById('closedFromTimeGroup').style.display = val==='closed' ? 'block' : 'none';
  document.getElementById('closedUntilGroup').style.display = val==='closed' ? 'block' : 'none';
  document.getElementById('closedUntilTimeGroup').style.display = val==='closed' ? 'block' : 'none';
  if(val!=='closed'){
    document.getElementById('newCategoryGroup').style.display = 'none';
    document.getElementById('newSubcategoryGroup').style.display = 'none';
    document.getElementById('holidayIndicator').style.display = 'none';
    document.getElementById('holidayOverlap').style.display = 'none';
    document.getElementById('holidaySuggest').style.display = 'none';
    document.getElementById('reqClosedFrom').value = '';
    document.getElementById('reqClosedUntil').value = '';
  } else {
    populateCategorySelect(true);
    populateSubcategorySelect(true);
  }
}
document.querySelectorAll('input[name=reqStatus]').forEach(r=>r.addEventListener('change', syncStatusChoiceUI));

document.getElementById('reqClosedUntil').addEventListener('change', checkHolidayOverlap);
document.getElementById('reqClosedFrom').addEventListener('change', function(){
  const today = new Date().toISOString().split('T')[0];
  const untilInput = document.getElementById('reqClosedUntil');
  untilInput.min = this.value || today;
  if(untilInput.value && untilInput.value < untilInput.min){
    untilInput.value = '';
  }
});
