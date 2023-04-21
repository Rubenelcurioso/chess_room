
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

    this.hMinute = 1.5;
    this.hHour = 2;
    this.reloj = new THREE.Clock();
    this.reloj.start();
    this.clockBody = this.createClock();

    this.createHour();
    this.createMinute();

    this.hour.translateZ(0.1);
    this.minute.translateZ(0.125);
    
    this.add(clock);
    this.add(this.clockBody);
    this.add(this.hour);
    this.add(this.minute);
  }
  createMinute () {
    this.material = new THREE.MeshPhongMaterial({color : 0x0000FF}); 
    var geometria = new THREE.BoxGeometry(0.1, this.hMinute, 0.0001, 32, 32, 32);
    geometria.translate(0, this.hMinute/2 - 0.1, 0);
    var minute = new THREE.Mesh(geometria, this.material);
    this.minute = minute;
  }

  createHour () {
    this.material = new THREE.MeshPhongMaterial({color : 0xFF0000}); 
    var geometria = new THREE.BoxGeometry(0.1, this.hHour, 0.0001, 32, 32, 32);
    geometria.translate(0, this.hHour/2 - 0.1, 0);
    var hour = new THREE.Mesh(geometria, this.material);
    
    this.hour = hour;
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
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = {
      velHour : 0.0,
      velMinute : 0.0,
      
      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      reset : () => {
        this.guiControls.velHour = 0.0;
        this.guiControls.velMinute = 0.0;
        }
    } 
    
    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
    folder.add (this.guiControls, 'velHour', -1, 1, 0.001).name ('velocidadHora: ').listen();
    folder.add (this.guiControls, 'velMinute', -2, 2, 0.001).name ('velocidadMinute: ').listen();

    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
  }
  
  update () {
    var segTranscurridos = this.reloj.getDelta();
    this.hour.rotateZ(-this.guiControls.velHour * segTranscurridos); 

    this.minute.rotateZ(-this.guiControls.velMinute * segTranscurridos);
  }
}

export { Reloj }
