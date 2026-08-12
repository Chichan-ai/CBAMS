// js/core/map-zoom-pan.js — extracted from CBAMS index.html

/* =========================================================
   MAP ZOOM + PAN
   ========================================================= */
const mapScroll = document.getElementById('mapScroll');
const mapInner = document.getElementById('mapInner');
const zoomLevelEl = document.getElementById('zoomLevel');
const BASE_W = 640;
let zoom = 1;
function setZoom(z, clientX, clientY){
  const rect = mapScroll.getBoundingClientRect();
  // focal point in viewport px — defaults to the center of the map box
  // so the box itself never moves, only the content underneath it
  const fxPage = (clientX!=null) ? clientX : rect.left + rect.width/2;
  const fyPage = (clientY!=null) ? clientY : rect.top + rect.height/2;

  // Where that focal point sits inside the (unscaled) content, measured
  // straight off the current layout. Using the actual rect — rather than
  // assuming scrollLeft/scrollTop start at the content's top-left corner —
  // keeps this correct even while map-inner is centered by "margin:0 auto"
  // (i.e. before it's wide enough to need scrolling).
  const innerRectBefore = mapInner.getBoundingClientRect();
  const contentX = (fxPage - innerRectBefore.left) / zoom;
  const contentY = (fyPage - innerRectBefore.top) / zoom;

  zoom = Math.min(3, Math.max(0.7, z));
  const newW = BASE_W*zoom;
  mapInner.style.width = newW+'px';
  zoomLevelEl.textContent = Math.round(zoom*100)+'%';

  // Re-measure after the resize instead of assuming width and height scale
  // by the same ratio — map-inner has fixed (non-scaling) vertical padding,
  // so its height never grows in exact lockstep with its width. Reusing a
  // single width-based ratio for the vertical axis is what caused the map
  // to drift/jump vertically the more you zoomed in.
  const innerRectAfter = mapInner.getBoundingClientRect();
  const desiredLeft = fxPage - contentX*zoom;
  const desiredTop = fyPage - contentY*zoom;
  mapScroll.scrollLeft += innerRectAfter.left - desiredLeft;
  mapScroll.scrollTop += innerRectAfter.top - desiredTop;
}
document.getElementById('zoomIn').addEventListener('click',()=>setZoom(zoom*1.25));
document.getElementById('zoomOut').addEventListener('click',()=>setZoom(zoom/1.25));
document.getElementById('zoomReset').addEventListener('click',()=>setZoom(1));

mapScroll.addEventListener('wheel',(e)=>{
  if(e.ctrlKey || e.metaKey){
    e.preventDefault();
    setZoom(zoom * (e.deltaY < 0 ? 1.1 : 0.9), e.clientX, e.clientY);
  }
}, {passive:false});

// drag to pan
let isDragging=false, dragStartX=0, dragStartY=0, startScrollL=0, startScrollT=0;
mapScroll.addEventListener('mousedown',(e)=>{
  isDragging=true;
  mapScroll.classList.add('dragging');
  dragStartX=e.clientX; dragStartY=e.clientY;
  startScrollL=mapScroll.scrollLeft; startScrollT=mapScroll.scrollTop;
});
window.addEventListener('mousemove',(e)=>{
  if(!isDragging) return;
  mapScroll.scrollLeft = startScrollL - (e.clientX-dragStartX);
  mapScroll.scrollTop = startScrollT - (e.clientY-dragStartY);
});
window.addEventListener('mouseup',()=>{ isDragging=false; mapScroll.classList.remove('dragging'); });
