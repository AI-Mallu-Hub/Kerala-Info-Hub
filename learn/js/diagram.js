window.addEventListener("DOMContentLoaded", loadDiagram);

async function loadDiagram(){

const container=document.getElementById("cell-diagram");

if(!container){

console.error("Container not found");

return;

}

try{

const response=await fetch("../../assets/svg/cell.svg");

const svgText=await response.text();

container.innerHTML=svgText;

console.log("SVG Loaded Successfully");

}
catch(error){

container.innerHTML=`

<p style="color:red;text-align:center">

Unable to load diagram.

</p>

`;

console.error(error);

}

}
