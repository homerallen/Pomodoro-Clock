$(document).ready(function() {
  var breakLength = 5;
  var sessionLength = 25;
  var sessionMin = 1;
  var sessionMax = 1000;
  var breakMin = 1;
  var breakMax = 1000;
  var breakOrSession = "Session";

  var pomodoroCountdown = new Timer({
    tick: 1,
    ontick: function() {
      updateCountdown();
      updateProgressCircle()
    },
    onend: function() {
      playSound();
      switchMode();
      updateCountdown();
      startClock();
    }
  });

  var circle = new ProgressBar.Circle(progressCircle, {
    strokeWidth: 6,
    easing: 'easeInOut',
    duration: 2000,
    color: '#EC0000',
    trailColor: '#aaa',
    trailWidth: 6,
    svgStyle: null
  });

  $("#breakMinus").click(function() {
    if (breakLength - 1 >= breakMin && (pomodoroCountdown.getStatus() !== "started" || breakOrSession !== "Break")) {
      breakLength--;
      $("#breakLength").text(breakLength);
      updateCountdown();
    }
  });

  $("#breakPlus").click(function() {
    if (breakLength + 1 <= breakMax && (pomodoroCountdown.getStatus() !== "started" || breakOrSession !== "Break")) {
      breakLength++;
      $("#breakLength").text(breakLength);
      updateCountdown();
    }
  });

  $("#sessionMinus").click(function() {
    if (sessionLength - 1 >= sessionMin && (pomodoroCountdown.getStatus() !== "started" || breakOrSession !== "Session")) {
      sessionLength--;
      $("#sessionLength").text(sessionLength);
      updateCountdown();
    }
  });

  $("#sessionPlus").click(function() {
    if (sessionLength + 1 <= sessionMax && (pomodoroCountdown.getStatus() !== "started" || breakOrSession !== "Session")) {
      sessionLength++;
      $("#sessionLength").text(sessionLength);
      updateCountdown();
    }
  });

  $("#clock").click(function() {
    if (pomodoroCountdown.getStatus() === "started") {
      pomodoroCountdown.pause();
    } else {
      startClock();
    }
  });

  function startClock() {
    if (breakOrSession === "Session") {
      pomodoroCountdown.start(toSeconds(sessionLength));
    } else if (breakOrSession === "Break") {
      pomodoroCountdown.start(toSeconds(breakLength));
    }
  }

  function toSeconds(minutes) {
    return minutes * 60;
  }

  function toMilliseconds(minutes) {
    return minutes * 60 * 1000;
  }

  function toMinutes(milliseconds) {
    return ((milliseconds / 1000) / 60);
  }

  function toHMSText(milliseconds) {
    var totalInHours = ((milliseconds / 1000) / 60) / 60;
    var hours = Math.floor(totalInHours);
    totalInHours -= hours;
    var minutes = Math.floor(totalInHours * 60);
    totalInHours -= minutes / 60;
    var seconds = Math.floor(totalInHours * 60 * 60);

    return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);

    function pad(d) {
      return (d < 10) ? '0' + d.toString() : d.toString();
    }

  }

  function updateCountdown() {
    if (pomodoroCountdown.getStatus() === "started") {
      $("#countdown").text(toHMSText(pomodoroCountdown.getDuration()));
    } else if (breakOrSession === "Session") {
      $("#countdown").text(toHMSText(toMilliseconds(sessionLength)));
    } else if (breakOrSession === "Break") {
      $("#countdown").text(toHMSText(toMilliseconds(breakLength)));
    }
  }

  function updateProgressCircle() {
    var percentComplete;

    if (breakOrSession === "Session") {
      percentComplete = toMinutes(pomodoroCountdown.getDuration()) / sessionLength;
    } else if (breakOrSession === "Break") {
      percentComplete = toMinutes(pomodoroCountdown.getDuration()) / breakLength;
    }

    circle.set(1 - percentComplete);
  }

  function switchMode() {
    if (breakOrSession === "Session") {
      breakOrSession = "Break";
    } else if (breakOrSession === "Break") {
      breakOrSession = "Session";
    }

    $("#breakOrSession").text(breakOrSession);
  }

  function playSound() {
    var audio = new Audio('http://www.homerallen.com/sounds/pomodoro-ding.wav');
    audio.play();
  }

  $("#breakLength").text(breakLength);
  $("#sessionLength").text(sessionLength);
  $("#breakOrSession").text(breakOrSession);
  updateCountdown();

});