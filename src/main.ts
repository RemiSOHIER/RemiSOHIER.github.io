import { Vector2, Vector, CalculateDistance, Page, Star, Color } from "./objects";
import { Space } from "./canvasEffect"

import accueilHTML from "./pages/accueil.html?raw";
import erreurHTML from "./pages/erreur.html?raw";
import parcoursHTML from "./pages/parcours.html?raw";
import projetsHTML from "./pages/projets.html?raw";
import reseauxHTML from "./pages/réseaux.html?raw";
import mentionLegaleHTML from "./pages/mentions-légales.html?raw";
import contactHTML from "./pages/contact.html?raw";

const title = "Rémi SOHIER";

const destinationPanel = document.getElementById("destinationPanel")
const destinationPanelList = document.getElementById("destinationPanelList")
const destinationPageName = document.getElementById("destinationPageName")
const destinationsBar = document.getElementById("destinationsBar")
const menu = document.getElementById("menu")
const world = document.getElementById("world");
const pageHtml = document.getElementById("page");
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const isMobile = ():boolean=>{return window.matchMedia("(max-width: 768px)").matches;};

//#region Icon
const svgUrl = `https://api.iconify.design/material-symbols/planet-outline.svg?color=${encodeURIComponent("#659bff")}`;
let link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
}
link.type = "image/svg+xml";
link.href = svgUrl;
//#endregion Icon

if(world){
    globalThis.world = world;
}
if(destinationPanel){
    destinationPanel.addEventListener("click", ()=>{
        CloseMenu();
    })
}
let pageIsOpen:boolean = false;
//Optimized for [-10000:10000] coordinates maximum
globalThis.cameraPosition = new Vector2();
const spaceBackground:Space = new Space(canvas);
if(canvas){
    // spaceBackground.GenerateRandomStars();
}

Init();

async function Init() {
    const res = await fetch("/data/pageDestination.json");
    const pageDestination = await res.json();
    if (pageDestination == undefined)throw new Error("pages list not found");
    const pagesFound = Object.assign([], pageDestination.map((p: Page) => {
        const page = Object.assign(new Page(), p);
        page.star = new Star(
            p.star.position,
            p.star.temperature,
            p.star.intensity,
            p.star.color,
            p.star.radius
        );
        page.star.Init();
        switch (page.name) {
            case "Accueil":
                page.html = accueilHTML;
                break;
            case "Erreur":
                page.html = erreurHTML;
                break;
            case "Parcours":
                page.html = parcoursHTML;
                break;
            case "Projets":
                page.html = projetsHTML;
                break;
            case "Réseaux":
                page.html = reseauxHTML;
                break;
            case "Mentions-légales":
                page.html = mentionLegaleHTML;
                break;
            case "Contact":
                page.html = contactHTML;
                break;
            default:
                break;
        }
        return page;
    }));
    globalThis.pages = pagesFound;
    if(!destinationPanelList || !destinationsBar) return;
    destinationPanelList.innerHTML = "";
    destinationsBar.innerHTML = "";
    if(!world) return;
    GoTo(true);
    spaceBackground.GenerateStarPages();
    window.addEventListener("resize", () => {
        UpdageDestinationBar();
    });
}

/** @description Permet de définir le chemin via l'url,
 * utilisation d'une url hashée afin d'avoir toutes les url qui 
 * retournent le "index.html" pour une github page */
