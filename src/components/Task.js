import { useState, useRef, useReducer } from "react";
import { useDispatch } from "react-redux";
import { taskActions } from "../store";
import endSound from "../audio/endSound.wav";
import warningSound from "../audio/warningSound.wav";

import c from "./Task.module.css";

const timeoutsReducer = (state, action) => {
  let newTimeouts = [];
  for (let i = 0; i < state.length; i++) clearTimeout(state[i]);
  const currentTime = new Date().getTime();
  const startTime = new Date().setHours(
    action.startHours,
    action.startMinutes,
    0
  );
  const endTime = new Date().setHours(action.endHours, action.endMinutes, 0);
  const duration = endTime - startTime;
  const timeTillStart = startTime - currentTime;
  newTimeouts.push(
    setTimeout(playWarningSound, timeTillStart + duration * 0.2)
  );
  newTimeouts.push(
    setTimeout(playWarningSound, timeTillStart + duration * 0.5)
  );
  newTimeouts.push(
    setTimeout(playWarningSound, timeTillStart + duration * 0.8)
  );
  newTimeouts.push(setTimeout(playEndSound, timeTillStart + duration));
  return newTimeouts;
};

const playEndSound = () => new Audio(endSound).play();
const playWarningSound = () => new Audio(warningSound).play();

const checkHours = (hourRef) =>
  parseInt(hourRef.current.value) > 24 || hourRef.current.value.length < 2;
const checkMinutes = (minuteRef) =>
  parseInt(minuteRef.current.value) >= 60 || minuteRef.current.value.length < 2;

const Task = (props) => {
  const [valid, setValid] = useState(true);
  const dispatchTimeouts = useReducer(timeoutsReducer, [])[1];
  const dispatch = useDispatch();

  const startHoursRef = useRef();
  const startMinutesRef = useRef();
  const endHoursRef = useRef();
  const endMinutesRef = useRef();
  const nameRef = useRef();

  const checkError = () => {
    if (endHoursRef.current.value > startHoursRef.current.value) return true;
    if (endHoursRef.current.value < startHoursRef.current.value) return false;
    if (endMinutesRef.current.value < startMinutesRef.current.value) {
      return false;
    } else {
      return true;
    }
  };

  const changeHandler = () => {
    if (
      checkHours(startHoursRef) ||
      checkMinutes(startMinutesRef) ||
      checkHours(endHoursRef) ||
      checkMinutes(endMinutesRef) ||
      !checkError()
    ) {
      setValid(false);
      return;
    } else {
      setValid(true);
    }
    dispatchTimeouts({
      startHours: startHoursRef.current.value,
      startMinutes: startMinutesRef.current.value,
      endHours: endHoursRef.current.value,
      endMinutes: endMinutesRef.current.value,
    });
    dispatch(
      taskActions.updateStart({
        id: props.id,
        val: {
          hours: startHoursRef.current.value,
          minutes: startMinutesRef.current.value,
        },
      })
    );
    dispatch(
      taskActions.updateEnd({
        id: props.id,
        val: {
          hours: endHoursRef.current.value,
          minutes: endMinutesRef.current.value,
        },
      })
    );
  };

  const updateNameHandler = () =>
    dispatch(
      taskActions.updateName({ id: props.id, val: nameRef.current.value })
    );

  const closeHandler = () => dispatch(taskActions.removeTask(props.id));

  const taskClass = `${c.task} ${!valid ? c.invalid : (props.selected ? c.selected : '')}`;
  
  return (
    <div className={taskClass} onClick={() => dispatch(taskActions.setPrimarySelectedTask(props.id))}>
      <input
        className={c.taskName}
        ref={nameRef}
        onChange={updateNameHandler}
        defaultValue={props.name}
      />
      <div className={c.container}>
        <div className={c.time}>
          <input
            onChange={changeHandler}
            ref={startHoursRef}
            type='text'
            maxLength={2}
            minLength={2}
            defaultValue={props.start.hours}
          />
          :
          <input
            onChange={changeHandler}
            ref={startMinutesRef}
            type='text'
            maxLength={2}
            minLength={2}
            defaultValue={props.start.minutes}
          />
        </div>
        <div className={c.time}>
          <input
            onChange={changeHandler}
            ref={endHoursRef}
            type='text'
            maxLength={2}
            minLength={2}
            defaultValue={props.end.hours}
          />
          :
          <input
            onChange={changeHandler}
            ref={endMinutesRef}
            type='text'
            maxLength={2}
            minLength={2}
            defaultValue={props.end.minutes}
          />
        </div>
      </div>
      <div className={c.buttonContainer}>
        <button className={c.close} onClick={closeHandler}>
          x
        </button>
      </div>
    </div>
  );
};

export default Task;
