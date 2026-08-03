
window.addEventListener("load",()=>{

const svgObject=document.getElementById("cell-svg");

if(!svgObject)return;

svgObject.addEventListener("load",()=>{

const svg=svgObject.contentDocument;

const nucleus=svg.getElementById("nucleus");

const nucleolus=svg.getElementById("nucleolus");

if(nucleus){

nucleus.addEventListener("click",()=>{

alert("🟣 Nucleus\n\nControls all activities of the cell.\n\nContains DNA.");

});

}

if(nucleolus){

nucleolus.addEventListener("click",()=>{

alert("🟣 Nucleolus\n\nProduces ribosomes.");

});

}

});

});
