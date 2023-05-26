
// Clases de la biblioteca

import * as THREE from 'three'
import { GUI } from '../libs/dat.gui.module.js'
//import { TrackballControls } from '../libs/TrackballControls.js'
import { Stats } from '../libs/stats.module.js'
import { CSG } from '../libs/CSG-v2.js'
// Clases de mi proyecto
import { Puerta } from './puerta.js'
import * as TWEEN from '../libs/tween.esm.js'
import { FirstPersonControls } from '../libs/FirstPersonControls.js'
import { PointerLockControls } from '../libs/PointerLockControls.js'


// La clase fachada del modelo
/*
 * Usaremos una clase derivada de la clase Scene de Three.js para llevar el control de la escena y de todo lo que ocurre en ella.
 */

class MyScene extends THREE.Scene {
  constructor(myCanvas) {
    super();
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
    var origen = { angulo: 0 };
    var destino = { angulo: Math.PI / 2 };

    var animacionAbrir = new TWEEN.Tween(origen)
      .to(destino, 2000)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate(() => {
        this.puerta.rotation.y = origen.angulo;
      })
      .onComplete(() => {
        origen.angulo = 0;
      });

    var origenLuz = { int: 0.5 };
    var finLuz = { int: 0 };


    var animacionApaga = new TWEEN.Tween(origenLuz)
      .to(finLuz, 500)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate(() => {
        this.spotLight.intensity = origenLuz.int;
      })
      .onComplete(() => {
        origenLuz.int = 0.5;
        animacionMedia.start();
      });

    finLuz = { int: 0.25 };
    var animacionMedia = new TWEEN.Tween(origenLuz)
      .to(finLuz, 500)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate(() => {
        this.spotLight.intensity = origenLuz.int;
      })
      .onComplete(() => {
        origenLuz.int = 0.5;
        animacionEnciende.start();
      })
      .yoyo(true);


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
    animacionAbrir.start();

    this.add(this.puerta);

    // Por último creamos el modelo.
    // El modelo puede incluir su parte de la interfaz gráfica de usuario. Le pasamos la referencia a 
    // la gui y el texto bajo el que se agruparán los controles de la interfaz que añada el modelo.
    //this.model = new Puerta(this.gui, "Controles habitación");


    //this.add (this.model);

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

  //TODO: Movimiento + colision de camara
  checkCameraCollision() {
    var direccion = new THREE.Vector3(0, 0, 1);
    var posicion = this.cameracontrol.getObject().position; //Obtener posicion de la camara
    var eje_rotacion = new THREE.Vector3(0, 1, 0); //Eje va rotar la cámara
    var angulo_rot = 0;
    //Para los demás movimientos sería rotar la dirección de la cámara (sin rotar cámara) y lanzar rayo
    for (let i = 0; i < 4; i++) {//Calcular colisión 4 direcciones
      var raycaster = new THREE.Raycaster(posicion, direccion);//Trazar rayo
      //Comprobar colisiones
      var intersecciones = raycaster.intersectObjects(this.children); //Interseccion con el rayo
      if (intersecciones.length > 0 && intersecciones[0].distance < 25) {//0 = Objeto más cercano
        switch (i) {
          case 0:
            this.movingForward = false;
            break;
          case 1:
            this.movingLeft = false;
            break;
          case 2:
            this.movingBackward = false;
            break;
          case 3:
            this.movingRight = false;
            break;
        }
      }

      angulo_rot += Math.PI / 2; //Gira 90º en eje Y
      direccion = direccion.applyAxisAngle(eje_rotacion, angulo_rot);//Rotar la direccion que mira
    }
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
      }
    }
    //Devolver el objeto?
    return { objeto: interseccion[0].object, distancia: interseccion[0].distance };
  }

  unselectObject() {
    this.objeto_seleccionado.material = this.material_seleccionado;
    this.objeto_seleccionado.material.opacity = 1;
    this.add(this.objeto_seleccionado);
    this.seleccion = false;
    this.objeto_seleccionado = null;
    this.distancia_seleccionado = 0;
  }

  movableObject() {
    if (this.seleccion == true) {//Comprobar si esta siendo seleccionado
      var cameraPosition = this.cameracontrol.getObject().position.clone(); // Clona la posición de la cámara
      var cameraDirection = this.cameracontrol.getDirection(new THREE.Vector3()); // Obtiene la dirección de la cámara en el mundo
      var distance = this.distancia_seleccionado; // Distancia desde la cámara
      var targetPosition = cameraPosition.clone().add(cameraDirection.multiplyScalar(distance));
      this.objeto_seleccionado.position.copy(targetPosition);
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

    // Todas las figuras se crean centradas en el origen.
    // El suelo lo bajamos la mitad de su altura para que el origen del mundo se quede en su lado superior
    ground.position.y = -0.1;

    // Que no se nos olvide añadirlo a la escena, que en este caso es  this
    this.add(ground);
  }

  createRoom() {
    //Crear paredes
    this.puerta = this.createDoor();
    this.puerta.translateZ(200);
    this.puerta.translateX(50);
    var paredes = [];
    var translacion;
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
      var roomCSG = new CSG();
      roomCSG.union([paredes[i]]);
      roomCSG.subtract([this.puerta]);
      paredes[i] = roomCSG.toMesh();
      this.add(paredes[i]);
    }
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

    return new THREE.Mesh(boxGeometry, material);
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
    var ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
    // La añadimos a la escena
    this.add(ambientLight);

    // Se crea una luz focal que va a ser la luz principal de la escena
    // La luz focal, además tiene una posición, y un punto de mira
    // Si no se le da punto de mira, apuntará al (0,0,0) en coordenadas del mundo
    // En este caso se declara como   this.atributo   para que sea un atributo accesible desde otros métodos.
    this.spotLight = new THREE.SpotLight(0xffffff, this.guiControls.lightIntensity);
    this.spotLight.position.set(0, 390, 0);
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



  update() {

    if (this.stats) this.stats.update();

    if (this.movingForward) {
      this.cameracontrol.moveForward(2);
    }

    if (this.movingBackward) {
      this.cameracontrol.moveForward(-2);
    }

    if (this.movingLeft) {
      this.cameracontrol.moveRight(-2);
    }

    if (this.movingRight) {
      this.cameracontrol.moveRight(2);

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
  });

  console.log(scene.camera);

  // Que no se nos olvide, la primera visualización.
  scene.update();
});
