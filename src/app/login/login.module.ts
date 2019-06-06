import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LoginPage } from './login.page';

// import { CreateModalPage } from './../create-modal/create-modal.page';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    // CreateModalPageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LoginPage],//, CreateModalPage],
  // entryComponents: [CreateModalPage]
})
export class LoginPageModule {}
