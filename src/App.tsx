import { ReactElement, useState } from 'react';
import './App.css';

interface SquareProps {
  value: string | null;
  onSquareClick?: () => void;
  isWon: boolean;
};

interface BoardProps {
  xIsNext: boolean;
  squares: Array<string | null>;
  onPlay: (nextSquares: Array<string | null>) => void;
}

const Square = ({ value, onSquareClick, isWon = false }: SquareProps) => (
  <button className="square" onClick={onSquareClick} style={{ color: isWon ? 'aqua' : '' }}>
    {value}
  </button>
);

const Board = ({ xIsNext, squares, onPlay }: BoardProps) => {

  const handleClick = (i: number): void => {
    if (squares[i] || calculateWinner(squares)) {
      return; // Ignore click if square is already filled
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : 'O';
    onPlay(nextSquares);
  };

  const winner: Array<number> | null = calculateWinner(squares);
  let status: string;
  if (winner) {
    status = `Winner: ${squares[winner[0]]}`;
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  if (!winner && squares.length === 9) {
    status = "Draw the Game!!"
  }

  const divElement: ReactElement[] = [0, 1, 2].map((index) => <div key={`board-${index}`} className="board-row">
    {[0, 1, 2].map((i) => {
      const squareIndex = i + 3 * index;
      return <Square
        key={`square-${squareIndex}`}
        value={squares[squareIndex]}
        isWon={winner?.includes(squareIndex) ?? false}
        onSquareClick={() => handleClick(squareIndex)}
      />
    })}
  </div>)

  return (
    <>
      <div>{status}</div>
      <br />
      {divElement}
    </>
  );
};

const Game = () => {
  const [history, setHistory] = useState<Array<Array<string | null>>>([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState<number>(0);

  const xIsNext: boolean = currentMove % 2 === 0; // Determine if 'X' or 'O' is next
  const currentSquares: Array<string | null> = history[currentMove];

  const handlePlay = (nextSquares: Array<string | null>): void => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  };

  const jumpTo = (nextMove: number): void => {
    setCurrentMove(nextMove);
  };

  const toggleSortOrder = (): void => {
    const nextHistory = [...history];
    nextHistory.reverse(); // Reverse the history array to toggle sort order
    setHistory(nextHistory);
    setCurrentMove(history.length - 1 - currentMove);
  };


  const moves: ReactElement[] = history.map((_: Array<string | null>, move: number) => {
    const row: number = Math.floor(move / 3) + 1;
    const col: number = Math.floor(move % 3) + 1;

    let description = move > 0 ? `Go to move #${move} at row ${row} col ${col}` : 'Go to game start';
    if (move === currentMove) {
      description = `You are at move #${move} at row ${row} col ${col}`; // Highlight the current move
    }
    return (
      <li key={move}>
        {currentMove !== move ?
          <button onClick={() => jumpTo(move)}>{description}</button> :
          <h5>{description}</h5>}
      </li>
    );
  });

  const toggleSortOrderElm = <button onClick={toggleSortOrder}>
    Toggle Sort Order
  </button>;

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={currentSquares} xIsNext={xIsNext} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        {toggleSortOrderElm}
        <ol>{moves}</ol>
      </div>
    </div>
  )
};

// Function to calculate the winner of the Tic Tac Toe game
const calculateWinner = (squares: Array<string | null>): Array<number> | null => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c]; // Return the winner ('X' or 'O')
    }
  }

  return null; // No winner yet
}

export default Game;