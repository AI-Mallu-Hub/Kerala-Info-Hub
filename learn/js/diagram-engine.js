
/* ==========================================================
   Developer Debug Mode
========================================================== */

const DEBUG = false;

function debug(message, type = "info") {

    if (!DEBUG) return;

    let panel = document.getElementById("debug-panel");

    if (!panel) {

        panel = document.createElement("div");

        panel.id = "debug-panel";

        panel.style.cssText = `
            position:fixed;
            bottom:12px;
            left:12px;
            right:12px;
            max-height:180px;
            overflow:auto;
            background:#111;
            color:#0f0;
            font:12px monospace;
            padding:10px;
            border-radius:12px;
            z-index:999999;
            box-shadow:0 6px 18px rgba(0,0,0,.35);
        `;

        document.body.appendChild(panel);

    }

    const color = {
        info: "#00ff88",
        warn: "#ffd54f",
        error: "#ff5252",
        success: "#4caf50"
    };

    panel.innerHTML += `
        <div style="color:${color[type] || "#fff"}">
            ${new Date().toLocaleTimeString()} → ${message}
        </div>
    `;

    panel.scrollTop = panel.scrollHeight;

}

/* ==========================================================
   Kerala Info Hub - Interactive Diagram Engine v1.0
   Reusable for Cell, Heart, Brain, Kidney, etc.
   ========================================================== */



async function initDiagramEngine(containerId, svgPath, config) {

   debug("Initializing Diagram...");

    const container =
document.getElementById(containerId);

    if (!container) {
        console.error("Diagram container not found.");
        return;
    }

    try {
       debug("Loading SVG...");

        // Load SVG
        const response = await fetch(svgPath);
       debug("HTTP Status : " + response.status);

        if (!response.ok) {
            throw new Error("SVG file not found.");
        }

        const svgText = await response.text();

        container.innerHTML = svgText;
       debug("SVG inserted.", "success");

        const svg = container.querySelector("svg");

        if (!svg) {
            throw new Error("SVG element missing.");
        }

        console.log("✅ SVG Loaded");

        registerHotspots(svg);
       setupGuidedTour();
       debug("Events Registered.", "success");

    }

    catch (error) {
       debug(error.message,"error");

        console.error(error);

        container.innerHTML = `
            <div style="
                padding:40px;
                text-align:center;
                color:#d32f2f;
                font-weight:bold;
            ">
                ❌ Unable to load Interactive Diagram
            </div>
        `;

    }

}


/* ==========================================================
   Hotspot Configuration
   ========================================================== */

const hotspots = CellConfig.hotspots;

/* ==========================================================
   Animation State
   ========================================================== */

const animationState = {

    activeHotspot: null,

    isAnimating: false,

    currentSVG: null,

    clickedRect: null

};


/* ==========================================================
   Register Click Events
   ========================================================== */


function registerHotspots(svg) {

    Object.keys(hotspots).forEach(id => {

        const part = svg.getElementById(id);

        if (!part) {
            debug(id + " NOT FOUND", "warn");
            return;
        }

        debug(id + " OK");

        part.classList.add("hotspots");

        part.addEventListener("click", () => {

            if (animationState.isAnimating) return;

            animationState.activeHotspot = part;

            animationState.clickedRect =
part.getBoundingClientRect();

            highlightHotspot(svg,id);

showTooltip(hotspots[id].title);

setTimeout(()=>{

showInfo(hotspots[id]);

},700);

        });

    });

}

/* ==========================================================
   Info Popup
   ========================================================== */

function highlightHotspot(svg,selectedId){

    Object.keys(hotspots).forEach(id=>{

        const item=svg.getElementById(id);

        if(!item) return;

        item.classList.remove("active","dim");

        if(id===selectedId){

            item.classList.add("active");
           item.style.setProperty(
"--glow-color",
hotspots[id].glow
);
           document.documentElement.style.setProperty(
    "--accent-color",
    hotspots[id].glow
);

        }else{

            item.classList.add("dim");

        }

    });

   const wrapper = document.getElementById("cell-diagram");

wrapper.classList.add("focus-mode");

}

