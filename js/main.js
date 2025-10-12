function show1() {
  const el = document.getElementById("card-info1");
  if (el) el.style.display = "none";
}
function show2() {
  const el = document.getElementById("card-info1");
  if (el) el.style.display = "block";
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
    // شلنا 1 و 4
    2: "شحن مجاني",
    3: "3 سالين + شحن مجاني",
    perc20: "خصم 20%",
    perc25: "خصم 25%",
    perc30: "خصم 30%",
  },
  en: {
    2: "Free shipping",
    3: "3 saline + Free shipping",
    perc20: "20% off",
    perc25: "25% off",
    perc30: "30% off",
  },
};
const dict = offerMessages[pageLang] || offerMessages.ar;
/* ================================================ */

function updateTotalsAndOffer() {
  if (!quntityInput || !totalInput || !offerMessageContainer) return;

  const qty = Number(quntityInput.value) || 0;

  // الإجمالي (بدون تطبيق الخصم فعليًا)
  totalInput.value = qty * FIXED_PRICE;

  // تحديد رسالة العرض حسب المطلوب:
  // - إلغاء رقم 1 (خصم 20 جنيه) ورقم 4 (6 سالين + شحن مجاني)
  // - 5-19 = خصم 20% ، 20-59 = خصم 25% ، 60+ = خصم 30%
  if (qty === 0) {
    message = "";
  } else if (qty === 2) {
    message = dict[2];
  } else if (qty === 3) {
    message = dict[3];
  } else if (qty >= 60) {
    message = dict.perc30;
  } else if (qty >= 20) {
    message = dict.perc25;
  } else if (qty >= 5) {
    message = dict.perc20;
  } else {
    // يغطي 1 و 4 وغيرهم -> لا رسالة
    message = "";
  }

  offerMessageContainer.textContent = message;

  // التحكم في ظهور رسالة العرض
  if (message !== "") {
    offerMessageContainer.style.display = "block";
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
