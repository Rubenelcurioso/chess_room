
import * as THREE from '../libs/three.module.js'

class Revolucion extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);

    var peon = new THREE.Shape();
    peon.moveTo(0.001, 0);
    peon.lineTo(3, 0);
    peon.lineTo(3, 0.5);
  //Para que la curva salga "recta", misma X que el punto de llegada, misma Y que el punto de salida 
    peon.quadraticCurveTo(1, 1.5, 1, 6.5);
    peon.quadraticCurveTo(2, 6.5, 2, 8);
    peon.quadraticCurveTo(2, 9.5, 0.001, 9.5);
    var points = peon.extractPoints(20).shape;

    this.material = new THREE.MeshPhongMaterial({color: 0x000000});
    var ObjectPeon = new THREE.Mesh(new THREE.LatheGeometry(points, 20, 0, 2* Math.PI), this.material);
    var line = new THREE.BufferGeometry();
    line.setFromPoints(points);
    line = new THREE.Line(line, this.material);

    ObjectPeon.translateX(10);
    this.add(ObjectPeon);

    var copa = new THREE.Shape();
    copa.moveTo(0.001, 0);
    copa.lineTo(5, 0);
    copa.lineTo(5, 0.25);
    copa.lineTo(2.5, 0.25);
    copa.quadraticCurveTo(0.25, 0.25, 0.25, 10);
    copa.quadraticCurveTo(3.5, 10, 3.5, 18);

    var pointsCopa = copa.extractPoints(20).shape;

    this.material = new THREE.MeshPhongMaterial({color: 0x0B9A0F, side: THREE.DoubleSide});
    var ObjectCopa = new THREE.Mesh(new THREE.LatheGeometry(pointsCopa, 20, 0, 2* Math.PI), this.material);
    line  = new THREE.BufferGeometry();
    line.setFromPoints(pointsCopa);
    line = new THREE.Line(line, this.material);

    this.add(ObjectCopa);
  }
  
  createGUI (gui,titleGui) {
    // Controles para el movimiento de la parte móvil
    this.guiControls = {
      rotacion : 0
    } 
    
    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    }
  
  update () {
  }
}

export { Revolucion }
