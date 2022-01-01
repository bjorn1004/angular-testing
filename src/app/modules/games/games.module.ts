import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesRoutingModule } from './games-routing.module';
import { GamesComponent } from './components/games-main/games.component';
import { MinesweeperModule } from './components/minesweeper/minesweeper.module';

@NgModule({
	declarations: [GamesComponent],
	imports: [CommonModule, GamesRoutingModule, MinesweeperModule],
})
export class GamesModule {}
