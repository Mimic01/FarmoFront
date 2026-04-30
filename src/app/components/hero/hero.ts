import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('heroCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private animationId = 0;
  private group!: THREE.Group;

  ngAfterViewInit(): void {
    this.initThree();
  }

  private initThree(): void {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.clientWidth || canvas.offsetWidth || 500;
    const height = canvas.clientHeight || canvas.offsetHeight || 500;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    this.camera.position.set(0, 0, 8);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x000000, 0);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 8, 5);
    this.scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0x3ec6c6, 0.4);
    dirLight2.position.set(-5, -3, 3);
    this.scene.add(dirLight2);

    // Group of 3 orbiting spheres
    this.group = new THREE.Group();

    const sphereGeo = new THREE.SphereGeometry(1, 64, 64);

    // Large central sphere — white/pearl
    const centerMat = new THREE.MeshStandardMaterial({
      color: 0xf0f4f8,
      metalness: 0.1,
      roughness: 0.3,
    });
    const centerSphere = new THREE.Mesh(sphereGeo, centerMat);
    this.group.add(centerSphere);

    // Medium sphere — teal, offset
    const tealMat = new THREE.MeshStandardMaterial({
      color: 0x3ec6c6,
      metalness: 0.3,
      roughness: 0.2,
    });
    const tealSphere = new THREE.Mesh(new THREE.SphereGeometry(0.55, 48, 48), tealMat);
    tealSphere.position.set(1.7, 0.9, 0.5);
    this.group.add(tealSphere);

    // Small sphere — navy, offset
    const navyMat = new THREE.MeshStandardMaterial({
      color: 0x1b2a4a,
      metalness: 0.4,
      roughness: 0.3,
    });
    const navySphere = new THREE.Mesh(new THREE.SphereGeometry(0.38, 48, 48), navyMat);
    navySphere.position.set(-1.5, -1.2, 0.8);
    this.group.add(navySphere);

    // Tooth-shape hint: a flat torus ring around center
    const ringGeo = new THREE.TorusGeometry(1.6, 0.06, 16, 80);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x3ec6c6,
      metalness: 0.5,
      roughness: 0.2,
      transparent: true,
      opacity: 0.5,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 4;
    this.group.add(ring);

    this.scene.add(this.group);

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w && h) {
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(canvas.parentElement || canvas);

    this.animate();
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());
    const t = Date.now() * 0.001;
    this.group.rotation.y = t * 0.4;
    this.group.rotation.x = Math.sin(t * 0.3) * 0.15;
    this.renderer.render(this.scene, this.camera);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    this.renderer?.dispose();
  }
}
