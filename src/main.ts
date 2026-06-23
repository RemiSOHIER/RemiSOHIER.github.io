import { Vector2, Page, Star, Color } from "./objects";
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

const spaceBackground:Space = new Space(canvas);
if(canvas){
    // spaceBackground.GenerateRandomStars();
}

//Optimized for [-10000:10000] coordinates maximum

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
    page = Object.assign(new Page(), pages[0]);
    if(!destinationsBar) return;
    destinationsBar.innerHTML = "";
    pages.forEach((p:Page)=>{
        destinationsBar.innerHTML += `<button onClick="GoTo('${p.name}')">${p.name}</button>`;
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
    window.GoTo(page.name, true);
}

globalThis.GoTo = (pageName:string, openInstantly:boolean = false):void{
    const pageFound:Page|undefined = pages.find((p:Page)=>p.name == pageName);
    if(!pageFound) return;
    page = pageFound;
    // targetCamera = page.star.position;
    if(openInstantly){
        window.OpenPageAnimation();
        UpdatePageData();
    } else {
        window.ClosePageAnimation(()=>{
            GoToWorldCoordinateAnimation(page.star.position, 3000, ()=>{
                window.OpenPageAnimation();
                UpdatePageData();
            });
        });
    }
}
// (window as any).GoTo = GoTo;

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

function GoToWorldCoordinateAnimation(
    destination:Vector2,
    duration:number = 1200,
    onComplete?:()=>void
): void {
    // const startX = camera.x;
    // const startY = camera.y;
    const startX = spaceBackground.cameraPosition.x;
    const startY = spaceBackground.cameraPosition.y;
    const dx = destination.x - startX;
    const dy = destination.y - startY;
    const startTime = performance.now();
    function animate(time:number) {
        const t = Math.min((time - startTime) / duration, 1);
        // easing smooth (cinématique)
        const ease = t * t * (3 - 2 * t);
        // spaceBackground.cameraPosition.x = startX + dx * ease;
        // spaceBackground.cameraPosition.y = startY + dy * ease;
        globalThis.cameraPosition.x = startX + dx * ease;
        globalThis.cameraPosition.y = startY + dy * ease;
        // camera.x = startX + dx * ease;
        // camera.y = startY + dy * ease;
        // spaceBackground.cameraPosition = camera
        renderUI()
        if (t < 1) {
            requestAnimationFrame(animate);
        } else {
            if (onComplete) onComplete();
        }
    }
    requestAnimationFrame(animate);
}

globalThis.ClosePageAnimation = (onComplete?:()=>void):void{
    if (!pageBalise) return;
    pageBalise.style.transform = "scale(0)";
    setTimeout(() => {
        if (onComplete) onComplete();
    }, 500);
}
// (window as any).ClosePageAnimation = ClosePageAnimation;

globalThis.OpenPageAnimation = (onComplete?:()=>void):void{
    if(!pageBalise) return;
    pageBalise.style.transform = "scale(1)"
    setTimeout(() => {
        if (onComplete) onComplete();
    }, 500);
}
// (window as any).OpenPageAnimation = OpenPageAnimation;

function renderUI():void{
    // world!.style.transform = `translate(${-camera.x}px, ${-camera.y}px)`;
    world!.style.transform = `translate(${-spaceBackground.cameraPosition.x}px, ${-spaceBackground.cameraPosition.y}px)`;
}


// declare global {
//     cameraPosition:Vector2;
//     GoTo:(pageName:string, openInstantly:boolean)=>void;
//     OpenPageAnimation:(onComplete?:()=>void)=>void;
//     ClosePageAnimation:(onComplete?:()=>void)=>void;
//     interface Window{
//     }
// }

// declare global {
//     interface Window{
//         cameraPosition:Vector2;
//         GoTo:(pageName:string, openInstantly:boolean)=>void;
//         OpenPageAnimation:(onComplete?:()=>void)=>void;
//         ClosePageAnimation:(onComplete?:()=>void)=>void;
//     }
// }
