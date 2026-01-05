import mongoose, { Schema, model, Document } from "mongoose";

export interface ITodoModel {
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface ITodoDocument extends ITodoModel, Document {}

const todoSchema = new Schema<ITodoModel>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: [5, "Todo title must have at least 5 characters!"],
      maxLength: [100, "Todo title musn't have more than 100 characters!"],
    },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

todoSchema.pre("save", function () {
  this.createdBy = "Lahcen Alhiane";
});

// Ensure the model isn't re-compiled on every hot reload
export const Todo =
  mongoose.models.Todo || model<ITodoModel>("Todo", todoSchema);