function Route(pageName:string, openInstantly:boolean = false):void{
    if(pageName.includes("http") || pageName.includes("projet")){
        window.open(pageName, "_blank")
    }else if(window.location.hash.replace(/^#\/?/, "") != pageName){
        if(pageName == "Accueil"){
            pageName = "";
            // history.pushState({}, "", "");
        }
        window.location.hash = "/" + pageName;
    }
    GoTo(openInstantly);
}
globalThis.Route = Route;

window.addEventListener("hashchange", ()=>{GoTo();});

/** @description Débute les animations de traveling depuis 
 * la position actuelle de la camera jusqu'à la position de 
 * destination fourni dans les données de la page*/
function GoTo(openInstantly:boolean = false):void{
    let pageName:string = decodeURIComponent(window.location.hash).replace(/^#\/?/, "");
    if(pageName == "" || pageName == "/") pageName = "Accueil";
    const pageFound:Page|undefined = pages.find((p:Page)=>p.name.toLowerCase() == pageName.toLowerCase());
    if(pageFound) {
        globalThis.actualPage = pageFound;
        if(actualPage.name == "Accueil"){
            document.title = title;
        }else{
            document.title = title+" - "+actualPage.name;
        }
    }else{
        const pageError:Page|undefined = pages.find((p:Page)=>p.name.toLowerCase() == "erreur");
        if(!pageError) throw new Error("La page d'érreur est introuvable");
        globalThis.actualPage = pageError;
        document.title = title+" - page introuvable";
    }
    // if(!destinationPageName) return;
    // destinationPageName.innerHTML = actualPage.name;
    CloseMenu(false);
    if(openInstantly){
        OpenPageAnimation();
        spaceBackground.GoToWorldCoordinateAnimation(actualPage.star.position, 0);
        UpdatePageData();
    } else {
        ClosePageAnimation(()=>{
            if(!pageHtml) return;
            pageHtml.innerHTML = "";
            const rawdistance:number = CalculateDistance(cameraPosition, actualPage.star.position);
            const minDelay:number = 500;
            const constante:number = 15;
            const distance:number = Math.sqrt(rawdistance) * minDelay / constante;
            spaceBackground.GoToWorldCoordinateAnimation(actualPage.star.position, distance, ()=>{
                OpenPageAnimation();
                UpdatePageData();
            });
        });
    }
}

function UpdageDestinationBar():void{
    if(!destinationPanelList || !destinationsBar || !menu) return;
    destinationPanelList.innerHTML = "";
    destinationsBar.innerHTML = "";
    if(isMobile()){
        menu.style.scale = "1"
    }else{
        menu.style.scale = "0"
    }
    pages.forEach((p:Page, index:number)=>{
        if(actualPage.name != p.name && p.name != "Erreur"){
            if(isMobile()){
                destinationPanelList.innerHTML += `<button tabindex="${index}"
                onClick="Route('${p.name}')">${p.name}</button>`;
            }else{
                menu
                destinationsBar.innerHTML += `<button tabindex="${index}"
                onClick="Route('${p.name}')">${p.name}</button>`;
            }
        }
    })
}

async function UpdatePageData():Promise<void>{
    if(!pageHtml || !world) return;
    if(actualPage.html != undefined){
        pageHtml.innerHTML = actualPage.html;
    }
    UpdageDestinationBar();
}

function ToggleMenu():void{
    if(!destinationPanel) return;
    if(destinationPanel.style.scale == "1"){
        CloseMenu();
    }else{
        OpenMenu();
    }
}
globalThis.ToggleMenu = ToggleMenu;

function CloseMenu(openPage:boolean = true):void{
    if(!destinationPanel) return;
    destinationPanel.style.scale = "0";
    if(openPage) OpenPageAnimation();
}
function OpenMenu():void{
    if(!destinationPanel) return;
    destinationPanel.style.scale = "1";
    ClosePageAnimation();
}

function TogglePageAnimation(){
    if(pageIsOpen){
        ClosePageAnimation();
    }else{
        OpenPageAnimation();
    }
}
globalThis.TogglePageAnimation = TogglePageAnimation;

/** @description Effectue l'animation de fermeture de la page */
function ClosePageAnimation(onComplete?:()=>void):void{
    if (!pageHtml) return;
    pageHtml.style.scale = "0"
    pageIsOpen = false;
    setTimeout(() => {
        if (onComplete) onComplete();
        pageHtml.style.pointerEvents = "none";
    }, 500);
}
globalThis.ClosePageAnimation = ClosePageAnimation;

/** @description Effectue l'animation d'ouverture de la page */
function OpenPageAnimation(onComplete?:()=>void):void{
    if(!pageHtml) return;
    pageHtml.style.pointerEvents = "all";
    pageHtml.style.scale = "1"
    pageIsOpen = true;
    setTimeout(() => {
        if (onComplete) onComplete();
    }, 500);
}
globalThis.OpenPageAnimation = OpenPageAnimation;