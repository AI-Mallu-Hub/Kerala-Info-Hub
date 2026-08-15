document.addEventListener("DOMContentLoaded", () => {

    initConnectiveCollapsibles();

    initConnectiveNestedHeightSync();

    initConnectiveDiagramAnimation();

    DiagramEngine.init(
        "cartilage-diagram-container",
        "../../assets/svg/cartilage.svg",
        CartilageConfig
    );

});


/* =========================================================
   CONNECTIVE TISSUE COLLAPSIBLE SYSTEM
   ---------------------------------------------------------
   Lesson-specific collapsible system.

   Features:
   - Closed by default
   - Multiple sections can remain open
   - Smooth height animation
   - Smooth arrow rotation
   - Accessible aria-expanded state
   - Independent from lesson.js collapsibles
   ========================================================= */

function initConnectiveCollapsibles() {

    const sections =
        document.querySelectorAll(
            ".ct-lesson .lesson-card.collapsible"
        );

    sections.forEach(section => {

        const button =
            section.querySelector(".collapse-header");

        const content =
            section.querySelector(".collapse-content");

        if (!button || !content) return;


        /* -----------------------------------------
           INITIAL STATE
        ----------------------------------------- */

        section.classList.remove("is-open");
        section.classList.add("collapsed");

        button.setAttribute(
            "aria-expanded",
            "false"
        );

        content.style.maxHeight = "0px";
        content.style.opacity = "0";
        content.style.overflow = "hidden";


        /* -----------------------------------------
           CLICK HANDLER
        ----------------------------------------- */

        button.addEventListener("click", () => {

            const isOpen =
                section.classList.contains("is-open");


            if (isOpen) {

                closeConnectiveSection(
                    section,
                    button,
                    content
                );

            } else {

                openConnectiveSection(
                    section,
                    button,
                    content
                );

            }

        });

    });

}


/* =========================================================
   NESTED CONTENT HEIGHT SYNC
   ---------------------------------------------------------
   When a nested <details> section opens/closes,
   refresh the height of its parent collapsible content.

   This prevents classification sections from being
   clipped at the bottom.
   ========================================================= */

function initConnectiveNestedHeightSync() {

    const nestedSections =
        document.querySelectorAll(
            ".ct-lesson .collapse-content .nested-collapsible"
        );

    nestedSections.forEach(nested => {

        nested.addEventListener("toggle", () => {

            const parentContent =
                nested.closest(".collapse-content");

            if (!parentContent) return;

            /*
             * Wait until the browser has finished
             * updating the <details> layout.
             */

            requestAnimationFrame(() => {

                requestAnimationFrame(() => {

                    /*
                     * Only update if the parent
                     * section is currently open.
                     */

                    const parentSection =
                        parentContent.closest(
                            ".lesson-card.collapsible"
                        );

                    if (
                        !parentSection ||
                        !parentSection.classList.contains(
                            "is-open"
                        )
                    ) {
                        return;
                    }

                    parentContent.style.maxHeight =
                        parentContent.scrollHeight + "px";

                });

            });

        });

    });

}


/* =========================================================
   OPEN CONNECTIVE SECTION
========================================================= */

function openConnectiveSection(
    section,
    button,
    content
) {

    section.classList.remove("collapsed");
    section.classList.add("is-open");

    button.setAttribute(
        "aria-expanded",
        "true"
    );


    /*
     * Keep the content rendered while
     * the opening animation starts.
     */

    content.style.display = "block";

    content.style.maxHeight = "0px";
    content.style.opacity = "0";


    /*
     * Two animation frames give the browser
     * enough time to register the initial state
     * before expanding.
     */

    requestAnimationFrame(() => {

        requestAnimationFrame(() => {

            content.style.maxHeight =
                content.scrollHeight + "px";

            content.style.opacity = "1";

        });

    });

}


/* =========================================================
   CLOSE CONNECTIVE SECTION
========================================================= */

