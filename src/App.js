import c from "./App.module.css";
import { taskActions } from "./store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Tasks from "./components/Tasks";
import Archive from "./components/Archive";

let isInit = true;

const App = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.task.tasks);
  const archive = useSelector((state) => state.task.archive);
  const [page, setPage] = useState(true);

  useEffect(() => {
    fetch("https://scheduler-4a371-default-rtdb.firebaseio.com/tasks.json")
      .then((response) => response.json())
      .then((data) => data && dispatch(taskActions.replaceTasks(data)));
    fetch("https://scheduler-4a371-default-rtdb.firebaseio.com/archive.json")
      .then((response) => response.json())
      .then((data) => data && dispatch(taskActions.replaceArchive(data)));
  }, [dispatch]);

  useEffect(() => {
    if (isInit) return;
    fetch("https://scheduler-4a371-default-rtdb.firebaseio.com/tasks.json", {
      method: "PUT",
      body: JSON.stringify(tasks),
    });
  }, [tasks]);

  useEffect(() => {
    if (isInit) {
      isInit = false;
      return;
    }
    fetch("https://scheduler-4a371-default-rtdb.firebaseio.com/archive.json", {
      method: "PUT",
      body: JSON.stringify(archive),
    });
  }, [archive]);

  return (
    <>
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Roboto+Condensed&display=swap');
      </style>
      <div className={c.header}>
        <p className={page ? "" : c.notOpen} onClick={() => setPage(true)}>
          Tasks
        </p>
        <p className={c.title}>Scheduler</p>
        <p className={page ? c.notOpen : ""} onClick={() => setPage(false)}>
          Archive
        </p>
      </div>
      {page ? <Tasks tasks={tasks}/> : <Archive archive={archive}/>}
    </>
  );
};

export default App;
