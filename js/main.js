import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Crear la escena
const scene = new THREE.Scene();

// Crear la cámara
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(300, 50, 50);  // Ajusta la posición de la cámara según sea necesario

// Crear el renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true, gammaOutput: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);  // Añadido esta línea
renderer.setClearColor(0xeeeeee);  // fondo gris claro
document.body.appendChild(renderer.domElement);

// Crear los controles de órbita para permitir la interacción con el usuario
const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', () => renderer.render(scene, camera));  // sólo necesario si controls.enableDamping = true, o si controls.autoRotate = true

// Crear una luz puntual y añadirla a la escena
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(0, 1, 3);
scene.add(pointLight);

// Crear una luz direccional y añadirla a la escena
const directionalLight = new THREE.DirectionalLight(0xffffff, 55);
directionalLight.position.set(0, 1, 1).normalize();
scene.add(directionalLight);

// Instanciar un cargador
const loader = new GLTFLoader();

// Cargar un recurso glTF
loader.load(
    'assets/images/karambit/scene.gltf',
    function (gltf) {
        gltf.scene.position.set(0, 0, 0);  // Asegura que el modelo está en el origen
        gltf.scene.scale.set(1, 1, 1);    // Asegura que el modelo tiene una escala normal
        console.log(gltf.scene.position);  
        console.log(gltf.scene.scale);     
        scene.add(gltf.scene);
        animate();
    },
    // Llamado mientras la carga está progresando
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // Llamado cuando ocurren errores de carga
    (error) => {
        console.error('An error happened', error);
    }
);

// Raycaster e Intersección
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Escuchar los eventos del ratón
window.addEventListener('click', onMouseClick, false);

function onMouseClick(event) {
    event.preventDefault();
    
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    
    const intersects = raycaster.intersectObjects(scene.children, true);
    
    if (intersects.length > 0) {
        let intersectedObject = intersects[0].object;  // Cambio 'const' a 'let' para permitir la reasignación
        
        // Verificar si el objeto intersectado o sus padres tienen un nombre 'interactive'
        while (intersectedObject) {
            if (intersectedObject.name.startsWith('interactive')) {
                document.getElementById('myModal').style.display = "block";
                return;  // Salir de la función si encontramos una parte interactiva
            }
            intersectedObject = intersectedObject.parent;  // Actualizado para referirse al padre del objeto intersectado
        }
    }
}

// Función para actualizar el texto en la imagen
function updateText() {
    const text = document.getElementById('text-input').value;
    // Aquí puedes actualizar el texto en tu imagen como lo necesites
    // ...
}

// Función para cerrar el modal
document.getElementsByClassName('close')[0].onclick = function() {
    document.getElementById('myModal').style.display = "none";
}


// Bucle de animación
function animate() {
    requestAnimationFrame(animate);
    controls.update();  // sólo necesario si controls.enableDamping = true, o si controls.autoRotate = true
    renderer.render(scene, camera);
}

// Función para manejar el redimensionamiento de la ventana
function onWindowResize(){
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

window.addEventListener('resize', onWindowResize, false);