function closeConnectiveSection(
    section,
    button,
    content
) {

    section.classList.remove("is-open");
    section.classList.add("collapsed");

    button.setAttribute(
        "aria-expanded",
        "false"
    );


    /*
     * Start from the current content height.
     */

    content.style.maxHeight =
        content.scrollHeight + "px";

    content.style.opacity = "1";


    /*
     * Then smoothly collapse to zero.
     */

    requestAnimationFrame(() => {

        content.style.maxHeight = "0px";
        content.style.opacity = "0";

    });


    /*
     * Hide the content only AFTER
     * the closing animation finishes.
     */

    const handleTransitionEnd = event => {

        if (event.propertyName !== "max-height") {
            return;
        }


        if (
            section.classList.contains(
                "collapsed"
            )
        ) {

            content.style.display = "none";

        }


        content.removeEventListener(
            "transitionend",
            handleTransitionEnd
        );

    };


    content.addEventListener(
        "transitionend",
        handleTransitionEnd
    );

}

/* =========================================================
   DIAGRAM 1 - REPEATING SCROLL REVEAL ANIMATION
   ---------------------------------------------------------
   Sequence:
   1. Cells appear
   2. ECM field appears
   3. Result appears

   Animation plays every time the diagram
   enters the viewport.

   When the diagram leaves the viewport,
   the animation resets.
   ========================================================= */

function initConnectiveDiagramAnimation() {

    const diagram =
        document.querySelector(".ct-diagram-svg");

    if (!diagram) return;


    /* -----------------------------------------
       FIND ANIMATABLE ELEMENTS
    ----------------------------------------- */

    const cells =
        diagram.querySelector(".diagram-cells");

    const ecm =
        diagram.querySelector(".diagram-ecm");

    const result =
        diagram.querySelector(".diagram-result");


    /* -----------------------------------------
       SAFETY CHECK
    ----------------------------------------- */

    if (!cells || !ecm || !result) return;


    /* -----------------------------------------
       MARK ELEMENTS AS ANIMATABLE
    ----------------------------------------- */

    cells.classList.add("diagram-animate");
    ecm.classList.add("diagram-animate");
    result.classList.add("diagram-animate");


    /* -----------------------------------------
       ANIMATION STATE
    ----------------------------------------- */

    let animationRunning = false;


    /* -----------------------------------------
       RESET ANIMATION
    ----------------------------------------- */

    function resetDiagramAnimation() {

        cells.classList.remove("is-visible");
        ecm.classList.remove("is-visible");
        result.classList.remove("is-visible");

        animationRunning = false;
    }


    /* -----------------------------------------
       PLAY ANIMATION
    ----------------------------------------- */

    function playDiagramAnimation() {

        if (animationRunning) return;

        animationRunning = true;


        /* Make sure we start from hidden state */

        cells.classList.remove("is-visible");
        ecm.classList.remove("is-visible");
        result.classList.remove("is-visible");


        /* ---------------------------------
           STEP 1
           Cells
        --------------------------------- */

        setTimeout(() => {

            cells.classList.add("is-visible");

        }, 100);


        /* ---------------------------------
           STEP 2
           ECM
        --------------------------------- */

        setTimeout(() => {

            ecm.classList.add("is-visible");

        }, 500);


        /* ---------------------------------
           STEP 3
           Result
        --------------------------------- */

        setTimeout(() => {

            result.classList.add("is-visible");

        }, 1000);

    }


    /* -----------------------------------------
       INTERSECTION OBSERVER
    ----------------------------------------- */

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    /* ---------------------------------
                       ENTER VIEWPORT
                    --------------------------------- */

                    if (entry.isIntersecting) {

                        playDiagramAnimation();

                    }

                    /* ---------------------------------
                       LEAVE VIEWPORT
                    --------------------------------- */

                    else {

                        resetDiagramAnimation();

                    }

                });

            },
            {
                threshold: 0.25
            }
        );


    /* -----------------------------------------
       START OBSERVING
    ----------------------------------------- */

    observer.observe(diagram);

}

/* =========================================================
   DIAGRAM 2
   ANATOMICAL MICROSTRUCTURE REPEATING SCROLL ANIMATION
   ---------------------------------------------------------
   Sequence:
   1. Ground substance
   2. Collagen fibers
   3. Elastic fibers
   4. Reticular network
   5. Cells + nuclei
   6. Labels
   7. Key structural idea

   Animation replays every time the diagram
   leaves and re-enters the viewport.
   ========================================================= */

