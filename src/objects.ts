enum  DataType{
    link = "link",
    image = "image",
    icon = "icon",
    svg = "svg"
}

class DataBlock{
    type:DataType = DataType.link;
    name:string = "";
    link:string = "";
    scale:number = 1;
    /** @description Récupère le text data brut et le parse */
    constructor(raw?:string) {
        if (!raw) return;
        const parts = raw.split(",");
        for (const part of parts) {
            const [key, ...value] = part.split(":");
            if (!key || !value.length) continue;
            const v = value.join(":").trim();
            switch (key.trim()) {
                case "type":
                    this.type = v as DataType;
                    break;
                case "name":
                    this.name = v;
                    break;
                case "link":
                    this.link = v;
                    break;
                case "scale":
                    console.log(v)
                    if(v.length > 0){
                        this.scale = Number.parseFloat(v);
                    }
                    break;
            }
        }
    }
}

export class Data{
    isClosable:boolean = false;
    title:string = "";
    text:string = "";
}

export class Page{
    name:string = "";
    star:Star = new Star();
    constructor(){}
    public GetDataString(data:Data[]):string{
        if(data.length == 0) return "";
        let innerHtml:string = "";
        data.forEach((d:Data, index:number)=>{
            let title:string = "";
            let textData:string = this.ParseDatas(d.text);
            if(d.isClosable){
                if(d.title.length > 0){
                    title = `<h3 class="btn dataTextTitle" data-index="${index}">${this.ParseDatas(d.title)}</h3>`
                }
                innerHtml += `<div class="dataText">
                   ${title}
                    <div class="dataTextContent">${textData}</div>
                </div>`
            }else{
                if(d.title.length > 0){
                    title = `<h3 class="dataTextTitle" data-index="${index}">${this.ParseDatas(d.title)}</h3>`
                }
                innerHtml += `<div class="dataText">
                   ${title}
                    <div class="dataTextContent.open">${textData}</div>
                </div>`
            }
        })
        return innerHtml;
    }
    private ParseDatas(text:string):string{
        let regex:RegExp = /\{\{([\s\S]*?)\}\}/g;
        let result:string = text.replace(regex, (_, content:string)=>{
            let block:DataBlock = new DataBlock(content);
            switch (block.type) {
                case DataType.link:
                    if(block.link.includes("/#/")){
                        return `<a href="${block.link}" class="link">${block.name}</a>`;
                    }else{
                        return `<a href="${block.link}" target="_blank" class="link">${block.name}</a>`;
                    }
                case DataType.image:
                    return `<img src="${block.link}"style="max-width:${block.scale}px;max-height:${block.scale}px;"
                     loading="lazy" alt="${block.name}">`;
                case DataType.icon:
                    return `<i class="${block.name}"></i>`;
                case DataType.svg:
                    return `<iconify-icon class="iconSVG" icon="${block.link}"></iconify-icon>`;
                    // return `<svg role="img" xmlns="${block.link}"></svg>`;
                default:
                    return "";
            }
        })
        return result.replace(/\\n/g, "<br>");
    }
}

//#region MATH
export class Vector2{
    x:number = 0;
    y:number = 0;
    constructor(x?:number, y?:number){
        this.x = x ?? 0;
        this.y = y ?? 0;
    }
}
export class Vector extends Vector2{
    z:number = 0;
    constructor(x?:number, y?:number, z?:number){
        super(x, y)
        this.z = z ?? 0;
    }
}

export function AddVector(v1:Vector2|Vector, v2:Vector2|Vector){
    if(v1 instanceof Vector || v2 instanceof Vector){
        const v1z:number = v1 instanceof Vector?v1.z:0;
        const v2z:number = v2 instanceof Vector?v2.z:0;
        return new Vector(
            v1.x + v2.x, 
            v1.y + v2.y,
            v1z + v2z
        );
    }else if(v1 instanceof Vector2 && v2 instanceof Vector2){
        return new Vector2(
            v1.x + v2.x, 
            v1.y + v2.y,
        )
    }
}

export class Chunk<T>{
    position:Vector2 = new Vector2();
    dataStored:T[] = []
}
//#endregion MATH

export class Color{
    r:number = 255;
    g:number = 255;
    b:number = 255;
    constructor(r?:number, g?:number, b?:number){
        this.r = r ?? 255;
        this.g = g ?? 255;
        this.b = b ?? 255;
    }
}

export class Star{
    position:Vector = new Vector();
    temperature:number = 2000;
    intensity:number = 1;
    color:Color = new Color();
    radius:number = 10;
    constructor(position?:Vector, temperature?:number, intensity?:number, color?:Color, radius?:number){
        this.position = position ?? new Vector();
        this.temperature = temperature ?? 2000;
        this.intensity = intensity ?? 1;
        this.color = color ?? new Color();
        this.radius = radius ?? 10;
    }
    Init():void{
        this.temperatureToRGB(this.temperature);
        this.temperatureToIntensity();
    }
    GenerateRandom():void{
        this.temperature = 2000 + Math.random() * 10000;
        // this.position.z = Math.random() ** 2;
        this.position.z = Math.random() * 0.25;
        this.Init();
    }
    private temperatureToRGB(kelvin: number):void{
        const temp = kelvin / 100;
        let red:number;
        let green:number;
        let blue:number;
        // Rouge
        if (temp <= 66) {
            red = 255;
        } else {
            red = temp - 60;
            red = 329.698727446 * Math.pow(red, -0.1332047592);
            red = Math.max(0, Math.min(255, red));
        }
        // Vert
        if (temp <= 66) {
            green = 99.4708025861 * Math.log(temp) - 161.1195681661;
        } else {
            green = temp - 60;
            green = 288.1221695283 * Math.pow(green, -0.0755148492);
        }
        green = Math.max(0, Math.min(255, green));
        // Bleu
        if (temp >= 66) {
            blue = 255;
        } else if (temp <= 19) {
            blue = 0;
        } else {
            blue = temp - 10;
            blue = 138.5177312231 * Math.log(blue) - 305.0447927307;
            blue = Math.max(0, Math.min(255, blue));
        }
        this.color.r = Math.round(red);
        this.color.g = Math.round(green);
        this.color.b = Math.round(blue);
    }
    private temperatureToIntensity():void{
        // normalisation 2000K → 12000K
        const t = (this.temperature - 2000) / (12000 - 2000);
        // courbe pour éviter linéaire moche
        this.intensity = Math.pow(t, 0.6);
    }
}