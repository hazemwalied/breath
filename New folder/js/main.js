function show1() {
  document.getElementById("card-info1").style.display = "none";
}
function show2() {
  document.getElementById("card-info1").style.display = "block";
}

// JavaScript function to toggle mute/unmute
function toggleMute(videoId, buttonId) {
  const video = document.getElementById(videoId);
  const button = document.getElementById(buttonId);

  if (video && button) {
    if (video.muted) {
      video.muted = false;
      button.textContent = "❚❚ ";
    } else {
      video.muted = true;
      button.textContent = " ▶";
    }
  }
}

// Get all radio buttons with the name 'redirect'
const radioButtons = document.querySelectorAll('input[name="redirect"]');

// Add an event listener to each radio button
radioButtons.forEach((radio) => {
  radio.addEventListener("change", (event) => {
    // Redirect to the URL specified in the value of the selected radio button
    if (event.target.checked && event.target.value !== "no-link") {
      window.location.href = event.target.value;
    }
  });
});

// calculate the total price
const FIXED_PRICE = 350;
const quntityInput = document.querySelector("#qty");
const totalInput = document.querySelector("#total");
const offerMessageContainer = document.querySelector(".offer-message");
let message = "";

/* ===== إضافات: دعم عربي/إنجليزي لرسالة العرض ===== */
const pageLang = (document.documentElement.lang || "ar").slice(0, 2);
const offerMessages = {
  ar: {
    1: "خصم 20 جنيه",
    2: "شحن مجاني",
    3: "2 سالين + شحن مجاني",
    4: "6 سالين + شحن مجاني",
    20: "خصم 20%",
    40: "خصم 25%",
    100: "خصم 30%",
  },
  en: {
    1: "EGP 20 off",
    2: "Free shipping",
    3: "2 saline + Free shipping",
    4: "6 saline + Free shipping",
    20: "20% off",
    40: "25% off",
    100: "30% off",
  },
};
const dict = offerMessages[pageLang] || offerMessages.ar;
/* ================================================ */

function updateTotalsAndOffer() {
  if (!quntityInput || !totalInput || !offerMessageContainer) return;

  const qty = Number(quntityInput.value) || 0;

  // total
  totalInput.value = qty * FIXED_PRICE;

  // define the offer message by the quantity number
  switch (qty) {
    case 0:
      message = "";
      break;
    case 1:
      message = dict[1];
      break;
    case 2:
      message = dict[2];
      break;
    case 3:
      message = dict[3];
      break;
    case 4:
      message = dict[4];
      break;
    case 20:
      message = dict[20];
      break;
    case 40:
      message = dict[40];
      break;
    case 100:
      message = dict[100];
      break;
    default:
      message = "";
  }

  offerMessageContainer.textContent = message;

  // control on visibility of offer message container
  if (message !== "") {
    offerMessageContainer.style.display = "block";
    console.log("work");
  } else {
    offerMessageContainer.style.cssText = "display: none";
  }
}

// التحديث عند الفتح وعند التغيير
updateTotalsAndOffer();
if (quntityInput) {
  quntityInput.addEventListener("change", updateTotalsAndOffer);
  quntityInput.addEventListener("input", updateTotalsAndOffer);
}
