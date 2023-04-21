
import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'


class Pajaro extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    this.rotacion = 0;
    this.bajando = true;
    this.createCabeza();
    this.createCuerpo();
    this.createCuello();
    this.createEje();

    var cuerpoCSG = new CSG();
    var cuelloCSG = new CSG();
    var cabezaCSG = new CSG();

    cuerpoCSG.setFromMesh(this.cuerpo);
    cuelloCSG.setFromMesh(this.cuello);
    cabezaCSG.setFromMesh(this.cabeza);

    var completoCSG = new CSG();

    completoCSG.union([cuerpoCSG.toMesh(), cuelloCSG.toMesh(), cabezaCSG.toMesh()]);
    this.meshMovible = completoCSG.toMesh();
    this.add(this.meshMovible);
    this.add(this.eje);


  }  
  
  createCabeza () {
    this.materialCabeza = new THREE.MeshPhongMaterial({color : 0xFF0000});
    var cabeza = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 16, 0, 2*Math.PI, 0, Math.PI), this.materialCabeza);
    cabeza.translateY(5);
    this.cabeza = cabeza;
  }

  createCuello () {
    this.materialCuello  = new THREE.MeshPhongMaterial({color : 0xF8F5E6});
    var cuello = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 10, 32, 1, false, 0, 2*Math.PI), this.materialCuello);
    cuello.translateY(-2);
    this.cuello = cuello;
  }

  createCuerpo () {
    this.materialCuerpo = new THREE.MeshPhongMaterial({color : 0xFF0000});
    var cuerpo = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 16, 0, 2*Math.PI, 0, Math.PI), this.materialCuerpo);
    cuerpo.translateY(-10);
    this.cuerpo = cuerpo;
  }

  createEje () {
    this.materialEje = new THREE.MeshPhongMaterial({color : 0xF8F5E6});
    var eje = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 10, 32, 1, false, 0, 2*Math.PI), this.materialEje);
    eje.rotateZ(Math.PI/2);
    this.eje = eje;
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
    if (this.rotacion <= 1 && this.bajando){
      this.meshMovible.rotateX(0.01);
      this.rotacion += 0.01;
    }
    else if (this.rotacion >= -0.5 && !this.bajando) {
      this.meshMovible.rotateX(-0.01);
      this.rotacion -= 0.01;
    }

    if (this.rotacion >= 1) {
      this.rotacion = 1;
      this.bajando = false;
    }

    if (this.rotacion <= -0.5) {
      this.rotacion = -0.5;
      this.bajando = true;
    }
  }
}

export { Pajaro }
