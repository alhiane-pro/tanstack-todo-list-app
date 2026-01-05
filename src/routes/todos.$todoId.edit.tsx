import { createFileRoute, Link } from "@tanstack/react-router";
import axiosErrorHandler, { getBaseUrl } from "@/lib/utils";
import TodoForm from "@/components/forms/TodoForm";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { ITodo } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";

interface IResponse {
  status: "success" | "failure";
  data: {
    todo: ITodo;
  };
}

export const getTodoById = async (todoId: string): Promise<ITodo> => {
  try {
    const response = await axios.get<IResponse>(
      `${getBaseUrl()}/api/todos/${todoId}`
    );
    return response.data.data.todo;
  } catch (error) {
    throw new Error(axiosErrorHandler(error));
  }
};

export const Route = createFileRoute("/todos/$todoId/edit")({
  component: RouteComponent,
  loader: async ({ params }) => await getTodoById(params.todoId),
});

function RouteComponent() {
  const todo = Route.useLoaderData();

  return (
    <div className="container space-y-2">
      <Button
        asChild
        variant={"ghost"}
        size={"sm"}
        className="text-muted-foreground"
      >
        <Link to={"/"} search={{ status: "all", page: 1, pageSize: 5 }}>
          <ArrowLeftIcon /> Todo List
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Edit Todo</CardTitle>
          <CardDescription>
            Update the details of your todo item
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TodoForm todo={todo} />
        </CardContent>
      </Card>
    </div>
  );
}
