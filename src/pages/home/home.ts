import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';
import { PeripheralPage} from '../peripheral/peripheral';
import {BleScanner} from '../../providers/ble-scanner';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  isScanning = false;
  scanButtonIconName = 'bluetooth';
  scanButtonText = 'Scan';

  constructor(public navCtrl: NavController, public bleScanner: BleScanner, private loadingCtrl: LoadingController) {
    
  }

  ionViewDidLoad() {
    this.bleScanner.startScan();
  }

  connectToPeripheral(peripheral){
    this.navCtrl.push(PeripheralPage, {peripheral: peripheral});
  }

  filterLogsByPeripheral(peripheral){
    this.bleScanner.setDeviceToFilterlogsBy(peripheral);
  }

}
