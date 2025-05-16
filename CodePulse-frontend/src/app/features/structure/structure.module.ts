import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StructureRoutingModule } from './structure-routing.module';
import { FolderStructureComponent } from './components/folder-structure/folder-structure.component';


@NgModule({
  declarations: [
    FolderStructureComponent
  ],
  imports: [
    CommonModule,
    StructureRoutingModule
  ]
})
export class StructureModule { }
