//NOTE: run the debugOptions() function to display a menu with link options
//debugOptions();

// displays a couple of links in the html (appends to end)
function debugOptions() {
  let d = document.createElement('div');
  d.innerHTML = '<hr><a href="index.html">index</a><hr><a href="welcome.html">GoRighttowelcomepage</a><hr><a href="greg.html">Greg\'s vision</a>   <hr>   <a href="warble.html">My demo</a>   <hr>   <a href="javascript:signOut();">Sign Out</a>   <hr>  <hr>';
  document.body.appendChild(d);
}

// clears the html of failure signals (ie red styling, 'your login failed' msgs, etc),
// if there aren't any then nothing changes
function clearFailures() {

  // do stuff because login failed earlier, but we're clearing it now
  lastAttempt.textContent = '';
  lastAttempt.style.backgroundColor = 'white';
  errorCase.textContent = '';
  document.getElementById("loginResponse").innerHTML = '<span style="color:green">Your login succeeded</span>';

}


// if you're already signed in you can't sign in again until you log out silly
if (isSignedIn()) {
  displayLoginStatus();
  selectTask();
} else {
  // if you aren't signed in, clears all the rest of the sessionStorage stuff
  sessionStorage.clear();
}

var lastAttempt = document.querySelector('.lastAttempt');
var errorCase = document.querySelector('.errorCase');

var loginAttempt = document.querySelector('.loginAttempt');
var usernameField = document.querySelector('.usernameField');
var passwordField = document.querySelector('.passwordField');

var attemptCount = 1;
var refresh;

// this function is an example GET implementation of fetch
function getData(url = '', data = {}) {
  // Default options are marked with *
  return fetch(url, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "same-origin", // no-cors, cors, *same-origin
      cache: "default", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "omit", // include, same-origin, *omit
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      redirect: "follow", // manual, *follow, error
      referrer: "client", // no-referrer, *client
      body: JSON.stringify(data), // body data type must match "Content-Type" header


    })
    .then(response => response.json()); // parse response to JSON
}

// postData('http://google.com/answer', {
//     answer: 42
//   })
//   .then(data => console.log(JSON.stringify(data))) // JSON-string from 'response.json()' call
//   .catch(error => console.error(error));

// this function is an example POST implementation of fetch
function postData(url = '', data = {}) {
  // Default options are marked with *
  return fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, same-origin, *omit
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => response.json()); // parse response to JSON
}

// the function that happens after you successfully fetch a response but
// didn't successfully get the data you need to log in
function updateHTMLFailure(response) {
  // login failed
  console.log('there is NO signInResponse object');
  console.log('FAILED LOGIN');

  // elements of the response (error details)
  console.log('responseCode is: ' + response.responseCode);
  console.log('title is: ' + response.title);
  console.log('isException is: ' + response.isException);
  console.log('correlationId is: ' + response.correlationId);
  console.log('description is: ' + response.description);

  // do stuff because login failed
  lastAttempt.textContent = 'Wrong!';
  lastAttempt.style.backgroundColor = 'red';
  errorCase.textContent = 'no info on error, the request no work';
  document.getElementById("loginResponse").innerHTML = '<span style="color:red">Your login failed, try again </span>';
}

//sends an http request to get a new token, given the username and password. Returns false if unsuccessful for any reason.
// if successful, returns the token
function requestToken(username, password, encodedString) {
  var responseText = document.getElementById('responseID');
  // TODO better checking/reporting on whether the username or password are not empty
  if (username === '' || password === '') {
    responseText.innerHTML = 'you didn\'t enter in anything for your username and password, try again';
  }

  const url = 'https://identity.auth.theplatform.com/idm/web/Authentication/signIn?schema=1.0&form=json&_idleTimeout=120960000';

  // fetch is better than XMLHttpRequest by miles
  fetch(url, {
      headers: {
        "Authorization": "Basic " + encodedString,
      },
    })
    .then(response => response.json())
    .then(data => receiveLoginResponse(data))
    .catch(error => console.error(error));

  // must stringify the response or it'll look like [object Object] in html
  // document.getElementById('loginResponse').innerHTML = JSON.stringify(response);
} // end of requestToken fn


