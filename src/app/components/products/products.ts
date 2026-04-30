import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';

interface ProductScene {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  group: THREE.Group;
  animId: number;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class ProductsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas1') canvas1Ref!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas2') canvas2Ref!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas3') canvas3Ref!: ElementRef<HTMLCanvasElement>;

  private scenes: ProductScene[] = [];

  products = [
    {
      name: 'Implante Dental Pro',
      description:
        'Implante de titanio grado 5 con superficie SLA para una osteointegración superior y durabilidad excepcional.',
      tag: 'Más vendido',
    },
    {
      name: 'Corona Zirconio',
      description:
        'Corona de óxido de zirconio de alta translucidez. Estética natural y resistencia inigualable.',
      tag: 'Premium',
    },
    {
      name: 'Kit Blanqueamiento',
      description:
        'Sistema profesional de blanqueamiento en consulta con gel de peróxido al 38% y activación LED.',
      tag: 'Nuevo',
    },
  ];

  ngAfterViewInit(): void {
    this.initImplant(this.canvas1Ref.nativeElement);
    this.initCrown(this.canvas2Ref.nativeElement);
    this.initWhitening(this.canvas3Ref.nativeElement);
  }

  private createBaseScene(canvas: HTMLCanvasElement): ProductScene {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(280, 280);
    renderer.setClearColor(0x000000, 0);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(4, 6, 4);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x3ec6c6, 0.3);
    fillLight.position.set(-4, -2, 2);
    scene.add(fillLight);

    const group = new THREE.Group();
    scene.add(group);

    return { renderer, scene, camera, group, animId: 0 };
  }

  // ── Product 1: Dental Implant ──────────────────────────────────────────────
  private initImplant(canvas: HTMLCanvasElement): void {
    const ps = this.createBaseScene(canvas);

    // Main implant body — tapered cylinder
    const bodyGeo = new THREE.CylinderGeometry(0.28, 0.14, 1.8, 32);
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0xd0d8e0,
      metalness: 0.85,
      roughness: 0.15,
    });
    const body = new THREE.Mesh(bodyGeo, metalMat);
    body.position.y = -0.2;
    ps.group.add(body);

    // Thread rings
    const threadMat = new THREE.MeshStandardMaterial({
      color: 0xb8c4d0,
      metalness: 0.9,
      roughness: 0.1,
    });
    for (let i = 0; i < 8; i++) {
      const threadGeo = new THREE.TorusGeometry(0.22 - i * 0.009, 0.025, 8, 28);
      const thread = new THREE.Mesh(threadGeo, threadMat);
      thread.rotation.x = Math.PI / 2;
      thread.position.y = 0.4 - i * 0.22;
      ps.group.add(thread);
    }

    // Abutment (wider neck)
    const abutGeo = new THREE.CylinderGeometry(0.32, 0.28, 0.4, 32);
    const abutMat = new THREE.MeshStandardMaterial({
      color: 0xe8eef4,
      metalness: 0.75,
      roughness: 0.2,
    });
    const abut = new THREE.Mesh(abutGeo, abutMat);
    abut.position.y = 0.85;
    ps.group.add(abut);

    // Crown disc
    const crownGeo = new THREE.CylinderGeometry(0.45, 0.32, 0.2, 32);
    const crownMat = new THREE.MeshStandardMaterial({
      color: 0xf5f0e8,
      metalness: 0.1,
      roughness: 0.4,
    });
    const crown = new THREE.Mesh(crownGeo, crownMat);
    crown.position.y = 1.15;
    ps.group.add(crown);

    ps.group.rotation.x = 0.3;

    this.startAnimation(ps, 0.008, 0);
    this.scenes.push(ps);
  }

  // ── Product 2: Zirconia Crown ──────────────────────────────────────────────
  private initCrown(canvas: HTMLCanvasElement): void {
    const ps = this.createBaseScene(canvas);

    // Crown dome — half-sphere approximated via sphere clipped
    const domeMat = new THREE.MeshPhongMaterial({
      color: 0xfaf6f0,
      specular: 0x888888,
      shininess: 80,
      transparent: true,
      opacity: 0.97,
    });

    // Main body: squashed sphere
    const crownGeo = new THREE.SphereGeometry(0.9, 48, 48);
    const crown = new THREE.Mesh(crownGeo, domeMat);
    crown.scale.set(1, 0.75, 1);
    crown.position.y = 0.2;
    ps.group.add(crown);

    // Base ring
    const baseGeo = new THREE.TorusGeometry(0.7, 0.12, 16, 64);
    const baseMat = new THREE.MeshPhongMaterial({
      color: 0xf0ebe0,
      specular: 0xaaaaaa,
      shininess: 60,
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.rotation.x = Math.PI / 2;
    base.position.y = -0.45;
    ps.group.add(base);

    // Subtle teal outline ring
    const outlineGeo = new THREE.TorusGeometry(0.92, 0.03, 8, 64);
    const outlineMat = new THREE.MeshStandardMaterial({ color: 0x3ec6c6, metalness: 0.4, roughness: 0.3 });
    const outline = new THREE.Mesh(outlineGeo, outlineMat);
    outline.rotation.x = Math.PI / 2;
    outline.position.y = 0.15;
    ps.group.add(outline);

    ps.group.rotation.x = -0.2;

    this.startAnimation(ps, 0.007, 0);
    this.scenes.push(ps);
  }

  // ── Product 3: Whitening Kit ───────────────────────────────────────────────
  private initWhitening(canvas: HTMLCanvasElement): void {
    const ps = this.createBaseScene(canvas);

    // Tube body
    const tubeGeo = new THREE.CylinderGeometry(0.42, 0.4, 2.0, 32);
    const whiteMat = new THREE.MeshStandardMaterial({
      color: 0xfafafa,
      metalness: 0.05,
      roughness: 0.5,
    });
    const tube = new THREE.Mesh(tubeGeo, whiteMat);
    tube.position.y = -0.1;
    ps.group.add(tube);

    // Teal stripe bands
    const stripeMat = new THREE.MeshStandardMaterial({
      color: 0x3ec6c6,
      metalness: 0.2,
      roughness: 0.3,
    });
    for (const yPos of [0.3, -0.1, -0.5]) {
      const stripeGeo = new THREE.CylinderGeometry(0.435, 0.435, 0.09, 32);
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.position.y = yPos;
      ps.group.add(stripe);
    }

    // Nozzle cone
    const nozzleGeo = new THREE.ConeGeometry(0.3, 0.55, 32);
    const nozzleMat = new THREE.MeshStandardMaterial({
      color: 0xe0e0e0,
      metalness: 0.3,
      roughness: 0.35,
    });
    const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
    nozzle.position.y = 1.18;
    ps.group.add(nozzle);

    // Nozzle tip cap
    const capGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.15, 16);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x3ec6c6, metalness: 0.5, roughness: 0.2 });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 1.53;
    ps.group.add(cap);

    // Bottom rounded cap
    const bottomGeo = new THREE.CylinderGeometry(0.42, 0.38, 0.15, 32);
    const bottom = new THREE.Mesh(bottomGeo, whiteMat);
    bottom.position.y = -1.08;
    ps.group.add(bottom);

    ps.group.rotation.x = 0.2;

    this.startAnimation(ps, 0.006, 0);
    this.scenes.push(ps);
  }

  private startAnimation(ps: ProductScene, rotSpeed: number, tiltAmp: number): void {
    const animate = () => {
      ps.animId = requestAnimationFrame(animate);
      ps.group.rotation.y += rotSpeed;
      ps.renderer.render(ps.scene, ps.camera);
    };
    animate();
  }

  ngOnDestroy(): void {
    for (const ps of this.scenes) {
      cancelAnimationFrame(ps.animId);
      ps.renderer.dispose();
    }
  }
}
