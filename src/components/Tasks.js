import c from "./Tasks.module.css";
import Task from "./Task";
import { useDispatch, useSelector } from "react-redux";
import { taskActions } from "../store";

const Tasks = (props) => {
  const selectedTasks = useSelector(state => state.task.selectedTasks.tasks);
  const dispatch = useDispatch();

  const addTaskHandler = () => {
    dispatch(
      taskActions.addTask({
        name: "",
        start: { hours: "00", minutes: "00" },
        end: { hours: "00", minutes: "00" },
        id: Math.floor(Math.random() * 1000),
      })
    );
  };

  const archiveAllHandler = () => {
    const day = new Date().getTime();
    dispatch(taskActions.addToArchive({ day: day, tasks: props.tasks }));
    dispatch(taskActions.replaceTasks([]));
  };

  return (
    <div className={c.itemList}>
      {props.tasks.map((task) => (
        <Task
          selected={selectedTasks.includes(task.id)}
          key={task.id}
          id={task.id}
          name={task.name}
          start={task.start}
          end={task.end}
        />
      ))}
      <div>
        <button className={c.archive} onClick={archiveAllHandler}>
          <div className={c.archiveOuter}>
            <div className={c.archiveInner}>↓</div>
          </div>
        </button>
        <button onClick={addTaskHandler}>+</button>
      </div>
    </div>
  );
};

export default Tasks;
