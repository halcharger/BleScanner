import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { BLE } from 'ionic-native';


@Injectable()
export class BleScanner {
  public peripherals = [];
  public deviceIdToFilterLogs;
  public logs = [];

  private unfilteredLogs = [];
  private scanId;

  constructor() {
  }

  startScan(){
    console.log('bleScanner.startScan');
    this.scanId = new Date();
    BLE.startScan([]).subscribe(d => this.deviceDetected(d));
    setTimeout(_ => this.restartScan(), 5000);
  }

  stopScan(){
    BLE.stopScan();
    this.removeAbsentDevices();
  }

  removeAbsentDevices(){
    this.peripherals.filter(d => d.scanId !== this.scanId)
                    .map(d => this.removeAbsentDevice(d));
    this.peripherals = this.peripherals.filter(d => d.scanId === this.scanId);
  }

  private removeAbsentDevice(device){
    this.addNewLog(device.id, `[${this.getPeripheralDescription(device)}] no longer present`)
  }


  setDeviceToFilterlogsBy(device){
    this.deviceIdToFilterLogs = device.id || null;
    this.updateLogs();
  }

  private updateLogs(){
    this.logs = this.unfilteredLogs.filter(l => l.deviceId === this.deviceIdToFilterLogs)
                                   .sort((a,b) => b.timeStamp.getTime() - a.timeStamp.getTime());
  }

  private deviceDetected(device){
    device.scanId = this.scanId;
    if (this.deviceAlreadyInPeripheralsArray(device)){
      this.updateExistingDevice(device);
    }else{
      this.addNewDevice(device);
    }
  }

  private deviceAlreadyInPeripheralsArray(device){
    let d = this.peripherals.find(d => d.id === device.id); 
    return d !== undefined;
  }

  private addNewDevice(device){
    this.peripherals.push(device);
    this.addNewLog(device.id,  `[${this.getPeripheralDescription(device)}] detected:  (rssi: ${device.rssi})`);
  }

  private addNewLog(deviceId, description){
    this.unfilteredLogs.push({
      timeStamp: new Date(), 
      description, 
      deviceId
    })
    this.updateLogs()
  }

  private getPeripheralDescription(device){
    //return device.name ? `${device.name} [${device.id}]` : device.id;
    return device.name || device.id;
  }

  private updateExistingDevice(newDevice){
    let deviceIndex = this.peripherals.findIndex(d => d.id === newDevice.id);
    let oldDevice = this.peripherals[deviceIndex];

    if (newDevice.rssi !== oldDevice.rssi){
      let movementDescription = this.getMovementDescription(oldDevice, newDevice);
      let log = `[${this.getPeripheralDescription(newDevice)}] ${movementDescription} (rssi: ${newDevice.rssi})`;
      this.addNewLog(newDevice.id, log);
    }

    this.peripherals[deviceIndex] = newDevice;
  }

  private getMovementDescription(oldDevice, newDevice){
      let oldRssi = this.getRssiAsAbsInt(oldDevice);
      let newRssi = this.getRssiAsAbsInt(newDevice);
      return oldRssi < newRssi ? 'moved away' : 'moved closer';
  }

  private getRssiAsAbsInt(device){
    return Math.abs(parseInt(device.rssi));
  }

  private restartScan(){
    this.stopScan();
    this.startScan();
  }

}
