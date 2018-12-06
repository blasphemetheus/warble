https: // runs through all the javascript functionality of the welcome page.
  // [Hell, Is, Irony]

  displayStatusInHTML();

// NOTE: run logSession to have the various things we deal with in sessionStorage logged to console
logSession();

// we do different stuff when user is one of:
//    signedOut,    signedIn AND outOfAccount,    signedIn AND inAccount
// this is that logic
if (!isSignedIn()) { // No, not signed in
  console.log('User is signedOut');
  window.location.href = 'login.html';
  // // just do this to generate html (adds a SignIn button to end of file)
  // displayLinkToSignIn();
} else if (!isInAccount()) { // Yes - signedIn, but NOT in an Account
  console.log('User is signedIn AND outOfAccount');
  // since we don't have an accounts storage item , lets list accounts

  // before looking up possible accounts, we should prob clear out an y previous possibleAccounts in storage
  clearPossibleAccounts();
  // display (in html) the prompt for choosing an account, it'll error out if we don't have a signin
  displaySelectAccount();
} else { // Yes - signin, Yes - Account
  console.log('User is signedIn AND inAccount');
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
  let acc = JSON.parse(accessAccount());
  let shortID = acc.currentAccountID;

  let th = accessSignIn();
  console.log(th);
  th = JSON.parse(th);
  let token = th.token;
  console.log(token);

  let longAccountID = "http%3A%2F%2Faccess.auth.theplatform.com%2Fdata%2FAccount%2F" + shortID;

  let urlOneAccount = "https://data.media.theplatform.com/media/data/Media/Field" + "?byFieldName=show" +
    "&token=" + token + "&account=" + longAccountID +
    "&schema=1.8.0&fields=id%2Ctitle%24allowedValues&form=json";

  // this fetches  the stuff at the url that will return one account
  fetch(urlOneAccount)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      if (data.entryCount == 0) {
        let err = new Error('zero entries in response - There is no custom field for this account');
        console.error(err, data);
      }

      let entries = data.entries;
      console.log(entries);
      let firstOfEntriesArray = entries[0];
      console.log(firstOfEntriesArray);
      let idOfDesiredInfo = firstOfEntriesArray.id;
      console.log(idOfDesiredInfo);

      if (typeof idOfDesiredInfo !== "string" || idOfDesiredInfo == "") {
        console.error('wierd', idOfDesiredInfo);
        throw new Error("couldn't pull out custom field");
      }
      // TODO FIX PROMISES
      enterCustomFieldID(idOfDesiredInfo);
      return true;
    })
    .then((data) => moveToWarble())
    .catch((error) => console.log(error));

  let allAccountsWithTitle = "https://data.media.theplatform.com/media/data/Media/Field" + "?byFieldName=show" +
    "&token=" + token +
    "&schema=1.8.0&fields=id%2Ctitle%24allowedValues&form=json";
} // TODO: FIX THIS


// // the function that gets called when user presses the warble button after choosing everything
// function checkYouSure() {
//   console.log('you checked, and were sure');
//   // make sure all this stuff is saved in sessionStorage ???
//   // to catch any weird errors, just check that these things
//   if (isSignedIn() && isInAccount() && isInTask()) {
//     // redirect to warble.js, which is where we will do tasks. For now only add an allowedValue to Shows
//     window.location.href = 'warble.html';
//   } else { // if you got here in the ifs, I don't know what went wrong, logic or my brain has broken
//     logSession();
//     new Error('Yo something went wrong, the stuff stored is not totally correct, check console for logs');
//   }
// }

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

