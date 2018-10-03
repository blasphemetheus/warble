// a function that takes a name and a message (both strings is the assumption and signs you in with those)
// it makes a session cookie to represent sign in
function signIn(message) {
  console.log("the thing to BE PUT INTO A COOKIE COOKIE COOKIIE", message);
  sessionCookie("SignIn", message);
}

// makes a generic cookie with no additional parameters given a name and message
function sessionCookie(name, value) {
  document.cookie = name + "=" + value;
}

// clears the selected cookie on session end
function deleteCookie(name) {
  document.cookie = name + "=" + ";" + "expires=Thu, 01 Jan 1970 00:00:01 GMT";
}

// deletes the signIn cookie and refreshes the page
function signOut() {
  console.log("signing out - deleting cookie");
  deleteCookie("SignIn");
  // refresh to make it stick
  // (true makes it reload from server, false would make it reload from cache)
  document.location.reload(true);
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
