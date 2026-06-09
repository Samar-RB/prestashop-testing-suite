
// ===========================
// Helpers
// ===========================
function sleep(ms) { s.sleep(ms); }

function retry(timeoutMs, intervalMs, fn) {
    var start = Date.now();
    while (Date.now() - start < timeoutMs) {
        try { return fn(); } catch (e) { sleep(intervalMs); }
    }
    throw "timeout after " + timeoutMs + "ms";
}

function clearAndType(xp, txt) {
    retry(15000, 250, function () {
        s.clear(xp);
        s.writeText(xp, txt);
    });
}

function click(xp, timeoutMs) {
    retry(timeoutMs || 15000, 250, function () {
        s.click(xp);
    });
}

function parseMoney(txt) {
    if (!txt) return NaN;
    var s0 = ("" + txt).trim();
    s0 = s0.replace(/[^\d.,-]/g, "");
    if (s0.indexOf(",") !== -1 && s0.indexOf(".") !== -1) {
        s0 = s0.replace(/,/g, "");
    } else if (s0.indexOf(",") !== -1 && s0.indexOf(".") === -1) {
        s0 = s0.replace(/,/g, ".");
    }
    return parseFloat(s0);
}

function round2(x) { return Math.round(x * 100) / 100; }

// ===========================
// Login
// ===========================
function login(email, password) {
    // click Sign in
    click(xpaths.Login.signInButton, 15000);
    clearAndType(xpaths.Login.emailInput, email);
    clearAndType(xpaths.Login.passwordInput, password);
    click(xpaths.Login.submitButton, 15000);
}

// ===========================
// Open store
// ===========================
ec.refine("Open Store").with(function () {
    s.start(STORE_URL);
});

// ===========================
// Customer type
// ===========================
ec.refine("Set Customer: Guest").with(function () {
    bp.store.put("customerType", "Guest");
    bp.log.info("[Customer] Guest (no login)");

});

ec.refine("Set Customer: Registered").with(function () {
    bp.store.put("customerType", "Registered");
    bp.log.info("[Customer] Registered -> login");
    var c = CREDS.Registered;
    login(c.email, c.password);
});

ec.refine("Set Customer: VIP").with(function () {
    bp.store.put("customerType", "VIP");
    bp.log.info("[Customer] VIP -> login");
    var c = CREDS.VIP;
    login(c.email, c.password);
});

// ===========================
// Select product: Sweater
// ===========================
ec.refine("Select Product: Sweater").with(function () {

    bp.log.info("[Product] Select " + products[0].name);
    bp.store.put("productName", products[0].name);
    click(products[0].xpath, 20000);
    bp.log.info("[Product] Opened product page");
});

// ===========================
// Size 
// ===========================
function selectSize(sizeText) {
    click('//*[@id="group_1"]', 15000);
    click('//*[@id="group_1"]/option[normalize-space(text())="' + sizeText + '"]', 15000);
    bp.log.info("[SIZE] " + sizeText);
}
ec.refine("Set Size: S").with(function () { selectSize("S"); });
ec.refine("Set Size: M").with(function () { selectSize("M"); });
ec.refine("Set Size: L").with(function () { selectSize("L"); });

// ===========================
// Quantity
// ===========================
function setQtyByPlus(target) {
    bp.log.info("[QTY] set by PLUS -> " + target);
    bp.store.put("qty", target);
    if (target < 1) throw "qty must be >= 1";
    if (target === 1) {
        bp.log.info("[QTY] already 1");
        return;
    }


    for (var i = 0; i < (target - 1); i++) {

        s.click('//*[@id="add-to-cart-or-refresh"]/div[2]/div/div[1]/div/span[3]/button[1]/i');

        Ctrl.doSleep(550);
    }

    bp.log.info("[QTY] done clicks=" + (target - 1));
}
ec.refine("Set Qty: 1").with(function () { setQtyByPlus(1); });
ec.refine("Set Qty: 4").with(function () { setQtyByPlus(4); });


// ===========================
// Add to cart
// ===========================
ec.refine("Add to Cart").with(function () {
    Ctrl.doSleep(500); // wait for product page to load
    s.click(xpaths.productView.addToCartButton);
    Ctrl.doSleep(2000); // wait for modal to appear
});


// ===========================
// Go to checkout (IMPORTANT!)
// ===========================

ec.refine("Go to Checkout").with(function () {
    s.click(xpaths.productView.proceedToCheckoutButton);
    Ctrl.doSleep(500); // wait for checkout page to load 
    s.click(xpaths.productView.secondProceedToCheckoutButton);
    bp.log.info("[CHECKOUT] clicked cart page proceed-to-checkout");
});

// ===========================
// Personal info
// ===========================

