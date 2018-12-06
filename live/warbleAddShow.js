// TODO: obfuscate cookies

// const APPEND_TO_MAKE_FULL_ID = "https://data.media.theplatform.com/media/data/Media/Field/";

// returns the url to add a show given a token
function urlToAddShow(token) {
  return "http://data.media.theplatform.com/media/data/Media/Field" + "?token=" + token + "&fields=plfield%24allowedValues%2Ctitle%2Cid%2Cguid" +
    "&schema=1.8.0";
  // OTHER URL FORMAT:
  // const addShowURL = "http://data.media.theplatform.com/media/data/Media/Field/" + customFieldNumber +
  //   "?schema=1.10.0&searchSchema=1.0.0&form=cjson&pretty=true" +
  //   "&token=" + token;
}

// returns the url to get the existing shows given a token and a customfield_identifier
function urlToGetShows(token, cf_identifier) {
  const getAllowedValuesForShowsURL = "https://data.media.theplatform.com/media/data/Media/Field/" + cf_identifier +
    "?schema=1.10.0&searchSchema=1.0.0&form=cjson&pretty=true&fields=allowedValues&token=" + token;
  return getAllowedValuesForShowsURL;
}

// returns an object that will be the body of a post request to allowedValues of a specific 'Show' custom field
// given an accountID (which account are you making the change  to) and arrayShows (the array of values to make the allowedValues)
function bodyOfAddShow(accountID, arrayShows, cf_id) {
  console.log('Custom Field Identifier: ', cf_id);

  let returnThisObject = {
    "$xmlns": {
      "plfield": "http://xml.theplatform.com/data/object/Field"
    },
    "id": "http://data.media.theplatform.com/media/data/Media/Field/" + cf_id,
    "plfield$allowedValues": arrayShows
  }
  return returnThisObject;
}


// checkInput (either for removing or adding a show). given  Returns the
function validateInput(showSpecified, operation) {
  if (operation != 'add' && operation != 'remove') {
    throw new Error('You are trying to validate Input (' + showSpecified + ')with an invalid operation (' + operation + ')');
  }

  if (typeof showSpecified == "undefined") {
    throw new Error('Ooops didn\'t pass in a show to ' + operation + ': ' + showSpecified);
  }
  if (typeof showSpecified != "string") {
    throw new Error('Hey, the type of the thing you\'re passing into' + operation + 'Show is not a string: ' + showSpecified);
  }
  if (showSpecified == "") {
    throw new Error('Hey, the show you are trying to ' + operation + ' is an empty string, do not do that: ' + showSpecified);
  }
}

// this function actually removes a show (making ajax calls, error check, initiate html changes, etc)
function doRemoveShow(showToRemove) {
  console.log('actually removing show', showToRemove);

  // assemble data, put into object. rn: (token, account, task) are the fields
  let object = pullOutStuffForAddShow();
  console.log('Our Info', object);
  let tok = object.token;
  let acc = object.accountID;

  // retrieve the account number
  const cf_identifier = getCustomFieldForAccount(acc);
  // check for null and undefined
  // these error cases should be covered by checking in init_AddShow, so this is
  // just in case these functions are called in the incorrect order or a random
  // mutation occurs that I didn't account for
  if (cf_identifier === undefined) {
    throw new Error('Trying to fetch custom field for an account that Warble does not know about, account is: ', acc);
  }
  if (cf_identifier === null) {
    throw new Error('Trying to get Custom Field for the account specified (' + acc + ') and it does not have a customField for Shows');
  }

  //------- check the show passed in
  validateInput(showToRemove, 'remove');

  //------- get existing shows
  let getExistingURL = urlToGetShows(tok, cf_identifier);
  console.log('get-existing-shows URL', getExistingURL);
  let removeShowURL = urlToAddShow(tok);
  console.log('remove-show URL', removeShowURL);

  // add the response to the initial existingShows request to html
  //
  // this next bit pulls out the existing shows and adds the one we want to add to an array representation of it, then sorts it
  let arrayShows = accessExistingShowsOnce(); // pull out allowedValues
  console.log(arrayShows);
  // find showToRemove in the array
  //    if its there
  //        then remove it, sort array
  //    else
  //        return false (the show to remove wasn't there)
  //          (or throw new error if ya want)

  // Find the index position of showToRemove, then remove one element from that position
  let index = arrayShows.indexOf(showToRemove);
  if (index == -1) {
    return false;
    throw new Error('could not remove show because show was not there');
  } else {
    arrayShows.splice(index, 1);
    arrayShows.sort(); // alphabetize the array of shows
  }
  // arrayShows.splice(arrayShows.indexOf(showToRemove), 1);

  // now we generate the body of the removeShow POST request
  let removeShowBody = bodyOfAddShow(acc, arrayShows, cf_identifier);
  console.log('remove-show BODY', removeShowBody);

  fireOffModifyAllowedValuesForShownamesRequest(removeShowURL, removeShowBody);
}

// this does the actual fetch
function fireOffModifyAllowedValuesForShownamesRequest(url, body) {
  // does the fetch for POSTing the new body
  fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      }
    }).then(res => res.json())
    .then(data => {
      console.log('Retrieved Response: ', JSON.stringify(data))
      // refresh page after post request (which will display the new existing shows)
      window.location.href = 'warble.html';
    })
    .catch(error => console.error(error)); // catch errors for the fetch
}


// this function actually adds the show (making ajax calls, responds to them etc)
function doAddShow(showToAdd) {
  // showToAdd is passed in, should be a string
  console.log('actually adding show', showToAdd);

  // assemble data, put into object. rn: (token, account, task) are the fields
  let object = pullOutStuffForAddShow();
  console.log('Our Info', object);
  let tok = object.token;
  let acc = object.accountID;

  // retrieve the account number
  let cf_identifier = getCustomFieldForAccount(acc);
  // check for null and undefined
  // these error cases should be covered by checking in init_AddShow, so this is
  // just in case these functions are called in the incorrect order or a random
  // mutation occurs that I didn't account for
  if (cf_identifier === undefined) {
    throw new Error('Trying to fetch custom field for an account that Warble does not know about, account is: ', acc);
  }
  if (cf_identifier === null) {
    throw new Error('Trying to get Custom Field for the account specified (' + acc + ') and it does not have a customField for Shows');
  }

  //------- check the stuff we grabbed
  validateInput(showToAdd, 'add');

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
  let addShowBody = bodyOfAddShow(acc, arrayShows, cf_identifier);
  console.log('add-show BODY', addShowBody);

  //======= asynchronously fetch to POST add show
  fireOffModifyAllowedValuesForShownamesRequest(addShowURL, addShowBody);
}

// displays a prompt with the show you selected as the default value, and calls doAddShow with the value of the prompt when submitted
// this function is a called when you are adding a show and the user presses 'Add'
function submitAddShow() {
  let showToAdd = document.getElementById('addShowInput').value;
  let promptResponse = prompt("Adding Show ~Be positive before pressing OK~", showToAdd);
  if (promptResponse != null) {
    doAddShow(promptResponse);
  }
}

// displays a prompt and calls doRemoveShow with the value of the prompt when submitted
// this function is a called when you press a button that says 'I want to remove a show'
function submitRemoveShow() {
  let showToRemove = '';
  let promptResponse = prompt("Removing Show ~Be positive before pressing OK~", showToRemove);
  if (promptResponse != null) {
    doRemoveShow(promptResponse);
  }
}
