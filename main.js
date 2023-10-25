import './style.css'

import * as THREE from 'three'
// 1. 引入轨道控制器构造函数
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import * as data from 'dat.gui'

// 引入性能监视器的stats组件
import Stats from 'three/examples/jsm/libs/stats.module.js'

// 引入3d转换器与渲染器
import { CSS3DObject, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js'

let scene, camera, renderer, controls, cube, sphere, plane, labelRenderer
// 创建性能监视器全局变量
let stats

//创建分组
let group

// 初始化加载场景和摄像机
function init() {
  //创建场景
  scene = new THREE.Scene()

  // 创建摄像机
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

  camera.position.z = 100

  // 初始化灯光
  const light = new THREE.AmbientLight(0xff8800)
  scene.add(light)

  // 初始化盒子背景
  const urls = ['posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg'].map(v => `./public/image/park/${v}`)
  scene.background = new THREE.CubeTextureLoader().load(urls)

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({
    //开启抗锯齿
    antialias: true
  })

  //设置画布大小
  renderer.setSize(window.innerWidth, window.innerHeight)

  //将画布添加到DOM
  document.body.append(renderer.domElement)
}

function createGroup() {
  group = new THREE.Group()
}

//创建立方体
function createCube() {
  //创建图形 宽高深为1单位
  const gemetry = new THREE.BoxGeometry(1, 1, 1)
  // 3d环境图片
  const imgUrl = ['posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg']

  // 五颜六色立方体
  const colList = ['red', 'blue', 'purple', 'green', 'yellow', 'white']

  // 纹理加载器
  const textureLoader = new THREE.TextureLoader()

  // 设置当前纹理加载器公共的基础路径
  textureLoader.setPath('image/park/')

  // 创建材质
  // const material = new THREE.MeshBasicMaterial({ color: 0xffff00 })

  const material = imgUrl.map(item => {
    const texture = textureLoader.load(item)
    // three.js 颜色通道为 rgb 颜色（为了防止图片太浅）
    texture.colorSpace = THREE.SRGBColorSpace
    return new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide
    })
  })

  // const material = colList.map((item) => {
  //   return new THREE.MeshBasicMaterial({ color: item })
  // })

  //创建网格物体对象，传入图形和材质
  cube = new THREE.Mesh(gemetry, material)

  // 2. 调整立方体沿着 z 轴做 -1 缩小（镜面翻转）
  cube.scale.set(1, 1, -1)

  //把物体加入到场景中
  scene.add(cube)
}

//创建多个立方体
// function createCube() {
//   const cubeList = []

//   for (let i = 0; i < 10; i++) {
//     const obj = {
//       color: `rgb(${Math.floor(Math.random() * (255 - 0 + 1) + 0)},${Math.floor(Math.random() * (255 - 0 + 1) + 0)},${Math.floor(Math.random() * (255 - 0 + 1) + 0)})`,
//       w: Math.floor(Math.random() * (3 - 1 + 1) + 1),
//       h: Math.floor(Math.random() * (3 - 1 + 1) + 1),
//       d: Math.floor(Math.random() * (3 - 1 + 1) + 1),
//       x: Math.floor(Math.random() * (5 - -5 + 1) + -5),
//       y: Math.floor(Math.random() * (5 - -5 + 1) + -5),
//       z: Math.floor(Math.random() * (5 - -5 + 1) + -5),
//     }
//     cubeList.push(obj)
//   }

//   cubeList.map(item => {
//     const gemetry = new THREE.BoxGeometry(item.w, item.h, item.d)
//     const material = new THREE.MeshBasicMaterial({ color: item.color })
//     cube = new THREE.Mesh(gemetry, material)

//     cube.position.set(item.x, item.y, item.z)
//     cube.name = 'cn'
//     group.add(cube)

//   })
//   scene.add(group)
// }

//创建形状缓冲几何体
// function createCube() {
//   const x = 0
//   const y = 0
//   const heartShape = new THREE.Shape()

//   heartShape.moveTo(x + 5, y + 5)
//   heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y)
//   heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7)
//   heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19)
//   heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7)
//   heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y)
//   heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5)
//   const gemetry = new THREE.ShapeGeometry(heartShape)
//   //PointsMaterial 点材质  LineBasicMaterial 线材质
//   const material = new THREE.LineBasicMaterial({ color: 0xff0000, size: 0.2, side: THREE.DoubleSide })
//   // Points 点对象 Line 线对象
//   cube = new THREE.Line(gemetry, material)
//   scene.add(cube)
// }

// 创建一条连续的线
function createLine() {
  const lineList = []
  lineList.push(new THREE.Vector3(-1, 0, 0))
  lineList.push(new THREE.Vector3(0, 1, 0))
  lineList.push(new THREE.Vector3(1, 1, 1))
  lineList.push(new THREE.Vector3(2, 2, 2))

  //创建图形
  const gemetry = new THREE.BufferGeometry().setFromPoints(lineList)

  //创建材质
  const material = new THREE.LineBasicMaterial({
    color: 0xff6600
  })

  const line = new THREE.LineSegments(gemetry, material)

  scene.add(line)
}

//创建球形缓冲几何体贴图
function createGeometry() {
  //创建图形
  const geometry = new THREE.SphereGeometry(15, 32, 16);
  // 创建纹理加载器
  const texture = new THREE.TextureLoader().load('image/earth/earth.png')
  //创建材质
  const material = new THREE.MeshBasicMaterial({ map: texture });
  sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);
}

