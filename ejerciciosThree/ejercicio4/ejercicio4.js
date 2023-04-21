
import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

class CSGGEOMETRY extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
  
    this.materialLine = new THREE.LineBasicMaterial({color: 0x5A5A5A});
    this.materialBishop = new THREE.MeshPhongMaterial({color : 0xAB059C});
    var bishop = new THREE.Shape();
    bishop.moveTo(0.00001, 0);
    bishop.lineTo(2, 0);
    bishop.lineTo(2, 0.05);
    bishop.quadraticCurveTo(0.05, 0.2, 0.2, 3.2);
    bishop.lineTo(0.6, 3.4);
    bishop.lineTo(0.2, 3.6);
    bishop.lineTo(0.2, 4.2);
    bishop.quadraticCurveTo(1.2, 4.2, 1.2, 5.1);
    bishop.quadraticCurveTo(1.2, 6, 0.2, 6);
    bishop.quadraticCurveTo(0.5, 6, 0.5, 6.4);
    bishop.quadraticCurveTo(0.5, 6.8, 0.00001, 6.8);
    var points = bishop.extractPoints(20).shape;
    var ObjectBishop = new THREE.Mesh(new THREE.LatheGeometry(points, 20, 0, 2* Math.PI), this.materialBishop);

    var line = new THREE.BufferGeometry();
    line.setFromPoints(points);
    line = new THREE.Line(line, this.materialLine);

    this.materialCube = new THREE.MeshPhongMaterial({color : 0xABCDEF});
    var hueco = new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 1), this.materialCube);
    
    hueco.translateX(1.5);
    hueco.translateY(5.8);
    hueco.rotateZ(Math.PI / 4);
    var csg = new CSG(); 
    csg.subtract([ObjectBishop, hueco]);
    var resultado = csg.toMesh();
    this.add(resultado);
    // this.add(hueco);

    var screw = new THREE.Shape();
  

    screw.moveTo(0, 0);
    screw.lineTo(2.5, 0);
    screw.lineTo(5, 2.5);
    screw.lineTo(5, 5);
    screw.lineTo(2.5, 7.5);
    screw.lineTo(0, 7.5);
    screw.lineTo(-2.5, 5);
    screw.lineTo(-2.5, 2.5);
    screw.lineTo(0, 0);

    points = screw.extractPoints(20).shape;

    line = new THREE.BufferGeometry();
    line.setFromPoints(points);
    line = new THREE.Line(line, this.materialLine);

    var pathpts = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 1)];
    var path = new THREE.CatmullRomCurve3(pathpts);
    var options = { steps : 50 , curveSegments : 4 , extrudePath : path } ;
    var geometry = new THREE. ExtrudeGeometry ( screw , options ) ;    
    var ObjectScrew = new THREE.Mesh(geometry, this.materialBishop);
    
    ObjectScrew.translateX(5);
    ObjectScrew.rotateZ(Math.PI / 4);
    this.add(ObjectScrew);

    var circle = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 10, 32, 1, false, 0, 2*Math.PI), this.materialBishop);
    circle.translateX(9);
    circle.translateY(1.9);
    circle.rotateX(Math.PI / 2);
    this.add(circle)
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

export { CSGGEOMETRY }
