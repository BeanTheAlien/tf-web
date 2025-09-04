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
    static BotNames = ["Bot"];
    static MercClasses;

    constructor(s) {
        this.name = s.name;
        this.mdl = s.mdl;
        this.primary = new s.loadout.primary;
        this.secondary = new s.loadout.secondary;
        this.melee = new s.loadout.melee;
        this.health = s.health;
        this.maxhealth = this.health;
        this.overhealmax = 0;
        for(const { key, value } of Object.entries(s.misc)) this[key] = value;
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
        this.mesh = BABYLON.MeshBuilder.CreateCapsule("player", { height: 2, radius: 0.5 }, scene);
        this.mesh.position = new BABYLON.Vector3(0, 5, 0);
        this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
            this.mesh,
            BABYLON.PhysicsImpostor.BoxImpostor,
            { mass: 1, restitution: 0.1 },
            scene
        );
        //this.mesh.physicsImpostor.setAngularFactor(new BABYLON.Vector3(0, 1, 0));
        // aggregate wraps physics + mesh
        // const agg = new BABYLON.PhysicsAggregate(this.mesh, BABYLON.PhysicsShapeType.CAPSULE, { mass: 1, restitution: 0.1 }, scene);
        // lock tilt
        // agg.body.setAngularFactor(new BABYLON.Vector3(0, 1, 0));
        this.mesh.physicsImpostor.registerOnPhysicsCollide(ground.physicsImpostor, () => {
            this.isGrounded = true; // Allow jumping when on the ground
        });
        this.isGrounded = false;
    }
    hurt(d) {
        this.health -= d;
        if(this.health <= 0) this.kill();
    }
    kill() {
        this.mesh.dispose();
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
    static defaultLoadout;
    constructor(s) {
        super({
            "name": "Scout",
            "mdl": null,
            "loadout": { ...TF.Merc.Scout.defaultLoadout },
            "health": 125,
            "x": s.x,
            "y": s.y,
            "z": s.z,
            "jumpSpeed": 0.5,
            "moveSpeed": 2,
            "misc": {}
        });
    }
}
TF.Merc.Soldier = class extends TF.Merc {
    static defaultLoadout;
    constructor(s) {
        super({
            "name": "Soldier",
            "mdl": null,
            "loadout": { ...TF.Merc.Soldier.defaultLoadout },
            "health": 200,
            "x": s.x,
            "y": s.y,
            "z": s.z,
            "jumpSpeed": 0.5,
            "moveSpeed": 0.6,
            "misc": {}
        });
    }
}
TF.Merc.Pyro = class extends TF.Merc {
    static defaultLoadout;
    constructor(s) {
        super({
            "name": "Pyro",
            "mdl": null,
            "loadout": { ...TF.Merc.Pyro.defaultLoadout },
            "health": 175,
            "x": s.x,
            "y": s.y,
            "z": s.z,
            "jumpSpeed": 0.5,
            "moveSpeed": 0.75,
            "misc": {}
        });
    }
}
TF.Merc.Demoman = class extends TF.Merc {
    static defaultLoadout;
    constructor(s) {
        super({
            "name": "Demoman",
            "mdl": null,
            "loadout": { ...TF.Merc.Demoman.defaultLoadout },
            "health": 175,
            "x": s.x,
            "y": s.y,
            "z": s.z,
            "jumpSpeed": 0.5,
            "moveSpeed": 0.6,
            "misc": {
                "deployedsbombs": 0
            }
        });
    }
}
TF.Merc.Heavy = class extends TF.Merc {
    static defaultLoadout;
    constructor(s) {
        super({
            "name": "Heavy",
            "mdl": null,
            "loadout": { ...TF.Merc.Heavy.defaultLoadout },
            "health": 300,
            "x": s.x,
            "y": s.y,
            "z": s.z,
            "jumpSpeed": 0.5,
            "moveSpeed": 0.35,
            "misc": {}
        });
    }
}
TF.Merc.Engineer = class extends TF.Merc {
    static defaultLoadout;
    constructor(s) {
        super({
            "name": "",
            "mdl": null,
            "loadout": { ...TF.Merc.Engineer.defaultLoadout },
            "health": 125,
            "x": s.x,
            "y": s.y,
            "z": s.z,
            "jumpSpeed": 0.5,
            "moveSpeed": 0.75,
            "misc": {
                "metal": 200,
                "metalmax": 200,
                "buildings": {}
            }
        });
    }
}
TF.Merc.Medic = class extends TF.Merc {
    static defaultLoadout;
    constructor(s) {
        super({
            "name": "",
            "mdl": null,
            "loadout": { ...TF.Merc.Medic.defaultLoadout },
            "health": 150,
            "x": s.x,
            "y": s.y,
            "z": s.z,
            "jumpSpeed": 0.5,
            "moveSpeed": 0.75,
            "misc": {
                "übercharge": 0
            }
        });
    }
}
TF.Merc.Sniper = class extends TF.Merc {
    static defaultLoadout;
    constructor(s) {
        super({
            "name": "",
            "mdl": null,
            "loadout": { ...TF.Merc.Sniper.defaultLoadout },
            "health": 125,
            "x": s.x,
            "y": s.y,
            "z": s.z,
            "jumpSpeed": 0.5,
            "moveSpeed": 0.75,
            "misc": {}
        });
    }
}
TF.Merc.Spy = class extends TF.Merc {
    static defaultLoadout;
    constructor(s) {
        super({
            "name": "",
            "mdl": null,
            "loadout": { ...TF.Merc.Spy.defaultLoadout },
            "health": 125,
            "x": s.x,
            "y": s.y,
            "z": s.z,
            "jumpSpeed": 0.5,
            "moveSpeed": 0.75,
            "misc": {}
        });
    }
}
TF.Merc.AI = class {
    constructor(s) {
        this.name = s.name;
        this.mdl = s.mdl;
        this.primary = new s.loadout.primary;
        this.secondary = new s.loadout.secondary;
        this.melee = new s.loadout.melee;
        this.health = s.health;
        this.x = s.x;
        this.y = s.y;
        this.z = s.z;
        this.velocity = { x: 0, y: 0, z: 0 };
        this.gravity = 0.05;
        this.gravSpeed = 0;
        this.jumpSpeed = s.jumpSpeed;
        this.moveSpeed = s.moveSpeed;
        this.update = s.update;
        this.grounded = true;
        this.equipped = this.primary;
        this.mesh = BABYLON.MeshBuilder.CreateCapsule("player", { height: 2, radius: 0.5 }, scene);
        this.mesh.position = new BABYLON.Vector3(0, 5, 0);
        this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
            this.mesh,
            BABYLON.PhysicsImpostor.BoxImpostor,
            { mass: 1, restitution: 0.1 },
            scene
        );
        //this.mesh.physicsImpostor.setAngularFactor(new BABYLON.Vector3(0, 1, 0));
        // aggregate wraps physics + mesh
        // const agg = new BABYLON.PhysicsAggregate(this.mesh, BABYLON.PhysicsShapeType.CAPSULE, { mass: 1, restitution: 0.1 }, scene);
        // lock tilt
        // agg.body.setAngularFactor(new BABYLON.Vector3(0, 1, 0));
        this.mesh.physicsImpostor.registerOnPhysicsCollide(ground.physicsImpostor, () => {
            this.isGrounded = true; // Allow jumping when on the ground
        });
        this.isGrounded = false;
        this.components = {};
        this.components.vision = new TF.AI.Vision(this);
        this.components.hearing = new TF.AI.Hearing();
        this.goal = null;
    }
    tick() {
        // this.components.vision.update();
        this.update();
        /*
        exec steps:
        1. Determine role (based on class)
        2. Determine variables (metal, übercharge, ammo, usw)
        3. Determine goals (based on gamemode)
        4. Determine team hints (possible spies, known sentry gun locations, usw)
        5. Determine if enemies are seen (if so, get locations)
        6. Determine next steps (capture, attack, usw)
        */
    }
    hurt(d) {
        this.health -= d;
        if(this.health <= 0) this.kill();
    }
    kill() {
        this.mesh.dispose();
    }
    // update() {
    //     this.gravSpeed += this.gravity;
    //     this.y += this.gravSpeed;
    // }
    // jump() {
    //     this.velocity.y = this.gravSpeed + this.jumpSpeed;
    // }
}
TF.Merc.AI.Scout = class extends TF.Merc.AI {
    constructor(s) {
        super({
            "name": "Scout",
            "mdl": null,
            "loadout": { ...TF.Merc.Scout.defaultLoadout },
            "health": 125,
            "x": s.x,
            "y": s.y,
            "z": s.z,
            "jumpSpeed": 0.5,
            "moveSpeed": 2,
            "update": () => {}
        });
    }
}
TF.Merc.AI.Soldier = class extends TF.Merc.AI {
    constructor(s) {
        super({
            "name": "Soldier",
            "mdl": null,
            "loadout": { ...TF.Merc.Soldier.defaultLoadout },
            "health": 200,
            "x": s.x,
            "y": s.y,
            "z": s.z,
            "jumpSpeed": 0.5,
            "moveSpeed": 0.6,
            "update": () => {
                const sees = this.components.vision;
            }
        });
    }
}
TF.Merc.AI.Pyro = class extends TF.Merc.AI {
    constructor(s) {
        super({
            "name": "Pyro",
            "mdl": null,
            "loadout": { ...TF.Merc.Pyro.defaultLoadout },
            "health": 175,
            "x": s.x,
            "y": s.y,
            "z": s.z,
            "jumpSpeed": 0.5,
            "moveSpeed": 0.75,
            "update": () => {}
        });
    }
}
TF.Merc.AI.Demoman = class extends TF.Merc.AI {
    constructor(s) {
        super({
            "name": "Demoman",
            "mdl": null,
            "loadout": { ...TF.Merc.Demoman.defaultLoadout },
            "health": 175,
            "x": s.x,
            "y": s.y,
            "z": s.z,
            "jumpSpeed": 0.5,
            "moveSpeed": 0.6,
            "update": () => {}
        });
    }
}
TF.Merc.AI.Heavy = class extends TF.Merc.AI {
    constructor(s) {
        super({
            "name": "Heavy",
            "mdl": null,
            "loadout": { ...TF.Merc.Heavy.defaultLoadout },
            "health": 300,
            "x": s.x,
            "y": s.y,
            "z": s.z,
            "jumpSpeed": 0.5,
            "moveSpeed": 0.35,
            "update": () => {}
        });
    }
}
TF.Merc.AI.Engineer = class extends TF.Merc.AI {
    constructor(s) {
        super({
            "name": "",
            "mdl": null,
            "loadout": { ...TF.Merc.Engineer.defaultLoadout },
            "health": 125,
            "x": s.x,
            "y": s.y,
            "z": s.z,
            "jumpSpeed": 0.5,
            "moveSpeed": 0.75,
            "update": () => {}
        });
    }
}
TF.Merc.AI.Medic = class extends TF.Merc.AI {
    constructor(s) {
        super({
            "name": "",
            "mdl": null,
            "loadout": { ...TF.Merc.Medic.defaultLoadout },
            "health": 150,
            "x": s.x,
            "y": s.y,
            "z": s.z,
            "jumpSpeed": 0.5,
            "moveSpeed": 0.75,
            "update": () => {}
        });
    }
}
TF.Merc.AI.Sniper = class extends TF.Merc.AI {
    constructor(s) {
        super({
            "name": "",
            "mdl": null,
            "loadout": { ...TF.Merc.Sniper.defaultLoadout },
            "health": 125,
            "x": s.x,
            "y": s.y,
            "z": s.z,
            "jumpSpeed": 0.5,
            "moveSpeed": 0.75,
            "update": () => {}
        });
    }
}
TF.Merc.AI.Spy = class extends TF.Merc.AI {
    constructor(s) {
        super({
            "name": "",
            "mdl": null,
            "loadout": { ...TF.Merc.Spy.defaultLoadout },
            "health": 125,
            "x": s.x,
            "y": s.y,
            "z": s.z,
            "jumpSpeed": 0.5,
            "moveSpeed": 0.75,
            "update": () => {}
        });
    }
}

