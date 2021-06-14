class User{//ojo agregarlo al html sino no funcionaria
    private id : number;
    private name : string;
    private email : string;
    private isLogged : boolean;
    
    constructor(id : number, name : string, email : string, isLogged : boolean){
        this.id = id;
        this.name = name;
        this.email = email;
        this.isLogged = isLogged;
    }

    public get_id() : number{
        return this.id;
    }    

    public set_id(id : number) : void{
        this.id = id;
    }

    public get_name() : string{
        return this.name;
    }    

    public set_name(name : string) : void{
        this.name = name;
    }

    public get_email() : string{
        return this.email;
    }    

    public set_email(email : string) : void{
        this.email = email;
    }

    public get_isLogged() : boolean{
        return this.isLogged;
    }    

    public set_isLogged(isLogged : boolean) : void{
        this.isLogged = isLogged;
    }
    
    public printInfo():void{
        console.log(this.name + " " + this.isLogged);
    }
}