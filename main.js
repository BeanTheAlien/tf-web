/*
--- Game Modes ---
Casual (AI) => Use AI controlled mercs (1 AI per class, player takes class slot).
Casual (Online) => Use an online build (unlimited per class). Server player limit 24.
Mann vs Machine (AI) => Use a 6-player team of AI controlled mercs (1 AI for certain classes, player takes class slot).
Mann vs Machine (Online) => Use an online build of MvM, 6-player team (unlimited per team).
*/

window.addEventListener(
    "error",
    (e) => alert(`${e.message}, ${e.lineno}`)
);

class TF {}

TF.Merc = class {
    constructor(s) {
        this.name = s.name;
        this.mdl = s.mdl;
        this.primary = new s.kit.primary;
        this.secondary = new s.kit.secondary;
        this.melee = new s.kit.melee;
        this.x = s.x;
        this.y = s.y;
        this.z = s.z;
        this.velocity = { x: 0, y: 0, z: 0 };
        this.gravity = 0.05;
        this.gravSpeed = 0;
        this.jumpSpeed = s.jumpSpeed;
        this.moveSpeed = s.moveSpeed;
        this.grounded = true;
        this.equipped = this.primary;
    }
    // update() {
    //     this.gravSpeed += this.gravity;
    //     this.y += this.gravSpeed;
    // }
    // jump() {
    //     this.velocity.y = this.gravSpeed + this.jumpSpeed;
    // }
}
TF.Merc.Scout = class extends TF.Merc {
    constructor(s) {
        super({
            "name": "Scout",
            "mdl": null,
            "kit": { "primary": null, "secondary": null, "melee": null },
            "x": s.x,
            "y": s.y,
            "z": s.z,
            "jumpSpeed": 0.5,
            "moveSpeed": 2
        });
    }
}
TF.Merc.Soldier = class extends TF.Merc {
    constructor(s) {
        super({
            "name": "Soldier",
            "mdl": null,
            "kit": { "primary": TF.Weapon.RocketLauncher, "secondary": TF.Weapon.Shotgun, "melee": TF.Weapon.Shovel },
            "x": s.x,
            "y": s.y,
            "z": s.z,
            "jumpSpeed": 0.5,
            "moveSpeed": 0.6
        });
    }
}
TF.Merc.Pyro = class extends TF.Merc {
    constructor(s) {
        super({
            "name": "Pyro",
            "mdl": null,
            "kit": { "primary": null, "secondary": null, "melee": null },
            "x": s.x,
            "y": s.y,
            "z": s.z,
            "jumpSpeed": 0.5,
            "moveSpeed": 0.75
        });
    }
}
TF.Merc.Demoman = class extends TF.Merc {
    constructor(s) {
        super({
            "name": "Demoman",
            "mdl": null,
            "kit": { "primary": null, "secondary": null, "melee": null },
            "x": s.x,
            "y": s.y,
            "z": s.z,
            "jumpSpeed": 0.5,
            "moveSpeed": 0.6
        });
    }
}
TF.Merc.Heavy = class extends TF.Merc {
    constructor(s) {
        super({
            "name": "Heavy",
            "mdl": null,
            "kit": { "primary": null, "secondary": null, "melee": null },
            "x": s.x,
            "y": s.y,
            "z": s.z,
            "jumpSpeed": 0.5,
            "moveSpeed": 0.35
        });
    }
}
TF.Merc.Engineer = class extends TF.Merc {
    constructor(s) {
        super({
            "name": "",
            "mdl": null,
            "kit": { "primary": null, "secondary": null, "melee": null },
            "x": s.x,
            "y": s.y,
            "z": s.z,
            "jumpSpeed": 0.5,
            "moveSpeed": 0.75
        });
    }
}
TF.Merc.Medic = class extends TF.Merc {
    constructor(s) {
        super({
            "name": "",
            "mdl": null,
            "kit": { "primary": null, "secondary": null, "melee": null },
            "x": s.x,
            "y": s.y,
            "z": s.z,
            "jumpSpeed": 0.5,
            "moveSpeed": 0.75
        });
    }
}
TF.Merc.Sniper = class extends TF.Merc {
    constructor(s) {
        super({
            "name": "",
            "mdl": null,
            "kit": { "primary": null, "secondary": null, "melee": null },
            "x": s.x,
            "y": s.y,
            "z": s.z,
            "jumpSpeed": 0.5,
            "moveSpeed": 0.75
        });
    }
}
TF.Merc.Spy = class extends TF.Merc {
    constructor(s) {
        super({
            "name": "",
            "mdl": null,
            "kit": { "primary": null, "secondary": null, "melee": null },
            "x": s.x,
            "y": s.y,
            "z": s.z,
            "jumpSpeed": 0.5,
            "moveSpeed": 0.75
        });
    }
}

