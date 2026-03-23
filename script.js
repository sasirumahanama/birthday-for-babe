import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  runTransaction,
  query,
  limitToLast
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAnWiJZNh29LgRsGCIDrw_-cTIVrTUJKts",
  authDomain: "babe-212c0.firebaseapp.com",
  databaseURL: "https://babe-212c0-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "babe-212c0",
  storageBucket: "babe-212c0.firebasestorage.app",
  messagingSenderId: "745932002622",
  appId: "1:745932002622:web:3ede2935c68473dd1a086f",
  measurementId: "G-0CG20H2P01"
};

const firebaseReady = true;

/* =========================
   DATES
   ========================= */
const anniversaryDate = new Date("2025-03-01T00:00:00");
const menuriBirthMonth = 3;
const menuriBirthDay = 12;

/* =========================
   BIRTHDAY WISHES
   ========================= */
const birthdayWishes = [
  {
    age: 21,
    unlockDate: "2026-04-12T00:00:00",
    title: "21st Birthday Wish From Boo Boo 🎂❤️",
    text: "Happy 21st birthday my love. You make my life softer, brighter, and more beautiful every single day. Thank you for being my peace, my happiness, and the most precious part of my world. I love you so much Mage Manika. ❤️"
  },
  {
    age: 22,
    unlockDate: "2027-04-12T00:00:00",
    title: "22nd Birthday Wish From Boo Boo 🎉❤️",
    text: "Another beautiful year of loving you, cherishing you, and being grateful for you. Happy 22nd birthday my Manika. No matter how many birthdays pass, my heart will still choose you again and again. ❤️"
  }
];

/* =========================
   DOM
   ========================= */
const annYears = document.getElementById("ann-years");
const annMonths = document.getElementById("ann-months");
const annDays = document.getElementById("ann-days");
const annHours = document.getElementById("ann-hours");
const annMinutes = document.getElementById("ann-minutes");
const annSeconds = document.getElementById("ann-seconds");

const menuriDays = document.getElementById("menuri-days");
const menuriHours = document.getElementById("menuri-hours");
const menuriMinutes = document.getElementById("menuri-minutes");
const menuriSeconds = document.getElementById("menuri-seconds");
const menuriBirthdayLabel = document.getElementById("menuriBirthdayLabel");

const birthdayLocked = document.getElementById("birthdayLocked");
const birthdaySurprise = document.getElementById("birthdaySurprise");
const currentWishTitle = document.getElementById("currentWishTitle");
const currentWishText = document.getElementById("currentWishText");
const birthdayArchiveList = document.getElementById("birthdayArchiveList");

const galleryGrid = document.getElementById("galleryGrid");
const slideshow = document.getElementById("slideshow");
const gridViewBtn = document.getElementById("gridViewBtn");
const slideViewBtn = document.getElementById("slideViewBtn");
const slideImage = document.getElementById("slideImage");
const prevSlide = document.getElementById("prevSlide");
const nextSlide = document.getElementById("nextSlide");

const puzzleBoard = document.getElementById("puzzle");
const shuffleBtn = document.getElementById("shuffleBtn");
const resetBtn = document.getElementById("resetBtn");
const puzzleMessage = document.getElementById("puzzleMessage");
const finalMessage = document.getElementById("finalMessage");

const floatingHearts = document.getElementById("floatingHearts");

const heartBurstBtn = document.getElementById("heartBurstBtn");
const loveLetterBtn = document.getElementById("loveLetterBtn");
const loveLetterModal = document.getElementById("loveLetterModal");
const closeModal = document.getElementById("closeModal");

const actionButtons = document.querySelectorAll(".action-btn");
const firebaseStatus = document.getElementById("firebaseStatus");

const countWantHug = document.getElementById("count-wantHug");
const countWantKiss = document.getElementById("count-wantKiss");
const countWantTo = document.getElementById("count-wantTo");
const countMissYou = document.getElementById("count-missYou");
const countLoveYou = document.getElementById("count-loveYou");
const countKillYou = document.getElementById("count-killYou");

const liveNotification = document.getElementById("liveNotification");
const notificationTitle = document.getElementById("notificationTitle");
const notificationText = document.getElementById("notificationText");
const historyList = document.getElementById("historyList");

const historyPrevBtn = document.getElementById("historyPrevBtn");
const historyNextBtn = document.getElementById("historyNextBtn");
const historyTodayBtn = document.getElementById("historyTodayBtn");
const historyDateLabel = document.getElementById("historyDateLabel");

