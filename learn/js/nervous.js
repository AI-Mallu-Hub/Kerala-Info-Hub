/* =========================================================
   NERVOUS TISSUE
   DIAGRAM 01 — SCROLL REPLAY ANIMATION
   ========================================================= */


/* =========================================================
   WAIT FOR DOM
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       DIAGRAM 01 ELEMENT
       ===================================================== */

    const diagram =
        document.getElementById(
            "nervous-tissue-overview-diagram"
        );


    /* =====================================================
       SAFETY CHECK
       ===================================================== */

    if (!diagram) {

        return;

    }


    /* =====================================================
       INTERSECTION OBSERVER
       ===================================================== */

    const observer =
        new IntersectionObserver(

            (entries) => {

                entries.forEach((entry) => {


                    /* =====================================
                       DIAGRAM ENTERS VIEWPORT
                       ===================================== */

                    if (entry.isIntersecting) {

                        /*
                         * Force a clean animation restart.
                         *
                         * Removing the class first resets
                         * the CSS animation state.
                         */

                        diagram.classList.remove(
                            "diagram01-animate"
                        );


                        /*
                         * Force browser reflow.
                         *
                         * This is important because without
                         * reflow the browser may treat the
                         * second class addition as the same
                         * animation instance.
                         */

                        void diagram.offsetWidth;


                        /*
                         * Start animation.
                         */

                        diagram.classList.add(
                            "diagram01-animate"
                        );

                    }


                    /* =====================================
                       DIAGRAM LEAVES VIEWPORT
                       ===================================== */

                    else {

                        /*
                         * Remove animation class.
                         *
                         * CSS returns the diagram to its
                         * initial hidden state.
                         */

                        diagram.classList.remove(
                            "diagram01-animate"
                        );

                    }

                });

            },

            {
                /*
                 * Animation starts when approximately
                 * 20% of the diagram enters the viewport.
                 */

                threshold: 0.20

            }

        );


    /* =====================================================
       START OBSERVING
       ===================================================== */

    observer.observe(diagram);


/* =========================================================
   DIAGRAM 02 — SCROLL REPLAY ANIMATION
   ========================================================= */


/* =====================================================
   DIAGRAM 02 ELEMENT
   ===================================================== */

const diagram02 =
    document.getElementById(
        "neuron-and-glia-diagram"
    );


/* =====================================================
   SAFETY CHECK
   ===================================================== */

if (diagram02) {


    /* =================================================
       INTERSECTION OBSERVER
       ================================================= */

    const diagram02Observer =
        new IntersectionObserver(

            (entries) => {

                entries.forEach((entry) => {


                    /* =====================================
                       DIAGRAM 02 ENTERS VIEWPORT
                       ===================================== */

                    if (entry.isIntersecting) {


                        /*
                         * Remove the animation class first.
                         * This guarantees a clean reset.
                         */

                        diagram02.classList.remove(
                            "diagram02-animate"
                        );


                        /*
                         * Force browser reflow so that the
                         * next class addition creates a fresh
                         * animation instance.
                         */

                        void diagram02.offsetWidth;


                        /*
                         * Start Diagram 02 animation.
                         */

                        diagram02.classList.add(
                            "diagram02-animate"
                        );

                    }


                    /* =====================================
                       DIAGRAM 02 LEAVES VIEWPORT
                       ===================================== */

                    else {


                        /*
                         * Remove the animation class.
                         *
                         * CSS returns the diagram to its
                         * initial hidden/reset state.
                         */

                        diagram02.classList.remove(
                            "diagram02-animate"
                        );

                    }

                });

            },

            {
                /*
                 * Start when approximately 20% of
                 * Diagram 02 enters the viewport.
                 */

                threshold: 0.20

            }

        );


    /* =================================================
       START OBSERVING DIAGRAM 02
       ================================================= */

    diagram02Observer.observe(
        diagram02
    );

}

});
