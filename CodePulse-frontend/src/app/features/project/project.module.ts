import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectRoutingModule } from './project-routing.module';
import { CreateProjectComponent } from './components/create-project/create-project.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';


@NgModule({
  declarations: [
    CreateProjectComponent,
    ProjectListComponent,
    ProjectDetailComponent
  ],
  imports: [
    CommonModule,
    ProjectRoutingModule
  ]
})
export class ProjectModule { }
