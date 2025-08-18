const startup = document.createElement("div");
startup.innerHTML = `<button id="is-json">Create from JSON upload</button> or <button id="is-fields">Create from fields</button>`;
document.body.appendChild(startup);
const isjson = document.getElementById("is-json");
const isfields = document.getElementById("is-fields");
isjson.addEventListener("click", () => {
    document.body.removeChild(startup);
    createFromJSON();
});
isfields.addEventListener("click", () => {
    document.body.removeChild(startup);
    createFromFields();
});

function createFromJSON() {
    const upload = document.createElement("input");
    upload.type = "file";
    document.body.appendChild(upload);
    upload.addEventListener("change", (e) => {
        const file = e.target.files[0];
        let data;
        try {
            data = JSON.parse(file);
        } catch(err) {
            const div = document.createElement("div");
            div.innerHTML = `JSON file parse failed: ${err}`;
            document.body.appendChild(div);
            return;
        }
        /*
        Fields
        name - defines name
        descrip - defines description
        author - defines author
        version - defines version
        events - defines events
        commands - defines commands
        */
    });
}
function createFromFields() {}