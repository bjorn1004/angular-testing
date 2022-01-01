import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { TileState } from '../../contracts/neighbouring-mines';

@Component({
	selector: 'app-minesweeper-tile',
	templateUrl: './minesweeper-tile.component.html',
	styleUrls: ['./minesweeper-tile.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinesweeperTileComponent implements OnInit {
	@Input() id = -1;
	@Input() tileState = TileState.NONE;
	@Input() clicked = false;
	@Output() clickedChange = new EventEmitter<boolean>();
	@Input() marked = false;
	@Output() markedChange = new EventEmitter<boolean>();

	constructor() {}

	public get tileStateEnum(): typeof TileState {
		return TileState;
	}

	ngOnInit(): void {
		if (this.id === -1) {
			throw new Error('ID not instantiated');
		}
	}

	/**
	 * onClicked
	 */
	public onClicked() {
		if (!this.clicked && !this.marked) {
			this.clicked = true;
			return this.clickedChange.emit(this.clicked);
		}
	}

	/**
	 * onMarked
	 */
	public onMarked() {
		if (!this.clicked) {
			this.marked = !this.marked;
			this.markedChange.emit(this.marked);
		}
		// return false to prevent context menu from showing up
		return false;
	}
}