// the function that occurs when we get the response from our login attempt (data)
function receiveLoginResponse(data) {
  console.log('Here is the response data: ', JSON.stringify(data));

  /* EXAMPLES OF FAILURE AND SUCCESS JSON STRUCTURES

    // SUCCESS

    {
      "signInResponse":
      {
        "duration":315360000000,
        "token":"NJxrjMYGFHne3_VSj5pksUCuoLDswCDG",
        "userId":"https://identity.auth.theplatform.com/idm/data/User/mpx/2765720",
        "idleTimeout":120960000,
        "userName":"iamdanielmeyer@gmail.com"
      }
    }

    // FAIL

    {
      "responseCode": 401,
      "title": "com.theplatform.authentication.api.exception.AuthenticationException",
      "isException": true,
      "correlationId": "63660a30-1bde-4307-a828-4d9626d62b75",
      "description": "Either 'iamdanielmeyer@gmail.com' does not have an account with this site, or the password was incorrect."
    }
  */

  // if this test passes then there is a signIn response (ie we got a token)
  if (typeof data.signInResponse != "undefined") {

    clearFailures();
    // login succeeded
    console.log('SUCCESSFUL LOGIN - there is a signInResponse object');
    console.log('signInResponse Object is: ', data.signInResponse);

    // pull token out of json
    let token = data.signInResponse.token;

    // Make a cookie using our preloaded javascript file session.js which has the signIn function
    // json.stringify so we pass it a string
    signIn(JSON.stringify(data.signInResponse));


    selectTask();
    displayLoginStatus();
  } else {
    updateHTMLFailure(data);
  }
}

function checkLogin() {

  // retrieve username and password fields, put em in local variables
  var username = usernameField.value;
  console.log('The username value is ' + username);

  var password = passwordField.value;
  console.log('The password value is ' + password);

  // TODO attempt happens

  // encode these fields into "mpx/username:password"
  var ingredients = 'mpx/' + username + ':' + password;
  var encodedString = btoa(ingredients);
  console.log('the encode is ' + encodedString);

  var decodedString = atob(encodedString);
  console.log('the encode decoded is ' + decodedString);

  // make a newRequest
  // set the header to "Authorization : Basic theEncode"
  // make the get request to the url specified, with no body, and the header as shown
  // interpret the request response,
  //    set the errorCase.textContent to whatever the error type is
  //    if the attempt succeeded, set the attemptResult to true


  // call requestToken, which returns the token if successful or false if not ?? TODO
  requestToken(username, password, encodedString);

  // reset values of username/password
  usernameField.value = '';
  passwordField.value = '';
  // focus on the username
  usernameField.focus();
}

loginAttempt.addEventListener('click', checkLogin);

// javascript yo
function createParagraph() {
  var paragra = document.createElement('p');
  paragra.textContent = 'boom';
  document.body.appendChild(paragra);
}



// -------- //

// displays a button with add show (with label - adds an allowedValue to a 'Shows' (or similar-named) custom field)
function selectTask() {
  // lets parse the signIn Object we have in sessionStorage
  let signInObj = JSON.parse(accessSignIn());
  // rn we only need the token part of the stached object, so lets pull that out
  let platToken = signInObj.token;
  //throw error if no token
  if (platToken == null) {
    console.error('Token is null and shouldn\'t be, check that logging in is working properly');
  }

  // header (informational, what step?)
  let header = document.createElement('h3');
  header.innerHTML = "Let's add a show";

  let para = document.createElement('p');
  para.innerHTML = "ie. select an account to modify and add an allowedValue to the 'Shows' custom-field";

  let btn = document.createElement('button');
  btn.innerHTML = 'Start Adding Shows';
  btn.setAttribute('onclick', 'javascript: enterTask(\'{"currentTask" : "cf_addShow"}\'); window.location.href = "welcome.html"')


  let wrap = document.createElement('div');
  wrap.setAttribute('id', 'initiate'); // ID IS INITIATE (lowercase)

  wrap.appendChild(header);
  wrap.appendChild(para);
  wrap.appendChild(btn)

  // if there's already an iniiate (ie continue to add show prompt), replace it
  let existing = document.getElementById('initiate');
  if (existing !== null) {
    existing.remove();
  }

  document.body.appendChild(wrap);
}