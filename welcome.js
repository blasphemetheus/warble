// A Javascript File that funs through all the javascript functionality of the welcome page.
// Currently does not use JQUERY, does use AJAX. TODO probably needs better ordering system


// ---------------------- cookie stuff, stuff that runs when the js is loaded ----------------- //

logSession();
logCookies();
displaySignOut();
displayClearAccount();
displayClearTask();

// pull out string of JSON with name 'SignIn' from within all the cookies
// if there isn't any such thing, signInCookie gets set to ""

//logic for whether cookie is there or not
if (isSignedIn() == false) { // No, not signed in
  console.log('WELCOME - Logic Branch - No SignIn');
  // just do this to gen html  (adds a SignIn button under 'hidden' div
  displayLinkToSignIn();
} else if (isInAccount() == false) { // Yes - signedIn, but NOT in an Account
  console.log('WELCOME - Logic Branch - Yes SignIn, No Account');
  // since we don't have an accounts storage item , lets list accounts

  // lets parse the signIn Object we put in sessionStorage previously
  signInFo = JSON.parse(accessSignIn());

  // rn we only need the token part of the stached object, so lets pull that out
  token = signInFo.token;

  // display the prompt for choosing an account, passing in the token we need
  displayListAccounts(token);

} else if (isInTask() == false) { // Yes - signIn, Yes - Account, No - Task
  console.log('WELCOME - Logic Branch - Yes SignIn, Yes Account, No Task');

  // lets parse the signIn Object we put in sessionStorage previously
  signInFo = JSON.parse(accessSignIn());
  // rn we only need the token part of the stached object, so lets pull that out
  token = signInFo.token;

  // lets parse the account Object we put in sessionStorage before
  accountObject = JSON.parse(accessAccount());

  // display the prompt for choosing a task (passing in an accountObject and token)
  displayWhichTask(accountObject, token);

} else { // Yes - signin, Yes - Account, Yes - Task
  console.log('WELCOME - Logic Branch - Yes SignIn, Yes Account, Yes Task');

  // just some reporting yo
  console.log('signin', isSignedIn());
  console.log('inaccount', isInAccount());
  console.log('intask', isInTask());

  // make sure all this stuff is saved in sessionStorage ???
  // to catch any weird errors, just check that these things
  if (isSignedIn() && isInAccount() && isInTask()) {
    // redirect to warble.js, which is where we will do tasks. For now only add an allowedValue to Shows
    window.location.href = 'warble.js';
  } else { // if you got here in the ifs, I don't know what went wrong, logic or my brain has broken
    alert('Yo something DRASTIC went wrong, check console for logs ');
  }
}


// sessionStorage.setItem('AccountsJSON', JSON.stringify(buildingAccountJSON));

// ... -------------------- ... //

//
/// --- after all functions, this is where we apply eventListeners
//

// // MAKE THE buttons do the boom thing
// var buttons = document.querySelectorAll('button');
// // run through every button in array, add an eventListener for click that calls boom
// for (var i = 0; i < buttons.length; i++) {
//   buttons[i].addEventListener('click', boom);
// }


console.log('PAYATTENTIONHERE');
exampleArray = ['hell', 'is', 'irony'];

startChooseTasks(exampleArray, 'BOFA');



/* ONLY FUNCTIONS FROM HERE ON OUT */



//function logs out all the cookies to console
function logCookies() {
  console.log("SignIn cookie: ", getCookie('SignIn'));
  console.log("WhichAccount cookie: ", getCookie('WhichAccount'));
  console.log("Task cookie: ", getCookie('Task'));
}

// function you can call that spits out all the SessionStorage stuff I'm dealing with
function logSession() {
  let act = accessAccount();
  let signIn = accessSignIn();
  let task = accessTask();

  console.log('SignIn Storage: ', signIn);
  console.log('Account Storage: ', act);
  console.log('Task Storage: ', task);
}



// ---------------------- memory functionality ----------------- //
// function that makes sure the current arrayAccounts (as given) is saved in sessionStorage
// along with the selected one, overwrites previous sessionStorage string if there is one
function saveArrayAccounts(arrAccounts, currentAccountPIDString) {

  /*Form -----    {selectedAccount : "pidOfSelectedAccount", listOfAccounts : [{accountObj1},{accountObj2}] }    */
  // this is the format of the JSON we will have in sessionStorage
  // sets the JSON we'll be using to
  let buildingAccountJSON = {
    currentAccount: currentAccountPIDString,
    availableAccounts: arrAccounts
  };
  // buildingAccountJSON = JSON.parse(buildingAccountJSON);
  console.log('Our Build AccountJSON', JSON.stringify(buildingAccountJSON));
  // sessionStorage storing Account
  enterAccount(JSON.stringify(buildingAccountJSON));
  console.log('Put AccountsJSON in sessionStorage');
}

function removeElement(elementId) {
  // Removes an element from the document
  var element = document.getElementById(elementId);
  element.parentNode.removeChild(element);
}