function initConnectiveMicrostructureAnimation() {

    const diagrams =
        document.querySelectorAll(
            ".ct-lesson .ct-microstructure-diagram"
        );

    if (!diagrams.length) return;


    diagrams.forEach(diagram => {

        const ground =
            diagram.querySelector(
                ".micro-ground-substance"
            );

        const collagen =
            diagram.querySelector(
                ".micro-collagen"
            );

        const elastic =
            diagram.querySelector(
                ".micro-elastic"
            );

        const reticular =
            diagram.querySelector(
                ".micro-reticular"
            );

        const cells =
            diagram.querySelector(
                ".micro-cells"
            );

        const labels =
            diagram.querySelector(
                ".micro-labels"
            );

        const highlight =
            diagram.querySelector(
                ".highlight-box"
            );


        /* =================================================
           ANIMATED PARTS
        ================================================= */

        const animatedParts = [
            ground,
            collagen,
            elastic,
            reticular,
            cells,
            labels,
            highlight
        ].filter(Boolean);


        /* =================================================
           ANIMATION TIMERS
        ================================================= */

        let animationTimers = [];


        /* =================================================
           RESET
           -------------------------------------------------
           Completely returns the diagram to its
           initial hidden state.
        ================================================= */

        function resetAnimation() {

            /* Cancel previous timers */

            animationTimers.forEach(timer => {
                clearTimeout(timer);
            });

            animationTimers = [];


            /* Remove reveal state */

            animatedParts.forEach(part => {

                part.classList.remove(
                    "micro-reveal"
                );

                part.classList.add(
                    "micro-animation-hidden"
                );

            });

        }


        /* =================================================
           PLAY
        ================================================= */

        function playAnimation() {

            /*
             * Always begin from a clean state.
             */

            resetAnimation();


            /*
             * STEP 1
             * Ground Substance
             */

            animationTimers.push(
                setTimeout(() => {

                    if (ground) {

                        ground.classList.add(
                            "micro-reveal"
                        );

                    }

                }, 100)
            );


            /*
             * STEP 2
             * Collagen Fibers
             */

            animationTimers.push(
                setTimeout(() => {

                    if (collagen) {

                        collagen.classList.add(
                            "micro-reveal"
                        );

                    }

                }, 550)
            );


            /*
             * STEP 3
             * Elastic Fibers
             */

            animationTimers.push(
                setTimeout(() => {

                    if (elastic) {

                        elastic.classList.add(
                            "micro-reveal"
                        );

                    }

                }, 1000)
            );


            /*
             * STEP 4
             * Reticular Network
             */

            animationTimers.push(
                setTimeout(() => {

                    if (reticular) {

                        reticular.classList.add(
                            "micro-reveal"
                        );

                    }

                }, 1450)
            );


            /*
             * STEP 5
             * Cells
             */

            animationTimers.push(
                setTimeout(() => {

                    if (cells) {

                        cells.classList.add(
                            "micro-reveal"
                        );

                    }

                }, 1900)
            );


            /*
             * STEP 6
             * Labels
             */

            animationTimers.push(
                setTimeout(() => {

                    if (labels) {

                        labels.classList.add(
                            "micro-reveal"
                        );

                    }

                }, 2350)
            );


            /*
             * STEP 7
             * Key Structural Idea
             */

            animationTimers.push(
                setTimeout(() => {

                    if (highlight) {

                        highlight.classList.add(
                            "micro-reveal"
                        );

                    }

                }, 2750)
            );

        }


        /* =================================================
           INITIAL STATE
        ================================================= */

        resetAnimation();


        /* =================================================
           INTERSECTION OBSERVER
        ================================================= */

        const observer =
            new IntersectionObserver(

                entries => {

                    entries.forEach(entry => {


                        /* ---------------------------------
                           ENTER VIEWPORT
                        --------------------------------- */

                        if (entry.isIntersecting) {

                            playAnimation();

                        }


                        /* ---------------------------------
                           LEAVE VIEWPORT
                        --------------------------------- */

                        else {

                            resetAnimation();

                        }

                    });

                },

                {
                    threshold: 0.25
                }

            );


        /* =================================================
           START OBSERVING
        ================================================= */

        observer.observe(diagram);

    });

}


        

/* =========================================================
   INITIALIZE DIAGRAM 2 ANIMATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initConnectiveMicrostructureAnimation
);

/* =========================================================
   DIAGRAM 2 — STROKE DRAW ANIMATION
   ---------------------------------------------------------
   Replays every time the diagram leaves and re-enters
   the viewport.
   ========================================================= */

