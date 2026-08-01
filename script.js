
const btn=document.getElementById('themeBtn');
btn.onclick=()=>document.body.classList.toggle('light');
const s=document.getElementById('search');
s.oninput=()=>{
 const q=s.value.toLowerCase();
 document.querySelectorAll('.card').forEach(c=>{
   c.style.display=c.innerText.toLowerCase().includes(q)?'block':'none';
 });
};
if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker.register("/Kerala-Info-Hub/sw.js")
            .then(() => {

                console.log("Service Worker Registered");

            })
            .catch(err => {

                console.error(err);

            });

    });

}
let deferredPrompt;

const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {

    e.preventDefault();

    deferredPrompt = e;

    installBtn.hidden = false;

});

installBtn.addEventListener("click", async () => {

    installBtn.hidden = true;

    deferredPrompt.prompt();

    const choice = await deferredPrompt.userChoice;

    deferredPrompt = null;

});

window.addEventListener("appinstalled", () => {

    installBtn.hidden = true;

    console.log("Kerala Info Hub Installed");

});
