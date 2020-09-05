
// Get HTML elements we are working with
const taskList = document.getElementById("tasklist-list");
const taskListInput = document.getElementById("tasklist-input");
const taskListButton = document.getElementById("tasklist-button");
const taskListError = document.getElementById("tasklist-error");

const errorNone = "Please enter a task name";

// Add event listeners to add a new task
taskListInput.addEventListener("keypress", addItemOnKey);
taskListButton.addEventListener("click", addItemOnClick);


// Add a new item to the list
function addItem(){
    if(getInputLength() > 0){
        toggleError(false);

        var listItem = document.createElement("li");
        var completeCheckbox = document.createElement("input");
        var deleteButton = document.createElement("button");

        listItem.classList.add("c-tasklist__listitem");

        completeCheckbox.type = "checkbox";
        deleteButton.appendChild(document.createTextNode("X"));

        listItem.appendChild(completeCheckbox);
        listItem.appendChild(document.createTextNode(taskListInput.value));
        listItem.appendChild(deleteButton);

        taskList.appendChild(listItem);

        
        completeCheckbox.addEventListener("click", completeItem);
        deleteButton.addEventListener("click", removeItem);

        // Remove an item from the list
        function removeItem(){
            taskList.removeChild(listItem);
        }

        // Marks an item as complete
        function completeItem(){
            listItem.classList.toggle("listitem--is-complete")
        }

        saveLocalStorage();

    } else {
        toggleError(true);
        taskListError.innerHTML = errorNone;
    }
}

// Check if the user presses the Enter key
// Keycode 13 is the 'enter' key
function addItemOnKey(){
    if (event.which ===13) {
        addItem();
    }
}

// Check if user clicks the submit button
function addItemOnClick(){
    addItem();
}

// Toggle the error message on/off
function toggleError(active){
    if(active){
        taskListError.classList.add("error-message--is-active");
        taskListError.classList.remove("error-message--is-hidden");
    } else {
        taskListError.classList.add("error-message--is-hidden");
        taskListError.classList.remove("error-message--is-active");
    }
}

function saveLocalStorage(){
    window.localStorage.jsToDoList = taskList.innerHTML;
    console.log(window.localStorage.jsToDoList);
}

function loadLocalStorage(){
    taskList.innerHTML = window.localStorage.jsToDoList;
}

// Get length of the input text box
function getInputLength(){
    return taskListInput.value.length;
}