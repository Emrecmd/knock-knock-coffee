let currentState = 0;
let buttonText = "Who is there?";
let nextButtonText = "What, when who?";
let finalLines = ["coffee,", "this week,", "me and you?"];
let showFinalButtons = false;
let showMessage = false;

let evetX, evetY, hayirX, hayirY;
let btnWidth = 200;
let btnHeight = 60;
let locationOptions = [
  "Expo göl kenarı kafe",
  "Nişantaşı kafe",
  "Starbucks",
  "Aussie",
  "Baia",
  "The Nook",
  "Kafkahve üsküdar"
];
let selectedLocation = null;
let showLocationOptions = false;
let showConfirmation = false;

let showDateTimePicker = false;
let selectedDate = null;
let selectedTime = null;

let dateInput, timeInput;
let onaylaButton;

const botToken = '7776822734:AAFK1PyqJFLh8VaZgz7i2nJRk8WK3y0hJu0';
const chatId = '7125445935'; 

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  rectMode(CORNER);
  evetX = width / 2 - 220;
  evetY = height / 2 + 60;
  hayirX = width / 2 + 20;
  hayirY = height / 2 + 60;

  onaylaButton = createButton('Onayla');
  onaylaButton.position(width / 2 - 100, height / 2 + 160);
  onaylaButton.mousePressed(sendConfirmationMessage);
  onaylaButton.hide();
}

function draw() {
  background('#001f3f'); // lacivert
  fill('#FFD1DC'); // açık pembe
  textSize(36);

  if (currentState === 0) {
    text("Knock knock", width / 2, height / 2 - 100);
    drawButton(width / 2 - 100, height / 2, btnWidth, btnHeight, buttonText);
  } else if (currentState === 1) {
    text("What, when", width / 2, height / 2 - 100);
    drawButton(width / 2 - 100, height / 2, btnWidth, btnHeight, nextButtonText);
  } else if (currentState === 2 && !showMessage) {
    for (let i = 0; i < finalLines.length; i++) {
      text(finalLines[i], width / 2, height / 2 - 140 + i * 40);
    }
    drawButton(evetX, evetY, btnWidth, btnHeight, "Evet");
    drawButton(hayirX, hayirY, btnWidth, btnHeight, "Hayır");

    if (isMouseOver(hayirX, hayirY)) {
      relocateHayir();
    }
  } else if (showMessage && !showLocationOptions) {
    text("Tarih ve saat bana mesaj olarak döner. Şimdi bir yer seç:", width / 2, height / 2 - 160);
    showLocationOptions = true;
  }

  if (showLocationOptions && !selectedLocation) {
    drawLocationOptions();
  } else if (selectedLocation && !showDateTimePicker) {
    text("Şimdi tarih ve saat seçin:", width / 2, height / 2 - 100);
    drawButton(width / 2 - 100, height / 2, btnWidth, btnHeight, "Seçim yap");
    showDateTimePicker = true;
  } else if (showDateTimePicker && selectedLocation) {
    text(`Seçilen Yer: ${selectedLocation}`, width / 2, height / 2 - 100);
    textSize(20);
    text(`Tarih: ${selectedDate ? selectedDate : "Henüz seçilmedi"}`, width / 2, height / 2);
    text(`Saat: ${selectedTime ? selectedTime : "Henüz seçilmedi"}`, width / 2, height / 2 + 40);
    
    if (!dateInput) {
      dateInput = createInput();
      dateInput.position(width / 2 - 100, height / 2 + 80);
      dateInput.attribute('placeholder', 'YYYY-MM-DD');
      dateInput.input(updateDate);
    }

    if (!timeInput) {
      timeInput = createInput();
      timeInput.position(width / 2 - 100, height / 2 + 120);
      timeInput.attribute('placeholder', 'HH:MM');
      timeInput.input(updateTime);
    }
    
    onaylaButton.show();
  }
}

function drawButton(x, y, w, h, label) {
  fill('#FFD1DC');
  rect(x, y, w, h, 15);
  fill('#001f3f');
  textSize(20);
  text(label, x + w / 2, y + h / 2);
}

function drawLocationOptions() {
  textSize(20);
  for (let i = 0; i < locationOptions.length; i++) {
    let y = height / 2 - 100 + i * 40;
    if (isMouseOver(width / 2 - 100, y - 20, 200, 30)) {
      fill('#FF69B4');
    } else {
      fill('#FFD1DC');
    }
    rect(width / 2 - 100, y - 20, 200, 30, 10);
    fill('#001f3f');
    text(locationOptions[i], width / 2, y);
  }
}

function mousePressed() {
  if (currentState === 0 && isMouseOver(width / 2 - 100, height / 2)) {
    currentState = 1;
  } else if (currentState === 1 && isMouseOver(width / 2 - 100, height / 2)) {
    currentState = 2;
  } else if (currentState === 2 && isMouseOver(evetX, evetY)) {
    showMessage = true;
  } else if (showLocationOptions && !selectedLocation) {
    for (let i = 0; i < locationOptions.length; i++) {
      let y = height / 2 - 100 + i * 40;
      if (isMouseOver(width / 2 - 100, y - 20, 200, 30)) {
        selectedLocation = locationOptions[i];
      }
    }
  } else if (showDateTimePicker && selectedLocation) {
    if (selectedDate && selectedTime) {
      sendTelegramMessage(selectedLocation, selectedDate, selectedTime);
    } else {
      //alert("Tarih ve saat seçmelisiniz!");
    }
  }
}

function isMouseOver(x, y, w = btnWidth, h = btnHeight) {
  return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
}

function relocateHayir() {
  let newX, newY;
  let overlap;
  do {
    newX = random(width - btnWidth);
    newY = random(height - btnHeight);
    overlap = !(newX + btnWidth < evetX || newX > evetX + btnWidth || newY + btnHeight < evetY || newY > evetY + btnHeight);
  } while (overlap || isMouseOver(evetX, evetY));

  hayirX = newX;
  hayirY = newY;
}

function updateDate() {
  selectedDate = dateInput.value();
}

function updateTime() {
  selectedTime = timeInput.value();
}

function sendConfirmationMessage() {
  if (selectedDate && selectedTime) {
    sendTelegramMessage(selectedLocation, selectedDate, selectedTime);
  } else {
    //alert("Tarih ve saat seçmelisiniz!");
  }
}

function sendTelegramMessage(location, date, time) {
  const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const message = `Buluşma Yeriniz: ${location}\nTarih: ${date}\nSaat: ${time}`;

  const url = `${telegramApiUrl}?chat_id=${chatId}&text=${encodeURIComponent(message)}`;

  fetch(url)
    .then(response => response.json())
    .then(data => console.log('Message sent:', data))
    .catch(error => console.error('Error sending message:', error));
}
