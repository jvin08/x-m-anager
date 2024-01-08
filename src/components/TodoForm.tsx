import { useState, FormEvent, ChangeEvent, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
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

type UseTodo = {
  addTodo: (
    value: string,
    priority: number,
    complexity: number,
    date: string,
    time: string,
    tagValue: string,
    checkList: CheckItem[]
  ) => void;
};
type CheckItem = {
  name: string;
  id: string;
  isCompleted: boolean;
};

function TodoForm() {
  const [value, setValue] = useState("");
  const [priority, setPriority] = useState(0);
  const [complexity, setComplexity] = useState(0);
  const [date, setDate] = useState("2024-01-01");
  const [time, setTime] = useState("09:01");
  const [checkList, setCheckList] = useState<CheckItem[]>([]);
  const [checkListValue, setCheckListValue] = useState("");
  const [tagValue, setTagValue] = useState("");
  const { addTodo } = useTodo();
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!value) return;
    addTodo(value, complexity, date, time, priority, tagValue, checkList);
    setValue("");
    setPriority(0);
    setComplexity(0);
    setDate("2024-01-01");
    setTime("09:01");
    setTagValue("");
    setCheckList([]);
    navigate("/");
  };
  const handlePriority = (value: string) => {
    setPriority(Number(value));
  };
  const handleComplexity = (value: string) => {
    setComplexity(Number(value));
  };
  const handleDate = (e: ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };
  const handleTime = (e: ChangeEvent<HTMLInputElement>) => {
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
    const id = e.currentTarget.dataset.delete;
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
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Name of Task"
      />
      <SelectLevels
        name="Set Priority Level"
        eventHandler={handlePriority}
        currentLevel={1}
      />
      <SelectLevels
        name="Set Complexity Level"
        eventHandler={handleComplexity}
        currentLevel={1}
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
          onChange={(e) => setCheckListValue(e.target.value)}
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
        value={tagValue}
        onChange={(e) => setTagValue(e.target.value)}
        placeholder="Tag 1, Tag 2, Tag 3..."
      />
      <CustomButton
        name="Save Task"
        {...ButtonStyle}
        handleClick={(e: MouseEvent<HTMLButtonElement>) => handleSubmit(e)}
      />
    </AddTasksBox>
  );
}

export default TodoForm;
