import { TileState } from './neighbouring-mines';

export interface Tile {
	id: number;
	isMarked: boolean;
	isClicked: boolean;
	tileState: TileState;
}