TF.Weapon = class {
    static weapons;
    constructor(s) {
        this.name = s.name;
        this.mdl = s.mdl;
        this.atkdelay = s.atkdelay;
        this.attack = s.attack;
        this.attackalt = s.attackalt;
        this.onweaponout = s.onweaponout;
        this.attackfailsound = s.attackfailsound;
        this.equipby = s.equipby;
        this.invicon = s.invicon;
        for(const { key, value } of Object.keys(s.misc)) this[key] = value;
        /*
        grade (unique, strange, usw)
        comps (strangetracker, usw)
        */
    }
    atk1() {
        this.attack();
    }
    atk2() {
        this.attackalt();
    }
}
TF.Weapon.Scattergun = class extends TF.Weapon {
    static equipby = [{ "name": TF.Merc.Scout, "slot": "primary" }];
    static invicon = "missingtexture.png";
    static name = "Scattergun";
    static stats = "";
    constructor() {
        super({
            "name": TF.Weapon.Scattergun.name,
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {},
            "attackalt": () => {},
            "onweaponout": () => {},
            "attackfailsound": null,
            "equipby": TF.Weapon.Scattergun.equipby,
            "invicon": TF.Weapon.Scattergun.invicon,
            "misc": {}
        });
        this.shells = 6;
        this.mag = 6;
        this.ammo = 6;
    }
}
TF.Weapon.RocketLauncher = class extends TF.Weapon {
    static equipby = [{ "name": TF.Merc.Soldier, "slot": "primary" }];
    static invicon = "missingtexture.png";
    static name = "Rocket Launcher";
    static stats = "";
    constructor() {
        super({
            "name": TF.Weapon.RocketLauncher.name,
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {
                if(this.shells > 0) {
                    const forward = camera.getDirection(BABYLON.Axis.Z);
                    // Offset spawn point in front of the player
                    const spawnPos = player.mesh.position.add(forward.scale(1.5));
                    console.log("Player:", player.mesh.position);
                    console.log("Forward:", forward);
                    console.log("Spawn:", spawnPos);
                    projectiles.push(new TF.Projectile.Rocket({ "x": spawnPos.x, "y": spawnPos.y, "z": spawnPos.z, "xrot": camera.rotation.x, "yrot": camera.rotation.y, "zrot": camera.rotation.z }));
                } else {
                    const emitter = new SoundEmitter({
                        "sound": this.attackfailsound,
                        "volume": 100,
                        "channel": TF.Channel.Sound.Weapon,
                        "emitstyle": "comp",
                        "comp": null,
                        "bone": nnull,
                        "offsetx": 0,
                        "offsety": 0,
                        "offsetz": 0
                    });
                    emitter.emit();
                }
            },
            "attackalt": () => {},
            "onweaponout": () => {},
            "attackfailsound": null,
            "equipby": TF.Weapon.RocketLauncher.equipby,
            "invicon": TF.Weapon.RocketLauncher.invicon,
            "misc": {}
        });
        this.shells = 4;
        this.mag = 4;
        this.ammo = 20;
    }
}
TF.Weapon.Flamethrower = class extends TF.Weapon {
    static equipby = [{ "name": TF.Merc.Pyro, "slot": "primary" }];
    static invicon = "missingtexture.png";
    static name = "Flamethrower";
    static stats = "";
    constructor() {
        super({
            "name": TF.Weapon.Flamethrower.name,
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {
                if(this.ammo > 0) {
                    const forward = camera.getDirection(BABYLON.Axis.Z);
                    // Offset spawn point in front of the player
                    const spawnPos = player.mesh.position.add(forward.scale(1.5));
                    console.log("Player:", player.mesh.position);
                    console.log("Forward:", forward);
                    console.log("Spawn:", spawnPos);
                    projectiles.push(new TF.Projectile.Fire({ "x": spawnPos.x, "y": spawnPos.y, "z": spawnPos.z, "xrot": camera.rotation.x, "yrot": camera.rotation.y, "zrot": camera.rotation.z }));
                } else {
                    const emitter = new SoundEmitter({
                        "sound": this.attackfailsound,
                        "volume": 100,
                        "channel": TF.Channel.Sound.Weapon,
                        "emitstyle": "comp",
                        "comp": null,
                        "bone": null,
                        "offsetx": 0,
                        "offsety": 0,
                        "offsetz": 0
                    });
                }
            },
            "attackalt": () => {
                const forward = camera.getDirection(BABYLON.Axis.Z);
                // Offset spawn point in front of the player
                const spawnPos = player.mesh.position.add(forward.scale(1.5));
                console.log("Player:", player.mesh.position);
                console.log("Forward:", forward);
                console.log("Spawn:", spawnPos);
                projectiles.push(new TF.Projectile.Airblast({ "x": spawnPos.x, "y": spawnPos.y, "z": spawnPos.z, "xrot": camera.rotation.x, "yrot": camera.rotation.y, "zrot": camera.rotation.z }));
            },
            "onweaponout": () => {},
            "attackfailsound": null,
            "equipby": TF.Weapon.Flamethrower.equipby,
            "invicon": TF.Weapon.Flamethrower.invicon,
            "misc": {}
        });
        this.ammo = 200;
    }
}
TF.Weapon.GrenadeLauncher = class extends TF.Weapon {
    static equipby = [{ "name": TF.Merc.Demoman, "slot": "primary" }];
    static invicon = "missingtexture.png";
    static name = "Grenade Launcher";
    static stats = "";
    constructor() {
        super({
            "name": TF.Weapon.GrenadeLauncher.name,
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {},
            "attackalt": () => {},
            "onweaponout": () => {},
            "attackfailsound": null,
            "equipby": TF.Weapon.GrenadeLauncher.equipby,
            "invicon": TF.Weapon.GrenadeLauncher.invicon,
            "misc": {}
        });
        this.shells = 6;
        this.mag = 6;
        this.ammo = 20;
    }
}
TF.Weapon.StickyBombLauncher = class extends TF.Weapon {
    static equipby = [{ "name": TF.Merc.Demoman, "slot": "secondary" }];
    static invicon = "missingtexture.png";
    static name = "Sticky Bomb Launcher";
    static stats = "";
    constructor() {
        super({
            "name": TF.Weapon.StickyBombLauncher.name,
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {},
            "attackalt": () => {},
            "onweaponout": () => {},
            "attackfailsound": null,
            "equipby": TF.Weapon.StickyBombLauncher.equipby,
            "invicon": TF.Weapon.StickyBombLauncher.invicon,
            "misc": {
                "stickies": 0,
                "maxstickies": 8
            }
        });
        this.shells = 8;
        this.mag = 8;
        this.ammo = 20;
    }
}
TF.Weapon.Minigun = class extends TF.Weapon {
    static equipby = [{ "name": TF.Merc.Heavy, "slot": "primary" }];
    static invicon = "missingtexture.png";
    static name = "Minigun";
    static stats = "";
    constructor() {
        super({
            "name": TF.Weapon.Minigun.name,
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {},
            "attackalt": () => {},
            "onweaponout": () => {},
            "attackfailsound": null,
            "equipby": TF.Weapon.Minigun.equipby,
            "invicon": TF.Weapon.Minigun.invicon,
            "misc": {}
        });
        this.ammo = 200;
    }
}
TF.Weapon.Shotgun = class extends TF.Weapon {
    static equipby = [{ "name": TF.Merc.Engineer, "slot": "primary" }, { "name": TF.Merc.Soldier, "slot": "secondary" }, { "name": TF.Merc.Pyro, "slot": "secondary" }, { "name": TF.Merc.Heavy, "slot": "secondary" }];
    static invicon = "missingtexture.png";
    static name = "Shotgun";
    static stats = "";
    constructor() {
        super({
            "name": TF.Weapon.Shotgun.name,
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {},
            "attackalt": () => {},
            "onweaponout": () => {},
            "attackfailsound": null,
            "equipby": TF.Weapon.Shotgun.equipby,
            "invicon": TF.Weapon.Shotgun.invicon,
            "misc": {}
        });
        this.shells = 6;
        this.mag = 6;
        this.ammo = 16;
    }
}
TF.Weapon.SyringeGun = class extends TF.Weapon {
    static equipby = [{ "name": TF.Merc.Medic, "slot": "primary" }];
    static invicon = "missingtexture.png";
    static name = "Syringe Gun";
    static stats = "";
    constructor() {
        super({
            "name": TF.Weapon.SyringeGun.name,
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {},
            "attackalt": () => {},
            "onweaponout": () => {},
            "attackfailsound": null,
            "equipby": TF.Weapon.SyringeGun.equipby,
            "invicon": TF.Weapon.SyringeGun.invicon,
            "misc": {}
        });
        this.shells = 40;
        this.mag = 40;
        this.ammo = 40;
    }
}
TF.Weapon.SniperRifle = class extends TF.Weapon {
    static equipby = [{ "name": TF.Merc.Sniper, "slot": "primary" }];
    static invicon = "missingtexture.png";
    static name = "Sniper Rifle";
    static stats = "";
    constructor() {
        super({
            "name": TF.Weapon.SniperRifle.name,
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {},
            "attackalt": () => {},
            "onweaponout": () => {},
            "attackfailsound": null,
            "equipby": TF.Weapon.SniperRifle.equipby,
            "invicon": TF.Weapon.SniperRifle.invicon,
            "misc": {
                "charge": 0,
                "maxcharge": 10
            }
        });
        this.ammo = 25;
    }
}
TF.Weapon.Revolver = class extends TF.Weapon {
    static equipby = [{ "name": TF.Merc.Spy, "slot": "primary" }];
    static invicon = "missingtexture.png";
    static name = "Revolver";
    static stats = "";
    constructor() {
        super({
            "name": TF.Weapon.Revolver.name,
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {},
            "attackalt": () => {},
            "onweaponout": () => {},
            "attackfailsound": null,
            "equipby": TF.Weapon.Revolver.equipby,
            "invicon": TF.Weapon.Revolver.invicon,
            "misc": {}
        });
        this.shells = 6;
        this.mag = 6;
        this.ammo = 24;
    }
}
TF.Weapon.Shovel = class extends TF.Weapon {
    static equipby = [{ "name": TF.Merc.Soldier, "slot": "melee" }];
    static invicon = "missingtexture.png";
    static name = "Shovel";
    static stats = "";
    constructor() {
        super({
            "name": TF.Weapon.Shovel.name,
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {},
            "attackalt": () => {},
            "onweaponout": () => {},
            "attackfailsound": null,
            "equipby": TF.Weapon.Shovel.equipby,
            "invicon": TF.Weapon.Shovel.invicon,
            "misc": {}
        });
    }
}
TF.Weapon.Bottle = class extends TF.Weapon {
    static equipby = [{ "name": TF.Merc.Demoman, "slot": "melee" }];
    static invicon = "missingtexture.png";
    static name = "Bottle";
    static stats = "";
    constructor() {
        super({
            "name": TF.Weapon.Bottle.name,
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {},
            "attackalt": () => {},
            "onweaponout": () => {},
            "attackfailsound": null,
            "equipby": TF.Weapon.Bottle.equipby,
            "invicon": TF.Weapon.Bottle.invicon,
            "misc": {}
        });
    }
}
TF.Weapon.Bat = class extends TF.Weapon {
    static equipby = [{ "name": TF.Merc.Scout, "slot": "melee" }];
    static invicon = "missingtexture.png";
    static name = "Bat";
    static stats = "";
    constructor() {
        super({
            "name": TF.Weapon.Bat.name,
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {},
            "attackalt": () => {},
            "onweaponout": () => {},
            "attackfailsound": null,
            "equipby": TF.Weapon.Bat.equipby,
            "invicon": TF.Weapon.Bat.invicon,
            "misc": {}
        });
    }
}
TF.Weapon.Pistol = class extends TF.Weapon {
    static equipby = [ { "name": TF.Merc.Scout, "slot": "secondary" }, { "name": TF.Merc.Engineer, "slot": "secondary" } ];
    static invicon = "missingtexture.png";
    static name = "Pistol";
    static stats = "";
    constructor() {
        super({
            "name": TF.Weapon.Pistol.name,
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {},
            "attackalt": () => {},
            "onweaponout": () => {},
            "attackfailsound": null,
            "equipby": TF.Weapon.Pistol.equipby,
            "invicon": TF.Weapon.Pistol.invicon,
            "misc": {}
        });
        this.shells = 12;
        this.mag = 12;
        this.ammo = 36;
    }
}
TF.Weapon.FireAxe = class extends TF.Weapon {
    static equipby = [{ "name": TF.Merc.Pyro, "slot": "melee" }];
    static invicon = "missingtexture.png";
    static name = "Fire Axe";
    static stats = "";
    constructor() {
        super({
            "name": TF.Weapon.FireAxe.name,
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {},
            "attackalt": () => {},
            "onweaponout": () => {},
            "attackfailsound": null,
            "equipby": TF.Weapon.FireAxe.equipby,
            "invicon": TF.Weapon.FireAxe.invicon,
            "misc": {}
        });
    }
}
TF.Weapon.Fists = class extends TF.Weapon {
    static equipby = [{ "name": TF.Merc.Heavy, "slot": "melee" }];
    static invicon = "missingtexture.png";
    static name = "Fists";
    static stats = "";
    constructor() {
        super({
            "name": TF.Weapon.Fists.name,
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {},
            "attackalt": () => {},
            "onweaponout": () => {},
            "attackfailsound": null,
            "equipby": TF.Weapon.Fists.equipby,
            "invicon": TF.Weapon.Fists.invicon,
            "misc": {}
        });
    }
}
TF.Weapon.Wrench = class extends TF.Weapon {
    static equipby = [{ "name": TF.Merc.Engineer, "slot": "melee" }];
    static invicon = "missingtexture.png";
    static name = "Wrench";
    static stats = "";
    constructor() {
        super({
            "name": TF.Weapon.Wrench.name,
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {}, // if building, if has metal, hit
            "attackalt": () => {},
            "onweaponout": () => {},
            "attackfailsound": null,
            "equipby": TF.Weapon.Wrench.equipby,
            "invicon": TF.Weapon.Wrench.invicon,
            "misc": {}
        });
    }
}
TF.Weapon.Bonesaw = class extends TF.Weapon {
    static equipby = [{ "name": TF.Merc.Medic, "slot": "melee" }];
    static invicon = "missingtexture.png";
    static name = "Bonesaw";
    static stats = "";
    constructor() {
        super({
            "name": TF.Weapon.Bonesaw.name,
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {},
            "attackalt": () => {},
            "onweaponout": () => {},
            "attackfailsound": null,
            "equipby": TF.Weapon.Bonesaw.equipby,
            "invicon": TF.Weapon.Bonesaw.invicon,
            "misc": {}
        });
    }
}
TF.Weapon.Kukri = class extends TF.Weapon {
    static equipby = [{ "name": TF.Merc.Sniper, "slot": "melee" }];
    static invicon = "missingtexture.png";
    static name = "Kukri";
    static stats = "";
    constructor() {
        super({
            "name": TF.Weapon.Kukri.name,
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {},
            "attackalt": () => {},
            "onweaponout": () => {},
            "attackfailsound": null,
            "equipby": TF.Weapon.Kukri.equipby,
            "invicon": TF.Weapon.Kukri.invicon,
            "misc": {}
        });
    }
}
TF.Weapon.Knife = class extends TF.Weapon {
    static equipby = [{ "name": TF.Merc.Spy, "slot": "melee" }];
    static invicon = "missingtexture.png";
    static name = "Knife";
    static stats = "";
    constructor() {
        super({
            "name": TF.Weapon.Knife.name,
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {}, // if hit enemy, get enemy facing direction, if in range(---) => kill, else => dmg
            "attackalt": () => {},
            "onweaponout": () => {},
            "attackfailsound": null,
            "equipby": TF.Weapon.Knife.equipby,
            "invicon": TF.Weapon.Knife.invicon,
            "misc": {}
        });
    }
}
TF.Weapon.Medigun = class extends TF.Weapon {
    static equipby = [{ "name": TF.Merc.Medic, "slot": "secondary" }];
    static invicon = "missingtexture.png";
    static name = "Medigun";
    static stats = "";
    constructor() {
        super({
            "name": TF.Weapon.Medigun.name,
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {},
            "attackalt": () => {},
            "onweaponout": () => {},
            "attackfailsound": null,
            "equipby": TF.Weapon.Medigun.equipby,
            "invicon": TF.Weapon.Medigun.invicon,
            "misc": {}
        });
    }
}
TF.Weapon.SubmachineGun = class extends TF.Weapon {
    static equipby = [{ "name": TF.Merc.Sniper, "slot": "secondary" }];
    static invicon = "missingtexture.png";
    static name = "Submachine Gun";
    static stats = "";
    constructor() {
        super({
            "name": TF.Weapon.SubmachineGun.name,
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {},
            "attackalt": () => {},
            "onweaponout": () => {},
            "attackfailsound": null,
            "equipby": TF.Weapon.SubmachineGun.equipby,
            "invicon": TF.Weapon.SubmachineGun.invicon,
            "misc": {}
        });
    }
}
TF.Weapon.Sapper = class extends TF.Weapon {
    static equipby = [{ "name": TF.Merc.Spy, "slot": "secondary" }];
    static invicon = "missingtexture.png";
    static name = "Sapper";
    static stats = "";
    constructor() {
        super({
            "name": TF.Weapon.Sapper.name,
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {}, // cast forward => is engineer building?
            "attackalt": () => {},
            "onweaponout": () => {},
            "attackfailsound": null,
            "equipby": TF.Weapon.Sapper.equipby,
            "invicon": TF.Weapon.Sapper.invicon,
            "misc": {}
        });
    }
}
TF.Weapon.ConstructionPDA = class extends TF.Weapon {
    static equipby = [{ "name": TF.Merc.Engineer, "slot": "slot4" }];
    static invicon = "missingtexture.png";
    static name = "Construction PDA";
    static stats = "";
    constructor() {
        super({
            "name": TF.Weapon.ConstructionPDA.name,
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {},
            "attackalt": () => {},
            "onweaponout": () => {},
            "attackfailsound": null,
            "equipby": TF.Weapon.ConstructionPDA.equipby,
            "invicon": TF.Weapon.ConstructionPDA.invicon,
            "misc": {}
        });
    }
}
TF.Weapon.DestructionPDA = class extends TF.Weapon {
    static equipby = [{ "name": TF.Merc.Engineer, "slot": "slot5" }];
    static invicon = "missingtexture.png";
    static name = "Destruction PDA";
    static stats = "";
    constructor() {
        super({
            "name": TF.Weapon.DestructionPDA.name,
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {},
            "attackalt": () => {},
            "onweaponout": () => {},
            "attackfailsound": null,
            "equipby": TF.Weapon.DestructionPDA.equipby,
            "invicon": TF.Weapon.DestructionPDA.invicon,
            "misc": {}
        });
    }
}
TF.Weapon.DisguiseKit = class extends TF.Weapon {
    static equipby = [{ "name": TF.Merc.Spy, "slot": "slot4" }];
    static invicon = "missingtexture.png";
    static name = "Disguise Kit";
    static stats = "";
    constructor() {
        super({
            "name": TF.Weapon.DisguiseKit.name,
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {},
            "attackalt": () => {},
            "onweaponout": () => {},
            "attackfailsound": null,
            "equipby": TF.Weapon.DisguiseKit.equipby,
            "invicon": TF.Weapon.DisguiseKit.invicon,
            "misc": {}
        });
    }
}
TF.Weapon.InvisWatch = class extends TF.Weapon {
    static equipby = [{ "name": TF.Merc.Spy, "slot": "slot4" }];
    static invicon = "missingtexture.png";
    static name = "Invis Watch";
    static stats = "";
    constructor() {
        super({
            "name": TF.Weapon.InvisWatch.name,
            "mdl": null,
            "atkdelay": 0,
            "attack": () => {},
            "attackalt": () => {},
            "onweaponout": () => {},
            "attackfailsound": null,
            "equipby": TF.Weapon.InvisWatch.equipby,
            "invicon": TF.Weapon.InvisWatch.invicon,
            "misc": {}
        });
    }
}

