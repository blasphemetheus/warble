// A Javascript File that funs through all the javascript functionality of the welcome page.
// Currently does not use JQUERY, does use AJAX. TODO probably needs better ordering system

// [Hell, Is, Irony]

displayLoginStatus();

let currentStateOfCustomFieldIdentifier = false;

// Promise
let doIHaveAllTheInfoNeededForThisAccount = new Promise((resolve, reject) => {
  if (currentStateOfCustomFieldIdentifier) {
    let answer = {
      currentAccount: 'dev',
      adminPriveleges: 'true'
    };
    resolve(answer); // fulfilled
  } else {
    let reason = new Error('data means no');
    reject(reason); // reject
  }
});

let tryFetch = () => {
  doIHaveAllTheInfoNeededForThisAccount
    .then((fulfilled) => {
      // yay got all the info
      console.log(fulfilled);
      // output: {currentAccount: 'dev', adminPriveleges: 'true'}
    }, (error) => console.log(error.message));
};

tryFetch();



//////////////////////// https://javascript.info/promise-basics



let promise = new Promise(function(resolve, reject) {
  // do thing, possibly async, then ...

  if (true == true /*everything is fine */ ) {
    resolve("stuff worked");
  } else {
    reject(Error("It broke"));
  }
});

promise.then((result) => console.log(result), (err) => console.error(err));
// NOTE: uncomment logSession to have the various things we deal with in sessionStorage logged to console
// logSession();

// pull out string of JSON with name 'SignIn' from within all the cookies
// if there isn't any such thing, signInCookie gets set to ""

//logic for what worldState we're in (based on sessionStorage)
if (!isSignedIn()) { // No, not signed in
  console.log('WELCOME - Logic Branch - No SignIn');
  // just do this to generate html (adds a SignIn button to end of file)
  displayLinkToSignIn();

} else if (!isInAccount()) { // Yes - signedIn, but NOT in an Account
  console.log('WELCOME - Logic Branch - Yes SignIn, No Account');
  // since we don't have an accounts storage item , lets list accounts

  // display the prompt for choosing an account, it'll error out if we don't have a signin
  selectAccounts();

} else { // Yes - signin, Yes - Account, Yes - Task
  console.log('WELCOME - Logic Branch - Yes SignIn, Yes Account');

  storeCustomFieldIfExistsThenRedirect();
}

function moveToWarble() {
  window.location.href = 'warble.html';
}
// ... -------------------- ... //

// reloads page
function reload() {
  window.location.href = 'welcome.html';
}

// stores a custom field for the selected account should one exist
function storeCustomFieldIfExistsThenRedirect() { // TODO: FIX THIS
  let thing = accessAccount();
  console.log(thing);
  thing = JSON.parse(thing);
  let shortID = thing.currentAccountID;
  console.log(shortID);

  let th = accessSignIn();
  console.log(th);
  th = JSON.parse(th);
  let token = th.token;
  console.log(token);

  let longAccountID = "http%3A%2F%2Faccess.auth.theplatform.com%2Fdata%2FAccount%2F" + shortID;

  let urlOneAccount = "http://data.media.theplatform.com/media/data/Media/Field" + "?byFieldName=show" +
    "&token=" + token + "&account=" + longAccountID +
    "&schema=1.8.0&fields=id%2Ctitle%24allowedValues&form=json";
  console.log(urlOneAccount);

  fetch(urlOneAccount)
    .then((response) => response.json(), (error) => console.error(error))
    .then((data) => {
      console.log('hello');
      console.log(data);

      if (data.entryCount == 0) {
        let err = new Error('zero entries in response');
        console.error(err, data);
      }

      let thing = data.entries;
      console.log(thing);
      let thing2 = thing[0];
      console.log(thing2);
      let thing3 = thing2.id;
      console.log(thing3);

      if (typeof thing3 !== "string" || thing3 == "") {
        console.error('wierd', thing3);
        throw new Error("couldn't pull out custom field");
      }
      // TODO FIX PROMISES
      enterCustomFieldID(thing3);
      return true;
    }, (error) => console.error(error)).then((data) => moveToWarble());

  let allAccountsWithTitle = "http://data.media.theplatform.com/media/data/Media/Field" + "?byFieldName=show" +
    "&token=" + token +
    "&schema=1.8.0&fields=id%2Ctitle%24allowedValues&form=json";
} // TODO: FIX THIS