TF.Weapon = class {
    constructor(s) {
        this.name = s.name;
        this.mdl = s.mdl;
        this.atkdelay = s.atkdelay;
        this.attack = s.attack;
        this.attackalt = s.attackalt;
        this.attackfailsound = s.attackfailsound;
    }
    atk1() {
        this.attack();
    }
    atk2() {
        this.attackalt();
    }
}
TF.Weapon.Scattergun = class extends TF.Weapon {
    constructor() {
        super({
            "name": "",
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {},
            "attackalt": () => {},
            "attackfailsound": null
        });
        this.shells = 6;
        this.mag = 6;
        this.ammo = 6;
    }
}
TF.Weapon.RocketLauncher = class extends TF.Weapon {
    constructor() {
        super({
            "name": "Rocket Launcher",
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {
                if(this.shells > 0) {
                    const forward = camera.getDirection(BABYLON.Axis.Z);
                    // Offset spawn point in front of the player
                    const spawnPos = player.mesh.position.add(forward.scale(1.5));
                    projectiles.push(new TF.Projectile.Rocket({ "x": spawnPos.x, "y": spawnPos.y, "z": spawnPos.z, "xrot": camera.rotation.x, "yrot": camera.rotation.y, "zrot": camera.rotation.z }));
                } else {
                    //SoundEmitter.emit({});
                }
            },
            "attackalt": () => {},
            "attackfailsound": null
        });
        this.shells = 4;
        this.mag = 4;
        this.ammo = 20;
    }
}
TF.Weapon.Flamethrower = class extends TF.Weapon {
    constructor() {
        super({
            "name": "",
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {},
            "attackalt": () => {},
            "attackfailsound": null
        });
        this.ammo = 200;
    }
}
TF.Weapon.GrenadeLauncher = class extends TF.Weapon {
    constructor() {
        super({
            "name": "",
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {},
            "attackalt": () => {},
            "attackfailsound": null
        });
        this.shells = 6;
        this.mag = 6;
        this.ammo = 20;
    }
}
TF.Weapon.Minigun = class extends TF.Weapon {
    constructor() {
        super({
            "name": "",
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {},
            "attackalt": () => {},
            "attackfailsound": null
        });
        this.ammo = 200;
    }
}
TF.Weapon.Shotgun = class extends TF.Weapon {
    constructor() {
        super({
            "name": "",
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {},
            "attackalt": () => {},
            "attackfailsound": null
        });
        this.shells = 6;
        this.mag = 6;
        this.ammo = 16;
    }
}
TF.Weapon.SyringeGun = class extends TF.Weapon {
    constructor() {
        super({
            "name": "",
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {},
            "attackalt": () => {},
            "attackfailsound": null
        });
        this.shells = 40;
        this.mag = 40;
        this.ammo = 40;
    }
}
TF.Weapon.SniperRifle = class extends TF.Weapon {
    constructor() {
        super({
            "name": "",
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {},
            "attackalt": () => {},
            "attackfailsound": null
        });
        this.ammo = 25;
    }
}
TF.Weapon.Revolver = class extends TF.Weapon {
    constructor() {
        super({
            "name": "",
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {},
            "attackalt": () => {},
            "attackfailsound": null
        });
        this.shells = 6;
        this.mag = 6;
        this.ammo = 24;
    }
}
TF.Weapon.Shovel = class extends TF.Weapon {
    constructor() {
        super({
            "name": "Shovel",
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {},
            "attackalt": () => {},
            "attackfailsound": null
        });
    }
}

TF.Env = class {
    constructor(s) {
        this.name = s.name;
        this.onsummon = s.onsummon;
        this.onexpire = s.onexpire;
        this.ontouched = s.ontouched;
        this.lifespan = s.lifespan;
        this.mdl = s.mdl;
        this.texture = s.texture;
        this.x = s.x;
        this.y = s.y;
        this.z = s.z;
    }
}
TF.Env.Explosion = class extends TF.Env {
    constructor(s) {
        super({
            "name": "Explosion",
            "onsummon": () => {},
            "onexpire": () => {},
            "ontouched": () => {},
            "lifespan": 0.5,
            "mdl": null,
            "texture": null,
            "x": s.x,
            "y": s.y,
            "z": s.z
        });
    }
}
TF.Env.TriggerHurt = class extends TF.Env {}
TF.Env.Fire = class extends TF.Env {}