//checkPickAccount ....
// given a currentAccount (string)
// the function that gets called when the user presses the button for choosing an account
// pulls out the arrAccounts and clears it from sessionstorage,
// then calls saveArrayAccounts with the info it has, then reloads
// .......
// this function happens before redirect, if the redirect is ok to happen,
// return true, else return false and it will not occur
function happensBeforeRedirect() { // == checkPickAccount(this.submited)
  console.log('happense before redirect');

  var e = document.getElementById("iamtheselectmenu");
  var strUser = e.options[e.selectedIndex].value;

  // yay we passed in curAccount!
  let curAccount = strUser;
  console.log('the Account passed in: ', curAccount);

  let arrAccounts = getPossibleAccounts(); // gotta get the array of stuff out of storage (a workaround to design)

  // go into possible accounts and pull out the accObj associated with given id, returns that obj
  function getSpecificAccountObject(arrAccounts, curAccountID) {
    let found;
    for (let element of arrAccounts) {
      let longId = element.id;
      let shortId = retrieveLastTenChars(longId);
      if (curAccountID == shortId) {
        return element;
      }
    }
  }

  let curAccountObj = getSpecificAccountObject(arrAccounts, curAccount);
  console.log('The Object representing our Account: ', curAccountObj);

  // this is the format of the JSON we will have in sessionStorage
  // sets the JSON we'll be using to
  let buildingAccountJSON = {
    currentAccountID: curAccount,
    currentAccountObj: curAccountObj,
  };
  console.log('The Account Object Getting Stored: ', buildingAccountJSON);

  // sessionStorage storing Account
  enterAccount(JSON.stringify(buildingAccountJSON, Symbol('\"')));

  // so at this point we stored the accountJSON with the object in it

  //
  // let trackerbool = null;

  // start isadmin

  // if (!(isSignedIn() && isInAccount())) {
  //   throw new Error('You\'re not in account or not signed in - can\'t therefore cannot check if admin');
  // }
  // // pull out the token and longAccountID
  // let accountObj = accessAccount();
  // accountObj = JSON.parse(accountObj);
  // let acc = accountObj.currentAccountObj;
  // let longAccountID = acc.id;
  // let signin = accessSignIn();
  // signin = JSON.parse(signin);
  // let token = signin.token;

  // var admin = null;
  // let urlToCheckAdmin = "https://access.auth.theplatform.com/web/Authorization/authorize" +
  //   "?account=" + longAccountID + "&form=json" + "&token=" + token + "&schema=1.3" +
  //   "&_operations%5B0%5D.service=Console%20Data%20Service&_operations%5B0%5D.method=POST&_operations%5B0%5D.endpoint=MenuItem";
  // console.log(urlToCheckAdmin);
  //
  // fetch(urlToCheckAdmin)
  //   .then((response) => response.json())
  //   .then((data) => {
  //     console.log('looksie');
  //
  //     console.log('response obj', data);
  //     if (data.responseCode == 403) {
  //       console.log('Checked if user is admin of current account and they are not');
  //       // WORKFLOW FOR NOT BEING AN ADMIN
  //       reject(new Error(data.description + 'THE USER ISN\'T AN ADMIN ON THIS ACCOUNT BRUV'));
  //     }
  //     if (data.authorizeResponse != null) {
  //       console.log('Checked if user is admin of current account and they are indeed');
  //       // WORKFLOW FOR BEING AN ADMIN
  //       console.log('Here is response to request to check Admin', data.authorizeResponse);
  //       resolve("response: " + JSON.stringify(data.authorizeResponse));
  //     }
  //   }).catch((error) => console.error(error));



  // let promise = new Promise(function(resolve, reject) {
  // });
  //
  // promise.then(
  //   result => {
  //     alert(result);
  //     trackerbool = true;
  //     console.log('tracker', trackerbool);
  //     console.log('tracker');
  //
  //   }, error => {
  //     alert(error);
  //     trackerbool = false;
  //     console.log('tracker', trackerbool);
  //     console.log('tracker');
  //   }
  // );

  // let adminHuh = isAdmin(strUser);
  // console.log('isadminPromise ', adminHuh);
  //
  // if (adminHuh) {
  //   console.log('is');
  //   alert("This sign-in is an admin for the account " + strUser + " -- congrats, moving on now...");
  //   return true;
  // } else {
  //   console.log('is not');
  //   alert("This sign-in is not an admin for the account " + strUser + " -- sadness, anyway, refresh to move on or just choose a different account...");
  //   return false;
  // }
}