//创建平面网格物体加载视频
function createPlane() {
  const geomery = new THREE.PlaneGeometry(1, 1, 3)

  // 创建视频标签
  const video = document.createElement('video')
  video.src = 'video/002.mp4'
  // 设置视频默认静音
  video.muted = true
  // 监听资源加载完毕进行播放
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })

  // 创建视频纹理加载器
  const texture = new THREE.VideoTexture(video)

  //创建材质
  const material = new THREE.MeshBasicMaterial({
    map: texture
  })

  // 创建物体
  plane = new THREE.Mesh(geomery, material)
  plane.name = '好东西'
  scene.add(plane)

}

// 将原生DOM转换并渲染到3d场景
function create3dDom() {
  const tag = document.createElement('span')
  tag.innerHTML = '我是文字'
  tag.style.color = 'white'

  //将2d转换为3d
  const tag3d = new CSS3DObject(tag)
  tag3d.scale.set(1 / 16, 1 / 16, 1 / 16)
  scene.add(tag3d)

  //通过3d渲染器渲染到浏览器
  labelRenderer = new CSS3DRenderer()
  labelRenderer.setSize(window.innerWidth, window.innerHeight)
  labelRenderer.domElement.style.pointerEvents = 'none'
  labelRenderer.domElement.style.position = 'fixed'
  labelRenderer.domElement.style.left = 0
  labelRenderer.domElement.style.top = 0
  document.body.appendChild(labelRenderer.domElement)
}

// 3d物体点击事件
function bindClick() {
  window.addEventListener('click', (event) => {
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // 通过摄像机和鼠标位置更新射线
    raycaster.setFromCamera(pointer, camera);

    // 计算物体和射线的焦点
    const intersects = raycaster.intersectObjects(scene.children);
    const e = intersects.find(item => item.object.name === '好东西')
    if (e) alert('好东西')

  })
}

//创建轨道控制器
function createControis() {
  controls = new OrbitControls(camera, renderer.domElement)
  //开启阻尼效果
  controls.enableDamping = true
}

//在循环渲染中更新场景
function renderLoop() {
  //循环渲染(根据当前计算机浏览器刷新帧率默认60次/秒，不断调用此函数渲染最新画面状态)
  //好处是：当前页面切换到后台，暂停递归
  requestAnimationFrame(renderLoop)

  //更新(手动js代码更新摄像机信息，必须调用轨道控制器update方法)
  controls.update()
  stats.update()
  renderer.render(scene, camera)
  labelRenderer.render(scene, camera)
}

//创建坐标轴
function createHelper() {
  const axesHelper = new THREE.AxesHelper(10)

  //将坐标轴添加到场景中
  scene.add(axesHelper)
}

//适配方法
function rendResize() {
  //监听画面变化，更新渲染画面
  window.addEventListener('resize', () => {
    // console.log('画面变化了，宽高适配执行');
    //更新摄像头
    camera.aspect = window.innerWidth / window.innerHeight
    // 更新摄像机的投影矩阵
    camera.updateProjectionMatrix()
    // 更新渲染器
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
  })

}

// 移动物体
function moveCube() {
  sphere.position.x = 10
  sphere.position.y = 10
  sphere.position.z = 10
  plane.position.x = 3
  // 设置物体的缩放
  sphere.scale.z = 1
  // cube.rotation.set(Math.PI / 4, 0, 0, 'XYZ') // 旋转45度 XYZ表示的是，先旋转那个轴
}

//创建gui工具
function setGui() {
  const gui = new data.GUI()

  gui.add(document, 'title')
  gui.add(cube, 'visible')
  gui.add(controls, 'reset')
  // 添加分组
  const group = gui.addFolder("位移")
  group.add(cube.position, 'x', 0, 10, 1)
  group.add(cube.position, 'y', 0, 10, 1)
  group.add(cube.position, 'z', 0, 10, 1)

  // 添加颜色选择
  // const colorObj = {
  //   'col': `#${cube.material.color.getHexString()}`
  // }

  // gui.addColor(colorObj, 'col').onChange((val) => {
  //   cube.material.color = new THREE.Color(val)
  // })

  gui.add({ type: "1" }, 'type', { '方案一': '1', '方案二': '2' }).onChange((val) => {
    switch (val) {
      case '1':
        cube.position.x = 10
        break;
      case '2':
        cube.position.x = 5
        break
    }
  })
}

//性能监视器
function createStats() {
  stats = new Stats()
  stats.setMode(0)
  stats.domElement.position = 'fixed'
  stats.domElement.style.left = '0'
  stats.domElement.style.top = '0'
  document.body.appendChild(stats.domElement)
}

//删除立方体
function removeCube() {
  window.addEventListener('dblclick', () => {
    group.children.map(item => {
      item.geometry.dispose()
      item.material.dispose()
    })
    scene.remove(group)
    // const arr = scene.children.filter(item => item.name === 'cn')
    // // console.log(arr);
    // const c = arr[0]

    // if (c) {
    //   if (arr.length === 1) return
    //   // 删除图形
    //   c.geometry.dispose()
    //   // 删除材质
    //   c.material.dispose()
    //   // 从场景中移出物体
    //   scene.remove(c)
    // }
  })
}

init()
createGroup()
createCube()
createPlane()
bindClick()
create3dDom()
createLine()
createControis()
createGeometry()
moveCube()
createHelper()
createStats()
renderLoop()
setGui()
removeCube()
rendResize()