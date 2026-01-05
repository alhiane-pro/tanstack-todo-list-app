import { queryOptions, keepPreviousData } from "@tanstack/react-query";
import { getTodosFn, getTodoByIdFn } from "./todo-fns";

export const todoQueries = {
  all: (params: {
    filter?: string;
    status: "all" | "completed" | "active";
    page: number;
    pageSize: number;
  }) =>
    queryOptions({
      // The key is unique to the specific page/filter combo
      queryKey: ["todos", params],
      queryFn: () => getTodosFn({ data: params }),
      placeholderData: keepPreviousData, // This is the secret sauce!
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: ["todos", id],
      queryFn: () => getTodoByIdFn({ data: id }),
    }),
};