// appends stuff to html allowing user to select an account,
//  errors out if we don't have the signin necessary to do THIS
// list the accounts linked to this token, display appropriate
//  messaging if token is invalid, specify behavior when Select button is pressed
function displaySelectAccount() {
  // lets parse the signIn Object we put in sessionStorage previously
  signInFo = accessSignIn();
  signInFo = JSON.parse(signInFo);
  // rn we only need the token part of the stashed object, so lets pull that out
  let platToken = signInFo.token;
  //throw error if no token
  if (platToken == null) {
    console.error('Token is null and shouldn\'t be, check that logging in is working properly');
  }

  // create instructions for user
  var header = document.createElement('h3');
  header.innerHTML = "Select Account";
  var para = document.createElement('p');
  para.innerHTML = "Your MPX credentials can see the following Accounts.";
  let exp = document.createElement('p');
  exp.textContent = "Select the one you would like to work with. The format is as follows: ";
  let explain = document.createElement('p');
  explain.textContent = "Environment of Account ---- Name of Account ---- Unique ID of Account";

  // put instructions for user in html (append to the first element with the 'content' id)
  document.getElementById('content').appendChild(header);
  document.getElementById('content').appendChild(para);
  document.getElementById('content').appendChild(exp);
  document.getElementById('content').appendChild(explain);

  // ----- Fetch accounts for the user to select from -----
  // the url to lookup accounts for a token is hardcoded in, we just paste in the token
  const urlListAccounts = 'https://web.mpx.theplatform.com/cws/web/Shell/lookupAccount' +
    '?schema=2.0&form=json&token=' + platToken + '&_pattern';
  // lets get asynchronous baby ~~~ this is a get http request to the url specified, then we do stuff with the response, ~asynchronously~
  // this fetch is for getting the accounts that are possible for us to choose and populate them in a dropdown menu that we can choose from
  fetch(urlListAccounts)
    .then((response) => {
      if (!response.ok) {
        throw Error(`Request rejected with status ${response.status}`);
      }
      return response.json();
    })
    // here we define the function that tells it what to do when the response is loaded
    .then((myJSON) => {
      /* FORMAT of valid response
          {"lookupAccountResponse" : {
            "result" : [{...}, ...]
            "pid" : "lkajsdlk",
            "label" : "NAME OF ACCOUNT",
            "id" : "urlurlurlurlurl/Account/2468234234"
          }, ... ]
        }
      }
      */

      let stringJSON = JSON.stringify(myJSON);
      // logic for determining if lookupAccountResponse is present, ie whether the listAccounts request failed or not
      if (myJSON.lookupAccountResponse == null) {
        // lookup failure
        displayString('ERROR ERROR ERROR, LOOKUP LISTACCOUNTS FAILURE, Please login again');
        console.error('No listpossibleaccounts response exists, or is malformed');
        let heythere = new Error('this is an error');
        console.log(heythere);
        return;
      }
      // if it made it here then ...
      console.log('Accounts lookup successful');
      //Here is the array of items returned by this lookup
      arrayAccounts = myJSON.lookupAccountResponse.result;

      // TODO: get rid of this hacky addJustArray functionality and make the account object just have all this in it
      // for reference, I'm currently saving the arrayAccounts for later when we build the object we'll save in sessionStorage,
      // when we use the arrayAccounts to build the Accounts saved object, then I will clear out the arrayAccounts
      // item in sessionStorage
      addPossibleAccounts(arrayAccounts);

      // makin the form we'll use to select a specific account
      // on submission, this form activates checkPickAccount, which does all that is necessary
      let f = document.createElement('form');
      f.setAttribute('action', '/warble.html');
      f.setAttribute('method', 'GET');
      f.setAttribute('onsubmit', 'return happensBeforeRedirect(this.submited);'); // if returns true, then it submits, redirecting, if false, then not
      // this next line is crucial, could sub out the function but alert(this.submitted),
      //  then we set onclick to be 'this.form.submitted=this.value;' in each input
      //f.setAttribute('onsubmit', 'checkPickAccount(this.submited);');
      f.setAttribute('id', 'selectAccountForm');
      f.setAttribute('class', 'selectAccountForm');
      // put in select menu
      let select = document.createElement('select');
      select.setAttribute('id', 'iamtheselectmenu');

      for (let i = 0; i < arrayAccounts.length; i++) {
        let element = arrayAccounts[i];
        let environment = null;
        let pid = element.pid;
        // pull out the info from the element (obj with info)
        let id = element.id;
        let label = element.label;
        // call the function that we made just to retrieve out the last ten chars from a string
        let shortID = retrieveLastTenChars(element.id);

        environment = whichEnvironment(pid); // this is in info.js

        let explanation = environment + " \t\t---- " + label + ' \t\t---- ' + shortID + ' \t\t';

        let option = document.createElement('option');
        option.setAttribute('value', shortID);
        option.textContent = explanation;

        select.appendChild(option);
      }

      f.appendChild(select);

      let input = document.createElement('input');
      input.setAttribute('type', 'submit');
      f.appendChild(input);

      document.body.appendChild(f);
    })
    .catch((error) => console.error(error)); // end of then fn (like onload)
} // end of displaySelectAccount() fn

// appends to end of file, the Button directing you to login again
function displayLinkToSignIn() {
  // creating the child (of hidden)
  let div = document.createElement('div');
  // give it a class
  div.className = 'LoginPlease';
  div.textContent = 'Click the button to login';
  div.innerHTML = '<button class="redirect" type="button" onclick="redirectLogin()" height="100">click to Sign In</button>';
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
