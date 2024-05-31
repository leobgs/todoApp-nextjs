import connectToDatabase from "../../../lib/mongodbConnect";
import Todo from "../../../models/Todo";

export default async function handler(req, res) {
  try {
    await connectToDatabase();

    if (req.method === "GET") {
      return handleGetRequest(res);
    } else if (req.method === "POST") {
      return handlePostRequest(req, res);
    } else {
      return handleUnsupportedMethod(res);
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleGetRequest(res) {
  try {
    const todos = await Todo.find({});
    return res.status(200).json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    return res.status(500).json({ error: "Error fetching todos" });
  }
}

async function handlePostRequest(req, res) {
  const { title, dueDate } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const newTodo = new Todo({
      title,
      dueDate,
    });
    await newTodo.save();
    return res.status(201).json(newTodo);
  } catch (error) {
    console.error("Error creating todo:", error);
    return res.status(500).json({ error: "Error creating todo" });
  }
}

function handleUnsupportedMethod(res) {
  return res.status(405).end();
}
