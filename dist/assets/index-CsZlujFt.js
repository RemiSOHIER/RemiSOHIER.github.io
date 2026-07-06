var H=Object.defineProperty;var G=(s,e,i)=>e in s?H(s,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):s[e]=i;var l=(s,e,i)=>G(s,typeof e!="symbol"?e+"":e,i);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))n(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function i(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerPolicy&&(r.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?r.credentials="include":t.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(t){if(t.ep)return;t.ep=!0;const r=i(t);fetch(t.href,r)}})();class O{constructor(){l(this,"name","");l(this,"star",new k);l(this,"html","")}}class S{constructor(e,i){l(this,"x",0);l(this,"y",0);this.x=e??0,this.y=i??0}}class b extends S{constructor(i,n,t){super(i,n);l(this,"z",0);this.z=t??0}}function I(s,e){const i=e.x-s.x,n=e.y-s.y;if(s instanceof b&&e instanceof b){const t=e.z-s.z;return Math.sqrt(i*i+n*n+t*t)}return Math.sqrt(i*i+n*n)}class B{constructor(){l(this,"position",new S);l(this,"dataStored",[])}}class E{constructor(e,i,n){l(this,"r",255);l(this,"g",255);l(this,"b",255);this.r=e??255,this.g=i??255,this.b=n??255}}class k{constructor(e,i,n,t,r){l(this,"position",new b);l(this,"temperature",2e3);l(this,"intensity",1);l(this,"color",new E);l(this,"radius",10);this.position=e??new b,this.temperature=i??2e3,this.intensity=n??1,this.color=t??new E,this.radius=r??10}Init(){this.temperatureToRGB(this.temperature),this.temperatureToIntensity()}GenerateRandom(){this.temperature=2e3+Math.random()*1e4,this.position.z=Math.random()*.25,this.Init()}temperatureToRGB(e){const i=e/100;let n,t,r;i<=66?n=255:(n=i-60,n=329.698727446*Math.pow(n,-.1332047592),n=Math.max(0,Math.min(255,n))),i<=66?t=99.4708025861*Math.log(i)-161.1195681661:(t=i-60,t=288.1221695283*Math.pow(t,-.0755148492)),t=Math.max(0,Math.min(255,t)),i>=66?r=255:i<=19?r=0:(r=i-10,r=138.5177312231*Math.log(r)-305.0447927307,r=Math.max(0,Math.min(255,r))),this.color.r=Math.round(n),this.color.g=Math.round(t),this.color.b=Math.round(r)}temperatureToIntensity(){const e=(this.temperature-2e3)/1e4;this.intensity=Math.pow(e,.6)}}class z{constructor(e){l(this,"canvas");l(this,"ctx");l(this,"starChunks",[]);l(this,"chunkSize",1e3);l(this,"starNumberByChunks",200);l(this,"generationQueue",[]);l(this,"chunkPerFrame",2);l(this,"updateOnProgress",!1);l(this,"fps",50);l(this,"updateInterval",1e3/this.fps);l(this,"update",()=>{this.ProcessGenerationQueue(),this.PreRender(),(this.updateOnProgress||this.generationQueue.length>0)&&setTimeout(()=>this.update(),this.updateInterval)});this.canvas=e,this.ctx=e.getContext("2d"),this.GenerateChunks(),this.resize(),window.addEventListener("resize",()=>{this.resize(),this.PreRender(),this.OnResizeUpdatePositionStarPage()}),world.addEventListener("animationend",i=>{const n=i.target,t=n.parentElement,r=t.getAttribute("data-pageName");if(!n.classList.contains("eruption")||(n.remove(),!actualPage==null||pages.length==0||r==null))return;const a=pages.find(o=>o.name.toLowerCase()==r.toLowerCase());a&&t.appendChild(this.GetNewEruption(a))}),this.update()}GoToWorldCoordinateAnimation(e,i=1200,n){this.updateOnProgress=!0,this.update(),i==0&&(cameraPosition.x+=e.x,cameraPosition.y+=e.y,this.renderUI(),n&&n(),this.updateOnProgress=!1);const t=cameraPosition.x,r=cameraPosition.y,a=e.x-t,o=e.y-r,c=performance.now(),m=x=>{const p=Math.min((x-c)/i,1),R=p*p*(3-2*p);cameraPosition.x=t+a*R,cameraPosition.y=r+o*R,this.renderUI(),p<1?requestAnimationFrame(m):(n&&n(),this.updateOnProgress=!1)};requestAnimationFrame(m)}renderUI(){world&&(world.style.transform=`translate(${-cameraPosition.x}px, ${-cameraPosition.y}px)`)}GenerateStarPages(){world&&(world.innerHTML="",pages.forEach(e=>{const i=e.star.position.x+world.clientWidth/2+window.innerWidth/2-e.star.radius/2,n=e.star.position.y+world.clientHeight/2+window.innerHeight/2-e.star.radius/2,t=e.star.temperature==0?{r:0,g:0,b:0}:e.star.color,r=e.star.temperature==0?{r:255,g:255,b:255}:t,a=`rgb(${t.r}, ${t.g}, ${t.b})`,o=document.createElement("div");o.className="star",o.setAttribute("data-pageName",e.name),o.style.top=`${n}px`,o.style.left=`${i}px`,o.style.width=`${e.star.radius}px`,o.style.height=`${e.star.radius}px`,e.star.temperature==0?o.style.background="black":o.style.background=`
                    radial-gradient(
                        circle,
                        white 0%, 
                        ${a} 80%, 
                        transparent 100%
                    )`,o.style.boxShadow=`
                0 0 10px rgba(${r.r},${r.g},${r.b},0.9),
                0 0 25px rgba(${r.r},${r.g},${r.b},0.6),
                0 0 50px rgba(${r.r},${r.g},${r.b},0.3),
                0 0 100px rgba(${r.r},${r.g},${r.b},0.15)
                `,e.star.temperature>0&&(o.appendChild(this.GetNewEruption(e,0)),o.appendChild(this.GetNewEruption(e,0)),o.appendChild(this.GetNewEruption(e,0)),o.appendChild(this.GetNewEruption(e)),o.appendChild(this.GetNewEruption(e))),world.appendChild(o)}))}OnResizeUpdatePositionStarPage(){Array.from(world.children).forEach(t=>{const r=t.getAttribute("data-pageName");if(!r)return;const a=pages.find(o=>o.name.toLowerCase()==r.toLowerCase());if(a){const o=a.star.position.x+world.clientWidth/2+window.innerWidth/2-a.star.radius/2,c=a.star.position.y+world.clientHeight/2+window.innerHeight/2-a.star.radius/2;t.style.left=o+"px",t.style.top=c+"px"}});const e=document.getElementById("eclipse");if(!e)return;const i=window.innerWidth/2-actualPage.star.radius/2,n=window.innerHeight/2-actualPage.star.radius/2;e.style.left=i+"px",e.style.top=n+"px"}GetNewEruption(e,i=Math.random()*10){if(actualPage==null)return document.createElement("div");const n=e.star.color,t=Math.random()*360,r=Math.random()*50,a=Math.max(Math.random()*50,45),o=Math.max(Math.random()*30,20),c=document.createElement("div");return c.classList.add("eruption"),c.style.background=`
            radial-gradient(
                ellipse at bottom,
                transparent 45%,
                rgba(${n.r},${n.g},${n.b},1.3) 70%,
                rgba(${n.r},${n.g},${n.b},0.95) 85%,
                transparent 90%
            )`,c.style.boxShadow=`
            0 0 5px rgba(${n.r},${n.g},${n.b},0.9),
            0 0 15px rgba(${n.r},${n.g},${n.b},0.6),
            0 0 30px rgba(${n.r},${n.g},${n.b},0.3),
            0 0 60px rgba(${n.r},${n.g},${n.b},0.15)
            `,c.style.height=`${a}%`,c.style.width=`${o}%`,c.style.rotate=`${t}deg`,c.style.animationDelay=`${i}s`,c.style.animationDuration=`${r}s`,c}async GenerateChunks(){const i=Math.floor(5);for(let n=0;n<10;n++)for(let t=0;t<10;t++){const r={x:n-i,y:t-i};this.generationQueue.push(r)}}ProcessGenerationQueue(){let e=0;for(;this.generationQueue.length>0&&e<this.chunkPerFrame;){const i=this.generationQueue.shift();if(!i)return;this.GenerateChunkStars(i,this.chunkSize),e++}}async GenerateChunkStars(e,i){let n=[];for(let r=0;r<this.starNumberByChunks;r++){let a=new k;a.GenerateRandom();const o=e.x*i+Math.random()*i,c=e.y*i+Math.random()*i;a.position.x=o,a.position.y=c,a.radius=Math.random()*1.5+.5,n.push(a)}let t=new B;t.position=e,t.dataStored=n,this.starChunks.push(t)}PreRender(){this.ctx.fillStyle="#000",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);const e=Math.floor(cameraPosition.x/this.chunkSize*.25),i=Math.floor(cameraPosition.y/this.chunkSize*.25),n=2;for(let t=0;t<this.starChunks.length;t++){const r=this.starChunks[t];r&&(Math.abs(r.position.x-e)>n||Math.abs(r.position.y-i)>n||this.RenderStars(r))}}RenderStars(e){e.dataStored.forEach(i=>{const n=`rgb(${i.color.r}, ${i.color.g}, ${i.color.b})`,t=i.position.z,r=cameraPosition.x*t,a=cameraPosition.y*t,o=i.position.x-r,c=i.position.y-a,m=i.intensity??1,x=2+m*12,p=.2+m*.8;this.ctx.shadowBlur=x,this.ctx.shadowColor=n,this.ctx.fillStyle=`rgba(${i.color.r}, ${i.color.g}, ${i.color.b}, ${p})`,this.ctx.beginPath(),this.ctx.arc(o,c,i.radius*1,0,Math.PI*2),this.ctx.fill()})}resize(){const e=Math.min(window.devicePixelRatio||1,2);this.canvas.width=window.innerWidth*e,this.canvas.height=window.innerHeight*e,this.canvas.style.width=window.innerWidth+"px",this.canvas.style.height=window.innerHeight+"px",this.ctx.setTransform(1,0,0,1,0,0),this.ctx.scale(e,e)}}const U=`<h1>Accueil</h1>\r
<section class="top">\r
    Je construis des systèmes logiciels orientés architecture, \r
    performance et logique métier.\r
</section>\r
<section class="left">\r
    <h3>Ce que j'aime développer</h3>\r
    <ul>\r
        <li>Applications utiles</li>\r
        <li>Architectures backend / structure des données</li>\r
        <li>Outils métier</li>\r
        <li>Simulations</li>\r
        <li>Jeux de strategie</li>\r
    </ul>\r
</section>\r
<section class="right">\r
    <h3>Ma façon de travailler</h3>\r
    <ul>\r
        <li>Concevoir avant de coder</li>\r
        <li>Développer des solutions maintenables</li>\r
        <li>Privilégier les architectures modulaires</li>\r
        <li>Faire évoluer les projets quand c’est pertinent</li>\r
        <li>Apprendre par la pratique</li>\r
    </ul>\r
</section>\r
<section>\r
    <h3>Technologies que je manipule</h3>\r
    <div class="row">\r
        <ul>\r
            <h4>Frontend:</h4>\r
            <li><iconify-icon icon="skill-icons:typescript"></iconify-icon>Typescript</li>\r
            <li><iconify-icon icon="devicon:angular"></iconify-icon>Angular</li>\r
            <li><iconify-icon icon="vscode-icons:file-type-scss"></iconify-icon>SCSS</li>\r
            <li><iconify-icon icon="skill-icons:html"></iconify-icon>HTML</li>\r
            <li><iconify-icon icon="skill-icons:css"></iconify-icon>CSS</li>\r
        </ul>\r
        <ul>\r
            <h4>Backend:</h4>\r
            <li><iconify-icon icon="skill-icons:typescript"></iconify-icon>Typescript</li>\r
            <li><iconify-icon icon="bxl:express-js"></iconify-icon>Express</li>\r
            <li><iconify-icon icon="logos:typeorm"></iconify-icon>TypeORM</li>\r
            <li><iconify-icon icon="devicon:sqlite"></iconify-icon>SQLite</li>\r
            <li><iconify-icon icon="logos:mysql"></iconify-icon>MySQL</li>\r
        </ul>\r
        <ul>\r
            <h4>Gamedev:</h4>\r
            <li><iconify-icon icon="mdi:unreal-engine"></iconify-icon>Unreal engine 5.7</li>\r
            <li><iconify-icon icon="ph:blueprint"></iconify-icon>Blueprints (Unreal engine)</li>\r
            <li><iconify-icon icon="icon-park:material"></iconify-icon>Materials shader (Unreal engine)</li>\r
            <li><iconify-icon icon="devicon:cplusplus"></iconify-icon>C++ (Unreal engine)</li>\r
        </ul>\r
    </div>\r
</section>\r
<section>\r
    <h3>Plus d'infos sur mon portfolio</h3>\r
    <h4>\r
        La navigation spatiale\r
        <iconify-icon icon="material-symbols:planet-outline"></iconify-icon> \r
    </h4>\r
    <div class="row">\r
        <ul>\r
            <h4>Elle est directement liée à mon univers:</h4>\r
            <li>Passion pour l’espace et les systèmes physiques</li>\r
            <li>\r
                Génération d’astres basés sur des données physiques \r
                (par exemple, la couleur des étoiles dépend de leur température)\r
            </li>\r
            <li>\r
                Développement d’un RTS spatial en parallèle, qui influence \r
                naturellement l’identité de ce portfolio\r
            </li>\r
        </ul>\r
        <ul>\r
            <h4>Technologies utilisées pour ce portfolio:</h4>\r
            <li><iconify-icon icon="skill-icons:typescript"></iconify-icon>Typescript</li>\r
            <li><iconify-icon icon="skill-icons:html"></iconify-icon>HTML</li>\r
            <li><iconify-icon icon="vscode-icons:file-type-scss"></iconify-icon>SCSS</li>\r
            <li><iconify-icon icon="skill-icons:css"></iconify-icon>CSS</li>\r
        </ul>\r
    </div>\r
</section>\r
<section class="left">\r
    <h3>En savoir plus</h3>\r
    <button onclick="Route('Projets')">Mes projets</button>\r
    <button onclick="Route('Parcours')">Mon parcours</button>\r
</section>`,N=`<h1>Erreur</h1>\r
<section>\r
    <div class="warn">Page introuvable</div>\r
</section>`,D=`<h1>Parcours</h1>\r
<section>\r
    <h3>Un parcours atypique</h3>\r
    J’ai un parcours initial en dehors de l’informatique, \r
    avec un CAP cuisine. Mon intérêt pour le développement est \r
    né de manière autodidacte, porté par l’envie de créer \r
    des outils, automatiser des tâches et concevoir des applications.\r
</section>\r
<section>\r
    <h3>Mes débuts dans le développement</h3>\r
    J’ai réellement commencé à développer en 2020 avec la création \r
    de mon premier site web. Cette étape m’a permis d’apprendre \r
    les bases du HTML, CSS et PHP.\r
</section>\r
<section>\r
    <h3>Du web statique aux architectures modernes</h3>\r
    Par la suite, j’ai progressivement fait évoluer ce projet \r
    en explorant Symfony, puis JavaScript et TypeScript. \r
    Cela m’a conduit à reconstruire mon site avec une \r
    architecture plus complète, incluant un back-end en \r
    Express (TypeScript) et un front-end en Angular, \r
    avec une interface d’administration. \r
    Cette expérience m’a permis de consolider mes compétences \r
    sur des architectures web modernes.\r
</section>\r
<section>\r
    <h3>Progressive Web Apps</h3>\r
    J’ai ensuite développé plusieurs Progressive Web Apps, \r
    afin de rendre mes applications installables et utilisables \r
    sur différents supports directement depuis le navigateur.\r
    <button onclick="Route('Projets')">Voir les projets</button>\r
</section>\r
<section>\r
    <h3>Outil d'aide à la productivité</h3>\r
    Au fil du temps, j’ai conçu plusieurs outils orientés \r
    productivité et usage réel, notamment un outil d’aide à la \r
    gestion de tâches et de rappels que j'utilise \r
    à mon travail, intégrant notifications et suivi temporel.\r
    <button onclick="Route('Projets')">Voir les projets</button>\r
</section>\r
<section>\r
    <h3>Projet SaaS</h3>\r
    En janvier 2025, j’ai commencé à développer un projet \r
    SaaS de gestion de planning et de temps de travail en temps réel.\r
    Bien que ce projet ait permis d’explorer plusieurs \r
    problématiques liées au développement web, il est aujourd’hui \r
    en pause depuis que j’ai choisi de consacrer l’essentiel \r
    de mon temps à un projet qui me tenait particulièrement à cœur: \r
    <br>\r
    le développement d’un jeu de stratégie spatial sous \r
    Unreal Engine 5.\r
</section>\r
<section>\r
    <h3>RTS 4X spatial sous Unreal Engine 5</h3>\r
    Depuis août 2025, je développe un projet personnel de jeu \r
    de stratégie spatial (RTS 4X) sous Unreal Engine 5, \r
    majoritairement en C++ afin de concevoir une architecture de \r
    gameplay plus maîtrisée et extensible.\r
    <br>\r
    Ce projet constitue un environnement d’expérimentation autour \r
    de systèmes temps réel complexes, incluant notamment \r
    la génération procédurale d’univers, la simulation de systèmes \r
    dynamiques, la gestion d’événements in-game, \r
    ainsi que des mécanismes d’organisation spatiale et \r
    de streaming de contenu.\r
    <br><br>\r
    Réalisé dans un contexte de ressources limitées, \r
    il m’a conduit à accorder une attention particulière à \r
    l’optimisation, à la structuration des systèmes et à leur \r
    scalabilité dès la phase de conception.\r
    Plusieurs sous-systèmes sont déjà opérationnels, notamment \r
    la génération procédurale de l’univers, \r
    des systèmes de simulation, des interfaces de base, \r
    ainsi que des contenus originaux tels que les vaisseaux, \r
    le scénario et la musique.\r
    <br><br>\r
    Sur le plan du gameplay, le projet explore également plusieurs \r
    mécaniques rarement mises en avant dans les RTS 4X traditionnels, \r
    notamment la survie face à des civilisations technologiquement \r
    supérieures, la gestion de la discrétion à l'échelle spatiale et \r
    les conséquences à long terme des choix technologiques du joueur.\r
    <button onclick="Route('Projets')">Voir les projets</button>\r
</section>\r
<section>\r
    <h3>Aujourd’hui</h3>\r
    Aujourd’hui, je poursuis principalement le développement de \r
    ce projet de jeu tout en continuant à améliorer mes compétences \r
    techniques et mon approche produit.\r
    Ce parcours reflète une évolution autodidacte, progressive \r
    et orientée vers la création de projets concrets, \r
    allant du web au développement temps réel.\r
</section>`,W=`<h1>Projets</h1>\r
<section>\r
    <h3>\r
        <img src="/projets/ProjetRTS_4X_Spatial/Bannière.png" style="width:100px;" loading="lazy">\r
        Projet RTS 4X Spatial\r
    </h3>\r
    Depuis août 2025 je me suis lancé au défi de créer\r
    un jeu de stratégie spatial en temps réel sur un PC qui à \r
    la base n'est pas concu pour jouer ou créer des jeux.\r
    <br><br>\r
    • Génération procédurale de l’univers et rendu adaptatif \r
    selon la caméra<br>\r
    • Carte unique en 3D sans écrans de chargement lors de la \r
    navigation spatiale<br>\r
    • Premiers systèmes de logique gameplay déjà en place\r
    Le projet explore progressivement des mécaniques \r
    inspirées de concepts comme l’échelle de Kardashev et \r
    le paradoxe du grand filtre, avec des systèmes de gameplay \r
    pensés autour de menaces asymétriques et d’effets de \r
    décision à long terme sur la survie des civilisations.\r
    Je maintiens une roadmap évolutive au fur et à mesure de \r
    l’avancement du projet.\r
    <br><br>\r
    <div class="row">\r
        <img src="/projets/ProjetRTS_4X_Spatial/systeme.png" style="width:400px;" loading="lazy">\r
        <img src="/projets/ProjetRTS_4X_Spatial/menu.png" style="width:400px;" loading="lazy">\r
    </div>\r
    <br><br>\r
    <button onclick="Route('https://highfalutin-stem-ecc.notion.site/Roadmap-Projet-RTS-4X-spatial-39329cbaf31d8088b1b6d018a9ed641e')">Voir la roadmap</button>\r
</section>\r
<section>\r
    <h3>\r
        <iconify-icon class="iconSVG" icon="material-symbols:edit"></iconify-icon>\r
        Outil notes et rappels\r
    </h3>\r
    Outil personnel de productivité développé pour faciliter mon \r
    travail au quotidien en centre d'appels. Il permet la prise \r
    de notes, le suivi des interventions, la gestion des rappels \r
    et la génération de modèles de mails. \r
    Les données sont entièrement stockées en \r
    local dans le navigateur de l'utilisateur.\r
    <br><br>\r
    <button onclick="Route('/projets/OutilRappels/Notes Appels.html')">Ouvrir la page</button>\r
</section>\r
<section>\r
    <h3>\r
        <img src="/projets/MesCoursesSereines/assets/icons/icon-128.webp" style="width:50px;" loading="lazy">\r
        Mes courses sereines\r
    </h3>\r
    Application de gestion de listes de courses \r
    conçue pour faciliter les achats du quotidien. \r
    Elle permet de créer, modifier et organiser \r
    plusieurs listes à partir d'articles prédéfinis, \r
    entièrement personnalisables et classés par \r
    catégories.\r
    <br><br>\r
    Pendant les courses, l'application accompagne \r
    l'utilisateur en affichant en temps réel le montant \r
    des articles déjà sélectionnés ainsi que le montant \r
    restant de la liste. Si le prix réel d'un article \r
    diffère de celui estimé lors de la préparation de la \r
    liste, le total est automatiquement recalculé afin \r
    de fournir une estimation toujours à jour du coût final.\r
    <br><br>\r
    Cette application est une Progressive Web App (PWA). \r
    Elle peut être installée directement depuis un \r
    navigateur sur différents appareils. \r
    Toutes les données sont stockées localement sur \r
    l'appareil de l'utilisateur, permettant une \r
    utilisation complète sans connexion Internet \r
    une fois l'application installée.\r
    <br><br>\r
    <button onclick="Route('/projets/MesCoursesSereines/index.html')">Ouvrir l'application</button>\r
</section>`,F=`<h1>Réseaux</h1>\r
<section>\r
    <h4>\r
        <button onclick="Route('https://www.linkedin.com/in/remi-sohier/')">Linkedin</button>\r
    </h4>\r
    <h4>\r
        <button onclick="Route('https://github.com/RemiSOHIER?tab=repositories')">Github</button>\r
    </h4>\r
</section>`,X=`<h1>Mentions Légales</h1>\r
<section>\r
    <h3>Éditeur du site</h3>\r
    Rémi SOHIER\r
    <button onclick="Route('Contact')">Me contacter</button>\r
</section>\r
<section>\r
    <h3>Hébergement</h3>\r
    GitHub, Inc.\r
    88 Colin P. Kelly Jr. Street\r
    San Francisco, CA 94107\r
    États-Unis\r
    <button onclick="Route('https://github.com')">Github</button>\r
</section>\r
<section>\r
    <h3>Propriété intellectuelle</h3>\r
    Le contenu du site (textes, projets, code) \r
    est la propriété de son auteur sauf \r
    mention contraire.\r
</section>`,Q=`<iframe\r
    src="https://forms.gle/dYCkxssewKVtKqir6?embedded=true"\r
    width="100%"\r
    height="100%"\r
    frameborder="0"\r
    marginheight="0"\r
    marginwidth="0">\r
</iframe>`,P="Rémi SOHIER",d=document.getElementById("destinationPanel"),g=document.getElementById("destinationPanelList"),f=document.getElementById("destinationsBar"),M=document.getElementById("menu"),w=document.getElementById("world"),u=document.getElementById("page"),J=document.getElementById("canvas"),L=()=>window.matchMedia("(max-width: 768px)").matches,V=`https://api.iconify.design/material-symbols/planet-outline.svg?color=${encodeURIComponent("#659bff")}`;let h=document.querySelector("link[rel='icon']");h||(h=document.createElement("link"),h.rel="icon",document.head.appendChild(h));h.type="image/svg+xml";h.href=V;w&&(globalThis.world=w);d&&d.addEventListener("click",()=>{$()});let T=!1;globalThis.cameraPosition=new S;const j=new z(J);_();async function _(){const e=await(await fetch("/data/pageDestination.json")).json();if(e==null)throw new Error("pages list not found");const i=Object.assign([],e.map(n=>{const t=Object.assign(new O,n);switch(t.star=new k(n.star.position,n.star.temperature,n.star.intensity,n.star.color,n.star.radius),t.star.Init(),t.name){case"Accueil":t.html=U;break;case"Erreur":t.html=N;break;case"Parcours":t.html=D;break;case"Projets":t.html=W;break;case"Réseaux":t.html=F;break;case"Mentions-légales":t.html=X;break;case"Contact":t.html=Q;break}return t}));globalThis.pages=i,!(!g||!f)&&(g.innerHTML="",f.innerHTML="",w&&(C(!0),j.GenerateStarPages(),window.addEventListener("resize",()=>{A()})))}function A(){!g||!f||!M||(g.innerHTML="",f.innerHTML="",L()?M.style.scale="1":M.style.scale="0",pages.forEach((s,e)=>{actualPage.name!=s.name&&s.name!="Erreur"&&(L()?g.innerHTML+=`<button tabindex="${e}"
                onClick="Route('${s.name}')">${s.name}</button>`:f.innerHTML+=`<button tabindex="${e}"
                onClick="Route('${s.name}')">${s.name}</button>`)}))}async function q(){!u||!w||(actualPage.html!=null&&(u.innerHTML=actualPage.html),A())}function K(s,e=!1){s.includes("http")||s.includes("projet")?window.open(s,"_blank"):window.location.hash.replace(/^#\/?/,"")!=s&&(s=="Accueil"&&(s=""),window.location.hash="/"+s),C(e)}globalThis.Route=K;window.addEventListener("hashchange",()=>{C()});function C(s=!1){let e=decodeURIComponent(window.location.hash).replace(/^#\/?/,"");(e==""||e=="/")&&(e="Accueil");const i=pages.find(n=>n.name.toLowerCase()==e.toLowerCase());if(i)globalThis.actualPage=i,actualPage.name=="Accueil"?document.title=P:document.title=P+" - "+actualPage.name;else{const n=pages.find(t=>t.name.toLowerCase()=="erreur");if(!n)throw new Error("La page d'érreur est introuvable");globalThis.actualPage=n,document.title=P+" - page introuvable"}$(!1),s?(y(),j.GoToWorldCoordinateAnimation(actualPage.star.position,0),q()):v(()=>{if(!u)return;u.innerHTML="";const n=I(cameraPosition,actualPage.star.position),a=Math.sqrt(n)*500/15;j.GoToWorldCoordinateAnimation(actualPage.star.position,a,()=>{y(),q()})})}function Y(){d&&(d.style.scale=="1"?$():Z())}globalThis.ToggleMenu=Y;function $(s=!0){d&&(d.style.scale="0",s&&y())}function Z(){d&&(d.style.scale="1",v())}function ee(){T?v():y()}globalThis.TogglePageAnimation=ee;function v(s){u&&(u.style.scale="0",T=!1,setTimeout(()=>{s&&s(),u.style.pointerEvents="none"},500))}globalThis.ClosePageAnimation=v;function y(s){u&&(u.style.pointerEvents="all",u.style.scale="1",T=!0,setTimeout(()=>{s&&s()},500))}globalThis.OpenPageAnimation=y;
