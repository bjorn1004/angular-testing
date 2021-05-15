import { Routes } from '@angular/router';
import { ThreeJsMainComponent } from './components/three-js-main/three-js-main.component';

export const THREEJS_ROUTES: Routes = [
	{
		path: '',
		pathMatch: 'full',
		component: ThreeJsMainComponent,
	},
];
