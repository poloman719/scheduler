import { useDispatch } from "react-redux";
import c from "./ArchiveItem.module.css";
import { taskActions } from "../store";
import { useState } from "react";

const formatNum = (num) => {
  const numString = num.toString();
  return numString.length === 2 ? numString : `0${numString}`;
};

const ArchiveItem = (props) => {
  const dispatch = useDispatch();

  const { toggleArchive, setSelectedItem, archiveSelected, time, selected } =
    props;
  const date = new Date(time);
  const month = formatNum(date.getMonth() + 1);
  const day = formatNum(date.getDate());
  const year = date.getFullYear();
  const dateString = `${month}/${day}/${year}`;
  const timeString = `${props.startHours}:${props.startMinutes} — ${props.endHours}:${props.endMinutes}`;

  const removeArchiveHandler = () => {
    dispatch(taskActions.removeArchiveItem(props.time));
  };

  const selectArchiveHandler = () => {
    if (selected) {
      setSelectedItem();
      toggleArchive();
    } else {
      setSelectedItem(time);
      if (archiveSelected !== 1) toggleArchive();
    }
  };

  return (
    <div
      className={`${c.item} ${selected ? c.selected : ""}`}
      onClick={selectArchiveHandler}
    >
      <div className={c.content}>
        <p>{dateString}</p>
        <p className={c.time}>{timeString}</p>
      </div>
      <button onClick={removeArchiveHandler}>X</button>
    </div>
  );
};

export default ArchiveItem;
