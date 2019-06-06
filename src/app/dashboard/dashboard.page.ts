import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceStorageService } from './../services/service-storage.service';
import { AccountsService } from './../services/accounts.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  accountID;
  doneJobs = 0;
  donePrice = 0;
  futureJobs = 0;
  futurePrice = 0;
  accountServices = []; //all the service ids
  allServices = [[]];
  dates = [];

  constructor(private serviceManager: ServiceStorageService, private accountManager: AccountsService, private router: Router) { }

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
    this.getServiceIDs();
  }

  async getServiceIDs() {
    this.allServices = [];
    var account = this.serviceManager.getDatabase();

    console.log("accountid: " + this.accountID);
    await account.get(this.accountID).then((ids) => {
      this.accountServices = ids;
      this.getServiceIDs2();

    });
  }

  async getServiceIDs2() {
    var services = this.serviceManager.getDatabase();
    var i;

    for(i = 0; i < this.accountServices.length; i++) {
      var serviceID = this.accountServices[i] + '';
      var serviceDetail = [];
      await services.get(serviceID).then((id) => {
        serviceDetail = serviceDetail.concat(id);
        // console.log("id: " + id);
        this.allServices.push(serviceDetail);
        serviceDetail = [];
        this.allServices.sort(function(a,b) {
          // console.log("a[3]: " + a[3]);
          return (a[3] < b[3]) ? 1 : ((a[3] > b[3] ? -1 : 0));
        });
        // console.log("service detail: " + serviceDetail);
        console.log(JSON.stringify(this.allServices));
      });
    }
    console.log("before after");
    this.dateServices();
  }

  dateServices() {
    console.log("after");
    var i;

    for(i = 0; i < this.allServices.length; i++) {
      var temp = new Date(this.allServices[i][3]);
      this.dates.push('' + temp.toString());
      // this.dates.push('' + temp.getMonth() + ' ' + temp.getDate() + ', ' + temp.getFullYear() + ' ' + temp.getHours() + ':' + temp.getMinutes());
    }
  }

  manager() {
    this.router.navigate(['/manager']);
  }

  settings() {
    this.router.navigate(['/settings']);
  }

}
