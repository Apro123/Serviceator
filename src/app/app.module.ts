import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AccountsService } from './services/accounts.service';
import { ServiceStorageService } from './services/service-storage.service';
import { IonicStorageModule } from '@ionic/storage';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { CreateModalPageModule } from './create-modal/create-modal.module'

@NgModule({
  declarations: [AppComponent],
  // entryComponents: [CreateModalPage],
  imports: [ BrowserModule, BrowserAnimationsModule, IonicModule.forRoot(), AppRoutingModule, IonicStorageModule.forRoot(), FormsModule, ReactiveFormsModule],
  providers: [
    StatusBar,
    SplashScreen,
    AccountsService,
    ServiceStorageService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
