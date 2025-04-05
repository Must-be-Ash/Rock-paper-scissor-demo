"use client"

import { Button } from "@/components/ui/button"
import type { EmojiType } from "./rock-paper-scissors"

// Update the interface to use playerSelections instead of playerSelection
interface SelectionPhaseProps {
  timeLeft: number
  onSelect: (type: EmojiType) => void
  selectedEmojis: Record<EmojiType, number>
  playerSelections: Record<EmojiType, number>
}

// Update the component to use playerSelections
const SelectionPhase = ({ timeLeft, onSelect, selectedEmojis, playerSelections }: SelectionPhaseProps) => {
  const totalSelections = selectedEmojis.rock + selectedEmojis.paper + selectedEmojis.scissors
  const totalPlayerSelections = playerSelections.rock + playerSelections.paper + playerSelections.scissors

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Select your emojis</h2>
        <p className="text-muted-foreground">Time remaining: {timeLeft} seconds</p>
      </div>

      <div className="flex justify-center space-x-6">
        <Button
          onClick={() => onSelect("rock")}
          className={`h-20 w-20 text-4xl relative ${playerSelections.rock > 0 ? "bg-primary-foreground border-2 border-primary" : ""}`}
          variant={playerSelections.rock > 0 ? "outline" : "default"}
        >
          🪨
          {playerSelections.rock > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {playerSelections.rock}
            </span>
          )}
        </Button>
        <Button
          onClick={() => onSelect("paper")}
          className={`h-20 w-20 text-4xl relative ${playerSelections.paper > 0 ? "bg-primary-foreground border-2 border-primary" : ""}`}
          variant={playerSelections.paper > 0 ? "outline" : "default"}
        >
          🧻
          {playerSelections.paper > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {playerSelections.paper}
            </span>
          )}
        </Button>
        <Button
          onClick={() => onSelect("scissors")}
          className={`h-20 w-20 text-4xl relative ${playerSelections.scissors > 0 ? "bg-primary-foreground border-2 border-primary" : ""}`}
          variant={playerSelections.scissors > 0 ? "outline" : "default"}
        >
          ✂️
          {playerSelections.scissors > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {playerSelections.scissors}
            </span>
          )}
        </Button>
      </div>

      {totalPlayerSelections > 0 && (
        <p className="text-center">
          Your selections: {playerSelections.rock > 0 && `🪨 × ${playerSelections.rock}`}{" "}
          {playerSelections.paper > 0 && `🧻 × ${playerSelections.paper}`}{" "}
          {playerSelections.scissors > 0 && `✂️ × ${playerSelections.scissors}`}
        </p>
      )}

      <div className="mt-6 text-center">
        <h3 className="font-medium mb-2">Current Selections:</h3>
        <div className="flex justify-center space-x-4">
          <div className="text-center">
            <div className="text-2xl">🪨</div>
            <div>{selectedEmojis.rock}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl">🧻</div>
            <div>{selectedEmojis.paper}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl">✂️</div>
            <div>{selectedEmojis.scissors}</div>
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Total selections: {totalSelections}</p>
      </div>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>When the timer ends, the battle will begin!</p>
      </div>
    </div>
  )
}

export default SelectionPhase

