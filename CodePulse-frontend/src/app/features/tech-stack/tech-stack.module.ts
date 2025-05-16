import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TechStackRoutingModule } from './tech-stack-routing.module';
import { TechSelectionComponent } from './components/tech-selection/tech-selection.component';


@NgModule({
  declarations: [
    TechSelectionComponent
  ],
  imports: [
    CommonModule,
    TechStackRoutingModule
  ]
})
export class TechStackModule { }
