document.addEventListener("DOMContentLoaded", () => {

    initCollapsibles();
    initDiagramPlaceholders();
    initSmoothScroll();
    initClassificationTree();

});


/* ==========================================
   Collapsible Lesson Sections
========================================== */

function initCollapsibles() {

    const sections =
        document.querySelectorAll(".lesson-card.collapsible");

    sections.forEach(section => {

        const button =
            section.querySelector(".collapse-header");

        const content =
            section.querySelector(".collapse-content");

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
   Epithelial Tissue Classification Tree
========================================== */

function initClassificationTree() {

    const diagram =
        document.getElementById("classification-diagram");

    if (!diagram) return;


    const expandableNodes =
        diagram.querySelectorAll(".expandable-node");


    expandableNodes.forEach(button => {

        const targetId =
            button.getAttribute("aria-controls");

        if (!targetId) return;


        const target =
            document.getElementById(targetId);

        if (!target) return;


        // Initial state
        button.setAttribute("aria-expanded", "false");

        target.hidden = true;
        target.classList.remove("is-open");


        button.addEventListener("click", () => {

            const isOpen =
                button.getAttribute("aria-expanded") === "true";

            const newState = !isOpen;


            /* ==============================
               BUTTON STATE
            ============================== */

            button.setAttribute(
                "aria-expanded",
                newState ? "true" : "false"
            );


            /* ==============================
               BRANCH STATE
            ============================== */

            const branch =
                button.closest(".major-branch");

            if (branch) {

                branch.classList.toggle(
                    "is-expanded",
                    newState
                );

            }


            /* ==============================
               SUBTREE STATE
            ============================== */

            if (newState) {

                // First make it render
                target.hidden = false;

                // Then activate CSS animation
                requestAnimationFrame(() => {

                    target.classList.add("is-open");

                });

            } else {

                // Start closing animation
                target.classList.remove("is-open");

                // Wait for CSS animation before hiding
                setTimeout(() => {

                    if (
                        button.getAttribute(
                            "aria-expanded"
                        ) === "false"
                    ) {

                        target.hidden = true;

                    }

                }, 550);

            }


            /* ==============================
               PLUS / MINUS ICON
            ============================== */

            const expandIcon =
                button.querySelector(".expand-icon");

            if (expandIcon) {

                expandIcon.textContent =
                    newState ? "−" : "+";

            }

        });

    });

}


/* ==========================================
   Diagram Placeholders
========================================== */

function initDiagramPlaceholders() {

    // Reserved for future interactive diagrams

}


/* ==========================================
   Smooth Scroll
========================================== */

function initSmoothScroll() {

    // Reserved for future TOC smooth scrolling

}

/* =========================================================
   SIMPLE EPITHELIUM
   Accordion Expand / Collapse
   ---------------------------------------------------------
   • Simple Squamous
   • Simple Cuboidal
   • Simple Columnar
   • One card open at a time
   • Full header tappable
   • Smooth height animation
   • + / − state
   • Accessible aria state
   ========================================================= */

(() => {

    const diagram =
        document.getElementById("simpleEpitheliumDiagram");

    if (!diagram) return;


    const cards =
        Array.from(
            diagram.querySelectorAll(
                ".simple-epi-type-card"
            )
        );


    /* ---------------------------------------------------------
       CONSTANTS
       --------------------------------------------------------- */

    const ANIMATION_TIME = 320;


    /* ---------------------------------------------------------
       GET PARTS
       --------------------------------------------------------- */

    function getParts(card) {

        const header =
            card.querySelector(
                ".simple-epi-type-header"
            );

        const button =
            card.querySelector(
                ".simple-epi-expand-btn"
            );

        const contentId =
            button
                ? button.getAttribute("aria-controls")
                : null;

        const content =
            contentId
                ? document.getElementById(contentId)
                : null;

        return {
            header,
            button,
            content
        };
    }


    /* ---------------------------------------------------------
       OPEN CARD
       --------------------------------------------------------- */

    function openCard(card) {

        const {
            button,
            content
        } = getParts(card);

        if (!button || !content) return;


        /* Make content measurable */
        content.hidden = false;


        /* Start from collapsed state */
        content.style.overflow = "hidden";
        content.style.height = "0px";


        /* Force browser to register height: 0 */
        void content.offsetHeight;


        /* Expanded state */
        card.classList.add("is-open");

        button.setAttribute(
            "aria-expanded",
            "true"
        );

        button.textContent = "−";


        /* Animate to natural height */
        requestAnimationFrame(() => {

            content.style.height =
                content.scrollHeight + "px";

        });


        /* After animation, allow natural height */
        setTimeout(() => {

            if (
                card.classList.contains("is-open")
            ) {

                content.style.height = "auto";

            }

        }, ANIMATION_TIME + 20);
    }


    /* ---------------------------------------------------------
       CLOSE CARD
       --------------------------------------------------------- */

    function closeCard(card) {

        const {
            button,
            content
        } = getParts(card);

        if (!button || !content) return;


        /* If already closed, do nothing */
        if (
            !card.classList.contains("is-open")
        ) {

            content.hidden = true;
            return;
        }


        /* Convert auto height to fixed height */
        content.style.height =
            content.scrollHeight + "px";

        content.style.overflow = "hidden";


        /* Force browser reflow */
        void content.offsetHeight;


        /* Start collapse */
        content.style.height = "0px";

        card.classList.remove("is-open");

        button.setAttribute(
            "aria-expanded",
            "false"
        );

        button.textContent = "+";


        /* Hide after animation */
        setTimeout(() => {

            if (
                !card.classList.contains("is-open")
            ) {

                content.hidden = true;
                content.style.height = "0px";

            }

        }, ANIMATION_TIME);
    }


    /* ---------------------------------------------------------
       TOGGLE CARD
       --------------------------------------------------------- */

    function toggleCard(card) {

        const isOpen =
            card.classList.contains("is-open");


        /* -----------------------------------------------------
           CLOSE CURRENT CARD
           ----------------------------------------------------- */

        if (isOpen) {

            closeCard(card);
            return;

        }


        /* -----------------------------------------------------
           CLOSE ALL OTHER CARDS
           ----------------------------------------------------- */

        cards.forEach(otherCard => {

            if (otherCard !== card) {

                closeCard(otherCard);

            }

        });


        /* -----------------------------------------------------
           OPEN SELECTED CARD
           ----------------------------------------------------- */

        openCard(card);
    }


    /* ---------------------------------------------------------
       FULL HEADER TAP
       --------------------------------------------------------- */

    cards.forEach(card => {

        const {
            header
        } = getParts(card);

        if (!header) return;


        header.addEventListener(
            "click",
            () => {

                toggleCard(card);

            }
        );

    });


    /* ---------------------------------------------------------
       INITIAL STATE
       --------------------------------------------------------- */

    cards.forEach(card => {

        const {
            button,
            content
        } = getParts(card);

        if (!button || !content) return;


        card.classList.remove("is-open");

        button.setAttribute(
            "aria-expanded",
            "false"
        );

        button.textContent = "+";

        content.hidden = true;
        content.style.height = "0px";
        content.style.overflow = "hidden";

        content.style.transition =
            `height ${ANIMATION_TIME}ms ease`;

    });


})();

/* =========================================================
   SIMPLE EPITHELIUM
   MINI INTERACTIVE DIAGRAMS
   ========================================================= */

(function initSimpleEpitheliumMiniDiagrams() {

    function setupMiniDiagram(diagram) {

        // Prevent duplicate event binding
        if (diagram.dataset.miniDiagramReady === "true") {
            return;
        }

        diagram.dataset.miniDiagramReady = "true";

        const cells = diagram.querySelectorAll(".mini-cell");

        if (!cells.length) {
            return;
        }

        function resetDiagram() {

            diagram.classList.remove("is-focused");
            diagram.setAttribute("aria-pressed", "false");

            cells.forEach(cell => {

                cell.style.transform = "";
                cell.style.filter = "";
                cell.style.zIndex = "";

            });
        }


        function focusDiagram() {

            diagram.classList.add("is-focused");
            diagram.setAttribute("aria-pressed", "true");

            const middleIndex = Math.floor(cells.length / 2);

            cells.forEach((cell, index) => {

                const distance = Math.abs(index - middleIndex);

                if (distance === 0) {

                    // Main focused cell
                    cell.style.transform =
                        "translateY(-6px) scale(1.16)";

                    cell.style.filter = "brightness(1.08)";

                    cell.style.zIndex = "10";

                } else {

                    // Surrounding cells become slightly subtle
                    cell.style.transform =
                        "scale(0.94)";

                    cell.style.filter =
                        "brightness(0.92)";

                    cell.style.zIndex = "2";
                }

            });
        }


        function toggleDiagram(event) {

            /*
             * Do not allow this click to interfere
             * with the main accordion system.
             */
            if (event) {
                event.stopPropagation();
            }

            if (diagram.classList.contains("is-focused")) {

                resetDiagram();

            } else {

                focusDiagram();

            }
        }


        /* -------------------------
           Mouse / Touch
           ------------------------- */

        diagram.addEventListener(
            "click",
            toggleDiagram
        );


        /* -------------------------
           Keyboard accessibility
           ------------------------- */

        diagram.addEventListener(
            "keydown",
            function(event) {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    toggleDiagram(event);
                }

            }
        );


        /* -------------------------
           Accessibility state
           ------------------------- */

        diagram.setAttribute(
            "aria-pressed",
            "false"
        );
    }


    function initAllMiniDiagrams() {

        const diagrams =
            document.querySelectorAll(
                ".simple-epi-mini-diagram"
            );

        diagrams.forEach(setupMiniDiagram);
    }


    /*
     * Run after the current page has loaded.
     */
    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initAllMiniDiagrams
        );

    } else {

        initAllMiniDiagrams();

    }

})();

