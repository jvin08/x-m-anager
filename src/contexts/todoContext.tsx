import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  MouseEvent
} from "react";
import { useNavigate } from "react-router-dom";
import { uid } from "uid";
export const TodoContext = createContext<TodoContextValue>(
  {} as TodoContextValue
);

export function useTodo() {
  const value = useContext(TodoContext);
  return value;
}

type Todo = {
  name: string;
  isCompleted: boolean;
  id: string;
  percent: number;
  complexity: number;
  date: string;
  time: string;
  priority: number;
  tags: string;
  checkList: CheckItem[];
};
type CheckItem = {
  name: string;
  id: string;
  isCompleted: boolean;
};
type TodoContextValue = {
  todos: Todo[];
  sortType: string;
  filters: Filter[];
  search: string;
  powerMode: boolean;
  getTodo(id: string): Todo | undefined;
  handlePowerMode(): Todo[] | undefined;
  generateFilters: (prevTodos: Todo[]) => Filter[];
  getFilteredTodos: (todosArr: Todo[]) => Todo[];
  getLevelText: (level: number) => string;
  handleFilter: (filterName: string) => void;
  handleSortType: (sortName: string) => void;
  sortTodos: (todos: Todo[]) => Todo[];
  searchTodos: () => Todo[];
  addTodo: (
    value: string,
    complexity: number,
    date: string,
    time: string,
    priority: number,
    tagValue: string,
    checkList: CheckItem[]
  ) => void;
  updateTodo: (todo: Todo) => void;
  handleSearch: (searchTerm: string) => void;
  completeTodo: (id: string) => void;
  dueDateColor: (todo: Todo) => string;
  dateStyle: (todo: Todo) => string;
  removeTodo: (
    e: MouseEvent,

    todo: Todo
  ) => void;
  handleCheck: (e: MouseEvent, todo: Todo) => void;
  resetStatus: (e: MouseEvent, todo: Todo) => void;
  getTodoStore: () => void;
  togglePowerMode: () => void;
};