function initConnectiveStrokeDrawAnimation() {

    const diagrams =
        document.querySelectorAll(
            ".ct-anatomical-diagram"
        );

    if (!diagrams.length) return;


    diagrams.forEach(diagram => {

        const paths =
            diagram.querySelectorAll(
                ".collagen-fiber, " +
                ".elastic-fiber, " +
                ".ground-substance, " +
                ".reticular-network path"
            );

        if (!paths.length) return;


        /* -------------------------------------------------
           Prepare every SVG path
           ------------------------------------------------- */

        function resetPaths() {

            paths.forEach(path => {

                try {

                    const length =
                        path.getTotalLength();

                    path.style.strokeDasharray =
                        `${length} ${length}`;

                    path.style.strokeDashoffset =
                        length;

                } catch (error) {

                    /* Ignore invalid paths safely */

                }

            });

        }

    });

}

/* =========================================================
   DIAGRAM 3 — THREE MAJOR PROTEIN FIBERS
   ---------------------------------------------------------
   Stroke Draw Animation

   Sequence:
   1. Collagen
   2. Elastic
   3. Reticular

   Replays every time the diagram
   leaves and re-enters the viewport.
   ========================================================= */

function initFiber3StrokeDraw() {

    const diagrams =
        document.querySelectorAll(
            ".ct-lesson .ct-fiber-diagram"
        );

    if (!diagrams.length) return;


    diagrams.forEach(diagram => {

        const paths =
            diagram.querySelectorAll(
                ".fiber3-collagen path, " +
                ".fiber3-elastic path, " +
                ".fiber3-reticular path"
            );

        if (!paths.length) return;


        /* -----------------------------------------
           GET PATH LENGTH
           ----------------------------------------- */

        function preparePaths() {

            paths.forEach(path => {

                try {

                    const length =
                        path.getTotalLength();

                    path.style.strokeDasharray =
                        `${length} ${length}`;

                    path.style.strokeDashoffset =
                        length;

                } catch (error) {

                    console.warn(
                        "Fiber 3 path error:",
                        error
                    );

                }

            });

        }


        /* -----------------------------------------
           RESET
           ----------------------------------------- */

        function resetAnimation() {

            paths.forEach(path => {

                try {

                    const length =
                        path.getTotalLength();

                    /*
                     * Disable transition only
                     * while resetting.
                     */

                    path.style.transition = "none";

                    path.style.strokeDasharray =
                        `${length} ${length}`;

                    path.style.strokeDashoffset =
                        length;

                    path.style.transitionDelay =
                        "0ms";

                } catch (error) {}

            });

            diagram.classList.remove(
                "fiber3-drawing"
            );

        }


        /* -----------------------------------------
           PLAY
           ----------------------------------------- */

        function playAnimation() {

            /*
             * Start completely from the beginning.
             */

            resetAnimation();


            /*
             * Force browser to commit
             * the reset state.
             */

            void diagram.offsetWidth;


            /*
             * VERY IMPORTANT:
             *
             * Remove the inline
             * transition:none
             *
             * Otherwise CSS transition
             * can never run.
             */

            paths.forEach(path => {

                path.style.transition = "";

            });


            /*
             * Start next frame.
             */

            requestAnimationFrame(() => {

                diagram.classList.add(
                    "fiber3-drawing"
                );


                /* ---------------------------------
                   COLLAGEN
                   --------------------------------- */

                diagram
                    .querySelectorAll(
                        ".fiber3-collagen path"
                    )
                    .forEach(path => {

                        path.style.transitionDelay =
                            "0ms";

                        path.style.strokeDashoffset =
                            "0";

                    });


                /* ---------------------------------
                   ELASTIC
                   --------------------------------- */

                diagram
                    .querySelectorAll(
                        ".fiber3-elastic path"
                    )
                    .forEach(path => {

                        path.style.transitionDelay =
                            "350ms";

                        path.style.strokeDashoffset =
                            "0";

                    });


                /* ---------------------------------
                   RETICULAR
                   --------------------------------- */

                diagram
                    .querySelectorAll(
                        ".fiber3-reticular path"
                    )
                    .forEach(path => {

                        path.style.transitionDelay =
                            "700ms";

                        path.style.strokeDashoffset =
                            "0";

                    });

            });

        }


        /* -----------------------------------------
           INITIAL STATE
           ----------------------------------------- */

        preparePaths();
        resetAnimation();


        /* -----------------------------------------
           INTERSECTION OBSERVER
           ----------------------------------------- */

        const observer =
            new IntersectionObserver(

                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            /*
                             * Diagram entered viewport
                             */

                            playAnimation();

                        } else {

                            /*
                             * Diagram left viewport
                             * → reset for next entry
                             */

                            resetAnimation();

                        }

                    });

                },

                {
                    threshold: 0.25
                }

            );


        observer.observe(diagram);

    });

}