/* =========================================================
   STRATIFIED EPITHELIUM
   Accordion Expand / Collapse
   ---------------------------------------------------------
   • Squamous
   • Cuboidal
   • Columnar
   • Transitional
   • One card open at a time
   • Full header tappable
   • Smooth height animation
   • + / − state
   ========================================================= */

(function initStratifiedEpitheliumAccordion() {

    const diagram =
        document.getElementById("stratifiedEpitheliumDiagram");

    if (!diagram) return;


    const cards =
        Array.from(
            diagram.querySelectorAll(
                ".stratified-epi-type-card"
            )
        );


    const ANIMATION_TIME = 320;


    /* ---------------------------------------------------------
       GET CARD PARTS
       --------------------------------------------------------- */

    function getParts(card) {

        const header =
            card.querySelector(
                ".stratified-epi-type-header"
            );

        const button =
            card.querySelector(
                ".stratified-epi-expand-btn"
            );

        const contentId =
            button
                ? button.getAttribute("aria-controls")
                : null;

        const content =
            contentId
                ? document.getElementById(contentId)
                : null;

        return {
            header,
            button,
            content
        };
    }


    /* ---------------------------------------------------------
       OPEN
       --------------------------------------------------------- */

    function openCard(card) {

        const {
            button,
            content
        } = getParts(card);

        if (!button || !content) return;


        /* Make content available for measurement */
        content.hidden = false;

        content.style.overflow = "hidden";
        content.style.height = "0px";


        /* Force layout */
        void content.offsetHeight;


        /* Open state */

        card.classList.add("is-open");

        button.setAttribute(
            "aria-expanded",
            "true"
        );

        button.textContent = "−";


        /* Animate to natural height */

        requestAnimationFrame(() => {

            content.style.height =
                content.scrollHeight + "px";

        });


        /* Return to auto height after animation */

        setTimeout(() => {

            if (
                card.classList.contains("is-open")
            ) {

                content.style.height = "auto";

            }

        }, ANIMATION_TIME + 20);
    }


    /* ---------------------------------------------------------
       CLOSE
       --------------------------------------------------------- */

    function closeCard(card) {

        const {
            button,
            content
        } = getParts(card);

        if (!button || !content) return;


        if (
            !card.classList.contains("is-open")
        ) {

            content.hidden = true;
            content.style.height = "0px";

            return;
        }


        /* Convert current height into fixed height */

        content.style.height =
            content.scrollHeight + "px";

        content.style.overflow = "hidden";


        /* Force reflow */

        void content.offsetHeight;


        /* Collapse */

        content.style.height = "0px";

        card.classList.remove("is-open");

        button.setAttribute(
            "aria-expanded",
            "false"
        );

        button.textContent = "+";


        /* Hide after animation */

        setTimeout(() => {

            if (
                !card.classList.contains("is-open")
            ) {

                content.hidden = true;
                content.style.height = "0px";

            }

        }, ANIMATION_TIME);
    }


    /* ---------------------------------------------------------
       TOGGLE
       --------------------------------------------------------- */

    function toggleCard(card) {

        const isOpen =
            card.classList.contains("is-open");


        /* Currently open → close */

        if (isOpen) {

            closeCard(card);
            return;

        }


        /* Close every other card */

        cards.forEach(otherCard => {

            if (otherCard !== card) {

                closeCard(otherCard);

            }

        });


        /* Open selected card */

        openCard(card);
    }


    /* ---------------------------------------------------------
       HEADER CLICK
       --------------------------------------------------------- */

    cards.forEach(card => {

        const {
            header
        } = getParts(card);

        if (!header) return;


        header.addEventListener(
            "click",
            function(event) {

                /*
                 * The button is inside the header.
                 * Stop the button's own click from creating
                 * duplicate toggle behavior if necessary.
                 */
                if (
                    event.target.closest(
                        ".stratified-epi-expand-btn"
                    )
                ) {
                    event.stopPropagation();
                }

                toggleCard(card);

            }
        );


        /* -----------------------------------------------------
           BUTTON CLICK
           ----------------------------------------------------- */

        const {
            button
        } = getParts(card);

        if (!button) return;


        button.addEventListener(
            "click",
            function(event) {

                event.preventDefault();
                event.stopPropagation();

                toggleCard(card);

            }
        );

    });


    /* ---------------------------------------------------------
       INITIAL STATE
       --------------------------------------------------------- */

    cards.forEach(card => {

        const {
            button,
            content
        } = getParts(card);

        if (!button || !content) return;


        card.classList.remove("is-open");

        button.setAttribute(
            "aria-expanded",
            "false"
        );

        button.textContent = "+";

        content.hidden = true;

        content.style.height = "0px";

        content.style.overflow = "hidden";

        content.style.transition =
            `height ${ANIMATION_TIME}ms ease`;

    });


})();

