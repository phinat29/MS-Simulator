exports.Skill = {
    Ice_Bolt: {
        Skill: "Activ",
        Dammager: true,
        Type: ["AP", "Water"],
        Stats: [
            {des: "1.9 AP", cost: 60, shot: 1, debuff: "1 chill"},
            {des: "2.5 AP", cost: 90, shot: 1, debuff: "1 chill"},
            {des: "3.1 AP", cost: 120, shot: 1, debuff: "1 chill"},
            {des: "3.8 AP", cost: 160, shot: 1, debuff: "1 chill"},
            {des: "4.6 AP", cost: 210, shot: 1, debuff: "1 chill"}
        ],
        ShowStat: function (i) {
            return
        }
    },
    Aqua_Blast: {
        Skill: "Activ",
        Dammager: true,
        Type: ["AD", "Water"],
        Stats: [
            {des: "0.4 AD", cost: 50, shot: 4, nododge: true},
            {des: "0.4 AD", cost: 75, shot: 5, nododge: true},
            {des: "0.5 AD", cost: 100, shot: 5, nododge: true},
            {des: "0.55 AD", cost: 150, shot: 6, nododge: true},
            {des: "0.7 AD", cost: 200, shot: 6, nododge: true}
        ]
    },
    Claws: {
        Skill: "Activ",
        Dammager: true,
        Type: ["AD", "Neutral"],
        Stats: [
            {des: "0.9 AD", cost: 50, shot: 2, CD: 0.5},
            {des: "1.2 AD", cost: 80, shot: 2, CD: 0.5},
            {des: "1.0 AD", cost: 110, shot: 3, CD: 0.5},
            {des: "1.25 AD", cost: 150, shot: 3, CD: 0.5},
            {des: "1.15 AD", cost: 180, shot: 4, CD: 0.5}
        ]
    },
    Heal: {
        Skill: "Activ",
        Dammager: false,
        Todo: "HP",
        Stats: [
            {des: "0.2 AP 60", cost: 40, shot: 4},
            {des: "0.25 AP 70", cost: 70, shot: 5},
            {des: "0.25 AP 85", cost: 100, shot: 6},
            {des: "0.25 AP 100", cost: 140, shot: 7}
        ]
    },
    Precision: {
        Skill: "Passiv",
        des : "shot 1 CC:0.2"
    },
    Health_Plus: {
        Skill: "Passiv",
        des: "HPR 1"
    },
    Magic_Plus: {
        Skill: "Passiv",
        des: "APR 1"
    }
}