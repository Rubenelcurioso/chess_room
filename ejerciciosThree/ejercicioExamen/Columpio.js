
import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'
import { CSG } from '../libs/CSG-v2.js'

class Columpio extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);

    this.columpio = new THREE.Object3D();

    this.height = 0.25;
    //Estructura del columpio
    this.izquierda = this.createColumpio();
    this.izquierda.scale.x /= 2;
    this.izquierda.rotateY(Math.PI/2);
    this.izquierda.translateZ(-4);
    this.columpio.add(this.izquierda);

    this.derecha = this.createColumpio();
    this.derecha.scale.x /= 2;
    this.derecha.rotateY(Math.PI/2);
    this.derecha.translateZ(4);
    this.columpio.add(this.derecha);

  
    this.eje = this.createEjeRotacion();
    this.eje.translateY(15);

    this.createAsiento();
    this.asientoColumpio.translateY(-10);
    this.asientoColumpio.translateX(-1);
    this.add(this.asientoColumpio);
    
    var cadenaIzquierda = this.createCadena();
    cadenaIzquierda.translateX(1);
    cadenaIzquierda.translateY(15);
    cadenaIzquierda.rotateX(Math.PI/2);

    var cadenaDerecha = this.createCadena();
    cadenaDerecha.translateX(-1);
    cadenaDerecha.translateY(15);
    cadenaDerecha.rotateX(Math.PI/2);

    cadenaIzquierda.add(this.asientoColumpio);


    this.add(cadenaDerecha);
    this.add(cadenaIzquierda);
    this.columpio.add(this.eje);

    this.add(this.columpio);

    var origenida  = { angulo : Math.PI / 2 };
    var destinoida = { angulo : -Math.PI/2 };
    var tiempo = 2000;

    var origenEje  = { angulo : 0 };
    var destinoEje = { angulo : 120 };
    var vueltas = 0;
    var animacionEje = new TWEEN.Tween (origenEje)
    .to (destinoEje, tiempo)
    .easing(TWEEN.Easing.Cubic.InOut)
    .onUpdate(() => {
      this.eje.rotation.x = origenEje.angulo * (Math.PI / 180);
    })
    .onStart(() => {
      origenEje.angulo = 120 * vueltas;
      destinoEje.angulo = 120 * ((vueltas + 1) % 3);
      // this.eje.rotation.x = origenEje.angulo * (Math.PI / 180);
    })
    .onComplete(() => {
      vueltas++;
    });

    var animacionida = new TWEEN.Tween (origenida)
      .to (destinoida, tiempo)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onUpdate(() => {
        cadenaIzquierda.rotation.x = origenida.angulo;
        cadenaDerecha.rotation.x = origenida.angulo;
      })
      .onComplete(() => {
        origenida.angulo = Math.PI / 2;
        animacionEje.start();
      });

    var origenvuelta  = { angulo : -Math.PI / 2 };
    var destinovuelta = { angulo : Math.PI/2 };
    var animacionvuelta = new TWEEN.Tween (origenvuelta)
      .to (destinovuelta, tiempo)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onUpdate(() => {
        cadenaIzquierda.rotation.x = origenvuelta.angulo;
        cadenaDerecha.rotation.x = origenvuelta.angulo;
      })
      .onComplete(() => {
        origenvuelta.angulo = -Math.PI / 2;
      });
  
    animacionvuelta.chain(animacionida);
    animacionida.chain(animacionvuelta);
    animacionida.start();
    
  }

  createEjeRotacion () {
    var csg = new CSG();
    var geometriaEje = new THREE.CylinderGeometry(0.25, 0.25, 8, 32, 32, false, 0, Math.PI * 2);
    geometriaEje.rotateZ(Math.PI/2);
    var ejePrincipal = new THREE.Mesh(geometriaEje, this.material);

    var geometriaRota =  new THREE.CylinderGeometry(0.125, 0.125, 2, 32, 32, false, 0, Math.PI * 2);
    geometriaRota.translate(0, 1, 0);
    geometriaRota.rotateX(Math.PI/3);

    var ejeRota = new THREE.Mesh(geometriaRota, this.material);

    csg.union([ejeRota, ejePrincipal]);

    var mesh = csg.toMesh();
    return mesh;
  }

  createCadena () {
    this.heightCadena = 8;
    var geometriaCadena = new THREE.CylinderGeometry(0.125, 0.125, this.heightCadena, 32, 32, false, 0, Math.PI * 2);
    geometriaCadena.translate(0, -this.heightCadena/2, 0);
    return new THREE.Mesh(geometriaCadena, this.material);
  }

  createAsiento () {
    var geometriaAsiento = new THREE.BoxGeometry(3, this.height, 3);
    var geometriaRespaldo = new THREE.BoxGeometry(3, 3, this.height);
    this.materialAsiento = new THREE.MeshPhongMaterial({color : 0x00FF00});

    var csg = new CSG();

    var asiento = new THREE.Mesh(geometriaAsiento, this.materialAsiento);
    asiento.translateY(this.height / 2);
    asiento.translateZ(1.5);
    var respaldo = new THREE.Mesh(geometriaRespaldo, this.materialAsiento);
    respaldo.translateY(1.5);
    csg.union([asiento, respaldo]);
    this.asientoColumpio = csg.toMesh();
  }

  createColumpio () {
    this.material = new THREE.MeshPhongMaterial({color : 0xF8F5E6});
    var geometria = new THREE.TorusGeometry(15, 0.25, 12, 48, Math.PI);
    return new THREE.Mesh(geometria, this.material);
    
  }
  
  createGUI (gui,titleGui) {
  }
  
  update () {
    TWEEN.update();
  }
}

export { Columpio }
