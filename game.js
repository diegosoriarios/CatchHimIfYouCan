const sceneEl = document.querySelector("a-scene")
const image = document.getElementById("image")
const rightEl = document.querySelector("#right-model")
const leftEl = document.querySelector("#left-model")
const fourOfour = document.querySelector("#fourOfour")
const scoreEl = document.querySelector("#score-element")
const cam = document.querySelector("a-camera")
const tree = document.querySelector("#tree")

const SPEED = .2

let score = 0
function displayScore() {
    scoreEl.setAttribute('value', `Score: ${score}`)
}

let picture = ""
let enemyItsOnPicture = false

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

createNPC(rightEl)
createNPC(leftEl, false)

const enemy = fourOfour.cloneNode()
enemy.setAttribute("position", {x: 0, y: 1.5, z: -5})
sceneEl.appendChild(enemy)

//displayScore()

for (let i = 0; i < 5; i++) createTrees()

function loop() {
    sceneEl.childNodes.forEach(npc => {
        if (npc.id === "right-model"){
            npc.object3D.position.x += parseFloat(npc.getAttribute("speed"))
            if (npc.object3D.position.x > 20) removeNpc(npc, rightEl)
        } else if (npc.id === "left-model"){
            npc.object3D.position.x -= parseFloat(npc.getAttribute("speed"))
            if (npc.object3D.position.x < -20) removeNpc(npc, leftEl, false)
        }
    })
    requestAnimationFrame(loop)
}

function removeNpc(npc, node, direction = true) {
    sceneEl.removeChild(npc)
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
        var pos = new THREE.Vector3(enemy.getAttribute("position").x, enemy.getAttribute("position").y, enemy.getAttribute("position").z);
        if (frustum.containsPoint(pos)) {
            enemyItsOnPicture = true
        } else {
            enemyItsOnPicture = false
        }
     }
    }
})

console.clear()
loop()

window.onkeydown = event => {
    if (event.keyCode === 32) {
        console.log(enemyItsOnPicture)
        picture = document.querySelector('a-scene').components.screenshot.getCanvas('perspective').toDataURL('image/png');
        image.setAttribute('src', picture)
        let clone = document.querySelector("#pictureImage").cloneNode()
        document.querySelector("#frame").removeChild(document.querySelector("#pictureImage"))
        document.querySelector("#frame").appendChild(clone)
    }
}