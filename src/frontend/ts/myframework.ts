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
        let xlm: XMLHttpRequest = new XMLHttpRequest();

        xlm.onreadystatechange = () => {
        if (xlm.readyState == 4) {
            response.responsePost(xlm.status, xlm.responseText);
        }
        }
        xlm.open("POST", url, true);
        xlm.setRequestHeader("Content-Type", "application/json");

        
        xlm.send(JSON.stringify(datos));
    }
}