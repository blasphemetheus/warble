//This document details what's gonna happen on the warble.html page due to Javascript

displayAddShow();


// -------------- function below, scripts above

// this function will pull out the stuff we need to add a show and return an object with all the stuff in it
function pullOutStuffForAddShow() {
  let signin = accessSignIn();
  signin = JSON.parse(signin);
  let token = signin.token;

  let accObj = accessAccount();
  accObj = JSON.parse(accObj);
  let account = accObj.currentAccount;

  let tskObj = accessTask();
  tskObj = JSON.parse(tskObj);
  let task = tskObj.currentTask;

  let object = {
    'token': token,
    'account': account,
    'task': task
  };
  return object;
}


// this function actually adds the show (making ajax calls, responds to them etc)
function doAddShow(showToAdd) {
  console.log('actually adding show', showToAdd);

  // (showToAdd is a string)
  if (typeof showToAdd != "string") {
    throw new Error('Hey, the type of the thing you\'re passing into addShow is not a string');
  }

  // assemble data, put into object. rn: (token, account, task) are the fields
  let object = pullOutStuffForAddShow();
  console.log('Our Info', object);
}


// A function that adds one show (exactly as input) to the allowedValues array within the customField Show
function displayAddShow() {
  // append form to body that allows you to click it,
  // a 'you sure' function activates which displays info including your input and which account
  // if you press ok there, it does the thing (an onload, ajax fn), and displays the results when they come back

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


  div.appendChild(alert);
  div.appendChild(lab);
  div.appendChild(inp);
  div.appendChild(submit);

  document.body.appendChild(div);
}

// the function that gets called when you press the add button when adding a new show
function submitAddShow() {
  let showToAdd = document.getElementById('addShowInput').value;
  document.getElementById('alert').textContent = 'The input is: "' + showToAdd + '"';

  let actuallyDo = document.createElement('button');
  actuallyDo.setAttribute('onclick', 'doAddShow("' + showToAdd + '")');



  document.body.appendChild(actuallyDo);
}


/// -------------------------------

// given an array of Accounts, adds the list of accounts into the form
function addListOfAccounts(arrAccounts) {

}

// generates the form and sticks it into the html doc
function generateForm() {

}

let exArrAccounts = [{
    name: "thing1",
    num: 1
  },
  {
    name: "thing2",
    num: 2
  },
  {
    name: "thing3",
    num: 3
  },
  {
    name: "thing4",
    num: 4
  }
];

// the stuff that was already on this document, experimenting with DOM stuff
function doThing() {

  // create form
  lb = document.createElement('br');
  selectAccount = document.createElement('form');
  selectAccount.setAttribute('id', 'selectAccount');



  showNameLabel = document.createElement('label');
  showNameLabel.setAttribute('for', 'show_name');
  showNameLabel.innerHTML = 'Show Name:';

  showNameInput = document.createElement('input');
  showNameInput.setAttribute('type', 'text');
  showNameInput.setAttribute('name', 'show_name');
  showNameInput.setAttribute('id', 'show_name');
  showNameInput.style = 'width: 300px;';

  selectAccount.appendChild(showNameLabel);
  selectAccount.appendChild(showNameInput);

  selectAccount.appendChild(lb);

  // for loop to run through each account option
  for (i = 0; i < exArrAccounts.length; i++) {
    let name = exArrAccounts[i].name;
    let num = exArrAccounts[i].num;

    label = document.createElement('label');
    id = '' + name + 'Field';
    label.setAttribute('for', id);
    label.innerHTML = name;
    selectAccount.appendChild(label)

    input = document.createElement('input');
    input.setAttribute('type', 'radio');
    input.setAttribute('id', id);
    input.setAttribute('class', id);
    selectAccount.appendChild(input);
  }


  submit = document.createElement('input');
  submit.setAttribute('type', 'submit');
  submit.setAttribute('value', 'Add');
  submit.setAttribute('class', 'addShowAttempt');

  selectAccount.appendChild(submit);
  console.log('html in selectAccount Form', selectAccount);
  let b = document.body;
  b.appendChild(selectAccount);
}
