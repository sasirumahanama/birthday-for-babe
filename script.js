const birthDate = new Date("2005-04-12T00:00:00");
const twentyFirstBirthday = new Date("2026-04-12T00:00:00");

const cdDays = document.getElementById("cd-days");
const cdHours = document.getElementById("cd-hours");
const cdMinutes = document.getElementById("cd-minutes");
const cdSeconds = document.getElementById("cd-seconds");

const ageYears = document.getElementById("age-years");
const ageMonths = document.getElementById("age-months");
const ageDays = document.getElementById("age-days");
const ageHours = document.getElementById("age-hours");
const ageMinutes = document.getElementById("age-minutes");
const ageSeconds = document.getElementById("age-seconds");

const birthdaySurprise = document.getElementById("birthdaySurprise");

function updateCountdown() {
  const now = new Date();
  const diff = twentyFirstBirthday - now;

  if (diff <= 0) {
    cdDays.textContent = 0;
    cdHours.textContent = 0;
    cdMinutes.textContent = 0;
    cdSeconds.textContent = 0;
    birthdaySurprise.classList.remove("hidden");
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  cdDays.textContent = days;
  cdHours.textContent = hours;
  cdMinutes.textContent = minutes;
  cdSeconds.textContent = seconds;
}

function getAgeDifference(fromDate, toDate) {
  let years = toDate.getFullYear() - fromDate.getFullYear();
  let months = toDate.getMonth() - fromDate.getMonth();
  let days = toDate.getDate() - fromDate.getDate();
  let hours = toDate.getHours() - fromDate.getHours();
  let minutes = toDate.getMinutes() - fromDate.getMinutes();
  let seconds = toDate.getSeconds() - fromDate.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes--;
  }

  if (minutes < 0) {
    minutes += 60;
    hours--;
  }

  if (hours < 0) {
    hours += 24;
    days--;
  }

  if (days < 0) {
    const prevMonth = new Date(toDate.getFullYear(), toDate.getMonth(), 0);
    days += prevMonth.getDate();
    months--;
  }

  if (months < 0) {
    months += 12;
    years--;
  }

  return { years, months, days, hours, minutes, seconds };
}

function updateAgeCounter() {
  const now = new Date();
  const age = getAgeDifference(birthDate, now);

  ageYears.textContent = age.years;
  ageMonths.textContent = age.months;
  ageDays.textContent = age.days;
  ageHours.textContent = age.hours;
  ageMinutes.textContent = age.minutes;
  ageSeconds.textContent = age.seconds;
}

updateCountdown();
updateAgeCounter();
setInterval(() => {
  updateCountdown();
  updateAgeCounter();
}, 1000);

const galleryGrid = document.getElementById("galleryGrid");
const slideshow = document.getElementById("slideshow");
const gridViewBtn = document.getElementById("gridViewBtn");
const slideViewBtn = document.getElementById("slideViewBtn");
const slideImage = document.getElementById("slideImage");
const prevSlide = document.getElementById("prevSlide");
const nextSlide = document.getElementById("nextSlide");

const galleryImages = [
  "1.jpeg",
  "2.jpeg",
  "3.jpeg",
  "4.jpeg",
  "5.jpeg",
  "6.jpeg",
  "7.jpeg",
  "8.jpeg",
];

let currentSlide = 0;

function showSlide(index) {
  if (index < 0) {
    currentSlide = galleryImages.length - 1;
  } else if (index >= galleryImages.length) {
    currentSlide = 0;
  } else {
    currentSlide = index;
  }

  slideImage.src = galleryImages[currentSlide];
}

gridViewBtn.addEventListener("click", () => {
  galleryGrid.classList.remove("hidden");
  slideshow.classList.add("hidden");
});

slideViewBtn.addEventListener("click", () => {
  galleryGrid.classList.add("hidden");
  slideshow.classList.remove("hidden");
  showSlide(currentSlide);
});

prevSlide.addEventListener("click", () => {
  showSlide(currentSlide - 1);
});

nextSlide.addEventListener("click", () => {
  showSlide(currentSlide + 1);
});

const puzzleBoard = document.getElementById("puzzle");
const shuffleBtn = document.getElementById("shuffleBtn");
const resetBtn = document.getElementById("resetBtn");
const puzzleMessage = document.getElementById("puzzleMessage");
const finalMessage = document.getElementById("finalMessage");

