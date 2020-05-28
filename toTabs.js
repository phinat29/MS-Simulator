const TabGroup = require("electron-tabs");

let tabGroup = new TabGroup()
let tab = tabGroup.addTab({
    title: "Simu",
    src: "./Simu.html",
    visible: true,
    active: true,
    closable: false,
    webviewAttributes: {
        nodeIntegration: true
    }
})
let secondtab = tabGroup.addTab({
    title: "Wiki",
    src: "https://monster-sanctuary.fandom.com/wiki/Monster_Sanctuary_Wiki",
    visible: true,
})
