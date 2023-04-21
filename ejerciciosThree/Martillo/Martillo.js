
import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'


class Martillo extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    this.hammerHead = this.createHead();
    this.hammerHandle = this.createHandle();

    this.hammerHead.translateY(1.5);
    this.hammerHead.translateZ(-0.5);

    this.add(this.hammerHead);
    this.add(this.hammerHandle);
  }

  createHead() {
    this.hammerMaterial = new THREE.MeshPhongMaterial({color : 0x808487});
    var headMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 3, 32, 32, 32), this.hammerMaterial);

    return headMesh;

  }

  createHandle () {
    this.handleMaterial = new THREE.MeshPhongMaterial({color : 0xB4674D});
    this.holeMaterial = new THREE.MeshPhongMaterial({color : 0x000000});
    var handleMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 5, 32, 1, false, 0, 2*Math.PI), this.handleMaterial);
    var hole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.5, 32, 1, false, 0, 2*Math.PI), this.handleMaterial);
    
    hole.translateY(-2);
    hole.rotateZ(Math.PI/2);
    var csg = new CSG();

    csg.subtract([handleMesh, hole]);
    var handle = csg.toMesh();

    return handle;
  }
  
  
  createGUI (gui,titleGui) {
    // Controles para el movimiento de la parte móvil
    this.guiControls = {
      rotacion : 0
    } 
    
    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder (titleGui);
    }
  
  update () {
  }
}

export { Martillo }
