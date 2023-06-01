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

        this.base.castShadow = true;
        this.base.receiveShadow = true;
        
        this.axis1.castShadow = true;
        this.axis1.receiveShadow = true;
        
        this.axis2.castShadow = true;
        this.axis2.receiveShadow = true;
        
        this.rope.castShadow = true;
        this.rope.receiveShadow = true;
        
        this.sphere.castShadow = true;
        this.sphere.receiveShadow = true;

        this.rope.add(this.sphere);
        this.rope.translateY(this.baseHeight + this.axisHeight);
        this.rope.translateZ(this.axisHeight / 2.5);
        //Variables de animación
        var duration = 2000;
        // Creación del Tween de la animación
        var origenSubida = { angulo : 0};
        var destinoSubida = {angulo : Math.PI/2};
        var animacionSubida1 = new TWEEN.Tween(origenSubida)
            .to(destinoSubida, duration)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                this.rope.rotation.z = origenSubida.angulo;
            })
            .onComplete(() =>{

                origenSubida.angulo = Math.PI/2;
                destinoSubida.angulo = 0;
                animacionBajada1.start();
            });
        
        var animacionBajada1 = new TWEEN.Tween(origenSubida)
        .to(destinoSubida, duration)
        .easing(TWEEN.Easing.Quadratic.In)
        .onUpdate(() => {
            this.rope.rotation.z = origenSubida.angulo;
        })
        .onComplete(() =>{

            origenSubida.angulo = 0;
            destinoSubida.angulo = -Math.PI/2;
            animacionSubida2.start();
        });

        var animacionSubida2 = new TWEEN.Tween(origenSubida)
        .to(destinoSubida, duration)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
            this.rope.rotation.z = origenSubida.angulo;
        })
        .onComplete(() =>{

            origenSubida.angulo = -Math.PI/2;
            destinoSubida.angulo = 0;
            animacionBajada2.start();
        });

        var animacionBajada2 = new TWEEN.Tween(origenSubida)
            .to(destinoSubida, duration)
            .easing(TWEEN.Easing.Quadratic.In)
            .onUpdate(() => {
                this.rope.rotation.z = origenSubida.angulo;
            })
            .onComplete(() =>{

                origenSubida.angulo = 0;
                destinoSubida.angulo = Math.PI/2;
                animacionSubida1.start();
            });

        animacionSubida1.start();

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

        var textura = new THREE.TextureLoader().load('../img/woodPendulumBase.jpg');
        this.materialBase.bumpMap = textura;
        this.materialBase.bumpScale = 0.15
        

        this.base = new THREE.Mesh(this.geometryBase, this.materialBase);
    }

    createAxis1(){
        this.materialAxis = new THREE.MeshPhongMaterial({color: 0x8A9597});
        this.geometryEje1 = new THREE.CylinderGeometry(this.axisRadius, this.axisRadius, this.axisHeight, 32);
        this.geometryEje1.translate(0, this.axisHeight / 2 + this.baseHeight, 0);
        var textura = new THREE.TextureLoader().load('../img/metal_textura.jpg');
        this.materialAxis.bumpMap = textura;
        this.materialAxis.bumpScale = 0.5;
        
        this. axis1 =new THREE.Mesh(this.geometryEje1, this.materialAxis);
    }
    createAxis2(){
        this.geometryEje2 = new THREE.CylinderGeometry(this.axisRadius, this.axisRadius, this.axisHeight / 2, 32);
        this.geometryEje2.rotateX(-Math.PI/2);
        this.geometryEje2.translate(0, this.axisHeight + this.baseHeight, this.axisHeight/4);
        var textura = new THREE.TextureLoader().load('../img/metal_textura.jpg');
        this.materialAxis.bumpMap = textura;
        this.materialAxis.bumpScale = 0.5;
        
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
        this.geometrySphere.translate(0, -(this.baseHeight/2 + this.ropeHeight), 0);

        var textura = new THREE.TextureLoader().load('../img/texturaBola.jpeg');
        this.materialSphere.bumpMap = textura;
        this.materialSphere.bumpScale = 0.75;

        this.sphere = new THREE.Mesh(this.geometrySphere, this.materialSphere);
    }
    
    update(){
        TWEEN.update();
    }
}

export {Pendulo};