import React, { useState } from "react";

// ultils aks helpers
import { minutesToDuration } from "../utils/duration";
import useInterval from "../utils/useInterval";

// components
import ControlPanelBtns from "../Components/ControlPanelBtns";
import SessionsInfo from "../Components/SessionsInfo"
import Duration from "../Components/Duration";

/**
 * Update the session state with new state after each tick of the interval.
 * @param prevState
 *  the previous session state
 * @returns
 *  new session state with timing information updated.
 */
function nextTick(prevState) {
  const timeRemaining = Math.max(0, prevState.timeRemaining - 1);
  const secondElapsed = prevState.timeTotal - timeRemaining;
  return {
    ...prevState,
    timeRemaining,
    percentComplete: (secondElapsed / prevState.timeTotal) * 100,
  };
}

/**
 * Higher-order function that returns a function to update the session state with the next session type upon timeout.
 * @param focusDuration
 *    the current focus duration
 * @param breakDuration
 *    the current break duration
 * @returns
 *  function to update the session state.
 */
function nextSession(focusDuration, breakDuration) {
  /**
   * State function to transition the current session type to the next session. e.g. On Break -> Focusing or Focusing -> On Break
   */
  return (currentSession) => {
    if (currentSession.label === "Focusing") {
      return {
        label: "On Break",
        duration: minutesToDuration(breakDuration),
        timeTotal: breakDuration * 60,
        timeRemaining: breakDuration * 60,
        percentComplete: 0,
      };
    }
    return {
      label: "Focusing",
      duration: minutesToDuration(focusDuration),
      timeTotal: focusDuration * 60,
      timeRemaining: focusDuration * 60,
      percentComplete: 0,
    };
  };
}

function Pomodoro() {
  // Timer starts out paused
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  // The current session - null where there is no session running
  const [session, setSession] = useState(null);
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);

  /**
   * Called whenever the play/pause button is clicked.
   */
  function playPause() {
    setIsTimerRunning((prevState) => {
      const nextState = !prevState;
      if (nextState) {
        setSession((prevStateSession) => {
          // If the timer is starting and the previous session is null,
          // start a focusing session.
          if (prevStateSession === null) {
            return {
              label: "Focusing",
              duration: minutesToDuration(focusDuration),
              timeTotal: focusDuration * 60,
              timeRemaining: focusDuration * 60,
              percentComplete: 0,
            };
          }
          return prevStateSession;
        });
      }
      return nextState;
    });
  }

  const handleDecreaseFocus = () => setFocusDuration((prevTime) => Math.max(5, prevTime - 5));
  const handleIncreaseFocus = () => setFocusDuration((prevTime) => Math.min(60, prevTime + 5));
  const handleDecreaseBreak = () => setBreakDuration((prevTime) => Math.max(1, prevTime - 1))
  const handleIncreaseBreak = () => setBreakDuration((prevTime) => Math.min(15, prevTime + 1));

  function stopSession() {
    setIsTimerRunning(false);
    setSession(null);
  }

  /**
   * Custom hook that invokes the callback function every second
   *
   * NOTE: You won't need to make changes to the callback function
   */
  useInterval(() => {
      if (session.timeRemaining === 0) {
        new Audio("https://bigsoundbank.com/UPLOAD/mp3/1482.mp3").play();
        return setSession(nextSession(focusDuration, breakDuration));
      }
      return setSession(nextTick);
    }, isTimerRunning ? 1000 : null,
  );

  return (
    <div className="pomodoro">
      <div className="row">
        <div className="col">
          <Duration
            label={`Focus Duration: ${minutesToDuration(focusDuration)}`}
            onIncrease={handleIncreaseFocus}
            onDecrease={handleDecreaseFocus}
            testid="focus"
          />
        </div>
        <div className="col">
          <div className="float-right">
            <Duration
              label={`Break Duration: ${minutesToDuration(breakDuration)}`}
              onIncrease={handleIncreaseBreak}
              onDecrease={handleDecreaseBreak}
              testid="break"
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <ControlPanelBtns
            onPlayPause={playPause} 
            isPlaying={isTimerRunning} 
            onStopSession={stopSession}
          />
        </div>
      </div>
      <SessionsInfo 
        session={session}
        isPaused={!isTimerRunning}
      />
    </div>
  );
}
export default Pomodoro;