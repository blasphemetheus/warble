// A Javascript File that funs through all the javascript functionality of the welcome page.
// Currently does not use JQUERY, does use AJAX. TODO probably needs better ordering system

// [Hell, Is, Irony]

// TODO every time you select a thing it reloads the page, so selectaccounts,
// TODO checkPickAccount when ready, then that saves the picks, and then reloads the page, no clearing necessary
// TODO ^^^^^^^^

// ---------------------- cookie stuff, stuff that runs when the js is loaded ----------------- //

logSession();
displaySignOut();
displayClearAccount();
displayClearTask();

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

} else if (!isInTask()) { // Yes - signIn, Yes - Account, No - Task
  console.log('WELCOME - Logic Branch - Yes SignIn, Yes Account, No Task');

  // display the prompt for choosing a task, it'll error out if we don't have what we need
  selectTasks();

} else { // Yes - signin, Yes - Account, Yes - Task
  console.log('WELCOME - Logic Branch - Yes SignIn, Yes Account, Yes Task');

  // just some reporting yo
  console.log('signin', isSignedIn());
  console.log('inaccount', isInAccount());
  console.log('intask', isInTask());

  //TODO portion here where we display all the info we have (json form and interpreted),
  //TODO and ask if that is what you want? Ready to move on to actually doing it?

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

  let displayJSON = document.createElement('p');
  displayJSON.textContent = worldState('json');

  let displayPlain = document.createElement('p');
  displayPlain.textContent = worldState('plain');

  let warble = document.createElement('button');
  warble.setAttribute('onclick', 'checkYouSure();');
  warble.innerHTML = 'Move On';

  document.body.appendChild(yousure);
  document.body.appendChild(linebreak);
  document.body.appendChild(explanation);
  document.body.appendChild(linebreak);
  document.body.appendChild(displayJSON);
  document.body.appendChild(linebreak);
  document.body.appendChild(displayPlain);

  document.body.appendChild(warble);
}
// ... -------------------- ... //
//

// reloads page
function reload() {
  window.location.href = 'welcome.html';
}

// given a currentAccount (string)
// the function that gets called when the user presses the button for choosing an account
// pulls out the arrAccounts and clears it from sessionstorage,
// then calls saveArrayAccounts with the info it has, then reloads
function checkPickAccount(currentAccount) {

  let arrAccounts = getJustArray(); // gotta get the array of stuff out of storage (a workaround to design)
  clearJustArray(); // after you retrieve the array bit, clear it from storage

  // saves all this stuff in sessionStorage
  saveArrayAccounts(arrAccounts, currentAccount);
}

// given the currentTask (string)
// the function that gets called when user presses the button for choosing a task
function checkPickTask(currentTask) {
  /*Form -----    {selectedAccount : "pidOfSelectedAccount", listOfAccounts : [{accountObj1},{accountObj2}] }    */
  // this is the format of the JSON we will have in sessionStorage
  // sets the JSON we'll be using to

  let buildingTaskJSON = {
    currentTask: currentTask,
  };
  console.log('Our Build TaskJSON', JSON.stringify(buildingTaskJSON));
  // sessionStorage storing Task
  enterTask(JSON.stringify(buildingTaskJSON));
  console.log('Put TaskJSON in sessionStorage');
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
    new Error('Yo something DRASTIC went wrong, there is no stuff stored, check console for logs ');
  }
}

// ... -------------------- ... //
// ... -------------------- ... //


/// end eventListeners
/* ONLY FUNCTIONS FROM HERE ON OUT */

// function you can call that spits out all the SessionStorage stuff I'm dealing with
function logSession() {
  let act = accessAccount();
  let signIn = accessSignIn();
  let task = accessTask();

  console.log('SignIn Storage: ', signIn);
  console.log('Account Storage: ', act);
  console.log('Task Storage: ', task);
}


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


