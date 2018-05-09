import { Component } from '@angular/core';
import { NavController, NavParams,ModalController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { LoginPage } from '../login/login';
import { ResultadosPage } from '../resultados/resultados';
import { App } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { AngularFirestore,AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { usuario } from '../../clases/usuario';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  votacion:string;
  coleccionTipadaFirebase:AngularFirestoreCollection<usuario>;
  ListadoDeUsuariosObservable:Observable<usuario[]>;
  ListaDeUsuarios:Array<usuario>;
  usuario:string;
  constructor(public navCtrl: NavController,public modalCtrl: ModalController,public navParams:NavParams,private objFirebase: AngularFirestore,public app:App,private auth: AuthService,private toast: Toast) {
    this.ListaDeUsuarios = new Array();
    this.usuario = this.navParams.get('data');
  }
  ionViewDidEnter(){
    this.coleccionTipadaFirebase= this.objFirebase.collection<usuario>('VotaConsorcio'); 
    //para el filtrado mirar la documentación https://firebase.google.com/docs/firestore/query-data/queries?authuser=0
    this.ListadoDeUsuariosObservable=this.coleccionTipadaFirebase.valueChanges();
    this.ListadoDeUsuariosObservable.subscribe(x => {
        console.info("conexión correcta con Firebase",x);
        x.forEach(usuario => {
          this.ListaDeUsuarios.push(usuario);
        });
    })
     console.log("fin de ionViewDidEnter");
  }
  public logout() {
    this.auth.logout().subscribe(succ => {
      this.app.getRootNav().setRoot(LoginPage);
    });
  }
  public votar(vota){
    let auxVoto = this.revisarVoto();
    if (auxVoto) {
      this.showToast("Usted ya voto!");
    }
    else{
      this.crearDocumentoUsuario(this.usuario,vota,true)
    }
  }
  public verResultados(){
    let votosM:number = 0;
    let votosP:number = 0;
    this.ListaDeUsuarios.forEach(usuario => {
      if (usuario.vota == "plantas") {
        votosP = votosP + 1;
      }
      if (usuario.vota == "matafuegos") {      
        votosM = votosM + 1;
      }
    }); 
    this.presentProfileModal(votosM,votosP);
  }
  showToast(msg){
    this.toast.show(msg, '5000', 'bottom').subscribe(
      toast => {
        console.log(toast);
      }
    );
  }
  revisarVoto(){
    let aux=false;
    this.ListaDeUsuarios.forEach(usu => {
      if (usu.usuario == this.usuario) {
        aux = true;
      }
    });
    return aux;
  }

  public crearDocumentoUsuario(usu:string,vota:string,voto:boolean){
    let nuevoUsuario:usuario;
    nuevoUsuario = new usuario(usu,vota,voto)
    let objetoJsonGenerico= nuevoUsuario.dameJSON();
    console.log ("se guardara: "+objetoJsonGenerico );
    this.objFirebase.collection<usuario>('VotaConsorcio').add(objetoJsonGenerico).then(
     Retorno=>
     {
       //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
       console.log(`id= ${Retorno.id} ,  usuario= ${usu}`);
     }
     ).catch( error=>{
       console.error(error);
     });
  }
  presentProfileModal(votosM:number,votosP:number) {
    let profileModal = this.modalCtrl.create(ResultadosPage, { votoM: votosM , votoP: votosP});
    profileModal.present();
  }
}
