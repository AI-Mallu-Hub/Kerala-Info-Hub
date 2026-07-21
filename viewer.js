const params = new URLSearchParams(window.location.search);

const file = params.get("file");

const viewer = document.getElementById("pdfViewer");

if(file){

    viewer.src = decodeURIComponent(file);

}

document
.getElementById("backBtn")
.addEventListener("click",()=>{

    history.back();

});
