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

  accountId;

  constructor(private serviceManager: ServiceStorageService, private accountManager: AccountsService, private router: Router) { }

  ngOnInit() {
    var loggedIn = this.accountManager.getLoggedIn();
    if(loggedIn == 0) {
      this.router.navigate(['/login']);
    }
  }

}