/* =========================================================
   SIMPLE EPITHELIUM
   SCROLL REVEAL ANIMATION
   ---------------------------------------------------------
   • Appears when diagram enters viewport
   • Replays when leaving and entering again
   • Works with existing CSS
   ========================================================= */

(function initSimpleEpitheliumScrollReveal() {

    const diagram =
        document.getElementById("simpleEpitheliumDiagram");

    if (!diagram) return;


    let revealTimer = null;


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    clearTimeout(revealTimer);


                    if (entry.isIntersecting) {

                        /*
                         * Small delay makes the entrance
                         * feel more natural.
                         */
                        revealTimer = setTimeout(() => {

                            diagram.classList.add(
                                "is-visible"
                            );

                        }, 120);


                    } else {

                        /*
                         * Remove the state so the animation
                         * can replay when the user scrolls
                         * back to the diagram.
                         */
                        diagram.classList.remove(
                            "is-visible"
                        );

                    }

                });

            },
            {
                threshold: 0.20
            }
        );


    observer.observe(diagram);

})();



/* =========================================================
   STRATIFIED EPITHELIUM
   MINI DIAGRAM + SCROLL ANIMATION CONTROLLER
   ---------------------------------------------------------
   Works with the existing Stratified accordion.
   Does NOT replace the accordion logic.
   ========================================================= */

