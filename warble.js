//This document details what's gonna happen on the warble.html page due to Javascript

//TODO If stuff changes in the future then these values
const APPEND_TO_MAKE_FULL_ID = "http://data.media.theplatform.com/media/data/Media/Field/";

const DEV_MAIN_ACCOUNT = "2686406403";
const DEV_MAIN_ACCOUNT_CF_SHOWS = "214169463";

const STAGE_MAIN_ACCOUNT = "2649273223";
const STAGE_MAIN_ACCOUNT_CF_SHOWS = "155289480";

const PROD_MAIN_ACCOUNT = "2649321885";
const PROD_MAIN_ACCOUNT_CF_SHOWS = "156313528";


// TODO at some point in the process must differentiate the big account things from the not big accounts,
// TODO like AMC Networks Dev -- AMC and AMC Networks Stage --- with admin are not the same class of accounts

//TODO Edit this if the Show Custom Field Changes within these accounts

// STUB TODO: This function will tell you if you can add a show using the account you're in 
function canAddShow() {
  return true;
}

// if the account we're working with has the ability to add a show, then we'll display the option to, otherwise we display 'cant add show'
if (canAddShow()) {
  displayAddShow();
} else {
  let sry = document.createElement('p');
  sry.textContent = 'Sorry, this account cannot add an allowedValue to the Show custom Field.';
  document.body.appendChild(sry);
}
// -------------- function below, scripts above

// Removes an element from the document as specified by elementID
function removeByID(elementId) {
  // Removes an element from the document
  var element = document.getElementById(elementId);
  element.parentNode.removeChild(element);
}

/// -------------------------------

// this function will pull out the stuff we need to add a show and return an object with all the stuff in it
function pullOutStuffForAddShow() {
  let signin = accessSignIn();
  signin = JSON.parse(signin);
  let token = signin.token;

  let accObj = accessAccount();
  accObj = JSON.parse(accObj);
  let account = accObj.currentAccount;

  let tskObj = accessTask();
  tskObj = JSON.parse(tskObj);
  let task = tskObj.currentTask;

  let object = {
    'token': token,
    'account': account,
    'task': task
  };
  return object;
}
