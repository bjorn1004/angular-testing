import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MinesweeperComponent } from './minesweeper.component';
import { MinesweeperTileComponent } from './components/minesweeper-tile/minesweeper-tile.component';
import { MinesweeperBoardComponent } from './components/minesweeper-board/minesweeper-board.component';
import { MaterialModule } from 'src/app/modules/shared/material/material.module';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
	declarations: [MinesweeperComponent, MinesweeperTileComponent, MinesweeperBoardComponent],
	imports: [CommonModule, MaterialModule, MatSliderModule, MatButtonToggleModule],
	exports: [MinesweeperComponent, MinesweeperTileComponent],
})
export class MinesweeperModule {}
