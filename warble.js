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
