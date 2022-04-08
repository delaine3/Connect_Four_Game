import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { Form } from "semantic-ui-react";
import { tileArray } from "./tile_array";
import Link from "next/link";
import { winningArrays } from "./winning_arrays";
const PlayerForm = ({ formId, fornewPlayer = true }) => {
  const router = useRouter();
  const contentType = "application/json";

  const [inProgress, setInprogress] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(60);
  const [start_called, setStart_called] = useState(false);
  const [pause_called, setPause_called] = useState(false);
  const [isPlayer1, setIsPlayer1] = useState(true);
  const [form, setForm] = useState({
    name: playerName,
    score: score,
  });
  const game_timer = setTimeout(() => {
    let winner = document.querySelector(".winner");

    if (inProgress) {
      setTimer(timer - 1);
    }
  }, 1000);

  useEffect(() => {
    if (timer == 0) {
      clearTimeout(game_timer);
      setGameOver(true);
      setInprogress(false);
    }
  }, [timer]);
  const start = () => {
    setStart_called(true);
    setGameOver(false);
    setScore(0);
    setInprogress(true);
    setPlayerName("");
  };
  const pause = () => {
    setPause_called(true);
    setInprogress(false);
  };
  const resume = () => {
    setPause_called(false);

    setInprogress(true);
  };
  const checkGrid = () => {
    let tile_grid = document.querySelectorAll(".grid div");
    let winner = document.querySelector(".winner");

    for (let y = 0; y < winningArrays.length; y++) {
      const square1 = tile_grid[winningArrays[y][0]].id;
      const square2 = tile_grid[winningArrays[y][1]].id;
      const square3 = tile_grid[winningArrays[y][2]].id;
      const square4 = tile_grid[winningArrays[y][3]].id;

      //check those squares to see if they all have the class of player-one
      if (
        tile_grid[square1].classList.contains("player1") &&
        tile_grid[square2].classList.contains("player1") &&
        tile_grid[square3].classList.contains("player1") &&
        tile_grid[square4].classList.contains("player1")
      ) {
        console.log("Player One Wins!");

        winner.innerHTML = "Player One Wins!";
      }
      //check those tiles to see if they all have the class of player-two
      if (
        tile_grid[square1].classList.contains("player2") &&
        tile_grid[square2].classList.contains("player2") &&
        tile_grid[square3].classList.contains("player2") &&
        tile_grid[square4].classList.contains("player2")
      ) {
        winner.innerHTML = "Player Two Wins!";
      }
    }
  };

  function Tile(tile) {
    const addMark = (event) => {
      let tile_grid = document.querySelectorAll(".grid div");
      let tile = event.target;
      let tile_below = parseInt(tile_grid[tile.id].id) + 7;
      if (
        !tile.classList.contains("taken") &&
        tile_grid[tile_below].classList.contains("taken")
      ) {
        event.target.classList.add("taken");

        if (isPlayer1) {
          event.target.classList.add("player1");
          setIsPlayer1(false);
        } else {
          event.target.classList.add("player2");

          setIsPlayer1(true);
        }
        checkGrid();
      }
    };

    return (
      <div
        className="tile"
        key={tile}
        id={tile}
        onClick={() => {
          addMark(event);
        }}
      ></div>
    );
  }

  let tileGrid = tileArray.map((tile) => {
    return Tile(tile);
  });

  /* The PUT method edits an existing entry in the mongodb database. */
  const putData = async (form) => {
    const { id } = router.query;

    try {
      const res = await fetch(`/api/player/${id}`, {
        method: "PUT",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify({
          name: playerName,
          score: score,
        }),
      });

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status);
      }

      const { data } = await res.json();

      mutate(`/api/player/${id}`, data, false); // Update the local data without a revalidation
      router.push("/");
    } catch (error) {
      setMessage("Failed to update player");
    }
  };

  /* The POST method adds a new entry in the mongodb database. */
  const postData = async (form) => {
    try {
      const res = await fetch("/api/player", {
        method: "POST",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify({
          name: playerName,
          score: score,
        }),
      });

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status);
      }

      router.push("/");
    } catch (error) {
      setMessage("Failed to add player");
    }
  };

  const handleChange = (e) => {
    const target = e.target;
    const value = target.value;

    setPlayerName(value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = formValidate();
    if (Object.keys(errs).length === 0) {
      fornewPlayer ? postData(form) : putData(form);
    } else {
      setErrors({ errs });
    }
  };

  const formValidate = () => {
    let err = {};

    return err;
  };

  return (
    <div>
      <h1>
        <Link href="/">
          <button className="newFormButton">
            {" "}
            <a>Leader Board</a>{" "}
          </button>
        </Link>
      </h1>

      {gameOver ? (
        <div>
          <h1>
            <button onClick={start} className="newFormButton">
              {" "}
              <a>New Game</a>{" "}
            </button>
          </h1>
          <Form className="save-player" id={formId} onSubmit={handleSubmit}>
            <h2>
              Yay! Record your high score by filling in your name and hitting
              the submit button!
            </h2>
            <label htmlFor="name">Name</label>

            <input
              type="text"
              name="name"
              value={playerName}
              onChange={handleChange}
              required
            />
            <label htmlFor="score">Score</label>

            <p
              type="text"
              name="score"
              value={score}
              onChange={handleChange}
              required
            >
              {score}
            </p>

            <button type="submit" className="btn submit">
              Submit
            </button>

            <div key={Math.random() * 100000}>
              {Object.keys(errors).map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </div>
          </Form>
        </div>
      ) : null}

      {!gameOver ? (
        <div className="game">
          {start_called ? (
            <div>
              {pause_called ? (
                <button id="resume" onClick={resume}>
                  Resume
                </button>
              ) : (
                <button id="pause" onClick={pause}>
                  Pause
                </button>
              )}
            </div>
          ) : (
            <button id="start" onClick={start}>
              Start
            </button>
          )}
          <h1>Timer : {timer} </h1>
          <h1 className="winner"> </h1>

          <h1 className="player">{isPlayer1 ? "PLAYER 1" : "PLAYER 2"} </h1>

          <div id="tile-grid" className="grid">
            {tileGrid}
            <div className="taken floor"></div>
            <div className="taken floor"></div>
            <div className="taken floor"></div>
            <div className="taken floor"></div>
            <div className="taken floor"></div>
            <div className="taken floor"></div>
            <div className="taken floor"></div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PlayerForm;
