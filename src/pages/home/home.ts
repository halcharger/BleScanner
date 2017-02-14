import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';
import { PeripheralPage} from '../peripheral/peripheral';
import { BLE } from 'ionic-native';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public peripherals = [];
  isScanning = false;
  scanButtonIconName = 'bluetooth';
  scanButtonText = 'Scan';

  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController) {
    
  }

  scan(){

    this.startScanState();
    
    BLE.startScan([]).subscribe(device => {
      this.peripherals.push(device);
    });

    setTimeout(() => {this.stopScan()}, 5000)
  }

  private startScanState(){
    this.peripherals = [];
    this.isScanning = true;
    this.scanButtonIconName = 'code-working';
    this.scanButtonText = 'scanning...';
  }

  private stopScanState(){
    console.log('setting scan stopped state');
    this.isScanning = true;
    this.scanButtonIconName = 'bluetooth';
    this.scanButtonText = 'Scan';
  }

  stopScan(){
    console.log('stopping scan');
    BLE.stopScan();
    this.stopScanState();
  }

  connectToPeripheral(peripheral){
    this.navCtrl.push(PeripheralPage, {peripheral: peripheral});
  }

}
