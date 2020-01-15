const fs = require("fs");

module.exports = {
    dirTarget: "./public/", // this must also be updated in the `.bat` files. beware

    copyPairs: [
        ["../public/", "/"],
    ],

    downloadQueryPairs: [
        ["/", "/index.html"],
        ["/about/", "/about/index.html"],
        ["/achievements/", "/achievements/index.html"],

        ...new Array(6).fill().map((value, i) => {
            const letter = String.fromCharCode(i + "A".charCodeAt());
            return [`/teams/6121${letter}/`, `/teams/6121${letter}/index.html`];
        }),
    
        ["/gallery/", "/gallery/index.html"],
        ["/gallery/api/images/", "/gallery/images.json"],

        ...fs.readdirSync("../public/img/gallery/").map(filename => {
            return [`/gallery/thumb/${filename}`, `/gallery/thumb/${filename}`];
        }),
    ],
};