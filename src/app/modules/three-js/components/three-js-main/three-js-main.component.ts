import { ViewportRuler } from '@angular/cdk/scrolling';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
	selector: 'app-three-js-main',
	templateUrl: './three-js-main.component.html',
	styleUrls: ['./three-js-main.component.scss'],
})
export class ThreeJsMainComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('renderView') renderView: ElementRef<HTMLCanvasElement> | undefined;
	#active = true;

	constructor(private viewPortRuler: ViewportRuler) {}

	ngOnInit(): void {
		this.viewPortRuler.change(10).subscribe((change) => {
			// when viewport changes size, update the canvas properties
			if (this.renderView) {
				this.renderView.nativeElement.height = this.renderView.nativeElement.clientHeight;
				this.renderView.nativeElement.width = this.renderView.nativeElement.clientWidth;
			}
		});
	}

	ngAfterViewInit() {
		console.log(this.renderView);
		if (this.renderView) {
			this.renderView.nativeElement.height = this.renderView.nativeElement.clientHeight;
			this.renderView.nativeElement.width = this.renderView.nativeElement.clientWidth;
			this.#setupRenderLoop(this.#setupScene(this.renderView));
		}
	}

	ngOnDestroy() {
		this.#cleanupRenderView();
	}

	#setupScene(renderView: ElementRef<HTMLCanvasElement>) {
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			75,
			renderView.nativeElement.clientWidth / renderView.nativeElement.clientHeight,
			0.1,
			1000
		);

		const geometry = new THREE.BoxGeometry();
		const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		const cube = new THREE.Mesh(geometry, material);
		scene.add(cube);

		camera.position.z = 5;

		const renderer = new THREE.WebGLRenderer({ canvas: renderView.nativeElement });
		return { renderer, scene, camera, cube };
	}

	#setupRenderLoop({
		renderer,
		scene,
		camera,
		cube,
	}: {
		renderer: THREE.WebGLRenderer;
		scene: THREE.Scene;
		camera: THREE.PerspectiveCamera;
		cube: THREE.Mesh<THREE.BoxGeometry>;
	}) {
		const animate = () => {
			if (this.#active) {
				const frame = requestAnimationFrame(animate);
			}
			cube.rotation.x += 0.01;
			cube.rotation.y += 0.01;
			renderer.render(scene, camera);
		};
		animate();
	}

	#cleanupRenderView() {
		// stop render loop
		this.#active = false;
	}
}
