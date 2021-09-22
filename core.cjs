var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"))
var JSZip = require("jszip")
var os = require("os")
// var optparse = require("nomnom").option("srom", {
//     abbr: "-r",
//     help: "ROM to run.",
//     metavar: "romfile"
// }).parse()
function loadAsync(srom){
        epath = fs.mkdtempSync(os.tmpdir());
        ramie = fs.readFileAsync(srom).then((data) => {
            zip = JSZip.loadAsync(data).then((zip) => {
                return zip.file("ROMFile").async("text")
            }).then((json) => {
                return JSON.parse(json)
            }).then((meta) => {
                return meta
            }).then((meta) => {
                return [epath, meta]
            });
            return zip
        });
        return ramie
}
module.exports = {loadAsync}