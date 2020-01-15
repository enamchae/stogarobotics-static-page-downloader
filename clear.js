const path = require("path");
const fs = require("fs");

const fsP = new Proxy({}, {
    get(target, key) {
        return (...args) => {
            return new Promise(resolve => {
                fs[key](...args, resolve);
            });
        };
    },
});


const {dirTarget} = require("./config");

// TODO exclude `./public/` and `./public/.git`
(async () => {
    await unlinkRecursive(dirTarget); // fails sometimes
    await fsP.mkdir(dirTarget);

    console.log("\u001b[36;1mdone.\u001b[33m Please manually verify that all the items have been cleared. If not, run this script again.\u001b[0m");
})();

async function unlinkRecursive(dir) {
    if (!fs.existsSync(dir)) return;

    for (let filename of fs.readdirSync(dir)) {
        const pathNew = path.join(dir, filename);

        if (fs.lstatSync(pathNew).isDirectory()) {
            await unlinkRecursive(pathNew);
        } else {
            await fsP.unlink(pathNew);
            console.log("\u001b[35mdeleted file\u001b[0m", pathNew);
        }
    }

    await fsP.rmdir(dir);
    console.log("\u001b[36mdeleted directory\u001b[0m", dir);
}