/* =========================================================
   INITIALIZE DIAGRAM 3
   ========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initFiber3StrokeDraw
    );

} else {

    initFiber3StrokeDraw();

}

/* =========================================================
   DIAGRAM 4 — SEQUENTIAL REVEAL + STROKE DRAW
   ---------------------------------------------------------
   Sequence:

   1. Diagram fades in
   2. Collagen fibers draw
   3. Elastic fibers draw
   4. Cells appear
   5. Labels appear

   Replays on every viewport entry.
   ========================================================= */

function initDiagram4ContentAnimation() {

    const diagram =
        document.querySelector(".ct-ground-diagram");

    if (!diagram) return;


    const content =
        diagram.querySelector(".diagram4-content");

    if (!content) return;


    /* ---------------------------------------------------------
       ELEMENTS
       --------------------------------------------------------- */

    const collagen =
        content.querySelectorAll(
            ".fiber4-collagen path"
        );

    const elastic =
        content.querySelectorAll(
            ".fiber4-elastic path"
        );

    const cells =
        content.querySelector(
            ".fiber4-cells"
        );

    const labels =
        content.querySelectorAll(
            ".diagram4-ground-label, " +
            ".diagram4-ground-label-small, " +
            ".diagram4-relationship"
        );


    let timers = [];


    /* ---------------------------------------------------------
       PREPARE PATH
       --------------------------------------------------------- */

    function preparePath(path) {

        try {

            const length =
                path.getTotalLength();

            path.style.transition = "none";

            path.style.strokeDasharray =
                `${length} ${length}`;

            path.style.strokeDashoffset =
                length;

            path.style.opacity = "0";

        } catch (error) {

            console.warn(
                "Diagram 4 path preparation error:",
                error
            );

        }

    }


    /* ---------------------------------------------------------
       PREPARE ALL PATHS
       --------------------------------------------------------- */

    collagen.forEach(preparePath);
    elastic.forEach(preparePath);


    /* ---------------------------------------------------------
       RESET
       --------------------------------------------------------- */

    function resetAnimation() {

        /* Cancel timers */

        timers.forEach(timer => {
            clearTimeout(timer);
        });

        timers = [];


        /* Main content */

        content.classList.remove(
            "is-visible"
        );


        /* Collagen */

        collagen.forEach(path => {

            preparePath(path);

        });


        /* Elastic */

        elastic.forEach(path => {

            preparePath(path);

        });


        /* Cells */

        if (cells) {

            cells.style.transition = "none";
            cells.style.opacity = "0";
            cells.style.transform =
                "scale(0.88)";

        }


        /* Labels */

        labels.forEach(label => {

            label.style.transition = "none";
            label.style.opacity = "0";
            label.style.transform =
                "translateY(8px)";

        });

    }


    /* ---------------------------------------------------------
       PLAY
       --------------------------------------------------------- */

    function playAnimation() {

        resetAnimation();


        /* =====================================================
           STEP 1
           MAIN DIAGRAM
           ===================================================== */

        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                content.classList.add(
                    "is-visible"
                );

            });

        });


        /* =====================================================
           STEP 2
           COLLAGEN
           ===================================================== */

        timers.push(

            setTimeout(() => {

                collagen.forEach(
                    (path, index) => {

                        path.style.opacity = "1";

                        path.style.transition =
                            "stroke-dashoffset 1.05s " +
                            "cubic-bezier(0.65, 0, 0.35, 1)";

                        path.style.transitionDelay =
                            `${index * 120}ms`;

                        path.style.strokeDashoffset =
                            "0";

                    }
                );

            }, 350)

        );


        /* =====================================================
           STEP 3
           ELASTIC
           ===================================================== */

        timers.push(

            setTimeout(() => {

                elastic.forEach(
                    (path, index) => {

                        path.style.opacity = "1";

                        path.style.transition =
                            "stroke-dashoffset 1.05s " +
                            "cubic-bezier(0.65, 0, 0.35, 1)";

                        path.style.transitionDelay =
                            `${index * 140}ms`;

                        path.style.strokeDashoffset =
                            "0";

                    }
                );

            }, 1150)

        );


        /* =====================================================
           STEP 4
           CELLS
           ===================================================== */

        timers.push(

            setTimeout(() => {

                if (!cells) return;

                cells.style.transition =
                    "opacity 500ms ease, " +
                    "transform 500ms " +
                    "cubic-bezier(0.22, 1, 0.36, 1)";

                cells.style.opacity = "1";

                cells.style.transform =
                    "scale(1)";

            }, 1850)

        );


        /* =====================================================
           STEP 5
           LABELS
           ===================================================== */

        timers.push(

            setTimeout(() => {

                labels.forEach(label => {

                    label.style.transition =
                        "opacity 450ms ease, " +
                        "transform 450ms ease";

                    label.style.opacity = "1";

                    label.style.transform =
                        "translateY(0)";

                });

            }, 2200)

        );

    }


    /* ---------------------------------------------------------
       INITIAL RESET
       --------------------------------------------------------- */

    resetAnimation();


    /* ---------------------------------------------------------
       INTERSECTION OBSERVER
       --------------------------------------------------------- */

    const observer =
        new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        playAnimation();

                    } else {

                        resetAnimation();

                    }

                });

            },

            {
                threshold: 0.25
            }

        );


    /* ---------------------------------------------------------
       OBSERVE
       --------------------------------------------------------- */

    observer.observe(diagram);

}


