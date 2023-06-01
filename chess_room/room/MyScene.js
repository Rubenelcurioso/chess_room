
// Clases de la biblioteca

import * as THREE from 'three'
import { GUI } from '../libs/dat.gui.module.js'
//import { TrackballControls } from '../libs/TrackballControls.js'
import { Stats } from '../libs/stats.module.js'
import { CSG } from '../libs/CSG-v2.js'
// Clases de mi proyecto
import { Tablero } from '../room/tablero.js'
import { Torre } from '../room/torre.js'
import { Rey } from '../room/rey.js'
import { Caballo } from '../room/caballo.js'
import { Reina } from '../room/reina.js'
import { Mesa } from '../room/mesa.js'
import { Pendulo } from '../room/pendulo.js'
import { Flexo } from '../room/flexo.js'
import * as TWEEN from '../libs/tween.esm.js'
import { PointerLockControls } from '../libs/PointerLockControls.js'
import { Stand } from '../room/stand.js'
import { lamparaTecho } from '../room/lamparaTecho.js'
import { Object3D } from '../libs/three.module.js'

// La clase fachada del modelo
/*
 * Usaremos una clase derivada de la clase Scene de Three.js para llevar el control de la escena y de todo lo que ocurre en ella.
 */

class MyScene extends THREE.Scene {
  constructor(myCanvas) {
    super();

    this.reloj = new THREE.Clock();
    this.canOpenDoor = false;

    // Lo primero, crear el visualizador, pasándole el lienzo sobre el que realizar los renderizados.
    this.renderer = this.createRenderer(myCanvas);

    // Se añade a la gui los controles para manipular los elementos de esta clase
    this.gui = this.createGUI();

    this.initStats();

    // Construimos los distinos elementos que tendremos en la escena

    // Todo elemento que se desee sea tenido en cuenta en el renderizado de la escena debe pertenecer a esta. Bien como hijo de la escena (this en esta clase) o como hijo de un elemento que ya esté en la escena.
    // Tras crear cada elemento se añadirá a la escena con   this.add(variable)
    this.createLights();

    // Tendremos una cámara con un control de movimiento con el ratón
    this.createCamera();

    // Un suelo 
    this.createGround();

    this.createRoom();

    // Y unos ejes. Imprescindibles para orientarnos sobre dónde están las cosas
    this.axis = new THREE.AxesHelper(5);
    this.add(this.axis);
    //Animaciones de la luz central
    var origen = { angulo: 0 };
    var destino = { angulo: Math.PI / 2 };

    this.animacionAbrir = new TWEEN.Tween(origen)
      .to(destino, 2000)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate(() => {
        this.puerta.rotation.y = origen.angulo;
      })
      .onComplete(() => {
        origen.angulo = 0;
      });

    // var origenLuz = { int: 0.5 };
    // var finLuz = { int: 0 };


    // var animacionApaga = new TWEEN.Tween(origenLuz)
    //   .to(finLuz, 500)
    //   .easing(TWEEN.Easing.Linear.None)
    //   .onUpdate(() => {
    //     this.spotLight.intensity = origenLuz.int;
    //   })
    //   .onComplete(() => {
    //     origenLuz.int = 0.5;
    //     animacionMedia.start();
    //   });

    // finLuz = { int: 0.25 };
    // var animacionMedia = new TWEEN.Tween(origenLuz)
    //   .to(finLuz, 500)
    //   .easing(TWEEN.Easing.Linear.None)
    //   .onUpdate(() => {
    //     this.spotLight.intensity = origenLuz.int;
    //   })
    //   .onComplete(() => {
    //     origenLuz.int = 0.5;
    //     animacionEnciende.start();
    //   })
    //   .yoyo(true);


    var origenLuz = { int: 0.5 };
    var finLuz = { int: 0.001 };

    var tiempo = 1000;
    var animacionApaga = new TWEEN.Tween(origenLuz)
      .to(finLuz, tiempo)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate(() => {
        this.spotLight.intensity = origenLuz.int;
      })
      .onComplete(() => {
        origenLuz.int = 0.5;
        animacionMedia1.start();
      });

    var medioLuz = { int: 0.001 };
    var medioFinLuz = { int: 0.25 };

    var tiempo2 = 125;

    var animacionMedia1 = new TWEEN.Tween(medioLuz)
      .to(medioFinLuz, tiempo2)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate(() => {
        this.spotLight.intensity = medioLuz.int;
      })
      .onComplete(() => {
        medioLuz.int = 0.001;
        animacionMedia2.start();
      });

    var medioLuz2 = { int: 0.25 };
    var medioFinLuz2 = { int: 0.0001 };

    var tiempo3 = 125;

    var animacionMedia2 = new TWEEN.Tween(medioLuz2)
      .to(medioFinLuz2, tiempo3)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate(() => {
        this.spotLight.intensity = medioLuz2.int;
      })
      .onComplete(() => {
        medioLuz2.int = 0.125;
        animacionEnciende.start();
      });


    var origenLuzFin = { int: 0.25 };
    var finLuzFin = { int: 0.5 };

    var tiempo4 = 500;

    var animacionEnciende = new TWEEN.Tween(origenLuzFin)
      .to(finLuzFin, tiempo4)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate(() => {
        this.spotLight.intensity = origenLuzFin.int;
      })
      .onComplete(() => {
        origenLuzFin.int = 0.125;
        animacionApaga.start();
      });

    animacionApaga.start();

    //Contado iniciar = 0
    this.contador_final = 0;
    this.add(this.puerta);
    //Seccion añadir modelos aqui

    var lightFlexo = new THREE.SpotLight({color:0xffffff}, 0.75);
    // var lightFlexo = new THREE.PointLight(0x8844ff, 0.875, 450, 1);
    lightFlexo.color = new THREE.Color(0x8844ff);
    lightFlexo.penumbra = 0.5;
    // lightFlexo.distance = 200;
    lightFlexo.castShadow = true;
    lightFlexo.shadow.mapSize.width = 1024;
    lightFlexo.shadow.mapSize.height = 1024;
    lightFlexo.shadow.camera.near = 0.5;
    lightFlexo.shadow.camera.far = 500;

    this.add(new Torre());
    this.add(new Caballo());
    this.add(new Rey());
    this.add(new Reina());
    this.mesa = new Mesa();
    //Colocamos la mesa
    this.mesa.translateY(this.mesa.pataHeight);
    this.mesa.translateX(100 + this.mesa.tableroDepth/2);
    this.mesa.translateZ(-this.mesa.tableroWidth/2 + 1);
    this.mesa.castShadow = true;
    this.mesa.receiveShadow = true;
    this.add(this.mesa);

    this.tablero = new Tablero();
    //Colocamos el tablero de ajedrez
    this.tablero.translateY(this.mesa.pataHeight + this.mesa.tableroHeight);
    this.tablero.translateX(100 + this.mesa.tableroDepth/2);
    this.tablero.translateZ(-this.mesa.tableroWidth/1.25 + 1);
    this.add(this.tablero);

    this.pendulo = new Pendulo();
    this.pendulo.translateY(this.mesa.pataHeight + this.mesa.tableroHeight);
    this.pendulo.translateX(100 + this.mesa.tableroDepth/2);
    this.pendulo.translateZ(-this.mesa.tableroWidth/1.25 + 80);
    this.pendulo.rotateY(-Math.PI/2);
    this.pendulo.rotateY(-Math.PI/4);
    this.add(this.pendulo);

    this.flexo = new Flexo();
    this.flexo.translateY(this.mesa.pataHeight + this.mesa.tableroHeight);
    this.flexo.translateX(100 + this.mesa.tableroDepth/2);
    this.flexo.translateZ(-this.mesa.tableroWidth/1.25 + 140);
    this.add(this.flexo);
    
    //Trasladamos la luz dentro del flexo

    this.bombillaMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, emissive: 0x8844ff});
    this.bombillaGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    this.bombilla = new THREE.Mesh(this.bombillaGeometry, this.bombillaMaterial);

    this.bombilla.translateY(2*this.mesa.pataHeight + this.mesa.tableroHeight + 2.5);
    this.bombilla.translateX(100 + this.mesa.tableroDepth/2);
    this.bombilla.translateZ(-this.mesa.tableroWidth/1.25 + 129);

    this.add(this.bombilla);
    lightFlexo.translateY(2*this.mesa.pataHeight + this.mesa.tableroHeight + 2.5);
    lightFlexo.translateX(100 + this.mesa.tableroDepth/2);
    lightFlexo.translateZ(-this.mesa.tableroWidth/1.25 + 129.2);

    const target = new THREE.Object3D();
    target.position.set(100 + this.mesa.tableroDepth/2, 2*this.mesa.pataHeight + this.mesa.tableroHeight + 2.5, -this.mesa.tableroWidth/1.25 + 100);
    
    this.add(lightFlexo);
    this.add(target);
    lightFlexo.target = target;
    
    this.lampara = new lamparaTecho();
    this.target = new Object3D();
    // this.lampara.add(this.spotLight);
    this.bombillaTechoMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, emissive: 0x7f7f7f});
    this.bombillaTechoGeometry = new THREE.SphereGeometry(2, 32, 32);

    this.bombillaTecho = new THREE.Mesh(this.bombillaTechoGeometry, this.bombillaTechoMaterial);
    this.bombillaTecho.translateY(-(this.lampara.hangDistance + this.lampara.headHeight / 2));
    this.lampara.add(this.bombillaTecho);

    this.lampara.translateY(400);
    this.target.translateY(-400);
    this.lampara.add(this.target);
    this.spotLight.target = this.target;
    this.add(this.lampara);

    let color_final = new THREE.Color("#ff0000");
    let cambia_color_luz = new TWEEN.Tween(lightFlexo)
    .to({ color: color_final }, 5000) // Cambia el valor 1000 para ajustar la duración de la animación
    .easing(TWEEN.Easing.Linear.None)
    .repeat(Infinity)
    .yoyo(true);

    let color_final_bombilla = new THREE.Color("#ff0000");

    let cambia_color_bombilla = new TWEEN.Tween(this.bombilla.material.emissive)
    .to({ r: color_final_bombilla.r, g: color_final_bombilla.g, b: color_final_bombilla.b }, 5000) // Cambia el valor 1000 para ajustar la duración de la animación
    .easing(TWEEN.Easing.Linear.None)
    .repeat(Infinity)
    .yoyo(true);

    cambia_color_luz.start();
    cambia_color_bombilla.start();
    
    var origenLuzBombilla = { emissive: new THREE.Color("#7f7f7f") };
    var finLuzBombilla = { emissive: new THREE.Color("#000000") };
    
    var tiempoBombilla = 1000;
    var animacionApagaBombilla = new TWEEN.Tween(origenLuzBombilla)
      .to(finLuzBombilla, tiempoBombilla)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate(() => {
        this.bombillaTecho.material.emissive = origenLuzBombilla.emissive;
      })
      .onComplete(() => {
        origenLuzBombilla.emissive = new THREE.Color("#7f7f7f");
        animacionMedia1Bombilla.start();
      });
    
    var medioLuzBombilla = { emissive: new THREE.Color("#000000") };
    var medioFinLuzBombilla = { emissive: new THREE.Color("#3f3f3f") };
    
    var tiempo2Bombilla = 125;
    var animacionMedia1Bombilla = new TWEEN.Tween(medioLuzBombilla)
      .to(medioFinLuzBombilla, tiempo2Bombilla)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate(() => {
        this.bombillaTecho.material.emissive = medioLuzBombilla.emissive;
      })
      .onComplete(() => {
        medioLuzBombilla.emissive = new THREE.Color("#000000");
        animacionMedia2Bombilla.start();
      });
    
    var medioLuz2Bombilla = { emissive: new THREE.Color("#3f3f3f") };
    var medioFinLuz2Bombilla = { emissive: new THREE.Color("#000000") };
    
    var tiempo3Bombilla = 125;
    var animacionMedia2Bombilla = new TWEEN.Tween(medioLuz2Bombilla)
      .to(medioFinLuz2Bombilla, tiempo3Bombilla)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate(() => {
        this.bombillaTecho.material.emissive = medioLuz2Bombilla.emissive;
      })
      .onComplete(() => {
        medioLuz2Bombilla.emissive = new THREE.Color("#3f3f3f");
        animacionEnciendeBombilla.start();
      });
    
    var origenLuzFinBombilla = { emissive: new THREE.Color("#000000") };
    var finLuzFinBombilla = { emissive: new THREE.Color("#7f7f7f") };
    
    var tiempo4Bombilla = 500;
    var animacionEnciendeBombilla = new TWEEN.Tween(origenLuzFinBombilla)
      .to(finLuzFinBombilla, tiempo4Bombilla)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate(() => {
        this.bombillaTecho.material.emissive = origenLuzFinBombilla.emissive;
      })
      .onComplete(() => {
        origenLuzFinBombilla.emissive = new THREE.Color("#3f3f3f");
        animacionApagaBombilla.start();
      });
    
    animacionApagaBombilla.start();            

    const anguloInicial = {angulo : 0};
    const anguloFinal = {angulo : Math.PI/6};
    const duracionRotacion = 2000;

    //Rotamos la lampara

    const subeLampara1 = new TWEEN.Tween(anguloInicial)
      .to(anguloFinal, duracionRotacion)
      .onUpdate(() => {
        this.lampara.rotation.z = anguloInicial.angulo;
      })
      .easing(TWEEN.Easing.Quadratic.Out)
      .onComplete(() => {
        anguloInicial.angulo = Math.PI/6;
        anguloFinal.angulo = 0;
        bajaLampara1.start();
      });

    const bajaLampara1 = new TWEEN.Tween(anguloInicial)
      .to(anguloFinal, duracionRotacion)
      .onUpdate(() => {
        this.lampara.rotation.z = anguloInicial.angulo;
      })
      .easing(TWEEN.Easing.Quadratic.In)
      .onComplete(() => {
        anguloInicial.angulo = 0;
        anguloFinal.angulo = -Math.PI/6;
        subeLampara2.start();
      });

    const subeLampara2 = new TWEEN.Tween(anguloInicial)
      .to(anguloFinal, duracionRotacion)
      .onUpdate(() => {
        this.lampara.rotation.z = anguloInicial.angulo;
      })
      .easing(TWEEN.Easing.Quadratic.Out)
      .yoyo(true)
      .onComplete(() => {
        anguloInicial.angulo = -Math.PI/6;
        anguloFinal.angulo = 0;
        bajaLampara2.start();
      });

    const bajaLampara2 = new TWEEN.Tween(anguloInicial)
      .to(anguloFinal, duracionRotacion)
      .onUpdate(() => {
        this.lampara.rotation.z = anguloInicial.angulo;
      })
      .easing(TWEEN.Easing.Quadratic.In)
      .yoyo(true)
      .onComplete(() => {
        anguloInicial.angulo = 0;
        anguloFinal.angulo = Math.PI/6;
        subeLampara1.start();
      });
      
      subeLampara1.start();
      
    this.array_seleccionables = ["12941_Stone_Chess_Rook_Side_A", "12939_Stone_Chess_King_Side_A", "12940_Stone_Chess_Queen_Side_A", "12943_Stone_Chess_Night_Side_A"];
  }

  initStats() {

    var stats = new Stats();

    stats.setMode(0); // 0: fps, 1: ms

    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    $("#Stats-output").append(stats.domElement);

    this.stats = stats;
  }

  createCamera() {
    // Para crear una cámara le indicamos
    //   El ángulo del campo de visión en grados sexagesimales -> 60º ojo humano
    //   La razón de aspecto ancho/alto
    //   Los planos de recorte cercano y lejano
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    // También se indica dónde se coloca
    this.camera.position.set(20, 180, 20);
    // Y hacia dónde mira
    var look = new THREE.Vector3(0, 0, 0);
    this.camera.lookAt(look);
    this.add(this.camera);

    this.cameracontrol = new PointerLockControls(this.camera, this.renderer.domElement);

  }

  checkCameraCollision() {
    var direccion = new THREE.Vector3;
    this.cameracontrol.getDirection(direccion);
    direccion.y = 0;
    direccion.normalize();
    // this.cameracontrol.getDirection(direccion);                           //Obtenemos la dirección de la cámara
    var posicion = this.cameracontrol.getObject().position;               //Obtenemos su posición

    var eje_rotacion = new THREE.Vector3(0, 1, 0);
    var angulo_rot = 0;

    // Hacemos un raycast según la dirección a la que nos estemos moviendo para saber si colisionamos con una pared o no

    if (this.movingForward) {
      var raycaster = new THREE.Raycaster(posicion, direccion);               //Trazamos el rayo
      //Comprobamos las colisiones
      var intersecciones = raycaster.intersectObjects(this.children);         //Intersección con el rayo
      if (intersecciones.length > 0 && intersecciones[0].distance < 50) {      //0 = objeto más cercano
        this.collisionForward = true;
      }
      else {
        this.collisionForward = false;
      }
    }

    if (this.movingBackward) {
      var direccionAtras = direccion;
      direccionAtras = direccionAtras.negate();
      var raycaster = new THREE.Raycaster(posicion, direccionAtras);               //Trazamos el rayo
      //Comprobamos las colisiones
      var intersecciones = raycaster.intersectObjects(this.children);         //Intersección con el rayo
      if (intersecciones.length > 0 && intersecciones[0].distance < 50) {      //0 = objeto más cercano
        this.collisionBackward = true;
      }
      else {
        this.collisionBackward = false;
      }
    }

    if (this.movingLeft) {
      if (this.movingBackward) {
        direccion = direccion.applyAxisAngle(eje_rotacion, -Math.PI / 2);
      }
      else {
        direccion = direccion.applyAxisAngle(eje_rotacion, Math.PI / 2);
      }
      var raycaster = new THREE.Raycaster(posicion, direccion);               //Trazamos el rayo
      //Comprobamos las colisiones
      var intersecciones = raycaster.intersectObjects(this.children);         //Intersección con el rayo
      if (intersecciones.length > 0 && intersecciones[0].distance < 50) {      //0 = objeto más cercano
        this.collisionLeft = true;
      }
      else {
        this.collisionLeft = false;
      }
    }

    if (this.movingRight) {
      if (this.movingBackward) {
        direccion = direccion.applyAxisAngle(eje_rotacion, Math.PI / 2);
      }
      else {
        direccion = direccion.applyAxisAngle(eje_rotacion, -Math.PI / 2);
      }
      var raycaster = new THREE.Raycaster(posicion, direccion);               //Trazamos el rayo
      //Comprobamos las colisiones
      var intersecciones = raycaster.intersectObjects(this.children);         //Intersección con el rayo
      if (intersecciones.length > 0 && intersecciones[0].distance < 50) {      //0 = objeto más cercano
        this.collisionRight = true;
      }
      else {
        this.collisionRight = false;
      }
    }
    angulo_rot += Math.PI / 2; //Gira 90º en eje Y
    direccion = direccion.applyAxisAngle(eje_rotacion, angulo_rot);//Rotar la direccion que mira
  }

  onKeyDown(event) {//Entrada de movimiento
    this.checkCameraCollision();
    switch (event.code) {
      case "KeyW":
        this.movingForward = true;
        // this.cameracontrol.moveForward(10);
        break;
      case "KeyS":
        this.movingBackward = true;
        // this.cameracontrol.moveForward(-10);
        break;
      case "KeyD":
        this.movingRight = true;
        // this.cameracontrol.moveRight(10);
        break;
      case "KeyA":
        this.movingLeft = true;
        // this.cameracontrol.moveRight(-10);
        break;
      case "Enter":
        this.cameracontrol.lock();
        break;
      case "Escape":
        this.cameracontrol.unlock();
        break;
    }
  }

  onKeyUp(event) {
    switch (event.code) {
      case "KeyW":
        this.movingForward = false;
        // this.cameracontrol.moveForward(10);
        break;
      case "KeyS":
        this.movingBackward = false;
        // this.cameracontrol.moveForward(-10);
        break;
      case "KeyD":
        this.movingRight = false;
        // this.cameracontrol.moveRight(10);
        break;
      case "KeyA":
        this.movingLeft = false;
        // this.cameracontrol.moveRight(-10);
        break;
    }
  }

  onMouseClick(event) {//Metodo seleccion
    //Entrada
    this.seleccion = true;
    event.preventDefault();//Cambios sin recargar
    //Preguntar si obtener entrada raton/ o de la camara
    var pointer = new THREE.Vector2(0, 0);
    var raycaster = new THREE.Raycaster();//Trazar rayo con RayCasting
    raycaster.setFromCamera(pointer, this.camera);//Traza rayo a partir de la direccion camara y del click

    var interseccion = raycaster.intersectObjects(this.children);//Realiza la interseccion de rayo pasandole los objetos de la escena
    if (interseccion.length > 0) {//Si ha interseccionado con algo
      if (interseccion[0].object.material.wireframe == false && this.seleccion == true) {//Comprobar que no ha sido seleccionado antes
        this.material_seleccionado = interseccion[0].object.material;
        this.objeto_seleccionado = interseccion[0].object;
        this.distancia_seleccionado = interseccion[0].distance;
        this.objeto_seleccionado.material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.objeto_seleccionado.material.transparent = true;
        this.objeto_seleccionado.material.opacity = 0.25;
        this.objeto_seleccionado.material.wireframe = true;
        this.compruebaFinal();
      }
    }
    //Devolver el objeto?
    return { objeto: interseccion[0].object, distancia: interseccion[0].distance };
  }

  unselectObject() {
    this.objeto_seleccionado.material = this.material_seleccionado;
    this.objeto_seleccionado.material.opacity = 1;
    this.seleccion = false;
    this.objeto_seleccionado = null;
    this.distancia_seleccionado = 0;
    this.trasladado = false;
  }

  movableObject() {
    if (this.seleccion == true) {//Ha habido selección
      //Comprobar si es uno de los seleccionables
      let seleccionable = false;
      for (let i = 0; i < this.array_seleccionables.length; i++) {
        if (this.objeto_seleccionado == this.getObjectByName(this.array_seleccionables[i])) seleccionable = true;//Si objeto es uno de los seleccionables
      }
      if (seleccionable) {//Si es un seleccionable realizar cálculos
        //Se mueve con respecto a la cámara, no a la escena
        this.camera.add(this.objeto_seleccionado);//Añade hijo camara

        if (!this.trasladado) {//Variable para computar el centro 1 vez
          this.objeto_seleccionado.geometry.computeBoundingBox(); //Calcula el boundingbox
          this.objeto_seleccionado.geometry.center();//Mueve la figura a su centro
          this.trasladado = true;//Actualizar variable
        }
        //Variables para cálculos
        var cameraPosition = this.cameracontrol.getObject().position.clone();
        var cameraDirection = this.cameracontrol.getDirection(new THREE.Vector3());
        var distance = this.distancia_seleccionado;
        var targetPosition = cameraPosition.clone().add(cameraDirection.multiplyScalar(distance));


        // Actualizar la posición del objeto seleccionado
        this.objeto_seleccionado.position.x = targetPosition.x;
        this.objeto_seleccionado.position.y = targetPosition.y;
        this.objeto_seleccionado.position.z = targetPosition.z;
        this.objeto_seleccionado.rotation.set(-Math.PI / 2, 0, 0); //Aplicar de nuevo rotación a la figura.

        this.objeto_seleccionado.updateMatrixWorld(); // Actualizar la matriz de transformación del objeto seleccionado

        this.add(this.objeto_seleccionado);//Añade a escena
      }

    }
  }

  createGround() {
    // El suelo es un Mesh, necesita una geometría y un material.

    // La geometría es una caja con muy poca altura
    var geometryGround = new THREE.BoxGeometry(400, 0.2, 400);

    // El material se hará con una textura de madera
    var texture = new THREE.TextureLoader().load('../img/ground.jpeg');
    var materialGround = new THREE.MeshPhongMaterial({ map: texture });

    // Ya se puede construir el Mesh
    var ground = new THREE.Mesh(geometryGround, materialGround);
    ground.castShadow = true;
    ground.receiveShadow = true;

    // Todas las figuras se crean centradas en el origen.
    // El suelo lo bajamos la mitad de su altura para que el origen del mundo se quede en su lado superior
    ground.position.y = -0.1;

    // Que no se nos olvide añadirlo a la escena, que en este caso es  this
    this.add(ground);
  }

  createRoom() {
    //Crear paredes
    this.puerta = this.createDoor();
    var paredes = [];
    var translacion;
    var roomCSG = new CSG();
    for (let i = 0; i < 4; i++) {
      paredes.push(this.createWall());
      translacion = 1;
      if (i % 2 == 0) {
        translacion = -1;
      }
      if (i > 1) {
        paredes[i].rotateY(Math.PI / 2);
      }
      paredes[i].translateZ(translacion * 200);
      roomCSG.union([paredes[i]]);
    }

    //Para crear el hueco debemos hacer una malla
    var boxGeometry = new THREE.BoxGeometry(100,200,10);
    boxGeometry.translate(-50, 100, 0);
    boxGeometry.translate(50,0,200);
    var material = new THREE.MeshBasicMaterial({color: 0xff0000});
    var malla = new THREE.Mesh(boxGeometry,material);
    malla.castShadow = true;
    malla.receiveShadow = true;
    
    roomCSG = roomCSG.subtract([malla]);
    var mallaParedes = roomCSG.toMesh();
    mallaParedes.castShadow = true;
    mallaParedes.receiveShadow = true;
    this.add(mallaParedes);
    paredes.push(this.createWall()); //Techo
    paredes[4].rotateX(Math.PI / 2);
    paredes[4].translateY(-200);
    paredes[4].translateZ(-400);
    this.add(paredes[4]); //Añadir pared al modelo
  }

  createDoor() {

    var boxGeometry = new THREE.BoxGeometry(100, 200, 10);
    boxGeometry.translate(-50, 100, 0);
    var textura = new THREE.TextureLoader().load('../img/door.jpeg');
    var material = new THREE.MeshPhongMaterial({ map: textura });

    var sphereGeometry = new THREE.SphereGeometry(5, 64, 64);
    sphereGeometry.translate(-75, 100, -10);
    var material2 = new THREE.MeshBasicMaterial({ color: 0xff00f0 });
    var esfera = new THREE.Mesh(sphereGeometry, material2);
    esfera.castShadow = true;
    esfera.receiveShadow = true;

    var puerta = new THREE.Object3D();
    puerta.add(new THREE.Mesh(boxGeometry, material)).add(esfera);
    puerta.position.z = 200;
    puerta.position.x = 50;
    return puerta;
  }

  createWall() {
    var boxGeometry = new THREE.BoxGeometry(400, 400, 1);
    boxGeometry.translate(0, 200, 0); //Altura/2
    var textura = new THREE.TextureLoader().load('../img/wall_texture.jpeg');
    
    var material = new THREE.MeshPhongMaterial({ map: textura });


    return new THREE.Mesh(boxGeometry, material);
  }

  createGUI() {
    // Se crea la interfaz gráfica de usuario
    var gui = new GUI();

    // La escena le va a añadir sus propios controles. 
    // Se definen mediante un objeto de control
    // En este caso la intensidad de la luz y si se muestran o no los ejes
    this.guiControls = {
      // En el contexto de una función   this   alude a la función
      lightIntensity: 0.5,
      axisOnOff: true
    }

    // Se crea una sección para los controles de esta clase
    var folder = gui.addFolder('Luz y Ejes');

    // Se le añade un control para la intensidad de la luz
    folder.add(this.guiControls, 'lightIntensity', 0, 1, 0.1)
      .name('Intensidad de la Luz : ')
      .onChange((value) => this.setLightIntensity(value));

    // Y otro para mostrar u ocultar los ejes
    folder.add(this.guiControls, 'axisOnOff')
      .name('Mostrar ejes : ')
      .onChange((value) => this.setAxisVisible(value));

    return gui;
  }

  createLights() {
    // Se crea una luz ambiental, evita que se vean complentamente negras las zonas donde no incide de manera directa una fuente de luz
    // La luz ambiental solo tiene un color y una intensidad
    // Se declara como   var   y va a ser una variable local a este método
    //    se hace así puesto que no va a ser accedida desde otros métodos
    var ambientLight = new THREE.AmbientLight(0x666666, 0.25);
    // La añadimos a la escena
    this.add(ambientLight);

    // Se crea una luz focal que va a ser la luz principal de la escena
    // La luz focal, además tiene una posición, y un punto de mira
    // Si no se le da punto de mira, apuntará al (0,0,0) en coordenadas del mundo
    // En este caso se declara como   this.atributo   para que sea un atributo accesible desde otros métodos.
    this.spotLight = new THREE.SpotLight(0xffffff, this.guiControls.lightIntensity);
    this.spotLight.position.set(0, 330, 0);
    this.spotLight.angle = Math.PI / 8; // Ángulo de apertura de la luz
    this.spotLight.penumbra = 0.2; // Suavidad de los bordes de la luz

    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 1024;
    this.spotLight.shadow.mapSize.height = 1024;
    this.spotLight.shadow.camera.near = 0.5;
    this.spotLight.shadow.camera.far = 500;
    this.spotLight.shadow.camera.fov = 30;
    this.add(this.spotLight);
  }

  setLightIntensity(valor) {
    this.spotLight.intensity = valor;
  }

  setAxisVisible(valor) {
    this.axis.visible = valor;
  }

  createRenderer(myCanvas) {
    // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.

    // Se instancia un Renderer   WebGL
    var renderer = new THREE.WebGLRenderer();

    // Se establece un color de fondo en las imágenes que genera el render
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);

    // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
    renderer.setSize(window.innerWidth, window.innerHeight);

    //Luces
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // La visualización se muestra en el lienzo recibido
    $(myCanvas).append(renderer.domElement);

    return renderer;
  }

  getCamera() {
    // En principio se devuelve la única cámara que tenemos
    // Si hubiera varias cámaras, este método decidiría qué cámara devuelve cada vez que es consultado
    return this.camera;
  }

  setCameraAspect(ratio) {
    // Cada vez que el usuario modifica el tamaño de la ventana desde el gestor de ventanas de
    // su sistema operativo hay que actualizar el ratio de aspecto de la cámara
    this.camera.aspect = ratio;
    // Y si se cambia ese dato hay que actualizar la matriz de proyección de la cámara
    this.camera.updateProjectionMatrix();
  }

  onWindowResize() {
    // Este método es llamado cada vez que el usuario modifica el tamapo de la ventana de la aplicación
    // Hay que actualizar el ratio de aspecto de la cámara
    this.setCameraAspect(window.innerWidth / window.innerHeight);

    // Y también el tamaño del renderizador
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  compruebaFinal() {
    if (this.final) this.contador_final++; //Para que sólo se pueda hacer 1 vez la animación
    if ((this.objeto_seleccionado == (this.getObjectById(this.puerta.children[1].id))) && this.final && (this.contador_final == 1))
      this.animacionAbrir.start();
  }

  checkPuzzle() {
    // Comprobar si cada objeto está a cierta distancia del tablero
    // Obtener referencias a la escena y a los objetos "tablero" y "torre"
    var tablero = this.getObjectByName("10586_Chess_Board_v1_max2010");
    // Verificar si los objetos existen en la escena
    // Obtener las coordenadas mundiales del tablero y la torre
    var coords_tablero = new THREE.Vector3();
    let contador_distancias = 0; //Contador de cuantas piezas están situadas a X distancia
    for (let i = 0; i < this.array_seleccionables.length; i++) {
      tablero.getWorldPosition(coords_tablero);
      var objeto = this.getObjectByName(this.array_seleccionables[i]);
      var coords_objeto = new THREE.Vector3();
      objeto.getWorldPosition(coords_objeto);
      var distance = coords_tablero.distanceTo(coords_objeto);
      if (distance <= 40)
        contador_distancias++;
      if (contador_distancias == 4)
        this.final = true;
    }
    console.log("Contador distancias -> " + contador_distancias);
  }

  changeDistance(event) {
    if (event.deltaY > 0) {
      this.distancia_seleccionado -= 5;
    } else {
      this.distancia_seleccionado += 5;
    }
  }


  update() {

    if (this.stats) this.stats.update();

    if (this.movingForward && !this.collisionForward) {
      this.cameracontrol.moveForward(2) * this.reloj.getDelta();
    }

    if (this.movingBackward && !this.collisionBackward) {
      this.cameracontrol.moveForward(-2) * this.reloj.getDelta();
    }

    if (this.movingLeft && !this.collisionLeft) {
      this.cameracontrol.moveRight(-2) * this.reloj.getDelta();
    }

    if (this.movingRight && !this.collisionRight) {
      this.cameracontrol.moveRight(2) * this.reloj.getDelta();

    }

    // Se actualizan los elementos de la escena para cada frame
    // Se actualiza la posición de la cámara según su controlador


    // Se actualiza el resto del modelo
    // this.model.update();

    TWEEN.update();

    // Le decimos al renderizador "visualiza la escena que te indico usando la cámara que te estoy pasando"
    this.renderer.render(this, this.getCamera());

    // Este método debe ser llamado cada vez que queramos visualizar la escena de nuevo.
    // Literalmente le decimos al navegador: "La próxima vez que haya que refrescar la pantalla, llama al método que te indico".
    // Si no existiera esta línea,  update()  se ejecutaría solo la primera vez.
    requestAnimationFrame(() => this.update())
  }
}

/// La función   main
$(function () {

  // Se instancia la escena pasándole el  div  que se ha creado en el html para visualizar
  var scene = new MyScene("#WebGL-output");

  // Se añaden los listener de la aplicación. En este caso, el que va a comprobar cuándo se modifica el tamaño de la ventana de la aplicación.
  window.addEventListener("resize", () => scene.onWindowResize());
  window.addEventListener("keydown", function (evento) {
    scene.onKeyDown(evento);
  });

  window.addEventListener("keyup", function (evento) {
    scene.onKeyUp(evento);
  });

  var _array;
  window.addEventListener("mousedown", function (evento) {
    _array = scene.onMouseClick(evento);

  });

  window.addEventListener("mousemove", function (evento) {
    scene.movableObject(_array.objeto, _array.distancia);
  });

  window.addEventListener("mouseup", function (evento) {
    scene.unselectObject();
    scene.checkPuzzle();
  });

  window.addEventListener("wheel", function (evento) {
    scene.changeDistance(evento);
  });


  // Que no se nos olvide, la primera visualización.
  scene.update();
});
