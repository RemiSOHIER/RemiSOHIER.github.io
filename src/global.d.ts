import {Vector2} from "./objects" 
export {};

declare global {
    // interface Window{
    //     cameraPosition:Vector2;
    //     GoTo:(pageName:string, openInstantly:boolean)=>void;
    //     OpenPageAnimation:(onComplete?:()=>void)=>void;
    //     ClosePageAnimation:(onComplete?:()=>void)=>void;
    // }
    var cameraPosition:Vector2;
    var GoTo:(pageName:string, openInstantly:boolean)=>void;
    var OpenPageAnimation:(onComplete?:()=>void)=>void;
    var ClosePageAnimation:(onComplete?:()=>void)=>void;
}