/* =========================================================
   INITIALIZE DIAGRAM 4
   ========================================================= */

initDiagram4ContentAnimation();


/* =========================================================
   DIAGRAM 5
   CONNECTIVE TISSUE CLASSIFICATION
   SYNCHRONIZED REVEAL ANIMATION
   ---------------------------------------------------------
   Sequence:

   1. Diagram container appears
   2. Root box fades in
   3. Main connector lines draw
   4. Major group boxes fade in
   5. Child connector lines finish drawing
   6. Child boxes fade in
   7. Summary fades in

   Replays every time Diagram 5 enters viewport.
   ========================================================= */

(function () {

    const diagram5 =
        document.querySelector(".diagram5-svg");

    if (!diagram5) return;


    /* -------------------------------------------------------
       ELEMENTS
       ------------------------------------------------------- */

    const root =
        diagram5.querySelector(".diagram5-root");

    const connectors = [
        ...diagram5.querySelectorAll(
            ".diagram5-connector"
        )
    ];

    const majorNodes = [
        ...diagram5.querySelectorAll(
            ".diagram5-major"
        )
    ];

    const childNodes = [
        ...diagram5.querySelectorAll(
            ".diagram5-child"
        )
    ];

    const summary =
        diagram5.querySelector(".diagram5-summary");


    /* -------------------------------------------------------
       TIMERS
       ------------------------------------------------------- */

    let timers = [];


    /* -------------------------------------------------------
       RESET
       ------------------------------------------------------- */

    function resetDiagram5() {

        /* Cancel pending timers */

        timers.forEach(function (timer) {
            clearTimeout(timer);
        });

        timers = [];


        /* Reset main SVG */

        diagram5.classList.remove(
            "diagram5-visible"
        );


        /* Reset root */

        if (root) {
            root.classList.remove(
                "diagram5-show"
            );
        }


        /* Reset connector drawing */

        connectors.forEach(function (line) {

            line.classList.remove(
                "diagram5-draw"
            );

        });


        /* Reset major groups */

        majorNodes.forEach(function (node) {

            node.classList.remove(
                "diagram5-show"
            );

        });


        /* Reset child groups */

        childNodes.forEach(function (node) {

            node.classList.remove(
                "diagram5-show"
            );

        });


        /* Reset summary */

        if (summary) {

            summary.classList.remove(
                "diagram5-show"
            );

        }

    }


    /* -------------------------------------------------------
       PLAY
       ------------------------------------------------------- */

    function playDiagram5() {

        /* Always start clean */

        resetDiagram5();


        /* ---------------------------------------------------
           STEP 0
           Main SVG appears
           --------------------------------------------------- */

        requestAnimationFrame(function () {

            requestAnimationFrame(function () {

                diagram5.classList.add(
                    "diagram5-visible"
                );

            });

        });


        /* ---------------------------------------------------
           STEP 1
           ROOT
           --------------------------------------------------- */

        timers.push(

            setTimeout(function () {

                if (root) {

                    root.classList.add(
                        "diagram5-show"
                    );

                }

            }, 300)

        );


        /* ---------------------------------------------------
           STEP 2
           CONNECTOR DRAW

           Start after root.
           Each connector draws sequentially.
           --------------------------------------------------- */

        timers.push(

            setTimeout(function () {

                connectors.forEach(
                    function (line, index) {

                        timers.push(

                            setTimeout(function () {

                                line.classList.add(
                                    "diagram5-draw"
                                );

                            }, index * 90)

                        );

                    }
                );

            }, 650)

        );


        /* ---------------------------------------------------
           STEP 3
           MAJOR GROUPS

           Appear shortly after their branch begins drawing.
           --------------------------------------------------- */

        timers.push(

            setTimeout(function () {

                majorNodes.forEach(
                    function (node, index) {

                        timers.push(

                            setTimeout(function () {

                                node.classList.add(
                                    "diagram5-show"
                                );

                            }, index * 170)

                        );

                    }
                );

            }, 1050)

        );


        /* ---------------------------------------------------
           STEP 4
           CHILD NODES

           Appear after the lower branches have been drawn.
           --------------------------------------------------- */

        timers.push(

            setTimeout(function () {

                childNodes.forEach(
                    function (node, index) {

                        timers.push(

                            setTimeout(function () {

                                node.classList.add(
                                    "diagram5-show"
                                );

                            }, index * 120)

                        );

                    }
                );

            }, 1750)

        );


        /* ---------------------------------------------------
           STEP 5
           SUMMARY
           --------------------------------------------------- */

        timers.push(

            setTimeout(function () {

                if (summary) {

                    summary.classList.add(
                        "diagram5-show"
                    );

                }

            }, 2750)

        );

    }


    /* -------------------------------------------------------
       INITIAL STATE
       ------------------------------------------------------- */

    resetDiagram5();


    /* -------------------------------------------------------
       INTERSECTION OBSERVER

       Leave viewport
       → reset completely

       Re-enter viewport
       → play from beginning
       ------------------------------------------------------- */

    const observer =
        new IntersectionObserver(

            function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        playDiagram5();

                    } else {

                        resetDiagram5();

                    }

                });

            },

            {
                threshold: 0.30
            }

        );


    observer.observe(diagram5);


})();

