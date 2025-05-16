import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntityRoutingModule } from './entity-routing.module';
import { EntityGenerationComponent } from './components/entity-generation/entity-generation.component';
import { EntityListComponent } from './components/entity-list/entity-list.component';


@NgModule({
  declarations: [
    EntityGenerationComponent,
    EntityListComponent
  ],
  imports: [
    CommonModule,
    EntityRoutingModule
  ]
})
export class EntityModule { }