TF.Projectile = class {
    constructor(s) {
        this.name = s.name;
        this.collide = s.collide;
        this.update = s.update;
        this.reflectable = s.reflectable;
        this.mdl = s.mdl;
        this.texture = s.texture;
        this.x = s.x;
        this.y = s.y;
        this.z = s.z;
        this.xrot = s.xrot;
        this.yrot = s.yrot;
        this.zrot = s.zrot;
        this.sizex = s.sizex;
        this.sizey = s.sizey;
        this.sizez = s.sizez;
        this.speed = s.speed;
        this.lifespan = s.lifespan;
        this.mesh = BABYLON.MeshBuilder.CreateCapsule("rocket", { height: 2, radius: 0.3 }, scene);
        this.mesh.material = new BABYLON.StandardMaterial("rocketMat", scene);
        this.mesh.material.diffuseColor = new BABYLON.Color3(1, 0, 0); // red
        //this.mesh = BABYLON.MeshBuilder.CreateCapsule("projectile", { height: 1 }, scene);
        this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
            this.mesh,
            BABYLON.PhysicsImpostor.BoxImpostor,
            { mass: 1, restitution: 0.1 },
            scene
        );
    }
    tick() {
        this.update();
    }
}
TF.Projectile.Rocket = class extends TF.Projectile {
    constructor(s) {
        super({
            "name": "Rocket",
            "collide": (loc) => {
                new TF.Env.Explosion(loc[0], loc[1], loc[2]);
            },
            "update": () => {
                const forward = this.mesh.getDirection(BABYLON.Axis.Z);
                this.mesh.position.addInPlace(forward.scale(this.speed));
                for (let target of scene.meshes) {
                    if (this.mesh.intersectsMesh(target, true)) {
                        const col = this.mesh.position.clone();
                        this.collide([col.x, col.y, col.z]);
                        this.mesh.dispose();
                        break;
                    }
                }
            },
            "reflectable": true,
            "mdl": null,
            "texture": null,
            "x": s.x,
            "y": s.y,
            "z": s.z,
            "xrot": s.xrot,
            "yrot": s.yrot,
            "zrot": s.zrot,
            "sizex": 5,
            "sizey": 5,
            "sizez": 5,
            "speed": 1,
            "lifespan": Infinity
        });
        this.mesh.position = new BABYLON.Vector3(this.x, this.y, this.z);
        this.mesh.rotation = new BABYLON.Vector3(this.xrot, this.yrot, this.zrot);
    }
}
TF.Projectile.Fire = class extends TF.Projectile {
    constructor(s) {
        super({
            "name": "Fire",
            "collide": () => {},
            "update": () => {},
            "reflectable": false,
            "mdl": null,
            "texture": null,
            "x": s.x,
            "y": s.y,
            "z": s.z,
            "xrot": s.xrot,
            "yrot": s.yrot,
            "zrot": s.zrot,
            "sizex": 1,
            "sizey": 1,
            "sizez": 1,
            "speed": 1.5,
            "lifespan": 0.25
        });
    }
}
TF.Projectile.Airblast = class extends TF.Projectile {
    constructor(s) {
        super({
            "name": "Airblast",
            "collide": () => {},
            "update": () => {},
            "reflectable": false,
            "mdl": null,
            "texture": null,
            "x": s.x,
            "y": s.y,
            "z": s.z,
            "xrot": s.xrot,
            "yrot": s.yrot,
            "zrot": s.zrot,
            "sizex": 5,
            "sizey": 5,
            "sizez": 2,
            "speed": 10,
            "lifespan": 0.1
        });
    }
}
/*
super({
    "name": "",
    "collide": () => {},
    "reflectable": true,
    "mdl": null,
    "texture": null,
    "x": s.x,
    "y": s.y,
    "z": s.z,
    "sizex": 0,
    "sizey": 0,
    "sizez": 0,
    "speed": 0,
    "lifespan": 0
});
*/

TF.ScreenComponent = class {}
TF.ScreenComponent.Text = class extends TF.ScreenComponent {}
TF.ScreenComponent.Rect = class extends TF.ScreenComponent {}

TF.Error = class extends Error {
    constructor(s) {
        this.name = s.name;
        this.message = s.message;
    }
}

TF.Colour = class {
    constructor(s) {
        this.name = s.name;
        this.hex = s.hex;
    }
}

TF.Sound = class {}

TF.Prop = class {}

