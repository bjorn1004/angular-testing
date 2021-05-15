import { NgModule } from '@angular/core';
import { ThreeJsMainComponent } from './components/three-js-main/three-js-main.component';
import { RouterModule } from '@angular/router';
import { THREEJS_ROUTES } from './three-js.routes';
import { SharedModule } from '../shared/shared.module';

@NgModule({
	declarations: [ThreeJsMainComponent],
	imports: [SharedModule, RouterModule.forChild(THREEJS_ROUTES)],
})
export class ThreeJSModule {}