(function initStratifiedEpitheliumAnimations() {

    const diagram =
        document.getElementById(
            "stratifiedEpitheliumDiagram"
        );

    if (!diagram) return;


    /* =====================================================
       1. SCROLL REVEAL
       ===================================================== */

    let revealTimer = null;

    const revealObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        clearTimeout(revealTimer);

                        revealTimer = setTimeout(() => {

                            diagram.classList.add(
                                "is-visible"
                            );

                        }, 180);

                    } else {

                        clearTimeout(revealTimer);

                        diagram.classList.remove(
                            "is-visible"
                        );

                    }

                });

            },
            {
                threshold: 0.22
            }
        );


    revealObserver.observe(diagram);


    /* =====================================================
       2. MINI DIAGRAM HELPERS
       ===================================================== */

    function resetMiniDiagram(miniDiagram) {

        if (!miniDiagram) return;


        miniDiagram.classList.remove(
            "diagram-animated",
            "layers-animated",
            "is-focused",
            "is-stretched"
        );


        /*
         * Force the browser to register the reset.
         * This allows the animation to replay when
         * the card is opened again.
         */

        void miniDiagram.offsetWidth;
    }


    function animateMiniDiagram(miniDiagram) {

        if (!miniDiagram) return;


        /*
         * Start from clean state.
         */

        resetMiniDiagram(miniDiagram);


        /*
         * Step 1:
         * Mini diagram itself enters.
         */

        requestAnimationFrame(() => {

            miniDiagram.classList.add(
                "diagram-animated"
            );

        });


        /*
         * Step 2:
         * Build epithelial layers.
         *
         * Transitional has a different animation,
         * so do not add layers-animated to it.
         */

        const type =
            miniDiagram.getAttribute(
                "data-stratified-mini-diagram"
            );


        if (type !== "transitional") {

            setTimeout(() => {

                /*
                 * Make sure the card is still open.
                 */

                const content =
                    miniDiagram.closest(
                        ".stratified-epi-type-content"
                    );

                if (
                    content &&
                    content.hidden
                ) {
                    return;
                }


                miniDiagram.classList.add(
                    "layers-animated"
                );

            }, 220);

        }

    }


    /* =====================================================
       3. FIND ALL STRATIFIED MINI DIAGRAMS
       ===================================================== */

    const miniDiagrams =
        Array.from(
            diagram.querySelectorAll(
                ".stratified-epi-mini-diagram"
            )
        );


    /* =====================================================
       4. INITIAL RESET
       ===================================================== */

    miniDiagrams.forEach((miniDiagram) => {

        resetMiniDiagram(miniDiagram);

    });


    /* =====================================================
       5. WATCH ACCORDION CONTENT
       -----------------------------------------------------
       Existing accordion JS changes the `hidden`
       attribute.

       We observe that change instead of modifying
       the existing accordion code.
       ===================================================== */

    const contents =
        Array.from(
            diagram.querySelectorAll(
                ".stratified-epi-type-content"
            )
        );


    contents.forEach((content) => {

        const contentObserver =
            new MutationObserver(
                (mutations) => {

                    mutations.forEach((mutation) => {

                        if (
                            mutation.type !==
                            "attributes"
                        ) {
                            return;
                        }


                        if (
                            mutation.attributeName !==
                            "hidden"
                        ) {
                            return;
                        }


                        const miniDiagram =
                            content.querySelector(
                                ".stratified-epi-mini-diagram"
                            );

                        if (!miniDiagram) return;


                        /*
                         * OPEN
                         */

                        if (!content.hidden) {

                            /*
                             * Small delay so the
                             * accordion opening and
                             * diagram animation do not
                             * fight each other.
                             */

                            setTimeout(() => {

                                if (
                                    !content.hidden
                                ) {

                                    animateMiniDiagram(
                                        miniDiagram
                                    );

                                }

                            }, 120);

                        }


                        /*
                         * CLOSED
                         */

                        else {

                            resetMiniDiagram(
                                miniDiagram
                            );

                        }

                    });

                }
            );


        contentObserver.observe(
            content,
            {
                attributes: true,
                attributeFilter: [
                    "hidden"
                ]
            }
        );

    });


    /* =====================================================
       6. SURFACE CELL FOCUS
       -----------------------------------------------------
       Squamous / Cuboidal / Columnar
       ===================================================== */

    miniDiagrams.forEach((miniDiagram) => {

        const type =
            miniDiagram.getAttribute(
                "data-stratified-mini-diagram"
            );


        if (type === "transitional") {
            return;
        }


        function toggleFocus() {

            /*
             * Ignore interaction if the
             * diagram is not visible yet.
             */

            const content =
                miniDiagram.closest(
                    ".stratified-epi-type-content"
                );

            if (
                content &&
                content.hidden
            ) {
                return;
            }


            miniDiagram.classList.toggle(
                "is-focused"
            );

        }


        miniDiagram.addEventListener(
            "click",
            toggleFocus
        );


        miniDiagram.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    toggleFocus();

                }

            }
        );

    });


    /* =====================================================
       7. TRANSITIONAL EPITHELIUM
       -----------------------------------------------------
       Before Stretch → After Stretch
       ===================================================== */

    const transitionalDiagram =
        diagram.querySelector(
            '[data-stratified-mini-diagram="transitional"]'
        );


    if (transitionalDiagram) {

        function toggleTransitionalStretch() {

            const content =
                transitionalDiagram.closest(
                    ".stratified-epi-type-content"
                );


            if (
                content &&
                content.hidden
            ) {
                return;
            }


            transitionalDiagram.classList.toggle(
                "is-stretched"
            );

        }


        transitionalDiagram.addEventListener(
            "click",
            toggleTransitionalStretch
        );


        transitionalDiagram.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    toggleTransitionalStretch();

                }

            }
        );

    }


    /* =====================================================
       8. RESET TRANSITIONAL WHEN CARD CLOSES
       ===================================================== */

    if (transitionalDiagram) {

        const transitionalContent =
            transitionalDiagram.closest(
                ".stratified-epi-type-content"
            );


        if (transitionalContent) {

            const transitionalObserver =
                new MutationObserver(
                    (mutations) => {

                        mutations.forEach(
                            (mutation) => {

                                if (
                                    mutation.type ===
                                    "attributes" &&
                                    mutation.attributeName ===
                                    "hidden" &&
                                    transitionalContent.hidden
                                ) {

                                    transitionalDiagram
                                        .classList
                                        .remove(
                                            "is-stretched"
                                        );

                                }

                            }
                        );

                    }
                );


            transitionalObserver.observe(
                transitionalContent,
                {
                    attributes: true,
                    attributeFilter: [
                        "hidden"
                    ]
                }
            );

        }

    }


    /* =====================================================
       9. CLEANUP ON PAGE VISIBILITY CHANGE
       ===================================================== */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.visibilityState ===
                "hidden"
            ) {

                clearTimeout(
                    revealTimer
                );

            }

        }
    );


})();


