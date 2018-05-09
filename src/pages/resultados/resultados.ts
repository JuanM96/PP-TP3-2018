import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';

/**
 * Generated class for the ResultadosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-resultados',
  templateUrl: 'resultados.html',
})
export class ResultadosPage {
  votosM:number;
  votosP:number;
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
    this.votosM = this.navParams.get('votoM');
    this.votosP = this.navParams.get('votoP');
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

}
