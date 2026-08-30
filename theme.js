/* =========================================================
   Kerala Info Hub
   Global Theme Engine
   ========================================================= */

(function () {

    "use strict";

    const STORAGE_KEY = "kih-theme";
    const DARK_THEME = "dark";
    const LIGHT_THEME = "light";

    const root = document.documentElement;

/* -------------------------------------------------------
   Apply saved theme immediately
   Prevent theme flash / incorrect initial state
   ------------------------------------------------------- */

const savedTheme =
    localStorage.getItem(STORAGE_KEY);

if (
    savedTheme === DARK_THEME ||
    savedTheme === LIGHT_THEME
) {
    root.setAttribute("data-theme", savedTheme);
}

    /* -------------------------------------------------------
       Apply Theme
       ------------------------------------------------------- */

    function applyTheme(theme) {

        const selectedTheme =
            theme === DARK_THEME
                ? DARK_THEME
                : LIGHT_THEME;

        root.setAttribute("data-theme", selectedTheme);

        updateThemeButtons(selectedTheme);
    }


    /* -------------------------------------------------------
       Update Theme Buttons
       ------------------------------------------------------- */

    function updateThemeButtons(theme) {

        const buttons =
            document.querySelectorAll("#themeBtn, [data-theme-toggle]");

        buttons.forEach(function (button) {

            if (theme === DARK_THEME) {

                button.textContent = "☀️";
                button.setAttribute(
                    "aria-label",
                    "Switch to light mode"
                );
                button.setAttribute(
                    "title",
                    "Switch to light mode"
                );

            } else {

                button.textContent = "🌙";
                button.setAttribute(
                    "aria-label",
                    "Switch to dark mode"
                );
                button.setAttribute(
                    "title",
                    "Switch to dark mode"
                );

            }

        });
    }


    /* -------------------------------------------------------
       Get Saved Theme
       ------------------------------------------------------- */

    function getSavedTheme() {

        const savedTheme =
            localStorage.getItem(STORAGE_KEY);

        if (
            savedTheme === DARK_THEME ||
            savedTheme === LIGHT_THEME
        ) {
            return savedTheme;
        }

        return LIGHT_THEME;
    }


    /* -------------------------------------------------------
       Toggle Theme
       ------------------------------------------------------- */

    function toggleTheme() {

        const currentTheme =
            root.getAttribute("data-theme") ||
            LIGHT_THEME;

        const newTheme =
            currentTheme === DARK_THEME
                ? LIGHT_THEME
                : DARK_THEME;

        localStorage.setItem(
            STORAGE_KEY,
            newTheme
        );

        applyTheme(newTheme);
    }


   /* -------------------------------------------------------
   Initialize
   ------------------------------------------------------- */

function initTheme() {

    const savedTheme = getSavedTheme();

    applyTheme(savedTheme);


    document.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    "#themeBtn, [data-theme-toggle]"
                );

            if (!button) {
                return;
            }

            toggleTheme();

        }
    );

}


/* -------------------------------------------------------
   Public API
   ------------------------------------------------------- */

window.KIHTheme = {

    getTheme: function () {
        return root.getAttribute("data-theme");
    },

    setTheme: function (theme) {

        if (
            theme !== DARK_THEME &&
            theme !== LIGHT_THEME
        ) {
            return;
        }

        localStorage.setItem(
            STORAGE_KEY,
            theme
        );

        applyTheme(theme);
    },

    toggle: toggleTheme

};


/* -------------------------------------------------------
   Start
   ------------------------------------------------------- */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initTheme
    );

} else {

    initTheme();

}
})();