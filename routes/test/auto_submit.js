var pRequest = require("promisified-request").create();
var fScraper = require("form-scraper");
 
var formStructure = fScraper.fetchForm("#question_list", "https://www.yourfreecareertest.com", pRequest);
var loginDetails = { user: "my user", password: "my password" };
 
fScraper.submitForm(loginDetails, fScraper.provideForm(formStructure), pRequest).then( function (response) {
    console.log(response.body);
)};



var Browser = require("zombie");
var assert = require("assert");

browser = new Browser()
browser.visit("http://duckduckgo.com/", function () {
    // fill search query field with value "zombie"
    browser.fill('input[name=q]', 'mouse');
    // **how** you find a form element is irrelevant - you can use id, selector, anything you want
    // in this case it was easiest to just use built in forms collection - fire submit on element found
    browser.document.forms[0].submit();
    // wait for new page to be loaded then fire callback function
    browser.wait().then(function() {
        // just dump some debug data to see if we're on the right page
        console.log(browser.dump());
    })
});



var Browser = require("zombie");
var assert = require("assert");

browser = new Browser()
browser.visit("https://www.nordnet.fi/mux/login/startFI.html?cmpi=start-loggain", function () {
    // fill in login field
    browser.fill('#input1', 'zombie');
    // fill in password field
    browser.fill('#pContent', 'commingyourway');
    // submit the form
    browser.document.forms[1].submit();
    // wait for new page to be loaded then fire callback function
    browser.wait().then(function() {
        console.log('Form submitted ok!');
        // the resulting page will be displayed in your default browser
        browser.viewInBrowser();
    })
});