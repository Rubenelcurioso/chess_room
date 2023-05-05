
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

 
// La clase fachada del modelo
/*
 * Usaremos una clase derivada de la clase Scene de Three.js para llevar el control de la escena y de todo lo que ocurre en ella.
 */

class MyScene extends THREE.Scene {
  constructor (myCanvas) {
    super();
    this.canOpenDoor = false;
    
    // Lo primero, crear el visualizador, pasándole el lienzo sobre el que realizar los renderizados.
    this.renderer = this.createRenderer(myCanvas);
    
    // Se añade a la gui los controles para manipular los elementos de esta clase
    this.gui = this.createGUI ();
    
    this.initStats();
    
    // Construimos los distinos elementos que tendremos en la escena
    
    // Todo elemento que se desee sea tenido en cuenta en el renderizado de la escena debe pertenecer a esta. Bien como hijo de la escena (this en esta clase) o como hijo de un elemento que ya esté en la escena.
    // Tras crear cada elemento se añadirá a la escena con   this.add(variable)
    this.createLights ();
    
    // Tendremos una cámara con un control de movimiento con el ratón
    this.createCamera ();
    
    // Un suelo 
    this.createGround ();

    this.createRoom();
    
    // Y unos ejes. Imprescindibles para orientarnos sobre dónde están las cosas
    this.axis = new THREE.AxesHelper (5);
    this.add (this.axis);
    var origen  = { angulo : 0};
    var destino = { angulo : Math.PI/2};

    var animacionAbrir = new TWEEN.Tween( origen )
      .to( destino, 2000 )
      .easing( TWEEN.Easing.Linear.None)
      .onUpdate(() => {
        this.puerta.rotation.y = origen.angulo;
      })
      .onComplete(() => {
        origen.angulo = 0;
      });
    
    var origenLuz = { int : 0.5 };
    var finLuz    = { int : 0 };

    
    var animacionApaga = new TWEEN.Tween( origenLuz )
      .to( finLuz, 500 )
      .easing( TWEEN.Easing.Linear.None)
      .onUpdate(() => {
        this.spotLight.intensity = origenLuz.int;
      })
      .onComplete(() => {
        origenLuz.int = 0.5;
        animacionMedia.start();
      });
    
    finLuz    = { int : 0.25 };
    var animacionMedia = new TWEEN.Tween( origenLuz )
    .to( finLuz, 500 )
    .easing( TWEEN.Easing.Linear.None)
    .onUpdate(() => {
      this.spotLight.intensity = origenLuz.int;
    })
    .onComplete(() => {
      origenLuz.int = 0.5;
      animacionEnciende.start();
    })
    .yoyo(true);
  


    origenLuz = { int : 0 };
    finLuz    = { int : 0.5 };

    var animacionEnciende = new TWEEN.Tween( origenLuz )
    .to( finLuz, 500 )
    .easing( TWEEN.Easing.Linear.None)
    .onUpdate(() => {
      this.spotLight.intensity = origenLuz.int;
    })
    .onComplete(() => {
      origenLuz.int = 0;
    });

    animacionEnciende.chain(animacionApaga);

    animacionEnciende.start();

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
    
    $("#Stats-output").append( stats.domElement );
    
    this.stats = stats;
  }
  
  createCamera () {
    // Para crear una cámara le indicamos
    //   El ángulo del campo de visión en grados sexagesimales -> 60º ojo humano
    //   La razón de aspecto ancho/alto
    //   Los planos de recorte cercano y lejano
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    // También se indica dónde se coloca
    this.camera.position.set (20, 180, 20);
    // Y hacia dónde mira
    var look = new THREE.Vector3 (0,0,0);
    this.camera.lookAt(look);
    this.add (this.camera);
    
    this.cameraFP = new FirstPersonControls(this.camera, this.renderer.domElement);
    this.cameraFP.constrainVertical = true;
    this.cameraFP.verticalMax = Math.PI - Math.PI/5; //Altura maxima para ver = 4/5 de PI (no mirar a tus pies)
    this.cameraFP.activeLook = true; //Puede ver alrededor
    this.cameraFP.heightMax = 200; //H max cámara
    this.cameraFP.heightMin = 150; //H min cámara
    this.cameraFP.lookVertical = true; //Puede ver arriba y abajo
    this.cameraFP.lookSpeed = 0.5; //Sensibilidad
    this.cameraFP.movementSpeed = 30; //Rapidez del movimiento
    this.cameraFP.lookAt(look); //Donde comienza viendo la escena
    this.clock = new THREE.Clock(true);
    
  }
  
createGround () {
    // El suelo es un Mesh, necesita una geometría y un material.
    
    // La geometría es una caja con muy poca altura
    var geometryGround = new THREE.BoxGeometry (400,0.2,400);
    
    // El material se hará con una textura de madera
    var texture = new THREE.TextureLoader().load('../img/ground.jpeg');
    var materialGround = new THREE.MeshPhongMaterial ({map: texture});
    
    // Ya se puede construir el Mesh
    var ground = new THREE.Mesh (geometryGround, materialGround);
    
    // Todas las figuras se crean centradas en el origen.
    // El suelo lo bajamos la mitad de su altura para que el origen del mundo se quede en su lado superior
    ground.position.y = -0.1;
    
    // Que no se nos olvide añadirlo a la escena, que en este caso es  this
    this.add (ground);
  }
  
