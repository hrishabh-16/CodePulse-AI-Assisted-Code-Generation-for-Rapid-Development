import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CodeRoutingModule } from './code-routing.module';
import { CodeGenerationComponent } from './components/code-generation/code-generation.component';
import { CodeViewerComponent } from './components/code-viewer/code-viewer.component';


@NgModule({
  declarations: [
    CodeGenerationComponent,
    CodeViewerComponent
  ],
  imports: [
    CommonModule,
    CodeRoutingModule
  ]
})
export class CodeModule { }
