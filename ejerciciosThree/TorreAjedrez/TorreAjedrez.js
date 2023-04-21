
import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'


class Torre extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    this.createTorre();
  }

  createTorre() {
      var TorreLine = new THREE.Shape();    
      this.materialLine = new THREE.LineBasicMaterial({color: 0x000000});
      this.materialTorre = new THREE.MeshPhongMaterial({color : 0x000000});
      this.materialCruz = new THREE.MeshPhongMaterial({color : 0xFF0000});
      TorreLine.moveTo(0.0001, 0);
      TorreLine.lineTo(1.2001, 0);        //Se mueve a 0.998, 0.1
      TorreLine.quadraticCurveTo(1.2001, 0.1, 1.0001, 0.1);
      TorreLine.quadraticCurveTo(1.0001, 0.25, 0.7001, 0.25);
      TorreLine.lineTo(0.5001, 1.25);
      TorreLine.quadraticCurveTo(0.7001, 1.25, 0.7001, 1.3);
      TorreLine.quadraticCurveTo(0.8501, 1.3, 0.8501, 1.35);
      TorreLine.quadraticCurveTo(0.8501, 1.4, 0.7001, 1.4);
      TorreLine.lineTo(0.7001, 2);
      TorreLine.lineTo(0.0001, 2);
  
      var points = TorreLine.extractPoints(20).shape;
  
      var line = new THREE.BufferGeometry();
      line.setFromPoints(points);
      line = new THREE.Line(line, this.materialLine);

      var objectTorre = new THREE.Mesh(new THREE.LatheGeometry(points, 20, 0, 2*Math.PI), this.materialTorre);
      var cubo1 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.2, 0.25, 1, 1, 1), this.materialCruz);
      var cubo2 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.2, 0.25, 1, 1, 1), this.materialCruz);

      cubo1.translateY(2);
      cubo2.translateY(2);
      cubo2.rotateY(Math.PI/2);
      var csg = new CSG();

      csg.union([cubo1, cubo2]);
      var cruz = csg.toMesh();
      var csg2 = new CSG();
      csg2.subtract([objectTorre, cruz]);
      var torre = csg2.toMesh();
      // this.add(cruz);
      this.add(torre);
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

export { Torre }
