import { Schema, model } from "mongoose";

const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
});

const subtaskSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  assignee: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["To Do", "In Progress", "Completed"],
    default: "To Do",
    required: true,
  },
  dueDate: {
    type: Date,
  },
});

const attachmentSchema = new Schema({
  filename: {
    type: String,
    required: true,
    trim: true,
  },
  path: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["PDF", "IMAGE", "VIDEO", "DOC", "OTHER"],
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      index: true,
    },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Completed"],
      default: "To Do",
      required: true,
      index: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
      required: true,
      index: true,
    },
    dueDate: {
      type: Date,
      index: true,
    },
    assignee: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      index: true,
    },
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    comments: {
      type: [commentSchema],
      default: [],
    },
    subtasks: {
      type: [subtaskSchema],
      default: [],
    },
    attachments: {
      type: [attachmentSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const Task = model("Task", taskSchema);

export default Task;
