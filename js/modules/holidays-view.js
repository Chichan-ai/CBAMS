// js/modules/holidays-view.js — extracted from CBAMS index.html

/* =========================================================
   HOLIDAYS LIST
   ========================================================= */
let holidayFilter = 'all';

function getHolidayScope(h){
  if(h.branches === 'all') return '<span class="scope-national">National</span>';
  if(!h.branches.length) return '<span class="scope-none">—</span>';
  const names = h.branches.map(code=>{
    const b = branches.find(x=>x.code===code);
    return b ? b.name.replace(' Branch','').replace(' City Branch',' City') : code;
  });
  return '<span class="scope-local">' + names.join(', ') + '</span>';
}

function renderHolidaysList(){
  const filtered = holidayFilter === 'all'
    ? [...HOLIDAYS_2026]
    : HOLIDAYS_2026.filter(h=>h.type===holidayFilter);
  filtered.sort((a,b)=> a.date.localeCompare(b.date));
  const tbody = document.getElementById('holidayTableBody');
  if(filtered.length === 0){
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--muted);font-size:12px;">No holidays match this filter.</td></tr>';
    return;
  }
  const fmtDate = (ds) => new Date(ds+'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
  tbody.innerHTML = filtered.map(h=>
    `<tr>
      <td class="ht-date">${fmtDate(h.date)}</td>
      <td class="ht-name">${h.name}</td>
      <td class="ht-type"><span class="hi-type ${h.type}">${HOLIDAY_TYPE_LABELS[h.type]||h.type}</span></td>
      <td class="ht-ref">${h.ref}</td>
      <td class="ht-scope">${getHolidayScope(h)}</td>
    </tr>`
  ).join('');
}

document.getElementById('link-holidays').addEventListener('click',(e)=>{e.preventDefault(); switchView('holidays'); renderHolidaysList();});

document.querySelectorAll('#holidayFilterRow .filter-chip').forEach(chip=>{
  chip.addEventListener('click',()=>{
    document.querySelectorAll('#holidayFilterRow .filter-chip').forEach(c=>c.classList.remove('active'));
    chip.classList.add('active');
    holidayFilter = chip.dataset.filter;
    renderHolidaysList();
  });
});
