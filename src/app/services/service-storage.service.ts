import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class ServiceStorageService {

  accountData = {};
  // account data: key = account ID, value = [list of service ids]
  serviceData = {};
  // service data: key = service ID, value = [list of service details]
  accountID = 0;
  serviceID = 0;

  constructor(public accountService: Storage, public services: Storage) { }

  getAccountID(increment: boolean) {
    if(increment) {
      do {
        this.accountID = this.accountID + 1;
      } while(this.serviceID == this.accountID);
    }
    return this.accountID + '';
  }

  getServiceID(increment: boolean) {
    if(increment) {
      do {
        this.serviceID = this.serviceID + 1;
      } while(this.serviceID == this.accountID);
    }
    return this.serviceID + '';
  }

  addAccount(key: string) {
    var value = [];
    this.accountService.set(key, value).then((response) => {
      console.log('set account service: ' + key, response);
    }).catch((error) => {
      console.log('set account service error: ', error);
    });
  }

  changeAccountServices(key: string, value: Array<string>) { //change the service details
    this.accountService.set(key, value).then((response) => {
      console.log('set account service: ' + key, response);
    }).catch((error) => {
      console.log('set account service error: ', error);
    });
  }

  addService(accID: string, serviceDetails: Array<string>) {
    //creating service
    var service = this.getServiceID(true);
    this.services.set(service, serviceDetails).then((response) => {
      console.log('add service ', response)
    }).catch((error) => {
      console.log('add service error: ', error);
      return;
    });

    //adding service to account
    var services = []
    this.accountService.get(accID).then((val) => {
      console.log('retrieved services');
      services = val;
    }).catch((error) => {
      console.log('getting account service error: ', error);
      return;
    });

    services.push(service);
    this.changeAccountServices(accID, services);

  }

  removeAccount(key: string) {
    //removing the services of the account first
    this.accountService.get(key).then((val) => {
      console.log('got account service');
      for(var i = 0; i < val.length; i++) {
        this.services.remove(val[i]).then(() => {
          console.log('removed service #' + val[i]);
        }).catch((error) => {
          console.log('service remove error: ', error);
          return;
        });
      }
    }).catch((error) => {
      console.log('getting account service error: ', error);
      return;
    });

    //removing the account
    this.accountService.remove(key).then(() => {
      console.log('removed account service');
    }).catch((error) => {
      console.log('remove account service error ', error);
    });
  }

  clearAll() {
    this.accountService.clear();
    this.services.clear();
  }

  traverseAccountData() {
    this.accountService.forEach((value: Array<string>, key: string) => {
      this.accountData[key] = value;
    });
  }

  traverseServiceData() {
    this.services.forEach((value: Array<string>, key: string) => {
      this.serviceData[key] = value;
    });
  }

  getAccountData() {
    this.traverseAccountData();
    return this.accountData;
  }

  getServiceData() {
    this.traverseServiceData();
    return this.serviceData;
  }
}
