import * as THREE from './three/build/three.module.js'
import{OrbitControls} from './three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from './three/examples/jsm/loaders/GLTFLoader.js'


let scene
let camera
let renderer
let control

let earth
let rot1
let moon
let xwing
let tie


let directionalLight
let ambientLight


let createEarth = ()=>{
    let loaader = new THREE.TextureLoader()
    let texture = loaader.load('./asset/earth/daymap.jpg')
    let texture_normal = loaader.load('/asset/earth/normal_map.png')
    texture_normal.wrapS = THREE.RepeatWrapping;
    texture_normal.wrapT = THREE.RepeatWrapping;
    let geo = new THREE.SphereGeometry(18 ,50,50)
    let mat = new THREE.MeshPhongMaterial({
        color: 0xa3a3a3,
        map: texture
        ,normalMap: texture_normal
        ,shininess: 3
        

    })

    let mesh = new THREE.Mesh(geo,mat)
    mesh.rotation.set(-0.2,2.7,0.01)
    mesh.receiveShadow =true
    return mesh
}

let createMoon = ()=>{
    let loaader = new THREE.TextureLoader()
    let texture = loaader.load('./asset/moon.jpg')
    let geo = new THREE.SphereGeometry(2 ,50,50)
    let mat = new THREE.MeshPhongMaterial({
        color: 0xa3a3a3,
        map: texture
        ,shininess: 3
        
    })

    let mesh = new THREE.Mesh(geo,mat)
    mesh.castShadow =true
    return mesh
}

let createRot = ()=>{
    let geo = new THREE.SphereGeometry(20 ,50,50)
    let mat = new THREE.MeshStandardMaterial({
        color: 0xa3a3a3,
        visible: false
    })

    let mesh = new THREE.Mesh(geo,mat)
    
    return mesh
}

let createXwing = ()=>{
    let loader = new GLTFLoader()
    loader.load(
        './asset/3d/xwing.gltf',
        function(gltf){
            xwing = gltf.scene
            xwing.position.set(-380,30,-200)
            xwing.scale.set(2,2,2)
            xwing.rotation.y = Math.PI/2
            scene.add(xwing)
        }
    )
    let spotLight = new THREE.SpotLight(0xffffff)
    spotLight.position.set(300,30,-200)
    //spotLight.rotation.x=-Math.PI/2
    spotLight.lookAt(-380,30,-200)
    spotLight.intensity = 2
    spotLight.distance = 200
    spotLight.angle = 0.50
    //scene.add(spotLight)
    let spotLightHepler = new THREE.SpotLightHelper(spotLight)
    //scene.add(spotLightHepler)    
}

let createTIE = ()=>{
    let loader = new GLTFLoader()
    loader.load(
        './asset/3d/scene.gltf',
        function(gltf){
            tie = gltf.scene
            tie.position.set(10,0,-20)
            tie.scale.set(1,1,1)
            scene.add(tie)
            xwing.add(tie)
        }
    )
}

let createTIE2 = ()=>{
    let loader = new GLTFLoader()
    loader.load(
        './asset/3d/scene.gltf',
        function(gltf){
            tie = gltf.scene
            tie.position.set(-10,0,-20)
            tie.scale.set(1,1,1)
            scene.add(tie)
            xwing.add(tie)
        }
    )

}




let createSun = () => {
    let spotLight = new THREE.SpotLight(0xffffff)
    spotLight.position.set(10,5,31)

    spotLight.intensity = 1
    spotLight.distance = 150
    spotLight.angle = 1.5

    let spotLightHepler = new THREE.SpotLightHelper(spotLight)
    spotLight.castShadow = true

    spotLight.castShadow = true
    scene.add(spotLight)
    //scene.add(spotLightHepler)

}

let createDirectionaltLight = () => {
    let light = new THREE.DirectionalLight(0xFFFFFF)
    light.intensity = 1
    light.position.y = 5
    light.lookAt(0, 0, 0)
    
    light.castShadow = true
    return light
}

let createAmbientLight = () => {
    let light = new THREE.AmbientLight(0xFFFFFF)
    light.intensity = 0.5
    return light
}

let createBg = ()=>{
    let loaader = new THREE.TextureLoader()
    let texture = loaader.load('./asset/bg.jpg')
    scene.background = texture;
  }



let init = () => {
    scene = new THREE.Scene()

    createBg()

    let fov = 75
    let w = window.innerWidth
    let h = window.innerHeight
    let aspect =  w/h
    
    camera = new THREE.PerspectiveCamera(fov, aspect) 

    
    camera.position.set(0, 20, 50)
    
    camera.lookAt(0, 0, 0)
    
    renderer = new THREE.WebGLRenderer()
    renderer.antialias = true
    renderer.setSize(w, h)
    renderer.setClearColor(0xff0000)
    renderer.shadowMap.enabled = true
    //control = new OrbitControls(camera,renderer.domElement)

    document.body.appendChild(renderer.domElement)
    earth=createEarth()
    

    rot1=createRot()
    moon = createMoon()
    moon.position.set(30,5,0)
    rot1.add(moon)
    createSun()

    directionalLight = createDirectionaltLight()
    ambientLight = createAmbientLight()

    createXwing()
    createTIE()
    createTIE2()
    
    

    
    let objects = [
        earth,
        rot1,
        directionalLight,
        ambientLight
    ]

    objects.forEach(object => {
        scene.add(object)
    });
}


let x = 0

let animation = () => {

    requestAnimationFrame(animation)
    earth.rotation.y +=0.003
    moon.rotation.y +=0.015
    rot1.rotation.y +=0.005
    if(x<500) x++;
    
    else if(x=>500){
        if(x<700){
            xwing.position.x +=5
        }
        if (x>1000){
            x=0
            xwing.position.x = -380
        }
       
        x++
        
    }console.log(x)
    renderer.render(scene, camera)
    
}




window.onload = () => {
    init()
    animation()
}

window.onresize = () => {
    let newW = innerWidth
    let newH = innerHeight

    renderer.setSize(newW, newH)

    camera.aspect = newW/newH
    camera.updateProjectionMatrix()
}


