
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
let newWorker;

if ("serviceWorker" in navigator) {

    navigator.serviceWorker.register("sw.js").then(registration => {

        registration.addEventListener("updatefound", () => {

            newWorker = registration.installing;

            newWorker.addEventListener("statechange", () => {

                if (

                    newWorker.state === "installed" &&

                    navigator.serviceWorker.controller

                ) {

                    document.getElementById("updateCard").hidden = false;

                }

            });

        });

    });

}
let deferredPrompt;

const installBtn = document.getElementById("installBtn");
const installCard = document.getElementById("installCard");

window.addEventListener("beforeinstallprompt", (e) => {

    e.preventDefault();

    deferredPrompt = e;

    installCard.hidden = false;

});

installBtn.addEventListener("click", async () => {

    installCard.hidden = true;

    deferredPrompt.prompt();

    await deferredPrompt.userChoice;

    deferredPrompt = null;

});

window.addEventListener("appinstalled", () => {

    installCard.hidden = true;

    console.log("Kerala Info Hub Installed");

});

document.getElementById("updateBtn").onclick = () => {

    if (newWorker) {

        newWorker.postMessage({

            type: "SKIP_WAITING"

        });

    }

};
navigator.serviceWorker.addEventListener("controllerchange", () => {

    window.location.reload();

});
