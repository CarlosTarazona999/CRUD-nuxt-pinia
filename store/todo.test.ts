import { setActivePinia, createPinia } from "pinia";
import {
  describe,
  test,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
} from "vitest";
import { useTodoStore } from "./todo";

function getFirstId(store: ReturnType<typeof useTodoStore>) {
  return store.items[0].id;
}

beforeAll(() => {
  // creates a fresh pinia and make it active so it's automatically picked
  // up by any useStore() call without having to pass it to it:
  // `useStore(pinia)`
  setActivePinia(createPinia());
});

describe("initializes", () => {
  test("works", () => {
    expect(true).toBe(true);
  });
});

describe("useTodoStore", () => {
  let store: ReturnType<typeof useTodoStore>;

  beforeEach(() => {
    store = useTodoStore();
  });

  afterEach(() => {
    store.$reset();
  });

  test("references a store", () => {
    expect(store).toBeDefined();
  });

  test("has empty todos on init", () => {
    expect(store.items).toStrictEqual([]);
  });

  test("adds a todo", () => {
    store.add({
      title: "Test my code",
    });
    expect(store.items).toStrictEqual([
      {
        id: expect.any(String),
        title: "Test my code",
        done: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    ]);
  });

  test("gets todo by id", () => {
    store.add({ title: "Test" });
    const id = getFirstId(store);
    const item = store.getTodoById(id);
    expect(item.title).toStrictEqual("Test");
  });

  test("gets ordered items without mutating original", async () => {
    const items = [
      {
        createdAt: new Date(2021, 1, 22),
      },
      {
        createdAt: new Date(2023, 1, 22),
      },
      {
        createdAt: new Date(2020, 1, 22),
      },
      {
        createdAt: new Date(1994, 1, 22),
      },
    ];
    //@ts-ignore
    store.items = items;
    const sortedItems = store.getSortedTodos;

    expect(sortedItems[0].createdAt.getFullYear()).toBe(1994);
    expect(sortedItems[1].createdAt.getFullYear()).toBe(2020);
    expect(sortedItems[2].createdAt.getFullYear()).toBe(2021);
    expect(sortedItems[3].createdAt.getFullYear()).toBe(2023);
    expect(store.items[0].createdAt.getFullYear()).toBe(2021);
  });

  test("delete a todo", () => {
    store.add({ title: "Delete me" });
    const id = getFirstId(store);
    store.remove(id);
    expect(store.items).toStrictEqual([]);
  });

  test("updates a todo done", () => {
    store.add({ title: "Edit me" });
    const id = getFirstId(store);
    store.update(id, { done: true });
    expect(store.getTodoById(id).done).toBe(true);
  });

  test("update a todo title", () => {
    store.add({ title: "Edit me" });
    const id = getFirstId(store);
    store.update(id, { title: "Edited" });
    expect(store.getTodoById(id).title).toBe("Edited");
  });
});
