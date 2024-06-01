import connectToDatabase from "../../../lib/mongodbConnect";
import Todo from "../../../models/Todo";

export default async function handler(req, res) {
  try {
    await connectToDatabase();
    const { id } = req.query;

    //   PUT Method
    if (req.method === "PUT") {
      const { title, completed, dueDate } = req.body;
      const updatedTodo = await Todo.findByIdAndUpdate(
        id,
        { title, completed, dueDate },
        { new: true }
      );
      if (!updatedTodo) {
        return res.status(404).json({ error: "Todo not found" });
      }
      res.status(200).json(updatedTodo);
    }
    // Delete Method
    else if (req.method === "DELETE") {
      const deletedTodo = await Todo.findByIdAndDelete(id);
      if (!deletedTodo) {
        return res.status(404).json({ error: "Todo not found" });
      }
      res.status(204).end();
    }
    // Method Not Allowed
    else {
      res.status(405).end();
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
