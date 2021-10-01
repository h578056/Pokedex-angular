import {NgModule} from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CatalogPageComponent } from './pages/catalog-page/catalog-page.component'
import { LoginComponent } from './pages/login-page/login.component'
import { AuthGuard } from './services/auth.guard'
import { TrainerPageComponent } from './pages/trainer-page/trainer-page.component'
// landingpage
//catalogepage
//trainerpage
const routes: Routes = [
    {
		path: '',
		pathMatch: 'full',
		redirectTo: '/login'
	},
    {
        path: 'catalog',
        component: CatalogPageComponent,
        canActivate: [ AuthGuard ] 
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'trainer',
        component: TrainerPageComponent,
        canActivate: [ AuthGuard ] 
    }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}