import { Link } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import TodoForm from "../components/TodoForm";
import { FC } from "react";

import {
  Container,
  Title,
  Header,
  linkStyle,
  arrowStyle
} from "../components/Pages.styles";

const FormNewTodo: FC = () => {
  return (
    <Container>
      <Header>
        <Link to="/" style={linkStyle}>
          <IoMdArrowBack style={arrowStyle} />
        </Link>
        <Title>Add New Task</Title>
      </Header>
      <TodoForm />
    </Container>
  );
};

export default FormNewTodo;
