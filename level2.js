const sceneEl = document.querySelector("a-scene")
const image = document.getElementById("image")
const rightEl = document.querySelector("#right-model")
const leftEl = document.querySelector("#left-model")
const fourOfour = document.querySelector("#fourOfour")
const scoreEl = document.querySelector("#score-element")
const cam = document.querySelector("a-camera")
const tree = document.querySelector("#tree")
const buildings = document.querySelector("#buildings")

const SPEED = .2

let score = 0
function displayScore() {
    scoreEl.setAttribute('value', `Score: ${score}`)
}

let picture = ""
let enemyItsOnPicture = false
let enemy = null

function randomPosition(right) {
    return {
        x: right ? -20 : 20,
        y: 0,
        z: right ? -20 : 20
    }
}

function createNPC(node, right = true) {
    let clone = node.cloneNode()
    clone.setAttribute("speed", SPEED)
    clone.setAttribute("position", randomPosition(right))
    clone.setAttribute("scale", "5, 1, 2")
    sceneEl.appendChild(clone)
}

function createTrees() {
    const clone = tree.cloneNode(true)
    const xPos = Math.floor(Math.random() * 30) - 15;
    const zPos = Math.floor(Math.random() * 30) - 15;
    clone.setAttribute("position", `${xPos} 0 ${zPos}`)
    const rotation = {
        x: Math.random() * 4,
        y: Math.random() * 4,
        z: Math.random() * 4,
    }
    clone.setAttribute("rotation", `${rotation.x} ${rotation.y} ${rotation.z}`)
    sceneEl.appendChild(clone)
}

//createNPC(rightEl)
//createNPC(leftEl, false)

//displayScore()

//for (let i = 0; i < 5; i++) createTrees()



const positions = [
  "-5, 0, -17",
  "5, 0, -17",
  "-5, 3, -17",
  "5, 3, -17",
  "-5, 6, -17",
  "5, 6, -17",
  "-5, 9, -17",
  "5, 9, -17",
  "-5, 13, -17",
  "5, 13, -17",
  "-5, 0, 17",
  "5, 0, 17",
  "-5, 3, 17",
  "5, 3, 17",
  "-5, 6, 17",
  "5, 6, 17",
  "-5, 9, 17",
  "5, 9, 17",
  "-5, 13, 17",
  "5, 13, 17",
  "-17, 0, -5",
  "-17, 0, -5",
  "-17, 3, -5",
  "-17, 3, -5",
  "-17, 6, -5",
  "-17, 6, -5",
  "-17, 9, -5",
  "-17, 9, -5",
  "-17, 13, -5",
  "-17, 13, -5",
  "17, 0, -5",
  "17, 0, -5",
  "17, 3, -5",
  "17, 3, -5",
  "17, 6, -5",
  "17, 6, -5",
  "17, 9, -5",
  "17, 9, -5",
  "17, 13, -5",
  "17, 13, -5"
]

enemy = fourOfour.cloneNode()
let index = Math.floor(Math.random() * positions.length)
enemy.setAttribute("position", positions[index])
enemy.setAttribute("scale", "1, 2, 1")
sceneEl.appendChild(enemy)

function loop() {
    sceneEl.childNodes.forEach(npc => {
        if (npc.id === "right-model"){
            npc.object3D.position.x += parseFloat(npc.getAttribute("speed"))
            if (npc.object3D.position.x > 20) removeNpc(npc, rightEl)
        } else if (npc.id === "left-model"){
            npc.object3D.position.x -= parseFloat(npc.getAttribute("speed"))
            if (npc.object3D.position.x < -20) removeNpc(npc, leftEl, false)
        } else if (npc.id === "fourOfour") {
            enemy = npc
            npc.object3D.position.x -= parseFloat(npc.getAttribute("speed"))
            if (npc.object3D.position.x < -20) removeNpc(npc, leftEl, false)
        }
    })
    requestAnimationFrame(loop)
}

function removeNpc(npc, node, direction = true) {
    sceneEl.removeChild(npc)
    if (Math.random() < .2) node = fourOfour.cloneNode()
    createNPC(node, direction)
}

//console.clear()
AFRAME.registerComponent('check-enemy', {
    tick: function() {
     if (this.el.sceneEl.camera) {
        var cam = this.el.sceneEl.camera
        var frustum = new THREE.Frustum();
        frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse));  
  
        // Your 3d point to check
        if (enemy) {
            var pos = new THREE.Vector3(enemy.getAttribute("position").x, enemy.getAttribute("position").y, enemy.getAttribute("position").z);
            if (frustum.containsPoint(pos)) {
                enemyItsOnPicture = true
            } else {
                enemyItsOnPicture = false
            }
        }
     }
    }
})

sceneEl.appendChild(document.importNode(buildings.content, true))
//loop()

window.onkeydown = event => {
    if (event.keyCode === 32) {
        picture = document.querySelector('a-scene').components.screenshot.getCanvas('perspective').toDataURL('image/png');
        image.setAttribute('src', picture)
        let clone = document.querySelector("#pictureImage").cloneNode()
        document.querySelector("#frame").removeChild(document.querySelector("#pictureImage"))
        document.querySelector("#frame").appendChild(clone)
    }
}