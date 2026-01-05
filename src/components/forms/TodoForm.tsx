import { useServerFn } from "@tanstack/react-start";
import { LoadingSwap } from "../ui/loading-swap";
import { useForm } from "@tanstack/react-form";
import { saveTodoFn } from "@/api/todo-fns";
import { FieldError } from "../ui/field";
import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ITodo } from "@/lib/types";
import * as z from "zod";

const formSchema = z.object({
  title: z
    .string()
    .min(5, "Todo title must have at least 5 characters!")
    .max(100, "Todo title musn't have more than 100 characters!"),
});

const TodoForm = ({ todo }: { todo?: ITodo }) => {
  const saveAction = useServerFn(saveTodoFn);

  const form = useForm({
    defaultValues: {
      title: todo?.title ?? "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      // Invalidate cache so the list refreshes
      // queryClient.invalidateQueries({ queryKey: ["todos"] });
      await saveAction({ data: { id: todo?._id, title: value.title } });
    },
  });

  return (
    <form
      className="flex flex-col md:flex-row gap-4 md:gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="title"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <div className="flex-1">
              <Input
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter your todo"
                value={field.state.value}
                onBlur={field.handleBlur}
                aria-label="title"
                name={field.name}
                id={field.name}
                autoFocus
              />
              {isInvalid && (
                <FieldError className="mt-2" errors={field.state.meta.errors} />
              )}
            </div>
          );
        }}
      ></form.Field>

      <form.Subscribe
        selector={(state) => [state.isSubmitting]}
        children={([isSubmitting]) => (
          <Button type="submit" disabled={isSubmitting}>
            <LoadingSwap
              isLoading={isSubmitting}
              className="flex gap-2 items-center"
            >
              {todo ? (
                "Update"
              ) : (
                <>
                  <PlusIcon /> Add
                </>
              )}
            </LoadingSwap>
          </Button>
        )}
      />
    </form>
  );
};

export default TodoForm;
