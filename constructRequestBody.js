// The Add show arangement for the one account I got it to work with (Dev)

// let url = "http://data.media.theplatform.com/media/data/Media/Field/" + customFieldNumber +
//   "?schema=1.10.0&searchSchema=1.0.0&form=cjson&pretty=true" +
//   "&token=" + token;
// {
//   "$xmlns": {
//     "plfield": "http://xml.theplatform.com/data/object/Field"
//   },
//   "plfield$dataStructure": "Single",
//   "plfield$defaultValue": "",
//   "title": "Show",
//   "plfield$allowedValues": arrayShows,
//   "plfield$notifyAlways": false,
//   "plfield$length": 0,
//   "id": "http://data.media.theplatform.com/media/data/Media/Field/214169463",
//   "guid": "YAD6ewA2DgDfegBA3wwYJcMSGvejuHfI",
//   "ownerId": "http://access.auth.theplatform.com/data/Account/2686406403",
//   "plfield$dataType": "String"
// };

const APPEND_TO_MAKE_FULL_ID = "http://data.media.theplatform.com/media/data/Media/Field/";

const DEV_MAIN_ACCOUNT = "2686406403";
const DEV_MAIN_ACCOUNT_CF_SHOWS = "214169463";

const STAGE_MAIN_ACCOUNT = "2649273223";
const STAGE_MAIN_ACCOUNT_CF_SHOWS = "155289480";

const PROD_MAIN_ACCOUNT = "2649321885";
const PROD_MAIN_ACCOUNT_CF_SHOWS = "156313528";

const STAGE_WETV = '2676155873';
const STAGE_WETV_CF_SHOWNAME = '183961471';

// returns as a string the custom field Shows number for the given account number. or "" with error thrown
function getCFShows(account) {
  // this bit is us telling it which customField number to use in the link
  let cfNumber = "";
  switch (account) {
    case DEV_MAIN_ACCOUNT:
      return DEV_MAIN_ACCOUNT_CF_SHOWS;
      break;
    case STAGE_MAIN_ACCOUNT:
      return STAGE_MAIN_ACCOUNT_CF_SHOWS;
      break;
    case PROD_MAIN_ACCOUNT:
      return PROD_MAIN_ACCOUNT_CF_SHOWS;
      break;
    case STAGE_WETV:
      return STAGE_WETV_CF_SHOWNAME;
    default:
      throw new Error('Unrecognized account, cannot add shows: ', account);
      return "";
      break;
  }
}


function add() {
  //------- define / grab stuff
  let showToAdd = "1111";

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
  const getAllowedValuesForShowsURL = "http://data.media.theplatform.com/media/data/Media/Field/" + cf_identifier +
    "?schema=1.10.0&searchSchema=1.0.0&form=cjson&pretty=true&fields=allowedValues&token=" + token;
  return getAllowedValuesForShowsURL;
}


// returns an object that will be the body of a post request to allowedValues of a specific 'Show' custom field
// given an accountID (which account are you making the change  to) and arrayShows (the array of values to make the allowedValues)
function bodyOfAddShow(accountID, arrayShows) {

  let cf_id = getCustomFieldForAccount(accountID);
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

// returns the custom field for adding a show for the given account
function getCustomFieldForAccount(accountID) {
  // TODO: finish this so it retrieves the cust field for the account given
  return "6969696";
}


// generic url to add show (post with content-type: application/json header and also the body in correct format)
// let url = "http://data.media.theplatform.com/media/data/Media/Field" +
//   "?token=" + token + "&fields=plfield%24allowedValues%2Ctitle%2Cid%2Cguid" +
//   "&schema=1.8.0";
