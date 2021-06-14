class MyFramework{
    private id:string;
    constructor(){

    }

    public set_id(id : string):void{
        this.id = id        
    }

    public get_id() : string{
        return this.id;
    }

    public getElementById(id : string) : HTMLElement{
        return document.getElementById(id)
    } 

    public requestPOST(url:string, response:HandlerPOST, datos:any){
        let xml:XMLHttpRequest = new XMLHttpRequest();

        xml.onreadystatechange = ()=>{
            if(xml.readyState == 4){
                response.responsePost(xml.status, xml.responseText);
            }
        }
        xml.open("POST", url, true);
        xml.setRequestHeader("Content-Type", "application/json");
        xml.send(JSON.stringify(datos));
    }
}