// given a currentAccount (string)
// the function that gets called when the user presses the button for choosing an account
// pulls out the arrAccounts and clears it from sessionstorage,
// then calls saveArrayAccounts with the info it has, then reloads
function checkPickAccount(curAccount) {

  let arrAccounts = getPossibleAccounts(); // gotta get the array of stuff out of storage (a workaround to design)
  let arrAccountsObj = JSON.parse(arrAccounts);

  function getSpecificAccountObject(arrAccountsObj, curAccount) {
    let found;
    for (let element of arrAccountsObj) {
      let longId = element.id;
      let shortId = retrieveLastTenChars(longId);
      if (curAccount == shortId) {
        return element;
      }
    }
  }

  let curAccountObj = getSpecificAccountObject(arrAccountsObj, curAccount);
  console.log('The Object representing our Account: ', curAccountObj);

  //makes sure the current arrayAccounts (as given) is saved in sessionStorage
  // along with the selected one, overwrites previous sessionStorage string if there is one

  // this is the format of the JSON we will have in sessionStorage
  // sets the JSON we'll be using to
  let buildingAccountJSON = {
    currentAccountID: curAccount,
    currentAccountObj: curAccountObj,
  };
  console.log('The Account Object Getting Stored: ', buildingAccountJSON);

  // sessionStorage storing Account
  enterAccount(JSON.stringify(buildingAccountJSON, Symbol('\"')));
}

// the fuction that gets called when user presses the warble button after choosing everything
function checkYouSure() {
  console.log('you checked, and were sure');
  // make sure all this stuff is saved in sessionStorage ???
  // to catch any weird errors, just check that these things
  if (isSignedIn() && isInAccount() && isInTask()) {
    // redirect to warble.js, which is where we will do tasks. For now only add an allowedValue to Shows
    window.location.href = 'warble.html';
  } else { // if you got here in the ifs, I don't know what went wrong, logic or my brain has broken
    logSession();
    new Error('Yo something went wrong, the stuff stored is not totally correct, check console for logs');
  }
}

// ... -------------------- ... //
// ... -------------------- ... //


/// end eventListeners
/* ONLY FUNCTIONS FROM HERE ON OUT */

// Removes an element from the document as specified by elementID
function removeElement(elementId) {
  // Removes an element from the document
  var element = document.getElementById(elementId);
  element.parentNode.removeChild(element);
}

// function that clears the previous stuff (deletes the form with the id selectAccountForm out)
function clearStuff() {
  // TODO change the design so this makes more sense, just removes the node with the content id
  // remove selectAccountForm
  var stuff = document.getElementById('selectAccountForm');
  stuff.parentNode.removeChild(stuff);
  // removes content node
  var content = document.getElementById('content');
  content.parentNode.removeChild(content);
}


// ... -------------------- ... //

// ---------------------- END memory functionality ----------------- //
/// The other method for form submit



