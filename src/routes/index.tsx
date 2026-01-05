import { Edit2Icon, Trash2Icon } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Checkbox } from "@/components/ui/checkbox";
import { todoQueries } from "@/api/todo-queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { IResponse } from "@/lib/types";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import z from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useServerFn } from "@tanstack/react-start";
import { deleteTodoFn, updateTodoStatusFn } from "@/api/todo-fns";
import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import ToggleThemeButton from "@/components/theme/ToggleTheme";

const todoSearchSchema = z.object({
  filter: z.string().optional(),
  status: z.enum(["all", "completed", "active"]).catch("all"),
  page: z.number().catch(1),
  pageSize: z.number().catch(5), // Show 5 items per page
});

export const Route = createFileRoute("/")({
  validateSearch: todoSearchSchema,
  // We include page and pageSize in loaderDeps so the loader
  // refetches when the page changes
  loaderDeps: ({ search }) => search,
  loader: async ({ context: { queryClient }, deps }) => {
    return queryClient.ensureQueryData(todoQueries.all(deps));
  },
  component: App,
});

function App() {
  const toggleAction = useServerFn(updateTodoStatusFn);
  const queryClient = useQueryClient();
  const navigate = Route.useNavigate();
  const search = Route.useSearch();

  const { data } = useSuspenseQuery(todoQueries.all(search));
  const { todos, pages: totalPages } = data;

  const [isMounted, setIsMounted] = useState(false);

  const isNavigating = useRouterState({
    // Make sure to use state.navigation.status
    select: (state) => state.status === "pending",
  });

  // Only show the loading UI if we are mounted AND navigating
  const showLoadingOverlay = isMounted && isNavigating;

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  const onStatusChange = (newStatus: "all" | "completed" | "active") => {
    navigate({
      search: (prev) => ({
        ...prev,
        status: newStatus,
        page: 1,
      }),
    });
  };

  const handlePageChange = (newOffset: number) => {
    navigate({
      search: (prev) => ({
        ...prev,
        page: Math.max(1, prev.page + newOffset),
      }),
    });
  };

  const { mutate: toggleTodo } = useMutation({
    mutationFn: (variables: { id: string; completed: boolean }) =>
      toggleAction({ data: variables }),

    onMutate: async (newTodo) => {
      const queryKey = todoQueries.all(search).queryKey;

      // 1. Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // 2. Snapshot the WHOLE response object (including total, page, etc.)
      const previousResponse = queryClient.getQueryData<IResponse>(queryKey);

      // 3. Optimistically update
      queryClient.setQueryData<IResponse>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          todos: old.todos.map((todo) =>
            todo._id === newTodo.id
              ? { ...todo, completed: newTodo.completed }
              : todo
          ),
        };
      });

      // 4. Return the WHOLE object for rollback
      return { previousResponse };
    },

    onError: (_, __, context) => {
      // 5. Roll back using the full object
      if (context?.previousResponse) {
        queryClient.setQueryData(
          todoQueries.all(search).queryKey,
          context.previousResponse
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: todoQueries.all(search).queryKey,
      });
    },
  });

  const { mutate: deleteTodo } = useMutation({
    mutationFn: (variables: { id: string }) =>
      deleteTodoFn({ data: variables }),

    onMutate: async (newTodo) => {
      const queryKey = todoQueries.all(search).queryKey;

      // 1. Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // 2. Snapshot the WHOLE response object (including total, page, etc.)
      const previousResponse = queryClient.getQueryData<IResponse>(queryKey);

      // 3. Optimistically update
      queryClient.setQueryData<IResponse>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          todos: old.todos.filter((todo) => todo._id !== newTodo.id),
        };
      });

      // 4. Return the WHOLE object for rollback
      return { previousResponse };
    },

    onError: (_, __, context) => {
      // 5. Roll back using the full object
      if (context?.previousResponse) {
        queryClient.setQueryData(
          todoQueries.all(search).queryKey,
          context.previousResponse
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: todoQueries.all(search).queryKey,
      });

      // If we deleted the last item on the current page, go back a page
      if (todos.length === 0 && search.page > 1) {
        handlePageChange(-1);
      }
    },
  });

  // 1. Create local state initialized from the URL
  const [localFilter, setLocalFilter] = useState(search.filter ?? "");

  // 2. Sync Local State -> URL (Debounced)
  useEffect(() => {
    // If local state already matches URL, do nothing
    if (localFilter === (search.filter ?? "")) return;

    const handler = setTimeout(() => {
      navigate({
        search: (prev) => ({
          ...prev,
          filter: localFilter || undefined,
          page: 1, // Reset to page 1 when searching!
        }),
        replace: true,
      });
    }, 500); // 500ms delay

    return () => clearTimeout(handler); // Cleanup if user types again before 500ms
  }, [localFilter, navigate, search.filter]);

  // 3. Sync URL -> Local State (For Back/Forward browser buttons)
  useEffect(() => {
    setLocalFilter(search.filter ?? "");
  }, [search.filter]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="container space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl tracking-wider">Our Todo</h1>
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <ToggleThemeButton />
          <Button variant="outline" asChild>
            <Link to="/todos/new">Add Todo</Link>
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4 md:flex-row items-center justify-between">
        <Input
          type="search"
          placeholder="Filter todos..."
          // Use the local state here
          value={localFilter}
          onChange={(e) => setLocalFilter(e.target.value)}
          className="w-full md:max-w-sm"
        />
        <Select
          onValueChange={(value) => {
            onStatusChange(value as "all" | "completed" | "active");
          }}
        >
          <SelectTrigger className="w-full md:w-45">
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="active">Active</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-hidden rounded-md border">
        {/* 2. Add a loading spinner overlay (Optional but nice) */}
        {showLoadingOverlay && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/20 backdrop-blur-[1px]">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        )}
        <div
          className={
            showLoadingOverlay
              ? "opacity-50 blur-[2px] transition-all duration-300 pointer-events-none"
              : "transition-all duration-300"
          }
        >
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Status</TableHead>
                <TableHead>Todo Title</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead className="w-0">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todos?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-amber-400">
                    No Todos To Show!
                  </TableCell>
                </TableRow>
              ) : (
                todos?.map((todo) => {
                  return (
                    <TableRow
                      key={todo._id}
                      onClick={async (event) => {
                        const target = event.target as HTMLElement;
                        if (target.closest("[data-actions]")) return;

                        toggleTodo({
                          id: todo._id,
                          completed: !todo.completed,
                        });
                      }}
                    >
                      <TableCell>
                        <Checkbox checked={todo.completed} />
                      </TableCell>
                      <TableCell>{todo.title}</TableCell>
                      <TableCell>
                        {formatDate(todo.createdAt.toString())}
                      </TableCell>
                      <TableCell>
                        {formatDate(todo.updatedAt.toString())}
                      </TableCell>
                      <TableCell data-actions>
                        <div className="flex items-center justify-end gap-1">
                          <Button variant={"ghost"} size={"icon-sm"} asChild>
                            <Link
                              to="/todos/$todoId/edit"
                              params={{ todoId: todo._id }}
                            >
                              <Edit2Icon />
                            </Link>
                          </Button>
                          <Button
                            variant={"ghost"}
                            size={"icon-sm"}
                            onClick={(e) => {
                              // Double-check it doesn't trigger the row click
                              e.stopPropagation();
                              deleteTodo({ id: todo._id });
                            }}
                          >
                            <Trash2Icon />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <div className="text-muted-foreground flex-1 text-sm">
          {completedCount} of {totalCount} todo(s) confirmed.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(-1)}
            disabled={search.page <= 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={search.page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
