import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceStorageService } from './../services/service-storage.service';
import { AccountsService } from './../services/accounts.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { PasswordValidator } from './../validators/password.validator';
import { ToastController } from '@ionic/angular';
import { trigger, style, animate, transition, group, query, animateChild } from '@angular/animations';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
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
export class SettingsPage implements OnInit {

  username: string;
  oldPassword: string;
  matching_passwords_group: FormGroup;
  validations_form: FormGroup;
  change = false;
  accountID = "";
  validation_messages = {
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number.' }
    ],
    'confirm_password': [
      { type: 'required', message: 'Confirm password is required.' }
    ],
    'matching_passwords': [
      { type: 'areEqual', message: 'Password mismatch.' }
    ],
  };

  constructor(private toastCtrl: ToastController, private accountManager: AccountsService, private router: Router, public formBuilder: FormBuilder) { }

  async ngOnInit() {
    await this.accountManager.getDatabase().get("login").then((accID) => {
      this.accountID = accID;
      console.log("accid:" + accID);
    }).catch((error) => {
      console.log("getting login info error: ", error);
    });
    if(this.accountID == "" || this.accountID == null) {
      this.router.navigate(['/login']);
    }

    this.matching_passwords_group = new FormGroup({
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])),
      confirm_password: new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areEqual(formGroup);
    });

    this.validations_form = this.formBuilder.group({
      matching_passwords: this.matching_passwords_group
    });
  }

  clearEverything() {
    this.accountManager.clearAll();
  }

  logout() {
    this.accountManager.logout();
    this.router.navigate(['/home']);
  }

  changePassword() {
    this.change = true;
  }

  dashboard() {
    this.router.navigate(['/dashboard']);
  }

  async onSubmit(values) {
    var bool;
    bool = await this.accountManager.changePassword(this.username, this.accountID, this.oldPassword, values.matching_passwords.password);
    this.username = "";
    this.change = false;
    if(bool) {
      this.toastCtrl.create({
        message: 'SUCCESSFUL PASSWORD CHANGE!',
        duration: 2000,
        color: 'success'
      }).then((toast) => {
        toast.present();
      });
    } else {
      this.toastCtrl.create({
        message: 'UNSUCCESSFUL PASSWORD CHANGE!',
        duration: 2000,
        color: 'danger'
      }).then((toast) => {
        toast.present();
      });
    }
  }


}
