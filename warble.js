//This document details what's gonna happen on the warble.html page due to Javascript

// logic to decide what to display based on what our worldstate is like
if (isSignedIn() && isInAccount() && isInTask()) { // not got all the stuff
  let tsk = accessTask();
  tsk = JSON.parse(tsk);

  switch (tsk.currentTask) {
    case "addAllowedValueToTheShowCustomField":
      addShowGoAhead()
      break;
    default:
      break;
  }
}

// adds the Div with Informational stuff on Add Shows
function addShowGoAhead() {
  let d = document.createElement('div');
  d.innerHTML = '<h1> Add a show </h1>' + '<hr> <p>Be sure before you press Add.</p> ' +
    '<p>Everything is case sensitive. </p>';
  document.body.appendChild(d);
}


// returns as a string the custom field Shows number for the given account number. or "" with error thrown
function getCFShows(account) {
  // this bit is us telling it which customField number to use in the link
  let cfNumber = "";
  switch (account) {
    case DEV_MAIN_ACCOUNT:
      return DEV_MAIN_ACCOUNT_CF_SHOWS;
      break;
    case STAGE_MAIN_ACCOUNT:
      return STAGE_MAIN_ACCOUNT_CF_SHOWS;
      break;
    case PROD_MAIN_ACCOUNT:
      return PROD_MAIN_ACCOUNT_CF_SHOWS;
      break;
    default:
      throw new Error('Unrecognized account, cannot add shows: ', account);
      return "";
      break;
  }
}


// // logic for if we can add shows
// let myInfo = pullOutStuffForAddShow();
// // switch that checks the account of our sessionStorage with the hard-coded constants (our id's for the Main accounts)
// switch (myInfo.account) {
//   case DEV_MAIN_ACCOUNT:
//     // TODO will add the rest of the dev accounts (ifc, amc, bbca, sundance, wetv) so they go to this logic branch
//     alert('dev'); // TODO
//     return true;
//     break;
//
//   case STAGE_MAIN_ACCOUNT: // TODO look at dev bit
//     alert('stage'); // TODO
//     return true;
//     break;
//
//   case PROD_MAIN_ACCOUNT: // TODO look at dev bit
//     alert('prod'); // TODO: stub, will have actual behavior that attempts to call the task on this account,
//     // TODO: if your authorization is messed up (not an admin/not high enough priveleges), it should tell the user
//     return true;
//     break;
//
//   default:
//     alert('something went wrong, the account we\'re trying to do stuff with is not an admin account');
//     return false;
//     break;
// }

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
