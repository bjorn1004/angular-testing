import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
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

	public onVolumeChange(volumeChange: MatSliderChange) {
		if (volumeChange.value !== null) {
			this.audioService.masterVolume = volumeChange.value;
		}
		this.audioService.playBlip();
	}
}
