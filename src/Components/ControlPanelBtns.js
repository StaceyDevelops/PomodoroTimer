import React from "react";
import classNames from "../utils/class-names";

function ControlPanelBtns ({ onPlayPause, isPlaying, onStopSession }){
    return (
        <div
            className="btn-group btn-group-lg mb-2"
            role="group"
            aria-label="Timer controls"
        >
            <button
              type="button"
              className="btn btn-primary"
              data-testid="play-pause"
              title="Start or pause timer"
              onClick={onPlayPause}
            >
              <span
                className={classNames({
                  oi: true,
                  "oi-media-play": !isPlaying,
                  "oi-media-pause": isPlaying,
                })}
              />
            </button>
            {/* TODO: Implement stopping the current focus or break session and disable when there is no active session */}
            <button
              type="button"
              className="btn btn-secondary"
              data-testid="stop"
              title="Stop the session"
              onClick={onStopSession}
              disabled={!isPlaying}
            >
              <span className="oi oi-media-stop" />
            </button>
        </div>
    );
}  
export default ControlPanelBtns;