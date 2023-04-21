
import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'


class Reloj extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    var clock = this.createClockAxis().toMesh();
    this.clock = clock;

    this.clockBody = this.createClock();

    this.createHour();
    this.createMinute();
    
    this.add(clock);
    this.add(this.clockBody);
    this.add(this.hour);
    this.add(this.minute);
  }

  translateHour (toPivot) {
    if (toPivot) {
      this.hour.translateY(-0.9);
      this.hour.translateZ(-0.06);
    }
    else {
      this.hour.translateY(0.9);
      this.hour.translateZ(0.06);
    }
  }
  translateMinute (toPivot) {
    if (toPivot) {
      this.minute.translateY(-0.65);
      this.minute.translateZ(-0.1);
    }
    else {
      this.minute.translateY(0.65);
      this.minute.translateZ(0.1);
    }
  }

  createMinute () {
    this.material = new THREE.MeshPhongMaterial({color : 0x0000FF}); 
    var minute = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.5, 0.0001, 32, 32, 32), this.material);
    this.minute = minute;

    this.translateMinute (false);
  }

  createHour () {
    this.material = new THREE.MeshPhongMaterial({color : 0xFF0000}); 
    var hour = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2, 0.0001, 32, 32, 32), this.material);
    
    this.hour = hour;

    this.translateHour(false);
  }

  createClock () {
    this.material = new THREE.MeshPhongMaterial({color : 0xF8F5E6});
    var clock = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 0.1, 32, 1, false, 0, 2*Math.PI), this.material);
    clock.rotateX(Math.PI/2);
    clock.translateY(-0.1);
    return clock;

  }

  createClockAxis () {
    this.material = new THREE.MeshPhongMaterial({color : 0x000000});
    var clock = new CSG();
    var axis = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.1, 32, 1, false, 0, 2*Math.PI), this.material);
    var screw = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.1, 32, 1, false, 0, 2*Math.PI), this.material);
    screw.translateZ(0.1);
    axis.rotateX(Math.PI/2);
    screw.rotateX(Math.PI/2);
    clock.union([axis, screw]);
    return clock;
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
    this.translateHour(true);
    this.hour.rotateZ(-0.01); 
    this.translateHour(false);

    this.translateMinute(true);
    this.minute.rotateZ(-0.05);
    this.translateMinute(false);
  }
}

export { Reloj }
