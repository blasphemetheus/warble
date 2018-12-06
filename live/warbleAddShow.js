// TODO: remove show
// TODO: If stuff changes in the future then these values will change,
//     should put in a json file or something? or at least obfuscate code



// const APPEND_TO_MAKE_FULL_ID = "https://data.media.theplatform.com/media/data/Media/Field/";
//
// const DEV_MAIN_ACCOUNT = "2686406403";
// const DEV_MAIN_ACCOUNT_CF_SHOWS = "214169463";
//
// const STAGE_AMC = '2649273223';
// const STAGE_AMC_CF_SHOWS = '155289480';
//
// const STAGE_WETV = '2676155873';
// const STAGE_WETV_CF_SHOWNAME = '183961471';
//
// const STAGE_IFC = '2665992905';
// const STAGE_IFC_CF_SHOWNAME = '179353621';
//
// const STAGE_BBCA = '2665992175';
// const STAGE_BBCA_CF_SHOWNAME = '182425513';
//
// const STAGE_SUNDANCE_TV = '2685731763';
// const STAGE_SUNDANCE_TV_CF_SHOWNAME = '299161469';
//
// const STAGE_GENERAL = '2494403701'; // HAS NO such field
// const STAGE_ADS_REPO = '2666065425'; // HAS NO such field
// const STAGE_REF_2POINT0 = '2702809055'; // HAS NO such field
//
// const STAGE_ASSET_REPO = '2703280093';
// const STAGE_ASSET_REPO_CF_SHOWS = '359577460';
//
// const PROD_AMC = "2649321885";
// const PROD_AMC_CF_SHOWS = "156313528";
//
// const PROD_WETV = '2676155197';
// const PROD_WETV_CF_SHOWS = '185497559';
//
// const PROD_BBCA = '2675820809';
// const PROD_BBCA_CF_SHOWS = '183961462';
//
// const PROD_IFC = '2673068635';
// const PROD_IFC_CF_SHOWS = '180889499';
//
// const PROD_SUNDANCE_TV = '2685731137';
// const PROD_SUNDANCE_TV_CF_SHOWS = '233113468';

// alternate ways of storing this

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


// this function actually adds the show (making ajax calls, responds to them etc)
function doAddShow(showToAdd) {
  console.log('actually adding show', showToAdd);

  // assemble data, put into object. rn: (token, account, task) are the fields
  let object = pullOutStuffForAddShow();
  console.log('Our Info', object);
  let tok = object.token;
  let acc = object.accountID;

  //------- define / grab stuff

  // showToAdd is passed in, should be a string

  // assemble data, put into object. rn: (token, account, task) are the fields
  // let world = pullOutStuffForAddShow();
  // console.log('Our Info', world);
  // let token = object.token;
  // let account = object.accountID;

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
  let addShowBody = bodyOfAddShow(acc, arrayShows, cf_identifier);
  console.log('add-show BODY', addShowBody);

  //======= asynchronously fetch to POST add show
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
      console.log('Retrieved Response: ', JSON.stringify(data))
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
//         "plfield": "https://xml.theplatform.com/data/object/Field"
//       },
//       "plfield$dataStructure": "Single",
//       "plfield$defaultValue": "",
//       "title": "Show",
//       "plfield$allowedValues": arrayShows,
//       "plfield$notifyAlways": false,
//       "plfield$length": 0,
//       "id": "https://data.media.theplatform.com/media/data/Media/Field/214169463",
//       "guid": "YAD6ewA2DgDfegBA3wwYJcMSGvejuHfI",
//       "ownerId": "https://access.auth.theplatform.com/data/Account/2686406403",
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

// displays a prompt with the show you selected as the default value, and calls doAddShow with the value of the prompt when submitted
// this function is a called when you are adding a show and the user presses 'Add'
function submitAddShow() {
  let showToAdd = document.getElementById('addShowInput').value;
  let promptResponse = prompt("~Be positive before pressing OK~", showToAdd);
  if (promptResponse != null) {
    doAddShow(showToAdd);
  }
}
