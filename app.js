const courseInput = document.getElementById("courseInput");
const chartVersion = document.getElementById("chartVersion");
const noticeInput = document.getElementById("noticeInput");
const durationInput = document.getElementById("durationInput");

const courseTitle = document.getElementById("courseTitle");
const seatingChartImage = document.getElementById("seatingChartImage");
const noticeText = document.getElementById("noticeText");

const completeBtn = document.getElementById("completeBtn");
const backToSettingsBtn = document.getElementById("backToSettingsBtn");
const startFromPreviewBtn = document.getElementById("startFromPreviewBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");

const examApp = document.getElementById("examApp");
const controlPanel = document.getElementById("controlPanel");
const preExamView = document.getElementById("preExamView");
const preExamActions = document.getElementById("preExamActions");
const examView = document.getElementById("examView");
const timerDisplay = document.getElementById("timerDisplay");
const currentTime = document.getElementById("currentTime");
const examNoticeText = document.getElementById("examNoticeText");
const editInstructionsBtn = document.getElementById("editInstructionsBtn");
const examInstructionEditor = document.getElementById("examInstructionEditor");
const examNoticeInput = document.getElementById("examNoticeInput");
const saveExamInstructionsBtn = document.getElementById("saveExamInstructionsBtn");

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

function formatCurrentTimeLabel(now) {
  return `Current time: ${formatClock(now)}`;
}

function applyPreview() {
  const course = courseInput.value.trim();
  const notice = noticeInput.value.trim();
  const selectedChart = chartMap[chartVersion.value];

  courseTitle.textContent = course || "Course Number";
  noticeText.textContent = notice;
  examNoticeText.textContent = notice;
  examNoticeInput.value = notice;

  seatingChartImage.src = selectedChart.src;
}

function showPreviewOnly() {
  applyPreview();
  controlPanel.classList.add("hidden");
  preExamActions.classList.remove("hidden");
  examApp.classList.add("preview-only");
}

function showSettings() {
  controlPanel.classList.remove("hidden");
  preExamActions.classList.add("hidden");
  examApp.classList.remove("preview-only");
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
  preExamActions.classList.add("hidden");
  examApp.classList.add("preview-only");
  examView.classList.remove("hidden");

  timerDisplay.textContent = formatHMS(remainingSeconds);
  currentTime.textContent = formatCurrentTimeLabel(new Date());

  stopIntervals();

  wallClockInterval = setInterval(() => {
    currentTime.textContent = formatCurrentTimeLabel(new Date());
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
  examInstructionEditor.classList.add("hidden");
  showSettings();
}

function toggleExamInstructionEditor() {
  examInstructionEditor.classList.toggle("hidden");
}

function saveExamInstructions() {
  const updatedNotice = examNoticeInput.value.trim();
  noticeInput.value = updatedNotice;
  noticeText.textContent = updatedNotice;
  examNoticeText.textContent = updatedNotice;
  examInstructionEditor.classList.add("hidden");
}

function enterFullscreen() {
  const root = document.documentElement;
  if (!document.fullscreenElement && root.requestFullscreen) {
    root.requestFullscreen();
  }
}

completeBtn.addEventListener("click", showPreviewOnly);
backToSettingsBtn.addEventListener("click", showSettings);
startFromPreviewBtn.addEventListener("click", startExam);
chartVersion.addEventListener("change", applyPreview);
fullscreenBtn.addEventListener("click", enterFullscreen);
editInstructionsBtn.addEventListener("click", toggleExamInstructionEditor);
saveExamInstructionsBtn.addEventListener("click", saveExamInstructions);

applyPreview();
