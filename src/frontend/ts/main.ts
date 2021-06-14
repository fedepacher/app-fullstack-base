class Main implements EventListenerObject, HandlerPOST{//esto ultimo me obliga a implementar un handler 
    //handleEvent y ahora al addEventListener del windows.load le paso un objeto en lugar de hacer una funcion anonima 
    public myframework: MyFramework;
    constructor(){
        this.myframework = new MyFramework();
    }

    public handleEvent(ev: Event) {
        alert("Se hizo click");
        /* console.log(this);
        alert("Se imprime el evento en pantalla");
        console.log(ev); */

        let objetoClick:HTMLElement = <HTMLInputElement> ev.target;//lo castea, esto obtiene que boton produjo el evento
        if(objetoClick.textContent == "Click")
        {
            //objetoClick.textContent = "btn pulsado";
            //console.log("se pulso");
            let xhr:XMLHttpRequest = new XMLHttpRequest();//peticion ajax
            xhr.onreadystatechange = ()=>{
                //se ejecuta cuando llega la respuesta
                if(xhr.readyState == 4){//aca es ==4 porque esto se procesa 4 veces (el onreadystatechange avisa todo los cambios), 1ro que se envia la rta con el open ==1, con el 2 que el servidor recibio la respuesta, el 3 el servidor procesa la rta y 4 que ya tenenmos la respuesta lista para consumir 
                    if(xhr.status == 200){//200 que es ok
                        console.log("Llego la respuesta");
                        console.log(xhr.responseText);
                        
                        let listaDis: Array<Device> = JSON.parse(xhr.responseText);//convertimos a json
                        
                        for(let disp of listaDis){
                            let listaDisp = this.myframework.getElementById("listaDis");
                            listaDisp.innerHTML += `<li class="collection-item avatar">
                                <img src="./static/images/bulb.jpg" alt="" class="circle">
                                <span class="nombreDisp">${disp.name}</span>
                                <p>${disp.description}
                                </p>
                                <a href="#!" class="secondary-content">
                                    <div class="switch">
                                        <label>
                                        Off
                                        <input id="disp_${disp.id}" type="checkbox">
                                        <span class="lever"></span>
                                        On
                                        </label>
                                    </div>
                                </a>
                                </li>`
                            console.log(disp.name + "-" + disp.description);
                        } 
                        for(let disp of listaDis){
                            let checkDisp = this.myframework.getElementById("disp_" + disp.id);
                            checkDisp.addEventListener("click", this)    
                        }
                    }
                    else{
                        alert("Error");
                    }
                }
            } 
            xhr.open("GET", "http://localhost:8000/devices", true);//en true hace que se ejecute en otro hilo (sincronico), entonces no se bloquea, esto lo permite ajax
            xhr.send();
            console.log("ya hice el request")

        }
        else
        {
            let checkBox:HTMLInputElement = <HTMLInputElement> ev.target;//lo castea, esto obtiene que boton produjo el evento
            alert(checkBox.id + " - " + checkBox.checked);
            let datos = {"id":checkBox.id, "status":checkBox.checked};
            this.myframework.requestPOST("http://localhost:8000/devices", this, datos)
        }
        
    }   

    public responsePost(status:number, response:string):void{
         alert(response);
    }

    public main() : void{
        console.log("Se ejecuto el metodo main!!!")
        
        
    }

    public mostrarLista(){
        let listaUser:Array<User> = new Array<User>();
        
        let usr1 = new User(1, "fede", "fede@fede", true);
        let usr2 = new User(2, "jose", "jose@jose", true);
        let usr3 = new User(3, "pepe", "pepe@pepe", true);
        listaUser.push(usr1);
        listaUser.push(usr2);
        listaUser.push(usr3);        
        for(let obj in listaUser){
            listaUser[obj].printInfo();
        }
    }

    //public getElementById() : HTMLElement{
    //    return document.getElementById("boton");//hace referencia al documento html
    //}

}

/*
esta onload hace que la pagina se cargue por completo asi si hay 
error se detecta antes de abrir la pagina, sino va cargando y cuando
encuentra el error salta.
Punto de entrada seria esto
*/
window.addEventListener("load", ()=>{//esto es lo mismo que lo de abajo
//window.onload = function ejecutar(){ 
    let myObjMain: Main = new Main();
    myObjMain.main();
    let boton: HTMLElement = myObjMain.myframework.getElementById("boton");//obtiene el boton de la pantalla
    //boton.textContent = "Listar";//cambia el texto del boton
    boton.addEventListener("click", myObjMain);//al pasarle el objeto y como la clase implementa la interfase, esta interfase le obliga a implemtanra el evento para este listener    

    let btnCerrar: HTMLElement = myObjMain.myframework.getElementById("btnCerrar");
    btnCerrar.addEventListener("dblclick", myObjMain);
});