// js/core/map-projection.js — extracted from CBAMS index.html

/* =========================================================
   PHILIPPINES MAP — projection + outline
   ========================================================= */
const PROJ = {"render_w": 640, "render_h": 1098.1355364249002, "lng_min": 116.92886449600009, "lat_max": 20.83601221600003, "lat_corr": 0.9753844613777303, "eff_w": 9.43791069271963, "eff_h": 16.193914251999956};
function project(lat, lng){
  const x = (lng - PROJ.lng_min) * PROJ.lat_corr / PROJ.eff_w * PROJ.render_w;
  const y = (PROJ.lat_max - lat) / PROJ.eff_h * PROJ.render_h;
  return {x, y};
}

const svg = document.getElementById('phsvg');
const ns = 'http://www.w3.org/2000/svg';
const landPath = document.createElementNS(ns,'path');
landPath.setAttribute('class','landmass');
landPath.setAttribute('d', PH_PATH_D);
svg.appendChild(landPath);
const pinsLayer = document.createElementNS(ns,'g');
pinsLayer.setAttribute('id','pinsLayer');
svg.appendChild(pinsLayer);
