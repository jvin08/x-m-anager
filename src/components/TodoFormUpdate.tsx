import { useState, FormEvent, ChangeEvent, MouseEvent } from "react";
import { useTodo } from "../contexts/todoContext";
import SelectLevels from "./SelectLevels";
import CustomTitle from "./CustomTitle";
import CustomButton from "./CustomButton";
import { uid } from "uid";
import {
  Input,
  Button,
  SubBoxRight,
  SubBoxLeft,
  TimeBox,
  CheckForm,
  ButtonStyle,
  AddTasksBox,
  selectStyle
} from "./TodoForm.styles";
import CheckListForm from "./CheckListForm";

type Todo = {
  name: string;
  priority: number;
  complexity: number;
  date: string;
  time: string;
  checkList: CheckItem[];
  tags: string;
};

type CheckItem = {
  name: string;
  id: string;
  isCompleted: boolean;
};

type UseTodo = {
  updateTodo: (todo: Todo) => void;
};

function TodoFormUpdate({ todo }: { todo: Todo }) {
  const { updateTodo } = useTodo() as UseTodo;
  const [name, setName] = useState(todo.name);
  const [priority, setPriority] = useState(todo.priority);
  const [complexity, setComplexity] = useState(todo.complexity);
  const [date, setDate] = useState(todo.date);
  const [time, setTime] = useState(todo.time);
  const [checkList, setCheckList] = useState(todo.checkList);
  const [checkListValue, setCheckListValue] = useState("");
  const [tags, setTagValue] = useState(todo.tags);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name) return;
    updateTodo({
      ...todo,
      name,
      complexity,
      date,
      time,
      priority,
      tags,
      checkList
    });
  };
  const handlePriority = (value: string) => {
    setPriority(Number(value));
  };
  const handleComplexity = (value: string) => {
    setComplexity(Number(value));
  };
  const handleDate = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setDate(e.target.value);
  };
  const handleTime = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setTime(e.target.value);
  };
  const handleCheckList = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const checkItem = {
      name: checkListValue,
      id: uid(4),
      isCompleted: false
    };
    const newCheckList = [...checkList, checkItem];

    setCheckList(newCheckList);
    setCheckListValue("");
  };
  const deleteCheckItem = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const id = (e.target as HTMLButtonElement).dataset.delete;
    const newCheckList = checkList.filter((item) => item.id !== id);
    setCheckList(newCheckList);
  };
  const updateCheckList = (id: string, value: string) => {
    const newCheckList = checkList.map((item) => {
      if (item.id === id) {
        item.name = value;
        return item;
      }
      return item;
    });
    setCheckList(newCheckList);
  };

  return (
    <AddTasksBox>
      <CustomTitle name="Task Name" />
      <Input
        type="text"
        className="input"
        value={name}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        placeholder="Name of Task"
      />
      <SelectLevels
        name="Set Priority Level"
        eventHandler={handlePriority}
        currentLevel={priority}
      />
      <SelectLevels
        name="Set Complexity Level"
        currentLevel={complexity}
        eventHandler={handleComplexity}
      />
      <TimeBox>
        <SubBoxLeft>
          <CustomTitle name="Select Due Date" />
          <Input
            type="date"
            value={date}
            onChange={handleDate}
            style={selectStyle}
          />
        </SubBoxLeft>
        <SubBoxRight>
          <CustomTitle name="Select Due Time" />
          <Input
            onChange={handleTime}
            type="time"
            value={time}
            style={selectStyle}
          />
        </SubBoxRight>
      </TimeBox>
      <CustomTitle name="Add Checklist" />
      <CheckForm onSubmit={handleCheckList}>
        <Input
          type="text"
          className="input"
          value={checkListValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setCheckListValue(e.target.value)
          }
          placeholder="Add Item..."
        />
        <Button type="submit" onClick={handleCheckList}>
          +
        </Button>
      </CheckForm>
      {checkList.map((item) => {
        return (
          <CheckListForm
            key={item.id}
            id={item.id}
            value={item.name}
            deleteCheckItem={deleteCheckItem}
            updateCheckList={updateCheckList}
          />
        );
      })}
      <CustomTitle name="Add Tags" />
      <Input
        type="text"
        className="input"
        value={tags}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setTagValue(e.target.value)
        }
        placeholder="Tag 1, Tag 2, Tag 3..."
      />
      <CustomButton
        name="Save Task"
        {...ButtonStyle}
        type="button"
        handleClick={(e: MouseEvent<HTMLButtonElement>) => handleSubmit(e)}
      />
    </AddTasksBox>
  );
}

export default TodoFormUpdate;
