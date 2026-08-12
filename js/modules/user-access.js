// js/modules/user-access.js — extracted from CBAMS index.html

/* =========================================================
   USER ACCESS SETTINGS — mockup
   ========================================================= */
const ACCESS_USERS = [
  { name:'fjprincipe',  role:'Admin',      roleClass:'role-admin',     perms:{can_login:true,can_access_dashboard:true,can_request:true,can_approve:true,can_access_user_access:true,can_view_archive:true,can_export_data:true,can_manage_users:true,can_view_audit_log:true} },
  { name:'cbulayan',    role:'User',       roleClass:'',               perms:{can_login:true,can_access_dashboard:true,can_request:true,can_approve:false,can_access_user_access:false,can_view_archive:true,can_export_data:false,can_manage_users:false,can_view_audit_log:false} },
  { name:'mgarcia',     role:'Supervisor', roleClass:'role-supervisor', perms:{can_login:true,can_access_dashboard:true,can_request:true,can_approve:true,can_access_user_access:false,can_view_archive:true,can_export_data:true,can_manage_users:false,can_view_audit_log:false} },
  { name:'rdela Cruz',  role:'Staff',      roleClass:'',               perms:{can_login:true,can_access_dashboard:true,can_request:false,can_approve:false,can_access_user_access:false,can_view_archive:false,can_export_data:false,can_manage_users:false,can_view_audit_log:false} },
];

const ACCESS_PERMS = [
  { key:'can_login',              label:'Login' },
  { key:'can_access_dashboard',   label:'Dashboard' },
  { key:'can_request',            label:'Request' },
  { key:'can_approve',            label:'Approve' },
  { key:'can_access_user_access', label:'User Access' },
  { key:'can_view_archive',       label:'Archive' },
  { key:'can_export_data',        label:'Export' },
  { key:'can_manage_users',       label:'Manage Users' },
  { key:'can_view_audit_log',     label:'Audit Log' },
];

function renderAccessTable(){
  const tbody = document.getElementById('accessTableBody');
  tbody.innerHTML = ACCESS_USERS.map(u=>{
    const roleTag = u.roleClass ? `<span class="au-role ${u.roleClass}">${u.role}</span>` : `<span class="au-role">${u.role}</span>`;
    const toggles = ACCESS_PERMS.map(p=>{
      const checked = u.perms[p.key] ? 'checked' : '';
      return `<td><label class="toggle"><input type="checkbox" ${checked} data-user="${u.name}" data-perm="${p.key}"><span class="slider"></span></label></td>`;
    }).join('');
    return `<tr><td class="au-name">${u.name}</td><td>${roleTag}</td>${toggles}</tr>`;
  }).join('');
}

document.getElementById('link-user-access').addEventListener('click',(e)=>{
  e.preventDefault();
  switchView('user-access');
  renderAccessTable();
});
