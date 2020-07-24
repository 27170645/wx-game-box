import * as THREE from '../libs/threejs/three.min.js';
import GameParams from '../config/params.js';

let instance;

export default class Scene {

  constructor(renderer) {
    if (instance) {
      return instance;
    }
    instance = this;

    // 渲染器
    this.renderer = renderer;
    
    // 游戏场景 
    this.scene = new THREE.Scene();


    //添加灯光
    this.pointLight = new THREE.PointLight(0x8A8A8A);
    this.ambientLight = new THREE.AmbientLight(0xFFFFFF);
    this.scene.add(this.pointLight);
    this.scene.add(this.ambientLight);

    // 使用透视相机绘制3D
    this.camera = new THREE.PerspectiveCamera(75, GameParams.cameraAspect, 0.1, 10000);
    this.camera.position.z = 50;
    this.camera.position.y = 30;
  }

  add(entity) {
    this.scene.add(entity);
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }
}