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
  const [player_1_nme, set_player_1_nme] = useState("");
  const [player_2_name, set_player_2_name] = useState("");
  const [winner, set_winner] = useState("");

  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(60);
  const [start_called, setStart_called] = useState(false);
  const [pause_called, setPause_called] = useState(false);
  const [isPlayer1, setIsPlayer1] = useState(true);
  const [showPlayerForm, set_showPlayerForm] = useState(true);

  const game_timer = setTimeout(() => {
    if (inProgress) {
      setTimer(timer - 1);
    }
  }, 1000);

  useEffect(() => {
    if (winner !== "" || timer <= 0) {
      console.log(winner);
      clearTimeout(game_timer);
      setGameOver(true);
      setInprogress(false);
    }
  }, [winner, timer]);
  const start = () => {
    setStart_called(true);
    setGameOver(false);
    setInprogress(true);
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
    let game_winner = document.querySelector(".winner");

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
        set_winner(player_1_nme != "" ? player_1_nme : "Player 1");

        game_winner.innerHTML = "Player One Wins!";
      }
      //check those tiles to see if they all have the class of player-two
      if (
        tile_grid[square1].classList.contains("player2") &&
        tile_grid[square2].classList.contains("player2") &&
        tile_grid[square3].classList.contains("player2") &&
        tile_grid[square4].classList.contains("player2")
      ) {
        game_winner.innerHTML = "Player Two Wins!";
        set_winner(player_2_name != "" ? player_2_name : "Player 2");
      }
    }
  };

  function Tile(tile) {
    const addMark = (event) => {
      let tile_grid = document.querySelectorAll(".grid div");
      let tile = event.target;
      let tile_below = parseInt(tile_grid[tile.id].id) + 7;
      console.log("TILE BELOW " + tile_grid[tile_grid[0].id]);
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

  /* The POST method adds a new entry in the mongodb database. */
  const postData = async () => {
    try {
      const res = await fetch("/api/player", {
        method: "POST",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify({
          player_1_nme: player_1_nme,
          player_2_name: player_2_name,
          winner: winner != "" ? winner : "Draw",
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

    if (target.name == "player1") {
      set_player_1_nme(value);
    } else {
      set_player_2_name(value);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      "Winner : " +
        winner +
        " Player 1 : " +
        player_1_nme +
        " Player 2 : " +
        player_2_name
    );
    postData();
  };
  const controlPlayerForm = () => {
    set_showPlayerForm(false);
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

      {showPlayerForm ? (
        <div>
          <h1>
            <button onClick={start} className="newFormButton">
              <a>New Game</a>
            </button>
          </h1>
          <Form className="save-player" id={formId}>
            <h2>
              Type in the names of the players if you would you like to save the
              result of this game.
            </h2>
            <label htmlFor="player1">Player 1</label>
            <textarea
              id="name-area"
              type="text"
              name="player1"
              value={player_1_nme}
              onChange={handleChange}
              required
            />
            <label htmlFor="player2">Player 2</label>
            <textarea
              id="name-area"
              type="text"
              name="player2"
              value={player_2_name}
              onChange={handleChange}
              required
            />
            <button onClick={controlPlayerForm}>Start Game</button>
          </Form>
        </div>
      ) : null}

      {!gameOver && !showPlayerForm ? (
        <div className="">
          {start_called ? (
            <div>
       
            </div>
          ) : (
            <button id="start" onClick={start}>
              Start
            </button>
          )}
          <h1>Timer : {timer} </h1>
          <h1 className="winner"> </h1>

          <h1 className="player">
            {isPlayer1
              ? player_1_nme != ""
                ? player_1_nme
                : "Player 1"
              : player_2_name != ""
              ? player_2_name
              : "Player 2"}{" "}
          </h1>

          {inProgress ? (
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
          ) : null}
        </div>
      ) : null}
      {gameOver ? (
        <Form className="save-player" id={formId} onSubmit={handleSubmit}>
          <p>Player 1 : {player_1_nme}</p>

          <p>Player 2 : {player_2_name}</p>
          <p>{winner}</p>

          <button type="submit" className="btn submit">
            Return to Score Board
          </button>
        </Form>
      ) : null}
    </div>
  );
};

export default PlayerForm;
