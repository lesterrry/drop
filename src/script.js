/*************************
Handcrafted by Aydar N.
2023

me@aydar.media

*************************/

import './style.css'
import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

//
// Events
//
window.addEventListener('resize', () => {
	SIZES.width = window.innerWidth
	SIZES.height = window.innerHeight
	camera.aspect = SIZES.width / SIZES.height
	camera.updateProjectionMatrix()
	renderer.setSize(SIZES.width, SIZES.height)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
window.addEventListener('mousemove', (event) => {
	cursor.x = event.clientX / SIZES.width - 0.5
	cursor.y = - (event.clientY / SIZES.height - 0.5)
})

window.addEventListener('load', () => {
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
		console.log('Detected mobile screen')
	}
	init()
	threeTick()
})

//
// Three & scenes
//
const SIZES = {
	width: window.innerWidth,
	height: window.innerHeight
}
let cursor = {
	x: 0,
	y: 0
}

const CANVAS = document.querySelector('canvas.webgl')

const camera = new THREE.PerspectiveCamera(75, SIZES.width / SIZES.height, 0.1, 100)
const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({
	canvas: CANVAS,
	antialias: true,
	alpha: true
})

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(SIZES.width, SIZES.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const init = () => {
	camera.position.set(0, 0, 10)
	scene.add(camera)

	const hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0x444444, 0.6)
	hemiLight.position.set(0, 20, 0)
	scene.add(hemiLight)

	const spotLight = new THREE.SpotLight(0xFFFFFF, 0.8)
	spotLight.angle = Math.PI / 5
	spotLight.position.set(4, 10, 20)
	spotLight.castShadow = true
	spotLight.shadow.camera.near = 3
	spotLight.shadow.camera.far = 36
	spotLight.shadow.mapSize.width = 2048
	spotLight.shadow.mapSize.height = 2048
	scene.add(spotLight)

	const loader = new FBXLoader()
	loader.load('/3d/Skyline_v1.fbx', (object) => {
		object.rotation.z = 0.5
		object.traverse((child) => {
			if (child.isMesh) {
				child.castShadow = true
				child.receiveShadow = true
			}
		})
		// scene.add(object)
	})

	loader.load('/3d/Drop_v1.fbx', (object) => {
		object.traverse((child) => {
			if (child.isMesh) {
				child.castShadow = true
				child.receiveShadow = true
			}
		})
		scene.add(object)
	})
}

//
// Main loop
//
const threeTick = () => {
	camera.position.x = (cursor.x + 0.5) * 2
	camera.position.y = cursor.y + 9
	camera.lookAt(new THREE.Vector3(0, 6, 0))

	renderer.render(scene, camera)

	window.requestAnimationFrame(threeTick)
}
