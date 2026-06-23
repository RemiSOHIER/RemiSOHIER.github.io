import { Vector2, Vector, Page, Star, Color } from "./objects";
import { Space } from "./canvasEffect"

const title = "Portfolio de Rémi";
const destinationsBar = document.getElementById("destinationsBar")
const app = document.getElementById("app");
const world = document.getElementById("world");
const pageBalise = document.getElementById("page");
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

if (app) {
    // app.innerHTML = `<h1>${title}</h1>`;
}
if(world){
    globalThis.world = world;
}
if(destinationsBar){
    globalThis.destinationsBar = destinationsBar;
}
//Optimized for [-10000:10000] coordinates maximum
globalThis.cameraPosition = new Vector2();
const spaceBackground:Space = new Space(canvas);
if(canvas){
    // spaceBackground.GenerateRandomStars();
}

// let camera:Vector2 = new Vector2();
// let targetCamera:Vector2 = new Vector2();//actually not used

let pages:Page[] = []
let page:Page = new Page();
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
    pages = pagesFound;
    let errorPage = new Page();
    errorPage.name = "Erreur";
    errorPage.star = new Star(new Vector(0, -3000, 0), 30000, 1, new Color(), 75);
    errorPage.star.Init();
    pages.push(errorPage);
    // page = Object.assign(new Page(), pages[1]);
    if(!destinationsBar) return;
    destinationsBar.innerHTML = "";
    pages.forEach((p:Page)=>{
        destinationsBar.innerHTML += `<button onClick="Route('${p.name}')">${p.name}</button>`;
    })
    if(!world) return;
    InitWorld();
    window.addEventListener("resize", ()=>{
        InitWorld();
    })
}

function InitWorld(){
    if(!world) return;
    world.innerHTML = "";
    pages.forEach((p:Page)=>{
        const left = p.star.position.x + world.clientWidth / 2 + window.innerWidth / 2 - p.star.radius / 2
        const top = p.star.position.y + world.clientHeight / 2 + window.innerHeight / 2 - p.star.radius / 2
        const color:Color = (p.star.temperature == 0)?{r: 0, g: 0, b: 0}:p.star.color;
        const colorOuter:Color = (p.star.temperature == 0)?{r: 255, g: 255, b: 255}:color;
        const colorStrRGB:string = `rgb(${color.r}, ${color.g}, ${color.b})`;
        const colorBase:string = (p.star.temperature == 0)?colorStrRGB:`white`;
        world.innerHTML += `<div class="star" 
        style="top:${top}px;left:${left}px;
        width: ${p.star.radius}px;
        height: ${p.star.radius}px;
        background: radial-gradient(
            circle, ${colorBase} 0%, 
            ${colorStrRGB} 80%, 
            transparent 100%
        );
        box-shadow:
            0 0 4px rgba(${colorOuter.r},${colorOuter.g},${colorOuter.b},0.9),
            0 0 10px rgba(${colorOuter.r},${colorOuter.g},${colorOuter.b},0.6),
            0 0 25px rgba(${colorOuter.r},${colorOuter.g},${colorOuter.b},0.3),
            0 0 60px rgba(${colorOuter.r},${colorOuter.g},${colorOuter.b},0.15);"></div>`;
    });
    world.innerHTML += `<div class="star" style="
    width:10000px;height:10000px;background:red;
    top:calc(100000-5000)px;left:calc(100000-5000)px;"></div>`;
    Route(window.location.pathname, true);
}

/** @description Permet de définir le chemin via l'url */
function Route(pageName:string, openInstantly:boolean = false){
    if(window.location.pathname != pageName){
        if(pageName == "Accueil" || pageName == "/"){
            pageName = "/";
        }
        history.pushState({}, "", pageName);
    }
    GoTo(openInstantly);
}
globalThis.Route = Route;

/** @description Débute les animations de traveling depuis 
 * la position actuelle de la camera jusqu'à la position de 
 * destination fourni dans les données de la page*/
function GoTo(openInstantly:boolean = false):void{
    let pageName:string = decodeURIComponent(window.location.pathname).replace("/", "");
    if(pageName == "" || pageName == "/") pageName = "Accueil";
    const pageFound:Page|undefined = pages.find((p:Page)=>p.name.toLowerCase() == pageName.toLowerCase());
    if(pageFound) {
        page = pageFound;
    }else{
        const pageError:Page|undefined = pages.find((p:Page)=>p.name.toLowerCase() == "erreur");
        if(!pageError) throw new Error("La page d'érreur est introuvable");
        page = pageError;
    }
    if(openInstantly){
        OpenPageAnimation();
        spaceBackground.GoToWorldCoordinateAnimation(page.star.position, 0);
        UpdatePageData();
    } else {
        ClosePageAnimation(()=>{
            spaceBackground.GoToWorldCoordinateAnimation(page.star.position, 3000, ()=>{
                OpenPageAnimation();
                UpdatePageData();
            });
        });
    }
}

function UpdatePageData():void{
    if(!pageBalise || !world) return;
    const left = window.innerWidth / 2 - page.star.radius / 2
    const top = window.innerHeight / 2 - page.star.radius / 2
    pageBalise.innerHTML = `
    <div class="eclipse" style="top:${top}px;left:${left}px;
        width: ${page.star.radius}px;
        height: ${page.star.radius}px;"></div>
    <section>
        <h3>${page.name}</h3>

        Lorem ipsum dolor sit amet consectetur 
        adipisicing elit. Dolores voluptates sed 
        molestiae nam placeat consequatur temporibus 
        culpa repellendus quasi blanditiis, minima 
        error sint aperiam hic fugit eius nulla, 
        ipsum repellat.
    </section>`;
}

/** @description Effectue l'animation de fermeture de la page */
function ClosePageAnimation(onComplete?:()=>void):void{
    if (!pageBalise) return;
    pageBalise.style.transform = "scale(0)";
    setTimeout(() => {
        if (onComplete) onComplete();
    }, 500);
}
globalThis.ClosePageAnimation = ClosePageAnimation;

/** @description Effectue l'animation d'ouverture de la page */
function OpenPageAnimation(onComplete?:()=>void):void{
    if(!pageBalise) return;
    pageBalise.style.transform = "scale(1)"
    setTimeout(() => {
        if (onComplete) onComplete();
    }, 500);
}
globalThis.OpenPageAnimation = OpenPageAnimation;