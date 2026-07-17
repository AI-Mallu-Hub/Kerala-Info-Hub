
const btn=document.getElementById('themeBtn');
btn.onclick=()=>document.body.classList.toggle('light');
const s=document.getElementById('search');
s.oninput=()=>{
 const q=s.value.toLowerCase();
 document.querySelectorAll('.card').forEach(c=>{
   c.style.display=c.innerText.toLowerCase().includes(q)?'block':'none';
 });
};
