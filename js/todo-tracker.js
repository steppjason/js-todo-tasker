/* ==================================================================
    Javascript Todo task tracker
================================================================== */

// Get HTML elements we are working with
const taskList = document.getElementById("tasklist-list");
const taskListInput = document.getElementById("tasklist-input");
const taskListButton = document.getElementById("tasklist-button");
const taskListError = document.getElementById("tasklist-error");
const taskListContent = document.getElementById("tasklist-content");

// Variable to store our todo list items in
var tasks = [];

// Trashcan Icon SVG
var deleteSVG = '<svg class="c-delete__icon" xmlns="http://www.w3.org/2000/svg" id="Capa_1" enable-background="new 0 0 512 512" height="14" viewBox="0 0 512 512" width="14"><g><path d="m442.154 145c10.585 0 17.924-10.701 13.955-20.514-14.093-34.841-48.275-59.486-88.109-59.486h-18.414c-6.867-36.273-38.67-65-77.586-65h-32c-38.891 0-70.715 28.708-77.586 65h-18.414c-39.834 0-74.016 24.645-88.109 59.486-3.969 9.813 3.37 20.514 13.955 20.514zm-202.154-115h32c21.9 0 40.49 14.734 46.748 35h-125.496c6.258-20.266 24.848-35 46.748-35z"></path><path d="m111.053 470.196c1.669 23.442 21.386 41.804 44.886 41.804h200.121c23.5 0 43.217-18.362 44.886-41.804l21.023-295.196h-331.938zm185.966-214.945c.414-8.274 7.469-14.655 15.73-14.232 8.274.414 14.646 7.457 14.232 15.73l-8 160c-.401 8.019-7.029 14.251-14.969 14.251-8.637 0-15.42-7.223-14.994-15.749zm-97.768-14.232c8.263-.415 15.317 5.959 15.73 14.232l8 160c.426 8.53-6.362 15.749-14.994 15.749-7.94 0-14.568-6.232-14.969-14.251l-8-160c-.413-8.273 5.959-15.316 14.233-15.73z"></path></g></svg>';

// Add event listeners to add a new task
taskListInput.addEventListener("keypress", addItemOnKey);
taskListButton.addEventListener("click", addItemOnClick);

loadLocalStorage();
taskListInput.focus();


/**
 *  Add an item to our todo task list
 */
