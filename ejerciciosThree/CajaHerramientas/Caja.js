
import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'


class Caja extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    this.rotacion = 0;
    
    var caja = this.createCaja ();
    this.caja = caja.toMesh();
    this.createTapa();
    this.add(this.caja);
    this.add(this.tapa);
  }

  createCaja () {
    this.materialCaja = new THREE.MeshPhongMaterial({color : 0xF2F3F});
    this.materialTapa = new THREE.MeshPhongMaterial({color : 0xFF0000});
    var cajaMesh = new THREE.Mesh(new THREE.BoxGeometry(3, 2, 6, 32, 32, 32), this.materialCaja);
    var hueco = new THREE.Mesh(new THREE.BoxGeometry(2.9, 1.9, 5.9, 32, 32, 32), this.materialCaja);
    

    hueco.translateY(0.1);
    var caja = new CSG();
    caja.subtract([cajaMesh, hueco]);
    return caja;
  }

  createTapa () {
    var tapa = new THREE.Mesh(new THREE.BoxGeometry(3, 0.1, 6, 32, 32, 32), this.materialTapa);
    this.tapa = tapa;
    
    this.tapa.translateY(1.05);
  }

  translateTapa (toPivot) {
    if (toPivot == 1) {
      this.tapa.translateX(-1.5);
    }
    else {
      this.tapa.translateX(1.5);
    }
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
    if (this.rotacion <= 0.4) {
      this.translateTapa(1);
      this.tapa.rotateZ(0.01);
      this.translateTapa(0);
      this.rotacion += 0.01;
    }
      
  }
}

export { Caja }
