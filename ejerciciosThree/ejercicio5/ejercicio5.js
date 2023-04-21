
import * as THREE from '../libs/three.module.js'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js' 

class CargaOBJ extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    var materialLoader = new MTLLoader ( ) ;
    var objectLoader = new OBJLoader ( ) ;
    materialLoader.load('../models/porsche911/911.mtl',
          (materials) => {
            objectLoader.setMaterials(materials);
            objectLoader.load('../models/porsche911/Porsche_911_GT2.obj',
            (object) => {
              this.add(object);
            }, null, null);
          });

    this.position.y = 0.65;
    
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

export { CargaOBJ }
