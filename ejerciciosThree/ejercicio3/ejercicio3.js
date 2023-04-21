
import * as THREE from '../libs/three.module.js'

class Barrido extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    // El material se usa desde varios métodos. Por eso se alamacena en un atributo
    this.material = new THREE.LineBasicMaterial({color: 0x5A5A5A});

    var mask = new THREE.Shape();
    mask.moveTo(-0.5, 2);
    //Parte de abajo de la máscara
 
    mask.lineTo(0.5, 2);
    mask.lineTo(1, 1);
    //Lateral derecho de la máscara
    mask.lineTo(1.75, 3.75);
    mask.quadraticCurveTo(1.2, 4, 1.75, 5);
    mask.quadraticCurveTo(2.3, 5.25, 1, 7);
    //Parte de arriba
    mask.lineTo(0.5, 6);
    mask.lineTo(-0.5, 6);
    mask.lineTo(-1, 7);
    //Lateral izquierdo
    mask.quadraticCurveTo(-2.3, 5.25, -1.75 , 5);
    mask.quadraticCurveTo(-1.2, 4, -1.75 , 3.5);
    mask.lineTo(-1, 1);
    mask.lineTo(-0.5, 2);

    var eye = new THREE.Shape();
    eye.absellipse(1, 3, 2, 1, 0, Math.PI * 2);
    mask.holes.push(eye);

    eye = new THREE.Shape();

    var points = mask.extractPoints(20).shape;

    var line = new THREE.BufferGeometry();
    line.setFromPoints(points);
    line = new THREE.Line(line, this.material);

    var pathpts = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0.25)];
    var path = new THREE.CatmullRomCurve3(pathpts);
    var options = { steps : 50 , curveSegments : 4 , extrudePath : path } ;
    var geometry = new THREE. ExtrudeGeometry ( mask , options ) ;
    
    var objectMask = new THREE.Mesh (geometry, this.material);
    objectMask.translateX(10);
    objectMask.rotateZ((3.14/2));
    this.add(objectMask);
    // var objectmask;

    this.add(line);
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

export { Barrido }
