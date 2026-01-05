import { createFileRoute } from "@tanstack/react-router";
import { Todo } from "@/models/todo.model";
import { connectDB } from "@/lib/db";

export const Route = createFileRoute("/api/todos/$todoId")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        await connectDB();

        const todo = await Todo.findById(params.todoId);

        return new Response(
          JSON.stringify({
            status: "success",
            data: {
              todo,
            },
          })
        );
      },

      PUT: async ({ params, request }) => {
        await connectDB();

        const body = await request.json();

        const updatedTodo = await Todo.findByIdAndUpdate(
          params.todoId,
          {
            $set: {
              title: body.title,
            },
          },
          { new: true }
        );

        if (!updatedTodo) {
          return new Response(
            JSON.stringify({
              status: "failure",
              message: "Todo was not found!",
            })
          );
        }

        return new Response(
          JSON.stringify({
            status: "success",
            data: {
              updatedTodo,
            },
          })
        );
      },

      PATCH: async ({ params, request }) => {
        await connectDB();

        const body = await request.json();

        const updatedTodo = await Todo.findByIdAndUpdate(
          params.todoId,
          {
            $set: {
              completed: body.completed,
            },
          },
          { new: true }
        );

        if (!updatedTodo) {
          return new Response(
            JSON.stringify({
              status: "failure",
              message: "Todo was not found!",
            })
          );
        }

        return new Response(
          JSON.stringify({
            status: "success",
            data: {
              updatedTodo,
            },
          })
        );
      },

      DELETE: async ({ params }) => {
        await connectDB();

        const deletedTodo = await Todo.findByIdAndDelete(params.todoId);

        if (!deletedTodo) {
          return new Response(
            JSON.stringify({
              status: "failure",
              message: "Todo was not found!",
            })
          );
        }

        return new Response(
          JSON.stringify({
            status: "success",
          })
        );
      },
    },
  },
});
