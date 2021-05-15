import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeMainComponent } from './components/home-main/home-main.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { HOME_ROUTES } from './home.routes';

@NgModule({
	declarations: [HomeMainComponent],
	imports: [SharedModule, RouterModule.forChild(HOME_ROUTES)],
})
export class HomeModule {}
