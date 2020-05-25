var fs = require('fs')
var fileIF = fs.readFileSync("IF.json")
var IF = JSON.parse(fileIF)

var folder = "MSSprites"
var fScript = "MScripts"
var monster
var lastSelect
var Items = []
var Food = []
function loadImgM() {
    var files = fs.readdirSync(fScript)
    for  (var i in files) {
        document.getElementsByClassName("img")[0].innerHTML += "<input type=\"image\" id=\""+ files[i].slice(0, -5) +"\" class=\"spriteM\" src=\"" + folder + "/" + files[i].slice(0, -5) + ".png\" onmouseup=\"selectImgM(event)\">"
    }
}

function selectImgM(e) {
    if (e.which == 3) {
        var id = e.currentTarget.id
        if (monster) { if (id == monster.id) { return ; } }
        monster = fs.readFileSync(fScript + "/" + id + ".json")
        monster = JSON.parse(monster)
        var info = document.getElementsByClassName("info")[0]
        info.innerHTML = infoDiv()
        document.getElementsByClassName("IF")[0].style.visibility = "visible"
        document.getElementsByClassName("item")[0].innerHTML = setButtonI()
    }
}
function buttonClick(e) {
    var id = e.currentTarget.id
    var info = document.getElementsByClassName("info")[0]
    switch(id) {
        case "calcul":
            monster.RStats.lvl = parseInt(document.getElementsByClassName("levelInfo")[0].value) || 1
            monster.baseStats = null
            //faire monster.RStats + passiv etc ici
            info.innerHTML = infoDiv()
            break;
        case "transfer":

            //fin
            info.innerHTML = ""
            monster = null
            break;
        case "reset":
            var id = monster.id
            var file = fs.readFileSync(fScript + "/" + id + ".json")
            monster = JSON.parse(file)
            info.innerHTML = infoDiv()
            break;
    }
}
function infoDiv() {
    var stats = {AD: 0, AP: 0, D: 0, HP: 0, Ma: 0, CC: 0, CD: 0}
    for (var i in Items) {
        if (i == 0) {
            var splited = IF.weap[Items[i].id].base[Items[i].up].des.split(" ")
            for (var k in splited) {
                var split2 = splited[k].split(":")
                stats[split2[0]] += parseInt(split2[1])
            }
        }else{
            var splited = IF.item[Items[i].id].base[Items[i].up].des.split(" ")
            for (var k in splited) {
                var split2 = splited[k].split(":")
                stats[split2[0]] += parseInt(split2[1])
            }
        }
    }

    var info = "<img id=\"" + monster.id + "\"class=\"spriteM zoom showInfo\" src=\"" + folder + "/" + monster.id + ".png" + "\">"+ monster.id
    info += "<input class=\"MLevel levelInfo\" type=\"number\" min=\"1\" max=\"36\" placeholder=\"level\" value=\"" + monster.RStats.lvl + "\">"
    info += "<div class=\"buttonInfo\"><button onclick=\"buttonClick(event)\" id=\"calcul\" class=\"buttonsI bCalcul\">Calcul</button><button onclick=\"buttonClick(event)\" id=\"transfer\" class=\"buttonsI bTransfer\">Transfer</button><button onclick=\"buttonClick(event)\" id=\"reset\" class=\"buttonsI bReset\">Reset</button></div>"
    info += "<div class=\"statsInfo\">"
    info += "<div id=\"statsName\">Stats : </div><div class=\"StatsListRating\">Attack rating : "+ monster.RStats.ADR +"<br>Magic Rating : "+ monster.RStats.APR +"<br>Defense Rating : "+ monster.RStats.DR +"<br>HP Rating : "+ monster.RStats.HPR +"<br>Mana Rating : "+ monster.RStats.MaR +"</div>"
    if (!monster.baseStats) {
        var lvlP = (10 + monster.RStats.lvl)
        monster.baseStats = {}
        monster.baseStats.AD = monster.RStats.ADR * lvlP / 2 + stats.AD
        monster.baseStats.AP = monster.RStats.APR * lvlP / 2 + stats.AP
        monster.baseStats.D = monster.RStats.DR * (lvlP) * 6 / 10 + stats.D
        monster.baseStats.HP = (6+monster.RStats.HPR) * lvlP * 1.75 * (1 + monster.RStats.lvl / 100) * (1 + Math.max(0, monster.RStats.lvl - 20) / 100) + stats.HP
        monster.baseStats.Ma = (10 + monster.RStats.MaR) * (50 + monster.RStats.lvl * 2) / 10 + stats.Ma
        monster.baseStats.reduc = (lvlP + monster.baseStats.D) / (lvlP * 10 + monster.baseStats.D)
    }
    info += "<div class=\"StatsListNB\">Attack : "+ parseInt(monster.baseStats.AD) +"<br>Magic : "+ parseInt(monster.baseStats.AP) +"<br>Defense : "+ parseInt(monster.baseStats.D) +"<br>HP : "+ parseInt(monster.baseStats.HP) +"<br>Mana : "+ parseInt(monster.baseStats.Ma) +"<br><br>"
    info  += "Crit Chance : "+ (monster.RStats.CC+stats.CC) *100 +"%<br>Crit Damage : "+ (monster.RStats.CD+stats.CD) *100 +"%<br>Damage Reduc : "+ Math.trunc(monster.baseStats.reduc *100) +"%"
    info += "</div></div>"
    info += ""//div competences
    return info
}
function selectWeap(e, ID) {
    var id = e.currentTarget.id
    document.getElementById("Weap").style.display = "none"
    document.getElementById("Items").style.display = "none"
    document.getElementById("Food").style.display = "none"
    if (ID == "weapon") {
        document.getElementById("Weap").style.display = "block"
        for (var i in IF.weap) {
            document.getElementById(i).style.display = "block"
        }
    }else if (ID == "item") {
        document.getElementById("Items").style.display = "block"
    }else if (ID == 'food') {
        document.getElementById("Food").style.display = "block"
    }
    lastSelect = id

}
function selectWeapList(s, e, k) {
    document.getElementById("Weap").style.display = "none"
    var id = s.parentElement.id
    document.getElementById(lastSelect).value = id+"+"+k
    Items[0] = { id: id, item: IF.weap[id], up: k }
}
function selectItemList(s, e, k) {
    document.getElementById("Items").style.display = "none"
    var id = s.parentElement.id
    document.getElementById(lastSelect).value = id+"+"+k
    var nb = lastSelect.slice(-1)
    Items[nb] = { id: id, item: IF.item[id], up: k}
}
function loadList() {
    var docitem = document.getElementsByClassName("item")[0]
    docitem.innerHTML = setButtonI()
    var docWeap = document.getElementById("Weap")
    docWeap.innerHTML = ""
    for (var i in IF.weap) {
        docWeap.innerHTML += "<div class=\"showToSelect\" id=\""+i+"\">" + showUpgrade(i, "weapon")
        docWeap.innerHTML += "</div>"
    }
    var docItem = document.getElementById("Items")
    docItem.innerHTML = ""
    for (var i in IF.item) {
        docItem.innerHTML += "<div class=\"showToSelect\" id=\""+i+"\">" + showUpgrade(i, "items")
        docItem.innerHTML += "</div>"
    }
}
function setButtonI() {
    var select = "<h5>Items</h5>"
    select += "Weapons: <input type=\"text\" id=\"weapon\" onclick=\"selectWeap(event, 'weapon')\" oninput=\"ChoiceW(event, 'weapon')\"><br>"
    for (var i = 1; i < 4; i++) {
        select += "<br><input type=\"text\" id=\"item"+i+"\" onclick=\"selectWeap(event, 'item')\" oninput=\"ChoiceW(event, 'item"+i+"')\">"
    }
    return select
}

