// this function makes request to get existing shows, then adds them in the form of a (string) to the html in the alert id
function addExistingShowsToHTML() {
  // PUT ALL OUR INFO ON THE TABLE
  let obj = pullOutStuffForAddShow();
  console.log('Obj', obj);
  let token = obj.token;
  let account = obj.accountID;
  let task = obj.task;

  // retrieve the account number
  let customFieldNumber = getCFShows(account);

  const getAllowedValuesForShowsURL = "http://data.media.theplatform.com/media/data/Media/Field/" + customFieldNumber +
    "?schema=1.10.0&searchSchema=1.0.0&form=cjson&pretty=true&fields=allowedValues&token=" + token;

  // does the request, starts the things that happen after
  fetch(getAllowedValuesForShowsURL)
    .then(response => response.json())
    .then(data => {
      console.log(JSON.stringify(data));
      let arrayShows = data.allowedValues;
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

function doFetchForAddShows(body, urlToAddShows) {
  console.log('DID IT WORK', body);
  //TODO: Set passingInBody = {thejsonwespecify}

  // // put response in html (body)
  // let response = document.createElement('div');
  // response.setAttribute('id', 'response');
  // response.style = 'color=green;';
  // document.body.appendChild(response);
  //
  // // pull out the thing we just put in html and set responseText as it
  // var responseText = document.getElementById('response');
  //
  // if (showToAdd == '') {
  //   responseText.innerHTML = 'you didn\'t enter in anything for your Show To Add, try again pls, enter stuff this time';
  // }

  fetch(urlToAddShows, {
      method: "POST",
      // mode: "no-cors",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        // "Accept": "application/json"
        // "Cache-Control": "no-cache",
      }
    }).then(res => res.json())
    .then(data => {
      console.log('Success: ', JSON.stringify(data))
      // refresh page
      window.location.href = 'warble.html';
    })
    .catch(error => console.error(error));
}


// this function actually adds the show (making ajax calls, responds to them etc)
function doAddShow(showToAdd) {
  console.log('actually adding show', showToAdd);

  // (make sure showToAdd is a string, throw error if it isn't)
  if (typeof showToAdd != "string") {
    throw new Error('Hey, the type of the thing you\'re passing into addShow is not a string');
  }
  if (showToAdd == "") {
    throw new Error('Hey, the show you are trying to add is an empty string, do not do that');
  }

  // assemble data, put into object. rn: (token, account, task) are the fields
  let object = pullOutStuffForAddShow();
  console.log('Our Info', object);
  let token = object.token;
  let account = object.accountID;

  if (typeof showToAdd == "undefined") {
    console.error('Ooops didn\'t pass in a showToAdd');
  }

  // retrieve the account number
  let customFieldNumber = getCFShows(account);

  const addShowURL = "http://data.media.theplatform.com/media/data/Media/Field/" + customFieldNumber +
    "?schema=1.10.0&searchSchema=1.0.0&form=cjson&pretty=true" +
    "&token=" + token;

  const getAllowedValuesForShowsURL = "http://data.media.theplatform.com/media/data/Media/Field/" + customFieldNumber +
    "?schema=1.10.0&searchSchema=1.0.0&form=cjson&pretty=true&fields=allowedValues&token=" + token;

  // get allowedvalues for shows, build the body of the json you're gonna post later and return it as an object
  fetch(getAllowedValuesForShowsURL)
    .then(response => response.json())
    .then(data => {
      let arrayShows = data.allowedValues;
      arrayShows.push(showToAdd);
      arrayShows.sort();
      console.log('AAA', arrayShows);
      console.log(showToAdd);
      let passingInBody = {
        "$xmlns": {
          "plfield": "http://xml.theplatform.com/data/object/Field"
        },
        "plfield$dataStructure": "Single",
        "plfield$defaultValue": "",
        "title": "Show",
        "plfield$allowedValues": arrayShows,
        "plfield$notifyAlways": false,
        "plfield$length": 0,
        "id": "http://data.media.theplatform.com/media/data/Media/Field/214169463",
        "guid": "YAD6ewA2DgDfegBA3wwYJcMSGvejuHfI",
        "ownerId": "http://access.auth.theplatform.com/data/Account/2686406403",
        "plfield$dataType": "String"
      };
      // calls the function doFetchForAddShows, which does the fetch for adding a show, given the body (the message), and the URL
      doFetchForAddShows(passingInBody, addShowURL);
    })
    .catch(error => console.error(error));

  // .then(data => {
  //
  //   // data is a thing that holds the json representation of our response
  //   let response = data;
  //   console.log('the login response was: ', response);
  //
  //   /* EXAMPLES OF FAILURE AND SUCCESS JSON STRUCTURES
  //
  //     // SUCCESS
  //
  //     {
  //       "signInResponse":
  //       {
  //         "duration":315360000000,
  //         "token":"NJxrjMYGFHne3_VSj5pksUCuoLDswCDG",
  //         "userId":"https://identity.auth.theplatform.com/idm/data/User/mpx/2765720",
  //         "idleTimeout":120960000,
  //         "userName":"iamdanielmeyer@gmail.com"
  //       }
  //     }
  //
  //     // FAIL
  //
  //     {
  //       "responseCode": 401,
  //       "title": "com.theplatform.authentication.api.exception.AuthenticationException",
  //       "isException": true,
  //       "correlationId": "63660a30-1bde-4307-a828-4d9626d62b75",
  //       "description": "Either 'iamdanielmeyer@gmail.com' does not have an account with this site, or the password was incorrect."
  //     }
  //   */
  //
  //   // if this test passes then there is a signIn response (ie we got a token)
  //   if (typeof response.signInResponse != "undefined") {
  //     // login succeeded
  //     console.log('there is a signInResponse object');
  //     console.log('SUCCESSFUL LOGIN');
  //
  //     // log the signInResponseObject
  //     console.log('signInResponse Object is: ', response.signInResponse);
  //
  //     // elements of the signInResponse object in the response
  //     console.log('token is: ' + response.signInResponse.token);
  //     console.log('duration is: ' + response.signInResponse.duration);
  //     console.log('idleTimeout is: ' + response.signInResponse.idleTimeout);
  //     console.log('userName is: ' + response.signInResponse.userName);
  //     console.log('userId is: ' + response.signInResponse.userId);
  //
  //     // do stuff because login succeeded
  //     lastAttempt.textContent = 'Success!';
  //     lastAttempt.style.backgroundColor = 'cyan';
  //     errorCase.textContent = 'No Error - token retrieved';
  //     document.getElementById("loginResponse").innerHTML = '<h1 style="color:green">Successful Login</h1>';
  //
  //     // pull token out of json
  //     token = response.signInResponse.token;
  //
  //     // change html
  //     lastAttempt.textContent = 'You logged in successfully - got token: ' + token;
  //     lastAttempt.style.backgroundColor = 'green';
  //     errorCase.textContent = 'Success - redirecting now ...';
  //
  //     // half the time it changes background color to pink, half to green
  //     let random = Math.floor(Math.random() * 2);
  //     if (random == 0) {
  //       // CHANGES BACKGROUND TO PINK
  //       let styl = document.createElement('style');
  //       styl.innerHTML = 'body { background-color: #d24dff;}';
  //
  //       document.head.appendChild(styl);
  //     } else if (random == 1) {
  //       document.body.style.backgroundColor = 'green';
  //     } else {
  //       console.log('oops I guess I don\'t understand the random fn');
  //     }
  //     // end of random section
  //
  //     // TODO make this countdown more advanced, have a countdown and write a function that adds one to the countdown displayed
  //     //wait 3 seconds with countdown
  //     //alert('redirecting...');
  //
  //     // put the data we want to save into a cookie (the whole JSON for now
  //     // TODO make more secure, encode, obfuscate, don't include sensitive information)
  //
  //     // Make a cookie using our preloaded javascript file session.js which has the signIn function
  //     // json.stringify so we pass it a string
  //     signIn(JSON.stringify(response.signInResponse));
  //
  //     // wait a third of a second then display Redirecting ...
  //     let timerId = setTimeout(() => document.getElementById("redirecting").innerHTML = '<h1>redirect ...</h1>', 333);
  //
  //     //navigate to the welcome page of wobble
  //     // TODO So this doesn't move the window,window.location.href = "welcome.html" will do the trick
  //     // TODO But if we want to POST, or at the Very Least transfer information somewhat securely between pages of
  //     // TODO a website (i want to do this), I need to figure out how to do that via Javascript
  //
  //     // let timerId2 = setTimeout(() => window.location.href = 'welcome.html', 2000);
  //     let timerId2 = setTimeout(() => window.location.href = 'welcome.html', 2000);
  //
  //   } else {
  //     // login failed
  //     console.log('there is NO signInResponse object');
  //     console.log('FAILED LOGIN');
  //
  //     // elements of the response (error details)
  //     console.log('responseCode is: ' + response.responseCode);
  //     console.log('title is: ' + response.title);
  //     console.log('isException is: ' + response.isException);
  //     console.log('correlationId is: ' + response.correlationId);
  //     console.log('description is: ' + response.description);
  //
  //     // if we wanna do anything for repeated attempts
  //     if (numAttempts > 3) {
  //       console.log('num attempts GREATER THAN 3 OMG');
  //     }
  //
  //     // do stuff because login failed
  //     lastAttempt.textContent = 'Wrong!';
  //     lastAttempt.style.backgroundColor = 'red';
  //     errorCase.textContent = 'no info on error, the request no work';
  //     document.getElementById("loginResponse").innerHTML = '<span style="color:red">Your login failed, try again </span>';
  //   }
  // })
  // .catch(error => console.error(error));




  //
}



// A function that adds one show (exactly as input) to the allowedValues array within the customField Show
function displayAddShow() {
  // append form to body that allows you to click it,
  // a 'you sure' function activates which displays info including your input and which account
  // if you press ok there, it does the thing (an onload, ajax fn), and displays the results when they come back

  // This is an async function that does all the stuff asynchroniously, will populate some stuff in html
  addExistingShowsToHTML();

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

// the function that gets called when you press the add button when adding a new show
function submitAddShow() {
  let showToAdd = document.getElementById('addShowInput').value;
  document.getElementById('alert').textContent = 'The input is: "' + showToAdd + '"';

  let confirmButton = document.createElement('button');
  confirmButton.setAttribute('onclick', 'doAddShow("' + showToAdd + '")');
  confirmButton.setAttribute('id', 'confirmButton');
  confirmButton.innerHTML = 'Confirm'

  // if there is a confirmButton then remove it (after if we add a confirm button)
  if (document.getElementById('confirmButton') != null) {
    console.log('reached not null');
    removeByID('confirmButton');
  }
  document.getElementById('addShowForm').appendChild(confirmButton);
}
