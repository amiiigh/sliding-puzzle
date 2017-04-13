var about = document.getElementById('about');
var play = document.getElementById('play');
var span = document.getElementsByClassName("close")[0];
var cancel = document.getElementById("cancel");
var cancel2 = document.getElementById("cancel2");
var gameContainer = document.getElementById("game-container");
var username;
var difficulty;
var size;
var time=0;
var slideCounts = 0;
var clock;
var numbers = [];
var mode = "click";
var isSolved = false;
var clockStarted = false;
var answerEight = [1,2,3,4,5,6,7,8,1000];
var answerFif  = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,1000];

function validateUsername() {
    var val = document.getElementById('input-username').value;

    if (!val.match(/^[a-z]+$/))
    {
        alert('Only alphabets are allowed');
        document.getElementById('input-username').value = "";
        return false;
    }

    return true;
}

function countNumberOfInversion(list) {
    var totalInversion =0;
    for(var i =0; i< list.length ;i++)
    {
        var inv = 0;
        if (numbers[i] == 1000)
            continue;
        if (i == list.length -1)
            break;
        for(var j=i+1; j<list.length;j++){
            if (numbers[j] == 1000)
                continue;
            if (list[j] < list[i])
                inv ++;
        }
        totalInversion +=inv;
    }
    return totalInversion;
}

function isOdd(number) {
    if (number %2 == 1)
        return true;
    else
        return false;
}

function isEven(number) {
    if (number %2 ==0)
        return true;
    else
        return false;
}

function getRowIndexOfBlankTile(list) {
    var blankTileIndex = list.length - 1 -list.indexOf(1000);
    var rowIndex ;
    if (size == 3){
        rowIndex = Math.floor(blankTileIndex/3)+1;
    }
    else{
        rowIndex = Math.floor(blankTileIndex/4)+1;
    }
    return rowIndex;
}

function isSolvable(list) {
    console.log("is solved");
    if (list.length == 0)
        return false;
    var numberOfInversion = countNumberOfInversion(list);
    if (size == "3"){
        return isEven(numberOfInversion);
    }
    else{
        if (isOdd(numberOfInversion) && isEven(getRowIndexOfBlankTile(list))){
            return true;
        }
        else if (isEven(numberOfInversion) && isOdd(getRowIndexOfBlankTile(list))){
            return true;
        }
        else
            return false;

    }
}

function setUserInputs(modal) {
    username = document.getElementById("input-username").value;
    if (modal == 2)
    {
        difficulty = document.getElementById("level-difficulty2")
            .options[document.getElementById("level-difficulty2").selectedIndex].value;
        size = document.getElementById("puzzle-size2")
            .options[document.getElementById("puzzle-size2").selectedIndex].value;
    }
    else {
        difficulty = document.getElementById("level-difficulty")
            .options[document.getElementById("level-difficulty").selectedIndex].value;
        size = document.getElementById("puzzle-size")
            .options[document.getElementById("puzzle-size").selectedIndex].value;
    }
}

function resetGameConatainer() {
    gameContainer.innerHTML = "";
}

function showGameStat() {
    gameContainer.innerHTML =  "<div class='game-stat card'> " +
        "<div class='col-md-4' id='slides'>" +
        "<strong> Slide counts :</strong> 0 " +
        "</div> " +
        "<div class='col-md-4' id='timer'>" +
        "<strong>Timer:</strong>" +time + "(s)"+
        "</div>" +
        " <div class='col-md-4'>" +
        "<strong>Level:" +
        "</strong>" +gameDiff(difficulty)+
        "</div>" +
        " <br> " +
        "</div>";
}

function finishGame() {
    stopTimer();
    gameContainer.innerHTML ="";
    if (isSolved){
        gameContainer.innerHTML = "<div class='card'><div class='alert alert-success'>DEAR <strong>"+ username +" YOU WON</strong> in <strong>"+ slideCounts + "</strong> slides </div></div>";
    }
    else{
        gameContainer.innerHTML = "<div class='card'><div class='alert alert-danger'> <strong> YOU FAILED IDIOT <br> number of slides :"+slideCounts+"</strong></div></div>";
    }
}

function updateTimer() {
    time--;
    var timer = document.getElementById("timer");
    timer.innerHTML = "<strong>Timer:</strong>"+ time + "(s)";
    if (time == 0){
        finishGame();
    }
}

function updateSlides() {
    slideCounts++;
    var slides = document.getElementById("slides");
    slides.innerHTML = "<strong>Slide counts :</strong>"+ slideCounts;
}

function generatePuzzle() {
    while (true)
    {
        numbers = shuffle(numbers);
        console.log("shuffle");
        if (isSolvable(numbers)) {
            break;
        }
    }
}

function renderPuzzle() {
    var board;
    if (size == "3"){
        board = "<div class='puzzle-board-8'>";
        for(var i=0;i<numbers.length;i++){
            if (numbers[i] == 1000 )
                board +="<div class='tile tile-"+(i+1).toString()+ "' id='blank'></div>";
            else
                board +="<div value='"+numbers[i].toString() +"' class='tile tile-"+(i+1).toString()+ " tile-color-" + numbers[i].toString() +"' onclick='moveTile("+i.toString()+")' id='tile-"+numbers[i].toString()+"'>"+numbers[i].toString()+"</div>"
        }
        board += "</div>";
    }
    else{
        board = "<div class='puzzle-board-15'>";
        for(var i=0;i<numbers.length;i++){
            if (numbers[i] == 1000 )
                board +="<div class='tile tile-"+(i+1).toString()+ "' id='blank'></div>";
            else
                board +="<div value='"+numbers[i].toString() +"' class='tile tile-"+(i+1).toString()+ " tile-color-" + numbers[i].toString() +"' onclick='moveTile("+i.toString()+")' id='tile-"+numbers[i].toString()+"'>"+numbers[i].toString()+"</div>"
        }
        board += "</div>";
    }
    gameContainer.innerHTML += board;
}

