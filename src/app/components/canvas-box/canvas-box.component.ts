import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { CommonModule } from '@angular/common';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-canvas-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './canvas-box.component.html',
  styleUrl: './canvas-box.component.scss',
  providers: [{ provide: Window, useValue: window }]
})
export class CanvasBoxComponent implements OnInit {
  @ViewChild('canvas', { static: false }) private canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private model: any;
  private controls!: OrbitControls; // Declare controls variable


  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.initThreeJS();
    this.initControls(); // Initialize controls
    this.animate();
    window.addEventListener('resize', this.onWindowResize, false);
    this.onWindowResize();
  }

  ngOnDestroy() {
    this.renderer.dispose();
    window.removeEventListener('resize', this.onWindowResize, false);
  }

  private initThreeJS() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x000000, 0); // Set background to transparent
    this.renderer.shadowMap.enabled = true; // Enable shadow maps
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Optional: Set shadow map type

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    this.camera.position.set(3, 1.2, 2);

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1.5);
    this.scene.add(light);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 7.5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 50;
    dirLight.shadow.camera.left = -10;
    dirLight.shadow.camera.right = 10;
    dirLight.shadow.camera.top = 10;
    dirLight.shadow.camera.bottom = -10;
    this.scene.add(dirLight);

    const loader = new GLTFLoader();
    loader.load('assets/blender/car/scene.gltf', (gltf) => {
      this.model = gltf.scene;
      
      // Set initial facing direction
      this.model.rotation.y = Math.PI / 2; // Rotate 90 degrees, adjust as needed

      // Enable shadows for the model
      this.model.traverse((node: { castShadow: boolean; }) => {
        if (node instanceof THREE.Mesh) {
          node.castShadow = true;
        }
      });
      
      this.scene.add(this.model);
    });

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.ShadowMaterial({ opacity: 0.5 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  private initControls() {
    // Initialize OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; // Optional: smooth out camera movement
    this.controls.dampingFactor = 0.25;
    this.controls.rotateSpeed = 0.35; // Adjust rotation speed
    this.controls.zoomSpeed = 0.5; // Adjust zoom speed
    this.controls.enablePan = false; // Disable pan (optional)
    this.controls.enableZoom = false; // Disable zoom
  }

  private onWindowResize = () => {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    // Update camera aspect ratio and renderer size
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private animate = () => {
    requestAnimationFrame(this.animate);

    // Update controls
    this.controls.update();

    // Optionally rotate the model
    if (this.model) {
      this.model.rotation.y -= 0.01; // Uncomment if you want the model to rotate independently
    }

    this.renderer.render(this.scene, this.camera);
  }
}
