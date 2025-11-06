/* =======================
   Checkout — full script
   (keeps your original logic + adds validation + i18n)
======================= */

// ====== show/hide card block (kept as-is) ======
function show1() {
  const el = document.getElementById("card-info1");
  if (el) el.style.display = "none";
}
function show2() {
  const el = document.getElementById("card-info1");
  if (el) el.style.display = "block";
}

// ====== Mute/unmute helper (kept as-is) ======
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

/* =========================
   i18n — auto messages by <html lang>
========================= */
const LANG = (document.documentElement.lang || "ar").slice(0, 2);
const I18N = {
  ar: {
    name_required: "ادخل الاسم",
    phone_invalid: "برجاء إدخال رقم مصري صحيح (11 رقم يبدأ بـ 01)",
    governorate_required: "اختر المحافظة",
    area_required: "ادخل المنطقة السكنية",
    address_required: "ادخل العنوان بالتفصيل",
    qty_min: "أقل كمية 1",
    card_name: "مطلوب الاسم على الكارت",
    card_no: "رقم الكارت غير صحيح",
    exp: "أدخل تاريخ انتهاء صحيح",
    cvc: "رمز الأمان غير صحيح",
    // offers
    offer_2: "شحن مجاني",
    offer_3: "3 سالين + شحن مجاني",
    offer_20: "خصم 20%",
    offer_25: "خصم 25%",
    offer_30: "خصم 30%",
  },
  en: {
    name_required: "Enter customer name.",
    phone_invalid: "Enter a valid Egyptian mobile (11 digits starting with 01).",
    governorate_required: "Select a governorate.",
    area_required: "Enter residential area.",
    address_required: "Enter address in detail.",
    qty_min: "Minimum quantity is 1.",
    card_name: "Cardholder name is required.",
    card_no: "Invalid card number.",
    exp: "Enter a valid expiry date.",
    cvc: "Invalid security code (CVC).",
    // offers
    offer_2: "Free shipping",
    offer_3: "3 saline + Free shipping",
    offer_20: "20% off",
    offer_25: "25% off",
    offer_30: "30% off",
  },
};
const T = (k) => (I18N[LANG] && I18N[LANG][k]) || I18N.ar[k] || k;

/* =========================
   Radio redirect (kept) + ensure card required toggling
========================= */
const radioButtons = document.querySelectorAll('input[name="redirect"]');
radioButtons.forEach((radio) => {
  radio.addEventListener("change", (event) => {
    // keep your original redirect behavior
    if (event.target.checked && event.target.value !== "no-link") {
      window.location.href = event.target.value;
    }
    // also sync card-required with selection
    toggleCardRequired();
  });
});

/* =========================
   Offers / totals (kept)
========================= */
const FIXED_PRICE = 350;
const quntityInput = document.querySelector("#qty");
const totalInput = document.querySelector("#total");
const offerMessageContainer = document.querySelector(".offer-message");
let message = "";

function updateTotalsAndOffer() {
  if (!quntityInput || !totalInput || !offerMessageContainer) return;

  const qty = Number(quntityInput.value) || 0;

  const baseTotal = qty * FIXED_PRICE;
  let discountRate = 0;
  let shippingCost = 0;   // <— شحن

  // الرسالة الافتراضية
  message = "";

  if (qty === 0) {
    message = "";
  } else if (qty === 1) {
    // شحن 90 جنيه لجميع المحافظات عند طلب قطعة واحدة
    shippingCost = 90;
    message = (LANG === "ar")
      ? "شحن 90 جنية لجميع المحافظات"
      : "Shipping 90 EGP to all governorates";
  } else if (qty === 2) {
    message = T("offer_2");
    discountRate = 0;
  } else if (qty === 3) {
    message = T("offer_3");
    discountRate = 0;
  } else if (qty >= 60) {
    message = T("offer_30");
    discountRate = 0.30;
  } else if (qty >= 20) {
    message = T("offer_25");
    discountRate = 0.25;
  } else if (qty >= 5) {
    message = T("offer_20");
    discountRate = 0.20;
  }

  // الإجمالي بعد الخصم + الشحن (لو فيه)
  const discountedTotal = Math.round(baseTotal * (1 - discountRate)) + shippingCost;
  totalInput.value = discountedTotal;

  offerMessageContainer.textContent = message;
  offerMessageContainer.style.display = message ? "block" : "none";
}


// init + listeners
updateTotalsAndOffer();
if (quntityInput) {
  quntityInput.addEventListener("change", updateTotalsAndOffer);
  quntityInput.addEventListener("input", updateTotalsAndOffer);
}

/* =========================
   Validation + navigation lock
========================= */
const $ = (s, root = document) => root.querySelector(s);
const onlyDigits = (v) => (v || "").replace(/\D+/g, "");

// main controls
const btnCheckout  = document.querySelector(".btn.btn-checkout");
const firstname    = $("#firstname");
const phone        = $("#phone");
const phoneAlt     = $("#phone1");
const governorate  = $("#inputGroupSelect01");
const area         = $("#area");
const address      = $("#exampleFormControlTextarea1");

// payment
const methodVisa = $("#method4");
const cardBlock  = $("#card-info1");

// card fields (be tolerant to id issues in original HTML)
const cardHolder = $("#card-name") || $('label[for="card-name"] + input') || (cardBlock ? cardBlock.querySelector("input") : null);
const cardNo     = $("#card-no")   || $('label[for="card-no"] + input')   || (cardBlock ? cardBlock.querySelectorAll("input")[1] : null);
const expiration = $("#expiration")|| $('label[for="expiration"] + input')|| (cardBlock ? cardBlock.querySelectorAll("input")[2] : null);
const cvc        = $("#sec-no")    || $('label[for="ccv-no"] + input')    || (cardBlock ? cardBlock.querySelectorAll("input")[3] : null);