const identityModal = document.getElementById("identityModal");
const chooseSasiru = document.getElementById("chooseSasiru");
const chooseMenuri = document.getElementById("chooseMenuri");

const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");

/* =========================
   GENERAL
   ========================= */
const galleryImages = [
  "1.jpeg",
  "2.jpeg",
  "3.jpeg",
  "4.jpeg",
  "5.jpeg",
  "6.jpeg",
  "7.jpeg",
  "8.jpeg"
];

const gridSize = 3;
const totalTiles = gridSize * gridSize;

let currentSlide = 0;
let slideshowInterval = null;
let tilesOrder = [];
let selectedIndex = null;
let currentUser = localStorage.getItem("coupleSiteUser") || "";
let lastSeenHistoryId = null;
let db = null;
let allHistoryItems = [];
let selectedHistoryDate = new Date();

/* Swipe state */
let touchStartX = 0;
let touchEndX = 0;

/* =========================
   HELPERS
   ========================= */
function setText(element, value) {
  if (element) element.textContent = value;
}

function pad(num) {
  return String(num).padStart(2, "0");
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function formatFriendlyTime(ts) {
  const date = new Date(ts);
  const now = new Date();

  const startToday = startOfDay(now);
  const startYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

  const timePart = date.toLocaleTimeString("en-LK", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });

  if (date >= startToday) {
    return `Today ${timePart}`;
  }

  if (date >= startYesterday && date < startToday) {
    return `Yesterday ${timePart}`;
  }

  return date.toLocaleString("en-LK", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
}

function formatOnlyTime(ts) {
  return new Date(ts).toLocaleTimeString("en-LK", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
}

function getHistoryDateLabel(date) {
  const today = startOfDay(new Date());
  const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);

  if (sameDay(date, today)) {
    return "Today";
  }

  if (sameDay(date, yesterday)) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-LK", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
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

function updateAnniversaryCounter() {
  const now = new Date();
  const diff = getAgeDifference(anniversaryDate, now);

  setText(annYears, diff.years);
  setText(annMonths, diff.months);
  setText(annDays, diff.days);
  setText(annHours, pad(diff.hours));
  setText(annMinutes, pad(diff.minutes));
  setText(annSeconds, pad(diff.seconds));
}

function getNextBirthdayTarget(monthIndex, day) {
  const now = new Date();
  const thisYearTarget = new Date(now.getFullYear(), monthIndex, day, 0, 0, 0);

  if (now < thisYearTarget) {
    return thisYearTarget;
  }

  return new Date(now.getFullYear() + 1, monthIndex, day, 0, 0, 0);
}

function updateCountdown(targetDate, dayEl, hourEl, minEl, secEl) {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    setText(dayEl, "0");
    setText(hourEl, "00");
    setText(minEl, "00");
    setText(secEl, "00");
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  setText(dayEl, days);
  setText(hourEl, pad(hours));
  setText(minEl, pad(minutes));
  setText(secEl, pad(seconds));
}

function updateBirthdayCounter() {
  const menuriTarget = getNextBirthdayTarget(menuriBirthMonth, menuriBirthDay);

  updateCountdown(menuriTarget, menuriDays, menuriHours, menuriMinutes, menuriSeconds);

  setText(
    menuriBirthdayLabel,
    `Counting down to ${menuriTarget.toLocaleDateString("en-LK", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })} at 12:00 AM`
  );
}

function updateCurrentBirthdayWish() {
  const now = new Date();

  const unlockedWishes = birthdayWishes
    .filter((wish) => now >= new Date(wish.unlockDate))
    .sort((a, b) => new Date(b.unlockDate) - new Date(a.unlockDate));

  if (unlockedWishes.length === 0) {
    birthdayLocked.classList.remove("hidden");
    birthdaySurprise.classList.add("hidden");
    return;
  }

  const latestWish = unlockedWishes[0];
  birthdayLocked.classList.add("hidden");
  birthdaySurprise.classList.remove("hidden");

  setText(currentWishTitle, latestWish.title);
  setText(currentWishText, latestWish.text);
}

function renderBirthdayArchive() {
  const now = new Date();
  birthdayArchiveList.innerHTML = "";

  birthdayWishes
    .sort((a, b) => new Date(a.unlockDate) - new Date(b.unlockDate))
    .forEach((wish) => {
      const unlockDate = new Date(wish.unlockDate);
      const isUnlocked = now >= unlockDate;

      const card = document.createElement("div");
      card.className = "archive-card";

      if (isUnlocked) {
        card.innerHTML = `
          <h3>${wish.title}</h3>
          <div class="archive-meta">
            Unlocked on ${unlockDate.toLocaleDateString("en-LK", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })} at 12:00 AM
          </div>
          <p class="small-text">${wish.text}</p>
        `;
      } else {
        card.innerHTML = `
          <h3>${wish.title}</h3>
          <div class="archive-meta">
            This message will appear at ${unlockDate.toLocaleDateString("en-LK", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })} midnight
          </div>
          <p class="small-text">
            A special birthday message from her Boo Boo will unlock on this day ❤️
          </p>
        `;
      }

      birthdayArchiveList.appendChild(card);
    });
}

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

    setTimeout(() => heart.remove(), 1000);
  }
}

