import React from "react";

export function SessionsInfo({sessions}) {
    return (
      <div className="row mb-2">
        <div className="col">
          <div className="sessions" style={{ height: "20px" }}>
            <div
              className="sessions-info"
              role="sessionsInfo"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={sessions * 100} // TODO: Increase aria-valuenow as elapsed time increases
              style={{ width: sessions * 0 + "%" }} // TODO: Increase width % as elapsed time increases
            />
          </div>
        </div>
      </div>
    )
}