/* =========================================================
   PSEUDOSTRATIFIED EPITHELIUM
   INTERACTIVE DIAGRAM CONTROLLER
   ---------------------------------------------------------
   • Scroll reveal
   • Diagram tap focus
   • Feature focus buttons
   • Keyboard accessibility
   • Reset / focus states
   ========================================================= */

(function initPseudostratifiedDiagram() {

    const diagram =
        document.getElementById(
            "pseudostratifiedDiagram"
        );

    if (!diagram) return;


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const interactive =
        diagram.querySelector(
            "[data-pseudo-diagram]"
        );

    const featureButtons =
        Array.from(
            diagram.querySelectorAll(
                ".pseudo-feature-btn"
            )
        );

    const cells =
        Array.from(
            diagram.querySelectorAll(
                ".pseudo-cell"
            )
        );

    const cilia =
        diagram.querySelector(
            ".pseudo-cilia"
        );

    const gobletCells =
        Array.from(
            diagram.querySelectorAll(
                '[data-pseudo-feature="goblet-cell"]'
            )
        );

    const basalCells =
        Array.from(
            diagram.querySelectorAll(
                '[data-pseudo-feature="basal-cell"]'
            )
        );

    const nuclei =
        Array.from(
            diagram.querySelectorAll(
                ".pseudo-cell-nucleus"
            )
        );

    const basementMembrane =
        diagram.querySelector(
            ".pseudo-basement-membrane"
        );


    /* =====================================================
       1. SCROLL REVEAL
       -----------------------------------------------------
       Same general pattern used by the existing
       Simple / Stratified diagrams.
       ===================================================== */

    let revealTimer = null;

    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach((entry) => {

                        clearTimeout(
                            revealTimer
                        );

                        if (entry.isIntersecting) {

                            revealTimer =
                                setTimeout(() => {

                                    diagram.classList.add(
                                        "is-visible"
                                    );

                                }, 120);

                        } else {

                            /*
                             * Remove the class so the
                             * entrance animation can replay.
                             */
                            diagram.classList.remove(
                                "is-visible"
                            );

                            /*
                             * Also reset any focus state
                             * when the diagram leaves view.
                             */
                            resetFocus();

                        }

                    });

                },
                {
                    threshold: 0.20
                }
            );

        revealObserver.observe(diagram);

    } else {

        /*
         * Fallback for browsers without
         * IntersectionObserver.
         */
        diagram.classList.add(
            "is-visible"
        );

    }


    /* =====================================================
       2. FOCUS HELPERS
       ===================================================== */

    const focusClasses = [
        "pseudo-focus-cilia",
        "pseudo-focus-goblet",
        "pseudo-focus-basal",
        "pseudo-focus-nuclei",
        "pseudo-focus-basement"
    ];


    function clearFocusClasses() {

        focusClasses.forEach(
            (className) => {

                interactive.classList.remove(
                    className
                );

            }
        );

    }


    function clearActiveButtons() {

        featureButtons.forEach(
            (button) => {

                button.classList.remove(
                    "is-active"
                );

                button.setAttribute(
                    "aria-pressed",
                    "false"
                );

            }
        );

    }


    function resetFocus() {

        if (!interactive) return;

        clearFocusClasses();

        interactive.classList.remove(
            "is-focused"
        );

        clearActiveButtons();

        interactive.setAttribute(
            "aria-pressed",
            "false"
        );

    }


    /* =====================================================
       3. APPLY FEATURE FOCUS
       ===================================================== */

    function focusFeature(
        feature,
        activeButton = null
    ) {

        if (!interactive) return;

        /*
         * First clear any previous focus.
         */
        clearFocusClasses();

        clearActiveButtons();


        /*
         * If the same feature is already active,
         * reset instead.
         */
        const currentFeature =
            interactive.dataset.pseudoCurrentFocus;

        if (
            currentFeature === feature
        ) {

            resetFocus();

            delete interactive.dataset
                .pseudoCurrentFocus;

            return;

        }


        /*
         * Main focus state.
         */
        interactive.classList.add(
            "is-focused"
        );


        /*
         * Map HTML data values to CSS classes.
         */
        const classMap = {

            "cilia":
                "pseudo-focus-cilia",

            "goblet-cell":
                "pseudo-focus-goblet",

            "basal-cell":
                "pseudo-focus-basal",

            "nuclei":
                "pseudo-focus-nuclei",

            "basement-membrane":
                "pseudo-focus-basement"

        };


        const focusClass =
            classMap[feature];


        if (!focusClass) {

            resetFocus();

            return;

        }


        interactive.classList.add(
            focusClass
        );


        /*
         * Remember current focus.
         */
        interactive.dataset
            .pseudoCurrentFocus =
            feature;


        /*
         * Active button state.
         */
        if (activeButton) {

            activeButton.classList.add(
                "is-active"
            );

            activeButton.setAttribute(
                "aria-pressed",
                "true"
            );

        }

    }


    /* =====================================================
       4. FEATURE BUTTONS
       ===================================================== */

    featureButtons.forEach(
        (button) => {

            const feature =
                button.getAttribute(
                    "data-pseudo-focus"
                );

            if (!feature) return;


            /*
             * Accessibility state.
             */
            button.setAttribute(
                "aria-pressed",
                "false"
            );


            button.addEventListener(
                "click",
                (event) => {

                    /*
                     * Prevent the click from
                     * triggering the diagram itself.
                     */
                    event.preventDefault();
                    event.stopPropagation();


                    focusFeature(
                        feature,
                        button
                    );

                }
            );

        }
    );


    /* =====================================================
       5. DIAGRAM TAP
       -----------------------------------------------------
       First tap = focus diagram
       Second tap = reset
       ===================================================== */

    if (interactive) {

        interactive.addEventListener(
            "click",
            (event) => {

                /*
                 * Do not interfere with buttons.
                 */
                if (
                    event.target.closest(
                        ".pseudo-feature-btn"
                    )
                ) {
                    return;
                }


                /*
                 * If a feature is currently
                 * focused, reset it.
                 */
                if (
                    interactive.classList.contains(
                        "is-focused"
                    )
                ) {

                    resetFocus();

                    delete interactive.dataset
                        .pseudoCurrentFocus;

                    return;

                }


                /*
                 * Otherwise focus the
                 * nuclei feature as the
                 * main educational point.
                 */
                focusFeature(
                    "nuclei"
                );

            }
        );


        /* =================================================
           KEYBOARD ACCESSIBILITY
           ================================================= */

        interactive.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();


                    if (
                        interactive.classList.contains(
                            "is-focused"
                        )
                    ) {

                        resetFocus();

                        delete interactive.dataset
                            .pseudoCurrentFocus;

                    } else {

                        focusFeature(
                            "nuclei"
                        );

                    }

                }

                /*
                 * Escape always resets.
                 */
                if (
                    event.key === "Escape"
                ) {

                    resetFocus();

                    delete interactive.dataset
                        .pseudoCurrentFocus;

                }

            }
        );


        /*
         * Initial accessibility state.
         */
        interactive.setAttribute(
            "aria-pressed",
            "false"
        );

    }


    /* =====================================================
       6. DIRECT CELL INTERACTION
       -----------------------------------------------------
       Tapping a goblet / basal / normal cell
       automatically focuses the corresponding feature.
       ===================================================== */

    cells.forEach(
        (cell) => {

            cell.addEventListener(
                "click",
                (event) => {

                    event.stopPropagation();

                    const feature =
                        cell.getAttribute(
                            "data-pseudo-feature"
                        );

                    if (!feature) return;


                    if (
                        feature ===
                        "goblet-cell"
                    ) {

                        focusFeature(
                            "goblet-cell"
                        );

                        return;

                    }


                    if (
                        feature ===
                        "basal-cell"
                    ) {

                        focusFeature(
                            "basal-cell"
                        );

                        return;

                    }


                    /*
                     * Columnar cells contain
                     * nuclei, so clicking them
                     * focuses nuclei.
                     */
                    if (
                        feature ===
                        "ciliated-cell"
                    ) {

                        focusFeature(
                            "nuclei"
                        );

                    }

                }
            );

        }
    );


    /* =====================================================
       7. DIRECT CILIA INTERACTION
       ===================================================== */

    if (cilia) {

        cilia.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                focusFeature(
                    "cilia"
                );

            }
        );

    }


    /* =====================================================
       8. DIRECT BASEMENT MEMBRANE INTERACTION
       ===================================================== */

    if (basementMembrane) {

        basementMembrane.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                focusFeature(
                    "basement-membrane"
                );

            }
        );

    }


    /* =====================================================
       9. CLEAN INITIAL STATE
       ===================================================== */

    resetFocus();


    /*
     * Keep references available for debugging
     * without creating global variables.
     */
    diagram._pseudoController = {

        reset: resetFocus,

        focus: focusFeature,

        cells,

        gobletCells,

        basalCells,

        nuclei,

        cilia,

        basementMembrane

    };

})();


