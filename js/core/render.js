// js/core/render.js — extracted from CBAMS index.html

/* =========================================================
   RENDER FUNCTIONS (callable repeatedly — approvals trigger these)
   ========================================================= */
const tooltip = document.getElementById('tooltip');

let asOfDate = new Date().toISOString().split('T')[0];
function isNonWorkingHoliday(dateStr, branchCode){
  return HOLIDAYS_2026.some(h=>{
    if(h.date !== dateStr || h.type==='working') return false;
    if(h.branches === 'all') return true;
    return h.branches.includes(branchCode);
  });
}

function effectiveStatus(b, dateStr){
  if(isNonWorkingHoliday(dateStr, b.code)) return 'closed';
  if(b.closedFrom && b.closedUntil){
    return (dateStr >= b.closedFrom && dateStr <= b.closedUntil) ? 'closed' : 'open';
  }
  return b.status;
}
function renderMetrics(){
  const total = branches.length;
  const closed = branches.filter(b=>effectiveStatus(b, asOfDate)==='closed');
  const openCount = total - closed.length;

  const pct = total ? Math.round((openCount / total) * 100) : 0;
  document.getElementById('openPctValue').textContent = pct + '%';
  document.getElementById('openPctDate').textContent = new Date(asOfDate+'T00:00:00')
    .toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
}

function renderPins(){
  pinsLayer.innerHTML = '';
  branches.forEach(b=>{
    const st = effectiveStatus(b, asOfDate);
    const isEmergency = b.emergency && st==='closed';
    const {x,y} = project(b.lat,b.lng);
    const g = document.createElementNS(ns,'g');
    g.setAttribute('class','pin'+(isEmergency?' emergency':''));
    g.setAttribute('transform',`translate(${x},${y})`);
    const halo = document.createElementNS(ns,'circle');
    halo.setAttribute('class','halo'); halo.setAttribute('r','5');
    g.appendChild(halo);
    const core = document.createElementNS(ns,'circle');
    core.setAttribute('class','core'); core.setAttribute('r','4.8');
    core.setAttribute('fill', st==='open' ? '#16a34a' : '#dc2626');
    g.appendChild(core);
    g.addEventListener('mouseenter',()=>{
      tooltip.innerHTML = `<span class="t-name">${b.name}</span><span class="t-status ${st}">● ${st.toUpperCase()}</span>`;
      tooltip.style.left = x+'px';
      tooltip.style.top = y+'px';
      tooltip.classList.add('show');
    });
    g.addEventListener('mouseleave',()=>tooltip.classList.remove('show'));
    g.addEventListener('click',()=>openDrawer(b));
    pinsLayer.appendChild(g);
  });
}

function renderRegionList(){
  const regionMap = {};
  branches.forEach(b=>{
    regionMap[b.region] = regionMap[b.region] || {open:0,closed:0};
    regionMap[b.region][effectiveStatus(b, asOfDate)]++;
  });
  const regionList = document.getElementById('regionList');
  regionList.innerHTML = '';
  Object.keys(regionMap).sort().forEach(region=>{
    const counts = regionMap[region];
    const row = document.createElement('div');
    row.className='region-row';
    row.innerHTML = `<span class="name">${region}</span><span class="counts"><b class="o">${counts.open||0} open</b> · <b class="c">${counts.closed||0} closed</b></span>`;
    row.addEventListener('click',()=>openRegionDrawer(region));
    regionList.appendChild(row);
  });
}

function renderAlertFeed(){
  const alertFeed = document.getElementById('alertFeed');
  const closed = branches.filter(b=>effectiveStatus(b, asOfDate)==='closed');
  alertFeed.innerHTML = '';
  if(closed.length===0){
    alertFeed.innerHTML = '<div class="empty">No closed branches on this date.</div>';
  } else {
    closed.forEach(b=>{
      const item = document.createElement('div');
      item.className='alert-item';
      const cat = b.history[0] ? b.history[0][0].replace('Closed — ','') : (b.category||'Closed');
      item.innerHTML = `<div class="a-top"><span>${b.name}</span><span class="tag">${cat}</span></div>
        <div class="a-meta">${b.region} · since ${b.history[0] ? b.history[0][2].toLowerCase() : ''}</div>`;
      item.addEventListener('click',()=>openDrawer(b));
      alertFeed.appendChild(item);
    });
  }
}

function renderHolidayIndicator(branchCode){
  const el = document.getElementById('holidayIndicator');
  const holidays = getHolidaysForBranch(branchCode);
  if(holidays.length === 0){
    el.innerHTML = '<div class="hi-header">Upcoming holidays</div><div class="hi-empty">No holidays remaining in 2026 for this branch.</div>';
    el.style.display = 'block';
    return;
  }
  const fmtDate = (ds) => {
    const d = new Date(ds+'T00:00:00');
    return d.toLocaleDateString('en-US',{month:'short',day:'numeric'});
  };
  el.innerHTML = '<div class="hi-header">Upcoming holidays for this branch</div>' +
    holidays.map(h =>
      `<div class="hi-item"><span class="hi-date">${fmtDate(h.date)}</span><div><div class="hi-name">${h.name}</div><span class="hi-type ${h.type}">${HOLIDAY_TYPE_LABELS[h.type]||h.type}</span></div></div>`
    ).join('');
  el.style.display = 'block';
}

