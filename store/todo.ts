import { defineStore } from "pinia";
import { v4 as uuid } from "uuid";

//create interface Todo
export interface Todo {
  id: string;
  title: string;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
}
//create type Todos as array of Todo
export type Todos = Todo[] | undefined[];

//create interface TodoAdd
export interface TodoAdd {
  title: string;
}
//create interface TodoUpdate
export interface TodoUpdate {
  title?: string;
  done?: boolean;
}
//create interface TodoState
interface TodoState {
  items: Todos;
}
//create parameter's list state as list each array of items
const state = (): TodoState => ({
  items: [],
});

const getters = {
  getTodoById: (state: TodoState) => {
    return (id: string) =>
      state.items.find((item) => !!item && (item as Todo).id === id);
  },
  getSortedTodos: (state: TodoState) => {
    return [...state.items].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  },
};
//using Pinia to defineStore
export const useTodoStore = defineStore("todoStore", {
  state,
  getters,
  actions: {
    //create method add using interface TodoAdd
    add(todo: TodoAdd) {
      const id = uuid();
      const itemToAdd = {
        id,
        ...todo,
        done: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.items.push(itemToAdd);
    },
    //create method remove using parameter id
    remove(id: string) {
      //using filter of rest of them items, then save on items
      this.items = this.items.filter((item) => item.id !== id);
    },
    //create method update using parameter id and interface TodoUpdate
    update(id: string, update: TodoUpdate) {
      const items = this.items as Todos;
      const index = items.findIndex(
        //item not null and id equal to Todo item
        (item) => !!item && (item as Todo).id === id
      );
      items[index] = {
        ...items[index],
        ...update,
        updatedAt: new Date(),
      };
    },
  },
});
