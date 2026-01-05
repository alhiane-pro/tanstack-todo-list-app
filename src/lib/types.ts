export interface ITodo {
  _id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IResponse {
  todos: ITodo[];
  total: number;
  page: number;
  pages: number;
}

export interface SettingsState {
  theme: "light" | "dark";
}

export interface RootState {
  settings: SettingsState;
}
