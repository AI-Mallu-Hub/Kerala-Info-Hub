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

    nucleus: {
        title: "🧠 Nucleus",
        description: "Controls all activities of the cell and stores DNA."
    },

    nucleolus: {
        title: "🟣 Nucleolus",
        description: "Produces ribosomes."
    },

    mitochondria: {
        title: "⚡ Mitochondria",
        description: "Powerhouse of the cell. Produces ATP."
    },

    golgi: {
        title: "📦 Golgi Apparatus",
        description: "Packages and transports proteins."
    },

    "rough-er": {
        title: "🌊 Rough ER",
        description: "Protein synthesis."
    },

    "smooth-er": {
        title: "🌊 Smooth ER",
        description: "Lipid synthesis."
    },

    ribosomes: {
        title: "⚫ Ribosomes",
        description: "Protein factories."
    },

    lysosome: {
        title: "🟡 Lysosome",
        description: "Digests waste materials."
    },

    vacuole: {
        title: "🔵 Vacuole",
        description: "Stores water and nutrients."
    },

    centrosome: {
        title: "⭐ Centrosome",
        description: "Helps in cell division."
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

            showInfo(
                organelles[id].title,
                organelles[id].description
            );

        });

    });

}


/* ==========================================================
   Info Popup
   ========================================================== */

function showInfo(title, description) {

    showModal({
 title:"🧠 Nucleus",
 function:"Controls all activities of the cell.",
 clinical:"DNA mutations can produce disease.",
 exam:"Frequently asked in PSC and MOHAP."
});
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
