<script lang="ts" setup>
//import const useTodoStore
import { useTodoStore } from "./store/todo";
//create an object
const todoStore = useTodoStore();
//It allows us to obtain a direct reference to a specific DOM element
//or child component instance after it's mounted.
const newTodo = ref("");
const error = ref(false);
todoStore.$subscribe((_, state) => {
  //while localstorage exists
  if (typeof window.localStorage !== "undefined") {
    //converts a JavaScript object or value to a JSON string, then save on local storage
    localStorage.todo_state = JSON.stringify(state);
  }
});
//Registers a callback to be called after the component has been mounted.
onMounted(() => {
  //while localstorage exists
  if (typeof window.localStorage !== "undefined") {
    //read item of LocalStorage"todo_state",then convert to a Json string, finally, save on state of our todoStore
    todoStore.$state = JSON.parse(localStorage.getItem("todo_state"));
  }
});
//With Options API, we can use the option to trigger a function whenever a reactive property changes
//whenever error changes, this function will run
watch(error, (value: boolean) => {
  if (value) {
    // method sets a timer which executes a function or specified piece of code once the timer expires.
    setTimeout(() => {
      error.value = false;
    }, 500);
  }
});
const saveNewTodo = () => {
  if (!newTodo.value) {
    error.value = true;
    return;
  }
  todoStore.add({
    title: newTodo.value,
  });
  newTodo.value = "";
};
</script>

<template>
  <main class="bg-gray-100 pt-18 min-h-screen">
    <section class="text-center py-10">
      <h1 class="text-5xl font-bold text-gray-700">¿Qué tareas haremos hoy?</h1>
    </section>
    <section class="md:w-8/12 md:mx-auto lg:w-6/12 py-4 rounded-lg">
      <todo-input v-model="newTodo" @save="saveNewTodo" :error="error" />
      <todo-list :items="todoStore.getSortedTodos.reverse()" />
    </section>
  </main>
</template>