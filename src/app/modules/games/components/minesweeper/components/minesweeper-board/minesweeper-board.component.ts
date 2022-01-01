import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { GameState } from '../../contracts/game-state';
import { TileState } from '../../contracts/neighbouring-mines';
import { Tile } from '../../contracts/tile';

@Component({
	selector: 'app-minesweeper-board',
	templateUrl: './minesweeper-board.component.html',
	styleUrls: ['./minesweeper-board.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinesweeperBoardComponent implements OnInit {
	@Input() width = 10;
	@Input() height = 10;
	@Input() mineperc = 0.2;
	@Output() gameStateChange = new EventEmitter<GameState>();
	tileList: Array<Tile> | undefined;

	#gameState: GameState = GameState.NEW;

	constructor() {}

	public get gameStateEnum(): typeof GameState {
		return GameState;
	}

	public get gameState(): GameState {
		return this.#gameState;
	}
	@Input() public set gameState(v: GameState) {
		this.#gameState = v;
		this.gameStateChange.emit(v);
		if (this.#gameState === GameState.NEW) {
			// set up tile array
			this.#setupTiles();
		}
	}

	ngOnInit(): void {}

	/**
	 * resetGame
	 */
	public resetGame() {
		this.gameState = GameState.NEW;
		this.#setupTiles();
	}

	/**
	 * onClickTile
	 */
	public onClickTile(tile: Tile) {
		this.gameState = GameState.IN_PROGRESS;
		const clickedSet = new Set<Tile>();
		const clickAllAdjecent = (tiles: Array<Tile>, tileID: number, width: number) => {
			const propegateClicks = (subId: number) => {
				tiles[subId].isClicked = true;
				if (tiles[subId].tileState === TileState.NONE && !clickedSet.has(tiles[subId])) {
					clickedSet.add(tiles[subId]);
					clickAllAdjecent(tiles, subId, width);
				}
			};
			const leftId = tileID - 1;
			if (leftId >= 0) {
				// tile falls in the arrays range (it can never go over, since we're subtracting)
				if (leftId % width !== width - 1) {
					propegateClicks(leftId);
				}
				// repeat this for all 8 surrounding tiles
				// also we nest the if-statements, since if the tile directly left is out of bounds
				// so will any would-be further back, and so on
				const topRightId = tileID - (width - 1);
				if (topRightId >= 0) {
					if (topRightId % width !== 0) {
						propegateClicks(topRightId);
					}
					const topCenterId = tileID - width;
					if (topCenterId >= 0) {
						propegateClicks(topCenterId);
						const topLeftId = tileID - (width + 1);
						if (topLeftId >= 0) {
							if (topLeftId % width !== width - 1) {
								propegateClicks(topLeftId);
							}
						}
					}
				}
			}
			// we're now adding, so check if we're going out of bounds instead
			const rightId = tileID + 1;
			if (rightId < tiles.length) {
				if (rightId % width !== 0) {
					propegateClicks(rightId);
				}
				const bottomLeftId = tileID + (width - 1);
				if (bottomLeftId < tiles.length) {
					if (bottomLeftId % width !== width - 1) {
						propegateClicks(bottomLeftId);
					}
					const bottomCenterId = tileID + width;
					if (bottomCenterId < tiles.length) {
						propegateClicks(bottomCenterId);
						const bottomRightId = tileID + (width + 1);
						if (bottomRightId < tiles.length && bottomRightId % width !== 0) {
							propegateClicks(bottomRightId);
						}
					}
				}
			}
		};
		if (tile.tileState !== TileState.MINE) {
			if (tile.tileState === TileState.NONE) {
				// click on all neighbouring tiles
				clickAllAdjecent(this.tileList as Tile[], tile.id, this.width);
				this.#checkWin();
			}
			this.#checkWin();
		} else {
			// dead lol
			// reveal all tiles
			(this.tileList as Tile[]).forEach((_tile) => {
				_tile.isClicked = true;
			});
			this.gameState = GameState.LOST;
		}
		return;
	}

	/**
	 * onMarkTile
	 */
	public onMarkTile(tile: Tile) {
		this.#checkWin();
	}

	#checkWin() {
		if (
			// check all mines marked
			(this.tileList as Tile[]).filter((tile) => tile.tileState === TileState.MINE).findIndex((tile) => !tile.isMarked) ===
				-1 &&
			// check all non-mine tiles revealed
			(this.tileList as Tile[])
				.filter((tile) => tile.tileState !== TileState.MINE)
				.findIndex((tile) => !tile.isClicked) === -1
		) {
			this.gameState = GameState.WON;
		}
	}

	#setupTiles(): void {
		this.tileList = new Array<Tile>(this.width * this.height);
		// assign random mines
		const mineCount = Math.ceil(this.tileList.length * this.mineperc);
		const distribute = (length: number, value: number): Array<boolean> => {
			const array = new Array<boolean>(length);
			for (let i = 0; i < value; i++) {
				array[i] = true;
			}
			let currentIndex = length;
			let randomIndex: number;

			// While there remain elements to shuffle...
			while (currentIndex !== 0) {
				// Pick a remaining element...
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex--;

				// And swap it with the current element.
				[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
			}

			return array;
		};
		const spread = distribute(this.tileList.length, mineCount);
		for (let i = 0; i < this.tileList.length; i++) {
			this.tileList[i] = {
				id: i,
				isClicked: false,
				isMarked: false,
				tileState: spread[i] ? TileState.MINE : TileState.NONE,
			};
		}
		// calculate neighbouring mines
		this.tileList.forEach((tile, id, tiles) => {
			// we don't need to calculate for mines
			if (tile.tileState !== TileState.MINE) {
				/**
				 * O is our tile, we need to check 8 spots around the current mine
				 * X X X
				 * X O X
				 * X X X
				 * The top left mine is one row above, and one to the left,
				 * since the tiles are stored in one-dimensional array we
				 * can get there by subtracting the width of our table + one extra for back
				 * 1 2 3
				 * 4 5 6
				 * 7 8 9
				 * 5 - 3 - 1 = 1
				 *
				 * TODO: current setup does not respect board boundries
				 */
				// before we try to access the tile, let's see if it first falls in our array range
				const adjecent: [
					topLeftIsMine: boolean,
					topCenterIsMine: boolean,
					topRightIsMine: boolean,
					leftIsMine: boolean,
					rightIsMine: boolean,
					bottomLeftIsMine: boolean,
					bottomCenterIsMine: boolean,
					bottomRightIsMine: boolean
				] = [false, false, false, false, false, false, false, false];
				const leftId = id - 1;
				if (leftId >= 0) {
					// tile falls in the arrays range (it can never go over, since we're subtracting)
					if (leftId % this.width !== this.width - 1) {
						adjecent[3] = tiles[leftId].tileState === TileState.MINE;
					}
					// repeat this for all 8 surrounding tiles
					// also we nest the if-statements, since if the tile directly left is out of bounds
					// so will any would-be further back, and so on
					const topRightId = id - (this.width - 1);
					if (topRightId >= 0) {
						if (topRightId % this.width !== 0) {
							adjecent[2] = tiles[topRightId].tileState === TileState.MINE;
						}
						const topCenterId = id - this.width;
						if (topCenterId >= 0) {
							adjecent[1] = tiles[topCenterId].tileState === TileState.MINE;
							const topLeftId = id - (this.width + 1);
							if (topLeftId >= 0) {
								if (topLeftId % this.width !== this.width - 1) {
									adjecent[0] = tiles[topLeftId].tileState === TileState.MINE;
								}
							}
						}
					}
				}
				// we're now adding, so check if we're going out of bounds instead
				const rightId = id + 1;
				if (rightId < tiles.length) {
					if (rightId % this.width !== 0) {
						adjecent[4] = tiles[rightId].tileState === TileState.MINE;
					}
					const bottomLeftId = id + (this.width - 1);
					if (bottomLeftId < tiles.length) {
						if (bottomLeftId % this.width !== this.width - 1) {
							adjecent[5] = tiles[bottomLeftId].tileState === TileState.MINE;
						}
						const bottonCenterId = id + this.width;
						if (bottonCenterId < tiles.length) {
							adjecent[6] = tiles[bottonCenterId].tileState === TileState.MINE;
							const bottomRightId = id + (this.width + 1);
							if (bottomRightId < tiles.length && bottomRightId % this.width !== 0) {
								adjecent[7] = tiles[bottomRightId].tileState === TileState.MINE;
							}
						}
					}
				}

				// all 8 adjecent have been checked,
				// get the total and set the neighbourMineCount
				let neighbouringMines = 0;
				for (const isMine of adjecent) {
					if (isMine) {
						neighbouringMines++;
					}
				}
				tile.tileState = neighbouringMines;
			}
		});
	}
}