function ChoiceW(e, ID) {
    var value = document.getElementById(ID).value
    if (value) {
        if (ID == "weapon") {
            for (var i in IF.weap) {
                var d = document.getElementById(i)
                if (i.substring(0, value.length) == value) {
                    d.style.display = "block"
                } else {
                    d.style.display = "none"
                }
            }
        }else if (ID.substring(0, ID.length-1) == "item") {
            for (var i in IF.item) {
                var d = document.getElementById(i)
                if (i.substring(0, value.length) == value) {
                    d.style.display = "block"
                } else {
                    d.style.display = "none"
                }
            }
        }
    }
}
function showUpgrade(i, ID) {
    var a  = ""
    if (ID  == "weapon") {
        for(var k in IF.weap[i].base){
            a += "<div class=\"toselW\" onclick=\"selectWeapList(this, event, "+k+")\">"+i+"+"+k+" :: "+IF.weap[i].base[k].des+"</div>"
        }
        if (IF.weap[i].spe) {
            a += "<span>Spe : "+IF.weap[i].spe+"</span>"
        }
    }else if(ID == "items") {
        for(var k in IF.item[i].base){
            a += "<div class=\"toselW\" onclick=\"selectItemList(this, event, "+k+")\">"+i+"+"+k+" :: "+IF.item[i].base[k].des+"</div>"
        }
        if (IF.item[i].spe) {
            a += "<span>Spe : "+IF.item[i].spe+"</span>"
        }
    }
    return a
}let Stats = {hp: 100} 
 module.exports = {
     Stats: Stats
}
