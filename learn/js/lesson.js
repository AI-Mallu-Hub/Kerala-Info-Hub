document.addEventListener("DOMContentLoaded", () => {

    initCollapsibles();
    initDiagramPlaceholders();
    initSmoothScroll();

});

/* ==========================================
   Collapsible Sections
========================================== */

function initCollapsibles() {

    const sections = document.querySelectorAll(".lesson-card.collapsible");

    sections.forEach(section => {

        const button = section.querySelector(".collapse-header");
        const content = section.querySelector(".collapse-content");

        if (!button || !content) return;

        // Default = Closed
        section.classList.add("collapsed");
        content.style.display = "none";

        button.addEventListener("click", () => {

            const collapsed =
                section.classList.toggle("collapsed");

            if (collapsed) {

                content.style.display = "none";

            } else {

                content.style.display = "block";

            }

        });

    });

}

/* ==========================================
   Diagram Placeholders
   (Future)
========================================== */

function initDiagramPlaceholders() {

    // Future Interactive Diagram Engine

}

/* ==========================================
   Smooth Scroll
   (Future)
========================================== */

function initSmoothScroll() {

    // Future TOC Smooth Scroll

}

