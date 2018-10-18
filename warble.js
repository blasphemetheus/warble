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

let myInfo = pullOutStuffForAddShow();



// switch that checks the account of our sessionStorage with the hard-coded constants (our id's for the Main accounts)
switch (myInfo.account) {
  case DEV_MAIN_ACCOUNT:
    // TODO will add the rest of the dev accounts (ifc, amc, bbca, sundance, wetv) so they go to this logic branch
    alert('dev'); // TODO
    break;

  case STAGE_MAIN_ACCOUNT: // TODO look at dev bit
    alert('stage'); // TODO
    break;

  case PROD_MAIN_ACCOUNT: // TODO look at dev bit
    alert('prod'); // TODO: stub, will have actual behavior that attempts to call the task on this account,
    // TODO: if your authorization is messed up (not an admin/not high enough priveleges), it should tell the user
    break;

  default:
    alert('something went wrong, the account we\'re trying to do stuff with is not an admin account');
    break;
}

displayAddShow();

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
