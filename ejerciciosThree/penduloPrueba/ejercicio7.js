
import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'


class penduloPrueba extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    this.height = 5;
    this.pendulo1 = new THREE.Object3D();
    this.pendulo2 = new THREE.Object3D();

    this.cuerda1 = this.createRope();
    this. apple = this.createApple();

    this.cuerda1.position.y = -this.height/2;
    this.pendulo1.add(this.cuerda1);
    this.pendulo2.add(this.cuerda1.clone());
    this.pendulo2.translateX(3);
    
    this.add(this.apple);
    // this.add(this.pendulo1);
    // this.add(this.pendulo2);
  }

  createRope () {
    this.geometriaRope = new THREE.CylinderGeometry(0.05, 0.05, this.height, 32, 32, false, 0, 2*Math.PI);
    this.materialRope = new THREE.MeshPhongMaterial({color : 0xF8F5E6});

    return new THREE.Mesh(this.geometriaRope, this.materialRope); 
  }

  createApple() {
    var apple = new THREE.Shape();
    this.materialLine = new THREE.LineBasicMaterial({color: 0x000000});
    this.materialApple = new THREE.MeshPhongMaterial({color : 0xFF0000});
    
    apple.moveTo(0.0001, 0);
    apple.quadraticCurveTo(0.2, -0.1, 0.6, -0.1);
    apple.quadraticCurveTo(1.1, -0.1, 1.1, 0.7);
    apple.quadraticCurveTo(1.1, 1.5, 0.000001, 1.5);

    var points = apple.extractPoints(20).shape;

    var line = new THREE.BufferGeometry();
    line.setFromPoints(points);
    line = new THREE.Line(line, this.materialLine);
    this.add(line);
    var appleMesh = new THREE.Mesh(new THREE.LatheGeometry(points, 20, 0, 2*Math.PI), this.materialApple);

    return appleMesh;
  }

  createGUI (gui,titleGui) {
  }
  
  update () {
    this.pendulo1.rotateZ(0.01);
    this.pendulo2.rotateZ(0.01);
  }
}

export { penduloPrueba }
