alert("diagram-engine.js loaded");
/* ==========================================================
   Developer Debug Mode
========================================================== */

const DEBUG = true;

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
        exam:"Largest organelle in animal cells."
    },

    nucleolus:{
        title:"🟣 Nucleolus",
        function:"Produces ribosomes.",
        clinical:"Highly active in rapidly dividing cells.",
        exam:"Found inside the nucleus."
    },

    mitochondria:{
        title:"⚡ Mitochondria",
        function:"Produces ATP (energy).",
        clinical:"Mitochondrial diseases reduce energy production.",
        exam:"Powerhouse of the cell."
    },

    golgi:{
        title:"📦 Golgi Apparatus",
        function:"Packages and transports proteins.",
        clinical:"Essential for secretion.",
        exam:"Packaging centre of the cell."
    },

    "rough-er":{
        title:"🌊 Rough ER",
        function:"Protein synthesis.",
        clinical:"Contains ribosomes.",
        exam:"RER = Ribosomes."
    },

    "smooth-er":{
        title:"🌊 Smooth ER",
        function:"Lipid synthesis.",
        clinical:"Drug detoxification occurs here.",
        exam:"SER has NO ribosomes."
    },

    ribosomes:{
        title:"⚫ Ribosomes",
        function:"Protein factories.",
        clinical:"Necessary for protein synthesis.",
        exam:"Smallest organelle."
    },

    lysosome:{
        title:"🟡 Lysosome",
        function:"Digests waste materials.",
        clinical:"Called the suicide bag of the cell.",
        exam:"Contains digestive enzymes."
    },

    vacuole:{
        title:"🔵 Vacuole",
        function:"Stores water and nutrients.",
        clinical:"Large in plant cells.",
        exam:"Storage organelle."
    },

    centrosome:{
        title:"⭐ Centrosome",
        function:"Helps cell division.",
        clinical:"Forms spindle fibres.",
        exam:"Important during mitosis."
    }

};

/* ==========================================================
   Animation State
   ========================================================== */

const animationState = {

    activeOrganelle: null,

    isAnimating: false,

    currentSVG: null

};

/* ==========================================================
   Register Click Events
   ========================================================== */

debug("Clicked : " + id);

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

            highlightOrganelle(svg, id);

            setTimeout(() => {

                showInfo(organelles[id]);

            }, 180);

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

        }else{

            item.classList.add("dim");

        }

    });

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
            .querySelectorAll(".organelle")
            .forEach(el => el.classList.remove("active", "dim"));

    }, 450);
   
  }

});
