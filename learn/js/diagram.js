/* ==========================================================
   Kerala Info Hub - Interactive Diagram Engine v1.0
   Reusable for Cell, Heart, Brain, Kidney, etc.
   ========================================================== */

window.addEventListener("DOMContentLoaded", initDiagram);

async function initDiagram() {

    const container = document.getElementById("cell-diagram");

    if (!container) {
        console.error("Diagram container not found.");
        return;
    }

    try {

        // Load SVG
        const response = await fetch("/Kerala-Info-Hub/learn/assets/svg/cell.svg");

        if (!response.ok) {
            throw new Error("SVG file not found.");
        }

        const svgText = await response.text();

        container.innerHTML = svgText;

        const svg = container.querySelector("svg");

        if (!svg) {
            throw new Error("SVG element missing.");
        }

        console.log("✅ SVG Loaded");

        registerOrganelles(svg);

    }

    catch (error) {

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
   Register Click Events
   ========================================================== */

function registerOrganelles(svg) {

    Object.keys(organelles).forEach(id => {

        const part = svg.getElementById(id);

        if (!part) return;

        part.classList.add("organelle");

        part.addEventListener("click", () => {

    showInfo(organelles[id]);

});

    });

}


/* ==========================================================
   Info Popup
   ========================================================== */

function showInfo(data){

    showModal(data);

}

function showModal(data){

document.getElementById("modalTitle").textContent=data.title;

document.getElementById("modalFunction").textContent=data.function;

document.getElementById("modalClinical").textContent=data.clinical;

document.getElementById("modalExam").textContent=data.exam;

document.getElementById("organelleModal").classList.add("show");

}

document
.getElementById("closeModal")
.addEventListener("click",()=>{

document
.getElementById("organelleModal")
.classList.remove("show");

});
