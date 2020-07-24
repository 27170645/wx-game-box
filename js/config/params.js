
let winWidth = window.innerWidth;
let winHeight = window.innerHeight;

export default {
  width: winWidth,
  height: winHeight,
  cameraAspect: winWidth / winHeight,
  ratio: window.devicePixelRatio
};