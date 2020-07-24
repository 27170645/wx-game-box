import * as THREE from './libs/threejs/three.min.js';
import GameParams from 'config/params.js';
import Scene from 'scenes/test.js';
import UI from './ui/ui.js';

let ctx = canvas.getContext('webgl');


export default class Main {

  constructor() {
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(GameParams.width, GameParams.height);     // 窗口大小
    this.renderer.setClearColor(0xFFFFFF, 1);     // 清除颜色
    this.renderer.setPixelRatio(GameParams.ratio);     // 设置像素
    this.renderer.autoClear = false;     // 关闭自动清除
    this.scene = new Scene(this.renderer);    // 场景

    // let canvas2d = document.createElement('canvas');
    // let v = draw(canvas2d, {
    //   str: "Hello",
    //   font: '30px Arial',
    //   bgColor: 'rgba(204, 204, 204, 0.5)'
    // });
    // v.needsUpdate = true
    // v.minFilter = THREE.LinearFilter
    // let material = new THREE.SpriteMaterial({ map: v, transparent: true })
    // this.ui = new UI(this.renderer);
    // var sprite = new THREE.Sprite(material);
    // sprite.scale.set(200, 200, 100)
    // this.ui.add(sprite);

   

    this.start();     // 游戏开始
  }

  start(){
    this.loop();      // 开始循环游戏
  }

  update() {
    this.scene.update();
  }

  render() {
    this.scene.render();
  }

  loop() {
    this.renderer.clear();  // 关闭了渲染器的自动清除 这里需要手动清除
    this.update();    // 生命周期，UPDATE -> RENDER
    this.render();
    window.requestAnimationFrame(this.loop.bind(this), canvas); // 请求动画帧
  }
}
