import * as THREE from 'three';

let scene, camera, renderer, controls, loader;

function init() {
    // Inicializa la escena, la cámara, y el renderizador
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Agrega un plano
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshBasicMaterial({color: 0x777777, side: THREE.DoubleSide});
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2;
    scene.add(plane);

    // Agrega una luz direccional
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 1).normalize();
    scene.add(directionalLight);


    // Configura los controles de orbita
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 1, 3);
    controls.update();

    loader.load('assets/images/karambit.glb', (gltf) => {
        gltf.scene.scale.set(1, 1, 1);  // Ajusta el tamaño si es necesario
        gltf.scene.position.set(0, 0, 0);  // Ajusta la posición si es necesario
        scene.add(gltf.scene);
        animate();
    });

    // Carga el modelo 3D
    loader = new THREE.GLTFLoader();
    loader.load('assets/images/karambit.glb', (gltf) => {
        scene.add(gltf.scene);
        animate();
    });
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Para que estas funciones estén disponibles globalmente
window.init = init;
window.animate = animate;
