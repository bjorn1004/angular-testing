import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: 'threejs',
		loadChildren: () => import('./modules/three-js/three-js.module').then((m) => m.ThreeJSModule),
	},
	{ path: 'games', loadChildren: () => import('./modules/games/games.module').then((m) => m.GamesModule) },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
