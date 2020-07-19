// 1，生成一张雷的地图
var mineSweepingMap = function (r, c, num) {
    var map = []
    // 给行数，生成一个 1 维数组
    var row = function (r) {
        for (var i = 0; i < r; i++) {
            map[i] = new Array()
        }
    }
    // 给列数，生成一个 2 维数组
    var column = function (col) {
        for (var i = 0; i < map.length; i++) {
            for (var j = 0; j < col; j++) {
                map[i][j] = 0
            }
        }
    }
    // 给列数和行数生成空地图
    var blankMap = function (r, col) {
        row(r)
        column(col)
    }

    // 给出地雷数量让后随机写入地雷
    var writeInMine = function (num) {
        // 随机位置写入
        var randomLocation = function () {
            var x = Math.floor(Math.random() * r)
            var y = Math.floor(Math.random() * c)
            if (map[x][y] !== 9) {
                map[x][y] = 9
            } else {
                randomLocation()
            }
        }
        for (var i = 0; i < num; i++) {
            randomLocation()
        }
    }

    // 使用循环给雷的边上所有数 +1 , 已经是雷的除外
    var plus = function (array, x, y) {
        if (x >= 0 && x < r && y >= 0 && y < c) {
            if (array[x][y] !== 9) {
                array[x][y] += 1
            }
        }
    }
    var newplus = function (array, x, y) {
        if (x >= 0 && x < r && y >= 0 && y < c) {
            if (array[x][y] !== 9) {
                array[x][y] =accAdd(array[x][y], 0.1)
            }
        }
    }
    var writeInHint = function () {
        for (var x = 0; x < map.length; x++) {
            for (var y = 0; y < map[0].length; y++) {
                if (map[x][y] === 9) {
                    plus(map, x + 1, y)
                    plus(map, x - 1, y)
                    plus(map, x, y + 1)
                    plus(map, x, y - 1)
                    newplus(map, x - 1, y + 1)
                    newplus(map, x - 1, y - 1)
                    newplus(map, x + 1, y + 1)
                    newplus(map, x + 1, y - 1)
                }
            }
        }
    }

    blankMap(r, c)
    writeInMine(num)
    writeInHint()
    return map
}

// 2，将雷写入页面
var writeHtml = function (map) {
    // 先通过 y轴数量写入 ul，然后通过 x轴上的数量写入 li
    var x = document.querySelector('.gameBox')
    for (var i = 0; i < map.length; i++) {
        x.innerHTML = x.innerHTML + `<ul class="row x-${i}" data-x="${i}"></ul>`
    }

    var z = document.querySelectorAll('.row')
    for (var i = 0; i < z.length; i++) {
        for (var j = 0; j < map[0].length; j++) {
            var m = map[i][j]
            var n
            switch (m) {
                case 0.0:
                    n = 0
                    m = ''
                    break;
                case 1:case (0.1):{
                    n = 1
                    break;
                }
                case 2:case (1.1):case (0.2):{
                    n = 2
                    break;
                }
                case 3:case (2.1):case (1.2):case (0.3):{
                    n = 3
                    break;
                }
                case 4:case (1.3):case (2.2):case (3.1):case (0.4):{
                    n = 4
                    break;
                }
                case (1.4):case (2.3):case (3.2):case (4.1):{
                    n = 5
                    break;
                }
                case (2.4):case (3.3):case (4.2):{
                    n = 6
                    break;
                }
                case (3.4):case (4.3):{
                    n = 7
                    break;
                }
                case 9:{
                    n = 9
                    break;
                }
                default:
                    n = 8
                    break;
            }
            z[i].innerHTML = z[i].innerHTML + `
                <li class="col y-${j} num-${n}" data-y="${j}">
                    <span>${m}</span>
                    <img src="flag.png" class="img-flag hide">
                </li>`
        }
    }
}

// 判断是否胜利
var changeClearMineNum = function (clearMineNum) {
    if (clearMineNum === ((col * row) - num)) {
        var all = document.querySelectorAll('.col')
        var allNum = 0
        var stop = setInterval(function () {
            var r = Math.floor(Math.random() * 256)
            var g = Math.floor(Math.random() * 256)
            var b = Math.floor(Math.random() * 256)
            //让格子呈现随机颜色
            all[allNum].children[0].style.opacity = `0`
            all[allNum].children[1].style.opacity = '0'
            all[allNum].style.background = `rgba(${r},${g},${b},0.6)`
            allNum++
            if (allNum === all.length) {
                clearInterval(stop)
                if (zz === 0) {
                    alert('恭喜你成功啦！你就是扫雷的king！')
                    initializeGame(row, col, num)
                }
                initializeGame(row, col, num)
            }
        }, 20)
    }
}

