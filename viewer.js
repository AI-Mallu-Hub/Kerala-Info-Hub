const params = new URLSearchParams(window.location.search);
const file = params.get("file");

const canvas = document.getElementById("pdfCanvas");
const ctx = canvas.getContext("2d");
const pageNumber = document.getElementById("pageNumber");
const zoomSlider =
document.getElementById("zoomSlider");
const zoomValue =
document.getElementById("zoomValue");
const header = document.querySelector(".viewer-header");
const controls = document.querySelector(".viewer-controls");
const viewer = document.querySelector(".viewer-container");
const loadingOverlay = document.getElementById("loadingOverlay");

let controlsVisible = true;

let pdfDoc = null;
let pageNum = 1;
let baseScale = 1;
let zoomFactor = 1;
let touchStartX = 0;
let touchEndX = 0;

const SWIPE_THRESHOLD = 60;

function calculateAutoFit(page) {

    const container = document.querySelector(".viewer-container");

    const viewport = page.getViewport({ scale: 1 });

    const availableWidth = container.clientWidth - 20;
    const availableHeight = container.clientHeight - 20;

    const scaleX = availableWidth / viewport.width;
    const scaleY = availableHeight / viewport.height;

    return Math.min(scaleX, scaleY);
}

document.getElementById("backBtn").addEventListener("click", () => {
    history.back();
});

if (!file) {
    document.body.innerHTML = "<h2 style='padding:20px'>No PDF file specified.</h2>";
    throw new Error("No PDF file specified.");
}

async function renderPage(num) {
    showLoader();
    const page = await pdfDoc.getPage(num);

    const scale = baseScale * zoomFactor;

    const viewport = page.getViewport({ scale });

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
        canvasContext: ctx,
        viewport: viewport
    }).promise;
    hideLoader();
    const wrapper = document.querySelector(".pdf-wrapper");

if (zoomFactor === 1) {
    wrapper.style.justifyContent = "center";
    wrapper.style.alignItems = "center";
} else {
    wrapper.style.justifyContent = "flex-start";
    wrapper.style.alignItems = "flex-start";
        }
    pageNumber.textContent =
`Page ${pageNum} / ${pdfDoc.numPages}`;
}

async function loadPDF() {
    try {
        pdfDoc = await pdfjsLib.getDocument(decodeURIComponent(file)).promise;

      const firstPage = await pdfDoc.getPage(1);

baseScale = calculateAutoFit(firstPage);
        
        renderPage(pageNum);

    } catch (err) {

        console.error(err);

        document.body.innerHTML = `
            <div style="padding:20px;font-family:Arial">
                <h2>Unable to load PDF</h2>
                <p>${err.message}</p>
            </div>
        `;
    }
}

loadPDF();

document
.getElementById("nextPage")
.addEventListener("click",()=>{

    if(pageNum>=pdfDoc.numPages) return;

    pageNum++;

    renderPage(pageNum);

});

document
.getElementById("prevPage")
.addEventListener("click",()=>{

    if(pageNum<=1) return;

    pageNum--;

    renderPage(pageNum);

});
zoomSlider.addEventListener("input", () => {

    zoomFactor = Number(zoomSlider.value) / 100;
    zoomValue.textContent =
        `${zoomSlider.value}%`;

    renderPage(pageNum);

});

const fullscreenBtn = document.getElementById("fullscreenBtn");

fullscreenBtn.addEventListener("click", async () => {

    if (!document.fullscreenElement) {

        await document.documentElement.requestFullscreen();

    } else {

        await document.exitFullscreen();

    }

});

document.addEventListener("fullscreenchange", async () => {

    if (document.fullscreenElement) {

        header.style.display = "none";

        fullscreenBtn.textContent = "🡼";

    } else {
        controls.style.display = "block";
controlsVisible = true;

        header.style.display = "flex";

        fullscreenBtn.textContent = "⛶";

    }

    const firstPage = await pdfDoc.getPage(pageNum);

    baseScale = calculateAutoFit(firstPage);

    renderPage(pageNum);

});
viewer.addEventListener("click", () => {

    if (!document.fullscreenElement) return;
    if (event.target.closest(".viewer-controls")) return;

    controlsVisible = !controlsVisible;

    controls.style.display =
        controlsVisible ? "block" : "none";

});
viewer.addEventListener("touchstart", (event) => {

    touchStartX = event.changedTouches[0].clientX;

});
viewer.addEventListener("touchend", (event) => {

    touchEndX = event.changedTouches[0].clientX;
    
    if (zoomFactor > 1) {

    return;

    }

    const distance = touchEndX - touchStartX;

    if (Math.abs(distance) < SWIPE_THRESHOLD) return;

    // Right Swipe
    if (distance > 0) {

        if (pageNum > 1) {

            pageNum--;

            renderPage(pageNum);

        }

    }

    // Left Swipe
    else {

        if (pageNum < pdfDoc.numPages) {

            pageNum++;

            renderPage(pageNum);

        }

    }

});
function showLoader() {
    loadingOverlay.style.display = "flex";
}

function hideLoader() {
    loadingOverlay.style.display = "none";
}
