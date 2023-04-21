
import * as THREE from '../libs/three.module.js'

class Geometria3D extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    // El material se usa desde varios métodos. Por eso se alamacena en un atributo
    this.material = new THREE.MeshPhongMaterial({color: 0xCF0FFF});

    var esfera = this.createEsfera();
    this.esfera = esfera;
    this.material = new THREE.MeshPhongMaterial({color: 0x00FF00});

    var cono = this.createCono();
    this.cono = cono;


    this.material = new THREE.MeshPhongMaterial({color: 0x00FFFF});

    var cubo = this.createCubo();
    this.cubo = cubo;

    this.material = new THREE.MeshPhongMaterial({color : 0xFFFFFF});
    var tetraedro = this.createTetrahedron();
    this.tetraedro = tetraedro;

    this.add(esfera);
    this.add(cubo);
    this.add(cono);
    this.add(tetraedro);
  }
  
  createEsfera() {
    var esfera = new THREE.Mesh(new THREE.SphereGeometry(5, 5, 5), this.material);
    esfera.position.y = 5;

    return esfera;
  }

  createCono() {
    var cono = new THREE.Mesh(new THREE.ConeGeometry(5, 5), this.material);
    cono.position.y = 5;
    cono.position.x = 10;
    return cono;
  }

  createCubo() {
    var cubo = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), this.material);
    cubo.position.y = 2;
    cubo.position.z = 15;
    return cubo;

  }

  createTetrahedron(){
    var tetraedro = new THREE.Mesh(new THREE.TetrahedronGeometry(5, 0), this.material);
    tetraedro.position.y = 2;
    tetraedro.position.z = 20;
    tetraedro.position.x = -10;
    return tetraedro;
  }

  createBase() {
    // El nodo del que van a colgar la caja y los 2 conos y que se va a devolver
    var base = new THREE.Object3D();
    // Cada figura, un Mesh, está compuesto de una geometría y un material
    var cajaBase = new THREE.Mesh (new THREE.BoxGeometry (5,0.4,1), this.material);
    cajaBase.position.y = 0.2;
    // La componente geometría se puede compartir entre varios meshes
    var geometriaPivote = new THREE.ConeGeometry (0.25, 0.6);
    var pivote1 = new THREE.Mesh (geometriaPivote, this.material);
    var pivote2 = new THREE.Mesh (geometriaPivote, this.material);
    // Se posicionan los pivotes con respecto a la base
    pivote1.position.set (2.25, 0.3+0.4,  0.25);
    pivote2.position.set (2.25, 0.3+0.4, -0.25);
    base.add(cajaBase);
    base.add(pivote1);
    base.add(pivote2);
    return base;
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
    folder.add (this.guiControls, 'rotacion', -2, 2, 0.001)
      .name ('Rotación cubo : ')
      .onChange ( (value) => this.setAnguloCubo (-value) );
  
      folder.add (this.guiControls, 'rotacion', -2, 2, 0.00001)
      .name ('Rotación cono : ')
      .onChange ( (value) => this.setAnguloCono (-value) );
    }
  
  setAnguloCubo (valor) {
    this.cubo.rotation.y = valor;
  }
  setAnguloCono (valor) {
    this.cono.rotation.z = valor;
  }
  
  update () {
    this.esfera.rotation.y += 0.01;
  }
}

export { Geometria3D }