function spawnFloatingHeart() {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.textContent = Math.random() > 0.5 ? "💖" : "💕";
  heart.style.left = `${Math.random() * 100}vw`;
  heart.style.animationDuration = `${6 + Math.random() * 5}s`;
  heart.style.fontSize = `${16 + Math.random() * 18}px`;
  floatingHearts.appendChild(heart);

  setTimeout(() => heart.remove(), 12000);
}

/* =========================
   IDENTITY
   ========================= */
function openIdentityModal() {
  identityModal.classList.remove("hidden");
  identityModal.setAttribute("aria-hidden", "false");
}

function closeIdentityModal() {
  identityModal.classList.add("hidden");
  identityModal.setAttribute("aria-hidden", "true");
}

function setCurrentUser(name) {
  currentUser = name;
  localStorage.setItem("coupleSiteUser", name);
  closeIdentityModal();
}

function ensureIdentity() {
  if (!currentUser) {
    openIdentityModal();
  }
}

/* =========================
   GALLERY
   ========================= */
function showSlide(index) {
  if (index < 0) {
    currentSlide = galleryImages.length - 1;
  } else if (index >= galleryImages.length) {
    currentSlide = 0;
  } else {
    currentSlide = index;
  }

  slideImage.src = galleryImages[currentSlide];
  slideImage.alt = `Memory ${currentSlide + 1}`;
}

function startSlideshowAutoPlay() {
  stopSlideshowAutoPlay();
  slideshowInterval = setInterval(() => {
    if (!slideshow.classList.contains("hidden")) {
      showSlide(currentSlide + 1);
    }
  }, 3000);
}

function stopSlideshowAutoPlay() {
  if (slideshowInterval) {
    clearInterval(slideshowInterval);
    slideshowInterval = null;
  }
}

function enableGridView() {
  galleryGrid.classList.remove("hidden");
  slideshow.classList.add("hidden");
  stopSlideshowAutoPlay();
}

function enableSlideView() {
  galleryGrid.classList.add("hidden");
  slideshow.classList.remove("hidden");
  showSlide(currentSlide);
  startSlideshowAutoPlay();
}

function handleSwipe() {
  const swipeDistance = touchEndX - touchStartX;

  if (Math.abs(swipeDistance) < 50) return;

  if (swipeDistance < 0) {
    showSlide(currentSlide + 1);
  } else {
    showSlide(currentSlide - 1);
  }
}

/* =========================
   HISTORY BY DATE
   ========================= */
function renderHistoryDateLabel() {
  setText(historyDateLabel, getHistoryDateLabel(startOfDay(selectedHistoryDate)));
}

function renderHistoryForSelectedDate() {
  renderHistoryDateLabel();

  if (!allHistoryItems.length) {
    historyList.innerHTML = `<div class="history-empty">No love actions yet.</div>`;
    return;
  }

  const selectedDay = startOfDay(selectedHistoryDate);

  const filtered = allHistoryItems
    .filter((item) => sameDay(new Date(item.timestamp), selectedDay))
    .sort((a, b) => b.timestamp - a.timestamp);

  if (!filtered.length) {
    historyList.innerHTML = `<div class="history-empty">No love actions on this day.</div>`;
  } else {
    historyList.innerHTML = "";

    filtered.forEach((item) => {
      const div = document.createElement("div");
      div.className = "history-item";
      div.innerHTML = `
        <div class="history-title">${item.from} ${getHistoryLabel(item.action)}</div>
        <div class="history-time">${formatOnlyTime(item.timestamp)}</div>
      `;
      historyList.appendChild(div);
    });
  }

  const today = startOfDay(new Date());
  historyNextBtn.disabled = selectedDay >= today;
  historyNextBtn.style.opacity = historyNextBtn.disabled ? "0.5" : "1";
  historyNextBtn.style.cursor = historyNextBtn.disabled ? "not-allowed" : "pointer";
}

