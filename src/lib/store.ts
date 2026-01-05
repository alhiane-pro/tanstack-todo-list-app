import { Store } from "@tanstack/store";
import { RootState } from "./types";

const initialState: RootState = {
  settings: { theme: "dark" },
};

export const store = new Store<RootState>(initialState);
