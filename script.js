
let buttons = document.querySelectorAll("button");
let paused = false;
let on = false;
let onBreak = false;
let workMinutes = 25;
const timerTime = document.querySelector('#time')
let interval;
var beepSound = new sound("beep-short.mp3");



updateValueText(convertSecToTime(workMinutes * 60), timerTime)

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
  }

function handleClick(e) {
    console.log(e.currentTarget.id);
    e.currentTarget.id == 'workTimeInc' ? handleIncrementing('work', '+') :
    e.currentTarget.id == 'workTimeDec' ? handleIncrementing('work', '-') :
    e.currentTarget.id == 'breakTimeInc' ? handleIncrementing('break', '+') :
    e.currentTarget.id == 'breakTimeDec' ? handleIncrementing('break', '-') : 
    e.currentTarget.id == 'startBtn' ? startTimer() : 
    e.currentTarget.id == 'pauseBtn' ? pauseTimer() : 
    e.currentTarget.id == 'stopBtn' ? stopTimer() : 
    e.currentTarget.id == 'resetBtn' ? stopTimer() : '';
}

function handleIncrementing(type, incType) {
    realType = type.concat('Time') // workTime or breakTime
    if (incType == '+') {
        updateValueText(parseInt(document.getElementById(realType).innerText) + 1, document.getElementById(realType))
    } else if (incType == '-') {
        if (document.getElementById(realType).innerText > 1 ) {
            updateValueText(parseInt(document.getElementById(realType).innerText) - 1, document.getElementById(realType))
        }
    }

    if (on == false && type == 'work') {
        updateValueText(convertSecToTime(parseInt(document.getElementById(realType).innerText * 60)), timerTime)
    }
}

function updateValueText(value, textNode) {
    textNode.innerText = value;
}

function convertSecToTime(seconds) {
    let h = Math.floor(seconds / 3600).toString();
    let m = Math.floor(seconds % 3600 / 60).toString();
    let s = Math.floor(seconds % 60).toString();
    let time = [h, m, s]
    let newTime = []
    time.forEach(function(element) {
        if (element.length == 1) {
            newElement = '0' + element;
        } else {
            newElement = element;
        }
        newTime.push(newElement)
    })
    totalSeconds = seconds;
    return newTime[0] + ':' + newTime[1] + ':' + newTime[2]
}

function convertTimeToSec(time) {
    return parseInt(time.slice(0, 2) * 3600) + parseInt(time.slice(3, 5) * 60) + parseInt(time.slice(6, 8));
}


function startTimer() {
    on = true;
    paused = false;
    if (interval == null) {
        updateValueText(convertSecToTime(convertTimeToSec(timerTime.innerText) - 1), timerTime)
        interval = setInterval(function() {
            if (onBreak == false) {
                if (convertTimeToSec(timerTime.innerText) > 0) {
                    updateValueText(convertSecToTime(convertTimeToSec(timerTime.innerText) - 1), timerTime)
                } else {
                    startBreak()
                }
            } else {
                if (convertTimeToSec(timerTime.innerText) > 0) {
                    updateValueText(convertSecToTime(convertTimeToSec(timerTime.innerText) - 1), timerTime)
                } else {
                    endBreak()
                }
            }
            console.log(interval)
        }, 1000);
    }
}

function pauseTimer() {
    paused = true;
    clearInterval(interval);
    interval = null;
    console.log(interval);
}

function stopTimer() {
    on = false;
    paused = false;
    clearInterval(interval);
    interval = null;
    updateValueText(convertSecToTime(document.getElementById('workTime').innerText * 60), timerTime);
    updateValueText('Work work', document.getElementById('segType'))
}

function startBreak() {
    document.getElementById('segType').innerText = 'Break time';
    onBreak = true;
    updateValueText(convertSecToTime(document.getElementById('breakTime').innerText * 60), timerTime);
    beepSound.play()
}

function endBreak() {
    document.getElementById('segType').innerText = 'Work work';
    onBreak = false;
    updateValueText(convertSecToTime(document.getElementById('workTime').innerText * 60), timerTime);
    beepSound.play()
}

for (let i=0; i<buttons.length; i++) {
    buttons[i].addEventListener("click", handleClick)
}
