
import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'


class Tuerca extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    var tuerca = this.createTuerca();
    this.tuerca = tuerca;
    this.translacionY = 0;
    this.bajando = false;

    this.add(this.tuerca);
  }

  createTuerca() {
      var TuercaLine = new THREE.Shape();    
      this.materialLine = new THREE.LineBasicMaterial({color: 0x5A5A5A});
      this.materialTuerca = new THREE.MeshPhongMaterial({color : 0x8D918D});
      this.materialCilindro = new THREE.MeshPhongMaterial({color : 0xFF0000});

      TuercaLine.moveTo(-1.25, -3.75);
      TuercaLine.lineTo(1.25, -3.75);
      TuercaLine.lineTo(3.75, -1.25);
      TuercaLine.lineTo(3.75, 1.25);
      TuercaLine.lineTo(1.25, 3.75);
      TuercaLine.lineTo(-1.25, 3.75);
      TuercaLine.lineTo(-3.75, 1.25);
      TuercaLine.lineTo(-3.75, -1.25);
      TuercaLine.lineTo(-1.25, -3.75);

      var points = TuercaLine.extractPoints(20).shape;
  
      var line = new THREE.BufferGeometry();
      line.setFromPoints(points);
      line = new THREE.Line(line, this.materialLine);

      const width = 2;

      var pathpts = [
                      new THREE.Vector3(0, 0, 0), 
                      new THREE.Vector3(0, 0, 1)
                    ];

      var path = new THREE.CatmullRomCurve3(pathpts);
      var options = { steps: 2,
                      depth: width,
                      bevelEnabled: true,
                      bevelThickness: 0,
                      bevelSize: 0,
                      bevelOffset: 0,
                      bevelSegments: 1} ;
      var geometry = new THREE. ExtrudeGeometry ( TuercaLine , options ) ;    
      var ObjectTuerca = new THREE.Mesh(geometry, this.materialTuerca);

      var cilindro = new THREE.Mesh(new THREE.CylinderGeometry(width, width, 3*width, 32, 1, false, 0, 2*Math.PI), this.materialCilindro); 
      cilindro.rotateX(Math.PI / 2);
      var csg = new CSG();
      
      csg.subtract([ObjectTuerca, cilindro]);

      var tuercaAgujero = csg.toMesh();
      return tuercaAgujero;
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
    this.tuerca.rotateY(0.025);

    if (this.translacionY <= 1 && !this.bajando) {
      this.tuerca.translateY(0.025);
      this.translacionY += 0.025;

    }
    else if (this.translacionY >= -1 && this.bajando) {
      this.tuerca.translateY(-0.025);
      this.translacionY -= 0.025;

    }

    if (this.translacionY >= 1) {
      this.bajando = true;
    }


    if (this.translacionY <= -1) {
      this.bajando = false;
    }
  }
}

export { Tuerca }
