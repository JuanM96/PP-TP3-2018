import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { TabsPage } from '../tabs/tabs';
import { HomePage } from '../home/home';
import { RegistroPage } from '../registro/registro';


 
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loading: Loading;
  registerCredentials = { email: '', password: '' };
  aux:boolean = false;
  usuario:string;
  constructor(private nav: NavController, private auth: AuthService, private alertCtrl: AlertController, private loadingCtrl: LoadingController) { }
 
  public createAccount() {
    this.nav.push(RegistroPage);
  }
//fin ionViewDidEnter
  /*public login() {
    this.aux = true;
    
    this.showLoading()
    this.auth.login(this.registerCredentials).subscribe(allowed => {
      console.log(allowed);
      if (allowed.h) {        
        this.nav.setRoot(TabsPage);
      } else {
        this.showError("Acceso Denegado");
      }
    },
      error => {
        this.showError(error);
      });
      

  }*/
  public login2() {
    this.aux = true
    this.showLoading();
    this.auth.signInWithEmail(this.registerCredentials)
      .then(
        () => this.nav.setRoot(HomePage,{data:this.armarUsuario()}),
        error => this.showError(error.message)//console.log(error.message)
      );
  }
  loginWithGoogle() {
    this.auth.signInWithGoogle()
      .then(
        () => this.nav.setRoot(HomePage),
        error => console.log(error.message)
      );
  }
  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Espere Porfavor...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }
 
  showError(text) {
    if (this.aux) {
      this.loading.dismiss();
      
         let alert = this.alertCtrl.create({
           title: 'Error',
           subTitle: text,
           buttons: ['OK']
         });
         alert.present();
    }
  }
  public ingresoTest(){
    this.registerCredentials.email = "admin@admin.com";
    this.registerCredentials.password = "admin123";
    this.login2();
  }
  public armarUsuario(){
    let email = this.registerCredentials.email;
    let usuarioCortado = "";
    for (let i = 0; i < email.length; i++) {
      if (email[i] == "@") {
        break;
      }
      else{
        usuarioCortado = usuarioCortado + email[i];
      }
    }
    return usuarioCortado;
  }
}