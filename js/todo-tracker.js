
// Get HTML elements we are working with
const taskList = document.getElementById("tasklist-list");
const taskListInput = document.getElementById("tasklist-input");
const taskListButton = document.getElementById("tasklist-button");
const taskListError = document.getElementById("tasklist-error");

const errorNone = "Please enter a task name";

var tasks = [];

// Add event listeners to add a new task
taskListInput.addEventListener("keypress", addItemOnKey);
taskListButton.addEventListener("click", addItemOnClick);

let localTodoList = window.localStorage.jsToDoList;

loadLocalStorage();

// Add a new item to the list
function addItem(taskValue, isComplete, save){
    if(getInputLength() > 0 || !save){
        toggleError(false);

        var listItem = document.createElement("li");
        var completeCheckbox = document.createElement("input");
        var deleteButton = document.createElement("button");

        listItem.classList.add("c-tasklist__listitem");

        completeCheckbox.type = "checkbox";
        deleteButton.appendChild(document.createTextNode("X"));

        listItem.appendChild(completeCheckbox);
        listItem.appendChild(document.createTextNode(taskValue));
        listItem.appendChild(deleteButton);

        taskList.appendChild(listItem);

        if(isComplete){
            listItem.classList.toggle("listitem--is-complete")
            completeCheckbox.checked = true;
        }
    
        completeCheckbox.addEventListener("click", completeItem);
        deleteButton.addEventListener("click", removeItem);

        // Remove an item from the list
        function removeItem(){
            tasks.splice(Array.from(listItem.parentNode.children).indexOf(listItem),1);
            taskList.removeChild(listItem);
            saveLocalStorage();
        }

        // Marks an item as complete
        function completeItem(){
            tasks[Array.from(listItem.parentNode.children).indexOf(listItem)][1] = !tasks[Array.from(listItem.parentNode.children).indexOf(listItem)][1];
            listItem.classList.toggle("listitem--is-complete")
            saveLocalStorage();
        }

        if(save){
            tasks.push([taskValue, isComplete]);
            saveLocalStorage();
        }

    } else if (save){
        toggleError(true);
        taskListError.innerHTML = errorNone;
    }
}

// Check if the user presses the Enter key
// Keycode 13 is the 'enter' key
function addItemOnKey(){
    if (event.which ===13) {
        addItem(taskListInput.value, false, true);
    }
}

// Check if user clicks the submit button
function addItemOnClick(){
    addItem(taskListInput.value, false, true);
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
    window.localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadLocalStorage(){
    tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.forEach(function(task){
        console.log(task[0] + ", " + task[1]);
        addItem(task[0],task[1], false);
    });
}

function getInputLength(){
    return taskListInput.value.length;
}