function checkHolidayOverlap(){
  const branchCode = reqBranchSel.value;
  const dateVal = document.getElementById('reqClosedUntil').value;
  const overlapEl = document.getElementById('holidayOverlap');
  const suggestEl = document.getElementById('holidaySuggest');
  overlapEl.style.display = 'none';
  suggestEl.style.display = 'none';
  if(!dateVal || !branchCode) return;
  const today = new Date(); today.setHours(0,0,0,0);
  const selected = new Date(dateVal+'T00:00:00');
  const holidays = getHolidaysBetween(today, selected, branchCode);
  if(holidays.length > 0){
    const fmtDate = (ds) => new Date(ds+'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
    overlapEl.innerHTML = `<strong>⚠ Closure period includes ${holidays.length} holiday(s):</strong>` +
      holidays.map(h => `<div class="ho-item"><span class="ho-date">${fmtDate(h.date)}</span> — ${h.name} <em>(${HOLIDAY_TYPE_LABELS[h.type]||h.type})</em></div>`).join('');
    overlapEl.style.display = 'block';
  }
  if(isHoliday(selected, branchCode)){
    const next = getNextBusinessDay(selected, branchCode);
    const fmtDate = (d) => d.toLocaleDateString('en-US',{month:'short',day:'numeric'});
    suggestEl.innerHTML = `<strong>ℹ Suggested reopening: ${fmtDate(next)}</strong> (next business day)`;
    suggestEl.style.display = 'block';
  }
}
const DONUT_REASON_COLORS = {
  'Calamity':'#e67e22','Flooding':'#2980b9','Power Outage':'#f1c40f','Connectivity':'#8e44ad',
  'System Maintenance':'#16a085','Security Incident':'#c0392b','Holiday':'#3498db','Other':'#7f8c8d',
  'Natural Disruption':'#e67e22','Political Disruption':'#9b59b6','Disaster':'#d35400','Operational':'#16a085'
};

function getClosureCategory(b, dateStr){
  if(b.history && b.history[0] && b.history[0][0].indexOf('Closed') === 0){
    return b.history[0][0].replace('Closed — ','').trim();
  }
  if(isNonWorkingHoliday(dateStr, b.code)) return 'Holiday';
  return b.category || 'Other';
}

function drawDonut(svgEl, segments){
  const r = 50, cx = 64, cy = 64, sw = 18;
  const circumference = 2 * Math.PI * r;
  const total = segments.reduce((s,d)=>s+d.value,0);
  let html = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#eef1f6" stroke-width="${sw}"></circle>`;
  let offset = 0;
  segments.forEach(seg=>{
    if(!seg.value) return;
    const frac = total ? seg.value/total : 0;
    const len = frac * circumference;
    html += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${seg.color}" stroke-width="${sw}" stroke-dasharray="${len.toFixed(2)} ${(circumference-len).toFixed(2)}" stroke-dashoffset="${(-offset).toFixed(2)}" transform="rotate(-90 ${cx} ${cy})"><title>${seg.label}: ${seg.value}</title></circle>`;
    offset += len;
  });
  svgEl.innerHTML = html;
}

function renderDonutLegend(containerEl, segments, total){
  if(!segments.length || total === 0){
    containerEl.innerHTML = '<div class="donut-empty">No data</div>';
    return;
  }
  containerEl.innerHTML = segments.filter(s=>s.value>0).map(s=>{
    return `<div class="donut-legend-item"><span class="sw" style="background:${s.color}"></span><span class="lbl">${s.label}</span><span class="val">${s.value}</span></div>`;
  }).join('');
}

function renderDonuts(){
  const total = branches.length;
  const closedList = branches.filter(b=>effectiveStatus(b, asOfDate)==='closed');
  const openCount = total - closedList.length;

  const statusSegments = [
    {label:'Open', value:openCount, color:'var(--open)'},
    {label:'Closed', value:closedList.length, color:'var(--closed)'}
  ];
  drawDonut(document.getElementById('donutStatusSvg'), statusSegments);
  renderDonutLegend(document.getElementById('donutStatusLegend'), statusSegments, total);
  document.getElementById('donutStatusValue').textContent = total;

  const reasonCounts = {};
  closedList.forEach(b=>{
    const cat = getClosureCategory(b, asOfDate);
    reasonCounts[cat] = (reasonCounts[cat]||0) + 1;
  });
  const reasonSegments = Object.keys(reasonCounts).map(cat=>({
    label: cat,
    value: reasonCounts[cat],
    color: DONUT_REASON_COLORS[cat] || '#95a5a6'
  })).sort((a,b)=>b.value-a.value);
  drawDonut(document.getElementById('donutReasonSvg'), reasonSegments);
  renderDonutLegend(document.getElementById('donutReasonLegend'), reasonSegments, closedList.length);
  document.getElementById('donutReasonValue').textContent = closedList.length;
}
function refreshAll(){
  renderMetrics();
  renderDonuts();
  renderPins();
  renderRegionList();
  renderAlertFeed();
}
