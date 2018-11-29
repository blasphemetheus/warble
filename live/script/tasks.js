// This document pertains to tasks. It should be only functions to be called elsewhere


// TODO list of tasks to implement eventually ---
// custField_GetAllShows, custField_AddNewShow
// GetAllMedia, ChangeTitleOfMediaByID
// TODO later (list of tasks to do later?)
// GetThisMediaByID, GetFieldByID, custField_allowedValuesByID,
// TODO probably
// AddCuePoints or somesuch

const allTasks = [{
  name: 'cf_addShow'
}, {
  name: 'generateBadTweet'
}];

// returns an array of all of the Tasks that exist
function allTaskArray() {
  return allTasks;
}

// returns the string representing the task passed in
function taskToString(task) {
  switch (task) {
    case "cf_addShow":
      return "Add a Show (really adding an allowedValue to a Custom Field)";
      break;
    case "generateBadTweet":
      return "Generate a Bad Tweet (really randomly putting words together)";
      break;
    default:
      throw new Error("Incorrect Task- invalid: " + task);
      break;
  }
}

function displaySelectableTasks() {

  // get the array of tasks
  // --- .... ---
  let allTasksArray = allTaskArray();
  console.log('all them tasks', allTasksArray);

  // make form we'll use
  let ferm = document.createElement('form');
  ferm.setAttribute('id', 'selectTask');
  // this line is crucial, could sub out the function but alert(this.submitted),
  //  then we set onclick to be 'this.form.submitted=this.value;' in each input
  ferm.setAttribute('onsubmit', 'checkPickTask(this.submited);');
  ferm.setAttribute('class', 'selectTask');
  // on click, this form'll activates checkPickTask, which does all that is necessary
  document.body.appendChild(ferm);

  allTasksArray.forEach((element) => {
    let name = element.name;

    let lab = document.createElement('label');
    lab.innerHTML = name;

    // have it print out a <label> with label variable inside of it </label>
    let inp = document.createElement('input');
    inp.setAttribute('type', 'submit');
    inp.setAttribute('name', name);
    inp.setAttribute('value', name);
    inp.setAttribute('onclick', 'this.form.submited=this.value');

    document.getElementById('selectTask').appendChild(lab);
    document.getElementById('selectTask').appendChild(inp);
    document.getElementById('selectTask').appendChild(document.createElement('br'));

  });

  // eventually we need a foreach loop that runs through each task in a list and creates
  //      an item for them so you can select them
  console.log('you\'ve reached the select task bit');
}



// given the currentTask (string)
// the function that gets called when user presses the button for choosing a task
function checkPickTask(currentTask) {
  /*Form -----    {selectedAccount : "pidOfSelectedAccount", listOfAccounts : [{accountObj1},{accountObj2}] }    */
  // this is the format of the JSON we will have in sessionStorage
  // sets the JSON we'll be using to

  let buildingTaskJSON = {
    currentTask: currentTask,
  };
  console.log('Our Build TaskJSON', JSON.stringify(buildingTaskJSON));
  // sessionStorage storing Task
  enterTask(JSON.stringify(buildingTaskJSON));
  console.log('Put TaskJSON in sessionStorage');
}
