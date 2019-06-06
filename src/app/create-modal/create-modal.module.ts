import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';


import { IonicModule } from '@ionic/angular';

import { CreateModalPage } from './create-modal.page';

const routes: Routes = [
  {
    path: '',
    component: CreateModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    CreateModalPage
  ],
  declarations: [CreateModalPage],
  entryComponents: [CreateModalPage]
})
export class CreateModalPageModule {}
