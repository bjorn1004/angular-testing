import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeMainComponent } from './modules/home/components/home-main/home-main.component';

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'home',
	},
	{
		path: 'home',
		loadChildren: () => import('./modules/home/home.module').then((m) => m.HomeModule),
	},
	{
		path: 'threejs',
		loadChildren: () => import('./modules/three-js/three-js.module').then((m) => m.ThreeJSModule),
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
