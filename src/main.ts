import { Vector2, Vector, Page, Star, Color, DataText, Link, Projet } from "./objects";
import { Space } from "./canvasEffect"

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
    UpdageDestinationBar();
    // page = Object.assign(new Page(), pages[1]);
    if(!destinationsBar) return;
    destinationsBar.innerHTML = "";
    if(!world) return;
    InitWorld();
    window.addEventListener("resize", ()=>{
        InitWorld();
    })
    GoTo(true);
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
        page = pageFound;
    }else{
        const pageError:Page|undefined = pages.find((p:Page)=>p.name.toLowerCase() == "erreur");
        if(!pageError) throw new Error("La page d'érreur est introuvable");
        page = pageError;
    }
    if(page.name == "Accueil"){
        document.title = title;
    }else{
        document.title = title+" - "+page.name;
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

function UpdageDestinationBar():void{
    if(!destinationsBar) return;
    destinationsBar.innerHTML = "";
    pages.forEach((p:Page)=>{
        if(page.name != p.name && p.name != "Erreur"){
            destinationsBar.innerHTML += `<button onClick="Route('${p.name}')">${p.name}</button>`;
        }
    })
}

async function UpdatePageData():Promise<void>{
    if(!pageBalise || !world) return;
    const left = window.innerWidth / 2 - page.star.radius / 2
    const top = window.innerHeight / 2 - page.star.radius / 2
    let datas:DataText[]|Link[]|Projet[]|null = null;
    try {
        const module = await import(`/data/${page.name.toLowerCase()}.js`);
        datas = module.default ?? null;
    } catch (e) {
        datas = null;
    }
    let titleHtml:string = "";
    let contentHtml:string = "";
    if(datas != null){
        titleHtml = `<div id="title">${page.name}</div>`;
        if(page.name == "Parcours"){
            contentHtml = page.GetDataTextString(datas as DataText[]);
        }
        if(page.name == "Réseaux"){
            contentHtml = page.GetLinkString(datas as Link[]);
        }
        if(page.name == "Projets"){
            contentHtml = page.GetProjetString(datas as Projet[]);
        }
    }else{
        titleHtml = ` <div id="title" class="warn">La page ${page.name} est en cours d'élaboration</div>`;
        contentHtml = lorem
    }
    pageBalise.innerHTML = `
    <div class="eclipse" style="top:${top}px;left:${left}px;
        width: ${page.star.radius}px;
        height: ${page.star.radius}px;">
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