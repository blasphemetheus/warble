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
function add(showToAdd) {
  console.log('actually adding show', showToAdd);

  // assemble data, put into object. rn: (token, account, task) are the fields
  let object = pullOutStuffForAddShow();
  console.log('Our Info', object);
  let token = object.token;
  let account = object.accountID;

  //------- define / grab stuff

  // showToAdd is passed in, should be a string
  //
  let acc = "2676155873";
  let tok = "67891";
  let arrSh = ['1', '2', '3', '4'];
  // assemble data, put into object. rn: (token, account, task) are the fields
  // let world = pullOutStuffForAddShow();
  // console.log('Our Info', world);
  // let token = object.token;
  // let account = object.accountID;

  // retrieve the account number
  let cf_identifier = getCFShows(acc);

  //------- check the stuff we grabbed

  if (typeof showToAdd == "undefined") {
    console.error('Ooops didn\'t pass in a showToAdd');
  }
  // (make sure showToAdd is a string, throw error if it isn't)
  if (typeof showToAdd != "string") {
    throw new Error('Hey, the type of the thing you\'re passing into addShow is not a string');
  }
  if (showToAdd == "") {
    throw new Error('Hey, the show you are trying to add is an empty string, do not do that');
  }

  //------- get existing shows

  let getExistingURL = urlToGetShows(tok, cf_identifier);
  console.log('get-existing-shows URL', getExistingURL);
  let addShowURL = urlToAddShow(tok);
  console.log('add-show URL', addShowURL);

  // add the response to the initial existingShows request to html

  // this next bit pulls out the existing shows and adds the one we want to add to an array representation of it, then sorts it
  let arrayShows = accessExistingShowsOnce(); // pull out allowedValues
  arrayShows.push(showToAdd); // put new show in there
  arrayShows.sort(); // alphabetize the array of shows
  // now we generate the body of the addShow POST request
  let addShowBody = bodyOfAddShow(acc, arrayShows);
  console.log('add-show BODY', addShowBody);

  //======= asynchroniously fetch to POST add show
  // TODO
  // does the fetch for adding a show, given the body (the message), and the URL
  fetch(addShowURL, {
      method: "POST",
      body: JSON.stringify(addShowBody),
      headers: {
        "Content-Type": "application/json",
      }
    }).then(res => res.json())
    .then(data => {
      console.log('Success: ', JSON.stringify(data))
      // refresh page after post request (which will display the new existing shows)
      window.location.href = 'warble.html';
    })
    .catch(error => console.error(error)); // catch errors for the addShow fetch
}

// // get allowedvalues for shows, build the body of the json you're gonna post later and return it as an object
// fetch(getAllowedValuesForShowsURL)
//   .then(response => response.json())
//   .then(data => {
//     let arrayShows = data.allowedValues;
//     arrayShows.push(showToAdd);
//     arrayShows.sort();
//     console.log('AAA', arrayShows);
//     console.log(showToAdd);
//     let passingInBody = {
//       "$xmlns": {
//         "plfield": "http://xml.theplatform.com/data/object/Field"
//       },
//       "plfield$dataStructure": "Single",
//       "plfield$defaultValue": "",
//       "title": "Show",
//       "plfield$allowedValues": arrayShows,
//       "plfield$notifyAlways": false,
//       "plfield$length": 0,
//       "id": "http://data.media.theplatform.com/media/data/Media/Field/214169463",
//       "guid": "YAD6ewA2DgDfegBA3wwYJcMSGvejuHfI",
//       "ownerId": "http://access.auth.theplatform.com/data/Account/2686406403",
//       "plfield$dataType": "String"
//     };
//     // calls the function doFetchForAddShows, which does the fetch for adding a show, given the body (the message), and the URL
//     doFetchForAddShows(passingInBody, addShowURL);
//   })
//   .catch(error => console.error(error));

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
