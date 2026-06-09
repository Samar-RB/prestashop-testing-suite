
/*
 *  This is a good place to put common test data, project-wide constants, etc.
 */

/* @provengo summon selenium */
/* @provengo summon eventcategory */

const ec = EventCategory.create(' Store Events ');
const s = new SeleniumSession('search')
const STORE_URL = "http://localhost:8080";

const CREDS = {
  Registered: { email: "pub@prestashop.com", password: "Layan1278" },
  VIP: { email: "bla@prestashop.com", password: "bla@prestashop.com" }
};

const xpaths = {
  Login: {
    signInButton: '//*[@id="_desktop_user_info"]/div/a/span',
    emailInput: '//*[@id="field-email"]',
    passwordInput: '//*[@id="field-password"]',
    submitButton: '//*[@id="submit-login"]',
  },
  productView: {
    quantityIncrementButton:
      '//*[@id="add-to-cart-or-refresh"]/div[2]/div/div[1]/div/span[3]/button[1]/i',
    addToCartButton:
      '//*[@id="add-to-cart-or-refresh"]/div[2]/div/div[2]/button',
    addToCartButton2:
      '//*[@id="add-to-cart-or-refresh"]/div[2]/div/div[2]/button',
    proceedToCheckoutButton:
      '//*[@id="blockcart-modal"]/div/div/div[2]/div/div[2]/div/div/a',
    secondProceedToCheckoutButton:
      '//*[@id="main"]/div/div[2]/div[1]/div[2]/div/a',
    quantityIncrementButton:
        '//*[@id="add-to-cart-or-refresh"]/div[2]/div/div[1]/div/span[3]/button[1]',
  },
  personalInfoView: {
    firstNameInput: '//*[@id="field-firstname"]',
    lastNameInput: '//*[@id="field-lastname"]',
    emailInput: '//*[@id="field-email"]',
    acceptFirstCheckbox:
      '//*[@id="customer-form"]/div/div[8]/div[1]/span/label',
    acceptSecondCheckbox:
      '//*[@id="customer-form"]/div/div[10]/div[1]/span/label',
    continueButton: '//*[@id="customer-form"]/footer/button',
  },
  addressView: {
    addressInput: '//*[@id="field-address1"]',
    postcodeInput: '//*[@id="field-postcode"]',
    cityInput: '//*[@id="field-city"]',
    continueButton:
      "//*[@id=\"checkout-addresses-step\"]/div//*[contains(text(), 'Continue')]",
    registeredContinueButton:
      "//*[@id=\"checkout-addresses-step\"]/div//*[contains(text(), 'Continue')]",
  },
  shippingMethodView: {
    continueButton:
      "//*[@id=\"checkout-delivery-step\"]/div//*[contains(text(), 'Continue')]",
  },
  totalAmountView: {
    totalAmountLabel: '//*[@id="js-checkout-summary"]/div[2]/div[1]/span[2]',
  },
};

const shippingMethods = [
  { method: "My carrier", xpath: "//*[contains(text(), 'My carrier')]", cost: 10 },
  { method: "My cheap carrier", xpath: "//*[contains(text(), 'My cheap carrier')]", cost: 3 },
];

quantitys = [1, 4];

const productVariants = [
  { type: "S", xpath: '//*[@id="group_1"]/option[1]' },
  { type: "M", xpath: '//*[@id="group_1"]/option[2]' },
  { type: "L", xpath: '//*[@id="group_1"]/option[3]' },
];
const products = [
  {
    name: "Hummingbird Printed sweater",
    xpath:
      '//*[@id="content"]/section[1]/div/div[2]/article/div/div[1]/a/picture/img',
    price: 35.9,
  }
];
const guestAddresses = [
  {
    address: "US-guest",
    pcode: "11111",
    countryXpath: "//*[contains(text(), 'United States')]",
    stateXPath: "//*[contains(text(), 'California')]",
    tax: 0,
  },
  {
    address: "FR-guest",
    pcode: "22222",
    countryXpath: '//*[@id="field-id_country"]/option[2]',
    stateXPath: '//*[@id="field-id_country"]/option[2]',
    tax: 0.2,
  },
];