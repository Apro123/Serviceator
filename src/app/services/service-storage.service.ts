import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class ServiceStorageService {

  data = {};
  accountData = {};
  // account data: key = account ID, value = [list of service ids]
  serviceData = {};
  // service data: key = service ID, value = [Id, Name, Service, Date "", Info/Description, Billing Details Address (full), Price, future checkup ""]
  accountID = 0;
  serviceID = 0;

  constructor(public accountService: Storage, public services: Storage) { }

  inBeg() {
    this.accountService.set("accountID", 0).then(() => {
      console.log("set account ID");
    });
    this.accountService.set("serviceID", 0).then(() => {
      console.log("set service ID");
    });
  }

  async getAccountID(increment: boolean) {
    var accID;
    return await this.accountService.get("accountID").then((val) => {
      if(val == null) {
        this.inBeg();
      }
      console.log("getting accountID: " + val);
      accID = val;
      if(increment) {
        accID = val + 1;
      }
      this.accountService.set("accountID", accID).then(() => {
        console.log("reset successful");
      });
      return accID + 'A';
    });
  }

  async getServiceID(increment: boolean) {
    var servID;
    return await this.accountService.get("serviceID").then((val) => {
      console.log("getting serviceID: " + val);
      servID = val;
      if(increment) {
        servID = val + 1;
      }
      this.accountService.set("serviceID", servID).then(() => {
        console.log("reset successful");
      });
      return servID + 'S';
    });
  }

  addAccount(key: string) {
    var value = [];
    this.accountService.set(key, value).then((response) => {
      console.log('set account service: ' + key, response);
    }).catch((error) => {
      console.log('set account service error: ', error);
    });
  }

  changeAccountServices(key: string, value: Array<string>) { //change the service id
    this.accountService.set(key, value).then((response) => {
      console.log('set account service: ' + key, response);
    }).catch((error) => {
      console.log('set account service error: ', error);
    });
  }

  changeServiceDetails(servID: string, value: Array<string>) { //change the service details
    this.services.set(servID, value).then(() => {
      console.log("changed service successfully: ", servID);
    }).catch((error) => {
      console.log("change service error: ", error);
    });
  }

  removeService(accID: string, servID: string) {
    //removing service first
    this.services.remove(servID).then(() => {
      console.log('removed service id: ', servID);
    }).catch((error) => {
      console.log('remove service id error ', error);
      return;
    });

    //removing service id from account
    var serviceIDs = [];
    this.accountService.get(accID).then((val) => {
      serviceIDs = val;
    }).catch((error) => {
      console.log("accid not found (removing service): ", error);
      return;
    });
    const index = serviceIDs.indexOf(servID, 0);
    if (index > -1) {
       serviceIDs = serviceIDs.splice(index, 1);
       this.changeAccountServices(accID, serviceIDs);
    }
  }

  //service details does not needs id in the beginning
  async addService(accID: string, serviceDetails: Array<string>) {
    //creating service
    console.log("ADDING SERVICE");
    var service;
    var serviceIDs = [];
    [service, serviceIDs] = await Promise.all([this.getServiceID(true), this.accountService.get(accID)])

    console.log("service id to be added: " + service);
    console.log("Service Details b: " + serviceDetails);
    serviceDetails.splice(0, 0, service);
    console.log("Service Details a: " + serviceDetails);
    this.services.set(service, serviceDetails).then((response) => {
      console.log('add service: ', serviceDetails);
    }).catch((error) => {
      console.log('add service error: ', error);
      return;
    });
    serviceIDs.push(service);
    this.changeAccountServices(accID, serviceIDs);
  }

  removeAccount(key: string) { //account id
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
    this.accountData = {};
    this.serviceData = {};
  }

  async traverse():Promise<any> {
    return await new Promise<any>((resolve) => {
      this.accountService.forEach((value, key: string) => {
        this.data[key] = value;
        console.log("key: " + key);
        console.log("value: " + JSON.stringify(value));
      });
      resolve(this.data);
      return this.data;
    });

    // console.log(this.data);
    // return this.data;
  }

  getDatabase() {
    return this.accountService;
  }

}
