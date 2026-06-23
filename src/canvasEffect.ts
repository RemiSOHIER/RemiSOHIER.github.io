import {Vector, Color, Star, Vector2, Chunk} from "./objects"

export class Space{
    canvas!:HTMLCanvasElement;
    ctx:CanvasRenderingContext2D;
    starChunks:Chunk<Star>[] = [];
    private generationQueue:Vector2[] = [];
    private chunkPerFrame:number = 5;
    chunkSize:number = 1000;
    starNumberByChunks:number = 200;
    cameraPosition:Vector2 = new Vector2();
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
    private async GenerateChunks(){
        const chunkRowNumber:number = 20;
        const halfCoord:number = Math.floor(chunkRowNumber / 2);
        for (let x = 0; x < chunkRowNumber; x++) {
            for (let y = 0; y < chunkRowNumber; y++) {
                const position:Vector2 = {x: x-halfCoord, y: y-halfCoord};
                this.generationQueue.push(position);
            }
        }
    }
    private ProcessGenerationQueue(){
        let count = 0;
        while(this.generationQueue.length > 0 && count < this.chunkPerFrame){
            const pos:Vector2|undefined = this.generationQueue.shift();
            if(!pos) return;
            this.GenerateChunkStars(pos, this.chunkSize);
            count++;
        }
    }
    private async GenerateChunkStars(chunkPos:Vector2, size:number){
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
        requestAnimationFrame(this.update);
    };
    private PreRender(){
        this.ctx.fillStyle = "#050816";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        const currentChunkX = Math.floor(this.cameraPosition.x / this.chunkSize);
        const currentChunkY = Math.floor(this.cameraPosition.y / this.chunkSize);
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
            // console.table({
            //     positionX: chunk.position.x,
            //     positionY: chunk.position.y,
            //     x: (chunk.position.x - currentChunkX), 
            //     y: (chunk.position.y - currentChunkY)
            // })
            this.RenderStars(chunk);
        }
    }
    private RenderStars(chunk:Chunk<Star>){
        chunk.dataStored.forEach((star:Star)=>{
            const color = `rgb(${star.color.r}, ${star.color.g}, ${star.color.b})`;
            
            // const depth = star.position.z;
            // const parallax = 0.1 + star.position.z * 0.9;
            const parallax = star.position.z;
            // const y = star.position.y - this.cameraPosition.y * parallax * 0.3;
            // const x = star.position.x - this.cameraPosition.x * parallax * 0.3;
            const camX = this.cameraPosition.x * parallax;
            const camY = this.cameraPosition.y * parallax;

            const x = star.position.x - camX;
            const y = star.position.y - camY;
            
            // // marge pour éviter le popping des halos
            // const margin = 50;
            // if (
            //     x < -margin ||
            //     x > this.canvas.width + margin ||
            //     y < -margin ||
            //     y > this.canvas.height + margin
            // ) {
            //     return;
            // }
            if (
                x < 0 || x > this.canvas.width ||
                y < 0 || y > this.canvas.height
            ) return;
            
            //---------------------------------------------------------
            //QUand il y a une marge elle se remplit au fur et a mesure 
            // qu'on se déplace et plus on s'éloigne du centre et 
            //moins il y a d'étoiles, vérifier le calcul de generation
            // voire faire la generation d'etoiles en 
            // coordonnées du chunk local
            //---------------------------------------------------------

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
            // noyau lumineux (effet étoile "NASA")
            // this.ctx.shadowBlur = 0;
            // this.ctx.fillStyle = `rgba(255,255,255,${alpha})`;
            // this.ctx.beginPath();
            // this.ctx.arc(x, y, star.radius * 0.4, 0, Math.PI * 2);
            // this.ctx.fill();
        })
    }
    private resize() {
        const dpr = window.devicePixelRatio || 1;
        
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;

        this.canvas.style.width = window.innerWidth + "px";
        this.canvas.style.height = window.innerHeight + "px";

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(dpr, dpr);
    }
}