// if we don't have the stored things we need it will error out (ie signin, account)
// populates and displays prompt (form) for selecting tasks,
// on submission of that form (multiple boxes checked, one, or none)
// it saves the task info in sessionStorage and reloads page
function selectTasks() {
  console.log('Selecting a Task Now');

  // lets parse the signIn Object we put in sessionStorage previously
  let signInFo = JSON.parse(accessSignIn());
  // rn we only need the token part of the stached object, so lets pull that out
  let platToken = signInFo.token;
  //throw error if no token
  if (platToken == null) {
    console.error('Token is null and shouldn\'t be, check that logging in is working properly');
  }

  // same old same old but for account stuff
  let accountInFo = JSON.parse(accessAccount());
  let currentAccount = accountInFo.currentAccount;
  if (currentAccount == null) {
    console.error('currentAccount is null and it should not be, check that entering account is working');
  }

  // header (informational, what step?)
  let header = document.createElement('h3');
  header.innerHTML = "What Task do you want to do?";

  let para = document.createElement('p');
  para.innerHTML = "The following are tasks you can do. Email bradley.fargo@amcnetworks.com if you would like more of these.";

  document.getElementById('content').appendChild(header);
  document.getElementById('content').appendChild(para);

  // START THE ACTUAL FUNCTION NOW

  // get the array of tasks
  // --- .... ---
  let allTasksArray = allTaskArray();
  console.log('all them tasks', allTasksArray);

  // make form we'll use
  let ferm = document.createElement('form');
  ferm.setAttribute('id', 'selectTask');
  // this line is crucial, could sub out the function but alert(this.submitted),
  //  then we set onclick to be 'this.form.submitted=this.value;' in each input
  ferm.setAttribute('onsubmit', 'checkPickTask(this.submited);');
  ferm.setAttribute('class', 'selectTask');
  // on click, this form'll activates checkPickTask, which does all that is necessary
  document.body.appendChild(ferm);


  // <form name="myform" onsubmit="alert(this.submited); return false;">
  //     <input onclick="this.form.submited=this.value;" type="submit" value="Yes" />
  //     <input onclick="this.form.submited=this.value;" type="submit" value="No" />
  // </form>

  allTasksArray.forEach((element) => {
    let name = element.name;

    let lab = document.createElement('label');
    lab.innerHTML = name;

    // have it print out a <label> with label variable inside of it </label>
    let inp = document.createElement('input');
    inp.setAttribute('type', 'submit');
    inp.setAttribute('name', name);
    inp.setAttribute('value', name);
    inp.setAttribute('onclick', 'this.form.submited=this.value');

    document.getElementById('selectTask').appendChild(lab);
    document.getElementById('selectTask').appendChild(inp);
    document.getElementById('selectTask').appendChild(document.createElement('br'));
  });

  // eventually we need a foreach loop that runs through each task in a list and creates
  //      an item for them so you can select them
  console.log('you\'ve reached the select task bit');
}
// ---------------------- END memory functionality ----------------- //
/// The other method for form submit



// allow the user to select an account, errors out if we don't have the signin necessary to do THIS
// list the accounts linked to this token, display appropriate
//messaging if token is invalid, specify behavior when Select button is pressed
function selectAccounts() {
  console.log('Selecting an Account Now');

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
  header.innerHTML = "Which Network do you want to update?";

  var para = document.createElement('p');
  para.innerHTML = "What follows are the accounts you can see, based on your credentials. Click on the button of the account you would like to use";

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
  xht.onload = () => {
    console.log("onload Triggered for ListAccounts Request");
    let response = xht.response;
    console.log("ListAccounts request", response);
    let listAccountsResponseObject = JSON.parse(response);
    // let response = res.lookupAccountResponse.result;
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

    // logic for determining if lookupAccountResponse is present, ie whether the listAccounts request failed or not
    if (listAccountsResponseObject.lookupAccountResponse == null) {
      // lookup failure
      displayString('ERROR ERROR ERROR, LOOKUP LISTACCOUNTS FAILURE, Please login again');
      console.error('No response exists, problem in your logic for onload?');
      new Error('this is an error');
      // i dunno if these errors take you out of this fn, so just in case i'm putting em in
      // TODO take out if not necessary
      return;
    }

    // !!!! lookup success (response not undefined) !!!!

    //Here is the array of items returned by this lookup
    arrayAccounts = listAccountsResponseObject.lookupAccountResponse.result;
    console.log("arrayAccounts: ", arrayAccounts);
    addJustArray(arrayAccounts);

    //
    // <form name="myform" onsubmit="alert(this.submited); return false;">
    //     <input onclick="this.form.submited=this.value;" type="submit" value="Yes" />
    //     <input onclick="this.form.submited=this.value;" type="submit" value="No" />
    // </form>

    // makin the form we'll use
    let f = document.createElement('form');
    f.setAttribute('id', 'selectAccountForm');

    // on submission, this form activates checkPickAccount, which does all that is necessary

    // this line is crucial, could sub out the function but aler(this.submitted),
    //  then we set onclick to be 'this.form.submitted=this.value;' in each input
    f.setAttribute('onsubmit', 'checkPickAccount(this.submited);');
    f.setAttribute('class', 'selectAccountForm');

    document.body.appendChild(f);

    arrayAccounts.forEach((element) => {
      let pid = element.pid;
      let id = element.id;
      let label = element.label;
      let shortID = element.id.substring(element.id.length - 10, element.id.length);


      let lab = document.createElement('label');
      lab.innerHTML = label + " : " + shortID + ' : ' + pid;

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
    });

    console.log('onload ending for ListAccounts request');
  } // end of onload

  xht.send(); // sends the fn to get listAccounts
} // end of selectAccounts() fn


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


// -------------------------------


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
