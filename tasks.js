// This document pertains to tasks. It should be only functions to be called elsewhere


// TODO list of tasks to implement eventually ---
// custField_GetAllShows, custField_AddNewShow
// GetAllMedia, ChangeTitleOfMediaByID
// TODO later (list of tasks to do later?)
// GetThisMediaByID, GetFieldByID, custField_allowedValuesByID,
// TODO probably
// AddCuePoints or somesuch

const allTasks = [{
  name: 'addAllowedValueToTheShowCustomField'
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
    case "addAllowedValueToTheShowCustomField":
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
