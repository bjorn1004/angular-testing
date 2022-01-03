import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { AudioService } from '../../services/audio.service';
import { MinesweeperBoardComponent } from './components/minesweeper-board/minesweeper-board.component';
import { GameState } from './contracts/game-state';
import { TileState } from './contracts/neighbouring-mines';

@Component({
	selector: 'app-minesweeper',
	templateUrl: './minesweeper.component.html',
	styleUrls: ['./minesweeper.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinesweeperComponent implements OnInit {
	@ViewChild('board') private board: MinesweeperBoardComponent | undefined;
	public gameState = GameState.NEW;
	public width = 10;
	public height = 10;
	public minePerc = 0.15;
	public secondsElapsed = 0;
	public fieldSweptPreLose: number | undefined;
	public $timer: Subscription | undefined;

	constructor(public audioService: AudioService, private cd: ChangeDetectorRef) {}

	ngOnInit(): void {}

	/**
	 * resetGame
	 */
	public resetGame(): void {
		if (this.board) {
			this.cd.detectChanges();
			this.board.resetGame();
			this.secondsElapsed = 0;
			this.fieldSweptPreLose = undefined;
		}
	}

	/**
	 * onWidthChange
	 */
	public onWidthChange(width: number | null): void {
		if (width) {
			this.width = width;
			this.resetGame();
		}
	}

	/**
	 * onHeightChange
	 */
	public onHeightChange(height: number | null): void {
		if (height) {
			this.height = height;
			this.resetGame();
		}
	}

	/**
	 * sizeValueMatch
	 */
	public sizeValueMatch(): number | null {
		if (this.height === this.width) {
			return this.width;
		}
		return null;
	}

	/**
	 * onHeightChange
	 */
	public onSizeChange(size: number | null): void {
		if (size) {
			this.width = size;
			this.height = size;
			this.resetGame();
		}
	}

	/**
	 * onHeightChange
	 */
	public onMinePercChange(minePerc: number | null): void {
		if (minePerc) {
			this.minePerc = minePerc;
			this.resetGame();
		}
	}

	/**
	 * onGameStateChange
	 */
	public onGameStateChange(gameState: GameState): void {
		if (gameState === GameState.IN_PROGRESS && !this.$timer) {
			// Start timer
			this.$timer = interval(1000).subscribe((sec) => {
				this.secondsElapsed = sec;
				this.cd.detectChanges();
			});
		} else if ([GameState.LOST, GameState.WON, GameState.NEW].indexOf(gameState) > -1 && this.$timer) {
			this.fieldSweptPreLose = this.getFieldSwept();
			// Stop timer
			this.$timer.unsubscribe();
			this.$timer = undefined;
		}
	}

	/**
	 * getMinesRemaining
	 */
	public getMinesRemaining(): number {
		if (this.board?.tileList) {
			return (
				this.board.tileList.filter((tile) => tile.tileState === TileState.MINE).length -
				this.board.tileList.filter((tile) => tile.isMarked).length
			);
		}
		return 0;
	}

	/**
	 * getFieldSwept
	 */
	public getFieldSwept(): number {
		if (this.board?.tileList) {
			return Math.round(
				(this.board.tileList.filter((tile) => tile.isClicked || tile.isMarked).length / this.board.tileList.length) * 100
			);
		}
		return 0;
	}

	/**
	 * formatMinePerc
	 */
	public formatMinePerc(value: number): string {
		return `${Math.floor(value * 100)}%`;
	}

	/**
	 * formatTime
	 */
	public formatTime(): string {
		const secondsInMinute = this.secondsElapsed % 60;
		const minutesInHour = Math.floor(this.secondsElapsed / 60);
		// just in case lol
		const hours = Math.floor(minutesInHour / 60);
		return `${hours ? (hours < 10 ? '0' + hours : hours) + ':' : ''}${minutesInHour < 10 ? 0 : ''}${minutesInHour % 60}:${
			secondsInMinute < 10 ? 0 : ''
		}${secondsInMinute}`;
	}
}
