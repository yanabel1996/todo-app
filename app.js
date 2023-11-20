(function () {
  //Globals

  const todoList = document.getElementById("todo-list");
  const userSelect = document.getElementById("user-todo");
  const form = document.getElementById("form");
  let todos = {};
  let users = {};

  //Attach events

  document.addEventListener("DOMContentLoaded", initApp);
  form.addEventListener("submit", handleSubmit);

  //Basic logic

  function getUserName(userId) {
    const user = users.find((u) => u.id === userId);
    return user.name;
  }

  function printTodo({ id, userId, title, completed }) {
    const li = document.createElement("li");
    li.className = "todo-item";
    li.dataset.id = id;
    li.innerHTML = `<span>${title} <i>by</i> <b>${getUserName(
      userId
    )}</b></span>`;

    const status = document.createElement("input");
    status.type = "checkbox";
    status.checked = completed;
    status.addEventListener("change", handleTodoChange);

    const close = document.createElement("span");
    close.innerHTML = "&times;";
    close.className = "close";
    close.addEventListener("click", handleClose);

    li.prepend(status);
    li.append(close);

    todoList.prepend(li);
  }

  function createUserOption(user) {
    const option = document.createElement("option");
    option.value = user.id;
    option.innerText = user.name;

    userSelect.append(option);
  }

  function removeTodo(todoId) {
    todos = todos.filter((todo) => todo.id !== todoId);

    const todo = todoList.querySelector(`[data-id="${todoId}"]`);
    todo.querySelector("input").removeEventListener("change", handleTodoChange);
    todo.querySelector(".close").removeEventListener("click", handleClose);

    todo.remove();
  }

  function alertError(error) {
    alert(error.message);
  }

  //Event logic
  function initApp() {
    Promise.all([getAllTasks(), getAllUsers()]).then((values) => {
      [todos, users] = values;

      todos.forEach((todo) => printTodo(todo));
      users.forEach((user) => createUserOption(user));
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    createTodo({
      userId: Number(form.user.value),
      title: form.todo.value,
      completed: false,
    });
  }

  function handleTodoChange() {
    const todoId = this.parentElement.dataset.id;
    const completed = this.checked;

    toggleTodoComplete(todoId, completed);
  }

  function handleClose() {
    const todoId = this.parentElement.dataset.id;
    console.log(this.parentElement);
    deleteTodo(todoId);
  }

  //Async logic

  async function getAllTasks() {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos?_limit=15"
      );
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      alertError(error);
    }
  }

  async function getAllUsers() {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      const data = await response.json();

      return data;
    } catch (error) {
      alertError(error);
    }
  }

  async function createTodo(todo) {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos",
        {
          method: "POST",
          body: JSON.stringify(todo),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const newTodo = await response.json();
      printTodo(newTodo);
    } catch (error) {
      alertError(error);
    }
  }

  async function toggleTodoComplete(todoId, completed) {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todoId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ completed }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to connect with server. Please try later!");
      }
    } catch (error) {
      alertError(error);
    }
  }

  async function deleteTodo(todoId) {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todoId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        removeTodo(todoId);
      }
    } catch (error) {
      console.log(error);
    }
  }
})();
