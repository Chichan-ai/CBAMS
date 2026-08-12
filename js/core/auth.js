// js/core/auth.js — extracted from CBAMS index.html

/* =========================================================
   LOGIN / LOGOUT
   ========================================================= */
// Demo credential store — username -> {password, role}. Swap this for a
// real authentication call (e.g. POST /api/login) when wiring up a backend.
const LOGIN_CREDENTIALS = {
  admin: {password:'admin123', role:'admin'},
  user:  {password:'user123',  role:'user'}
};

function doLogin(username, password){
  const acct = LOGIN_CREDENTIALS[username.trim().toLowerCase()];
  const loginError = document.getElementById('loginError');
  if(!acct || acct.password !== password){
    loginError.classList.add('show');
    return;
  }
  loginError.classList.remove('show');
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('portal').style.display = 'block';
  document.body.classList.remove('login-active');
  applyRole(acct.role);
  switchView('dashboard');
  showToast(`Signed in as ${USERS[acct.role].pill}.`, 'success');
}

function doLogout(){
  document.getElementById('portal').style.display = 'none';
  document.getElementById('login-page').style.display = 'flex';
  document.body.classList.add('login-active');
  document.getElementById('dd-account').classList.remove('show');
  document.getElementById('loginForm').reset();
  document.getElementById('loginError').classList.remove('show');
}

document.getElementById('loginForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  doLogin(document.getElementById('loginUsername').value, document.getElementById('loginPassword').value);
});

document.getElementById('logoutLink').addEventListener('click', (e)=>{
  e.preventDefault();
  doLogout();
});

const loginToggleBtn = document.getElementById('toggleVis');
const loginPwdInput = document.getElementById('loginPassword');
loginToggleBtn.addEventListener('click', ()=>{
  const show = loginPwdInput.type === 'password';
  loginPwdInput.type = show ? 'text' : 'password';
  loginToggleBtn.textContent = show ? 'Hide Password' : 'Show Password';
});

// auto-sliding announcement panel
const loginMediaTrack = document.getElementById('mediaTrack');
const loginMediaSlides = loginMediaTrack.querySelectorAll('.media-slide');
const loginMediaDots = document.querySelectorAll('#mediaDots span');
const loginSlideCount = loginMediaSlides.length;
let loginSlideCurrent = 0;
function goToSlide(i){
  loginSlideCurrent = i;
  loginMediaSlides.forEach((s, idx) => s.classList.toggle('active', idx === loginSlideCurrent));
  loginMediaDots.forEach((d, idx) => d.classList.toggle('active', idx === loginSlideCurrent));
}
setInterval(() => goToSlide((loginSlideCurrent + 1) % loginSlideCount), 4500);
