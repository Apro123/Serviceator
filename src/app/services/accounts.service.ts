import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ServiceStorageService } from './service-storage.service';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  data = {};
  loggedIn = ""; //account id
  //accounts: key: username, value: [hashed password, account ID, personalInformation{}]
  //account manager is service

  constructor(public accounts: Storage, public accountManager: ServiceStorageService ) { }

  async addAccount(key: string, values) {
    var pass;
    pass = CryptoJS.SHA1(values.matching_passwords.password) + '';
    delete values['matching_passwords'];
    var accID;
    await this.accountManager.getAccountID(true).then((val) => {
      accID = val;
      console.log("val returned: " + val);
    })
    console.log("accid: " + accID);
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
    if(this.loggedIn != this.getAccountID(key)+'') {
      return; //extra measure
    }
    this.accountManager.removeAccount(key);
    // this.accounts.remove(key).then((response) => {
    //   console.log('removed ' + key, response);
    // }).catch((error) => {
    //   console.log('remove error for ' + key + ' ', error);
    // });
  }

  async changePassword(key: string, accountID: string, oldValue: string, value: string) {
    var change = false;
    var accID = accountID;
    var hashed;
    var values;
    await this.accounts.get(key).then((val) => {
      hashed = val[0];
      if(accID != val[1]) {
        console.log("wrong person: " + val[1] + ' ' + accID);
        return change;
      }
      values = val;
    }).catch((error) => {
      console.log('getting account password error: ', error);
    });

    if(hashed != CryptoJS.SHA1(oldValue) + '') { //if passwords dont match
      console.log("passwords do not match: " + hashed + '  ' + CryptoJS.SHA1(oldValue));
      return change;
    }
    change = true;
    var val;
    val = values;
    val[0] = CryptoJS.SHA1(value);
    this.accounts.set(key, val).then((response) => {
      console.log('changed password ', response);
    }).catch((error) => {
      console.log('password change error: ', error);
    });
    return change;
  }

  getAccountID(key: string) {
    this.accounts.get(key).then((val) => {
      return val[1] + '';
    }).catch((error) => {
      console.log('getting account id error: ', error);
    });
  }

  async login(key: string, value: string): Promise<any> {
    let bool = false;
    return await new Promise<any>((resolve, reject) => {
      this.accounts.get(key).then((val) => {
        if(JSON.stringify(CryptoJS.SHA1(value)) == JSON.stringify(val[0]) || CryptoJS.SHA1(value) + '' == val[0]) {

          bool = true;
          this.loggedIn = val[1];
          this.setLogin(val[1]);
        }
        resolve(bool);
      }).catch((error) => {
        resolve(bool);
      });
    });
    //
    // return await bool;
  }

  logout() {
    this.accounts.set("login", null).then(() => {
    });
    this.loggedIn = "";
  }

  setLogin(accID) {
    this.accounts.set("login", accID).then(() => {
    })
  }

  async validUsername(key: string): Promise<any> {
    return await new Promise<any>((resolve, reject) => {
      this.accounts.get(key).then((response) => {
        resolve(false);
      }).catch((e) => {
        resolve(true);
        console.log("username exists");
      });
    });

  }

  clearAll() {
    this.accounts.clear();
    this.accountManager.clearAll();
    this.data = {}
  }

  async traverse():Promise<any> {
    return await new Promise<any>((resolve) => {
      this.accounts.forEach((value, key: string) => {
        this.data[key] = value;
        console.log("key: " + key);
        console.log("value: " + JSON.stringify(value));
      });
      resolve(this.data);
      return this.data;
    });

  }

  getDatabase() {
    return this.accounts;
  }

}