TF.Env = class {
    constructor(s) {
        this.name = s.name;
        this.onsummon = s.onsummon;
        this.onexpire = s.onexpire;
        this.ontouched = s.ontouched;
        this.update = () => {
            if(!this.mesh) return;
            this.lifespan--;
            if(this.lifespan < 0) {
                this.mesh.dispose();
                this.onexpire();
                return;
            }
            for(let target of scene.meshes) {
                if(this.mesh.intersectsMesh(target, true)) {
                    this.ontouched(target);
                }
            }
        }
        this.lifespan = s.lifespan;
        this.mdl = s.mdl;
        this.texture = s.texture;
        this.usegrav = s.usegrav;
        this.x = s.x;
        this.y = s.y;
        this.z = s.z;
        this.sizex = s.sizex;
        this.sizey = s.sizey;
        this.sizez = s.sizez;
        this.core = new BABYLON.Vector3(this.sizex / 2, this.sizey / 2, this.sizez / 2);
        this.mesh = BABYLON.MeshBuilder.CreateBox("env", { width: this.sizex, height: this.sizey, depth: this.sizez }, scene);
        this.mesh.material = new BABYLON.StandardMaterial("envmat", scene);
        this.mesh.material.diffuseColor = new BABYLON.Color3(1, 0, 0); // red
        if(this.usegrav) {
            this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
                this.mesh,
                BABYLON.PhysicsImpostor.BoxImpostor,
                { mass: 1, restitution: 0.1 },
                scene
            );
        }
        this.onsummon();
    }
    ismerc(m) {
        return players.some(p => p.mesh == m);
    }
    tick() {
        this.update();
    }
}
TF.Env.Explosion = class extends TF.Env {
    constructor(s) {
        super({
            "name": "Explosion",
            "onsummon": () => {},
            "onexpire": () => {},
            "ontouched": (m) => {
                if(!this.ismerc(m)) return;
                const merc = players.find(p => p.mesh == m);
                merc.hurt(100 - BABYLON.Vector3.Distance(this.core, merc.mesh.position));
            },
            "lifespan": 500,
            "mdl": null,
            "texture": null,
            "usegrav": false,
            "x": s.x,
            "y": s.y,
            "z": s.z,
            "sizex": 3,
            "sizey": 3,
            "sizez": 3
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
        this.mesh = BABYLON.MeshBuilder.CreateCapsule("projectile", { height: 2, radius: 0.3 }, scene);
        this.mesh.material = new BABYLON.StandardMaterial("projmat", scene);
        this.mesh.material.diffuseColor = new BABYLON.Color3(1, 0, 0); // red
        this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
            this.mesh,
            BABYLON.PhysicsImpostor.BoxImpostor,
            { mass: 1, restitution: 0.1 },
            scene
        );
    }
    tick() {
        if(!this.mesh) return;
        this.lifespan--;
        if(this.lifespan <= 0) {
            this.mesh.dispose();
            return;
        }
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
                for(let target of scene.meshes) {
                    if(this.mesh.intersectsMesh(target, true)) {
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
        this.mesh.position.set(this.x, this.y, this.z);
        this.mesh.rotationQuaternion = camera.absoluteRotation.clone();
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
            "lifespan": 250
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
            "lifespan": 100
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

TF.ScreenComponent = class {
    constructor(s) {
        this.name = s.name;
        this.x = s.x;
        this.y = s.y;
        this.width = s.width;
        this.height = s.height;
        this.actions = s.actions;
        this.content = s.content;
        this.onspawn = s.onspawn;
        this.onexpire = s.onexpire;
        this.lifespan = s.lifespan;
        this.channel = s.channel;
        this.texture = s.texture;
    }
}
TF.ScreenComponent.Text = class extends TF.ScreenComponent {
    constructor(s) {
        super({
            "name": "Text",
            "x": s.x,
            "y": s.y,
            "width": s.width,
            "height": s.height,
            "actions": {},
            "content": s.content,
            "onspawn": () => {},
            "onexpire": () => {},
            "lifespan": s.lifespan,
            "channel": TF.Channel.ScreenComponent,
            "texture": s.texture
        });
    }
}
TF.ScreenComponent.Rect = class extends TF.ScreenComponent {
    constructor(s) {
        super({
            "name": "Rectangle",
            "x": s.x,
            "y": s.y,
            "width": s.width,
            "height": s.height,
            "actions": {},
            "content": s.content,
            "onspawn": () => {},
            "onexpire": () => {},
            "lifespan": s.lifespan,
            "channel": TF.Channel.ScreenComponent,
            "texture": s.texture
        });
    }
}
TF.ScreenComponent.Vote = class extends TF.ScreenComponent {
    constructor(s) {
        super({
            "name": "Vote",
            "x": s.x,
            "y": s.y,
            "width": s.width,
            "height": s.height,
            "actions": s.actions,
            "content": s.content,
            "onspawn": () => {},
            "onexpire": (r) => {
                // Submit vote to TF class (map switch, surrender?)
                // r = result of vote
                this.submissionloc(r);
            },
            "lifespan": s.lifespan,
            "channel": TF.Channel.ScreenComponent,
            "texture": s.texture
        });
        this.submissionloc = s.submissionloc;
    }
}

TF.Error = class extends Error {
    constructor(s) {
        this.name = s.name;
        this.message = s.message;
        super(this.message);
    }
}

TF.Colour = class {
    constructor(s) {
        this.name = s.name;
        this.rgba = s.rgba;
        this.colour = new BABYLON.Color4(this.rgba.r, this.rgba.g, this.rgba.b, this.rgba.a);
    }
}
TF.Colour.Red = class extends TF.Colour {
    constructor() {
        super({
            "name": "Red",
            "rgba": { "r": 255, "g": 0, "b": 0, "a": 1 }
        });
    }
}

TF.Sound = class {}

TF.Prop = class {}

TF.Anim = class {}

TF.Channel = class {
    constructor(s) {
        this.name = s.name;
        this.priority = s.priority;
    }
}
TF.Channel.Debug = class extends TF.Channel {}
TF.Channel.Raycast = class extends TF.Channel {}
TF.Channel.Particle = class extends TF.Channel {}
TF.Channel.Sound = class {}
TF.Channel.Sound.Ambient = class extends TF.Channel {}
TF.Channel.Sound.Weapon = class extends TF.Channel {}
TF.Channel.Anim = class extends TF.Channel {}
TF.Channel.Physics = class extends TF.Channel {}
TF.Channel.ScreenComponent = class extends TF.Channel {}

TF.AI = class {
    constructor(s) {
        this.name = s.name;
        this.action = s.action;
        this.ref = s.ref;
    }
    run() {
        return this.action();
    }
}
TF.AI.Vision = class extends TF.AI {
    constructor(r) {
        super({
            "name": "Vision",
            "action": () => {
                const mesh = this.ref.mesh;
                const raycaster = new RaycastEmitter({ "emitystyle": "cam", "radius": 5, "len": Infinity, "ignore": [], "channel": TF.Channel.Raycast, "visibility": 0, "colour": TF.Colour.Red });
                return raycaster.emit();
            },
            "ref": r
        });
    }
}
TF.AI.Hearing = class extends TF.AI {}

// TF.Server = class {
//     constructor() {}
//     changeMap(ref) {}
// }

TF.Map = class {
    constructor(s) {
        this.name = s.name;
        this.objects = s.objects;
        this.mode = s.mode;
    }
    build() {}
}
TF.Map.Badwater = class extends TF.Map {}

TF.Loadout = class {
    constructor(c) {
        this.equipclass = c;
    }
    menu() {
        document.removeEventListener("click", lock);
        document.removeEventListener("mousedown", Shoot1);
        document.removeEventListener("contextmenu", Shoot2);
        const slots = document.createElement("div");
        const slotprimary = document.createElement("button");
        slotprimary.id = "slot-primary";
        const slotsecondary = document.createElement("button");
        slotsecondary.id = "slot-secondary";
        const slotmelee = document.createElement("button");
        slotmelee.id = "slot-melee";
        [slotprimary, document.createElement("br"), slotsecondary, document.createElement("br"), slotmelee].forEach(e => slots.appendChild(e));
        const equip = (e) => {
            const makeEquipMenu = (s) => {
                const emenu = document.createElement("div");
                emenu.className = "ebslot";
                const ebls = TF.Weapon.weapons.filter(w => w.equipby.some(ww => this.equipclass == ww.name && ww.slot == s));
                ebls.forEach(e => {
                    const div = document.createElement("div");
                    const img = document.createElement("img");
                    img.src = e.invicon;
                    const p = document.createElement("p");
                    p.textContent = e.name;
                    const br = document.createElement("br");
                    const p2 = document.createElement("p");
                    p2.textContent = e.stats;
                    div.appendChild(img);
                    div.appendChild(br);
                    div.appendChild(p);
                    div.appendChild(p2);
                    emenu.appendChild(div);
                    Object.assign(img.style, {
                        width: "40%",
                        height: "40%",
                        padding: "15px"
                    });
                    Object.assign(p.style, {
                        fontSize: "12px"
                    });
                    Object.assign(p2.style, {
                        fontSize: "12px"
                    });
                    Object.assign(div.style, {
                        backgroundColor: "#525252",
                        borderRadius: "5px",
                        width: "15%",
                        height: "30%"
                    });
                });
                Object.assign(emenu.style, {
                    position: "fixed",
                    top: "0",
                    left: "0",
                    opacity: "1",
                    backgroundColor: "rgba(0,0,0,0.8)", // nicer overlay
                    color: "white",
                    zIndex: "9999",
                    width: "100vw",
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                });
                document.body.appendChild(emenu);
            }
            const id = e.target.id;
            const execs = {
                "slot-primary": () => makeEquipMenu("primary"),
                "slot-secondary": () => makeEquipMenu("secondary"),
                "slot-melee": () => makeEquipMenu("melee")
            };
            execs[id]();
        }
        slotprimary.innerHTML = player.primary.name;
        slotsecondary.innerHTML = player.secondary.name;
        slotmelee.innerHTML = player.melee.name;
        slotprimary.addEventListener("click", equip);
        slotsecondary.addEventListener("click", equip);
        slotmelee.addEventListener("click", equip);
        Object.assign(slots.style, {
            position: "fixed",
            top: "0",
            left: "0",
            opacity: "1",
            backgroundColor: "rgba(0,0,0,0.8)", // nicer overlay
            color: "white",
            zIndex: "9999",
            width: "100vw",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
        });
        [slotprimary, slotsecondary, slotmelee].forEach(e => Object.assign(e.style, {
            backgroundColor: "orange",
            color: "black",
            width: "20%",
            height: "20%",
            pointerEvents: "auto"
        }));
        document.body.appendChild(slots);
    }
}

TF.Console = class {
    constructor(s) {
        this.x = s.x;
        this.y = s.y;
        this.state = s.state;
    }
}

// TF.Server = class {
//     constructor(s) {
//         this.name = s.name;
//         this.address = s.address;
//         this.location = s.location;
//     }
// }

class RaycastEmitter {
    constructor(s) {
        this.emitstyle = s.emitstyle;
        if(this.emitstyle == "pos") {
            this.x = s.x;
            this.y = s.y;
            this.z = s.z;
        }
        this.radius = s.radius;
        this.len = s.len;
        this.ignore = s.ignore;
        this.channel = s.channel;
        this.visibility = s.visibility;
        this.colour = s.colour;
    }
    emit() {
        let origin;
        let direction;
        if(this.emitstyle == "cam") {
            origin = camera.position.add(camera.getForwardRay().direction.scale(0)); // Move 1 unit forward
            direction = camera.getForwardRay().direction;
        } else if(this.emitstyle == "pos") {
            origin = new BABYLON.Vector3(this.x, this.y, this.z);
            direction = origin.getForwardRay().direction;
        }
        const length = s.len; // 3; // Max interaction distance
        const ray = new BABYLON.Ray(origin, direction, length);
        const hit = scene.pickWithRay(ray);
        return hit.pickedMesh;
    }
}
class ParticleEmitter {
    constructor(s) {
        this.texture = s.texture;
        this.colour1 = new s.colour1();
        this.colour2 = new s.colour2();
        this.colourdead = new s.colourdead(); // new (colour => BABYLON.Color4)(stuff)
        this.lifespan = s.lifespan;
        this.channel = s.channel;
        this.x = s.x;
        this.y = s.y;
        this.z = s.z;
        this.minsize = s.minsize;
        this.maxsize = s.maxsize;
        this.minpower = s.minpower;
        this.maxpower = s.maxpower;
        this.updspeed = s.updspeed;
        this.emitrate = s.emitrate;
    }
    emit() {
        let ps = new BABYLON.ParticleSystem("particles", 1000, scene);
        ps.particleTexture = new BABYLON.Texture(this.texture, scene); // https://www.babylonjs-playground.com/textures/flare.png
        // Emitter position (where the explosion happens)
        ps.emitter = new BABYLON.Vector3(this.x, this.y, this.z);
        // Color gradient (fire-like effect)
        ps.color1 = this.colour1; // new BABYLON.Color4(1, 0.6, 0, 1); // Orange
        ps.color2 = this.colour2; // new BABYLON.Color4(1, 0.2, 0, 1); // Red
        ps.colorDead = this.colourdead; // new BABYLON.Color4(0, 0, 0, 0); // Fade out
        // Speed and spread
        ps.minSize = this.minsize; // particleSystem.minSize = 2.5;
        ps.maxSize = this.maxsize; // particleSystem.maxSize = 5;
        ps.minEmitPower = this.minpower; // particleSystem.minEmitPower = 2;
        ps.maxEmitPower = this.maxpower; // particleSystem.maxEmitPower = 5;
        ps.updateSpeed = this.updspeed; // particleSystem.updateSpeed = 0.02;
        // Explosion burst
        ps.emitRate = this.emitrate; // More particles = bigger explosion
        ps.start();
        // Stop the explosion after 0.5s
        setTimeout(() => {
            ps.stop();
            setTimeout(() => ps.dispose(), 1000); // Cleanup
        }, this.lifespan);
    }
}
class SoundEmitter {
    constructor(s) {
        this.sound = s.sound;
        this.volume = s.volume;
        this.channel = s.channel;
        this.emitstyle = s.emitstyle;
        if(this.emitstyle == "comp") {
            this.comp = s.comp;
            this.bone = s.bone;
            this.offsetx = s.offsetx;
            this.offsety = s.offsety;
            this.offsetz = s.offsetz;
        } else if(this.emitstyle == "spaital") {
            this.x = s.x;
            this.y = s.y;
            this.z = s.z;
        }
    }
    emit() {}
}

class Camera {}

TF.Merc.MercClasses = [ TF.Merc.Scout, TF.Merc.Soldier, TF.Merc.Pyro, TF.Merc.Demoman, TF.Merc.Heavy, TF.Merc.Engineer, TF.Merc.Medic, TF.Merc.Sniper, TF.Merc.Spy ];
TF.Merc.Scout.defaultLoadout = { "primary": TF.Weapon.Scattergun, "secondary": null, "melee": null };
TF.Merc.Soldier.defaultLoadout = { "primary": TF.Weapon.RocketLauncher, "secondary": TF.Weapon.Shotgun, "melee": TF.Weapon.Shovel };
TF.Merc.Pyro.defaultLoadout = { "primary": TF.Weapon.Flamethrower, "secondary": TF.Weapon.Shotgun, "melee": null };
TF.Merc.Demoman.defaultLoadout = { "primary": TF.Weapon.GrenadeLauncher, "secondary": null, "melee": null };
TF.Merc.Heavy.defaultLoadout = { "primary": TF.Weapon.Minigun, "secondary": TF.Weapon.Shotgun, "melee": null };
TF.Merc.Engineer.defaultLoadout = { "primary": TF.Weapon.Shotgun, "secondary": null, "melee": null };
TF.Merc.Medic.defaultLoadout = { "primary": TF.Weapon.SyringeGun, "secondary": null, "melee": null };
TF.Merc.Sniper.defaultLoadout = { "primary": TF.Weapon.SniperRifle, "secondary": null, "melee": null };
TF.Merc.Spy.defaultLoadout = { "primary": TF.Weapon.Revolver, "secondary": null, "melee": null };
TF.Merc.AI.Scout.defaultLoadout = TF.Merc.Scout.defaultLoadout;
TF.Merc.AI.Soldier.defaultLoadout = TF.Merc.Soldier.defaultLoadout;
TF.Merc.AI.Pyro.defaultLoadout = TF.Merc.Pyro.defaultLoadout;
TF.Merc.AI.Demoman.defaultLoadout = TF.Merc.Demoman.defaultLoadout;
TF.Merc.AI.Heavy.defaultLoadout = TF.Merc.Heavy.defaultLoadout;
TF.Merc.AI.Engineer.defaultLoadout = TF.Merc.Engineer.defaultLoadout;
TF.Merc.AI.Medic.defaultLoadout = TF.Merc.Medic.defaultLoadout;
TF.Merc.AI.Sniper.defaultLoadout = TF.Merc.Sniper.defaultLoadout;
TF.Merc.AI.Spy.defaultLoadout = TF.Merc.Spy.defaultLoadout;
TF.Weapon.weapons = [ TF.Weapon.Scattergun, TF.Weapon.RocketLauncher, TF.Weapon.Flamethrower, TF.Weapon.GrenadeLauncher, TF.Weapon.Minigun, TF.Weapon.Shotgun, TF.Weapon.SyringeGun, TF.Weapon.SniperRifle, TF.Weapon.Revolver, TF.Weapon.Shovel, TF.Weapon.Bat, TF.Weapon.Bottle, TF.Weapon.Fists, TF.Weapon.Kukri, TF.Weapon.Bonesaw, TF.Weapon.Knife, TF.Weapon.ConstructionPDA, TF.Weapon.DestructionPDA, TF.Weapon.InvisWatch, TF.Weapon.Sapper, TF.Weapon.StickyBombLauncher, TF.Weapon.FireAxe, TF.Weapon.Medigun, TF.Weapon.Pistol ];

const canvas = document.getElementById("gameCanvas");

function game() {
    camera.position.copyFrom(player.mesh.position);
    projectiles.forEach(p => p.tick());
    env.forEach(e => e.tick());
    scene.render();
}

// Create Babylon.js Scene
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), new BABYLON.CannonJSPlugin());

const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 50, height: 50 }, scene);
ground.position.y = 0;
ground.physicsImpostor = new BABYLON.PhysicsImpostor(
    ground,
    BABYLON.PhysicsImpostor.BoxImpostor,
    { mass: 0, restitution: 0.1 },
    scene
);

// First-Person Camera
const camera = new BABYLON.UniversalCamera("FPCamera", new BABYLON.Vector3(0, 1.5, 0), scene);
camera.attachControl(canvas, true);
camera.angularSensibility = 4000;  // Slow down camera rotation

// Create entities
const player = new TF.Merc.Soldier({ "x": 0, "y": 0, "z": 0 });
// Fire when left mouse button is clicked
function Shoot1(e) {
    player.equipped.atk1();
}
function Shoot2(e) {
    e.preventDefault();
    player.equipped.atk2();
}
document.addEventListener("mousedown", Shoot1);
document.addEventListener("contextmenu", Shoot2);

var projectiles = [];
var env = [];
var players = [player];
var ai = [];

var keybinds = {};

scene.onBeforeRenderObservable.add(() => {
    players.forEach(p => {
        if(p.mesh.rotationQuaternion) {
            p.mesh.rotationQuaternion = BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Y, p.mesh.rotationQuaternion.toEulerAngles().y);
        }
    });
    ai.forEach(a => a.update());
});

// Lock Pointer
function lock() {
    if(document.pointerLockElement != canvas) {
        canvas.requestPointerLock();
    }
}
document.addEventListener("click", lock);

function unlock() {
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
window.addEventListener("resize", () => engine.resize());

let l = new TF.Loadout(TF.Merc.Soldier);
l.menu();
engine.stopRenderLoop();