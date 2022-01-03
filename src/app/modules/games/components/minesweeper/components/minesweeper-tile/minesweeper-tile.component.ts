import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { AudioService } from 'src/app/modules/games/services/audio.service';
import { TileState } from '../../contracts/neighbouring-mines';

@Component({
	selector: 'app-minesweeper-tile',
	templateUrl: './minesweeper-tile.component.html',
	styleUrls: ['./minesweeper-tile.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinesweeperTileComponent {
	@Input() id = -1;
	@Input() tileState = TileState.NONE;
	@Input() clicked = false;
	@Output() clickedChange = new EventEmitter<boolean>();
	@Input() marked = false;
	@Output() markedChange = new EventEmitter<boolean>();

	public get tileStateEnum(): typeof TileState {
		return TileState;
	}

	/**
	 * onClicked
	 */
	public onClicked(): void {
		if (!this.clicked && !this.marked) {
			this.clicked = true;
			this.clickedChange.emit(this.clicked);
		}
	}

	/**
	 * onMarked
	 */
	public onMarked(): false {
		if (!this.clicked) {
			this.marked = !this.marked;
			this.markedChange.emit(this.marked);
		}
		// return false to prevent context menu from showing up
		return false;
	}
}