// make sure critical fields are required even if HTML forgot them
function applyRequiredDefaults() {
  firstname   && firstname.setAttribute("required", "required");
  phone       && phone.setAttribute("required", "required");
  governorate && governorate.setAttribute("required", "required");
  area        && area.setAttribute("required", "required");
  address     && address.setAttribute("required", "required");
  quntityInput&& quntityInput.setAttribute("required", "required");
}
applyRequiredDefaults();

// show/hide + required for card fields based on Visa selection
function setCardRequired(on) {
  [cardHolder, cardNo, expiration, cvc].forEach((el) => {
    if (!el) return;
    if (on) el.setAttribute("required", "required");
    else el.removeAttribute("required");
  });
}
function toggleCardRequired() {
  if (methodVisa && methodVisa.checked) {
    cardBlock && (cardBlock.style.display = "block");
    setCardRequired(true);
  } else {
    cardBlock && (cardBlock.style.display = "none");
    setCardRequired(false);
    [cardHolder, cardNo, expiration, cvc].forEach(clearInvalid);
  }
}
// run at start to sync UI
toggleCardRequired();

// utils: invalid visuals
function showInvalid(el, msg) {
  if (!el) return false;
  el.classList.add("is-invalid");
  try {
    const feedback = el.parentElement && el.parentElement.querySelector(".invalid-feedback");
    if (feedback) {
      if (msg) feedback.textContent = msg;
      feedback.style.display = "block";
    }
    const formRoot = el.closest(".contact-form") || el.closest(".contact-us") || document.body;
    formRoot && formRoot.classList.add("was-validated");
  } catch (_) {}
  return false;
}
function clearInvalid(el) {
  if (!el) return;
  el.classList.remove("is-invalid");
  const feedback = el.parentElement && el.parentElement.querySelector(".invalid-feedback");
  if (feedback) feedback.style.display = "none";
}

// validators
function validateRequiredText(el, key) {
  if (!el) return true;
  const v = (el.value || "").trim();
  if (!v) return showInvalid(el, T(key));
  clearInvalid(el);
  return true;
}
function validateSelect(el, key) {
  if (!el) return true;
  const v = (el.value || "").trim();
  // treat placeholders "اختر ..." or "Select ..." as invalid
  if (!v || /select|اختر/i.test(v)) return showInvalid(el, T(key));
  clearInvalid(el);
  return true;
}
function validateQty(el) {
  if (!el) return true;
  const n = parseInt(el.value, 10);
  if (!Number.isFinite(n) || n < 1) {
    el.value = 1;
    return showInvalid(el, T("qty_min"));
  }
  clearInvalid(el);
  return true;
}
const reEGPhone = /^01[0-2,5][0-9]{8}$/;
function validatePhone(el) {
  if (!el) return true;
  el.value = onlyDigits(el.value);
  const v = el.value;
  if (!reEGPhone.test(v)) return showInvalid(el, T("phone_invalid"));
  clearInvalid(el);
  return true;
}
function validateCardIfNeeded() {
  if (!(methodVisa && methodVisa.checked)) return true;
  let ok = true;

  if (cardHolder) ok = validateRequiredText(cardHolder, "card_name") && ok;

  if (cardNo) {
    cardNo.value = onlyDigits(cardNo.value);
    if ((cardNo.value || "").length < 12) ok = showInvalid(cardNo, T("card_no")) && ok;
    else clearInvalid(cardNo);
  }
  if (expiration) {
    const expVal = (expiration.value || "").trim();
    const okMMYY = /^[0-1][0-9]\/[0-9]{2}$/.test(expVal);
    const okYYYYMM = /^[0-9]{4}-[0-1][0-9]$/.test(expVal);
    if (!okMMYY && !okYYYYMM) ok = showInvalid(expiration, T("exp")) && ok;
    else clearInvalid(expiration);
  }
  if (cvc) {
    cvc.value = onlyDigits(cvc.value);
    if (cvc.value.length < 3) ok = showInvalid(cvc, T("cvc")) && ok;
    else clearInvalid(cvc);
  }
  return ok;
}

// clear errors while typing
[
  firstname, phone, phoneAlt, governorate, area, address, quntityInput,
  cardHolder, cardNo, expiration, cvc
].filter(Boolean).forEach((el) => {
  el.addEventListener("input", () => clearInvalid(el));
  if (el.tagName === "SELECT") {
    el.addEventListener("change", () => clearInvalid(el));
  }
});

// intercept the checkout button (keep it an <a>)
if (btnCheckout) {
  btnCheckout.addEventListener("click", function (e) {
    // always stop default first
    e.preventDefault();

    // sync visa state + normalize phones
    toggleCardRequired();
    if (phone)    phone.value    = onlyDigits(phone.value);
    if (phoneAlt) phoneAlt.value = onlyDigits(phoneAlt.value);

    // run validations (i18n messages)
    let ok = true;
    ok = validateRequiredText(firstname, "name_required") && ok;
    ok = validatePhone(phone) && ok;
    ok = validateSelect(governorate, "governorate_required") && ok;
    ok = validateRequiredText(area, "area_required") && ok;
    ok = validateRequiredText(address, "address_required") && ok;
    ok = validateQty(quntityInput) && ok;
    ok = validateCardIfNeeded() && ok;

    if (!ok) {
      const firstInvalid = document.querySelector(".is-invalid");
      if (firstInvalid) {
        firstInvalid.focus({ preventScroll: true });
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return; // do not navigate
    }

    // all good → follow original link
    const href = btnCheckout.getAttribute("href") || "/thankyou.html";
    window.location.href = href;
  });
}
