
import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'


class Taza extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    var taza = this.createTaza();

    this.add(taza);
  }

  createTaza () {
    var taza = new CSG();
    
    this.material = new THREE.MeshPhongMaterial({color : 0xF8F5E6, side : THREE.DoubleSide});
    var asa = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.1, 12, 48, Math.PI*2), this.material);
    var cuerpo = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 2, 32, 1, false, 0, 2*Math.PI), this.material);
    cuerpo.translateX(1);
    taza.union([cuerpo, asa]);

    var hole = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 2, 32, 1, false, 0, 2*Math.PI), this.material);
    hole.translateY(0.05);
    hole.translateX(1);
    var tazaMesh = taza.toMesh();

    var tazaHueco = new CSG();


    tazaMesh = tazaHueco.subtract([tazaMesh, hole]).toMesh();

    return tazaMesh;
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

export { Taza }
