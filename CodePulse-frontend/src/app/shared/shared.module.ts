import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ErrorComponent } from './components/error/error.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    LoaderComponent,
    ErrorComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
