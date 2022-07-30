import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {FlyControls} from 'three/examples/jsm/controls/FlyControls';

// Scene
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000)
// Camera 2
let cameraDirection = new THREE.Vector3()

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

camera.position.z = 5;
camera.position.x = 0.5;
// Initiate FlyControls
var controls2 = new FlyControls(camera, renderer.domElement)
controls2.movementSpeed = 100
controls2.rollSpeed = Math.PI / 24
controls2.autoForward = false
controls2.dragToLook = true

// Add light
scene.background = new THREE.Color(0xffffff)
var light = new THREE.HemisphereLight(0xffffff, 0x000000, 5)
scene.add(light)

// Add statistics e.g. FPS 
const stats = Stats()
document.body.appendChild(stats.dom)

function animate() {
  requestAnimationFrame(animate)
  controls.update(0.01)
  render()
  stats.update()

  camera.getWorldDirection(cameraDirection)
  cameraDirection.set(cameraDirection.x * 100, cameraDirection.y * 100, cameraDirection.z * 100)
}

function render() {
  renderer.render(scene, camera)
}

animate()

// Import Car
let loader = new GLTFLoader();

var ferrari;
loader.load('/assets/scene.gltf', function(gltf) {
  ferrari = gltf.scene;
  scene.add(gltf.scene);
  ferrari.position.z = -300
  ferrari.position.x = -100
})
// Sound
const listener = new THREE.AudioListener()
camera.add(listener)
// Load Sound from THREE
const sound = new THREE.Audio(listener)
const AudioLoader = new THREE.AudioLoader();

window.onload = function() {
  const AudioLoader = new THREE.AudioLoader();
  AudioLoader.load('/assets/ferrarisound.ogg', function(buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(1);
    sound.autoplay = true;
  })
}
// Play sound and animate car
document.getElementById('start').addEventListener('click', () => {
    sound.play();
    for (var i = 0; i < 11; i++) {
      setInterval((function() {
        return function() {
          ferrari.rotation.y += +0.01
        };
      }(i)),100);
    }
})
// Stop sound and animation
document.getElementById('stop').addEventListener('click', () => {
  sound.stop();
  for (var i = 0; i < 11; i++) {
    setInterval((function() {
      return function() {
        ferrari.rotation.y = 0
      };
    }(i)));
  }
})
