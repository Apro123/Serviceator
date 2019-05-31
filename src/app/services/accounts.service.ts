import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ServiceStorageService } from './service-storage.service';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  data = {};
  loggedIn = 0; //account id
  //key: username, value: [hashed password, account ID, personalInformation]

  constructor(public accounts: Storage, public accountManager: ServiceStorageService ) { }

  addAccount(key: string, values) {
    var pass;
    pass = CryptoJS.SHA1(values.matching_passwords.password) + '';
    var accID = this.accountManager.getAccountID(true);
    this.accountManager.addAccount(accID);
    delete values['username'];
    var val = [pass, accID, values];
    this.accounts.set(key, val).then((response) => {
      console.log("created account ", response);
    }).catch((error) => {
      console.log("account creation error: ", error);
    });
  }

  removeAccount(key: string) {
    if(this.loggedIn != Number(this.getAccountID(key))) {
      return; //extra measure
    }
    this.accounts.remove(key).then((response) => {
      console.log('removed ' + key, response);
    }).catch((error) => {
      console.log('remove error for ' + key + ' ', error);
    });
  }

  changePassword(key: string, oldValue: string, value: string) {
    var accID = this.getAccountID(key);
    var hashed;
    var values;
    this.accounts.get(key).then((val) => {
      hashed = val[0];
      values = val[2];
    }).catch((error) => {
      console.log('getting account password error: ', error);
    });

    if(hashed != CryptoJS.SHA1(oldValue) + '') { //if passwords dont match
      console.log("passwords do not match");
      return;
    }
    var val;
    val = [CryptoJS.SHA1(value) + '', accID, values];
    this.accounts.set(key, val).then((response) => {
      console.log('changed password ', response);
    }).catch((error) => {
      console.log('password change error: ', error);
    });
  }

  getAccountID(key: string) {
    this.accounts.get(key).then((val) => {
      return val[1];
    }).catch((error) => {
      console.log('getting account id error: ', error);
    });
  }

  async login(key: string, value: string): Promise<any> {
    let bool = false;
    return await new Promise<any>((resolve, reject) => {
      this.accounts.get(key).then((val) => {
        if(CryptoJS.SHA1(value) + '' == val[0]) {
          console.log("should return true");
          bool = true;
          this.loggedIn = val[1];
        }
        resolve(bool);
      }).catch((error) => {
        resolve(bool);
        console.log('key does not exist or error: ', error);
      });
    })
    //
    // return await bool;

  }

  validUsername(key: string) {
    this.traverseAccountData();
    if(this.data[key] == null) {
      return true;
    }
    return false;
  }

  clearAll() {
    this.accounts.clear();
    this.accountManager.clearAll();
  }

  traverseAccountData() {
    this.data = {};
    this.accounts.forEach((value, key: string) => {
      this.data[key] = value;
      console.log("key: " + key);
    });
  }

  getAccountData() {
    this.traverseAccountData();
    return this.data;
  }

  getLoggedIn() {
    return 1; /////////////////NOT FOR PRODUCTION
    return this.loggedIn;
  }

}
