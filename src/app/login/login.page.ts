import { Component, OnInit } from '@angular/core';
import { AccountsService } from './../services/accounts.service';
import { ToastController } from '@ionic/angular';
import { trigger, style, animate, transition, group, query, animateChild } from '@angular/animations';
import { ModalController, NavParams } from '@ionic/angular';
import { CreateModalPage } from './../create-modal/create-modal.page';
import { OverlayEventDetail } from '@ionic/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  animations: [

    trigger('message', [
      transition(':enter', [
          style({opacity: '0'}),
          animate('500ms 1000ms ease-out', style({opacity: '1'}))
      ]),
      transition(':leave', [
          animate('500ms ease-in', style({opacity: '0'}))
      ])
    ])

  ],
})

export class LoginPage implements OnInit {

  username: string;
  password: string;
  show = false;

  constructor(private accountManager: AccountsService, private toastCtrl: ToastController,
     private modalController: ModalController, private router: Router) { }

  ngOnInit() {
  }

  showhidePass() {
    this.show = !this.show;
  }

  async openModal() {
    const modal: HTMLIonModalElement =
       await this.modalController.create({
          component: CreateModalPage,
          componentProps: {
             previousUsername: this.username,
          },
          cssClass: "my-modal",
    });

    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
       if (detail.data == true) {
         this.toastCtrl.create({
           message: 'CONGRATULATIONS, YOUR ACCOUNT HAS BEEN CREATED!',
           duration: 2000,
           color: 'success'
         }).then((toast) => {
           toast.present();
         });
       }
    });

    await modal.present();
  }

  // @HostListener('click') onClick() {
  //   let inType = (this.targetInput._native.nativeElement.type == 'text')? 'password': 'text';
  //   this.targetInput._native.nativeElement.type = inType;
  // }

  async submit() {
    var logIn;// = this.accountManager.login(this.username, this.password);
    await this.accountManager.login(this.username, this.password).then((val) => {
      logIn = val;
    });
    // console.log("logIn: " + logIn);
    if(!logIn) {
      this.toastCtrl.create({
        message: 'INVALID ACCOUNT! PLEASE CREATE A NEW ACCOUNT IF YOU DO NOT HAVE ONE!',
        duration: 2000,
        color: 'danger'
      }).then((toast) => {
        toast.present();
      });
    } else {
      // console.log(this.accountManager.getAccountData());
      // this.accountManager.clearAll();
      this.router.navigate(['/dashboard']);
    }
  }

  traverse() {
    this.accountManager.traverse();
  }

  clear() {
    this.accountManager.clearAll();
  }

}
