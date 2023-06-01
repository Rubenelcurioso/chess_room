import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'
import * as TWEEN from '../libs/tween.esm.js'

class Mesa extends THREE.Object3D {
    constructor() {
        super();
        this.tableroHeight = 5;
        this.tableroWidth = 200;
        this.tableroDepth = 80;

        this.pataHeight = 60;
        this.pataRadius = 3;
        //Creamos el tablero de la mesa y sus patas
        this.createTablero();
        var pata1 = this.createPata();
        var pata2 = this.createPata();
        var pata3 = this.createPata();
        var pata4 = this.createPata();

        //Colocamos las patas en su posición

        this.tablero.castShadow = true;
        this.tablero.receiveShadow = true;

        pata1.castShadow = true;
        pata1.receiveShadow = true;

        pata2.castShadow = true;
        pata2.receiveShadow = true;

        pata3.castShadow = true;
        pata3.receiveShadow = true;

        pata4.castShadow = true;
        pata4.receiveShadow = true;

        pata1.translateZ(this.tableroWidth / 2.5);
        pata3.translateZ(this.tableroWidth / 2.5);
        pata2.translateZ(-this.tableroWidth / 2.5);
        pata4.translateZ(-this.tableroWidth / 2.5);

        pata1.translateX(this.tableroDepth / 2.5);
        pata3.translateX(-this.tableroDepth / 2.5);
        pata2.translateX(-this.tableroDepth / 2.5);
        pata4.translateX(this.tableroDepth / 2.5);


        this.tablero.add(pata1);
        this.tablero.add(pata2);
        this.tablero.add(pata3);
        this.tablero.add(pata4);

        this.add(this.tablero);


    }

    createTablero(){
        this.materialTablero = new THREE.MeshPhongMaterial({color : 0x804000});
        this.tableroGeometry = new THREE.BoxGeometry(this.tableroDepth, this.tableroHeight, this.tableroWidth);
        this.tableroGeometry.translate(0, this.tableroHeight / 2, 0);

        this.tablero = new THREE.Mesh(this.tableroGeometry, this.materialTablero);
    }

    createPata(){
        this.materialPata = new THREE.MeshPhongMaterial({color : 0xFF0000});
        this.pataGeometry = new THREE.CylinderGeometry(this.pataRadius, this.pataRadius, this.pataHeight, 32);
        this.pataGeometry.translate(0, -this.pataHeight/2, 0)
        return new THREE.Mesh(this.pataGeometry, this.materialPata);
    }
    
    update(){
    }
}

export {Mesa};