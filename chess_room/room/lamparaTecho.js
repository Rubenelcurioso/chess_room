import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'
import * as TWEEN from '../libs/tween.esm.js'

class lamparaTecho extends THREE.Object3D {
    constructor() {
        super();
        this.hangDistance = 50;
        this.radiusRope = 0.5;
        this.headHeight = 20;
        this.headRadius = 10;

        this.createRope();
        this.createHead();

        this.rope.castShadow = true;
        this.rope.receiveShadow = true;

        this.head.castShadow = true;
        this.head.receiveShadow = true;

        this.rope.add(this.head);
        this.add(this.rope);
    }

    createRope(){
        this.materialRope = new THREE.MeshPhongMaterial({color : 0x9B9B9B});
        this.ropeGeometry = new THREE.CylinderGeometry(this.radiusRope, this.radiusRope, this.hangDistance, 32);
        this.ropeGeometry.translate(0, -this.hangDistance / 2, 0);

        this.rope = new THREE.Mesh(this.ropeGeometry, this.materialRope);
    }

    createHead(){

        this.materialHead = new THREE.MeshPhongMaterial({color : 0xFFFFFF});
        this.headGeometry = new THREE.CylinderGeometry(this.radiusRope, this.headRadius, this.headHeight, 32);
        this.headGeometry.translate(0, -this.hangDistance, 0);
        
        this.head = new THREE.Mesh(this.headGeometry, this.materialHead);
    }

    
    update(){
    }
}

export {lamparaTecho};