function goToPreviousHistoryDate() {
  selectedHistoryDate = new Date(
    selectedHistoryDate.getFullYear(),
    selectedHistoryDate.getMonth(),
    selectedHistoryDate.getDate() - 1
  );
  renderHistoryForSelectedDate();
}

function goToNextHistoryDate() {
  const today = startOfDay(new Date());
  const nextDate = new Date(
    selectedHistoryDate.getFullYear(),
    selectedHistoryDate.getMonth(),
    selectedHistoryDate.getDate() + 1
  );

  if (nextDate <= today) {
    selectedHistoryDate = nextDate;
    renderHistoryForSelectedDate();
  }
}

function goToTodayHistory() {
  selectedHistoryDate = startOfDay(new Date());
  renderHistoryForSelectedDate();
}

/* =========================
   PUZZLE
   ========================= */
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
    tile.setAttribute("role", "button");
    tile.setAttribute("tabindex", "0");
    tile.setAttribute("aria-label", `Puzzle piece ${boardIndex + 1}`);

    const row = Math.floor(pieceIndex / gridSize);
    const col = pieceIndex % gridSize;
    tile.style.backgroundPosition = `${col * 50}% ${row * 50}%`;

    if (selectedIndex === boardIndex) {
      tile.classList.add("selected");
    }

    tile.addEventListener("click", () => handleTileClick(boardIndex));
    tile.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleTileClick(boardIndex);
      }
    });

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
    setText(puzzleMessage, "Puzzle completed successfully 🎉");
    finalMessage.classList.remove("hidden");
    createHeartBurst(window.innerWidth / 2, window.innerHeight / 2);
  } else {
    finalMessage.classList.add("hidden");
    setText(puzzleMessage, "Complete the photo puzzle to unlock the sweet message ❤️");
  }
}

function initPuzzleSolved() {
  tilesOrder = createSolvedOrder();
  selectedIndex = null;
  finalMessage.classList.add("hidden");
  setText(puzzleMessage, "Complete the photo puzzle to unlock the sweet message ❤️");
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
  setText(puzzleMessage, "Complete the photo puzzle to unlock the sweet message ❤️");
  renderPuzzle();
}

/* =========================
   MODAL
   ========================= */
function openLoveLetter() {
  loveLetterModal.classList.remove("hidden");
  loveLetterModal.setAttribute("aria-hidden", "false");
  stopSlideshowAutoPlay();
}

function closeLoveLetter() {
  loveLetterModal.classList.add("hidden");
  loveLetterModal.setAttribute("aria-hidden", "true");

  if (!slideshow.classList.contains("hidden")) {
    startSlideshowAutoPlay();
  }
}

/* =========================
   FIREBASE
   ========================= */
function getActionLabel(action) {
  const map = {
    wantHug: "wants a hug 🤗",
    wantKiss: "wants to kiss 💋",
    wantTo: "wants to 🫣",
    missYou: "misses you 🥺",
    loveYou: "loves you ❤️",
    killYou: "wants to kill you 🤬🔪"
  };
  return map[action] || action;
}

function getHistoryLabel(action) {
  const map = {
    wantHug: "wants a hug 🤗",
    wantKiss: "wants to kiss 💋",
    wantTo: "wants to 🫣",
    missYou: "miss you 🥺",
    loveYou: "love you ❤️",
    killYou: "wants to kill you 🤬🔪"
  };
  return map[action] || action;
}

function showLiveNotification(title, text) {
  setText(notificationTitle, title);
  setText(notificationText, text);
  liveNotification.classList.remove("hidden");

  setTimeout(() => {
    liveNotification.classList.add("hidden");
  }, 3500);
}

function renderCounts(counts) {
  setText(countWantHug, counts.wantHug || 0);
  setText(countWantKiss, counts.wantKiss || 0);
  setText(countWantTo, counts.wantTo || 0);
  setText(countMissYou, counts.missYou || 0);
  setText(countLoveYou, counts.loveYou || 0);
  setText(countKillYou, counts.killYou || 0);
}

