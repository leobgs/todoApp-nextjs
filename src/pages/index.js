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
      const response = await axios.get("/api/todos");
      const todosWithFormattedDueDate = response.data.map((todo) => ({
        ...todo,
        dueDate: todo.dueDate
          ? new Date(todo.dueDate).toISOString().substr(0, 10)
          : "",
      }));
      setTodos(todosWithFormattedDueDate);
    }
    fetchTodos();
  }, []);

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : "";
  };

  const addTodo = async () => {
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
      setTodos([
        ...todos,
        { _id, title, completed, dueDate: formattedDueDate },
      ]);
      setNewTodo("");
      setDueDate("");
      toast.success("To-Do added successfully");
    } catch (error) {
      toast.error("Failed to add To-Do");
    }
  };

  const updateTodo = async (id, updates) => {
    try {
      const response = await axios.put(`/api/todos/${id}`, updates);
      const formattedDueDate = formatDate(response.data.dueDate);
      setTodos(
        todos.map((todo) =>
          todo._id === id
            ? { ...response.data, dueDate: formattedDueDate }
            : todo
        )
      );
      toast.success("To-Do updated successfully");
    } catch (error) {
      toast.error("Failed to update To-Do");
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
      toast.success("To-Do deleted successfully");
    } catch (error) {
      toast.error("Failed to delete To-Do");
    }
  };

  const handleTitleChange = (id, title) => {
    updateTodo(id, { title });
  };

  const openEditModal = (todo) => {
    setSelectedTodo(todo);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
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
        <button className={styles.button} onClick={addTodo}>
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
                      updateTodo(todo._id, {
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
                      updateTodo(todo._id, {
                        completed: todo.completed,
                        dueDate: e.target.value,
                      })
                    }
                  />
                  <button
                    className={styles.deleteButton}
                    onClick={() => deleteTodo(todo._id)}
                  >
                    Delete
                  </button>
                  <button
                    className={styles.editButton}
                    onClick={() => openEditModal(todo)}
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
        onRequestClose={closeEditModal}
        todo={selectedTodo}
        onUpdate={(id, title) => handleTitleChange(id, title)}
      />
    </div>
  );
}
