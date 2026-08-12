// js/data/users.js — extracted from CBAMS index.html

/* =========================================================
   USERS + ROLE-BASED ACCESS (role is now set by login, not a free switch)
   ========================================================= */
const USERS = {
  admin: {name:'fjprincipe', initials:'FJ', roleLabel:'Admin · NCR', pill:'ADMIN'},
  user:  {name:'cbulayan',  initials:'CU', roleLabel:'Branch Support Officer · NCR', pill:'USER'}
};
let currentRole = 'admin';

function applyRole(role){
  currentRole = role;
  document.body.classList.remove('role-admin','role-user');
  document.body.classList.add('role-'+role);
  const u = USERS[role];
  document.getElementById('userAvatar').textContent = u.initials;
  document.getElementById('userNameFull').textContent = u.name;
  document.getElementById('userRoleFull').textContent = u.roleLabel;
  // If a non-admin is sitting on the approval view, bounce to dashboard
  if(role!=='admin' && document.getElementById('view-approval').classList.contains('active')){
    switchView('dashboard');
    showToast('Approval queue requires admin access.', 'info');
  }
  updatePendingBadge();
}
