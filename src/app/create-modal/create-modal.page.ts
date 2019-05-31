import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AccountsService } from './../services/accounts.service';
import { PhoneValidator } from './../validators/phone.validator';
import { PasswordValidator } from './../validators/password.validator';
import { CountryPhone } from './country-phone.model';
import { ToastController } from '@ionic/angular';
import { trigger, style, animate, transition, group, query, animateChild } from '@angular/animations';

@Component({
  selector: 'app-create-modal',
  templateUrl: './create-modal.page.html',
  styleUrls: ['./create-modal.page.scss'],
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
export class CreateModalPage implements OnInit {

  previousUsername: string;
  goodUsername = true;
  validations_form: FormGroup;
  matching_passwords_group: FormGroup;
  country_phone_group: FormGroup;
  countries: Array<CountryPhone>;
  genders: Array<string>;
  result = {};

  validation_messages = {
    'username': [
      { type: 'required', message: 'Username is required.' },
      { type: 'minlength', message: 'Username must be at least 5 characters long.' },
      { type: 'maxlength', message: 'Username cannot be more than 25 characters long.' },
      { type: 'pattern', message: 'Your username must contain numbers and letters only.' }
    ],
    'name': [
      { type: 'required', message: 'Name is required.' }
    ],
    'lastname': [
      { type: 'required', message: 'Last name is required.' }
    ],
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please wnter a valid email.' }
    ],
    'phone': [
      { type: 'required', message: 'Phone is required.' },
      { type: 'validCountryPhone', message: 'The phone is incorrect for the selected country.' }
    ],
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
    'terms': [
      { type: 'pattern', message: 'You must accept terms and conditions.' }
    ],
  };

  constructor(private toastCtrl: ToastController, private modalController: ModalController, private accountManager: AccountsService, public formBuilder: FormBuilder) { }

  ngOnInit() {
    //  We just use a few random countries, however, you can use the countries you need by just adding them to this list.
    // also you can use a library to get all the countries from the world.
    this.countries = [
      new CountryPhone('UY', 'Uruguay'),
      new CountryPhone('US', 'United States'),
      new CountryPhone('BR', 'Brasil')
    ];

    this.genders = [
      "Male",
      "Female"
    ];

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

    let country = new FormControl(this.countries[0], Validators.required);
    let phone = new FormControl('', Validators.compose([
      Validators.required,
      PhoneValidator.validCountryPhone(country)
    ]));
    this.country_phone_group = new FormGroup({
      country: country,
      phone: phone
    });

    this.validations_form = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.maxLength(25),
        Validators.minLength(5),
        Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
        Validators.required
      ])),
      name: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      gender: new FormControl(this.genders[0], Validators.required),
      country_phone: this.country_phone_group,
      matching_passwords: this.matching_passwords_group,
      terms: new FormControl(true, Validators.pattern('true'))
    });
  }

  ionViewWillEnter() {
    console.log(this.previousUsername);
    this.validations_form.controls['username'].setValue(this.previousUsername);

    this.validations_form.controls['username'].setValue("Apro123");
    this.validations_form.controls['name'].setValue("firstname");
    this.validations_form.controls['lastname'].setValue("last");
    this.validations_form.controls['email'].setValue("emailk@asfewa");
    // this.validations_form.controls['matching_passwords'].get['password'].setValue("As123");
    // this.validations_form.controls['matching_passwords'].get['confirm_password'].setValue("As123");
    // this.validations_form.controls['country_phone'].get['phone'].setValue("+59894231234");

  }

  validUsername() {
    this.goodUsername = this.accountManager.validUsername(this.validations_form.get('username').value + '');
    return this.goodUsername;
  }

  onSubmit(values) {
    if(this.validUsername()) {
      this.accountManager.addAccount(values.username + '', values);
      // console.log(values.get('matching_passwords').get('password').value);
      this.result = values;
      this.myDismiss();
    } else {
      this.toastCtrl.create({
        message: 'USERNAME ALREADY EXISTS! PLEASE PICK ANOTHER ONE!',
        duration: 2000,
        color: 'danger'
      }).then((toast) => {
        toast.present();
      });
    }
  }


  async myDismiss() {
    await this.modalController.dismiss(this.result);
  }

}
