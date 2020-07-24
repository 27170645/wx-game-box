import Scene from './scene.js';
import * as OIMO from '../libs/threejs/oimo.min.js'
import * as THREE from '../libs/threejs/three.min.js';
import LoadingUI from '../ui/load.js';

// 网格数量
const length = 500;

let instance;

export default class Test extends Scene {

  constructor(renderer) {
    super(renderer);

    // Oimo物理世界
    this.world = new OIMO.World({ worldscale: 1 })

    this.isLoad = false;
    this.loadingUI = new LoadingUI(renderer);
    // 初始化
    this.boxs = []
    this.boxBodys = []
    this.models = []
    this.modelBodys = []
    this.loadingUI.show();
    this.createScene().then(() => {
      // 绘制完物体后加载
       this.isLoad = true;
      this.loadingUI.hide();
    });
  }

  createScene() {
    // 清除Oimo物理世界
    this.world.clear();

    return new Promise((resolve, reject) => {
      
      new THREE.JSONLoader().load('models/sphere.json',
        (geometry, materials) => {

          geometry.center();
          // 加载材质贴图
          let metal_texture = new THREE.TextureLoader().load("images/metal.jpg")
          // 地面
          let ground_material = new THREE.MeshBasicMaterial({ map: metal_texture })
          this.ground = new THREE.Mesh(new THREE.BoxGeometry(30, 1, 30), ground_material)
          this.ground.receiveShadow = true
          this.ground.castShadow = true
          this.add(this.ground);

          // 物理地面
          this.groundBody = this.world.add({
            size: [30, 1, 30],
            pos: [0, 0, 0],
            name: 'groundBody'
          });

          let wood_texture = new THREE.TextureLoader().load("images/wood.jpg")
          let cloth_texture = new THREE.TextureLoader().load("images/cloth.jpg")

          // 盒子材质
          let box_meterial = new THREE.MeshLambertMaterial({ map: wood_texture })
          // 模型材质
          let model_meterial = new THREE.MeshLambertMaterial({ map: cloth_texture })

          // 载入模型后再创建盒子
          // 创建盒子和模型
          for (let i = 0; i < length; i++) {
            // 创建盒子
            let box = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), box_meterial)
            box.position.y = 50 + i * 2
            box.receiveShadow = true
            box.castShadow = true
            this.scene.add(box)
            this.boxs.push(box)

            // 创建物理盒子
            let boxBody = this.world.add({
              type: 'box',
              move: true,
              size: [3, 3, 3],
              pos: [0, 50 + i * 2, 0],
              name: `boxBody${i}`
            })
            this.boxBodys.push(boxBody)

            // 创建模型
            let model = new THREE.Mesh(geometry, model_meterial)
            model.scale.set(2, 2, 2)
            model.position.y = 50 + i * 2
            model.receiveShadow = true
            model.castShadow = true
            this.scene.add(model)
            this.models.push(model)

            // 创建物理模型
            let modelBody = this.world.add({
              type: 'sphere',
              move: true,
              size: [2],
              pos: [0, 50 + i * 2, 0],
              name: `modelBody${i}`
            })
            this.modelBodys.push(modelBody)
          }

          resolve()
        },
        // 进度条 小游戏内无效
        xhr => {
          console.log(`${(xhr.loaded / xhr.total * 100)}% 已载入`)
        },
        // 载入出错
        error => {
          console.log(`载入出错: ${error}`)
          reject(error)
        }
      )
    })
  }
  
  update() {
    if (this.isLoad) {
      // 更新物理世界
      this.world.step()
      // 复制物理世界的位置到Threejs的网格上
      for (let i = 0; i < length; i++) {
        this.boxs[i].position.copy(this.boxBodys[i].getPosition())
        this.boxs[i].quaternion.copy(this.boxBodys[i].getQuaternion())
        this.models[i].position.copy(this.modelBodys[i].getPosition())
        this.models[i].quaternion.copy(this.modelBodys[i].getQuaternion())
      }
      // 碰撞检测
      if (this.world.checkContact('boxBody', 'modelBody')) {
        console.log('contact...')
      }
    }
  }

  render() {
    this.loadingUI.render();
    this.renderer.render(this.scene, this.camera)
  }

}