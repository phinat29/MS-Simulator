var fs = require('fs')
var fileIF = fs.readFileSync("IF.json")
var IF = JSON.parse(fileIF)
var Skills = require("./FightFiles/Skill").Skill
var folder = "MSSprites"
var fScript = "MScripts"
var monster
var lastSelect
var Items = []
var Food = []
var MonsterSelected = {Left: [null, null, null], Right: [null, null, null]}

function loadImgM() {
    var files = fs.readdirSync(fScript)
    for  (var i in files) {
        document.getElementsByClassName("img")[0].innerHTML += "<div class=\"containerI\" onmouseup=\"selectImgM(this, event)\"><img id=\""+ files[i].slice(0, -5) +"\" class=\"spriteM\" src=\"" + folder + "/" + files[i].slice(0, -5) + ".png\"></div>"
    }
}
function selectImgM(s, e) {
    if (e.which == 3) {
        var id = s.children[0].id
        if (monster) { if (id == monster.id) { return ; } }
        monster = fs.readFileSync(fScript + "/" + id + ".json")
        monster = JSON.parse(monster)
        monster.points = monster.RStats.lvl +1
        var info = document.getElementsByClassName("info")[0]
        info.innerHTML = infoDiv()
        document.getElementsByClassName("IF")[0].style.visibility = "visible"
        for( var i in document.getElementsByClassName('setToNull')) {
            document.getElementsByClassName('setToNull')[i].value = ""
        }
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
    var stats = {AD: 0, AP: 0, D: 0, HP: 0, Ma: 0, CC: 0.0, CD: 0.0}
    for (var i in Items) {
        if (i == 0) {
            var splited = IF.weap[Items[i].id].base[Items[i].up].des.split(" ")
            for (var k in splited) {
                var split2 = splited[k].split(":")
                stats[split2[0]] += parseFloat(split2[1])
            }
        }else{
            var splited = IF.item[Items[i].id].base[Items[i].up].des.split(" ")
            for (var k in splited) {
                var split2 = splited[k].split(":")
                stats[split2[0]] += parseFloat(split2[1])
            }
        }
    }
    for (var i in Food) {
        var splited = IF.food[Food[i].id].des.split(':')
        stats[splited[0]] += parseFloat(splited[1])
    }

    var info = "<img id=\"" + monster.id + "\"class=\"spriteM zoom showInfo\" src=\"" + folder + "/" + monster.id + ".png" + "\">"+ monster.id
    info += "<input class=\"MLevel levelInfo\" id=\"LevelMonster\" type=\"number\" min=\"1\" max=\"36\" placeholder=\"level\" value=\"" + monster.RStats.lvl + "\" oninput=\"lvlChanged(this)\">"
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
    info  += "Crit Chance : "+ (monster.RStats.CC+ monster.baseStats? stats.CC : 0) *100 +"%<br>Crit Damage : "+ (monster.RStats.CD+ monster.baseStats? stats.CD : 0) *100 +"%<br>Damage Reduc : "+ Math.trunc(monster.baseStats.reduc *100) +"%"
    info += "</div></div>"
    var gridtc = ""
    for (var i = 0; i < monster.treeDes.length; i++) { gridtc += "1fr " }
    info += "<div class=\"treeSkill\" style=\"grid-template-columns: "+gridtc+ ";\">"
    for (var u in monster.treeDes) {
        info += "<div class=\"showSkill\" style=\"grid-column:" + (parseFloat(u) + 1) +"\">"
        for (var i in monster.treeDes[u]) {
            for (var k in monster.treeDes[u][i]) {
                var toShow
                var lastchar = null
                if (parseInt(monster.treeDes[u][i][k].slice(-1)) >= 0 && parseInt(monster.treeDes[u][i][k].slice(-1)) <= 9) {
                    toShow = monster.treeDes[u][i][k].substring(0, monster.treeDes[u][i][k].length-2)
                    lastchar = parseInt(monster.treeDes[u][i][k].slice(-1)) - 1
                }else{
                    toShow = monster.treeDes[u][i][k]
                }
                info += "<img class=\"spritesSkill\" onclick=\"AddSkill(this, '"+toShow+"', "+lastchar+", "+i+")\" onmouseenter=\"showInfoSkill('"+toShow+"', "+lastchar+")\" onmouseleave=\"unshowInfo()\" src=\"SkillSprites/"+toShow+".png\">"
            }
            info += "<br>"
        }
        info += "</div>"
    }
    info += "</div>"
    info += "<div class=\"infoSkill\">"
    info += "</div>"
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
    if (IF.weap[id]) {
        Items[0] = { id: id, item: IF.weap[id], up: k }
    }
}
function selectItemList(s, e, k) {
    document.getElementById("Items").style.display = "none"
    var id = s.parentElement.id
    document.getElementById(lastSelect).value = id+"+"+k
    var nb = lastSelect.slice(-1)
    if (IF.item[id]) {
        Items[nb] = { id: id, item: IF.item[id], up: k}
    }
}
function selectFoodList(s, e) {
    document.getElementById("Food").style.display = "none"
    var id = s.parentElement.id
    document.getElementById(lastSelect).value = id
    var nb = lastSelect.slice(-1)
    if (IF.food[id]) {
        Food[nb] = {id: id, item: IF.food[id]}
    }
}
function loadList() {
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
    var docFood = document.getElementById("Food")
    docFood.innerHTML = ""
    for (var i in IF.food) {
        docFood.innerHTML += "<div class=\"showToSelect\" id=\""+i+"\">" + showUpgrade(i, "food")
        docFood.innerHTML += "</div>"
    }
}
function ChoiceW(e, ID) {
    var value = document.getElementById(ID).value
    if (value != null) {
        if (ID == "weapon") {
            for (var i in IF.weap) {
                var d = document.getElementById(i)
                if (i.substring(0, value.length) == value || value=="") {
                    d.style.display = "block"
                } else {
                    d.style.display = "none"
                }
            }
        }else if (ID.substring(0, ID.length-1) == "item") {
            for (var i in IF.item) {
                var d = document.getElementById(i)
                if (i.substring(0, value.length) == value || value=="") {
                    d.style.display = "block"
                } else {
                    d.style.display = "none"
                }
            }
        }else if (ID.substring(0), ID.length-1 == "food") {
            for (var i in IF.food) {
                var d = document.getElementById(i)
                if (i.substring(0, value.length) == value || value=="") {
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
            a += "<div class=\"toselW\" onclick=\"selectWeapList(this, event, "+k+")\">"+i+"+"+k+" :: "+IF.weap[i].base[k].des+"<br>"
            if (IF.weap[i].base[k].spe) {
                a += "<span class=\"Spe\">Spe : "+IF.weap[i].base[k].spe+"</span>"
            }
            a += "</div>"
        }
    }else if (ID == "items") {
        for(var k in IF.item[i].base){
            a += "<div class=\"toselW\" onclick=\"selectItemList(this, event, "+k+")\">"+i+"+"+k+" :: "+IF.item[i].base[k].des+"</div>"
        }
        if (IF.item[i].spe) {
            a += "<span class=\"Spe\">Spe : "+IF.item[i].spe+"</span>"
        }
    }else if (ID == "food") {
        a += "<div class=\"toselW\" onclick=\"selectFoodList(this, event)\">"+i+" :: "+IF.food[i].des+"</div>"
    }
    return a
}
function lvlChanged(s) {
    monster.RStats.lvl = s.value
    monster.points = monster.RStats.lvl +1
}
function resetItems() {
    Food = []
    Items = []
    for (var i in document.getElementsByClassName('setToNull')) {
        document.getElementsByClassName('setToNull')[i].value = ""
    }
    monster.points = monster.RStats.lvl +1
}
function showInfoSkill(stringi, up) {
    var infoS = document.getElementsByClassName('infoSkill')[0]
    var lvl = document.getElementById('LevelMonster')
    infoS.innerHTML = ""
    infoS.style.visibility = "visible"
    if (up >= 0) {
        infoS.innerHTML += stringi
    }
}
function unshowInfo() {
    document.getElementsByClassName('infoSkill')[0].style.visibility = "hidden"
}
function AddSkill(s, stringi, up, i) {
    var lvlRegister = i==0||i==1? 1 : (i-1)*10
    if (monster.points > 0 && lvlRegister <= monster.RStats.lvl) {
        if (true) {
            s.style.filter = "brightness(1)"
            monster.points--
        }
    }
}
function StartFight() {
    const remote = require('electron').remote;
    const BrowserWindow = remote.BrowserWindow;
    const win = new BrowserWindow({
      height: 600,
      width: 800
    });
    win.setMenuBarVisibility(false)
    win.loadURL('file://FightFiles/index.html');
}