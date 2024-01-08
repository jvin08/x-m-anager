import { FC } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Todos from "./pages/Todos";
import TodoDetails from "./pages/TodoDetails";
import TodoEdit from "./pages/TodoEdit";
import FormNewTodo from "./pages/FormNewTodo";
import { TodoProvider } from "./contexts/todoContext";
import GlobalStyle from "./GlobalStyle";

const App: FC = () => {
  return (
    <Router>
      <GlobalStyle />

      <TodoProvider>
        <Routes>
          <Route path="/" element={<Todos />} />
          <Route path="/todo/:id" element={<TodoDetails />} />
          <Route path="/todoEdit/:id" element={<TodoEdit />} />
          <Route path="/newTodo" element={<FormNewTodo />} />
        </Routes>
      </TodoProvider>
    </Router>
  );
};

export default App;
