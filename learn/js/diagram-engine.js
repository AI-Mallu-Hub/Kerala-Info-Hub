
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

window.addEventListener("DOMContentLoaded", initDiagram);

async function initDiagram() {
   debug("Initializing Diagram...");

    const container = document.getElementById("cell-diagram");

    if (!container) {
        console.error("Diagram container not found.");
        return;
    }

    try {
       debug("Loading SVG...");

        // Load SVG
        const response = await fetch("/Kerala-Info-Hub/learn/assets/svg/cell.svg");
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

        registerOrganelles(svg);
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
   Organelle Database
   ========================================================== */

const organelles = {

    nucleus:{
        title:"🧠 Nucleus",
        function:"Controls all activities of the cell.",
        clinical:"Stores DNA. Damage may lead to genetic diseases.",
        exam:"Largest organelle in animal cells.",
        glow:"#8B5CF6"
    },

    nucleolus:{
        title:"🟣 Nucleolus",
        function:"Produces ribosomes.",
        clinical:"Highly active in rapidly dividing cells.",
        exam:"Found inside the nucleus.",
        glow:"#AB47BC"
    },

    mitochondria:{
        title:"⚡ Mitochondria",
        function:"Produces ATP (energy).",
        clinical:"Mitochondrial diseases reduce energy production.",
        exam:"Powerhouse of the cell.",
        glow:"#FFD54A"
    },

    golgi:{
        title:"📦 Golgi Apparatus",
        function:"Packages and transports proteins.",
        clinical:"Essential for secretion.",
        exam:"Packaging centre of the cell.",
        glow:"#42A5F5"
    },

    "rough-er":{
        title:"🌊 Rough ER",
        function:"Protein synthesis.",
        clinical:"Contains ribosomes.",
        exam:"RER = Ribosomes.",
        glow:"#26C6DA"
    },

    "smooth-er":{
        title:"🌊 Smooth ER",
        function:"Lipid synthesis.",
        clinical:"Drug detoxification occurs here.",
        exam:"SER has NO ribosomes.",
        glow:"#4DD0E1"
    },

    ribosomes:{
        title:"⚫ Ribosomes",
        function:"Protein factories.",
        clinical:"Necessary for protein synthesis.",
        exam:"Smallest organelle.",
        glow:"#EC407A"
    },

    lysosome:{
        title:"🟡 Lysosome",
        function:"Digests waste materials.",
        clinical:"Called the suicide bag of the cell.",
        exam:"Contains digestive enzymes.",
        glow:"#FF7043"
    },

    vacuole:{
        title:"🔵 Vacuole",
        function:"Stores water and nutrients.",
        clinical:"Large in plant cells.",
        exam:"Storage organelle.",
        glow:"#29B6F6"
    },

    centrosome:{
        title:"⭐ Centrosome",
        function:"Helps cell division.",
        clinical:"Forms spindle fibres.",
        exam:"Important during mitosis.",
        glow:"#66BB6A"
    }

};

/* ==========================================================
   Animation State
   ========================================================== */

const animationState = {

    activeOrganelle: null,

    isAnimating: false,

    currentSVG: null,

    clickedRect: null

};

const tourState={

running:false,

step:0

};

/* ==========================================================
   Register Click Events
   ========================================================== */


function registerOrganelles(svg) {

    Object.keys(organelles).forEach(id => {

        const part = svg.getElementById(id);

        if (!part) {
            debug(id + " NOT FOUND", "warn");
            return;
        }

        debug(id + " OK");

        part.classList.add("organelle");

        part.addEventListener("click", () => {

            if (animationState.isAnimating) return;

            animationState.activeOrganelle = part;

            animationState.clickedRect =
part.getBoundingClientRect();

            highlightOrganelle(svg,id);

showTooltip(organelles[id].title);

setTimeout(()=>{

showInfo(organelles[id]);

},700);

        });

    });

}


/* ==========================================================
   Info Popup
   ========================================================== */

function highlightOrganelle(svg,selectedId){

    Object.keys(organelles).forEach(id=>{

        const item=svg.getElementById(id);

        if(!item) return;

        item.classList.remove("active","dim");

        if(id===selectedId){

            item.classList.add("active");
           item.style.setProperty(
"--glow-color",
organelles[id].glow
);
           document.documentElement.style.setProperty(
    "--accent-color",
    organelles[id].glow
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

const tip=document.getElementById("organelleTooltip");

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

setTimeout(()=>{

    showInfo(organelles[id]);

},220);
   

document.getElementById("organelleModal").classList.add("show");
   debug("Modal Opened");
   
   animationState.isAnimating = true;
document.getElementById("closeModal").onclick = closeModal;

}

function closeModal() {

    debug("Closing Modal");

    const modal = document.getElementById("organelleModal");

    modal.classList.add("closing");

    setTimeout(() => {

        modal.classList.remove("show");
        modal.classList.remove("closing");

        animationState.isAnimating = false;
        animationState.activeOrganelle = null;
       document
.getElementById("cell-diagram")
.classList.remove("focus-mode");

        document
            .querySelectorAll(".organelle")
            .forEach(el => el.classList.remove("active", "dim"));

    }, 450);

   resetZoom();
   
}

function setupGuidedTour(){

const btn=document.getElementById("startTour");

if(!btn) return;

btn.addEventListener("click",()=>{

if(tourState.running) return;

tourState.running=true;

debug("🧬 Guided Tour Started");

btn.textContent="⏸ Touring...";

});

   }