// function that clears the previous stuff (deletes the form with the id selectAccountForm out)
function clearStuff() {
  // TODO change the design so this makes more sense, just removes the node with the content id
  var stuff = document.getElementById('selectAccountForm');
  stuff.parentNode.removeChild(stuff);
  var content = document.getElementById('content');
  content.parentNode.removeChild(content);
}

// displays the next step (which task do you want to do with a token and an account?)
function displayWhichTask() {
  let accountsJSON = accessAccount();
  accountsJSON = JSON.parse(accountsJSON);
  if (accountsJSON == null) {
    console.log('reached null condition for sessionStorage');
  }

  console.log('accountsJSON', accountsJSON);
}

// ---------------------- END memory functionality ----------------- //

// Does three things:
// - 1) save in sessionStorage: accounts you have access to, your current account PID



// - 2) clear out html of the listAccounts form, if there's stuff in content, clear it out too
// - 3) Initiate displayWhichTask, or display button that initiates it onclick
// clears the html of random crap from before (the stuff in content), might even reload
function startChooseTasks(arrayAccounts, selectedAccountPID) {

  // does 1) (NO LONGER DOES THIS AT THIS POINT TODO)
  // saveArrayAccounts(arrayAccounts, selectedAccountPID);


  // does 2) TODO figure out how to defer until the other AJAX stuff is done (so we can update the page using the right stuff)
  if (document.getElementById('selectAccountForm') == null) {
    // there is no thing with id: 'selectAccountForm', so the getElementById returned null
    console.log('there is no selectAccountForm to Modify -- exiting function');
    return;
  } else {
    // there is at least one such thing with id 'selectAccountForm', so we'll deal with it
    console.log('ERORR ERROR THIS SHOULDN"T HAVE APPENED THIS IS A RANDOM ELSE CLAUSE I LEFT IN');
  }


  ///


  // setCookie(cname, cvalue, exdays);
  //
  //
  // d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  // var expires = "expires=" + d.toUTCString();
  // document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// example function, to be activated by pushing a button, returns false to not refresh
function doSomething() {
  console.log('Did Something');
  return false;
}
/// The other method for form submit



// given a token, list the accounts linked to this token, display appropriate messaging if token is invalid
function displayListAccounts(platToken) {
  // echo out informational stuff

  // header (informational, what step?, what task?)
  var header = document.createElement('h3');
  header.innerHTML = "Which Network do you want to update?";

  var linebreak = document.createElement('br');

  var para = document.createElement('p');
  para.innerHTML = "Here are your accounts that you have access to (the list of options changes depending on the creds you used to log in)";

  document.getElementById('content').appendChild(header);
  document.getElementById('content').appendChild(para);

  // asynchroniously get the JSON with the array of account representations
  // --- .... ---
  const xht = new XMLHttpRequest();
  // the url to list accounts associated with the TOKEN we have (passed in at beginning of fn)
  const urlListAccounts = 'https://web.mpx.theplatform.com/cws/web/Shell/lookupAccount' +
    '?schema=2.0&form=json&token=' + platToken + '&_pattern';
  // open up a get request to the url, have it return a response with a body
  xht.open("GET", urlListAccounts, true);
  // here we define the function to do when the thing is loaded
  xht.onload = (res) => {
    console.log("onload Triggered for ListAccounts Request");
    response = JSON.parse(xht.response);

    console.log("ListAccounts request", response);
    // logic for determining if lookupAccountResponse is present, ie whether the listAccounts request failed or not
    if (typeof response.lookupAccountResponse != "undefined") {
      // lookup success

      //Here is the array of items returned by this lookup
      arrayAccounts = response.lookupAccountResponse.result;
      console.log("arrayAccounts: ", arrayAccounts);


      // TODO TODO NEED to have javascript make a form and
      // TODO TODO populate it with the various account options we read out from the response

      // makin the form we'll use
      let f = document.createElement('form');
      f.setAttribute('id', 'selectAccountForm');
      f.setAttribute('action', '/reporting.html');
      let DUMMYDATA = 'OOFDOOFDUMMYDATA';
      // TODO take out dummydata, implement the retention of your choice of account, this has to be pushed til after selection
      // TODO could just specify a function like 'deal with accounts'
      // TODO look to login.js for guidance here
      // on submission, this form saves the Array of Accounts, Clears All the Stuff, Displays Next Task stuff
      f.setAttribute('onsubmit', 'saveArrayAccounts(' + arrayAccounts + ',"' + DUMMYDATA + '"); clearStuff(); displayWhichTask();');
      f.setAttribute('class', 'accountsForm');

      document.body.appendChild(f);

      // run through each item in the array (each account we have access to) and
      // display it as an option in a form
      arrayAccounts.forEach((element) => {
        console.log(element);
        let pid = element.pid;
        let id = element.id;
        let label = element.label;
        let shortID = element.id.substring(element.id.length - 10, element.id.length);

        let lab = document.createElement('label');
        lab.innerHTML = label;

        // have it print out a <label> with label variable inside of it </label>
        let inp = document.createElement('input');
        inp.setAttribute('type', 'radio');
        inp.setAttribute('name', 'whichAccount');
        inp.setAttribute('value', shortID);

        document.getElementById('selectAccountForm').appendChild(lab);
        document.getElementById('selectAccountForm').appendChild(inp);
        document.getElementById('selectAccountForm').appendChild(document.createElement('br'));

        console.log("pid: ", pid);
        console.log("label: ", label);
        console.log("id: ", id);
        console.log("lopped id: ", shortID);
      }); // out of for loop

      let sub = document.createElement('input');
      sub.setAttribute('type', 'submit');
      sub.setAttribute('value', 'GetAccountListing');
      sub.setAttribute('onsubmit', 'return startChooseTasks(arrayAccounts);');


      document.getElementById('selectAccountForm').appendChild(sub);


      // -------- SUBMIT BUTTON JUST FOR KICKS
      // let exampleF = document.createElement('form');
      // exampleF.setAttribute('onsubmit', 'return doSomething();');
      // exampleF.setAttribute('class', 'my-form');
      // exampleF.setAttribute('id', 'form');
      // exampleF.innerHTML = '<input type="submit" value="Submit">';
      //
      // document.body.appendChild(exampleF);
      // --------- END SUBMIT BUTTON JUST FOR KICKS

      // f.innerHTML =



      // let d = document.createElement('div');
      // d.className = 'listAccounts';
      // let f = document.createElement('form');
      // f.className = 'form';
      //
      // document.getElementById('content').appendChild(d);
      // document.getElementById('form');

      //<input type = "submit"  value = "Get Account Listing" > < /form>

      // THIS IS ALL some random experimenting with DOM stuff
      // document.getElementById('content')
      //
      // var instructions = document.createElement('p');
      // instructions.textContent = 'Things you can do: Choose one and submit to start doing the thing';
      //
      // var button = document.createElement('button');
      // button.textContent = 'Press This Button Pls (to select which account)';
      // button.action = 'javascript:boom();';
      // // TODO i dunno if this next line is good or not
      // button.innerHTML = '<input value="Submit and do task" type="submit">';
      //
      // document.getElementById('content').appendChild(button);
      //
      // var form = document.createElement('form');
      // form.textContent = 'text content of form';
      // form.action = 'javascript:boom();';
      // form.method = 'get';
      //
      // document.getElementById('content').appendChild(form);

      // TODO list of tasks to implement eventually ---
      // custField_GetAllShows, custField_AddNewShow
      // GetAllMedia, ChangeTitleOfMediaByID
      // TODO later (list of tasks to do later?)
      // GetThisMediaByID, GetFieldByID, custField_allowedValuesByID,
      // TODO probably
      // AddCuePoints or somesuch

      // eventually we need a foreach loop that runs through each task in a list and creates
      //      an item for them so you can select them

    } else {
      // lookup failure
      displayString('ERROR ERROR ERROR, LOOKUP LISTACCOUNTS FAILURE');
    } // end of else clause of lookUpAccountResponse logic

  } // end of onload fn

  xht.send(); // sends the fn to get listAccounts
} // end of displayListAccounts fn


// reveals all the hidden stuff, or hides it all
function toggleHidden() {
  // MAKE THE buttons do the boom thing
  let hiddens = document.querySelectorAll('#hidden');
  // run through every button in array, add an eventListener for click that calls boom
  for (var i = 0; i < hiddens.length; i++) {
    if (document.getElementById("hidden").style.display === 'none') {
      document.getElementById("hidden").style.display = 'block';
    } else {
      document.getElementById("hidden").style.display = 'none';
    }
  }
}




// displays the stuff that allows you to pick a task
function whichTask() {
  alert('stub whichtask');
}

// displays the stuff that allows you to pick an account
function whichAccount() {
  alert('stub whichaccount');
}




// appends to hidden, a link that clears your account sessionStorage
function displayClearAccount() {
  let link = document.createElement('a');
  link.className = 'clearAccount';
  link.setAttribute('href', 'javascript: exitAccount()');
  link.innerHTML = "clear account <br>";

  var parentNode = document.getElementById('hidden');
  parentNode.appendChild(link);
}

// appends to hidden, a link that clears your task sessionStorage
function displayClearTask() {
  let link = document.createElement('a');
  link.className = 'clearTask';
  link.setAttribute('href', 'javascript: exitTask()');
  link.innerHTML = "clear task <br>";

  let parent = document.getElementById('hidden');
  parent.appendChild(link);
}

// appends to hidden, a link that signs you out (clears your signin sessionStorage)
function displaySignOut() {
  let link = document.createElement('a');
  link.className = 'signOut';
  link.setAttribute('href', 'javascript: signOut()');
  link.innerHTML = "Sign Out <br>";

  let parent = document.getElementById('hidden');
  parent.appendChild(link);
}

// appends to end of file, the Button directing you to login again
function displayLinkToSignIn() {

  // creating the child (of hidden)
  let div = document.createElement('div');
  // give it a class
  div.className = 'LoginPlease';
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
