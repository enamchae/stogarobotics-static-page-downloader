const http = require("http");
const path = require("path");
const fs = require("fs");
const fse = require("fs-extra");

const {dirTarget, copyPairs, downloadQueryPairs} = require("./config");
const appConfig = require("../config-util");

for (const [dir, copyDestination] of copyPairs) {
    fse.copySync(dir, prefixDirTarget(copyDestination));
    console.log("\u001b[36mcopied\u001b[0m", dir, "\u001b[32mas\u001b[0m", prefixDirTarget(copyDestination));
}

(async () => {
    for (const [pagePath, downloadDestination] of downloadQueryPairs) {
        if (fs.existsSync(prefixDirTarget(downloadDestination))) {
            console.log("\u001b[35mskipping\u001b[0m", pagePath, "\u001b[35m(already present)\u001b[0m");
            continue;
        }

        console.log("\u001b[33mwill download\u001b[0m", pagePath);

        await new Promise(resolve => {
            http.request({
                host: "localhost",
                port: 20807,
                path: encodeURI(appConfig.prefixRootUrl(pagePath)),
            }, res => {
                res.on("data", data => {
                    console.log("\u001b[32mdownloaded\u001b[0m", pagePath, "\u001b[32mas\u001b[0m", prefixDirTarget(downloadDestination));
                    write(downloadDestination, data);

                    resolve();
                });
            }).end();
        });
    }

    console.log("\u001b[36;1mdone.\u001b[33m Please manually verify that all the wanted items have been downloaded correctly. If not, remove any corrupted files and run this script again.\u001b[0m");
})();

async function write(location, data) {
    const pathSplit = location.split(/[/\\]/g);
    pathSplit.pop();
    for (let i = 0; i < pathSplit.length; i++) {
        mkdir(pathSplit.slice(0, i + 1).join(path.sep));
    }

    appendToFile(location, data);
}

async function mkdir(dir) {
    const dest = prefixDirTarget(dir);

    if (fs.existsSync(dest)) return;
    fs.mkdirSync(dest);
}

async function appendToFile(location, data) {
    // "a" for append. This deals with streamed files such as images
    const writeStream = fs.createWriteStream(prefixDirTarget(location), {flags: "a"});
    writeStream.write(data);
    writeStream.end();
}

function prefixDirTarget(dir) {
    return path.join(dirTarget, dir);
}