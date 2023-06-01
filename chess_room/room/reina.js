import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'
import * as TWEEN from '../libs/tween.esm.js'

class Reina extends THREE.Object3D {
    constructor() {
        super();

        // Se crea la parte de la interfaz que corresponde a la caja
        // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
        var materialLoader = new MTLLoader();
        var objectLoader = new OBJLoader();
        materialLoader.load('../models/reina/12940_Stone_Chess_Queen_Side_A_V2_l1.mtl',
            (materials) => {
                objectLoader.setMaterials(materials);
                objectLoader.load('../models/reina/12940_Stone_Chess_Queen_Side_A_V2_l1.obj',
                    (object) => {
                        object.position.x = 50;
                        object.position.y = 100;
                        object.rotateX(-Math.PI/2);


                        // Habilitar las sombras para el objeto
                        object.traverse(function(child) {
                            if (child instanceof THREE.Mesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            }
                        });

                        this.add(object);
                    }, null, null);
            });
        
    }




    update() {
        // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
        // Primero, el escalado
        // Segundo, la rotación en Z
        // Después, la rotación en Y
        // Luego, la rotación en X
        TWEEN.update();
        //this.puerta.rotateY(-0.01);
    }

    revoluciona() {
        var puntos = []; //Crear perfil
        if (arguments.length == 0) {
            puntos.push(new THREE.Vector2(1, 1)); //Definir puntos de perfil
            puntos.push(new THREE.Vector2(0, 2));
        } else if (arguments.length == 1) {
            puntos = arguments[0];
        } else {
            throw new Error("Solo se admiten 0 o 1 parametros (perfil)")
        }
        //Generar la geometría por revolución
        var georev = new THREE.LatheGeometry(puntos, 10);
        var material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
        }
        ); //Crear un material para la revolucion

        var revolucion = new THREE.Mesh(georev, material); //Crear la malla

        //Creación de una línea
        var lineGeometry = new THREE.BufferGeometry(); //Crear geometría
        lineGeometry.setFromPoints(puntos); //Crear puntos de la línea
        var line = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color: 0xffffff }));//Crear línea

        return [revolucion, line];
    }




    barre() {
        var forma;
        if (arguments.length == 0) {
            forma = new THREE.Shape();
            forma.moveTo(-2, 0);
            forma.quadraticCurveTo(0, 0, 0, 2);
            forma.quadraticCurveTo(0, 0, 2, 0);
            forma.quadraticCurveTo(0, 0, 0, -2);
        } else if (arguments.length == 1) {
            forma = arguments[0];
        } else {
            throw new Error("Sólo se admiten 0 o 1 parámetros (perfil)");
        }


        var geometria = new THREE.ShapeGeometry(forma);
        var material = new THREE.MeshPhongMaterial({
            color: 0xff0000
        });

        return new THREE.Mesh(geometria, material);
    }

    union(figura1, figura2) {
        if (figura1 && figura2 instanceof THREE.Mesh) {
            var csg = new CSG();
            csg.union([figura1, figura2]);
            return csg.toMesh();
        }
    }



    interseccion(figura1, figura2) {
        if (figura1 && figura2 instanceof THREE.Mesh) {
            var csg = new CSG();
            csg.intersect([figura1, figura2]);
            return csg.toMesh();
        }
    }

    diferencia(figura1, figura2) {
        if (figura1 && figura2 instanceof THREE.Mesh) {
            var csg = new CSG();
            csg.subtract([figura1, figura2]);
            return csg.toMesh();
        }
    }



}

export { Reina };
