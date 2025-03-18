import { useState, useEffect, useRef } from "react";
import { render } from "react-dom";


function CountdownTimer({socket}) {
  const [counter, setCounter] = useState();

  useEffect(() => {
    socket.on("counter_down", (data) => {
      setCounter(data.counter);
    })

    socket.on("round_ended", () => {
      setCounter(0);
    })

    socket.on("game_ended", () => {
      setCounter("GAME ENDED");
    })
  }, [])

  return (
    <div>
      <div className="game__timer">{counter}</div>
    </div>
  );
}
export default CountdownTimer;
