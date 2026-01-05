import { createFileRoute } from "@tanstack/react-router";
import { Todo } from "@/models/todo.model";
import { connectDB } from "@/lib/db";

export const Route = createFileRoute("/api/todos")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        await connectDB();

        const url = new URL(request.url);

        // Extract params
        const filter = url.searchParams.get("filter") || "";
        const status = url.searchParams.get("status") || "all";
        const page = parseInt(url.searchParams.get("page") || "1");
        const pageSize = parseInt(url.searchParams.get("pageSize") || "5");

        // Build MongoDB Query
        const query: any = {};
        if (filter) query.title = { $regex: filter, $options: "i" };
        if (status === "completed") query.completed = true;
        if (status === "active") query.completed = false;

        const skip = (page - 1) * pageSize;

        // Execute both queries in parallel for performance
        const [todos, total] = await Promise.all([
          Todo.find(query).sort({ updatedAt: -1 }).skip(skip).limit(pageSize),
          Todo.countDocuments(query),
        ]);

        const pages = Math.ceil(total / pageSize);

        return new Response(
          JSON.stringify({
            status: "success",
            data: { todos, total, page, pages },
          })
        );
      },

      POST: async ({ request }) => {
        await connectDB();

        const body = await request.json();

        const todo = await new Todo(body).save();
        return new Response(
          JSON.stringify({
            status: "success",
            data: {
              todo,
            },
          })
        );
      },
    },
  },
});
