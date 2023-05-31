import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'
import * as TWEEN from '../libs/tween.esm.js'

class Flexo extends THREE.Object3D {
    constructor() {
        super();
        this.radiusBase = 16;
        this.heightBase = 2;
        this.heightAxis = 45;
        this.radiusAxis = 2;
        this.topRadius = 6;
        this.heightHead = 8;

        this.createBase();
        this.createAxis1();
        this.createAxis2();
        this.createHead();

        this.base.castShadow = true;
        this.base.receiveShadow = true;

        this.axis1.castShadow = true;
        this.axis1.receiveShadow = true;

        this.axis2.castShadow = true;
        this.axis2.receiveShadow = true;

        this.head.castShadow = true;
        this.head.receiveShadow = true;

        this.axis1.translateY(this.heightBase / 2);
        this.axis2.translateY(this.heightAxis);
        this.head.translateY(this.heightAxis);

        this.axis2.add(this.head);
        this.axis1.add(this.axis2);

        this.axis1.rotateX(Math.PI/5);
        this.axis2.rotateX(-Math.PI/2);
        this.head.rotateX(-Math.PI/4);

        this.base.add(this.axis1);


        this.add(this.base);
    }

    createBase(){
        this.materialBase = new THREE.MeshPhongMaterial({color : 0x0000FF});
        this.BaseGeometry = new THREE.CylinderGeometry(this.radiusBase, this.radiusBase, this.heightBase, 32);
        this.BaseGeometry.translate(0, this.heightBase/2, 0);

        this.base = new THREE.Mesh(this.BaseGeometry, this.materialBase);
    }

    createAxis1(){
        this.materialAxis = new THREE.MeshPhongMaterial({color: 0x8A9597});
        this.axisGeometry = new THREE.CylinderGeometry(this.radiusAxis, this.radiusAxis, this.heightAxis, 32);
        this.axisGeometry.translate(0, this.heightAxis/2, 0);

        this.axis1 = new THREE.Mesh(this.axisGeometry, this.materialAxis);
    }

    createAxis2(){
        this.axis2Geometry = new THREE.CylinderGeometry(this.radiusAxis, this.radiusAxis, this.heightAxis, 32);
        this.axis2Geometry.translate(0, this.heightAxis/2, 0);

        this.axis2 = new THREE.Mesh(this.axis2Geometry, this.materialAxis);
    }

    createHead(){
        this.headGeometry = new THREE.CylinderGeometry(this.topRadius, this.radiusAxis, this.heightHead, 32);
        this.headGeometry.translate(0, this.heightHead/2, 0);

        this.holeGeometry = new THREE.CylinderGeometry(this.topRadius - 0.1, this.radiusAxis - 0.1, this.heightHead - 0.1, 32);
        this.holeGeometry.translate(0, this.heightHead/2 + 0.2, 0);
        var newCSG = new CSG();
        var mesh1 = new THREE.Mesh(this.headGeometry, this.materialAxis);
        var mesh2 = new THREE.Mesh(this.holeGeometry, this.materialAxis);
        newCSG.union([mesh1]);
        this.head = newCSG.subtract([mesh2]).toMesh();
    }

    
    update(){
    }
}

export {Flexo};