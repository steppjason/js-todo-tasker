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
            deleteButton.innerHTML ='<svg style="" xmlns="http://www.w3.org/2000/svg" id="Capa_1" enable-background="new 0 0 512 512" height="14" viewBox="0 0 512 512" width="14"><g><path fill="#fd6464" d="m442.154 145c10.585 0 17.924-10.701 13.955-20.514-14.093-34.841-48.275-59.486-88.109-59.486h-18.414c-6.867-36.273-38.67-65-77.586-65h-32c-38.891 0-70.715 28.708-77.586 65h-18.414c-39.834 0-74.016 24.645-88.109 59.486-3.969 9.813 3.37 20.514 13.955 20.514zm-202.154-115h32c21.9 0 40.49 14.734 46.748 35h-125.496c6.258-20.266 24.848-35 46.748-35z"></path><path fill="#fd6464" d="m111.053 470.196c1.669 23.442 21.386 41.804 44.886 41.804h200.121c23.5 0 43.217-18.362 44.886-41.804l21.023-295.196h-331.938zm185.966-214.945c.414-8.274 7.469-14.655 15.73-14.232 8.274.414 14.646 7.457 14.232 15.73l-8 160c-.401 8.019-7.029 14.251-14.969 14.251-8.637 0-15.42-7.223-14.994-15.749zm-97.768-14.232c8.263-.415 15.317 5.959 15.73 14.232l8 160c.426 8.53-6.362 15.749-14.994 15.749-7.94 0-14.568-6.232-14.969-14.251l-8-160c-.413-8.273 5.959-15.316 14.233-15.73z"></path></g></svg>';
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
    window.localStorage.setItem("js_tasks", JSON.stringify(tasks));
}

function loadLocalStorage(){
    if(localStorage.getItem("js_tasks") !== null){
        tasks = JSON.parse(localStorage.getItem("js_tasks"));
        tasks.forEach(function(task){
            addItem(task[0],task[1], false);
        });
    }
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