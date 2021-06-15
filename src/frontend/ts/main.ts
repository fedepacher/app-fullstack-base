class Main implements EventListenerObject, HandlerPOST{
    listaDis: Array<Device>;
    public myframework: MyFramework;
    constructor(){
        this.myframework = new MyFramework();
    }

    public handleEvent(ev: Event) {
        //alert("Se hizo click");
        /* console.log(this);
        alert("Se imprime el evento en pantalla");
        console.log(ev); */

        let objetoClick:HTMLElement = <HTMLInputElement> ev.target;//lo castea, esto obtiene que boton produjo el evento
        switch(objetoClick.textContent)// == "Buscar")
        {
            //objetoClick.textContent = "btn pulsado";
            //console.log("se pulso");
            case "Editar":
                    //alert("Editar " + objetoClick.id);                    
                    
                break;

            case "Borrar":
                    alert("Borrar " + objetoClick.id);
                break;
            default:
                let checkBox:HTMLInputElement = <HTMLInputElement> ev.target;//lo castea, esto obtiene que boton produjo el evento
                alert(checkBox.id + " - " + checkBox.checked);
                let datos = {"id":checkBox.id, "status":checkBox.checked};
                this.myframework.requestPOST("http://localhost:8000/devices", this, datos)
                break;
        }
        
    }   


    /*
        @brief Carga los dispositivos almacenados en la base de datos
        @return void
    */ 
    public cargarDispositivos():void{
        let xhr:XMLHttpRequest = new XMLHttpRequest();//peticion ajax
        xhr.onreadystatechange = ()=>{
            //se ejecuta cuando llega la respuesta
            if(xhr.readyState == 4){//aca es ==4 porque esto se procesa 4 veces (el onreadystatechange avisa todo los cambios), 1ro que se envia la rta con el open ==1, con el 2 que el servidor recibio la respuesta, el 3 el servidor procesa la rta y 4 que ya tenenmos la respuesta lista para consumir 
                if(xhr.status == 200){//200 que es ok
                    //let listaDis: Array<Device> = JSON.parse(xhr.responseText);//convertimos a json
                    this.listaDis = JSON.parse(xhr.responseText);//convertimos a json

                    for(let disp of this.listaDis){
                        let listaDisp = this.myframework.getElementById("listaDis");
                        listaDisp.innerHTML += this.componentSelection(disp);
                    } 
                    for(let disp of this.listaDis){
                        //creo el listener para los botones edit y borrar
                        let checkDisp = this.createElementListener("disp_" + disp.id, "click");   
                        let boton_edit: HTMLElement = this.createElementListener("btn_edit" + disp.id, "click");
                        let boton_delet: HTMLElement = this.createElementListener("btn_delete" + disp.id, "click");
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
    /*
        @brief Crea evento a un elemento de tipo HTMLElement
        @param elementName  Nombre del elemento en html
        @param elementType  Tipo de evento (click, dblclick)
        @return elemento
    */ 
    private createElementListener(elementName : string, elementType : string) : HTMLElement{
        let elem: HTMLElement = this.myframework.getElementById(elementName);//obtiene el boton de la pantalla
        //boton.textContent = "Listar";//cambia el texto del boton
        elem.addEventListener(elementType, this);
        return elem;
    }

    /*
        @brief Crea un elemento en html segun el dispositivo
        @param disp Dispositivo de tipo Device 
        @return retorna string con elementoa  ser agregado en html
    */ 
    private componentSelection(disp : Device) : string{
        let resutl : string = '';
        let index : number = disp.name.indexOf(' ');
        if(index < 0)
            index = disp.name.length;
        let s_aux : string = disp.name.substring(0, index);
        switch(s_aux){
            case "Lámpara":
                resutl = `<li class="collection-item avatar">
                <img src="./static/images/bulb.jpg" alt="" class="circle">
                <span class="nombreDisp">${disp.name}</span>
                <p>${disp.description}</p>
                <a id=btn_edit${disp.id} class="waves-effect waves-light btn modal-trigger" href="#modal1">Editar</a>
                <a id=btn_delete${disp.id} class="waves-effect waves-light btn">Borrar</a>
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
                </li>`;
            break;
            case "Velador":
                resutl = `<li class="collection-item avatar">
                <img src="./static/images/velador.png" alt="" class="circle">
                <span class="nombreDisp">${disp.name}</span>
                <p>${disp.description}</p>
                <a id=btn_edit${disp.id} class="waves-effect waves-light btn modal-trigger" href="#modal1">Editar</a>
                <a id=btn_delete${disp.id} class="waves-effect waves-light btn">Borrar</a>
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
                </li>`;
            break;
            case "Persiana":
                resutl = `<li class="collection-item avatar">
                <img src="./static/images/images.png" alt="" class="circle">
                <span class="nombreDisp">${disp.name}</span>
                <p>${disp.description}</p>
                <a id=btn_edit${disp.id} class="waves-effect waves-light btn modal-trigger" href="#modal1">Editar</a>
                <a id=btn_delete${disp.id} class="waves-effect waves-light btn">Borrar</a>
                <a href="#!" class="secondary-content">
                    <form action="#">
                        <p class="range-field">
                            <input type="range" id=disp_${disp.id} min="0" max="100" />
                        </p>
                    </form>
                </a>
                </li>`;
            break;
            default:
                resutl = `<li class="collection-item avatar">
                <img src="./static/images/bulb.jpg" alt="" class="circle">
                <span class="nombreDisp">${disp.name}</span>
                <p>${disp.description}</p>
                <a id=btn_edit${disp.id} class="waves-effect waves-light btn modal-trigger" href="#modal1">Editar</a>
                <a id=btn_delete${disp.id} class="waves-effect waves-light btn">Borrar</a>
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
                </li>`;
            break;
        }
        
        
        


        return resutl;
    }   



    public responsePost(status:number, response:string):void{
         alert(response);
    }

    public main() : void{
        console.log("Se ejecuto el metodo main!!!")   
        this.cargarDispositivos();
    }

    /* public mostrarLista(){
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
    } */

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
    let boton: HTMLElement = myObjMain.myframework.getElementById("btn_new");//obtiene el boton de la pantalla
    //boton.textContent = "Listar";//cambia el texto del boton
    boton.addEventListener("click", myObjMain);//al pasarle el objeto y como la clase implementa la interfase, esta interfase le obliga a implemtanra el evento para este listener    

    //let btnCerrar: HTMLElement = myObjMain.myframework.getElementById("btnCerrar");
    //btnCerrar.addEventListener("dblclick", myObjMain);
});