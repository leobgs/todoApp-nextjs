import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../styles/Home.module.css";
import EditModal from "../components/EditModal";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);

  useEffect(() => {
    async function fetchTodos() {
      try {
        const response = await axios.get("/api/todos");
        const todosWithFormattedDueDate = response.data.map((todo) => ({
          ...todo,
          dueDate: todo.dueDate
            ? new Date(todo.dueDate).toISOString().substr(0, 10)
            : "",
        }));
        setTodos(todosWithFormattedDueDate);
      } catch (error) {
        toast.error("Failed to fetch todos");
      }
    }
    fetchTodos();
  }, []);

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : "";
  };

  const handleAddTodo = async () => {
    if (newTodo.trim() === "") {
      toast.error("Title is required");
      return;
    }
    try {
      const response = await axios.post("/api/todos", {
        title: newTodo,
        dueDate,
      });
      const { _id, title, completed, dueDate: newDueDate } = response.data;
      const formattedDueDate = formatDate(newDueDate);
      setTodos((prevTodos) => [
        ...prevTodos,
        { _id, title, completed, dueDate: formattedDueDate },
      ]);
      setNewTodo("");
      setDueDate("");
      toast.success("To-Do added successfully");
    } catch (error) {
      toast.error("Failed to add To-Do");
    }
  };

  const handleUpdateTodo = async (id, title) => {
    try {
      await axios.put(`/api/todos/${id}`, { title });
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo._id === id ? { ...todo, title } : todo))
      );
      toast.success("To-Do updated successfully");
    } catch (error) {
      toast.error("Failed to update To-Do");
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
      toast.success("To-Do deleted successfully");
    } catch (error) {
      toast.error("Failed to delete To-Do");
    }
  };

  const handleOpenEditModal = (todo) => {
    setSelectedTodo(todo);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setSelectedTodo(null);
    setEditModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <h1>To-Do List</h1>
      <div className={styles.inputContainer}>
        <input
          type="text"
          className={styles.input}
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new to-do"
        />
        <label htmlFor="dueDateInput">Due Date:</label>
        <input
          type="date"
          className={styles.input}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          placeholder="Add a new to-do"
        />
        <button className={styles.button} onClick={handleAddTodo}>
          Add
        </button>
      </div>

      {todos.length === 0 ? (
        <p className={styles.emptyMessage}>No to-do items</p>
      ) : (
        <table className={styles.todoTable}>
          <thead>
            <tr>
              <th>Mark as Complete</th>
              <th>Todos</th>
              <th>Due Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr
                key={todo._id}
                className={`${styles.todoItem} ${
                  todo.completed ? styles.completed : ""
                }`}
              >
                <td>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={todo.completed}
                    onChange={() =>
                      handleUpdateTodo(todo._id, {
                        completed: !todo.completed,
                        dueDate: todo.dueDate,
                      })
                    }
                  />
                </td>
                <td>{todo.title}</td>
                <td>
                  {todo.dueDate
                    ? new Date(todo.dueDate).toLocaleDateString()
                    : ""}
                </td>
                <td>
                  <input
                    type="date"
                    className={styles.input}
                    value={todo.dueDate || ""}
                    onChange={(e) =>
                      handleUpdateTodo(todo._id, {
                        completed: todo.completed,
                        dueDate: e.target.value,
                      })
                    }
                  />
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteTodo(todo._id)}
                  >
                    Delete
                  </button>
                  <button
                    className={styles.editButton}
                    onClick={() => handleOpenEditModal(todo)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <EditModal
        isOpen={editModalOpen}
        onRequestClose={handleCloseEditModal}
        todo={selectedTodo}
        onUpdate={handleUpdateTodo}
      />
    </div>
  );
}
