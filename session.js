// returns the thing stored at SignIn in sessionStorage, returns null if null
function accessSignIn() {
  return sessionStorage.getItem("SignIn");
}

// returns whether you are signed in (whether sessionStorage has the key value pair for SignIn or not),
// returns false if null, true if not
function isSignedIn() {
  if (accessSignIn() == null) {
    return false;
  } else {
    return true;
  }
}

// a function that takes a name and a message (both strings is the assumption and signs you in with those)
// it makes a session cookie to represent sign in
function signIn(message) {
  console.log("Signing In - Message being stored in sessionStorage at SignIn: ", message);
  sessionStorage.setItem("SignIn", message);
}

// deletes the signIn cookie and refreshes the page
function signOut() {
  console.log("Signing out - clearing sessionStorage at SignIn");
  sessionStorage.removeItem("SignIn"); //(or if that doesn't work sessionStorage.clear(), deletes all sessionStorage stuff)
  // refresh to make it stick
  // (true makes it reload from server, false would make it reload from cache)
  document.location.reload(true);
}

// ----------------------------
function addJustArray(added) {
  added = JSON.stringify(added);
  sessionStorage.setItem('Array', added);
}

function getJustArray() {
  return sessionStorage.getItem('Array');
}

function clearJustArray() {
  sessionStorage.removeItem('Array');
}

// ----------------------------


// accessAccount, enterAccount, exitAccount

// returns the thing stored at Account in sessionStorage, returns null if null
function accessAccount() {
  return sessionStorage.getItem("Account");
}

function accessCurrentAccount() {
  if (isInAccount()) {
    let obj = accessAccount();
    obj = JSON.parse(obj);
    if (obj.currentAccount == null) {
      return new Error('current account does not exist');
    }
    return obj.currentAccount;
  } else {
    throw new Error('not currently in an account');
  }
}

// returns whether you are in an account or not, false if sessionStorage for Account is null, true if not
function isInAccount() {
  if (accessAccount() == null) {
    return false;
  } else {
    return true;
  }
}

// stores what is passed in, in session storage under Account key
function enterAccount(acct) {
  console.log("Entering Account - Message being stored in sessionStorage at Account: ", acct);
  sessionStorage.setItem("Account", acct);
}

// clears memory of account in session storage, reloads page
function exitAccount() {
  console.log("Exiting Account - clearing sessionStorage at Account");
  sessionStorage.removeItem("Account");
  document.location.reload(true);
}

// ----------------------------

// accesses what is stored at Task in sessionStorage
function accessTask() {
  return sessionStorage.getItem("Task");
}

// returns whether you are in a task or not, false if sessionStorage for Task is null, true if not
function isInTask() {
  if (accessTask() == null) {
    return false;
  } else {
    return true;
  }
}

// stores what is passed in, in session storage under Task key
function enterTask(mem) {
  console.log("Entering Task - Mem being stored at 'Task': ", mem);
  sessionStorage.setItem("Task", mem);
}

//clears memory of task in session storage, reloads page
function exitTask() {
  console.log("Exiting Task - clearing sessionStorage at Task");
  sessionStorage.removeItem("Task");
  document.location.reload(true);
}

//////

// returns a string, representing the worldState
function worldState(type) {

  switch (type) {
    case 'json':
      let temp = accessTask();
      temp = JSON.parse(temp);
      temp = temp.currentTask;
      return 'SignIn - ' + accessSignIn() + '\n' + 'Account - ' + accessAccount() + '\n' + 'Task - ' + temp + '\n';
      break;
    case 'plain':
      let signin;
      let account;
      let task;
      // go through the three world paramaters and make sure if they don't exist that we have objects with dummy Nil values
      if (isSignedIn()) {
        signin = accessSignIn();
      } else { // just some dummy object to display No User in userName spot
        signin = '{userName: "NoUser"}';
      }

      if (isInAccount()) {
        account = accessAccount();
      } else { // just some dummy object to display 'No Account' in currentAccount spot
        account = '{"currentAccount": "NoAccount"}';
      }

      if (isInTask()) {
        task = accessTask();
      } else { // just some dummy object to display 'No Task' in currentTask spot
        task = '{"name": ["NoTask"]}';
      }
      // parse each string
      signin = JSON.parse(signin);
      account = JSON.parse(account);
      task = JSON.parse(task);

      signin = signin.userName;
      account = account.currentAccount;
      task = task.currentTask;
      return "SignIn - " + signin + '\nAccount - ' + account + '\nTask - ' + task + '\n';
      break;
    default:
      new Error('You tried to use worldState but did\'t specify a vaild type');
      break;
  } // end of switch

}

/* FROM W3W3SCHOOLS */


// w3schools - set a cookie
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// w3schools - gets a cookie
function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// w3schools - check a cookie
function checkCookie() {
  var user = getCookie("username");
  if (user != "") {
    alert("Welcome again " + user);
  } else {
    user = prompt("Please enter your name:", "");
    if (user != "" && user != null) {
      setCookie("username", user, 365);
    }
  }
}