  createRoom(){
    //Crear paredes
    this.puerta = this.createDoor();
    this.puerta.translateZ(200);
    this.puerta.translateX(50);
    var paredes = [];
    var translacion;
    for(let i=0; i<4; i++){
      paredes.push(this.createWall());
      translacion = 1;
      if (i % 2 == 0) {
        translacion = -1;
      }
      if(i>1){
        paredes[i].rotateY(Math.PI/2);
      }
      paredes[i].translateZ(translacion * 200);
      var roomCSG = new CSG();
      roomCSG.union([paredes[i]]);
      roomCSG.subtract([this.puerta]);
      paredes[i] = roomCSG.toMesh();
      this.add(paredes[i]);
    }
    paredes.push(this.createWall()); //Techo
    paredes[4].rotateX(Math.PI/2);
    paredes[4].translateY(-200);
    paredes[4].translateZ(-400);
    this.add(paredes[4]); //Añadir pared al modelo
  }

  createDoor(){

    var boxGeometry = new THREE.BoxGeometry(100,200,10);
    boxGeometry.translate(-50,100,0);
    var textura = new THREE.TextureLoader().load('../img/door.jpeg');
    var material = new THREE.MeshPhongMaterial({map: textura});

    return new THREE.Mesh(boxGeometry,material);
  }

  createWall(){
    var boxGeometry = new THREE.BoxGeometry(400,400,1);
    boxGeometry.translate(0,200,0); //Altura/2
    var textura = new THREE.TextureLoader().load('../img/wall_texture.jpeg');
    var material = new THREE.MeshPhongMaterial({map: textura});


    return new THREE.Mesh(boxGeometry,material);
  }

  createGUI () {
    // Se crea la interfaz gráfica de usuario
    var gui = new GUI();
    
    // La escena le va a añadir sus propios controles. 
    // Se definen mediante un objeto de control
    // En este caso la intensidad de la luz y si se muestran o no los ejes
    this.guiControls = {
      // En el contexto de una función   this   alude a la función
      lightIntensity : 0.5,
      axisOnOff : true
    }

    // Se crea una sección para los controles de esta clase
    var folder = gui.addFolder ('Luz y Ejes');
    
    // Se le añade un control para la intensidad de la luz
    folder.add (this.guiControls, 'lightIntensity', 0, 1, 0.1)
      .name('Intensidad de la Luz : ')
      .onChange ( (value) => this.setLightIntensity (value) );
    
    // Y otro para mostrar u ocultar los ejes
    folder.add (this.guiControls, 'axisOnOff')
      .name ('Mostrar ejes : ')
      .onChange ( (value) => this.setAxisVisible (value) );
    
    return gui;
  }
  
  createLights () {
    // Se crea una luz ambiental, evita que se vean complentamente negras las zonas donde no incide de manera directa una fuente de luz
    // La luz ambiental solo tiene un color y una intensidad
    // Se declara como   var   y va a ser una variable local a este método
    //    se hace así puesto que no va a ser accedida desde otros métodos
    var ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
    // La añadimos a la escena
    this.add (ambientLight);
    
    // Se crea una luz focal que va a ser la luz principal de la escena
    // La luz focal, además tiene una posición, y un punto de mira
    // Si no se le da punto de mira, apuntará al (0,0,0) en coordenadas del mundo
    // En este caso se declara como   this.atributo   para que sea un atributo accesible desde otros métodos.
    this.spotLight = new THREE.SpotLight( 0xffffff, this.guiControls.lightIntensity );
    this.spotLight.position.set( 0, 390, 0 );
    this.add (this.spotLight);
  }
  
  setLightIntensity (valor) {
    this.spotLight.intensity = valor;
  }
  
  setAxisVisible (valor) {
    this.axis.visible = valor;
  }
  
  createRenderer (myCanvas) {
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
  
  getCamera () {
    // En principio se devuelve la única cámara que tenemos
    // Si hubiera varias cámaras, este método decidiría qué cámara devuelve cada vez que es consultado
    return this.camera;
  }
  
  setCameraAspect (ratio) {
    // Cada vez que el usuario modifica el tamaño de la ventana desde el gestor de ventanas de
    // su sistema operativo hay que actualizar el ratio de aspecto de la cámara
    this.camera.aspect = ratio;
    // Y si se cambia ese dato hay que actualizar la matriz de proyección de la cámara
    this.camera.updateProjectionMatrix();
  }
  
  onWindowResize () {
    // Este método es llamado cada vez que el usuario modifica el tamapo de la ventana de la aplicación
    // Hay que actualizar el ratio de aspecto de la cámara
    this.setCameraAspect (window.innerWidth / window.innerHeight);
    
    // Y también el tamaño del renderizador
    this.renderer.setSize (window.innerWidth, window.innerHeight);
  }



  update () {
    
    if (this.stats) this.stats.update();
    
    // Se actualizan los elementos de la escena para cada frame
    
    // Se actualiza la posición de la cámara según su controlador
    /* this.cameraControl.update(); */
    this.cameraFP.update(this.clock.getDelta());

    
    // Se actualiza el resto del modelo
   // this.model.update();

   TWEEN.update();
    
    // Le decimos al renderizador "visualiza la escena que te indico usando la cámara que te estoy pasando"
    this.renderer.render (this, this.getCamera());

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
  window.addEventListener ("resize", () => scene.onWindowResize());
 

  // Que no se nos olvide, la primera visualización.
  scene.update();
});
