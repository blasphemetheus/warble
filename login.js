// takes loginForm out of html
function deleteLoginForm() {
  let toDelete = document.getElementById('loginForm');
  let parent = toDelete.parentNode;
  parent.removeChild(toDelete);
}

// takes sign out link out of html in header
function deleteSignOutLink() {
  let toDelete = document.getElementById('signOut');
  let parent = toDelete.parentNode;
  parent.removeChild(toDelete);
}

// displays sign out link in header (adds it to html)
function displaySignOutLink() {
  let signoutlink = document.createElement('a');
  signoutlink.setAttribute('href', 'javascript: signOut(); window.location.href = "login.html"');
  signoutlink.setAttribute('class', 'signOut');
  signoutlink.setAttribute('id', 'signOut');
  signoutlink.textContent = 'Sign Out';

  let header = document.getElementById('header');
  header.appendChild(signoutlink);
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
  displayStatusInHTML();
  displaySignOutLink();
  deleteLoginForm();
  enterTask('{"currentTask" : "cf_addShow"}');
  window.location.href = "welcome.html";
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

// postData('https://google.com/answer', {
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
  errorCase.textContent = response.description;
  document.getElementById("loginResponse").innerHTML = '<span style="color:red">Your login failed, try again </span>';
}

//sends a fetch request to get a new token, given the username and password
function requestToken(username, password, encodedString) {

  const url = 'https://identity.auth.theplatform.com/idm/web/Authentication/signIn?schema=1.0&form=json&_idleTimeout=120960000';

  // fetch sends a request to the url, you can specify what type and stuff in the 2nd param
  fetch(url, {
      headers: {
        "Authorization": "Basic " + encodedString,
      },
    })
    // then ... it does stuff, in this case, puts the response in json
    .then(response => response.json())
    // then ... pass in to recieveLoginResponse
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

    // clean up the html so the user knows they logged in
    // Success! HTML Changes -- on successful login
    clearFailures();
    deleteLoginForm();
    displaySignOutLink();

    // login succeeded
    console.log('SUCCESSFUL LOGIN - there is a signInResponse object');
    console.log('signInResponse Object is: ', data.signInResponse);

    // pull token out of json
    let token = data.signInResponse.token;

    // Make a cookie using our preloaded javascript file session.js which has the signIn function
    // json.stringify so we pass it a string
    signIn(JSON.stringify(data.signInResponse));
    displayStatusInHTML();
    enterTask('{"currentTask" : "cf_addShow"}');
    window.location.href = "welcome.html";
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

// check if they're signed in, if they are, the button won't be there to add an event listener to
if (!isSignedIn()) {
  // This makes the login button function (else it will do nothing)
  loginAttempt.addEventListener('click', checkLogin);
}
