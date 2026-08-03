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
const organelles = {

mitochondria:"⚡ Mitochondria\n\nPowerhouse of the Cell.",

golgi:"📦 Golgi Apparatus\n\nPackages proteins.",

"rough-er":"🌊 Rough ER\n\nProtein synthesis.",

"smooth-er":"🌊 Smooth ER\n\nLipid synthesis.",

ribosomes:"⚫ Ribosomes\n\nProtein factories.",

lysosome:"🟡 Lysosome\n\nDigests waste materials.",

vacuole:"🔵 Vacuole\n\nStores water and nutrients.",

centrosome:"⭐ Centrosome\n\nHelps cell division."

};

Object.keys(organelles).forEach(id=>{

const el=svg.getElementById(id);

if(el){

el.addEventListener("click",()=>{

alert(organelles[id]);

});

}

});
.loading-diagram{

text-align:center;

padding:70px 20px;

font-size:18px;

color:#666;

}
