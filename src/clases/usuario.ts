export class usuario{
  usuario:string;
  vota:string;
  voto:boolean;
    constructor(usuario:string,vota:string,voto:boolean){
      this.usuario=usuario;
      this.vota = vota;
      this.voto = voto;
    }
  
    dameJSON(){
      return JSON.parse( JSON.stringify(this));
    }
  }