// allow the user to select an account, errors out if we don't have the signin necessary to do THIS
// list the accounts linked to this token, display appropriate
//messaging if token is invalid, specify behavior when Select button is pressed
function selectAccounts() {
  // lets parse the signIn Object we put in sessionStorage previously
  signInFo = JSON.parse(accessSignIn());
  // rn we only need the token part of the stached object, so lets pull that out
  let platToken = signInFo.token;
  //throw error if no token
  if (platToken == null) {
    console.error('Token is null and shouldn\'t be, check that logging in is working properly');
  }

  // header (informational, what step?)
  var header = document.createElement('h3');
  header.innerHTML = "Which Account?";

  var para = document.createElement('p');
  para.innerHTML = "What follows are the accounts you can see, based on your credentials. Click on the button of the account you would like to use";

  document.getElementById('content').appendChild(header);
  document.getElementById('content').appendChild(para);

  console.log('Fetching accounts for user to choose from');

  // the url to list accounts associated with the TOKEN we have (passed in at beginning of fn)
  const urlListAccounts = 'https://web.mpx.theplatform.com/cws/web/Shell/lookupAccount' +
    '?schema=2.0&form=json&token=' + platToken + '&_pattern';

  fetch(urlListAccounts)
    .then((response) => response.json(), (error) => console.error(error))
    // here we define the function that tells it what to do when the response is loaded
    .then((myJSON) => {
      /* FORM of response
          {"lookupAccountResponse" : {
            "result" : [{
            "pid" : "lkajsdlk",
            "label" : "NAME OF ACCOUNT",
            "id" : "urlurlurlurlurl/Account/2468234234"
          }, ... ]
        }
      }
      */
      console.log("onload Triggered for ListAccounts Request");
      console.log("ListAccounts request", myJSON);
      let stringJSON = JSON.stringify(myJSON);
      console.log('String of JSON: ', stringJSON);

      // logic for determining if lookupAccountResponse is present, ie whether the listAccounts request failed or not
      if (myJSON.lookupAccountResponse == null) {
        // lookup failure
        displayString('ERROR ERROR ERROR, LOOKUP LISTACCOUNTS FAILURE, Please login again');
        console.error('No response exists, problem in your logic for onload?');
        new Error('this is an error');
        // i dunno if these errors take you out of this fn, so just in case i'm putting em in
        // TODO take out if not necessary
        return;
      }

      console.log('Accounts lookup successful');
      //Here is the array of items returned by this lookup
      arrayAccounts = myJSON.lookupAccountResponse.result;
      console.log("Array of Accounts: ", arrayAccounts);

      // TODO: get rid of this hacky addJustArray functionality and make the account object just have all this in it
      // for reference, I'm currently saving the arrayAccounts for later when we build the object we'll save in sessionStorage,
      // when we use the arrayAccounts to build the Accounts saved object, then I will clear out the arrayAccounts
      // item in sessionStorage
      addPossibleAccounts(arrayAccounts);

      // makin the form we'll use to select a specific account
      // on submission, this form activates checkPickAccount, which does all that is necessary
      let f = document.createElement('form');
      f.setAttribute('id', 'selectAccountForm');
      // this next line is crucial, could sub out the function but alert(this.submitted),
      //  then we set onclick to be 'this.form.submitted=this.value;' in each input
      f.setAttribute('onsubmit', 'checkPickAccount(this.submited);');
      f.setAttribute('class', 'selectAccountForm');
      document.body.appendChild(f);

      let explain = document.createElement('p');
      explain.textContent = "<name of the account> : <id number of the account> : <public identifier of the network the account is linked to>"
      document.body.appendChild(explain);

      // go through each object in arrayAccounts and create an html representation of it
      // with a button after it
      arrayAccounts.forEach((element) => {
        let pid = element.pid;
        let id = element.id;
        let label = element.label;
        // call the function that we made just to retrieve out the last ten chars from a string
        let shortID = retrieveLastTenChars(element.id);

        let lab = document.createElement('label');
        lab.innerHTML = label + " \t\t: " + shortID + ' \t\t: ' + pid + ' \t\t';

        // have it print out a <label> with label variable inside of it </label>
        let inp = document.createElement('input');
        inp.setAttribute('type', 'submit');
        inp.setAttribute('name', 'whichAccount');
        inp.setAttribute('value', shortID);
        inp.setAttribute('shortId', shortID);
        inp.setAttribute('PID', pid);
        inp.setAttribute('label', label);
        inp.setAttribute('onclick', 'this.form.submited=this.value');

        document.getElementById('selectAccountForm').appendChild(lab);
        document.getElementById('selectAccountForm').appendChild(inp);
        document.getElementById('selectAccountForm').appendChild(document.createElement('br'));
      }); // end of foreach of arrayAccounts
    }, (error) => console.error(error)); // end of then fn (like onload)
} // end of selectAccounts() fn

// appends to end of file, the Button directing you to login again
function displayLinkToSignIn() {
  // creating the child (of hidden)
  let div = document.createElement('div');
  // give it a class
  div.className = 'LoginPlease';
  div.textContent = 'Click the button to login';
  div.innerHTML = '<button class="redirect" type="button" onclick="redirectLogin()" height="100">click to ReLogin</button>';
  // putting in the child
  var parentNode = document.body;
  parentNode.appendChild(div);
}

// function that redirects back to login page
function redirectLogin() {
  document.location.href = 'login.html';
}

// given a string, displays addThis within the content div
function displayString(addThis) {
  var div = document.createElement('div');

  div.className = 'displayString';

  div.innerHTML =
    ' <p>' + addThis + '</p>';

  document.getElementById('content').appendChild(div);
}

// the illustrative boom function, appends a <p> with boom! in it to content
function boom() {
  var paragraph = document.createElement('p');
  paragraph.textContent = 'boom!';
  document.getElementById('content').appendChild(paragraph);
}


// -------------------------------

// given a string, retrieves the last ten characters of it
function retrieveLastTenChars(longId) {
  return longId.substring(longId.length - 10, longId.length);
}


// function addEventListeners() {
//   let attemptPickAccount = document.querySelector('selectAccountForm');
//
//   if (attemptPickAccount == null) {
//     new Error('attemptPickAccount is null, nothing with id selectAccountForm ')
//   } else {
//     /// add an event listener
//     attemptPickAccount.addEventListener('click', checkPickAccount);
//   }
//
//   let attemptLogin = document.querySelector('attemptLogin');
//   if (attemptLogin == null) {
//     new Error('attemptLogin is null, nothing with id attemptLogin');
//   } else {
//     /// add an event listener
//     loginAttempt.addEventListener('click', checkLogin);
//   }
// }
//
// addEventListeners();
