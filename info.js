// The info in this document should probably be abstracted out before exposing this to the wider internet.
// This is mostly because it's just not an amazing plan to give out account_id type information.
// Everything else is definitely safe to broadcast to the combined networks of the world.
// We could use node to store this information and then ask node for it somehow,
// but that involves messing with the node instance, which Eric Strand configured.
// My plan was to originally do this using Express and MongoDB but it didn't seem strictly
// necessary because this is hosted behind VPN. That would also involve messing
// with the node instance which is already set up.

// returns which environment based on pid, default value (not one of three) is
//  'unknown', throws Error if unknown (which isn't reached?)
function whichEnvironment(pid) {
  // the pid tells us which environment we're in
  switch (pid) {
    case 'bSEZRC': // this is dev
      return 'dev';
      break;
    case '1RZrUC': // this is stage
      return 'stage';
      break;
    case 'M_UwQC': // this is prod
      return 'prod';
      break;
    default:
      return 'unknown';
      new Error('unknown environment for given pid', pid);
  }
}

// returns the customField ID (as a number) of the given account id (as a number).
//  If the account is unlisted (ie not in our little fake database), then we return undefined.
//  If the account is listed, but has no customFieldID, then we return null.
function getCustomFieldForAccount(account) {
  let accountData = [ // account_id, customfield_id (if null there isn't one)
    // the first thing in array is ... the account id
    // the second thing in array is ... the corresponding customField id for shows (or shownames or whatever it's called for that network)
    //                  null means there is no such cf_id for that account
    [2686406403, 214169463], //DEV_MAIN_ACCOUNT
    [2649273223, 155289480], //STAGE_AMC
    [2676155873, 183961471], //STAGE_WETV
    [2665992905, 179353621], //STAGE_IFC
    [2665992175, 182425513], //STAGE_BBCA
    [2685731763, 299161469], //STAGE_SUNDANCE_TV
    [2703280093, 359577460], //STAGE_ASSET_REPO
    [2494403701, null], //STAGE_GENERAL
    [2666065425, null], //STAGE_ADS_REPO
    [2702809055, null], // STAGE_REF_2POINT0
    [2649321885, 156313528], //PROD_AMC
    [2676155197, 185497559], //PROD_WETV
    [2675820809, 183961462], //PROD_BBCA
    [2673068635, 180889499], //PROD_IFC
    [2685731137, 233113468] //PROD_SUNDANCE_TV
  ];
  accountData[Symbol.iterator] = iter.bind(null, accountData);

  function* iter(o) {
    var keys = Object.keys(o);
    for (var i = 0; i < keys.length; i++) {
      // console.log(o[values[i]]);
      yield o[keys[i]];
    }
  }

  // run through each array in arrayOfAccountInfo and log the accountID and custFieldID
  for (var v of accountData) {
    let object = v;
    let accountID = object[0];
    let customFieldID = object[1];
    if (account == accountID) { // if account is listed ...
      // we will return the value stored for this accountID
      //   if the cf-id is null, it will be returned, if it exists it will be returned
      console.log('retrieved cf for ' + account + ' as ' + customFieldID);
      return customFieldID;
    }
  }
  // if the logic got here then the account is unlisted/new to our database --- so we return undefined
  return undefined;
}
