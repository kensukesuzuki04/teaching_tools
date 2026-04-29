const courseInput = document.getElementById("courseInput");
const chartVersion = document.getElementById("chartVersion");
const noticeInput = document.getElementById("noticeInput");
const durationInput = document.getElementById("durationInput");

const courseTitle = document.getElementById("courseTitle");
const seatingChartImage = document.getElementById("seatingChartImage");
const chartCaption = document.getElementById("chartCaption");
const noticeText = document.getElementById("noticeText");

const applyBtn = document.getElementById("applyBtn");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");

const controlPanel = document.getElementById("controlPanel");
const preExamView = document.getElementById("preExamView");
const examView = document.getElementById("examView");
const timerDisplay = document.getElementById("timerDisplay");
const currentTime = document.getElementById("currentTime");

const chartMap = {
  "without-door": {
    src: "images/seating_chart.png",
    label: "without door"
  },
  "with-door": {
    src: "images/seating_chart_door_right.png",
    label: "with door on right"
  }
};

let countdownInterval = null;
let wallClockInterval = null;
let remainingSeconds = 120 * 60;

function formatHMS(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatClock(now) {
  return now.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

function applyPreview() {
  const course = courseInput.value.trim();
  const notice = noticeInput.value.trim();
  const selectedChart = chartMap[chartVersion.value];

  courseTitle.textContent = course || "Course Number";
  noticeText.textContent = notice || "Instructions will be displayed here.";

  seatingChartImage.src = selectedChart.src;
  chartCaption.textContent = selectedChart.label;
}

function stopIntervals() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  if (wallClockInterval) {
    clearInterval(wallClockInterval);
    wallClockInterval = null;
  }
}

function startExam() {
  const durationMinutes = Number(durationInput.value);
  if (!Number.isFinite(durationMinutes) || durationMinutes < 1) {
    alert("Please enter an exam duration of at least 1 minute.");
    return;
  }

  applyPreview();
  remainingSeconds = Math.floor(durationMinutes * 60);

  preExamView.classList.add("hidden");
  controlPanel.classList.add("hidden");
  examView.classList.remove("hidden");

  timerDisplay.textContent = formatHMS(remainingSeconds);
  currentTime.textContent = formatClock(new Date());

  stopIntervals();

  wallClockInterval = setInterval(() => {
    currentTime.textContent = formatClock(new Date());
  }, 1000);

  countdownInterval = setInterval(() => {
    remainingSeconds -= 1;
    if (remainingSeconds <= 0) {
      remainingSeconds = 0;
      timerDisplay.textContent = formatHMS(remainingSeconds);
      stopIntervals();
      return;
    }
    timerDisplay.textContent = formatHMS(remainingSeconds);
  }, 1000);
}

function resetToPreExam() {
  stopIntervals();
  examView.classList.add("hidden");
  preExamView.classList.remove("hidden");
  controlPanel.classList.remove("hidden");
  applyPreview();
}

function enterFullscreen() {
  const root = document.documentElement;
  if (!document.fullscreenElement && root.requestFullscreen) {
    root.requestFullscreen();
  }
}

applyBtn.addEventListener("click", applyPreview);
startBtn.addEventListener("click", startExam);
resetBtn.addEventListener("click", resetToPreExam);
chartVersion.addEventListener("change", applyPreview);
fullscreenBtn.addEventListener("click", enterFullscreen);

applyPreview();
