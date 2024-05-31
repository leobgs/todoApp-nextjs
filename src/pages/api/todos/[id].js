import connectToDatabase from "../../../lib/mongodbConnect";
import Todo from "../../../models/Todo";

export default async function handler(req, res) {
  try {
    await connectToDatabase();
    const { id } = req.query;

    if (req.method === "PUT") {
      return handlePutRequest(req, res, id);
    } else if (req.method === "DELETE") {
      return handleDeleteRequest(res, id);
    } else {
      return handleUnsupportedMethod(res);
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handlePutRequest(req, res, id) {
  try {
    const { title, completed, dueDate } = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, completed, dueDate },
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    return res.status(200).json(updatedTodo);
  } catch (error) {
    console.error("Error updating todo:", error);
    return res.status(500).json({ error: "Error updating todo" });
  }
}

async function handleDeleteRequest(res, id) {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    return res.status(204).end();
  } catch (error) {
    console.error("Error deleting todo:", error);
    return res.status(500).json({ error: "Error deleting todo" });
  }
}

function handleUnsupportedMethod(res) {
  return res.status(405).end();
}