/* =========================================================
   TRANSITIONAL EPITHELIUM
   RICH INTERACTIVE DIAGRAM CONTROLLER
   ---------------------------------------------------------
   • Scroll reveal
   • Relaxed ↔ Stretched
   • Feature focus
   • Keyboard accessibility
   • Direct cell interaction
   • Reset on leaving viewport
   ---------------------------------------------------------
   Dedicated controller
   Does NOT affect the existing Stratified mini diagram
   ========================================================= */

(function initTransitionalRichDiagram() {

    const diagram =
        document.querySelector(
            ".transitional-rich-diagram"
        );

    if (!diagram) return;


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const simulator =
        diagram.querySelector(
            ".transitional-rich-simulator"
        );

    if (!simulator) return;


    const featureButtons =
        Array.from(
            diagram.querySelectorAll(
                ".transitional-rich-btn"
            )
        );


    const featureTargets =
        Array.from(
            diagram.querySelectorAll(
                "[data-tr-feature]"
            )
        );


    /* =====================================================
       STATE
       ===================================================== */

    let currentFeature = null;


    /* =====================================================
       1. SCROLL REVEAL
       ===================================================== */

    let revealTimer = null;

    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach((entry) => {

                        clearTimeout(
                            revealTimer
                        );


                        if (entry.isIntersecting) {

                            revealTimer =
                                setTimeout(() => {

                                    diagram.classList.add(
                                        "is-visible"
                                    );

                                }, 120);

                        } else {

                            diagram.classList.remove(
                                "is-visible"
                            );

                            resetDiagram();

                        }

                    });

                },
                {
                    threshold: 0.20
                }
            );


        revealObserver.observe(diagram);

    } else {

        /* Browser fallback */

        diagram.classList.add(
            "is-visible"
        );

    }


    /* =====================================================
       2. STRETCH STATE
       -----------------------------------------------------
       Relaxed → Stretched
       Stretched → Relaxed
       ===================================================== */

    function toggleStretch() {

        const isStretched =
            simulator.classList.contains(
                "is-stretched"
            );


        if (isStretched) {

            simulator.classList.remove(
                "is-stretched"
            );

            simulator.setAttribute(
                "aria-pressed",
                "false"
            );

        } else {

            simulator.classList.add(
                "is-stretched"
            );

            simulator.setAttribute(
                "aria-pressed",
                "true"
            );

        }

    }


    /* =====================================================
       3. RESET DIAGRAM
       ===================================================== */

    function resetDiagram() {

        simulator.classList.remove(
            "is-stretched",
            "is-feature-focused",
            "tr-focus-surface",
            "tr-focus-intermediate",
            "tr-focus-basal",
            "tr-focus-basement"
        );


        simulator.setAttribute(
            "aria-pressed",
            "false"
        );


        currentFeature = null;


        featureButtons.forEach(
            (button) => {

                button.classList.remove(
                    "is-active"
                );

                button.setAttribute(
                    "aria-pressed",
                    "false"
                );

            }
        );

    }


    /* =====================================================
       4. STRETCH CLICK
       ===================================================== */

    simulator.addEventListener(
        "click",
        (event) => {

            /*
             * Feature buttons are outside the simulator,
             * but this guard keeps the controller safe
             * if the HTML is later rearranged.
             */

            if (
                event.target.closest(
                    ".transitional-rich-btn"
                )
            ) {
                return;
            }


            /*
             * If a feature is currently focused,
             * clicking the tissue first clears focus.
             *
             * Next tap changes stretch state.
             */

            if (
                currentFeature !== null
            ) {

                clearFeatureFocus();

                return;

            }


            toggleStretch();

        }
    );


    /* =====================================================
       5. KEYBOARD ACCESSIBILITY
       ===================================================== */

    simulator.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                toggleStretch();

            }


            if (
                event.key === "Escape"
            ) {

                event.preventDefault();

                resetDiagram();

            }

        }
    );


    /* =====================================================
       6. ACCESSIBILITY INITIAL STATE
       ===================================================== */

    simulator.setAttribute(
        "role",
        "button"
    );

    simulator.setAttribute(
        "tabindex",
        "0"
    );

    simulator.setAttribute(
        "aria-pressed",
        "false"
    );


    /* =====================================================
       7. FEATURE FOCUS HELPERS
       ===================================================== */

    const focusClasses = {

        surface:
            "tr-focus-surface",

        intermediate:
            "tr-focus-intermediate",

        basal:
            "tr-focus-basal",

        basement:
            "tr-focus-basement"

    };


    function clearFeatureFocus() {

        Object.values(
            focusClasses
        ).forEach(
            (className) => {

                simulator.classList.remove(
                    className
                );

            }
        );


        simulator.classList.remove(
            "is-feature-focused"
        );


        featureButtons.forEach(
            (button) => {

                button.classList.remove(
                    "is-active"
                );

                button.setAttribute(
                    "aria-pressed",
                    "false"
                );

            }
        );


        currentFeature = null;

    }


    /* =====================================================
       8. APPLY FEATURE FOCUS
       ===================================================== */

    function focusFeature(
        feature,
        activeButton = null
    ) {

        const focusClass =
            focusClasses[feature];


        if (!focusClass) return;


        /*
         * Same feature tapped again
         * → reset focus.
         */

        if (
            currentFeature === feature
        ) {

            clearFeatureFocus();

            return;

        }


        /*
         * Clear previous focus first.
         */

        clearFeatureFocus();


        /*
         * Activate general focus state.
         */

        simulator.classList.add(
            "is-feature-focused"
        );


        simulator.classList.add(
            focusClass
        );


        currentFeature =
            feature;


        /*
         * Active button state.
         */

        if (activeButton) {

            activeButton.classList.add(
                "is-active"
            );

            activeButton.setAttribute(
                "aria-pressed",
                "true"
            );

        }

    }


    /* =====================================================
       9. FEATURE BUTTONS
       -----------------------------------------------------
       Expected HTML:

       data-tr-focus="surface"
       data-tr-focus="intermediate"
       data-tr-focus="basal"
       data-tr-focus="basement"
       ===================================================== */

    featureButtons.forEach(
        (button) => {

            const feature =
                button.getAttribute(
                    "data-tr-focus"
                );


            if (!feature) return;


            button.setAttribute(
                "type",
                "button"
            );


            button.setAttribute(
                "aria-pressed",
                "false"
            );


            button.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();

                    event.stopPropagation();


                    focusFeature(
                        feature,
                        button
                    );

                }
            );


            /*
             * Keyboard support
             * comes naturally from button,
             * but Escape is useful here too.
             */

            button.addEventListener(
                "keydown",
                (event) => {

                    if (
                        event.key === "Escape"
                    ) {

                        clearFeatureFocus();

                        simulator.focus();

                    }

                }
            );

        }
    );


    /* =====================================================
       10. DIRECT TISSUE INTERACTION
       -----------------------------------------------------
       If a tissue layer/cell has:

       data-tr-feature="surface"

       it can be tapped directly.
       ===================================================== */

    featureTargets.forEach(
        (target) => {

            const feature =
                target.getAttribute(
                    "data-tr-feature"
                );


            if (
                !focusClasses[feature]
            ) {
                return;
            }


            target.addEventListener(
                "click",
                (event) => {

                    event.stopPropagation();

                    focusFeature(
                        feature
                    );

                }
            );

        }
    );


    /* =====================================================
       11. INITIAL CLEAN STATE
       ===================================================== */

    resetDiagram();


    /* =====================================================
       12. DEBUG / CONTROL API
       -----------------------------------------------------
       Useful during development.
       Does not create global variables.
       ===================================================== */

    diagram._transitionalController = {

        reset:
            resetDiagram,

        stretch:
            toggleStretch,

        focus:
            focusFeature,

        clearFocus:
            clearFeatureFocus

    };


})();

