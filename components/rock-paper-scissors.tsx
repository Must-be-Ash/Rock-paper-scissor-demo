"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import SelectionPhase from "./selection-phase"
import GamePhase from "./game-phase"

export type EmojiType = "rock" | "paper" | "scissors"

export interface EmojiEntity {
  id: number
  type: EmojiType
  x: number
  y: number
  vx: number
  vy: number
  size: number
}

const RockPaperScissors = () => {
  const [gamePhase, setGamePhase] = useState<"selection" | "game" | "result">("selection")
  const [selectionTimeLeft, setSelectionTimeLeft] = useState(15)
  const [selectedEmojis, setSelectedEmojis] = useState<Record<EmojiType, number>>({
    rock: 0,
    paper: 0,
    scissors: 0,
  })
  const [winner, setWinner] = useState<EmojiType | null>(null)
  const [entities, setEntities] = useState<EmojiEntity[]>([])
  // Replace the playerSelection state with playerSelections to track multiple choices
  const [playerSelections, setPlayerSelections] = useState<Record<EmojiType, number>>({
    rock: 0,
    paper: 0,
    scissors: 0,
  })

  // Reset the game
  const resetGame = () => {
    setGamePhase("selection")
    setSelectionTimeLeft(15)
    setSelectedEmojis({
      rock: 0,
      paper: 0,
      scissors: 0,
    })
    setPlayerSelections({
      rock: 0,
      paper: 0,
      scissors: 0,
    })
    setWinner(null)
    setEntities([])
  }

  // Handle player selection
  const handleSelection = (type: EmojiType) => {
    if (gamePhase === "selection") {
      setPlayerSelections((prev) => ({
        ...prev,
        [type]: prev[type] + 1,
      }))
      setSelectedEmojis((prev) => ({
        ...prev,
        [type]: prev[type] + 1,
      }))
    }
  }

  // Timer for selection phase
  useEffect(() => {
    if (gamePhase === "selection" && selectionTimeLeft > 0) {
      const timer = setTimeout(() => {
        setSelectionTimeLeft((prev) => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (gamePhase === "selection" && selectionTimeLeft === 0) {
      startGame()
    }
  }, [gamePhase, selectionTimeLeft])

  // Start the game
  const startGame = () => {
    // Create entities based on selections
    const newEntities: EmojiEntity[] = []
    let idCounter = 0

    // Add rock entities
    for (let i = 0; i < selectedEmojis.rock; i++) {
      newEntities.push(createRandomEntity("rock", idCounter++))
    }

    // Add paper entities
    for (let i = 0; i < selectedEmojis.paper; i++) {
      newEntities.push(createRandomEntity("paper", idCounter++))
    }

    // Add scissors entities
    for (let i = 0; i < selectedEmojis.scissors; i++) {
      newEntities.push(createRandomEntity("scissors", idCounter++))
    }

    setEntities(newEntities)
    setGamePhase("game")
  }

  // Update the createRandomEntity function to have higher initial velocities
  const createRandomEntity = (type: EmojiType, id: number): EmojiEntity => {
    return {
      id,
      type,
      x: Math.random() * 80 + 10, // 10% to 90% of container width
      y: Math.random() * 80 + 10, // 10% to 90% of container height
      vx: (Math.random() - 0.5) * 2, // Reduced velocity range
      vy: (Math.random() - 0.5) * 2, // Reduced velocity range
      size: 40, // Size in pixels
    }
  }

  // Render the appropriate phase
  const renderPhase = () => {
    switch (gamePhase) {
      case "selection":
        return (
          <SelectionPhase
            timeLeft={selectionTimeLeft}
            onSelect={handleSelection}
            selectedEmojis={selectedEmojis}
            playerSelections={playerSelections}
          />
        )
      case "game":
        return (
          <GamePhase entities={entities} setEntities={setEntities} setWinner={setWinner} setGamePhase={setGamePhase} />
        )
      case "result":
        return (
          <div className="flex flex-col items-center justify-center space-y-6">
            <h2 className="text-3xl font-bold">Game Over!</h2>
            <div className="text-6xl mb-4">
              {winner === "rock" && "🪨"}
              {winner === "paper" && "🧻"}
              {winner === "scissors" && "✂️"}
            </div>
            <p className="text-xl">
              {winner === "rock" && "Rocks win!"}
              {winner === "paper" && "Papers win!"}
              {winner === "scissors" && "Scissors win!"}
            </p>
            <p className="text-lg mt-2">
              {playerSelections[winner as EmojiType] > 0
                ? `You selected ${playerSelections[winner as EmojiType]} ${winner}(s) - Good prediction!`
                : "Better luck next time!"}
            </p>
            <Button onClick={resetGame} className="mt-4">
              Play Again
            </Button>
          </div>
        )
    }
  }

  return (
    <Card className="w-full max-w-5xl p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Rock Paper Scissors Battle</h1>
      {renderPhase()}
    </Card>
  )
}

export default RockPaperScissors

