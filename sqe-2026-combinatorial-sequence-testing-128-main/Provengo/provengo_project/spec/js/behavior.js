// ---------------------------
// Events
// ---------------------------
var E = {
  openStore: ec.event("Open Store"),
  chooseCustomerType: ec.event("Choose Customer Type"),
  setCustomerGuest: ec.event("Set Customer: Guest"),
  setCustomerRegistered: ec.event("Set Customer: Registered"),
  setCustomerVIP: ec.event("Set Customer: VIP"),
  selectProductSweater: ec.event("Select Product: Sweater"),

  chooseSize: ec.event("Choose Size"),
  setSizeS: ec.event("Set Size: S"),
  setSizeM: ec.event("Set Size: M"),
  setSizeL: ec.event("Set Size: L"),

  chooseQty: ec.event("Choose Quantity"),
  setQty1: ec.event("Set Qty: 1"),
  setQty4: ec.event("Set Qty: 4"),

  addToCart: ec.event("Add to Cart"),

  goToCheckout: ec.event("Go to Checkout"),


  personalInfo: ec.event("Personal Info"),
  setPersonalInfoGuest: ec.event("Set Personal Info: Guest"),
  setPersonalInfoRegistered: ec.event("Set Personal Info: Registered"),

  chooseCountry: ec.event("Choose Country"),
  setCountryGuest: ec.event("Set Country: Guest"),
  setCountryRegisteredUS: ec.event("Set Country: Registered USA"),
  setCountryRegisteredFR: ec.event("Set Country: Registered France"),
  setCountryFrance: ec.event("Set Country: France"),
  setCountryUSA: ec.event("Set Country: USA"),

  chooseCarrier: ec.event("Choose Carrier"),
  setCarrierStandard: ec.event("Set Carrier: My carrier"),
  setCarrierCheap: ec.event("Set Carrier: My cheap carrier"),

  verifyFinalPrice: ec.event("Verify Final Price"),

};

// OR sets
var ANY_SET = any(/Set /);
var ANY_CHOOSE = any(/Choose /);
var ANY_ACTION = any(/Select Product|Add to Cart|Go to Checkout|Verify Final Price/);


bthread("MainFlow", function () {
  request(E.openStore);
  // Customer type
  let customerType = request(choose([E.setCustomerGuest, E.setCustomerRegistered, E.setCustomerVIP]));

  // Product
  request(E.selectProductSweater);

  // Size
  request(choose([E.setSizeS, E.setSizeM, E.setSizeL]));

  // Qty
  request(choose([E.setQty1, E.setQty4]));
  // Cart + checkout
  request(E.addToCart);
  request(E.goToCheckout);

  // Personal info
  request(E.personalInfo);
  if (customerType.name === E.setCustomerGuest.name) {
    request(E.setPersonalInfoGuest);
  }
  else {
    request(E.setPersonalInfoRegistered);
  }

  // Country
  request(E.chooseCountry);
  if (customerType.name === E.setCustomerGuest.name) {
    request(choose([E.setCountryFrance, E.setCountryUSA]));
  }
  else {
    request(choose([E.setCountryRegisteredUS, E.setCountryRegisteredFR]));
  }
  // Carrier
  request(E.chooseCarrier);
  request(choose([E.setCarrierStandard, E.setCarrierCheap]));
  // Verify
  request(E.verifyFinalPrice);
});




bthread("verify Final Price", function () {
  let expectedTotal = 35.9;
  let size = null;
  let qty = 1;

  // 1) Customer
  let e = waitFor(any(/Set Customer/));
  let isVIP = (e.name === "Set Customer: VIP");

  // 2) Size
  e = waitFor(any(/Set Size/));
  size = e.name;
  if (size === "Set Size: M") expectedTotal += 10;
  if (size === "Set Size: L") expectedTotal *= 0.7;
  if (isVIP) expectedTotal *= 0.9;
  // 3) Quantity
  e = waitFor(any(/Set Qty/));
  if (e.name === "Set Qty: 4") {
    qty = 4;
    expectedTotal *= 4;
  }
  if (size === "Set Size: S" && qty === 4) {
    expectedTotal *= 0.7;
  }

  // we have to add tax here 
  let countryEv = waitFor(any(/Set Country/));

  if (countryEv.name === "Set Country: France" || countryEv.name === "Set Country: Registered France") {
    expectedTotal *= 1.2;
  }

  // 5) Carrier
  e = waitFor(any(/Set Carrier/));
  let carrierName = e.name;
  if (carrierName === "Set Carrier: My carrier") expectedTotal += 10;
  if (carrierName === "Set Carrier: My cheap carrier") expectedTotal += 3;

  // now verify
  waitFor(E.verifyFinalPrice);
  expectedTotal = expectedTotal.toFixed(2);
  rtv.assertEq(`€${expectedTotal}`, "@{totalAmount}");
});

