// Get HTML elements we are working with
const taskList = document.getElementById("tasklist-list");
const taskListInput = document.getElementById("tasklist-input");
const taskListButton = document.getElementById("tasklist-button");
const taskListError = document.getElementById("tasklist-error");
const taskListContent = document.getElementById("tasklist-content");

var tasks = [];

// Add event listeners to add a new task
taskListInput.addEventListener("keypress", addItemOnKey);
taskListButton.addEventListener("click", addItemOnClick);

let localTodoList = window.localStorage.jsToDoList;

loadLocalStorage();
taskListInput.focus();

// Add a new item to the list
function addItem(taskValue, isComplete, save){
    if(getInputLength() > 0 || !save){
        toggleError(false);

        var listItem = document.createElement("li");
            listItem.classList.add("c-tasklist__listitem");
            listItem.classList.add("c-listitem--box-shadow");
        
        var labelCheckbox = document.createElement("label");
            labelCheckbox.classList.add("c-listitem__label");
        
        var completeCheckbox = document.createElement("input");
            completeCheckbox.classList.add("c-listitem__input");
            completeCheckbox.type = "checkbox";
        
        var spanCheckbox = document.createElement("span");
            spanCheckbox.classList.add("c-listitem__checkbox");

        var deleteButton = document.createElement("button");
            deleteButton.appendChild(document.createTextNode("Delete"));
            deleteButton.classList.add("c-tasklist__delete");

        
        listItem.appendChild(labelCheckbox);
            labelCheckbox.appendChild(document.createTextNode(taskValue));
            labelCheckbox.appendChild(completeCheckbox);
            labelCheckbox.appendChild(spanCheckbox);

        
        listItem.appendChild(deleteButton);

        taskList.appendChild(listItem);

        listItem.classList.add("fade");

        if(isComplete){
            listItem.classList.add("listitem--is-complete")
            completeCheckbox.checked = true;
        }
        
        completeCheckbox.addEventListener("click", completeItem);
        deleteButton.addEventListener("click", hide);

        function hide(){
            toggleError(false);
            listItem.classList.remove("fade");
            listItem.classList.remove("c-listitem--box-shadow");
            listItem.classList.add("c-tasklist__listitem--is-hidden");
            listItem.addEventListener("transitionend", hideHeight);
        }

        function hideHeight(){
            listItem.removeEventListener("transitionend", hideHeight);
            listItem.classList.add("c-tasklist__listitem--is-height-hidden");
            listItem.addEventListener("transitionend", removeItem);
            tasks.splice(Array.from(listItem.parentNode.children).indexOf(listItem),1);
            checkEmpty();
        }

        // Remove an item from the list
        function removeItem(){
            listItem.removeEventListener("transitionend", removeItem);
            taskList.removeChild(listItem);
            saveLocalStorage();
            taskListInput.focus();
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

        checkEmpty();

        taskListInput.value = "";
        taskListInput.focus();

    } else if (save){
        toggleError(true);
        taskListInput.focus();
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
        addItem(task[0],task[1], false);
    });
}

function checkEmpty(){
    if(tasks.length > 0){
        taskListContent.classList.remove("c-tasklist__content--hidden");
    } else {
        taskListContent.classList.add("c-tasklist__content--hidden");
    }
}

function getInputLength(){
    return taskListInput.value.length;
}