// 3，扫雷过程
var clearMine = function (row, col, num) {
    var clearMineNum = 0
    var makeWhite = function (x, y) {
        if (x < row && y < col && x >= 0 && y >= 0) {
            var el = document.querySelector(`.x-${x}`).children[y]
            if (el.style.background !== 'white') {
                el.style.background = 'white'
                el.children[0].style.opacity = '1'
                el.children[1].classList.add('hide')
                clearMineNum++
                changeClearMineNum(clearMineNum)
                if (el.innerText === '') {
                    showNoMine(x, y)
                }
            }
        }
    }
    // 智能扫雷
    var showNoMine = function (x, y) {
        makeWhite(x - 1, y + 1)
        makeWhite(x - 1, y - 1)
        makeWhite(x - 1, y)
        makeWhite(x + 1, y + 1)
        makeWhite(x + 1, y - 1)
        makeWhite(x + 1, y)
        makeWhite(x, y + 1)
        makeWhite(x, y - 1)
    }

    // 给所有方块绑定点击事件，点击显示数字，或者 boom
    var show = function () {
        var x = document.querySelectorAll('.row')
        for (var i = 0; i < x.length; i++) {
            x[i].addEventListener('click', function (event) {
                var el = event.target
                if (el.tagName != 'LI') {
                    // 因为事件委托的原因
                    // 如果点击到了 span 上面，那么就会出现 bug
                    // 所以如果点击到 span 上面，那么 el 就等于 span 的父节点
                    el = event.target.parentElement
                }
                // 已经被标记的不能点击
                var flag = el.children[1].classList.contains('hide')
                if (el.tagName === 'LI' && flag) {
                    if (el.children[0].innerText !== '9' && el.style.background !== 'white') {
                        el.children[0].style.opacity = '1'
                        el.style.background = 'white'
                        clearMineNum++
                        changeClearMineNum(clearMineNum)
                    } else if (el.children[0].innerText === '9') {
                        zz = 1
                        el.classList.add('boom')
                        alert('游戏失败，再来一次吧，这次一定能成功')
                        var all = document.querySelectorAll('.col')
                        var ff = []
                        var allNum = 0
                        for (var i = 0; i < all.length; i++) {
                            if (all[i].children[0].innerText === '9') {
                                ff[allNum] = all[i]
                                allNum++
                            }
                        }
                        allNum = 0
                        var time = 60
                        if (num > 50) {
                            time = 10
                        } else if (num > 10) {
                            time = 25
                        }
                        var stop = setInterval(function () {
                            ff[allNum].classList.add('boom')
                            allNum++
                            if (allNum === ff.length) {
                                clearInterval(stop)
                            }
                        }, time)
                    }
                    // 如果点击的方格为空（什么有没有），那么周围没有点开的空方格都会被点开
                    if (el.children[0].innerText === '') {
                        // 获取到位置
                        var x = parseInt(el.parentElement.dataset.x)
                        var y = parseInt(el.dataset.y)
                        showNoMine(x, y)
                    }
                }
            })
        }
        for (var i = 0; i < x.length; i++) {
            var mineNum = num
            x[i].addEventListener('contextmenu', function (event) {
                event.preventDefault();
                var btnNum = event.button
                var el = event.target
                if (el.tagName != 'LI') {
                    // 因为事件委托的原因
                    // 如果点击到了 span 上面，那么就会出现 bug
                    // 所以如果点击到 span 上面，那么 el 就等于 span 的父节点
                    el = event.target.parentElement
                }
                if (el.tagName === 'LI') {
                    var classList = el.children[1].classList
                    var residue = document.querySelector('.residue')
                    // 已经被点击过的地方不能标记
                    if (classList.contains('hide') && el.style.background !== 'white') {
                        if (mineNum !== 0) {
                            mineNum--
                        }
                        residue.innerText = `${mineNum}`
                        classList.remove('hide')
                    } else if (el.style.background !== 'white') {
                        classList.add('hide')
                        if (mineNum !== 40) {
                            mineNum++
                        }
                        residue.innerText = `${mineNum}`
                    }
                }
            })
        }
    }
    show()
}

// 4，清除画面，然后写入新的画面
var stopTime
var initializeGame = function (row, col, num) {
    var residue = document.querySelector('.residue')
    residue.innerText = `${num}`
    var time = document.querySelector('.tick')
    time.innerText = `0`
    var i = 1
    clearInterval(stopTime)
    stopTime = setInterval(function () {
        time.innerText = `${i++}`
    }, 1000)
    // zz
    zz = 0
    // 首先清除原来的地图，然后重新初始化
    var box = document.querySelector('.gameBox')
    box.innerHTML = ''
    var body = document.querySelector('body')
    body.style.minWidth = `${27 * col}px`
    var map = mineSweepingMap(row, col, num)
    writeHtml(map)
    clearMine(row, col, num)
}

// 5，选择游戏等级，给按钮绑定功能
var Btn = function () {
    var level = document.querySelectorAll('.choice-level')
    for (var i = 0; i < level.length; i++) {
        level[i].addEventListener('click', function (event) {
            var level = event.target.innerHTML
            if (level === '初级') {
                row = 9
                col = 9
                num = 10
                initializeGame(row, col, num)
            } else if (level === '中级') {
                row = 16
                col = 16
                num = 40
                initializeGame(row, col, num)
            } else if (level === '高级') {
                row = 16
                col = 30
                num = 99
                initializeGame(row, col, num)
            }
        })
    }
    var restart = document.querySelector('.restart')
    restart.addEventListener('click', function (event) {
        initializeGame(row, col, num)
    })
}
Btn()

// 6，初始数据
// zz 用来确定是否已经点到地雷
var zz = 0
var row = 16
var col = 16
var num = 40
initializeGame(row, col, num)


function accAdd(arg1,arg2){ 
var r1,r2,m;  
try{
r1=arg1.toString().split(".")[1].length
}catch(e){
r1=0}  try{
r2=arg2.toString().split(".")[1].length}catch(e){r2=0}  m=Math.pow(10,Math.max(r1,r2))  
return (arg1*m+arg2*m)/m
}

var myFunction=function(){
alert("简易版扫雷游戏规则\n每个数字个位部分表示格子上下左右存在的雷的数量\n小数部分表示其相邻四个角的格子存在的雷的数量");
}