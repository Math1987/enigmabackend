(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{jkDv:function(t,e,n){"use strict";n.r(e),n.d(e,"AdminModule",(function(){return d}));var o=n("ofXK"),i=n("tyNb"),r=n("fXoL"),a=n("q6HN");let c=(()=>{class t{constructor(t,e){this.adminService=t,this.router=e,this.test="bonjour"}ngOnInit(){}connect(t,e){console.log("connect",t,e),this.adminService.login(t,e,t=>{t||alert("Vos identifiants ne sont pas correct.")})}}return t.\u0275fac=function(e){return new(e||t)(r.Mb(a.a),r.Mb(i.b))},t.\u0275cmp=r.Gb({type:t,selectors:[["app-admin"]],decls:8,vars:0,consts:[["type","text","placeholder","admin"],["admin",""],["type","password","placeholder","mot de passe"],["password",""],[3,"click"]],template:function(t,e){if(1&t){const t=r.Tb();r.Sb(0,"form"),r.Nb(1,"input",0,1),r.Nb(3,"input",2,3),r.Rb(),r.Sb(5,"button",4),r.ac("click",(function(){r.pc(t);const n=r.nc(2),o=r.nc(4);return e.connect(n.value,o.value)})),r.xc(6,"ok"),r.Rb(),r.Nb(7,"router-outlet")}},directives:[i.e],styles:[""]}),t})();var s=n("lJxs");let l=(()=>{class t{constructor(t,e){this.adminService=t,this.router=e}canActivate(t,e){return this.adminService.getAdmin().pipe(Object(s.a)(e=>(console.log("ACCOUNT READ IN ADMIN",e),e?(t.url[0].path=e.admin,!0):(this.router.navigate(["/admin/login"]),!0))))}}return t.\u0275fac=function(e){return new(e||t)(r.Wb(a.a),r.Wb(i.b))},t.\u0275prov=r.Ib({token:t,factory:t.\u0275fac,providedIn:"root"}),t})();const u=i.d.forChild([{path:"login",component:c,canActivate:[(()=>{class t{constructor(t,e){this.adminService=t,this.router=e}canActivate(t,e){return this.adminService.getAdmin().pipe(Object(s.a)(t=>(console.log("ACCOUNT READ IN ADMIN",t),!t||(this.router.navigate(["/admin/main"]),!0))))}}return t.\u0275fac=function(e){return new(e||t)(r.Wb(a.a),r.Wb(i.b))},t.\u0275prov=r.Ib({token:t,factory:t.\u0275fac,providedIn:"root"}),t})()]},{path:":admin",canActivate:[l],loadChildren:()=>Promise.all([n.e(1),n.e(8)]).then(n.bind(null,"X2qB")).then(t=>t.MainModule)},{path:"**",redirectTo:"login",pathMatch:"full"}]);let d=(()=>{class t{}return t.\u0275mod=r.Kb({type:t}),t.\u0275inj=r.Jb({factory:function(e){return new(e||t)},imports:[[o.c,u]]}),t})()},q6HN:function(t,e,n){"use strict";n.d(e,"a",(function(){return l}));var o=n("jtHE"),i=n("AytR"),r=n("fXoL"),a=n("tk/3"),c=n("hrsj"),s=n("tyNb");let l=(()=>{class t{constructor(t,e,n){this.http=t,this.tokenService=e,this.router=n,this.admin=new o.a,this.actualAdmin=null,this.admin.subscribe(t=>{this.actualAdmin=t}),console.log("look for admin token",this.tokenService.getToken()),this.tokenService.getToken()?this.http.post(`${i.a.apiURL}/admin/readToken`,{token:this.tokenService.getToken()}).subscribe(t=>{console.log("adminRes",t),this.admin.next(t)}):this.admin.next(null)}login(t,e,n){this.http.post(`${i.a.apiURL}/admin/login`,{user:t,password:e}).subscribe(t=>{console.log(t),t&&t.token?(this.tokenService.setToken(t.token),this.router.navigate(["/admin/main"]),document.location.reload(),n(!0)):n(!1)},t=>{console.log(t),n(!1)})}logOut(){this.tokenService.removeToken(),localStorage.removeItem("token"),this.admin.next(null),this.router.navigate(["/admin/login"]),document.location.reload()}getAdmin(){return this.admin}getWorlds(){return this.http.get(`${i.a.apiURL}/admin/getWorlds`)}updateWorldValue(t,e,n,o,r){console.log("update world value",o),this.http.post(`${i.a.apiURL}/admin/updateWorldValue`,{worldName:t,target:e,key:n,value:o}).subscribe(t=>{r(t)},t=>{console.log("err",t)})}}return t.\u0275fac=function(e){return new(e||t)(r.Wb(a.b),r.Wb(c.a),r.Wb(s.b))},t.\u0275prov=r.Ib({token:t,factory:t.\u0275fac,providedIn:"root"}),t})()}}]);