const dialog = require("dialog-node");
const path = require("path")
const { ipcRenderer } = require("electron")
const fs = require("fs")
function fileSave(blob){
    var fileReader = new FileReader();
    fileReader.onload = function () {
        fs.writeFileSync('test.wav', Buffer(new Uint8Array(this.result)));
    };
    fileReader.readAsArrayBuffer(blob);
}
import("filenamify-url").then((fnameify) => fsafe = fnameify)
function onScreenshot(e){
    canvas = document.querySelector(".sc-canvas")
    canvas.toBlob((blob) => {
        window.blobed = blob
        dialog.entry('Enter snapshot name.', 
            "Scratch EMU / Helpers / Snapshotter",0, 
            function(code, retVal, stderr){
                if(process.env.SCEMU_SHOTPATH){
                    window.snapdata = path.join(
                        process.env.SCEMU_SHOTPATH,
                        fsafe(retVal) + ".png")
                    blob
                } else
                    dialog.info("Snapshot path is undefined!", 
                    "Snapshot error!", 0, 
                        function(code, retVal, stderr){});
            }
        );
    })
}
ipcRenderer.on("Screen", onScreenshot)