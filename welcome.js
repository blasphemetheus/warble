// A Javascript File that funs through all the javascript functionality of the welcome page.
// Currently does not use JQUERY, does use AJAX. TODO probably needs better ordering system

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
  console.log('Our Build AccountJSON', JSON.stringify(buildingAccountJSON));
  sessionStorage.setItem('AccountsJSON', JSON.stringify(buildingAccountJSON));
  console.log('Put AccountsJSON in sessionStorage');
}

// ---------------------- END memory functionality ----------------- //

// Does three things:
// - 1) save in sessionStorage: accounts you have access to, your current account PID
// - 2) clear out html of the listAccounts form, if there's stuff in content, clear it out too
// - 3) Initiate displayListTasks, or display button that initiates it onclick
// clears the html of random crap from before (the stuff in content), might even reload
function startChooseTasks(arrayAccounts, selectedAccountPID) {

  // does 1)
  saveArrayAccounts(arrayAccounts, selectedAccountPID);


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

function doSomething() {
  alert('Form submitted');
  return false;
}
/// The other method for form submit

console.log("baseURI: ", document.baseURI);

// pull out string of JSON with name 'SignIn' from within all the cookies
// if there isn't any such thing, signInCookie gets set to ""
let signInCookie = getCookie('SignIn');
let whichAccountCookie = getCookie('WhichAccount');

console.log("SignIn cookie: ", signInCookie);
console.log("WhichAccount cookie: ", whichAccountCookie);

//logic for whether cookie is there or not
if (signInCookie == "") { // there should be no meaningful cookie here
  console.log('first branch - no signIn');
  // signInFo = "";

  // just do this to gen html  (adds a sign In button under 'hidden' div
  displayLinkToSignIn();


} else if (whichAccountCookie == "") { // there should be a signIn cookie BUT NO listAccounts cookie
  console.log('second branch - yes signin, no whichAccount');

  signInFo = JSON.parse(signInCookie);


  // since we have a cookie, lets list accounts
  displayListAccounts(signInFo.token);

} else { // there should be a signin cookie AND a listAccounts cookie
  console.log('third branch - yes signin, yes whichAccount');

  whichAccountFo = JSON.parse(whichAccountCookie);

  displayListTasks(whichAccountFo);
}


// ... -------------------- ... //


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
      f.setAttribute('onsubmit', 'alert("hello")');
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



      let exampleF = document.createElement('form');
      exampleF.setAttribute('onsubmit', 'return doSomething();');
      exampleF.setAttribute('class', 'my-form');
      exampleF.setAttribute('id', 'form');
      exampleF.innerHTML = '<input type="submit" value="Submit">';

      document.body.appendChild(exampleF);

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

// appends to end of file, the Button directing you to login again
function displayLinkToSignIn() {

  // creating the child (of hidden)
  let div = document.createElement('div');
  // give it a class
  div.className = 'LoginPlease';
  div.innerHTML = '<button class="redirect" type="button" onclick="redirectLogin()" height="100">click to ReLogin</button>';

  // putting in the child
  var parentNode = document.getElementById('hidden');
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
