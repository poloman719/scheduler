import c from "./Archive.module.css";
import { useState } from "react";
import ArchiveItem from "./ArchiveItem";

const Archive = (props) => {
  const [archiveSelected, setArchiveSelected] = useState(0);
  const [selectedItem, setSelectedItem] = useState();
  const archiveItem = props.archive.find((item) => item.day === selectedItem);
  console.log(archiveItem);
  const archiveItemTasks = archiveItem ? archiveItem.tasks : [];
  const formatTime = (start, end) => `${start.hours}:${start.minutes} — ${end.hours}:${end.minutes}`;

  let archiveClasses = `${c.archivedTasks} `;

  switch (archiveSelected) {
    case 1:
      archiveClasses += c.selected;
      break;
    case 2:
      archiveClasses += c.unselected;
      break;
    default:
  }

  return (
    <div className={c.archiveContainer}>
      <div className={c.itemList}>
        {props.archive.map((item) => (
          <ArchiveItem
            toggleArchive={() =>
              setArchiveSelected(archiveSelected === 1 ? 2 : 1)
            }
            setSelectedItem={(time) => setSelectedItem(time)}
            archiveSelected={archiveSelected}
            selected={item.day === selectedItem}
            key={item.day}
            time={item.day}
            startHours={item.tasks[0].start.hours}
            startMinutes={item.tasks[0].start.minutes}
            endHours={item.tasks[item.tasks.length - 1].end.hours}
            endMinutes={item.tasks[item.tasks.length - 1].end.minutes}
          />
        ))}
      </div>
      <div className={archiveClasses}>
        {archiveItem && archiveSelected === 1 &&
          archiveItemTasks.map((task) => (
            <div className={c.task}>
              <div className={c.taskName}>
                {task.name ? task.name : "Untitled"}
              </div>
              <div className={c.taskTime}>
                {formatTime(task.start, task.end)}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Archive;
