const dialog = require("dialog-node");
const path = require("path")
const fs = require("fs")
function fileSave(blob, xpath){
    var fileReader = new FileReader();
    fileReader.onload = function () {
        fs.writeFileSync(xpath, Buffer(new Uint8Array(this.result)));
    };
    fileReader.readAsArrayBuffer(blob);
}

function fsafe(text){

        return text.replace(/([^\p{L}\s\d\-_~,;:\[\]\(\).'])/isgmu, "")

}
function addScript( src ) {
    var s = document.createElement( 'script' );
    s.setAttribute( 'src', src );
    document.body.appendChild( s );
}
function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}
function RequestSnapshotBlob(callback){
    vm.runtime.renderer.requestSnapshot((dsnap) => {
        bsnap = dataURItoBlob(dsnap)
        return callback(bsnap)
    })
}
function onScreenshot(e){
    canvas = document.querySelector(".sc-canvas")
    vm.runtime.renderer.requestSnapshot((snap) => {window.snap = snap})
    RequestSnapshotBlob((blob) => {
        dialog.entry('Enter snapshot name.', 
            "Scratch EMU / Helpers / Snapshotter",0, 
            function(code, retVal, stderr){
                if(process.env.SCEMU_SHOTPATH){
                    snapdata = path.join(
                        process.env.SCEMU_SHOTPATH,
                        fsafe(retVal) + ".png")
                    fileSave(blob, snapdata)
                } else
                    dialog.info("Snapshot path is undefined!", 
                    "Snapshot error!", 0, 
                        function(code, retVal, stderr){});
            }
        );
    })
}
module.exports = onScreenshot