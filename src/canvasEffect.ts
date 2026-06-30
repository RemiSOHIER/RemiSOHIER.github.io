import {Page, Vector, Color, Star, Vector2, Chunk, AddVector} from "./objects"

export class Space{
    canvas!:HTMLCanvasElement;
    ctx:CanvasRenderingContext2D;
    starChunks:Chunk<Star>[] = [];
    private generationQueue:Vector2[] = [];
    private chunkPerFrame:number = 5;
    private updateOnProgress:boolean = false;
    chunkSize:number = 1000;
    starNumberByChunks:number = 200;
    constructor(canvas:HTMLCanvasElement){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        this.GenerateChunks();
        this.resize();
        window.addEventListener("resize", () => {
            this.resize();
            this.PreRender();
            this.OnResizeUpdatePositionStarPage();
        });
        world.addEventListener("animationend", (e) => {
            //Quand l'animation d'une éruption solaire est finie,
            //l'éruption est détruite et une éruption avec un angle 
            //aléatoire est recrée
            const el = e.target as HTMLElement;
            const starEl = el.parentElement as HTMLElement;
            const pageName:string|null = starEl.getAttribute("data-pageName");
            if (!el.classList.contains("eruption")) return;
            el.remove();
            if(!actualPage == undefined || pages.length == 0 || pageName == null) return;
            const pageFound:Page|undefined = pages.find((p:Page)=>p.name.toLowerCase() == pageName.toLowerCase());
            if(pageFound) {
                starEl.appendChild(this.GetNewEruption(pageFound))
            }
        });
        this.update();
    }
    public GoToWorldCoordinateAnimation(
        destination:Vector2,
        duration:number = 1200,
        onComplete?:()=>void
    ):void{
        destinationsBar.style.display = "none";
        this.updateOnProgress = true;
        this.update();
        if(duration == 0){
            cameraPosition.x += destination.x;
            cameraPosition.y += destination.y;
            this.renderUI();
            if (onComplete) onComplete();
            this.updateOnProgress = false;
        }
        const startX = cameraPosition.x;
        const startY = cameraPosition.y;
        const dx = destination.x - startX;
        const dy = destination.y - startY;
        const startTime = performance.now();
        const animate = (time:number) => {
            const t = Math.min((time - startTime) / duration, 1);
            // easing smooth (cinématique)
            const ease = t * t * (3 - 2 * t);
            cameraPosition.x = startX + dx * ease;
            cameraPosition.y = startY + dy * ease;
            this.renderUI();
            if (t < 1) {
                requestAnimationFrame(animate);
            } else {
                if (onComplete) onComplete();
                this.updateOnProgress = false;
                destinationsBar.style.display = "block";
            }
        }
        requestAnimationFrame(animate);
    }
    private renderUI():void{
        if(!world) return;
        world!.style.transform = `translate(${-cameraPosition.x}px, ${-cameraPosition.y}px)`;
    }

//#region Generation
    /** @description Génère les étoiles proches pour chaque pages */
    public GenerateStarPages():void{
        if(!world) return;
        world.innerHTML = "";
        pages.forEach((p:Page)=>{
            const left = p.star.position.x + world.clientWidth / 2 + window.innerWidth / 2 - p.star.radius / 2
            const top = p.star.position.y + world.clientHeight / 2 + window.innerHeight / 2 - p.star.radius / 2
            const color:Color = (p.star.temperature == 0)?{r: 0, g: 0, b: 0}:p.star.color;
            const colorOuter:Color = (p.star.temperature == 0)?{r: 255, g: 255, b: 255}:color;
            const colorStrRGB:string = `rgb(${color.r}, ${color.g}, ${color.b})`;
            const star = document.createElement("div");
            star.className = "star";
            star.setAttribute("data-pageName", p.name);
            star.style.top = `${top}px`;
            star.style.left = `${left}px`;
            star.style.width = `${p.star.radius}px`;
            star.style.height = `${p.star.radius}px`;
            if(p.star.temperature == 0){
                star.style.background = `black`;
            }else{
                star.style.background = `
                    radial-gradient(
                        circle,
                        white 0%, 
                        ${colorStrRGB} 80%, 
                        transparent 100%
                    )`;
            }
            star.style.boxShadow = `
                0 0 10px rgba(${colorOuter.r},${colorOuter.g},${colorOuter.b},0.9),
                0 0 25px rgba(${colorOuter.r},${colorOuter.g},${colorOuter.b},0.6),
                0 0 50px rgba(${colorOuter.r},${colorOuter.g},${colorOuter.b},0.3),
                0 0 100px rgba(${colorOuter.r},${colorOuter.g},${colorOuter.b},0.15)
                `;
            if(p.star.temperature > 0){
                star.appendChild(this.GetNewEruption(p, 0))
                star.appendChild(this.GetNewEruption(p, 0))
                star.appendChild(this.GetNewEruption(p, 0))
                star.appendChild(this.GetNewEruption(p))
                star.appendChild(this.GetNewEruption(p))
            }
            world.appendChild(star);
        });
    }
    /** @description Recalcule la position des étoiles proches quand 
     * on change la taille de l'écran */
    private OnResizeUpdatePositionStarPage():void{
        Array.from(world.children).forEach(childStar=>{
            const pageName:string|null = (childStar as HTMLElement).getAttribute("data-pageName");
            if(!pageName) return;
            const pageFound:Page|undefined = pages.find((p:Page)=>p.name.toLowerCase() == pageName.toLowerCase());
            if(pageFound) {
                const left = pageFound.star.position.x + world.clientWidth / 2 + window.innerWidth / 2 - pageFound.star.radius / 2;
                const top = pageFound.star.position.y + world.clientHeight / 2 + window.innerHeight / 2 - pageFound.star.radius / 2;
                (childStar as HTMLElement).style.left = left+"px";
                (childStar as HTMLElement).style.top = top+"px";
            }
        })
        const eclipse = document.getElementById("eclipse");
        if(!eclipse) return;
        const leftEclipse = window.innerWidth / 2 - actualPage.star.radius / 2
        const topEclipse = window.innerHeight / 2 - actualPage.star.radius / 2
        eclipse.style.left = leftEclipse+"px";
        eclipse.style.top = topEclipse+"px";
    }
    /** @description Génère une éruption et retourne l'élément HTML 
     * à insérer dans dans la div de l'étoile */
    private GetNewEruption(page:Page, delay:number = Math.random() * 10):HTMLElement{
        if (actualPage == undefined) return document.createElement("div");
        const color:Color = page.star.color;
        const angle:number = Math.random() * 360;
        const duration:number = Math.random() * 50;
        const height:number = Math.max(Math.random() * 50, 45);
        const width:number = Math.max(Math.random() * 30, 20);
        const el = document.createElement("div");
        el.classList.add("eruption");
        el.style.background = `
            radial-gradient(
                ellipse at bottom,
                transparent 45%,
                rgba(${color.r},${color.g},${color.b},1.3) 70%,
                rgba(${color.r},${color.g},${color.b},0.95) 85%,
                transparent 90%
            )`; 
        el.style.boxShadow = `
            0 0 5px rgba(${color.r},${color.g},${color.b},0.9),
            0 0 15px rgba(${color.r},${color.g},${color.b},0.6),
            0 0 30px rgba(${color.r},${color.g},${color.b},0.3),
            0 0 60px rgba(${color.r},${color.g},${color.b},0.15)
            `;
        el.style.height = `${height}%`;
        el.style.width = `${width}%`;
        el.style.rotate = `${angle}deg`;
        el.style.animationDelay = `${delay}s`;
        el.style.animationDuration = `${duration}s`;
        return el;
    }
    /** @description Génère les chunks vides */
    private async GenerateChunks():Promise<void>{
        const chunkRowNumber:number = 10;
        const halfCoord:number = Math.floor(chunkRowNumber / 2);
        for (let x = 0; x < chunkRowNumber; x++) {
            for (let y = 0; y < chunkRowNumber; y++) {
                const position:Vector2 = {x: x-halfCoord, y: y-halfCoord};
                this.generationQueue.push(position);
            }
        }
    }
    /** @description Execute la génération d'un nombre précis de 
     * chunks (remplissage) par image pour éviter de surcharger 
     * le reste de la page*/
    private ProcessGenerationQueue():void{
        let count = 0;
        while(this.generationQueue.length > 0 && count < this.chunkPerFrame){
            const pos:Vector2|undefined = this.generationQueue.shift();
            if(!pos) return;
            this.GenerateChunkStars(pos, this.chunkSize);
            count++;
        }
    }
    /** @description Génère les étoiles pour chaque chunks */
    private async GenerateChunkStars(chunkPos:Vector2, size:number):Promise<void>{
        let stars:Star[] = [];
        for (let i = 0; i < this.starNumberByChunks; i++) {
            let star:Star = new Star();
            star.GenerateRandom();
            const worldX = chunkPos.x * size + Math.random() * size;
            const worldY = chunkPos.y * size + Math.random() * size;
            star.position.x = worldX;
            star.position.y = worldY;
            star.radius = Math.random() * 1.5 + 0.5;
            stars.push(star);
        }
        let chunk:Chunk<Star> = new Chunk();
        chunk.position = chunkPos;
        chunk.dataStored = stars;
        this.starChunks.push(chunk);
    }
//#endregion Generation

