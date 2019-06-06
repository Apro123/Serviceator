import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceStorageService } from './../services/service-storage.service';
import { AccountsService } from './../services/accounts.service'

@Component({
  selector: 'app-manager',
  templateUrl: './manager.page.html',
  styleUrls: ['./manager.page.scss'],
})
export class ManagerPage implements OnInit {

  accountID; //logged in
  addService = false;
  name = "";
  service = "";
  date = "";
  info = "";
  address = "";
  price = "";
  futureDate = "";
  accountServices = []; // all the service ids
  allServices = [[]];
  edit = [];
  //services [Id, Name, Service, Date "", Info/Description, Billing Details Address (full), Price, future checkup ""]

  constructor(private serviceManager: ServiceStorageService, private accountManager: AccountsService, private router: Router) { }

  async ngOnInit() {
    await this.accountManager.getDatabase().get("login").then((accID) => {
      this.accountID = accID;
      // console.log("accid:" + accID);
    }).catch((error) => {
      console.log("getting login info error: ", error);
    });
    if(this.accountID == "" || this.accountID == null) {
      this.router.navigate(['/login']);
    }
    this.getServiceIDs();
    this.cancel();
  }

  async getServiceIDs() {
    this.allServices = [];
    var account = this.serviceManager.getDatabase();

    // console.log("accountid: " + this.accountID);
    await account.get(this.accountID).then((ids) => {
      this.accountServices = ids;
      var services = this.serviceManager.getDatabase();
      var i;
      try {
        for(i = 0; i < this.accountServices.length; i++) {
          var serviceID = this.accountServices[i] + '';
          this.edit.push(false);
          var serviceDetail = [];
          services.get(serviceID).then((id) => {
            serviceDetail.push(id);
            this.allServices.push(serviceDetail);
          });

        }
      } catch(e) {
        console.log("getting service id error: ", e);
      }
    });
  }

  editService(editNum) {
    this.name = "";
    this.service = "";
    this.date = "";
    this.info = "";
    this.address = "";
    this.price = "";
    this.futureDate = "";
    if(editNum == -1) {
      this.addService = true;
    } else {
      this.addService = false;
    }
    var i;
    for(i = 0; i < this.edit.length; i++) {
      if(editNum == i) {
        this.edit[i] = true;
      } else {
        this.edit[i] = false;
      }
    }
  }

  async removeService(servID) {
    await this.serviceManager.removeService(this.accountID, servID);
    this.getServiceIDs();
  }

  async submitNewService() {
    var values = [this.name, this.service, this.date, this.info, this.address, this.price, this.futureDate];
    // console.log("date: " + this.date);
    // return;
    await this.serviceManager.addService(this.accountID, values);
    this.getServiceIDs();
    this.cancel();
  }

  async submitService(index) {
    var values = [];
    values.push(this.allServices[index][0]); //serviceID
    if(this.name == "") {
      values.push(this.allServices[index][1]);
    } else {
      values.push(this.name);
    }
    if(this.service == "") {
      values.push(this.allServices[index][2]);
    } else {;
      values.push(this.service);
    }
    if(this.date == "") {
      values.push(this.allServices[index][3]);
    } else {
      values.push(this.date);
    }
    if(this.info == "") {
      values.push(this.allServices[index][4]);
    } else {
      values.push(this.info);
    }
    if(this.address == "") {
      values.push(this.allServices[index][5][0]);
    } else {
      values.push(this.address);
    }
    if(this.price == "") {
      values.push(this.allServices[index][5][1]);
    } else {
      values.push(this.price);
    }
    if(this.futureDate == "") {
      values.push(this.allServices[index][6]);
    } else {
      values.push(this.futureDate);
    }

    this.serviceManager.changeServiceDetails(this.allServices[index][0], values);
    await this.getServiceIDs();
    this.cancel();
  }

  cancel() {
    this.name = "";
    this.service = "";
    this.date = "";
    this.info = "";
    this.address = "";
    this.price = "";
    this.futureDate = "";
    this.addService = false;
    var i;
    for(i = 0; i < this.edit.length; i++) {
      this.edit[i] = false;
    }
  }

  dashboard() {
    this.cancel();
    this.router.navigateByUrl('/dashboard', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/dashboard']));
    // this.router.navigate(['/dashboard']);
  }

  traverse() {
    this.accountManager.traverse();
  }

  clear() {
    this.accountManager.clearAll();
    this.serviceManager.clearAll();
  }

  printLog() {
    console.log("loggedin: " + this.accountID);
  }


}