type Filter = {
  name: string;
  checked: boolean;
};

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState(
    JSON.parse(window.localStorage.getItem("todos")) || []
  );
  const [sortType, setSortType] = useState("Default");
  const [filters, setFilters] = useState(generateFilters(todos));
  const [search, setSearch] = useState("");
  const [powerMode, setPowerMode] = useState(false);
  const navigate = useNavigate();

  function generateFilters(prevTodos: Todo[]) {
    let allFilters = prevTodos.map((t) => {
      return { name: t.tags, checked: false };
    });
    return allFilters;
  }
  const getFilteredTodos = (todosArr: Todo[]) => {
    let checkedFilters = filters.filter((f) => f.checked).map((f) => f.name);
    return checkedFilters.length
      ? todosArr.filter((todo) => checkedFilters.includes(todo.tags))
      : todosArr;
  };

  const getLevelText = (level: number) => {
    const levelNumber = Number(level);
    const customText =
      levelNumber > 6
        ? `High (${levelNumber}/10)`
        : levelNumber > 4
        ? `Moderate(${levelNumber}/10)`
        : `Low(${levelNumber}/10)`;
    return customText;
  };

  const handleFilter = (filterName: string) => {
    const updatedFilters = filters.map((f) =>
      f.name === filterName ? { ...f, checked: !f.checked } : f
    );
    setFilters(updatedFilters);
  };

  const handleSortType = (sortName: string) => {
    setSortType(sortName);
  };

  const sortTodos = (todos: Todo[]) => {
    if (sortType.split(" ")[0] === "Ascending") {
      return [...todos].sort(
        (a, b) =>
          Number(new Date(a[sortType.split(" ")[1]])) -
          Number(new Date(b[sortType.split(" ")[1]]))
      );
    } else if (sortType.split(" ")[0] === "Descending") {
      return [...todos].sort(
        (a, b) =>
          Number(new Date(b[sortType.split(" ")[1]])) -
          Number(new Date(a[sortType.split(" ")[1]]))
      );
    } else {
      return todos;
    }
  };

  const addTodo = (
    value: string,
    complexity: number,
    date: string,
    time: string,
    priority: number,
    tagValue: string,
    checkList: CheckItem[]
  ) => {
    const newTodos = [
      ...todos,
      {
        name: value,
        isCompleted: false,
        id: uid(6),
        percent: 0,
        complexity: complexity,
        date: date,
        time: time,
        priority: priority,
        tags: tagValue,
        checkList: checkList
      }
    ];
    setTodos(newTodos);
    updateTodoStore(newTodos);
  };
  const updateTodo = ({
    id,
    name,
    complexity,
    date,
    time,
    priority,
    tags,
    checkList,
    isCompleted,
    percent
  }) => {
    const updatedTodo = {
      id,
      name,
      isCompleted,
      percent,
      complexity,
      date,
      time,
      priority,
      tags,
      checkList
    };

    const oldTodos = todos.filter((t: any) => t.id !== updatedTodo.id);
    const updatedTodos = [...oldTodos, updatedTodo];
    setTodos(updatedTodos);
    updateTodoStore(updatedTodos);
    navigate("/");
  };
  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
  };
  const completeTodo = (id: string) => {
    const updatedTodos = todos.map((t) =>
      t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
    );
    setTodos(updatedTodos);
    updateTodoStore(updatedTodos);
  };
  const dueDateColor = (todo: Todo) => {
    const timeRemained =
      Number(new Date(todo.date + " " + todo.time)) - Number(new Date());
    return timeRemained > 259200000
      ? "RoyalBlue"
      : timeRemained > 86400000
      ? "Orange"
      : "OrangeRed";
  };
  const dateStyle = (todo: Todo) => {
    var date = new Date(todo.date + " " + todo.time);

    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true
    });
  };
  const removeTodo = (e: MouseEvent<HTMLButtonElement>, todo: Todo) => {
    const updatedTodos = todos.filter((t: Todo) => t.id !== todo.id);
    setTodos(updatedTodos);
    updateTodoStore(updatedTodos);
    navigate("/");
  };
  const handleCheck = (e: MouseEvent<HTMLButtonElement>, todoOld: Todo) => {
    e.preventDefault();
    interface DataElement extends Element {
      dataset: DOMStringMap;
    }
    const commonAncestor = e.currentTarget.closest(
      "[data-check]"
    ) as DataElement;
    const checkId = commonAncestor.dataset.check;
    const updatedTodo = updateTodoCheckList(todoOld, checkId);
    updatedTodo.percent = calculatePercent(updatedTodo);
    const updatedTodos = todos.filter((todo: Todo) => todo.id !== todoOld.id);
    setTodos([...updatedTodos, updatedTodo]);
    updateTodoStore([...updatedTodos, updatedTodo]);
  };

  const calculatePercent = ({ checkList }: { checkList: CheckItem[] }) => {
    if (!checkList.length) {
      return 0;
    } else {
      let percent = 0;
      let oneItemPercentage = checkList.length ? 100 / checkList.length : null;
      for (let i = 0; i < checkList.length; i++) {
        if (checkList[i].isCompleted) {
          percent += oneItemPercentage;
        }
      }
      return Math.round(percent);
    }
  };
  const getTodo = (id: string): Todo | undefined => {
    return todos.find((todo: Todo) => todo.id === id);
  };

  const resetStatus = (e: MouseEvent<HTMLButtonElement>, todo: Todo) => {
    e.preventDefault();
    const resetCheckListStatus = todo.checkList.map((item) => {
      item.isCompleted = false;
      return item;
    });
    todo.checkList = resetCheckListStatus;
    todo.percent = 0;
    const updatedTodos = todos.filter((t: Todo) => t.id !== todo.id);
    setTodos([...updatedTodos, todo]);
    updateTodoStore([...updatedTodos, todo]);
  };

  const updateTodoCheckList = (todo: Todo, id: string) => {
    const todoCopy = todo;
    const updatedTodoCheckList = todoCopy.checkList.map((item) => {
      if (item.id === id) {
        item.isCompleted = !item.isCompleted;
      }
      return item;
    });
    todoCopy.checkList = updatedTodoCheckList;
    return todoCopy;
  };

  const searchTodos = () => {
    if (!search) {
      return todos;
    } else {
      return todos.filter((todo: Todo) => todo.name.includes(search));
    }
  };
  const togglePowerMode = () => {
    todos.length > 1 && setPowerMode((prev) => !prev);
  };
  const handlePowerMode = () => {
    let firstTodo: Todo;
    let biggestScore = 0;
    todos.forEach((t: Todo) => {
      if (t.priority + t.complexity > biggestScore) {
        firstTodo = t;
        biggestScore = t.priority + t.complexity;
      }
    });
    return [firstTodo];
  };

  const updateTodoStore = (todos: Todo[]) => {
    window.localStorage.removeItem("todos");
    window.localStorage.setItem("todos", JSON.stringify(todos));
  };

  const getTodoStore = () => {
    setTodos(JSON.parse(window.localStorage.getItem("todos")));
  };

  useEffect(() => {
    setFilters(generateFilters(todos));
  }, [todos]);

  const value: TodoContextValue = {
    todos,
    generateFilters,
    addTodo,
    completeTodo,
    removeTodo,
    getTodo,
    searchTodos,
    handleSortType,
    search,
    filters,
    handleFilter,
    updateTodo,
    getLevelText,
    handleCheck,
    resetStatus,
    dueDateColor,
    dateStyle,
    getFilteredTodos,
    getTodoStore,
    handleSearch,
    sortTodos,
    sortType,
    handlePowerMode,
    powerMode,
    togglePowerMode
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
