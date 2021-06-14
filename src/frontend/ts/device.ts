class Device{
    public id: number;
    public name: string;
    public description: string;
    public state: boolean;
    public type: number;

    constructor(id : number, name : string, description : string, state : boolean, type : number){
        this.id = id;
        this.name = name;
        this.description = description;
        this.state = state;
        this.type = type;
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

    public get_description() : string{
        return this.description;
    }    

    public set_description(description : string) : void{
        this.description = description;
    }

    public get_state() : boolean{
        return this.state;
    }

    public set_state(state : boolean) : void{
        this.state = state;
    }

    public get_type() : number{
        return this.type;
    }

    public set_type(type : number) : void{
        this.type = type;
    }

}