function addItem(taskValue, isComplete, save){

    // Check if the user input isn't empty or if save is off for initial load
    if(getInputLength() > 0 || !save){
    
        // Hide the error message if user enters a new task successfully
        toggleError(false);

        /**
         *  Create our list item, checkbox, trash icon
         */
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
            spanCheckbox.classList.add("js-listitem__checkbox--hover");

        var deleteButton = document.createElement("button");
            deleteButton.innerHTML = deleteSVG;
            deleteButton.classList.add("c-tasklist__delete");
            deleteButton.classList.add("js-listitem__delete--hover");
            

        /**
         *  Construct the <li> element from all DOM pieces
         */
        listItem.appendChild(labelCheckbox);
            labelCheckbox.appendChild(document.createTextNode(taskValue));
            labelCheckbox.appendChild(completeCheckbox);
            labelCheckbox.appendChild(spanCheckbox);
        listItem.appendChild(deleteButton);

        // Append the <li> element to the main task list
        taskList.appendChild(listItem);

        // CSS hack to fade the item into existence. Looks nice
        listItem.classList.add("fade");

        // Check whether the task is marked as complete and change style
        if(isComplete){
            listItem.classList.add("listitem--is-complete")
            completeCheckbox.checked = true;
        }
        
        // Add event listeners for clicking the checkbox or trash icon
        completeCheckbox.addEventListener("click", completeItem);
        deleteButton.addEventListener("click", hide);

        /**
         *  Start removing the todo task from the DOM and our task array
         */
        function hide(){
            toggleError(false);

            // Remove transition effect CSS so our script only looks for the end the hide transition
            listItem.classList.remove("fade");
            listItem.classList.remove("c-listitem--box-shadow");
            deleteButton.classList.remove("js-listitem__delete--hover");
            spanCheckbox.classList.remove("js-listitem__checkbox--hover");

            // Add our hide transition class to fade item out
            listItem.classList.add("js-tasklist__listitem--is-hidden");

            // Add an event listener to wait for fade out transition then call our next step
            listItem.addEventListener("transitionend", hideHeight);
        }

        /**
         *  Transition to shrink the DOM elements smoothly
         */
        function hideHeight(){
            // Remove the event listener for the fade out transition
            listItem.removeEventListener("transitionend", hideHeight);

            // Add our shrink transition to resize the DOM elements
            listItem.classList.add("js-tasklist__listitem--is-height-hidden");

            // Add an event listener to wait for the DOM element to resize
            listItem.addEventListener("transitionend", removeItem);

            // Remove the task from our tasks array
            tasks.splice(Array.from(listItem.parentNode.children).indexOf(listItem),1);

            // Check if our tasks array is empty to hide main wrapper if necessary
            checkEmpty();
        }

        /**
         *  Last step to remove the DOM element after all transitions
         */
        function removeItem(){
            // Remove previous shrink transition
            listItem.removeEventListener("transitionend", removeItem);

            // Delete the list item from the DOM
            taskList.removeChild(listItem);

            // Save our tasks array to local storage then reset focus to the input box
            saveLocalStorage();
            taskListInput.focus();
        }

        /**
         *  Mark/unmark the todo task in our array as completed and toggle complete style on list item
         */
        function completeItem(){
            tasks[Array.from(listItem.parentNode.children).indexOf(listItem)][1] = !tasks[Array.from(listItem.parentNode.children).indexOf(listItem)][1];
            listItem.classList.toggle("listitem--is-complete")
            saveLocalStorage();
        }

        /**
         *  Push our newly added todo tasks to our array and save to the local storage
         */
        if(save){
            tasks.push([taskValue, isComplete]);
            saveLocalStorage();
        }

        // Check if tasks array is empty and reset input box to nothing and re-focus 
        checkEmpty();
        taskListInput.value = "";
        taskListInput.focus();

    } 
    // If input field is empty toggle our error message and re-focus
    else if (save){
        toggleError(true);
        taskListInput.focus();
    }
}



/**
 *  Add a task if the user presses enter
 */
function addItemOnKey(){
    if (event.which ===13) {
        addItem(taskListInput.value, false, true);
    }
}


/**
 *  Add a task if user clicks submit
 */
function addItemOnClick(){
    addItem(taskListInput.value, false, true);
}


/**
 *  Toggle the error message on/off
 */
function toggleError(active){
    if(active){
        taskListError.classList.add("error-message--is-active");
        taskListError.classList.remove("error-message--is-hidden");
    } else {
        taskListError.classList.add("error-message--is-hidden");
        taskListError.classList.remove("error-message--is-active");
    }
}


/**
 *  Save todo task list to local storage
 */
function saveLocalStorage(){
    window.localStorage.setItem("js_tasks", JSON.stringify(tasks));
}

/**
 *   Check if todo task list exists in local storage and load data into tasks array
 */
function loadLocalStorage(){
    if(localStorage.getItem("js_tasks") !== null){
        tasks = JSON.parse(localStorage.getItem("js_tasks"));
        
        // Loop through each todo task and add it to the DOM, 
        //  set the save parameter to false so we don't save over our initial data load
        tasks.forEach(function(task){
            addItem(task[0],task[1], false);
        });
    }
}

/**
 *  Check if our tasks array is empty and hide/show main tasklist wrapper
 */
function checkEmpty(){
    if(tasks.length > 0){
        taskListContent.classList.remove("c-tasklist__content--hidden");
    } else {
        taskListContent.classList.add("c-tasklist__content--hidden");
    }
}

/**
 *  Get input text field length
 */
function getInputLength(){
    return taskListInput.value.length;
}