
import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'

class Animacion extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    this.material = new THREE.MeshPhongMaterial({color : 0xF8F5E6});
    var geometriaFigura = new THREE.CylinderGeometry(0, 0.125, 0.25, 32, 1, false, 0, 2*Math.PI);
    geometriaFigura.rotateX(Math.PI/2);
    this.figura = new THREE.Mesh(geometriaFigura, this.material);

    var splineA1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.25, 0, 0),
      new THREE.Vector3(0.5, 0, 0),
      new THREE.Vector3(0.75, 0, 0),
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(1.125, 0.25, 0),
      new THREE.Vector3(1.3, 0.5, 0),
      new THREE.Vector3(1.45, 0.75, 0),
      new THREE.Vector3(1.5, 1, 0),
      new THREE.Vector3(1.5, 1, 1.5),
      new THREE.Vector3(1.25, 0.75, 1.5),
      new THREE.Vector3(1, 0.5, 1.5),
      new THREE.Vector3(0.75, 0.5, 0.5),
      new THREE.Vector3(0.5, 0.5, 0.5),
      new THREE.Vector3(0.25, 0.5, 0.5),
      new THREE.Vector3(0, 0.5, 0.25),
      new THREE.Vector3(0, 0.25, 0),
      new THREE.Vector3(0, 0, 0)
    ]);

    var geometryLineA1 = new THREE.BufferGeometry();
    geometryLineA1.setFromPoints(splineA1.getPoints(100));

    var pathMaterialA1 = new THREE.LineBasicMaterial({color : 0xff0000, linewidth : 1});
    var visibleSplineA1 = new THREE.Line(geometryLineA1, pathMaterialA1);
    
    this.add(visibleSplineA1);

    var splineA2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(0, -1.25, -1),
      new THREE.Vector3(-0.5, -1.5, -1.25),
      new THREE.Vector3(-0.75, -1.25, -1),
      new THREE.Vector3(-1, -1, -0.5),
      new THREE.Vector3(-0.75, -0.5, 0),
      new THREE.Vector3(-0.25, 0, 0),
      new THREE.Vector3(0, 0, 0)
    ]);

    var geometryLineA2 = new THREE.BufferGeometry();
    geometryLineA2.setFromPoints(splineA2.getPoints(100));

    var pathMaterialA2 = new THREE.LineBasicMaterial({color : 0xff00ff, linewidth : 1});
    var visibleSplineA2 = new THREE.Line(geometryLineA2, pathMaterialA2);
    
    this.add(visibleSplineA2);

    var origen  = { t : 0 };
    var destino = { t : 1 };
    var tiempoRecorridoA1 = 4000;
    var tiempoRecorridoA2 = 4500; //4s


    var animacion1 = new TWEEN.Tween (origen)
      .to (destino, tiempoRecorridoA1)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onUpdate(() => {
        var posicion = splineA1.getPointAt(origen.t);
        this.figura.position.copy(posicion);
        var tangente = splineA1.getTangentAt(origen.t);
        posicion.add(tangente);
        this.figura.lookAt(posicion);
      })
      .onComplete(() => {
        origen.t = 0;
      });

    var animacion2 = new TWEEN.Tween (origen)
    .to (destino, tiempoRecorridoA2)
    .easing(TWEEN.Easing.Cubic.InOut)
    .onUpdate(() => {
      var posicion = splineA2.getPointAt(origen.t);
      this.figura.position.copy(posicion);
      var tangente = splineA2.getTangentAt(origen.t);
      posicion.add(tangente);
      this.figura.lookAt(posicion);
    })
    .onComplete(() => {
      origen.t = 0;
    });

    animacion2.chain(animacion1);
    animacion1.chain(animacion2);
    animacion1.start();

    this.add(this.figura);

    //Animación camino recto
/*    var origen  = { x : 0, y :   0 };
    var destino = { x : 6, y : 0.5 };

    var movimiento = new TWEEN.Tween(origen)
      .to (destino, 3000)
      .easing (TWEEN.Easing.Cubic.InOut)
      .onUpdate (() => { this.figura.position.x = origen.x; this.figura.position.y = origen.y })
      .onComplete (() => { origen.x = 0; origen.y = 0 })

    movimiento.start();
    this.add(this.figura);*/
    
  }
  
  createGUI (gui,titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja
    
    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder (titleGui);
  }
  
  update () {

    TWEEN.update();
  }
}

export { Animacion }
