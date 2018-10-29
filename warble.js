//This document details what's gonna happen on the warble.html page due to Javascript

//TODO If stuff changes in the future then these values
const APPEND_TO_MAKE_FULL_ID = "http://data.media.theplatform.com/media/data/Media/Field/";

const DEV_MAIN_ACCOUNT = "2686406403";
const DEV_MAIN_ACCOUNT_CF_SHOWS = "214169463";

const STAGE_MAIN_ACCOUNT = "2649273223";
const STAGE_MAIN_ACCOUNT_CF_SHOWS = "155289480";

const PROD_MAIN_ACCOUNT = "2649321885";
const PROD_MAIN_ACCOUNT_CF_SHOWS = "156313528";

const STAGE_WETV = '2676155873';
const STAGE_WETV_CF_SHOWNAME = '183961471';

// logic to decide what to display based on what our worldstate is like
if (isSignedIn() && isInAccount() && isInTask()) { // got all the stuff
  let tsk = accessTask();
  tsk = JSON.parse(tsk);

  switch (tsk.currentTask) {
    case "cf_addShow":
      init_AddShow()
      break;
    default:
      break;
  }
} else {
  console.log("you don't have all the info you need, sending you back to welcome.html");
  window.location.href = "welcome.html";
}

// returns the url to get the existing shows given a token and a customfield_identifier
function urlToGetShows(token, cf_identifier) {
  const getAllowedValuesForShowsURL = "http://data.media.theplatform.com/media/data/Media/Field/" + cf_identifier +
    "?schema=1.10.0&searchSchema=1.0.0&form=cjson&pretty=true&fields=allowedValues&token=" + token;
  return getAllowedValuesForShowsURL;
}


// A function that displays the stuff necessary to start adding one show (exactly as input) to the allowedValues array within the customField Show
function init_AddShow() {
  // if the account we're working with has the ability to add a show, then we'll display the option to, otherwise we display 'cant add show'
  if (!canAddShow()) { // can't add show
    let sry = document.createElement('p');
    sry.textContent = 'Sorry, this account cannot add an allowedValue to the Show custom Field.';
    document.body.appendChild(sry);

  } else { // can add show

    let d = document.createElement('div');
    d.innerHTML = '<h1> Add a show </h1>' + '<hr> <p>Be sure before you press Add.</p> ' +
      '<p>Everything is case sensitive. </p>';
    document.body.appendChild(d);

    // append form to body that allows you to click it,
    // a 'you sure' function activates which displays info including your input and which account
    // if you press ok there, it does the thing (an onload, ajax fn), and displays the results when they come back

    // This is an async function that does all the stuff asynchroniously, will populate some stuff in html
    //makes request to get existing shows, then adds them in the form of a (string) to the html in the alert id

    // PUT ALL OUR INFO ON THE TABLE
    let obj = pullOutStuffForAddShow();
    console.log('Obj', obj);
    let token = obj.token;
    let account = obj.accountID;
    let task = obj.task;


    // retrieve the account number
    let customFieldNumber = getCustomFieldForAccount(account);
    const existingShowsURL = urlToGetShows(token, customFieldNumber);

    // does the request, starts the things that happen after
    fetch(existingShowsURL)
      .then(response => response.json())
      .then(data => {
        console.log(JSON.stringify(data));
        let arrayShows = data.allowedValues;
        storeExistingShows(arrayShows); // STORES THE EXISTING SHOWS SO WE CAN access EM ONCE AND THAT's IT
        console.log('Existing Shows: ', arrayShows);
        //parses the data (response and puts the result in a var we'll call Readable)
        let readable = "\n";
        // runs through the arrayShows
        for (let i = 0; i < arrayShows.length; i++) {
          readable += arrayShows[i] + ", \n"
        }
        // trims the end of the ', '
        readable = readable.substring(0, readable.length - 3)
        let currentShows = document.createElement('div');
        currentShows.setAttribute('id', 'currentShows');
        currentShows.style = 'white-space: pre-wrap';
        currentShows.textContent = 'ExistingShows: ' + readable;

        document.body.appendChild(document.createElement('hr'));
        document.body.appendChild(currentShows);
      })
      .catch(error => console.error(error));
  }

  let alert = document.createElement('div');
  alert.setAttribute('id', 'alert');
  alert.style = 'color: red';

  let lab = document.createElement('label');
  lab.setAttribute('for', 'show_name');
  lab.textContent = 'Show Name: ';

  let inp = document.createElement('input');
  inp.setAttribute('type', 'text');
  inp.setAttribute('name', 'show_name');
  inp.setAttribute('id', 'addShowInput');
  inp.setAttribute('style', 'width: 300px');

  let submit = document.createElement('input');
  submit.setAttribute('value', 'Add');
  submit.setAttribute('type', 'submit');
  submit.setAttribute('onclick', 'submitAddShow()');

  let div = document.createElement('div');
  div.setAttribute('id', 'addShowForm');

  div.appendChild(lab);
  div.appendChild(inp);
  div.appendChild(submit);

  document.body.appendChild(alert);
  document.body.appendChild(div);
}

// STUB TODO: This function will tell you if you can add a show using the account you're in
function canAddShow() {
  return true;
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

// TODO at some point in the process must differentiate the big account things from the not big accounts,
// TODO like AMC Networks Dev -- AMC and AMC Networks Stage --- with admin are not the same class of accounts

//TODO Edit this if the Show Custom Field Changes within these accounts

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
  let token = "";
  let accountID = "";
  let task = "";


  if (isSignedIn()) {
    let signin = accessSignIn();
    signin = JSON.parse(signin);
    token = signin.token;

    if (isInAccount()) {
      let accObj = accessAccount();
      accObj = JSON.parse(accObj);
      accountID = accObj.currentAccountID;
    }
  }

  let tskObj = accessTask();
  tskObj = JSON.parse(tskObj);
  task = tskObj.currentTask;

  let object = {
    'token': token,
    'accountID': accountID,
    'task': task
  };
  return object;
}

function displayYouSure() {
  // display all the info we got in the html (json form and interpreted), asks if this is what you want,
  // displays a button with 'i'm sure' on it that hits a function that sends us to warble.html
  console.log('asking user: you sure bout this? <displays data>');

  // the form element (big)
  let yousure = document.createElement('form');
  yousure.setAttribute('class', 'YouSureForm');
  yousure.textContent = 'You sure?';

  let linebreak = document.createElement('br');

  // a div with json bit
  let explanation = document.createElement('div');
  explanation.textContent = 'This is what you input: ';

  let displayPlain = document.createElement('p');
  displayPlain.textContent = worldState('plain');

  let warble = document.createElement('button');
  warble.setAttribute('onclick', 'checkYouSure();');
  warble.innerHTML = 'Move On';

  document.body.appendChild(yousure);
  document.body.appendChild(linebreak);
  document.body.appendChild(explanation);
  document.body.appendChild(linebreak);
  document.body.appendChild(displayPlain);

  document.body.appendChild(warble);
}