TF.Anim = class {}

class RaycastEmitter {
    static emit(s) {
        const x = s.x;
        const y = s.y;
        const z = s.z;
        const radius = s.radius;
        const ignore = s.ignore;
        const channel = s.channel;
        const visibility = s.visibility;
        const colour = s.colour;
        const hitcount = s.hitcount;
        let hits = [];
    }
}
class ParticleEmitter {
    static emit(s) {
        const texture = s.texture;
        const lifespan = s.lifespan;
        const channel = s.channel;
        const x = s.x;
        const y = s.y;
        const z = s.z;
        const minsize = s.minsize;
        const maxsize = s.maxsize;
        const minpower = s.minpower;
        const maxpower = s.maxpower;
        const updspeed = s.updspeed;
        const emitrate = s.emitrate;
    }
}
class SoundEmitter {
    static emit(s) {
        const sound = s.sound;
        const volume = s.volume;
        const channel = s.channel;
        if(s.emitstyle == "comp") {
            const comp = s.comp;
            const bone = s.bone;
            const offsetx = s.boneoffsetx ?? 0;
            const offsety = s.boneoffsety ?? 0;
            const offsetz = s.boneoffsetz ?? 0;
        } else if(s.emitstyle == "spatial") {
            const x = s.x;
            const y = s.y;
            const z = s.z;
        }
    }
}

class Camera {}

const canvas = document.getElementById('gameCanvas');

function game() {
    camera.position.copyFrom(player.mesh.position);
    projectiles.forEach(p => p.tick());
    scene.render();
}

// Create Babylon.js Scene
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), new BABYLON.CannonJSPlugin());

// First-Person Camera
const camera = new BABYLON.UniversalCamera("FPCamera", new BABYLON.Vector3(0, 1.5, 0), scene);
camera.attachControl(canvas, true);
camera.angularSensibility = 4000;  // Slow down camera rotation

// Create entities
const player = new TF.Merc.Soldier({ "x": 0, "y": 0, "z": 0 });
// Fire when left mouse button is clicked
function Shoot() { player.equipped.atk1(); }
document.addEventListener("mousedown", Shoot);

player.mesh = BABYLON.MeshBuilder.CreateCapsule("player", { height: 2, radius: 0.5 }, scene);
player.mesh.position = new BABYLON.Vector3(0, 5, 0);
player.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
    player.mesh,
    BABYLON.PhysicsImpostor.BoxImpostor,
    { mass: 1, restitution: 0.1 },
    scene
);
const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 50, height: 50 }, scene);
ground.position.y = 0;
ground.physicsImpostor = new BABYLON.PhysicsImpostor(
    ground,
    BABYLON.PhysicsImpostor.BoxImpostor,
    { mass: 0, restitution: 0.1 },
    scene
);
player.isGrounded = false;

player.mesh.physicsImpostor.registerOnPhysicsCollide(ground.physicsImpostor, function() {
    player.isGrounded = true; // Allow jumping when on the ground
});

var projectiles = [];

// Lock Pointer
function Lock() {
    if(document.pointerLockElement != canvas) {
        canvas.requestPointerLock();
    }
}
document.addEventListener("click", Lock);

function Unlock() {
    document.exitPointerLock();
}

document.addEventListener("keydown", (event) => {
    if(event.key == "Escape") {
        document.exitPointerLock();
    }
});

// Light
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

// Player Controls (WASD movement)
var keys = {};
function KeyDown(event) { keys[event.key] = true; }
function KeyUp(event) { keys[event.key] = false; }
document.addEventListener("keydown", KeyDown);
document.addEventListener("keyup", KeyUp);

function movePlayer() {
    const speed = 0.1;
    let forward = camera.getDirection(BABYLON.Axis.Z).scale(speed);
    let right = camera.getDirection(BABYLON.Axis.X).scale(speed);
    if(keys["w"]) {
        player.mesh.position.addInPlace(forward);
    }
    if(keys["s"]) {
        player.mesh.position.subtractInPlace(forward);
    }
    if(keys["a"]) {
        player.mesh.position.subtractInPlace(right);
    }
    if(keys["d"]) {
        player.mesh.position.addInPlace(right);
    }
    if(keys[" "] && player.isGrounded) {
        player.mesh.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 5, 0), player.mesh.getAbsolutePosition());
        player.isGrounded = false; // Prevent mid-air jumps
    }
    requestAnimationFrame(movePlayer);
}

movePlayer();


engine.runRenderLoop(game);

// Resize Handler
window.addEventListener('resize', () => engine.resize());