function zoomDiagram(){

    document
        .getElementById("cell-diagram")
        .classList.add("zoom");

}

function resetZoom(){

    document
        .getElementById("cell-diagram")
        .classList.remove("zoom");

}

function showTooltip(title){

const tip=document.getElementById("hotspotsTooltip");

document.getElementById("tooltipTitle").textContent=title;

tip.classList.add("show");

setTimeout(()=>{

tip.classList.remove("show");

},700);

}

function showInfo(data){

    showModal(data);

}

function showModal(data){
   debug("Opening Modal : " + data.title);

document.getElementById("modalTitle").textContent=data.title;

document.getElementById("modalFunction").textContent=data.function;

document.getElementById("modalClinical").textContent=data.clinical;

document.getElementById("modalExam").textContent=data.exam;

   const modalCard=document.querySelector(".modal-card");

const r=animationState.clickedRect;

if(r){

const cx=r.left+r.width/2;

const cy=r.top+r.height/2;

modalCard.style.transformOrigin=
`${cx}px ${cy}px`;

}
const flash = document.getElementById("microscope-flash");

flash.classList.add("active");

setTimeout(() => {

    flash.classList.remove("active");

},220);

   zoomDiagram();


document.getElementById("hotspotsModal").classList.add("show");
   debug("Modal Opened");
   
   animationState.isAnimating = true;
if(tourState.running && tourState.auto){

    tourState.timer = setTimeout(()=>{

        closeModal();

    },2500);

           }

document.getElementById("closeModal").onclick = closeModal;

}

function closeModal() {

    debug("Closing Modal");
if(tourState.timer){

    clearTimeout(tourState.timer);

    tourState.timer = null;

}

    const modal = document.getElementById("hotspotsModal");

    modal.classList.add("closing");

    setTimeout(() => {

        modal.classList.remove("show");
        modal.classList.remove("closing");

        animationState.isAnimating = false;
        animationState.activeHotspot = null;
       if(tourState.running){

setTimeout(()=>{

startTourStep(tourState.step+1);

},350);

       }
       document
.getElementById("cell-diagram")
.classList.remove("focus-mode");

        document
            .querySelectorAll(".hotspots")
            .forEach(el => el.classList.remove("active", "dim"));

       resetZoom();
       
    }, 450);

   }

function setupGuidedTour(){

const btn=document.getElementById("startTour");

if(!btn) return;

btn.addEventListener("click",()=>{

if(tourState.running) return;

tourState.running=true;

debug("🧬 Guided Tour Started");

btn.textContent="⏸ Touring...";

   startTourStep(0);

});

   }

function startTourStep(index){

if(index>=tourState.order.length){

finishTour();

return;

}

tourState.step=index;

const id=tourState.order[index];

const svg=document.querySelector("#cell-diagram svg");

if(!svg) return;

const part=svg.getElementById(id);

if(!part) return;

animationState.activeHotspot=part;

animationState.clickedRect=
part.getBoundingClientRect();

highlightHotspot(svg,id);

showTooltip(hotspots[id].title);

setTimeout(()=>{

showInfo(hotspots[id]);

},550);

}

const tourState={

running:false,

step:0,

auto: true,

timer: null,

order:[
"nucleus",
"mitochondria",
"golgi",
"rough-er",
"smooth-er",
"ribosomes",
"lysosome",
"vacuole",
"centrosome",
"nucleolus"
]

};
   
function finishTour(){

tourState.running=false;

tourState.step=0;

document
.querySelectorAll(".hotspots")
.forEach(el=>{

el.classList.remove("active","dim");

});

const btn=document.getElementById("startTour");

btn.textContent="▶ Explore Again";

debug("🏁 Guided Tour Finished");

   resetZoom();

document
.getElementById("cell-diagram")
.classList.remove("focus-mode");

   animationState.isAnimating=false;
animationState.activeHotspot=null;

}

window.DiagramEngine = {

    init: initDiagramEngine

};
