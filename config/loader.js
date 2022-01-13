const fs = require("fs");

module.exports = function() {
    var modelPath = config.root + "/model";
     fs.readdirSync(modelPath).forEach((file) => {
         console.log("Loading model: "+file);
         require(modelPath + "/" + file + "/schema.js")
     });
};
