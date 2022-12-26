import { configureStore, createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "task",
  initialState: {
    tasks: [],
    archive: [],
    selectedTasks: { primary: null, secondary: null, tasks: [] },
    groups: [],
  },
  reducers: {
    replaceTasks(state, action) {
      state.tasks = action.payload;
    },
    replaceArchive(state, action) {
      state.archive = action.payload;
    },
    addTask(state, action) {
      state.tasks.push(action.payload);
    },
    removeTask(state, action) {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    updateStart(state, action) {
      state.tasks.find((task) => task.id === action.payload.id).start =
        action.payload.val;
    },
    updateEnd(state, action) {
      state.tasks.find((task) => task.id === action.payload.id).end =
        action.payload.val;
    },
    updateName(state, action) {
      state.tasks.find((task) => task.id === action.payload.id).name =
        action.payload.val;
    },
    addToArchive(state, action) {
      state.archive.push(action.payload);
    },
    removeArchiveItem(state, action) {
      state.archive = state.archive.filter(
        (item) => item.day !== action.payload
      );
    },
    setPrimarySelectedTask(state, action) {
      state.selectedTasks.primary = action.payload;
      state.selectedTasks.tasks = [action.payload];
    },
    setSecondarySelectedTask(state, action) {
      state.selectedTasks.secondary = action.payload;
      const { primary, secondary } = state.selectedTasks;
      const primaryIdx = state.tasks.findIndex((task) => task.id === primary);
      const secondaryIdx = state.tasks.findIndex(
        (task) => task.id === secondary
      );
      let lesser, greater;
      if (primaryIdx < secondaryIdx) {
        lesser = primary;
        greater = secondary;
      } else {
        lesser = secondary;
        greater = primary;
      }
      state.selectedTasks.tasks = state.tasks.filter(
        (task) => task >= lesser && task <= greater
      );
    },
  },
});

const store = configureStore({
  reducer: {
    task: taskSlice.reducer,
  },
});

export const taskActions = taskSlice.actions;

export default store;
