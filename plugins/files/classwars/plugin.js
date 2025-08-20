const plugin = {
    "name": "Class Wars",
    "descrip": "A port of the class wars plugin from TF2.",
    "author": "The TF-Web Team",
    "version": "0.0.0",
    "events": {
        "game": {
            "start": ""
        }
    },
    "commands": {
        "surrender": `new TF.ScreenComponent.Vote({ "x": 0, "y": 0, "width": 0, "height": 0, "actions": { 1: () => { r["yes"]++; }, 2: () => { r["no"]++; } }, "content": "<p>Surrender?</p><br><br><p>(1) Yes</p><p>(2) No</p>", "submissionloc": null, "lifespan": 0, "texture": null });`
    }
};

export { plugin };