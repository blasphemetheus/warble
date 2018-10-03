var numAttempts = document.querySelector('.numAttempts');
var lastAttempt = document.querySelector('.lastAttempt');
var errorCase = document.querySelector('.errorCase');

var loginAttempt = document.querySelector('.loginAttempt');
var usernameField = document.querySelector('.usernameField');
var passwordField = document.querySelector('.passwordField');

var attemptCount = 1;
var refresh;

//sends an http request to get a new token, given the username and password. Returns false if unsuccessful for any reason.
// if successful, returns the token
function requestToken(u, p, e) {
  var responseText = document.getElementById('response');
  // TODO better checking/reporting on whether the username or password are not empty
  if (u === '' || p === '') {
    responseText.innerHTML = 'you didn\'t enter in anything for your username and password, try again';
  }

  // meat of the request
  const Http = new XMLHttpRequest();
  const url = 'https://identity.auth.theplatform.com/idm/web/Authentication/signIn?schema=1.0&form=json&_idleTimeout=120960000';
  Http.open("GET", url)

  //sets header to be the encoding
  Http.setRequestHeader("Authorization", "Basic " + e);

  // the function that runs when the http sends and gets a response
  Http.onload = (res) => {
    console.log('made it to onload');
    //  the http response returns a JSON in string form that we must parse (into an object in javascript)
    response = JSON.parse(Http.response);

    // must stringify the response or it'll look like [object Object] in html
    // document.getElementById('loginResponse').innerHTML = JSON.stringify(response);

    console.log('the login response was: ', response);

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
    if (typeof response.signInResponse != "undefined") {
      // login succeeded
      console.log('there is a signInResponse object');
      console.log('SUCCESSFUL LOGIN');

      // log the signInResponseObject
      console.log('signInResponse Object is: ', response.signInResponse);

      // elements of the signInResponse object in the response
      console.log('token is: ' + response.signInResponse.token);
      console.log('duration is: ' + response.signInResponse.duration);
      console.log('idleTimeout is: ' + response.signInResponse.idleTimeout);
      console.log('userName is: ' + response.signInResponse.userName);
      console.log('userId is: ' + response.signInResponse.userId);

      // do stuff because login succeeded
      lastAttempt.textContent = 'Success!';
      lastAttempt.style.backgroundColor = 'cyan';
      errorCase.textContent = 'No Error - token retrieved';
      document.getElementById("loginResponse").innerHTML = '<h1 style="color:green">Successful Login</h1>';

      // pull token out of json
      token = response.signInResponse.token;

      // change html
      lastAttempt.textContent = 'You logged in successfully - got token: ' + token;
      lastAttempt.style.backgroundColor = 'green';
      errorCase.textContent = 'Success - redirecting now ...';

      // TODO make this countdown more advanced, have a countdown and write a function that adds one to the countdown displayed
      //wait 3 seconds with countdown
      //alert('redirecting...');

      // put the data we want to save into a cookie (the whole JSON for now
      // TODO make more secure, encode, obfuscate, don't include sensitive information)

      // Make a cookie using our preloaded javascript file session.js which has the signIn function
      // json.stringify so we pass it a string
      signIn(JSON.stringify(response.signInResponse));

      // wait a third of a second then display Redirecting ...
      let timerId = setTimeout(() => document.getElementById("redirecting").innerHTML = '<h1>redirect ...</h1>', 333);

      //navigate to the welcome page of wobble
      // TODO So this doesn't move the window,window.location.href = "welcome.html" will do the trick
      // TODO But if we want to POST, or at the Very Least transfer information somewhat securely between pages of
      // TODO a website (i want to do this), I need to figure out how to do that via Javascript

      // let timerId2 = setTimeout(() => window.location.href = 'welcome.html', 2000);
      let timerId2 = setTimeout(() => window.location.href = 'welcome.html', 2000);


    } else {
      // login failed
      console.log('there is NO signInResponse object');
      console.log('FAILED LOGIN');

      // elements of the response (error details)
      console.log('responseCode is: ' + response.responseCode);
      console.log('title is: ' + response.title);
      console.log('isException is: ' + response.isException);
      console.log('correlationId is: ' + response.correlationId);
      console.log('description is: ' + response.description);

      // if we wanna do anything for repeated attempts
      if (numAttempts > 3) {
        console.log('num attempts GREATER THAN 3 OMG');
      }

      // do stuff because login failed
      lastAttempt.textContent = 'Wrong!';
      lastAttempt.style.backgroundColor = 'red';
      errorCase.textContent = 'no info on error, the request no work';
      document.getElementById("loginResponse").innerHTML = '<span style="color:red">Your login failed, try again </span>';
    }
  } // end of onload fn

  //happens regardless of if statement
  Http.send()
} // end of requiresToken fn

