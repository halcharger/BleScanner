import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BLE } from 'ionic-native';

@Component({
  selector: 'page-peripheral',
  templateUrl: 'peripheral.html'
})
export class PeripheralPage {
  peripheral;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.peripheral = this.navParams.get('peripheral');
    this.peripheral.advertisingData = new Uint8Array(this.peripheral.advertising)
    this.peripheral.connectData = '';
    BLE.connect(this.peripheral.id).subscribe(device => this.onConnect(device));
  }

  onConnect(device){
    console.log('onConnect -> device:', device);
    this.peripheral.connectData = JSON.stringify(device);
  }

}
