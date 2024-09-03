import { Component, OnDestroy, OnInit } from '@angular/core';
import { AudioService } from '../../services/audio.service';

@Component({
	selector: 'app-games',
	templateUrl: './games.component.html',
	styleUrls: ['./games.component.scss'],
})
export class GamesComponent implements OnInit, OnDestroy {
	constructor(public audioService: AudioService) {}

	ngOnInit(): void {}

	ngOnDestroy(): void {
		this.audioService.stopAll();
	}

	public onVolumeChange(value: number) {
		if (value !== null) {
			this.audioService.masterVolume = value;
		}
		this.audioService.playBlip();
	}
}
