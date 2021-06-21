class Main implements EventListenerObject, HandlerPOST{
    public myframework: MyFramework;

    constructor(){
        this.myframework = new MyFramework();
    }

    /**
     * @brief Implementacion del handler
     * @param ev 
     * @return void
     */
    public handleEvent(ev: Event) {
        let objetoClick:HTMLInputElement = <HTMLInputElement> ev.target;//lo castea, esto obtiene que boton produjo el evento
        let type:string = objetoClick.type.toLowerCase();
        switch(type){
            case "btn":
                /*Evento de botones*/
                console.log("es un boton");
                this.btnHandler(objetoClick);
            break;
            case "range":
                /*Evento de range*/
                console.log("es un range id=" + objetoClick.id + " Valor=" + objetoClick.value);
                //this.post("http://localhost:8000/device_update", objetoClick.id, Number(objetoClick.value));
                let data1 = {"id" : objetoClick.id, "status" : objetoClick.value};
                this.myframework.requestPOST("http://localhost:8000/device_update", this, data1);
            break;
            case "checkbox":
                /*Evento de checkbox on/off*/
                console.log("es un checkbox id=" + objetoClick.id + " Estado=" + objetoClick.checked);
                let data = {"id" : objetoClick.id, "status" : objetoClick.checked};
                this.myframework.requestPOST("http://localhost:8000/device_update", this, data);
                break;
            
        }
    }
        

    /**
     * @brief Implementacion de la funcion de interface HandlerPOST que actualiza la pantalla ante algun cambio
     * @param status 
     * @param response
     * @return void
     */
    public responsePost(status:number, response:string):void{
        console.log(response);
        //refresca formulario para mostrar actualizaciones
        location.reload();
    } 

    
    /**
     * @brief Handler de botones
     * @param element  elemento que se detecto como evento
     * @return void
     */
    private btnHandler(element : HTMLInputElement) : void
    {
        let id : string = element.id.split('_')[1];
        let name : string = "";
        let description : string = "";
        let type : string = "";
        switch(element.textContent)// == "Buscar")
        {
            case "Editar":   
                /*Evento del boton editar*/              
                console.log("Editar id=" + element.id);
                (<HTMLInputElement>this.myframework.getElementById('modal_title')).innerHTML = "Editar dispositivo";
                name = <string>this.myframework.getElementById(`nombre_${id}`).textContent;
                description = <string>this.myframework.getElementById(`descripcion_${id}`).textContent;
                type = (<HTMLInputElement>this.myframework.getElementById(`tipodispositivo_${id}`)).value;
                //actualizo el modal
                (<HTMLInputElement>this.myframework.getElementById('id_device')).value = id;
                (<HTMLInputElement>this.myframework.getElementById('name_device')).value = name;
                (<HTMLInputElement>this.myframework.getElementById('description_device')).value = description;
                (<HTMLInputElement>this.myframework.getElementById('type_device')).value = type;
                console.log(type);
                break;
            case "Eliminar":
                /*Evento del boton eliminar*/  
                console.log("Eliminar id=" + element.id);                
                //id =  element.id.split('_')[1];
                let device : string = <string>this.myframework.getElementById(`nombre_${id}`).textContent;
                let confirmation : boolean = confirm(`Desea eliminar el dispositivo ${device}?`);
                if(confirmation){
                    let data = {"id": `${id}`};
                    this.myframework.requestPOST("http://localhost:8000/device_delete/", this, data);
                }
                break;
            case "Nuevo":
                /*Evento del boton nuevo*/  
                console.log("Nuevo id=" + element.id);
                (<HTMLInputElement>this.myframework.getElementById('modal_title')).innerHTML = "Nuevo dispositivo";
                (<HTMLInputElement>this.myframework.getElementById('name_device')).value = "";
                (<HTMLInputElement>this.myframework.getElementById('description_device')).value = "";
                (<HTMLInputElement>this.myframework.getElementById('type_device')).value = "0";
                break;
            case "Aceptar":
                /*Evento del boton aceptar*/  
                console.log("Aceptar id=" + element.id);
                name = (<HTMLInputElement>this.myframework.getElementById('name_device')).value;
                description =  (<HTMLInputElement>this.myframework.getElementById('description_device')).value;
                type =  (<HTMLInputElement>this.myframework.getElementById('type_device')).value;
                let id_mod:string=(<HTMLInputElement>this.myframework.getElementById('id_device')).value;
                let title : string = (<HTMLInputElement>this.myframework.getElementById('modal_title')).innerHTML.split(' ')[0];
                let id_send = "";
                switch(title){
                    case "Nuevo":
                        id_send = "";
                        break;
                    case "Editar":
                        id_send = id_mod;
                        break;
                } 
                let data = {"id": `${id_send}`, "name": `${name}`, "description": `${description}`, "state": 0, "type": Number(type)};
                this.myframework.requestPOST("http://localhost:8000/device_insert_update/", this, data);
                break;
            default:

                break;
        }
    }    

 
    
    /**
     * @brief Carga los dispositivos almacenados en la base de datos
     * @return void
     */
    public cargarDispositivos():void{
        let xhr:XMLHttpRequest = new XMLHttpRequest();//peticion ajax
        xhr.onreadystatechange = ()=>{
            //se ejecuta cuando llega la respuesta
            if(xhr.readyState == 4)
            {//aca es ==4 porque esto se procesa 4 veces (el onreadystatechange avisa todo los cambios), 1ro que se envia la rta con el open ==1, con el 2 que el servidor recibio la respuesta, el 3 el servidor procesa la rta y 4 que ya tenenmos la respuesta lista para consumir 
                if(xhr.status == 200)
                {//200 que es ok
                    let listaDis: Array<Device> = JSON.parse(xhr.responseText);//convertimos a json
                    
                    /*creacion de elementos de la base d datos*/  
                    for(let disp of listaDis){
                        let listaDisp = this.myframework.getElementById("listaDis");
                        listaDisp.innerHTML += this.componentSelection(disp);
                    } 
                    /*creacion de listeners a cada elemento*/
                    for(let disp of listaDis){    
                        switch(disp.type){
                            case 0:
                                let clk: HTMLElement = this.createElementListener("disp_" + disp.id, "click");
                                break;
                            case 1:
                                let rng: HTMLElement = this.createElementListener("disp_" + disp.id, "change");
                                break;
                        }                        
                        let boton_edit: HTMLElement = this.createElementListener("btnEdit_" + disp.id, "click");
                        let boton_delet: HTMLElement = this.createElementListener("btnDelete_" + disp.id, "click");
                    }
                    let boton_accept: HTMLElement = this.createElementListener("btnAccept", "click");
                }
                else{
                    alert("Error de carga de dispositivos");
                }
            }
        } 
        xhr.open("POST", "http://localhost:8000/devices_show/", true);//en true hace que se ejecute en otro hilo (sincronico), entonces no se bloquea, esto lo permite ajax
        xhr.send();
        console.log("ya hice el request")
    }

    /**
    *   @brief Crea evento a un elemento de tipo HTMLElement
    *   @param elementName  Nombre del elemento en html
    *   @param elementType  Tipo de evento (click, dblclick)
    *   @return elemento
    */
    private createElementListener(elementName : string, elementType : string) : HTMLElement{
        let elem: HTMLElement = this.myframework.getElementById(elementName);//obtiene el boton de la pantalla
        elem.addEventListener(elementType, this);
        return elem;
    }

    /**
    *   @brief Crea un elemento en html segun el dispositivo
    *   @param disp Dispositivo de tipo Device 
    *   @return retorna string con elementoa  ser agregado en html
    */ 
    private componentSelection(disp : Device) : string{
        let resutl : string = '';
        let estado="";
        switch(disp.type){
            case 0:
                /*Elemento de estado On - Off*/
                if (disp.state){
                    estado="checked";
                }
                resutl = `<li class="collection-item avatar">
                <img src="./static/images/lightbulb.png" alt="" class="circle">
                <span id="nombre_${disp.id}" class="nombreDisp">${disp.name}</span>
                <p  id="descripcion_${disp.id}">${disp.description}</p>
                <a id=btnEdit_${disp.id} class="waves-effect waves-light btn modal-trigger" type="btn" href="#modal1">Editar</a>
                <a id=btnDelete_${disp.id} class="waves-effect waves-light btn" type="btn">Eliminar</a>
                <a href="#!" class="secondary-content">
                    <div class="switch">
                        <label>
                        Off
                        <input id="disp_${disp.id}" type="checkbox" ${estado}>
                        <span class="lever"></span>
                        On
                        </label>
                    </div>
                </a>
                <input id="tipodispositivo_${disp.id}" type="text" value="${disp.type}" hidden>
                </li>`;
            break;            
            case 1:
                /*Elemento de estado dimerizable*/
                resutl = `<li class="collection-item avatar">
                <img src="./static/images/window.png" alt="" class="circle">
                <span id="nombre_${disp.id}" class="nombreDisp">${disp.name}</span>
                <p id="descripcion_${disp.id}">${disp.description}</p>
                <a id=btnEdit_${disp.id} class="waves-effect waves-light btn modal-trigger" type="btn" href="#modal1">Editar</a>
                <a id=btnDelete_${disp.id} class="waves-effect waves-light btn" type="btn">Eliminar</a>
                <a href="#!" class="secondary-content">
                    <div>
                        <div>
                            <p class="range-field">
                                <input type="range" id=disp_${disp.id} min="0" max="100" value="${disp.state}"/>
                            </p>
                        </div>
                    </div>
                </a>
                <input id="tipodispositivo_${disp.id}" type="text" value="${disp.type}" hidden>
                </li>`;
            break;
            default:
                /*Elemento de estado On - Off*/
                if (disp.state)
                {
                estado="checked";
                }
                resutl = `<li class="collection-item avatar">
                <img src="./static/images/lightbulb.png" alt="" class="circle">
                <span id="nombre_${disp.id}" class="nombreDisp">${disp.name}</span>
                <p  id="descripcion_${disp.id}">${disp.description}</p>
                <a id=btnEdit_${disp.id} class="waves-effect waves-light btn modal-trigger" type="btn" href="#modal1">Editar</a>
                <a id=btnDelete_${disp.id} class="waves-effect waves-light btn" type="btn">Eliminar</a>
                <a href="#!" class="secondary-content">
                    <div class="switch">
                        <label>
                        Off
                        <input id="disp_${disp.id}" type="checkbox" ${estado}>
                        <span class="lever"></span>
                        On
                        </label>
                    </div>
                </a>
                <input id="tipodispositivo_${disp.id}" type="text" value="${disp.type}" hidden>
                </li>`;
            break;
        }
        
        return resutl;
    }   
    
    /**
     * @brief Implementacion del metodo main
     * @return void
     */
    public main() : void{
        console.log("Se ejecuto el metodo main!!!")   
        this.cargarDispositivos();
    }


}

/*
este onload hace que la pagina se cargue por completo asi si hay 
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