function checkLogin() {

  // retrieve username and password fields, put em in local variables
  var username = usernameField.value;
  console.log('The username value is ' + username);

  var password = passwordField.value;
  console.log('The password value is ' + password);

  // if this is first attempt, set numAttempts to 'Previous Attempts: '
  if (attemptCount === 1) {
    numAttempts.textContent = 'Previous Attempts: ';
  }
  // append the current username and password
  numAttempts.textContent += username + ':' + password + ' ';

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
  console.log("before request");
  requestToken(username, password, encodedString);
  console.log("after request");


  // add one to the attempts counter
  numAttempts++;
  // reset values of username/password
  usernameField.value = '';
  passwordField.value = '';
  // focus on the username
  usernameField.focus();
}


loginAttempt.addEventListener('click', checkLogin);


// javascript yo
function createParagraph() {
  var paragra = document.createElement('p');
  paragra.textContent = 'boom';
  document.body.appendChild(paragra);
}

/*
1. Get references to all the buttons on the page and sort them in an array.
2. Loop through all the buttons and add a click event listener to each one.

When any button is pressed, the createParagraph() function will be run.
*/

var buttons = document.querySelectorAll('button');

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', createParagraph);
}


/*
-------- get-token.php --------
<?

$username = $_GET["username"];
$password = $_GET["password"];

$url = 'https://identity.auth.theplatform.com/idm/web/Authentication/signIn?schema=1.0&form=json&_idleTimeout=120960000';



//Here is the CURL that does the magic and creates the token
$ch = curl_init($url);
        $options = array(
                CURLOPT_RETURNTRANSFER => true,         // return web page
                CURLOPT_HEADER         => false,        // don't return headers
                CURLOPT_FOLLOWLOCATION => false,         // follow redirects
               // CURLOPT_ENCODING       => "utf-8",           // handle all encodings
                CURLOPT_AUTOREFERER    => true,         // set referer on redirect
                CURLOPT_CONNECTTIMEOUT => 20,          // timeout on connect
                CURLOPT_TIMEOUT        => 20,          // timeout on response
                //CURLOPT_POST            => 1,            // i am sending post data
                //CURLOPT_POSTFIELDS     => $request,    // this are my post vars
                CURLOPT_HTTPHEADER     => array(
                    "Authorization: Basic " .$finallogincred."",
                    "Content-Type: application/json"
                )

        );

        curl_setopt_array($ch,$options);
        $data = curl_exec($ch);
        $curl_errno = curl_errno($ch);
        $curl_error = curl_error($ch);
       // echo $curl_errno;
        //echo $curl_error;
        curl_close($ch);


//The token is stored in the returned JSON called "$data"

//$outputJSON is where we store the decoded JSON
$outputJSON = json_decode($data);


//Then we pull out the nested token value from the main array and the token is called
//You guessed it "token" in side the overaaching array signInResponse
//echo "i am a token:" .$outputJSON->signInResponse->token;

//Now let's create a session cookie so we can use the token whenever we need it.

if($outputJSON->signInResponse->token) {
//drop the token cookie as a session variable and take user to page to do stuff
	session_start();
	$_SESSION['myToken'] = $outputJSON->signInResponse->token;
	header('Location: do-stuff.php');

} else {
	//login didn't work and sends you back home for new creds
	header('Location: index.php?login=failed');

}

?>

<a href="is-token-still-here.php">check for token</a>


*/