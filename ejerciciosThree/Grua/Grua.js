
import * as THREE from '../libs/three.module.js'

class Grua extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);

    this.h = 2;
    this.a = 0.1;

    this.materialCrane = new THREE.MeshPhongMaterial({color : 0x123456});
    this.materialRope = new THREE.MeshPhongMaterial({color : 0xF8F5E6});

    this.createExtensor();
    this.createBase();
    this.createBody();
    this.createRope();
    this.extensor.translateY(this.h);
    this.rope.translateX(-this.h + 0.1);
    this.extensor.add(this.rope);
    this.body.add(this.extensor);
    this.base.add(this.body);
    
    this.add(this.base);
  }

  createBase () {
    var geometria = new THREE.CylinderGeometry(0.5, 0.5, 0.01, 32, 1, false, 0, 2*Math.PI);
    this.base = new THREE.Mesh(geometria, this.materialCrane);
  }

  createBody () {
    var geometria = new THREE.BoxGeometry(this.a, this.h, this.a);
    geometria.translate(0, this.h / 2, 0);

    this.body = new THREE.Mesh(geometria, this.materialCrane);
  }

  createExtensor () {
    var geometria = new THREE.BoxGeometry(this.h, this.a, this.a);
    geometria.translate(-this.h / 2, 0, 0);

    this.extensor = new THREE.Mesh(geometria, this.materialCrane);

  }

  createRope () {
    var geometria = new THREE.CylinderGeometry(0.01, 0.01, this.h / 2, 32);
    geometria.translate(0, -this.h / 4, 0);

    this.rope = new THREE.Mesh(geometria, this.materialRope);
  }
  
  createGUI (gui,titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = {
      escalaExtensor : 1.0,
      rotacionExtensor : 0.0,
      rotacionCuerpo : 0.0,
      escalaCuerda : 1.0,
      
      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      reset : () => {
        this.guiControls.escalaExtensor = 1.0;
        this.guiControls.rotacionExtensor = 0.0;
        this.guiControls.rotacionCuerpo = 0.0;
        this.guiControls.escalaCuerda = 0.0;
        }
    } 
    
    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
    folder.add (this.guiControls, 'escalaExtensor', 0.5, 2.0, 0.1).name ('EscaladoExtensor: ').listen();
    folder.add (this.guiControls, 'rotacionExtensor', -0.5, 0.5, 0.1).name ('RotacionExtensor: ').listen();
    folder.add (this.guiControls, 'rotacionCuerpo', -3.14, 3.14, 0.1).name ('RotacionCuerpo: ').listen();
    folder.add (this.guiControls, 'escalaCuerda', 0.5, 2.0, 0.1).name ('EscaladoCuerda: ').listen();

    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
  }
  
  update () {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación
    this.extensor.scale.x = this.guiControls.escalaExtensor;
    this.extensor.rotation.z = this.guiControls.rotacionExtensor;
    this.body.rotation.y = this.guiControls.rotacionCuerpo;
    this.rope.scale.y = this.guiControls.escalaCuerda;
  }
}

export { Grua }