function getIndexOfNeighbor(tile) {
    var neighbor=[];
    var s = parseInt(size);
    var top = tile - s;
    var down = tile + s;
    var right = tile + 1;
    var left = tile -1;
    if (top > -1)
        neighbor.push(top);
    if (down < s*s)
        neighbor.push(down);
    if (Math.floor(tile/s) == Math.floor(right/s) && right<s*s)
        neighbor.push(right);
    if (Math.floor(tile/s) == Math.floor(left/s) && left>-1)
        neighbor.push(left);
    return neighbor;
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function startTimer() {
    if(clockStarted == false)
        clock = setInterval(updateTimer, 1000);
}

function stopTimer() {
    clearInterval(clock);
    clockStarted = false;
}

function setCountDownTimer() {
    if (difficulty == "0"){
        time = 300;
    }
    else if (difficulty == "1")
    {
        time = 120;
    }
    else
        time = 60;
}

function setInitNumber() {
    if (size == "3")
        numbers = [1,2,3,4,5,6,7,8,1000];
    else
        numbers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,1000];
}

function resetSlides() {
    slideCounts = 0;
}

function gameDiff(num) {
    if(num == 0){
        return "Beginner";
    }
    else if (num == 1){
        return "Intermediate";
    }
    else{
        return "Hard";
    }
}

function startGame(modal) {
    setUserInputs(modal);
    if(modal == 1)
        hideModal("myModal");
    else
        hideModal("myModal2");
    resetGameConatainer();
    showGameStat();
    setCountDownTimer();
    resetSlides();
    setInitNumber();
    generatePuzzle();
    renderPuzzle();
}

function swap(tile,blank) {
    var tempTop = window.getComputedStyle(tile, null).getPropertyValue("top");
    var tempLeft = window.getComputedStyle(tile, null).getPropertyValue("left");
    tile.style.top = window.getComputedStyle(blank, null).getPropertyValue("top");
    tile.style.left = window.getComputedStyle(blank, null).getPropertyValue("left");
    blank.style.top = tempTop;
    blank.style.left = tempLeft;
}

function swapArray(tileIndex, blankIndex) {
    var temp = numbers[tileIndex];
    numbers[tileIndex] = 1000;
    numbers[blankIndex] = temp;
}

function checkSolve() {
    for(var i=0;i < numbers.length;i++)
    {
        var temp = i+1;
        if (i == numbers.length -1)
            temp = 1000;
        if ( temp != numbers[i])
            return false;
    }
    isSolved = true;
    finishGame()
}

function updateBoard() {
    for(var i=0;i<numbers.length-1;i++){
        if (numbers[i] == 1000)
            continue;
        var el = document.getElementById("tile-"+(i+1).toString());
        var elIndex = numbers.indexOf(i+1);
        el.setAttribute("onclick","moveTile("+elIndex.toString()+")");
    }
}

function moveTile(tile) {
    if(isValidMove(tile)){
        if(clockStarted == false)
        {
            startTimer();
            clockStarted = true;
        }
        var tileEl = document.getElementById("tile-"+numbers[tile]);
        var blankTile = document.getElementById("blank");
        swap(tileEl,blankTile);
        swapArray(tile,numbers.indexOf(1000));
        updateBoard();
        updateSlides();
        checkSolve();
    }
    else{
        console.log("not valid move");
    }
}

function isValidMove(tile) {
    var blankIndex = numbers.indexOf(1000);
    var neighbors = getIndexOfNeighbor(blankIndex);
    return neighbors.indexOf(tile) != -1;
}

function resetGame() {
    stopTimer();
    resetGameConatainer();
    isSolved = false;
    document.getElementById("myModal2").style.display = "block";
}

function toggleMode() {
    var modebtn = document.getElementById("mode");
    if (modebtn.getAttribute("mode") == "touch"){
        modebtn.setAttribute("mode","click");
        modebtn.innerHTML = "Click mode";
        mode = "touch";
    }
    else if (modebtn.getAttribute("mode") == "click"){
        modebtn.setAttribute("mode","touch");
        modebtn.innerHTML = "Touch mode";
        mode = "click";
    }
}

function showAbout() {
    about.style.display = "block";
}

function hideAbout() {
    about.style.display = "none";
}

function showModal(modal) {
    document.getElementById(modal).style.display = "block";
}

function hideModal(modal) {
    document.getElementById(modal).style.display = "none";
}

function init() {
    showModal("myModal");
}

span.onclick = function() {
    hideModal("myModal");
};

play.onclick = function () {
    showModal("myModal");
    hideAbout();
};

cancel.onclick = function () {
    hideModal("myModal");
    showAbout();
};
cancel2.onclick = function () {
    hideModal("myModal2");
    showAbout();
};

document.onclick = function(event) {
    if (event.target == document.getElementById("myModal")) {
        hideModal("myModal")
    }
};