ec.refine("Personal Info").with(function () {
    bp.log.info("[CHECKOUT] Personal info step");
    bp.log.info("[PERSONAL] customerType=" + bp.store.get("customerType"));
    Ctrl.doSleep(500);
});
ec.refine("Set Personal Info: Registered").with(function () {
    Ctrl.doSleep(800);
});


ec.refine("Set Personal Info: Guest").with(function () {
  bp.log.info("[PERSONAL] Guest -> fill form ");
  s.clear(xpaths.personalInfoView.firstNameInput);
  s.writeText(xpaths.personalInfoView.firstNameInput, "Test");
  s.clear(xpaths.personalInfoView.lastNameInput);
  s.writeText(xpaths.personalInfoView.lastNameInput, "Guest");
  s.clear(xpaths.personalInfoView.emailInput);
  s.writeText(xpaths.personalInfoView.emailInput, "guest_" + Date.now() + "@mail.com");
  Ctrl.doSleep(300);
  s.click(xpaths.personalInfoView.acceptFirstCheckbox);
  Ctrl.doSleep(150);
  s.click(xpaths.personalInfoView.acceptSecondCheckbox);
  Ctrl.doSleep(150);
  s.click(xpaths.personalInfoView.continueButton);
  Ctrl.doSleep(1000);
});


// ===========================
// Choose country
// ===========================


ec.refine("Choose Country").with(function () {
    bp.log.info("[CHECKOUT] Address step");
    Ctrl.doSleep(500);
}); 

ec.refine("Set Country: Registered USA").with(function () {
  bp.log.info("[ADDRESS] Registered/VIP -> USA");
  s.click('//*[starts-with(@id, \'id_address_delivery-address-\')]//label[contains(normalize-space(.), \'United States\')]');
  s.click(xpaths.addressView.registeredContinueButton);
  Ctrl.doSleep(800);
});

ec.refine("Set Country: Registered France").with(function () {
  bp.log.info("[ADDRESS] Registered/VIP -> France");
  s.click('//*[starts-with(@id, \'id_address_delivery-address-\')]//label[contains(normalize-space(.), \'France\')]');
  s.click(xpaths.addressView.registeredContinueButton);
  Ctrl.doSleep(800);
});
// ===========================
// Country - Guest split
// ===========================

ec.refine("Set Country: USA").with(function () {
  bp.log.info("[ADDRESS] Guest -> USA");
  bp.store.put("taxRate", 0);
  bp.store.put("countryName", "USA");

  // fill address fields
  s.clear(xpaths.addressView.addressInput);
  s.writeText(xpaths.addressView.addressInput, "US-guest");

  s.clear(xpaths.addressView.postcodeInput);
  s.writeText(xpaths.addressView.postcodeInput, "11111");

  s.clear(xpaths.addressView.cityInput);
  s.writeText(xpaths.addressView.cityInput, "TestCity");

  Ctrl.doSleep(300);

  // select country (United States)
  s.click("//*[contains(text(), 'United States')]");
  Ctrl.doSleep(300);

  // select state (required for USA)
  s.click("//*[contains(text(), 'California')]");
  Ctrl.doSleep(300);

  // continue
  s.click(xpaths.addressView.continueButton);
  Ctrl.doSleep(1000);
});


ec.refine("Set Country: France").with(function () {
  bp.log.info("[ADDRESS] Guest -> France");
  bp.store.put("taxRate", 0.2);
  bp.store.put("countryName", "France");

  // fill address fields
  s.clear(xpaths.addressView.addressInput);
  s.writeText(xpaths.addressView.addressInput, "FR-guest");

  s.clear(xpaths.addressView.postcodeInput);
  s.writeText(xpaths.addressView.postcodeInput, "22222");

  s.clear(xpaths.addressView.cityInput);
  s.writeText(xpaths.addressView.cityInput, "TestCity");

  Ctrl.doSleep(300);

  // select country (France option)
  s.click('//*[@id="field-id_country"]/option[2]');
  Ctrl.doSleep(300);


  // continue
  s.click(xpaths.addressView.continueButton);
  Ctrl.doSleep(1000);
});

// ===========================
// Choose carrier
// ===========================


ec.refine("Choose Carrier").with(function () {
    Ctrl.doSleep(500);
});

ec.refine("Set Carrier: My carrier").with(function () {
    s.click(shippingMethods[0].xpath);
    Ctrl.doSleep(300);
    s.click(xpaths.shippingMethodView.continueButton);
    Ctrl.doSleep(900);
});

ec.refine("Set Carrier: My cheap carrier").with(function () {
    s.click(shippingMethods[1].xpath);
    Ctrl.doSleep(300);
    s.click(xpaths.shippingMethodView.continueButton);
    Ctrl.doSleep(900);
});
// ===========================
// verify Final Price
// ===========================
ec.refine("Verify Final Price").with(function () {
    s.store(xpaths.totalAmountView.totalAmountLabel, "totalAmount");
});

