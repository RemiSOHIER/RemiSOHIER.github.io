import {Vector, Color, Star, Vector2, Chunk} from "./objects"

export class Space{
    canvas!:HTMLCanvasElement;
    ctx:CanvasRenderingContext2D;
    starChunks:Chunk<Star>[] = [];
    private generationQueue:Vector2[] = [];
    private renderQueue:Vector2[] = [];
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
        });
        // window.addEventListener("scroll", () => {
        //     this.scrollY = window.scrollY;
        //     this.scrollX = window.scrollX;
        // });
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
    private ProcessGenerationQueue():void{
        let count = 0;
        while(this.generationQueue.length > 0 && count < this.chunkPerFrame){
            const pos:Vector2|undefined = this.generationQueue.shift();
            if(!pos) return;
            this.GenerateChunkStars(pos, this.chunkSize);
            count++;
        }
    }
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
    private update = ()=>{
        this.ProcessGenerationQueue();
        this.PreRender();
        this.Render();
        if(this.updateOnProgress || this.renderQueue.length > 0){
            requestAnimationFrame(this.update);
        }
    };
    private PreRender():void{
        this.ctx.fillStyle = "#050816";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        const currentChunkX = Math.floor(cameraPosition.x / this.chunkSize);
        const currentChunkY = Math.floor(cameraPosition.y / this.chunkSize);
        const renderDistance = 2; // ou 3, 4 selon densité
        // console.clear();
        for (let i = 0; i < this.starChunks.length; i++) {
            const chunk:Chunk<Star>|undefined = this.starChunks[i];
            if(!chunk) continue;
            if (
                Math.abs(chunk.position.x - currentChunkX) > renderDistance ||
                Math.abs(chunk.position.y - currentChunkY) > renderDistance
            ) {
                continue;
            }
            this.renderQueue.push(chunk.position);
        }
    }
    private Render():void{
        this.starChunks.forEach((chunk:Chunk<Star>)=>{
            if(this.renderQueue.includes(chunk.position)){
                this.RenderStars(chunk);
            }
        });
    }
    private RenderStars(chunk:Chunk<Star>):void{
        chunk.dataStored.forEach((star:Star)=>{
            const color = `rgb(${star.color.r}, ${star.color.g}, ${star.color.b})`;
            
            const parallax = star.position.z;
            const camX = cameraPosition.x * parallax;
            const camY = cameraPosition.y * parallax;

            const x = star.position.x - camX;
            const y = star.position.y - camY;
            
            if (
                x < 0 || x > this.canvas.width ||
                y < 0 || y > this.canvas.height
            ) return;
            
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
        const dpr = window.devicePixelRatio || 1;
        
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;

        this.canvas.style.width = window.innerWidth + "px";
        this.canvas.style.height = window.innerHeight + "px";

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(dpr, dpr);
    }
}