/* =========================================================
   DIAGRAM 6
   FIVE CORE FUNCTIONS
   CONNECTOR DRAW ANIMATION
   FINAL WORKING VERSION
   ========================================================= */

(function () {

    function initDiagram6ConnectorAnimation() {

        const diagram6 =
            document.querySelector(".diagram6-svg");

        if (!diagram6) return;


        /* -----------------------------------------------------
           GET CONNECTOR LINES
           ----------------------------------------------------- */

        const connectors = [
            ...diagram6.querySelectorAll(
                ".diagram6-connector"
            )
        ];

        if (!connectors.length) return;


        /* -----------------------------------------------------
           PREPARE
           ----------------------------------------------------- */

        function prepareLines() {

            connectors.forEach(line => {

                try {

                    const length =
                        line.getTotalLength();

                    line.style.strokeDasharray =
                        `${length} ${length}`;

                    line.style.strokeDashoffset =
                        length;

                } catch (error) {}

            });

        }


        /* -----------------------------------------------------
           RESET
           ----------------------------------------------------- */

        function resetLines() {

            connectors.forEach(line => {

                try {

                    const length =
                        line.getTotalLength();

                    /*
                     * No animation during reset.
                     */

                    line.style.transition = "none";

                    line.style.strokeDasharray =
                        `${length} ${length}`;

                    line.style.strokeDashoffset =
                        length;

                } catch (error) {}

            });


            /*
             * Force browser to apply hidden state.
             */

            void diagram6.offsetWidth;


            /*
             * Restore drawing transition.
             */

            connectors.forEach(line => {

                line.style.transition =
                    "stroke-dashoffset 750ms " +
                    "cubic-bezier(0.65, 0, 0.35, 1)";

            });

        }


        /* -----------------------------------------------------
           PLAY
           ----------------------------------------------------- */

        function playLines() {

            resetLines();


            connectors.forEach((line, index) => {

                setTimeout(() => {

                    try {

                        /*
                         * IMPORTANT:
                         *
                         * Animate the INLINE property directly.
                         * This avoids the CSS/class priority conflict.
                         */

                        line.style.strokeDashoffset = "0";

                    } catch (error) {}

                }, index * 180);

            });

        }


        /* -----------------------------------------------------
           INITIAL STATE
           ----------------------------------------------------- */

        prepareLines();

        resetLines();


        /* -----------------------------------------------------
           INTERSECTION OBSERVER
           ----------------------------------------------------- */

        const observer =
            new IntersectionObserver(

                entries => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            playLines();

                        } else {

                            resetLines();

                        }

                    });

                },

                {
                    threshold: 0.30
                }

            );


        /* -----------------------------------------------------
           START
           ----------------------------------------------------- */

        observer.observe(diagram6);

    }


    /* ---------------------------------------------------------
       SAFE INITIALIZATION
       --------------------------------------------------------- */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initDiagram6ConnectorAnimation
        );

    } else {

        initDiagram6ConnectorAnimation();

    }

})();

