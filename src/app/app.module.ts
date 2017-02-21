import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { PeripheralPage } from '../pages/peripheral/peripheral';
import { BleScanner } from '../providers/ble-scanner';

@NgModule({
  declarations: [
    MyApp,
    HomePage, 
    PeripheralPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage, 
    PeripheralPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, BleScanner]
})
export class AppModule {}
