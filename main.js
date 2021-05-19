var fs = require("fs");
const TreeNode = require("./models/treeNode");
const Validators = require("./utils/validators");
const FilesUtils = require("./utils/files");

let files = ["./data/conduit.json", "./data/onecalendar.json"];
files.map(file => {
    let buff = fs.readFileSync(file);
    let result = removeIdsFromFiles(buff);
    FilesUtils.writeFile(file, result);
});
console.log("FINISHED.")

function removeIdsFromFiles(buff) {
  let buffString = buff.toString();
  let opsArray = JSON.parse(buffString);

  let ops = new TreeNode("ops");
  opsArray.forEach((op) => {
    let opNode = Validators.buildOp(op);
    ops.children.push(opNode);
  });

  let removedIds = Validators.removeIds(ops);
  let newJson = [];
  removedIds.children.map((op) => {
    let json = Validators.generateJSON(op);
    newJson.push(json);
  });
  return newJson;
}
