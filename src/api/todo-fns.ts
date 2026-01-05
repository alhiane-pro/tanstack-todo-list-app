import { redirect, isRedirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { IResponse, ITodo } from "@/lib/types";
import { api } from ".";
import z from "zod";

export const getTodosFn = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      filter: z.string().optional(),
      status: z.enum(["all", "completed", "active"]).catch("all"),
      page: z.number().catch(1),
      pageSize: z.number().catch(5), // Show 10 items per page
    })
  )
  .handler(async ({ data }) => {
    try {
      const res = await api.get(
        `/todos?filter=${data.filter ?? ""}&status=${data.status}&page=${data.page}&pageSize=${data.pageSize}`
      );
      return res.data.data as IResponse;
    } catch (error) {
      throw error;
    }
  });

export const getTodoByIdFn = createServerFn({ method: "GET" })
  .inputValidator((id: string) => id)
  .handler(async ({ data }) => {
    try {
      const res = await api.get(`/todos/${data}`);
      return res.data.data.todo as ITodo;
    } catch (error) {
      throw error;
    }
  });

export const saveTodoFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id?: string; title: string }) => data)
  .handler(async ({ data }) => {
    try {
      if (data.id) {
        await api.put(`/todos/${data.id}`, { title: data.title });
      } else {
        await api.post("/todos", { title: data.title });
      }
      throw redirect({
        to: "/",
        search: { status: "all", filter: "", page: 1, pageSize: 5 },
      });
    } catch (error) {
      if (isRedirect(error)) throw error;
      throw error;
    }
  });

export const updateTodoStatusFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; completed: boolean }) => data)
  .handler(async ({ data }) => {
    try {
      await api.patch(`/todos/${data.id}`, { completed: data.completed });
      throw redirect({
        to: "/",
        search: { status: "all", filter: "", page: 1, pageSize: 5 },
      });
    } catch (error) {
      if (isRedirect(error)) throw error;
      throw error;
    }
  });

export const deleteTodoFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    try {
      await api.delete(`/todos/${data.id}`);
    } catch (error) {
      throw error;
    }
  });
