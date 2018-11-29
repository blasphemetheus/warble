# warble

A tool that ties into MPX. Uses their identity services (logging in via an endpoint), to generate a token. Then does things that are inconvenient to do within the Flash-based MPX interface. For now, the only features are: login interface, memory storage for session, interface for adding an allowedValue to the Show custom field (a property of a custom field).



To use, just download the files in the repo into a folder, then host that folder somewhere (localhost or web server).

If you have PHP installed on your machine you can easily server it on localhost:<port-number> with the following command:

php -S localhost:<port-number>

(a common <port-number> for this would be 8000 or 3000. So you might enter in the command "php -S localhost:8000").



Right now this tool doesn't do much, the idea right now is to make it do the one thing it needs to with a minimum of fuss.
Then later features can be added if so desired (because there's a bunch of things we use MPX to do that could be done easier).
For instance, there's some Cue Point stuff which might be more useful to do not in MPX.


[Sketch going along with this project](sketch.png)




// return true if admin - false if otherwise
async function checkIfAdmin() {
  if (!(isSignedIn() && isInAccount())) {
    throw new Error('not in account or not signed in');
  }
  // pull out the token and longAccountID
  let accountObj = accessAccount();
  accountObj = JSON.parse(accountObj);
  let acc = accountObj.currentAccountObj;
  let longAccountID = acc.id;
  let signin = accessSignIn();
  signin = JSON.parse(signin);
  let token = signin.token;

  // let promise = doSomethingAsync();
  // return promise.then(() => {
  //   somethingComplicated();
  // })
  // bad above

  // define promise ...
  let promiseCheckAdmin = new Promise(function(resolve, reject) { // immediately starts running this fn
    var admin = false;
    let urlToCheckAdmin = "http://access.auth.theplatform.com/web/Authorization/authorize" +
      "?account=" + longAccountID + "&form=json" + "&token=" + token + "&schema=1.3" +
      "&_operations%5B0%5D.service=Console%20Data%20Service&_operations%5B0%5D.method=POST&_operations%5B0%5D.endpoint=MenuItem";

    fetch(urlToCheckAdmin)
      .then((response) => response.json())
      .then((data) => {
        console.log(JSON.stringify(data));
        let authResp = data.authorizeResponse;
        console.log(authResp);
        let accounts = authResp.accounts;
        console.log(accounts);

        switch (accounts.length) {
          case 0:
            throw new Error('accounts in response does not have any elements, not an admin');
            break;
          case 1:
            break;
          default:
            throw new Error('there are more than one accounts in response');
            break;
        } // if it made it past switch without erroring out, then there is something to compare

        let accountChecked = accounts[0];
        console.log('accountChecked', accountChecked);
        let newID = accountChecked.id;
        console.log('these equal?', newID);
        console.log('second', longAccountID);

        if (newID = longAccountID) {
          console.log('should return true');
          return data;
          resolve('Successful request and is admin');
        } else {
          reject('successful request and strings don\'t match?');
        }
        console.log(admin);
        reject(Error('something wrong'));
      }).catch((error) => console.error(error)); // end of thens for the actual fetch
  }); // end of promise stuff

  return promiseCheckAdmin.then(() => {
    return true;
    somethingComplicated();
  });



  // success callback for checkingAdmin
  function successCallback(result) {
    console.log(result);
    return true;
  }

  // failure callback fn for checkingAdmin
  function failureCallback(err) {
    console.error(err);
    return false;
  }

  promiseCheckAdmin.then(successCallback).catch(failureCallback);
}
