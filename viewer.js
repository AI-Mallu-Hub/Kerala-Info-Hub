const params = new URLSearchParams(window.location.search);
const file = params.get("file");

const canvas = document.getElementById("pdfCanvas");
const ctx = canvas.getContext("2d");
const pageNumber = document.getElementById("pageNumber");

let pdfDoc = null;
let pageNum = 1;
const scale = 1.5;

document.getElementById("backBtn").addEventListener("click", () => {
    history.back();
});

if (!file) {
    document.body.innerHTML = "<h2 style='padding:20px'>No PDF file specified.</h2>";
    throw new Error("No PDF file specified.");
}

async function renderPage(num) {
    const page = await pdfDoc.getPage(num);

    const viewport = page.getViewport({ scale });

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
        canvasContext: ctx,
        viewport: viewport
    }).promise;
    pageNumber.textContent =
`Page ${pageNum} / ${pdfDoc.numPages}`;
}

async function loadPDF() {
    try {
        pdfDoc = await pdfjsLib.getDocument(decodeURIComponent(file)).promise;

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
