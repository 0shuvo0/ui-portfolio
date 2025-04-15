import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';


class ThreeScene{
    constructor(options){
        this.environmentMap_path = options.environmentMap
        this.background_path = options.background
        this.background_intensity = options.background_intensity || 1
        this.model_path = options.model
        this.model_size = options.model_size || 1
        this.font_path = options.font
        this.font_size = options.font_size || 1
        this.text = options.text
        this.text_color = options.text_color || 0xffffff

        this.canvas = options.canvas

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5

        const renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0)
        this.renderer = renderer

        const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(0, 2, 3);
        this.scene.add(directionalLight);
    }

    loadAssets(ops){
        let toLoad = ['model', 'background', 'environmentMap', 'font']
        const totalItem = toLoad.length

        ops.onProgress && ops.onProgress(0)

        function markLoaded(item){
            toLoad = toLoad.filter( i => i !== item)

            const progress = (totalItem - toLoad.length) * (100 / totalItem)
            ops.onProgress && ops.onProgress(progress)

            if(toLoad.length === 0) ops.onComplete && ops.onComplete()
        }

        //Load 3d model
        const objLoader = new OBJLoader()
        objLoader.load(this.model_path, obj => {
            const transmissionMaterial = new THREE.MeshPhysicalMaterial({
                thickness: 5,
                roughness: .1,
                transmission: 1,
                ior: 5,
                attenuationDistance: .5,
                side: THREE.DoubleSide,
                transparent: true
            });

            const objeMesh = obj.children[0]
            objeMesh.material = transmissionMaterial
            
            const scale = Math.min(Math.max(window.innerWidth / 75000, .01), .015)
            objeMesh.scale.set(scale, scale, scale)
            
            this.scene.add(objeMesh)

            this.model = objeMesh

            markLoaded("model")
        })

        //Load Background
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(this.background_path, texture => {
            this.scene.background = texture;
            this.scene.backgroundIntensity = .1

            markLoaded("background")
        })

        //Load Environtent
        const rgbeLoader = new RGBELoader();
        rgbeLoader.load(this.environmentMap_path, texture => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            this.scene.environment = texture;

            markLoaded("environmentMap")
        })

        //Load Font
        const fontLoader = new FontLoader();
        fontLoader.load(this.font_path, font => {
            const _text = this.text
            const _fontSize = this.font_size 

            const textGeometry = new TextGeometry(_text, {
                font: font,
                size: _fontSize,
                depth: 0
            })

            const textMaterial = new THREE.MeshBasicMaterial({ color: this.text_color })
            const textMesh = new THREE.Mesh(textGeometry, textMaterial)
            textMesh.position.set(0, 0, -1)
            const textScale = window.innerWidth / 1000
            textMesh.scale.set(textScale, textScale, textScale)

            textGeometry.center()

            this.scene.add(textMesh)
            this.textMesh = textMesh

            markLoaded("font")
        });
    }

    run(){
        this.renderer.render(this.scene, this.camera)
    }

    
    handleResize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        if(this.textMesh){
            const textScale = Math.min(window.innerWidth / 1000, 2)
            this.textMesh.scale.set(textScale, textScale, textScale)
        }

        if(this.model){
            const scale = Math.min(Math.max(window.innerWidth / 75000, .01), .015)
            this.model.scale.set(scale, scale, scale)
        }

        this.run()
    }
}

export default ThreeScene