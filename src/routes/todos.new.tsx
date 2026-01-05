import { createFileRoute, Link } from "@tanstack/react-router";
import TodoForm from "@/components/forms/TodoForm";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/todos/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container space-y-4">
      <Button
        asChild
        variant={"ghost"}
        size={"sm"}
        className="text-muted-foreground"
      >
        <Link to="/" search={{ status: "all", page: 1, pageSize: 5 }}>
          <ArrowLeftIcon /> Todo List
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Add New Todo</CardTitle>
          <CardDescription>
            {" "}
            Create a new task to add to your todo list
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TodoForm />
        </CardContent>
      </Card>
    </div>
  );
}
