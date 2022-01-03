import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesRoutingModule } from './games-routing.module';
import { GamesComponent } from './components/games-main/games.component';
import { MinesweeperModule } from './components/minesweeper/minesweeper.module';
import { MatSliderModule } from '@angular/material/slider';
import { MaterialModule } from '../shared/material/material.module';

@NgModule({
	declarations: [GamesComponent],
	imports: [CommonModule, GamesRoutingModule, MinesweeperModule, MatSliderModule, MaterialModule],
})
export class GamesModule {}
