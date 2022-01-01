import { ViewportRuler } from '@angular/cdk/scrolling';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { animationFrameScheduler, of, Subject } from 'rxjs';
import { finalize, repeat, takeUntil } from 'rxjs/operators';
import {
	BoxGeometry,
	BufferGeometry,
	Material,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	Scene,
	WebGLRenderer,
} from 'three';

@Component({
	selector: 'app-three-js-main',
	templateUrl: './three-js-main.component.html',
	styleUrls: ['./three-js-main.component.scss'],
})
export class ThreeJsMainComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('renderView') renderView: ElementRef<HTMLCanvasElement> | undefined;
	#camera: PerspectiveCamera | undefined;
	#geometryArray: BufferGeometry[] = [];
	#materialArray: Material[] = [];
	#meshArray: Mesh[] = [];
	#scene: Scene | undefined;
	#renderer: WebGLRenderer | undefined;
	#cleanupSubject: Subject<void> = new Subject();

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

	ngOnDestroy(): void {
		this.#cleanupSubject.next();
		this.#cleanupSubject.complete();
	}

	#setupScene(renderView: ElementRef<HTMLCanvasElement>) {
		this.#scene = new Scene();
		this.#camera = new PerspectiveCamera(
			75,
			renderView.nativeElement.clientWidth / renderView.nativeElement.clientHeight,
			0.1,
			1000
		);

		const geometry = this.#geometryArray.push(new BoxGeometry()) - 1;
		const material = this.#materialArray.push(new MeshBasicMaterial({ color: 0x00ff00 })) - 1;
		const cube = this.#meshArray.push(new Mesh(this.#geometryArray[geometry], this.#materialArray[material])) - 1;
		this.#scene.add(this.#meshArray[cube]);

		this.#camera.position.z = 5;

		this.#renderer = new WebGLRenderer({ canvas: renderView.nativeElement });
		return cube;
	}

	#setupRenderLoop(cube: number) {
		let frame = 0;
		of(null, animationFrameScheduler)
			.pipe(
				repeat(),
				takeUntil(this.#cleanupSubject),
				finalize(() => this.#cleanupRenderView())
			)
			.subscribe(() => {
				frame++;
				this.#meshArray[cube].rotation.x += 0.01;
				this.#meshArray[cube].rotation.y += 0.01;
				if (this.#scene && this.#camera) {
					(this.#renderer as WebGLRenderer).render(this.#scene, this.#camera);
				}
			});
	}

	#cleanupRenderView() {
		// stop render loop
		if (this.#scene) {
			// remove all meshes from the scene
			this.#meshArray.forEach((mesh) => {
				(this.#scene as Scene).remove(mesh);
			});
		}
		// dispose of all geometry
		this.#geometryArray.forEach((geo) => {
			geo.dispose();
		});
		// dispose of all materials
		this.#materialArray.forEach((mat) => {
			mat.dispose();
		});
		// dispose of the renderer and context
		if (this.#renderer) {
			this.#renderer.dispose();
			// shouldn't dispose() already do this for me? kind of silly I guess
			this.#renderer.forceContextLoss();
			// Don't actually seem to need to delete the context and dom by hand
			// typescript being smelly, need as any
			// delete (this.#renderer as any).context;
			// delete (this.#renderer as any).domElement;
		}
	}
}
