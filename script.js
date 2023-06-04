var score = 0;
var clickValue = 1;
var workers = {
  Cursor: { count: 0, cost: 20, cps: 1, level: 1 },
  Grandma: { count: 0, cost: 50, cps: 5, level: 1 }
};
var upgrades = {
  "Double Click": { count: 0, cost: 10, multiplier: 2 },
  "Super Grandma": { count: 0, cost: 100, multiplier: 3 }
};

var modApi = {
  addWorker: function(workerType, workerData) {
    workers[workerType] = workerData;
  },
  addUpgrade: function(upgradeType, upgradeData) {
    upgrades[upgradeType] = upgradeData;
  },
  modifyWorker: function(workerType, modifierFunction) {
    var worker = workers[workerType];
    modifierFunction(worker);
  },
  modifyUpgrade: function(upgradeType, modifierFunction) {
    var upgrade = upgrades[upgradeType];
    modifierFunction(upgrade);
  },
  modifyPrice: function(workerType, newCost) {
    var worker = workers[workerType];
    if (worker) {
      worker.cost = newCost;
    }
  },
  onEvent: function(eventType, eventHandler) {
    if (!this.eventHandlers[eventType]) {
      this.eventHandlers[eventType] = [];
    }
    this.eventHandlers[eventType].push(eventHandler);
  },
  triggerEvent: function(eventType, eventData) {
    if (this.eventHandlers[eventType]) {
      this.eventHandlers[eventType].forEach(function(eventHandler) {
        eventHandler(eventData);
      });
    }
  },
  renderText: function(text, targetElementId) {
    var targetElement = document.getElementById(targetElementId);
    if (targetElement) {
      targetElement.textContent = text;
    }
  },

  renderButton: function(label, clickHandler, targetElementId) {
    var targetElement = document.getElementById(targetElementId);
    if (targetElement) {
      var button = document.createElement('button');
      button.textContent = label;
      button.addEventListener('click', clickHandler);
      targetElement.appendChild(button);
    }
  },

  eventHandlers: {}
};

var splashTexts = [
  "Cookies are the best!",
  "Click me for more cookies!",
  "Keep clicking those cookies!",
  "Upgrade to get more cookies!",
  "Double-clicking is twice as fun!",
  "More workers, more cookies!",
  "Just in ohio!",
  "Yes, I got 99% of the splash texts from Chat GPT"
];

function getRandomSplashText() {
  var randomIndex = Math.floor(Math.random() * splashTexts.length);
  return splashTexts[randomIndex];
}

function displaySplashText() {
  var splashTextElement = document.getElementById("splashText");
  splashTextElement.textContent = getRandomSplashText();
}

setInterval(displaySplashText, 3000);

function formatNumber(number) {
  if (number < 1e3) return number.toString();
  if (number >= 1e3 && number < 1e6) return (number / 1e3).toFixed(1) + "K";
  if (number >= 1e6 && number < 1e9) return (number / 1e6).toFixed(1) + "M";
  if (number >= 1e9 && number < 1e12) return (number / 1e9).toFixed(1) + "B";
  if (number >= 1e12 && number < 1e15) return (number / 1e12).toFixed(1) + "T";
  if (number >= 1e15 && number < 1e18) return (number / 1e15).toFixed(1) + "Q";
  if (number >= 1e18 && number < 1e21) return (number / 1e18).toFixed(1) + "Qa";
  if (number >= 1e21 && number < 1e24) return (number / 1e21).toFixed(1) + "Sx";
  if (number >= 1e24 && number < 1e27) return (number / 1e24).toFixed(1) + "Sp";
  if (number >= 1e27 && number < 1e30) return (number / 1e27).toFixed(1) + "Oc";
  if (number >= 1e30 && number < 1e33) return (number / 1e30).toFixed(1) + "No";
  return number.toString();
}

function updateScore() {
  document.getElementById("scoreValue").textContent = formatNumber(score);
  modApi.triggerEvent("scoreIncrease", score);
}

function updateWorkerButtons() {
  for (var workerType in workers) {
    var worker = workers[workerType];
    var workerButton = document.getElementById(workerType + "Button");
    workerButton.textContent = `${workerType} - ${formatNumber(worker.cost)} cookies\nLevel: ${worker.level}\nCount: ${worker.count}`;
  }
}

function clickCookie() {
  score += clickValue;
  updateScore();
  modApi.triggerEvent("cookieClicked")
}

function buyWorker(workerType) {
  var worker = workers[workerType];
  if (score >= worker.cost) {
    score -= worker.cost;
    worker.count++;
    worker.cost *= 1.2; // Increase cost by 20% for each worker
    updateScore();
    updateWorkerButtons();
    calculateCPS();
    modApi.triggerEvent("workerBought",upgradeType)
  }
}

function buyUpgrade(upgradeType) {
  var upgrade = upgrades[upgradeType];
  if (score >= upgrade.cost) {
    score -= upgrade.cost;
    upgrade.count++;
    upgrade.cost *= 1.5; // Increase cost by 50% for each upgrade
    updateScore();
    updateWorkerButtons();
    calculateCPS();
    modApi.triggerEvent("upgradeBought",upgradeType)
  }
}

function calculateCPS() {
  var cps = 0;
  for (var workerType in workers) {
    var worker = workers[workerType];
    cps += worker.count * worker.cps * worker.level;
  }
  for (var upgradeType in upgrades) {
    var upgrade = upgrades[upgradeType];
    cps += upgrade.count * clickValue * upgrade.multiplier;
  }
  setInterval(function() {
    score += cps;
    updateScore();
  }, 1000);
}

updateScore();
updateWorkerButtons();
calculateCPS();
