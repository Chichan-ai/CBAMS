// js/core/init.js — extracted from CBAMS index.html

/* =========================================================
   INIT
   ========================================================= */
applyRole('admin');
document.getElementById('asOfDate').value = asOfDate;
document.getElementById('asOfDate').addEventListener('change', function(){
  asOfDate = this.value || new Date().toISOString().split('T')[0];
  refreshAll();
});
document.getElementById('asOfTodayBtn').addEventListener('click', function(){
  asOfDate = new Date().toISOString().split('T')[0];
  document.getElementById('asOfDate').value = asOfDate;
  refreshAll();
});

refreshAll();
populateBranchSelect();
syncStatusChoiceUI();
renderPendingList();
renderArchiveList();
renderMySubmissions();
updatePendingBadge();
populateReportCategoryFilter();
renderReportTable();