const gridSize = 3;
const totalTiles = gridSize * gridSize;
let tilesOrder = [];
let selectedIndex = null;

function createSolvedOrder() {
  return Array.from({ length: totalTiles }, (_, i) => i);
}

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function renderPuzzle() {
  puzzleBoard.innerHTML = "";

  tilesOrder.forEach((pieceIndex, boardIndex) => {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.dataset.boardIndex = boardIndex;
    tile.dataset.pieceIndex = pieceIndex;

    const row = Math.floor(pieceIndex / gridSize);
    const col = pieceIndex % gridSize;

    tile.style.backgroundPosition = `${col * 50}% ${row * 50}%`;

    if (selectedIndex === boardIndex) {
      tile.classList.add("selected");
    }

    tile.addEventListener("click", () => handleTileClick(boardIndex));
    puzzleBoard.appendChild(tile);
  });
}

function handleTileClick(index) {
  if (selectedIndex === null) {
    selectedIndex = index;
    renderPuzzle();
    return;
  }

  if (selectedIndex === index) {
    selectedIndex = null;
    renderPuzzle();
    return;
  }

  [tilesOrder[selectedIndex], tilesOrder[index]] = [tilesOrder[index], tilesOrder[selectedIndex]];
  selectedIndex = null;
  renderPuzzle();
  checkPuzzleSolved();
}

function checkPuzzleSolved() {
  const solved = tilesOrder.every((value, index) => value === index);

  if (solved) {
    puzzleMessage.textContent = "Puzzle completed successfully 🎉";
    finalMessage.classList.remove("hidden");
    createHeartBurst(window.innerWidth / 2, window.innerHeight / 2);
  } else {
    finalMessage.classList.add("hidden");
    puzzleMessage.textContent = "Complete the photo puzzle to unlock the sweet message ❤️";
  }
}

function initPuzzleSolved() {
  tilesOrder = createSolvedOrder();
  selectedIndex = null;
  finalMessage.classList.add("hidden");
  puzzleMessage.textContent = "Complete the photo puzzle to unlock the sweet message ❤️";
  renderPuzzle();
}

function initPuzzleShuffled() {
  const solved = createSolvedOrder();
  let shuffled = shuffleArray(solved);

  while (shuffled.every((value, index) => value === index)) {
    shuffled = shuffleArray(solved);
  }

  tilesOrder = shuffled;
  selectedIndex = null;
  finalMessage.classList.add("hidden");
  puzzleMessage.textContent = "Complete the photo puzzle to unlock the sweet message ❤️";
  renderPuzzle();
}

shuffleBtn.addEventListener("click", initPuzzleShuffled);
resetBtn.addEventListener("click", initPuzzleSolved);

initPuzzleShuffled();

const floatingHearts = document.getElementById("floatingHearts");

function spawnFloatingHeart() {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.textContent = Math.random() > 0.5 ? "💖" : "💕";
  heart.style.left = `${Math.random() * 100}vw`;
  heart.style.animationDuration = `${6 + Math.random() * 5}s`;
  heart.style.fontSize = `${16 + Math.random() * 18}px`;
  floatingHearts.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 12000);
}

setInterval(spawnFloatingHeart, 1000);

const heartBurstBtn = document.getElementById("heartBurstBtn");
const loveLetterBtn = document.getElementById("loveLetterBtn");
const loveLetterModal = document.getElementById("loveLetterModal");
const closeModal = document.getElementById("closeModal");

function createHeartBurst(x, y) {
  for (let i = 0; i < 18; i++) {
    const heart = document.createElement("div");
    heart.className = "burst-heart";
    heart.textContent = Math.random() > 0.5 ? "💖" : "💕";
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;

    const moveX = `${(Math.random() - 0.5) * 260}px`;
    const moveY = `${(Math.random() - 0.5) * 260}px`;

    heart.style.setProperty("--x", moveX);
    heart.style.setProperty("--y", moveY);

    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 1000);
  }
}

heartBurstBtn.addEventListener("click", (e) => {
  const rect = e.target.getBoundingClientRect();
  createHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
});

loveLetterBtn.addEventListener("click", () => {
  loveLetterModal.classList.remove("hidden");
});

closeModal.addEventListener("click", () => {
  loveLetterModal.classList.add("hidden");
});

loveLetterModal.addEventListener("click", (e) => {
  if (e.target === loveLetterModal) {
    loveLetterModal.classList.add("hidden");
  }
});