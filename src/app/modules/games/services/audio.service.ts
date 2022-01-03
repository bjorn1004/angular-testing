import { Injectable } from '@angular/core';
import { timer } from 'rxjs';
import { first } from 'rxjs/operators';
import { Note } from '../contracts/note';

@Injectable({
	providedIn: 'root',
})
export class AudioService {
	readonly #audioContext: AudioContext = new AudioContext();
	#masterGain = this.#audioContext.createGain();
	#oscs: [blipOsc: OscillatorNode] = [this.#audioContext.createOscillator()];

	constructor() {
		this.#masterGain.gain.setValueAtTime(0.01, this.#audioContext.currentTime);
		this.#masterGain.connect(this.#audioContext.destination);

		// Set up blip
		this.#oscs[0].type = 'square';
		this.#oscs[0].start();
	}

	public get masterVolume(): number {
		return this.#masterGain.gain.value;
	}
	public set masterVolume(v: number) {
		this.#masterGain.gain.value = v;
	}

	/**
	 * Plays a short blip at the given note or frequency
	 */
	// TODO: maybe abstract this further?
	public playBlip(hz: Note | number = Note.A4) {
		this.#audioContext.resume().then(() => {
			this.#oscs[0].frequency.setValueAtTime(hz, this.#audioContext.currentTime);
			this.#oscs[0].connect(this.#masterGain);
			timer(100)
				.pipe(first())
				.subscribe(() => {
					this.#oscs[0].disconnect();
				});
		});
	}

	/**
	 * stops all oscillators
	 */
	public stopAll() {
		this.#oscs.forEach((osc) => {
			osc.disconnect();
		});
		this.#audioContext.suspend();
	}
}
