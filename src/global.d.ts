import {Page, Vector2} from "./objects" 
export {};

declare global {
    var world:HTMLElement;
    // var destinationPanel:HTMLElement;
    /** @description Position de la camera (permettant de 
     * calculer l'affichage du world et des astres) */
    var cameraPosition:Vector2;
    var actualPage:Page;
    var pages:Page[];
    var Route:(pageName:string, openInstantly:boolean)=>void;
    var ToggleMenu:()=>void;
    var TogglePageAnimation:()=>void;
    var OpenPageAnimation:(onComplete?:()=>void)=>void;
    var ClosePageAnimation:(onComplete?:()=>void)=>void;
}
