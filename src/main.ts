import { Vector2, Vector, Page, Star, Color, Data } from "./objects";
import { Space } from "./canvasEffect"

import accueilHTML from "./partials/accueil.html?raw";
import contactHTML from "./partials/contact.html?raw";

const title = "Rémi SOHIER";
const lorem = `Lorem ipsum dolor sit amet consectetur 
            adipisicing elit. Dolores voluptates sed 
            molestiae nam placeat consequatur temporibus 
            culpa repellendus quasi blanditiis, minima 
            error sint aperiam hic fugit eius nulla, 
            ipsum repellat.`;
const destinationsBar = document.getElementById("destinationsBar")
const app = document.getElementById("app");
const world = document.getElementById("world");
const pageBalise = document.getElementById("page");
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

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

if (app) {
    // app.innerHTML = `<h1>${title}</h1>`;
}
if(world){
    globalThis.world = world;
}
if(destinationsBar){
    globalThis.destinationsBar = destinationsBar;
}
let pageIsOpen:boolean = false;
//Optimized for [-10000:10000] coordinates maximum
globalThis.cameraPosition = new Vector2();
const spaceBackground:Space = new Space(canvas);
if(canvas){
    // spaceBackground.GenerateRandomStars();
}

// let camera:Vector2 = new Vector2();
// let targetCamera:Vector2 = new Vector2();//actually not used

// let pages:Page[] = []
// let page:Page = new Page();
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
        return page;
    }));
    // pages = pagesFound;
    globalThis.pages = pagesFound;
    let errorPage = new Page();
    errorPage.name = "Erreur";
    errorPage.star = new Star(new Vector(0, -3000, 0), 30000, 1, new Color(), 75);
    errorPage.star.Init();
    // pages.push(errorPage);
    globalThis.pages.push(errorPage)
    // page = Object.assign(new Page(), pages[1]);
    if(!destinationsBar) return;
    destinationsBar.innerHTML = "";
    if(!world) return;
    // InitWorld();
    // window.addEventListener("resize", ()=>{
    //     InitWorld();
    // })
    GoTo(true);
    spaceBackground.GenerateStarPages();
}

/** @description Permet de définir le chemin via l'url,
 * utilisation d'une url hashée afin d'avoir toutes les url qui 
 * retournent le "index.html" pour une github page */
function Route(pageName:string, openInstantly:boolean = false){
    if(window.location.hash.replace(/^#\/?/, "") != pageName){
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
    }else{
        const pageError:Page|undefined = pages.find((p:Page)=>p.name.toLowerCase() == "erreur");
        if(!pageError) throw new Error("La page d'érreur est introuvable");
        actualPage = pageError;
    }
    if(actualPage.name == "Accueil"){
        document.title = title;
    }else{
        document.title = title+" - "+actualPage.name;
    }
    if(openInstantly){
        OpenPageAnimation();
        spaceBackground.GoToWorldCoordinateAnimation(actualPage.star.position, 0);
        UpdatePageData();
    } else {
        ClosePageAnimation(()=>{
            if(!pageBalise) return;
            pageBalise.innerHTML = "";
            spaceBackground.GoToWorldCoordinateAnimation(actualPage.star.position, 3000, ()=>{
                OpenPageAnimation();
                UpdatePageData();
            });
        });
    }
}

function UpdageDestinationBar():void{
    if(!destinationsBar) return;
    destinationsBar.innerHTML = "";
    pages.forEach((p:Page, index:number)=>{
        if(actualPage.name != p.name && p.name != "Erreur"){
            destinationsBar.innerHTML += `<button tabindex="${index}"
            onClick="Route('${p.name}')">${p.name}</button>`;
        }
    })
}

async function UpdatePageData():Promise<void>{
    if(!pageBalise || !world) return;
    const left = window.innerWidth / 2 - actualPage.star.radius / 2
    const top = window.innerHeight / 2 - actualPage.star.radius / 2
    let datas:Data[]|null = null;
    try {
        const module = await import(`/data/${actualPage.name.toLowerCase()}.js`);
        datas = module.default ?? null;
    } catch (e) {
        datas = null;
    }
    let titleHtml:string = "";
    let contentHtml:string = "";
    // if(page.name == "Accueil") contentHtml = accueilHTML;
    if(actualPage.name == "Mentions-légales") contentHtml = contactHTML;
    if(datas != null){
        titleHtml = `<div id="title">${actualPage.name}</div>`;
        contentHtml += actualPage.GetDataString(datas as Data[]);
    }else{
        titleHtml = `<div id="title" class="warn">La page ${actualPage.name} est en cours d'élaboration</div>`;
        contentHtml += lorem
    }
    pageBalise.innerHTML = `
    <div id="eclipse" style="top:${top}px;left:${left}px;
        width: ${actualPage.star.radius}px;
        height: ${actualPage.star.radius}px;">
    </div>
    ${titleHtml}
    <section>
        <div id="content">
            ${contentHtml}
        </div>
    </section>`;
    InitPageEvent();
    UpdageDestinationBar();
}

function InitPageEvent(){
    document.querySelectorAll(".dataTextTitle").forEach(title => {
    title.addEventListener("click", () => {
        const content = title.nextElementSibling;
        if (content) {
            content.classList.toggle("open");
        }
    });
});
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
    if (!pageBalise) return;
    pageBalise.style.scale = "0";
    pageIsOpen = false;
    setTimeout(() => {
        if (onComplete) onComplete();
    }, 500);
}
globalThis.ClosePageAnimation = ClosePageAnimation;

/** @description Effectue l'animation d'ouverture de la page */
function OpenPageAnimation(onComplete?:()=>void):void{
    if(!pageBalise) return;
    pageBalise.style.scale = "1"
    pageIsOpen = true;
    setTimeout(() => {
        if (onComplete) onComplete();
    }, 500);
}
globalThis.OpenPageAnimation = OpenPageAnimation;