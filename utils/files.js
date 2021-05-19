var fs = require("fs");
module.exports = {
    writeFile(filename, data){
        let names = filename.split("/");
        let name = names[names.length-1];
        fs.writeFile('./output/'+name, JSON.stringify(data), function (err) {
            if (err) return console.log(err);
            console.log(name+" saved!");
          });
    }
}