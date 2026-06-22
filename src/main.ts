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

let camera:Vector2 = new Vector2();
let targetCamera:Vector2 = new Vector2();
const res = await fetch("../data/pageDestination.json");
const pageDestination:Page[]|undefined = await res.json();
if(pageDestination == undefined) throw new Error("pages list not found");
let pages:Page[] = Object.assign([], pageDestination.map((p:Page)=>{
    Object.assign(new Page(), p);
    Object.assign(new Star(), p.star);
    p.star = new Star(
        p.star.position, 
        p.star.temperature, 
        p.star.intensity, 
        p.star.color, 
        p.star.radius
    );
    p.star.Init()
    return p;
}));
let page:Page = Object.assign(new Page(), pages[0]);

if(destinationsBar){
    destinationsBar.innerHTML = "";
    pages.forEach((p:Page)=>{
        destinationsBar.innerHTML += `<button onClick="GoTo('${p.name}')">${p.name}</button>`;
    })
}

if(world){
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
    GoTo(page.name, true);
}

function GoTo(pageName:string, openInstantly:boolean = false):void{
    const pageFound:Page|undefined = pages.find((p:Page)=>p.name == pageName);
    if(!pageFound) return;
    page = pageFound;
    targetCamera = page.star.position;
    if(openInstantly){
        OpenPageAnimation();
        UpdatePageData();
    } else {
        ClosePageAnimation(()=>{
            GoToWorldCoordinateAnimation(page.star.position, 3000, ()=>{
                OpenPageAnimation();
                UpdatePageData();
            });
        });
    }
}
(window as any).GoTo = GoTo;

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
        <h3 class="warn">Portfolio en cours d'élaboration</h3>

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
    const startX = camera.x;
    const startY = camera.y;
    const dx = destination.x - startX;
    const dy = destination.y - startY;
    const startTime = performance.now();
    function animate(time:number) {
        const t = Math.min((time - startTime) / duration, 1);
        // easing smooth (cinématique)
        const ease = t * t * (3 - 2 * t);
        camera.x = startX + dx * ease;
        camera.y = startY + dy * ease;
        spaceBackground.cameraPosition = camera
        renderUI()
        if (t < 1) {
            requestAnimationFrame(animate);
        } else {
            if (onComplete) onComplete();
        }
    }
    requestAnimationFrame(animate);
}

function ClosePageAnimation(onComplete?:()=>void):void{
    if (!pageBalise) return;
    pageBalise.style.transform = "scale(0)";
    setTimeout(() => {
        if (onComplete) onComplete();
    }, 500);
}
(window as any).ClosePageAnimation = ClosePageAnimation;

function OpenPageAnimation(onComplete?:()=>void):void{
    if(!pageBalise) return;
    pageBalise.style.transform = "scale(1)"
    setTimeout(() => {
        if (onComplete) onComplete();
    }, 500);
}
(window as any).OpenPageAnimation = OpenPageAnimation;

function renderUI():void{
    world!.style.transform = `
        translate(${-camera.x}px, ${-camera.y}px)
    `;
}