async function sendLoveAction(action) {
  if (!firebaseReady || !db) {
    alert("Firebase is not configured yet. Add your Firebase config first.");
    return;
  }

  if (!currentUser) {
    openIdentityModal();
    return;
  }

  const historyRef = push(ref(db, "loveHistory"));
  const payload = {
    action,
    from: currentUser,
    timestamp: Date.now()
  };

  await set(historyRef, payload);

  await runTransaction(ref(db, `loveCounts/${action}`), (currentValue) => {
    return (currentValue || 0) + 1;
  });
}

function setupFirebase() {
  if (!firebaseReady) {
    setText(firebaseStatus, "Firebase status: add your real config in script.js");
    renderCounts({
      wantHug: 0,
      wantKiss: 0,
      wantTo: 0,
      missYou: 0,
      loveYou: 0
    });
    return;
  }

  const app = initializeApp(firebaseConfig);
  db = getDatabase(app);

  setText(firebaseStatus, "Firebase status: connected");

  onValue(ref(db, "loveCounts"), (snapshot) => {
    const counts = snapshot.val() || {};
    renderCounts(counts);
  });

  onValue(query(ref(db, "loveHistory"), limitToLast(100)), (snapshot) => {
    const data = snapshot.val() || {};
    allHistoryItems = Object.entries(data).map(([id, value]) => ({ id, ...value }));

    renderHistoryForSelectedDate();

    const sorted = [...allHistoryItems].sort((a, b) => b.timestamp - a.timestamp);
    if (!sorted.length) return;

    const newest = sorted[0];

    if (lastSeenHistoryId === null) {
      lastSeenHistoryId = newest.id;
      return;
    }

    if (newest.id !== lastSeenHistoryId) {
      lastSeenHistoryId = newest.id;

      if (newest.from !== currentUser && currentUser) {
        showLiveNotification(
          `${newest.from} ${getActionLabel(newest.action)}`,
          formatFriendlyTime(newest.timestamp)
        );
      }
    }
  });
}

/* =========================
   EVENTS
   ========================= */
function setupEventListeners() {
  gridViewBtn.addEventListener("click", enableGridView);
  slideViewBtn.addEventListener("click", enableSlideView);

  prevSlide.addEventListener("click", () => showSlide(currentSlide - 1));
  nextSlide.addEventListener("click", () => showSlide(currentSlide + 1));

  slideImage.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  slideImage.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  shuffleBtn.addEventListener("click", initPuzzleShuffled);
  resetBtn.addEventListener("click", initPuzzleSolved);

  heartBurstBtn.addEventListener("click", (e) => {
    const rect = e.target.getBoundingClientRect();
    createHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
  });

  loveLetterBtn.addEventListener("click", openLoveLetter);
  closeModal.addEventListener("click", closeLoveLetter);

  loveLetterModal.addEventListener("click", (e) => {
    if (e.target === loveLetterModal) closeLoveLetter();
  });

  chooseSasiru.addEventListener("click", () => setCurrentUser("Sasiru"));
  chooseMenuri.addEventListener("click", () => setCurrentUser("Menuri"));

  historyPrevBtn.addEventListener("click", goToPreviousHistoryDate);
  historyNextBtn.addEventListener("click", goToNextHistoryDate);
  historyTodayBtn.addEventListener("click", goToTodayHistory);

  menuToggle.addEventListener("click", () => {
    mobileNav.classList.toggle("show");
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("show");
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeLoveLetter();
      mobileNav.classList.remove("show");
    }

    if (!slideshow.classList.contains("hidden")) {
      if (e.key === "ArrowLeft") showSlide(currentSlide - 1);
      if (e.key === "ArrowRight") showSlide(currentSlide + 1);
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopSlideshowAutoPlay();
    } else if (!slideshow.classList.contains("hidden")) {
      startSlideshowAutoPlay();
    }
  });

  actionButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await sendLoveAction(btn.dataset.action);
      } catch (error) {
        console.error(error);
        alert("Something went wrong while sending the love action.");
      }
    });
  });
}

/* =========================
   INIT
   ========================= */
function init() {
  selectedHistoryDate = startOfDay(new Date());

  ensureIdentity();
  updateAnniversaryCounter();
  updateBirthdayCounter();
  updateCurrentBirthdayWish();
  renderBirthdayArchive();
  renderHistoryForSelectedDate();
  initPuzzleShuffled();
  setupEventListeners();
  setupFirebase();
  enableSlideView();

  setInterval(() => {
    updateAnniversaryCounter();
    updateBirthdayCounter();
    updateCurrentBirthdayWish();
    renderBirthdayArchive();
  }, 1000);

  setInterval(spawnFloatingHeart, 1000);
}

init();
