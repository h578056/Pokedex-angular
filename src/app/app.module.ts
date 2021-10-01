import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http'
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login-page/login.component'
import { CatalogPageComponent } from './pages/catalog-page/catalog-page.component';
import { AppRoutingModule } from './app-routing.module';
import { TrainerPageComponent } from './pages/trainer-page/trainer-page.component';
import { FormsModule } from '@angular/forms';
// Decorator
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CatalogPageComponent,
    TrainerPageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