/* =========================================================
   DIAGRAM 6
   STEP 2 — NODE REVEAL ANIMATION

   Independent from connector drawing animation.
   Does NOT modify connector paths.
   Replays when Diagram 6 enters viewport.
   ========================================================= */

(function () {

    function initDiagram6NodeReveal() {

        const diagram6 =
            document.querySelector(".diagram6-svg");

        if (!diagram6) return;


        /* -----------------------------------------------------
           NODE GROUPS
           ----------------------------------------------------- */

        const hub =
            diagram6.querySelector(".diagram6-hub");

        const support =
            diagram6.querySelector(".diagram6-support");

        const connect =
            diagram6.querySelector(".diagram6-connect");

        const protect =
            diagram6.querySelector(".diagram6-protect");

        const store =
            diagram6.querySelector(".diagram6-store");

        const transport =
            diagram6.querySelector(".diagram6-transport");

        const memory =
            diagram6.querySelector(".diagram6-memory");


        const nodes = [
            hub,
            support,
            connect,
            protect,
            store,
            transport,
            memory
        ].filter(Boolean);


        if (!nodes.length) return;


        /* -----------------------------------------------------
           PREPARE
           ----------------------------------------------------- */

        nodes.forEach(node => {

            node.classList.add(
                "diagram6-node-reveal"
            );

            node.classList.remove(
                "diagram6-node-visible"
            );

        });


        /* -----------------------------------------------------
           RESET
           ----------------------------------------------------- */

        function resetNodes() {

            nodes.forEach(node => {

                node.classList.remove(
                    "diagram6-node-visible"
                );

            });

        }


        /* -----------------------------------------------------
           PLAY
           ----------------------------------------------------- */

        function playNodes() {

            resetNodes();


            /*
             * Force browser to commit
             * the hidden state.
             */

            void diagram6.offsetWidth;


            /*
             * Reveal sequence.
             *
             * 0ms    → Center
             * 180ms  → Support
             * 360ms  → Connect
             * 540ms  → Protect
             * 720ms  → Store
             * 900ms  → Transport
             * 1120ms → Memory
             */

            const sequence = [

                [hub,       0],

                [support,  180],

                [connect,  360],

                [protect,  540],

                [store,    720],

                [transport, 900],

                [memory,  1120]

            ];


            sequence.forEach(([node, delay]) => {

                if (!node) return;

                setTimeout(() => {

                    node.classList.add(
                        "diagram6-node-visible"
                    );

                }, delay);

            });

        }


        /* -----------------------------------------------------
           INITIAL STATE
           ----------------------------------------------------- */

        resetNodes();


        /* -----------------------------------------------------
           VIEWPORT OBSERVER
           ----------------------------------------------------- */

        const observer =
            new IntersectionObserver(

                entries => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            playNodes();

                        } else {

                            resetNodes();

                        }

                    });

                },

                {
                    threshold: 0.30
                }

            );


        observer.observe(diagram6);

    }


    /* ---------------------------------------------------------
       SAFE INITIALIZATION
       --------------------------------------------------------- */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initDiagram6NodeReveal
        );

    } else {

        initDiagram6NodeReveal();

    }

})();

