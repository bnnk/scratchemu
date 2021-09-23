var _require = require("esm")(module)
process.once('loaded', () => {
  global.require = _require
})
window.require = _require
window.preload = _require("./preloadmain.cjs")