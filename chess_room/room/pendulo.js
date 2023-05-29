import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'
import * as TWEEN from '../libs/tween.esm.js'

class Pendulo extends THREE.Object3D {
    constructor() {
        super();
        this.baseHeight = 5;
        this.baseWidth = 25;
        this.axisRadius = 1.25;
        this.axisHeight = 75;
        this.ropeHeight = 20;
        this.ropeWidth = 0.25;
        this.sphereRadius = 4;
        this.createBase();
        this.createAxis1();
        this.createAxis2();
        this.createRope();
        this.createSphere();

        this.rope.add(this.sphere);
        this.rope.translateY(this.baseHeight + this.axisHeight);
        this.rope.translateZ(this.axisHeight / 2.5);
        var duration = 8000;
        // Variables de configuración
        // Escalas y rotaciones para el patrón en forma de 8
        var scales = [
        new THREE.Vector3(1, 1, 1), // Escala inicial
        new THREE.Vector3(1, 2, 1), // Escala durante el primer bucle del 8
        new THREE.Vector3(1, 1, 1), // Escala al final del primer bucle
        new THREE.Vector3(1, 0.5, 1), // Escala durante el segundo bucle del 8
        new THREE.Vector3(1, 1, 1) // Escala final
        ];

        var rotations = [
        new THREE.Euler(0, 0, 0), // Rotación inicial
        new THREE.Euler(0, Math.PI, 0), // Rotación durante el primer bucle del 8
        new THREE.Euler(0, Math.PI * 2, 0), // Rotación al final del primer bucle
        new THREE.Euler(0, Math.PI * 3, 0), // Rotación durante el segundo bucle del 8
        new THREE.Euler(0, Math.PI * 4, 0) // Rotación final
        ];

        // Creación del Tween de la animación
        var animation = new TWEEN.Tween({ t: 0 })
        .to({ t: 1 }, duration)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function() {
            var scaleIndex = Math.floor(this.t * scales.length);
            var rotationIndex = Math.floor(this.t * rotations.length);

            // Aplicar la escala y rotación correspondientes
            
            this.rope.scale.x = scales[scaleIndex].x;
            this.rope.scale.y = scales[scaleIndex].y;
            this.rope.scale.z = scales[scaleIndex].z;
            this.rope.rotation.x = rotations[rotationIndex].x;
            this.rope.rotation.y = rotations[rotationIndex].y;
            this.rope.rotation.z = rotations[rotationIndex].z;
        })
        .start();

        this.axis2.add(this.rope);
        this.axis1.add(this.axis2)
        this.base.add(this.axis1);
        this.add(this.base);
        this.add(this.visibleSpline);
        

    }

    createBase(){
        this.materialBase = new THREE.MeshPhongMaterial({color : 0x663300});
        this.geometryBase = new THREE.BoxGeometry(this.baseWidth , this.baseHeight, 2*this.baseWidth );
        this.geometryBase.translate(0, this.baseHeight, 0);
        

        this.base = new THREE.Mesh(this.geometryBase, this.materialBase);
    }

    createAxis1(){
        this.materialAxis = new THREE.MeshPhongMaterial({color: 0x8A9597});
        this.geometryEje1 = new THREE.CylinderGeometry(this.axisRadius, this.axisRadius, this.axisHeight, 32);
        this.geometryEje1.translate(0, this.axisHeight / 2 + this.baseHeight, 0);
        
        this. axis1 =new THREE.Mesh(this.geometryEje1, this.materialAxis);
    }
    createAxis2(){
        this.geometryEje2 = new THREE.CylinderGeometry(this.axisRadius, this.axisRadius, this.axisHeight / 2, 32);
        this.geometryEje2.rotateX(-Math.PI/2);
        this.geometryEje2.translate(0, this.axisHeight + this.baseHeight, this.axisHeight/4);
        
        this.axis2 =new THREE.Mesh(this.geometryEje2, this.materialAxis);
    }

    createRope(){
        this.geometryRope = new THREE.CylinderGeometry(this.ropeWidth, this.ropeWidth, this.ropeHeight, 32);
        this.geometryRope.translate(0, -this.ropeHeight/2, 0);

        this.rope = new THREE.Mesh(this.geometryRope, this.materialAxis);
    }

    createSphere(){
        this.materialSphere = new THREE.MeshPhongMaterial({color: 0xFF0000});
        this.geometrySphere = new THREE.SphereGeometry(this.sphereRadius, 32, 16);
        this.geometrySphere.translate(0, -(this.baseHeight + this.ropeHeight), 0);
        this.sphere = new THREE.Mesh(this.geometrySphere, this.materialSphere);
    }
    
    update(){
        TWEEN.update();
    }
}

export {Pendulo};