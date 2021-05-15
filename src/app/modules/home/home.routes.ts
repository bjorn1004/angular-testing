import { Routes } from '@angular/router';
import { HomeMainComponent } from './components/home-main/home-main.component';

export const HOME_ROUTES: Routes = [
	{
		path: '',
		pathMatch: 'full',
		component: HomeMainComponent,
	},
];
