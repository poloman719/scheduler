import c from "./Tasks.module.css";
import Task from "./Task";
import { useDispatch, useSelector } from "react-redux";
import { taskActions } from "../store";

const formatNum = (num) => {
  const numString = num.toString();
  return numString.length === 2 ? numString : `0${numString}`;
};

const Tasks = (props) => {
  const selectedTasks = useSelector((state) => state.task.selectedTasks.tasks);
  const tasks = useSelector((state) => state.task.tasks);
  const dispatch = useDispatch();

  const addTaskHandler = () => {
    const [hours, minutes] = determineNewTaskTime();
    dispatch(
      taskActions.addTask({
        name: "",
        start: { hours: hours, minutes: minutes },
        end: { hours: hours, minutes: minutes },
        id: Math.floor(Math.random() * 1000),
      })
    );
  };

  const determineNewTaskTime = () => {
    const currentHours = formatNum(new Date().getHours());
    const currentMinutes = formatNum(new Date().getMinutes());
    if (tasks && tasks.length > 0) {
      const lastHours = tasks[tasks.length - 1].end.hours;
      const lastMinutes = tasks[tasks.length - 1].end.minutes;
      if (
        currentHours < lastHours ||
        (currentHours === lastHours && currentMinutes < lastMinutes)
      ) {
        return [lastHours, lastMinutes];
      }
    }
    return [currentHours, currentMinutes];
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
      <div className={c.buttonContainer}>
        <button onClick={addTaskHandler}>+</button>
        <button className={c.archive} onClick={archiveAllHandler}>
          <div className={c.archiveOuter}>
            <div className={c.archiveInner}>↓</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Tasks;