    /** @description Boucle de mise a jour du rendu des chunks (ou pour 
     * la génération des chunks au chargement de la page) */
    private update = ()=>{
        this.ProcessGenerationQueue();
        this.PreRender();
        // console.log("update")
        if(this.updateOnProgress || this.generationQueue.length > 0){
            requestAnimationFrame(this.update);
        }
    };
    /** @description Boucle de pré-rendu filtre et éxecute le rendu 
     * des chunks proches */
    private PreRender():void{
        this.ctx.fillStyle = "#050816";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        const currentChunkX = Math.floor(cameraPosition.x / this.chunkSize*0.25);
        const currentChunkY = Math.floor(cameraPosition.y / this.chunkSize*0.25);
        const renderDistance = 2; // ou 3, 4 selon densité
        for (let i = 0; i < this.starChunks.length; i++) {
            const chunk:Chunk<Star>|undefined = this.starChunks[i];
            if(!chunk) continue;
            if (
                Math.abs(chunk.position.x - currentChunkX) > renderDistance ||
                Math.abs(chunk.position.y - currentChunkY) > renderDistance
            ) {
                continue;
            }
            this.RenderStars(chunk);
        }
    }
    /** @description Boucle de rendu des étoiles d'un chunk */
    private RenderStars(chunk:Chunk<Star>):void{
        chunk.dataStored.forEach((star:Star)=>{
            const color = `rgb(${star.color.r}, ${star.color.g}, ${star.color.b})`;
            
            const parallax = star.position.z;
            const camX = cameraPosition.x * parallax;
            const camY = cameraPosition.y * parallax;

            const x = star.position.x - camX;
            const y = star.position.y - camY;
            
            const intensity = star.intensity ?? 1;
            // variation réaliste
            const blur = 2 + intensity * 12;
            const alpha = 0.2 + intensity * 0.8;
            // HALO
            this.ctx.shadowBlur = blur;
            this.ctx.shadowColor = color;

            this.ctx.fillStyle = `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, star.radius*1, 0, Math.PI * 2);
            this.ctx.fill();
            // noyau lumineux
            // this.ctx.shadowBlur = 0;
            // this.ctx.fillStyle = `rgba(255,255,255,${alpha})`;
            // this.ctx.beginPath();
            // this.ctx.arc(x, y, star.radius * 0.4, 0, Math.PI * 2);
            // this.ctx.fill();
        })
    }
    private resize():void{
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;

        this.canvas.style.width = window.innerWidth + "px";
        this.canvas.style.height = window.innerHeight + "px";

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(dpr, dpr);
    }
}