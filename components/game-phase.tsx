"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import type { EmojiEntity, EmojiType } from "./rock-paper-scissors"

interface GamePhaseProps {
  entities: EmojiEntity[]
  setEntities: React.Dispatch<React.SetStateAction<EmojiEntity[]>>
  setWinner: React.Dispatch<React.SetStateAction<EmojiType | null>>
  setGamePhase: React.Dispatch<React.SetStateAction<"selection" | "game" | "result">>
}

const GamePhase = ({ entities, setEntities, setWinner, setGamePhase }: GamePhaseProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>()

  // Check if the game is over (only one type of emoji left)
  const checkGameOver = (currentEntities: EmojiEntity[]) => {
    const types = new Set(currentEntities.map((entity) => entity.type))
    if (types.size === 1) {
      const winner = currentEntities[0]?.type || null
      setWinner(winner)
      setGamePhase("result")
      return true
    }
    return false
  }

  // Update game state
  useEffect(() => {
    if (!containerRef.current) return

    const containerWidth = containerRef.current.clientWidth
    const containerHeight = containerRef.current.clientHeight

    // Initialize entities with random velocities if they don't have them
    setEntities((prevEntities) =>
      prevEntities.map((entity) => ({
        ...entity,
        vx: entity.vx || (Math.random() - 0.5) * 2, // Reduced velocity range
        vy: entity.vy || (Math.random() - 0.5) * 2, // Reduced velocity range
      })),
    )

    const updateGame = () => {
      setEntities((prevEntities) => {
        // If no entities, end the game
        if (prevEntities.length === 0) {
          setGamePhase("result")
          return prevEntities
        }

        // Move entities
        const updatedEntities = prevEntities.map((entity) => {
          let { x, y, vx, vy, size } = entity

          // Update position with scaled velocity for smoother movement
          x += vx * 0.3
          y += vy * 0.3

          // Bounce off walls - ensure entities stay within boundaries
          if (x <= 0 || x >= 100) {
            vx = -vx
            x = Math.max(0, Math.min(100, x))
          }

          if (y <= 0 || y >= 100) {
            vy = -vy
            y = Math.max(0, Math.min(100, y))
          }

          return { ...entity, x, y, vx, vy }
        })

        // Check for collisions
        const newEntities = [...updatedEntities]

        for (let i = 0; i < newEntities.length; i++) {
          for (let j = i + 1; j < newEntities.length; j++) {
            const entity1 = newEntities[i]
            const entity2 = newEntities[j]

            // Calculate distance between entities (using percentage coordinates)
            const dx = ((entity1.x - entity2.x) / 100) * containerWidth
            const dy = ((entity1.y - entity2.y) / 100) * containerHeight
            const distance = Math.sqrt(dx * dx + dy * dy)

            // Check if entities are colliding - using a more accurate collision threshold
            const collisionThreshold = (entity1.size + entity2.size) / 2

            if (distance < collisionThreshold) {
              // Apply collision rules only when actually colliding
              if (entity1.type === "rock" && entity2.type === "scissors") {
                newEntities[j] = { ...entity2, type: "rock" }
              } else if (entity1.type === "scissors" && entity2.type === "rock") {
                newEntities[i] = { ...entity1, type: "rock" }
              } else if (entity1.type === "rock" && entity2.type === "paper") {
                newEntities[i] = { ...entity1, type: "paper" }
              } else if (entity1.type === "paper" && entity2.type === "rock") {
                newEntities[j] = { ...entity2, type: "paper" }
              } else if (entity1.type === "paper" && entity2.type === "scissors") {
                newEntities[i] = { ...entity1, type: "scissors" }
              } else if (entity1.type === "scissors" && entity2.type === "paper") {
                newEntities[j] = { ...entity2, type: "scissors" }
              }

              // Bounce off each other with more pronounced effect
              const angle = Math.atan2(dy, dx)
              const speed1 = Math.sqrt(entity1.vx * entity1.vx + entity1.vy * entity1.vy)
              const speed2 = Math.sqrt(entity2.vx * entity2.vx + entity2.vy * entity2.vy)

              // Add some randomness to the bounce for more natural movement
              const randomFactor = 0.2

              newEntities[i].vx = Math.cos(angle) * speed1 * (1 + (Math.random() - 0.5) * randomFactor)
              newEntities[i].vy = Math.sin(angle) * speed1 * (1 + (Math.random() - 0.5) * randomFactor)
              newEntities[j].vx = -Math.cos(angle) * speed2 * (1 + (Math.random() - 0.5) * randomFactor)
              newEntities[j].vy = -Math.sin(angle) * speed2 * (1 + (Math.random() - 0.5) * randomFactor)
            }
          }
        }

        // Check if game is over
        if (checkGameOver(newEntities)) {
          return newEntities
        }

        return newEntities
      })

      animationFrameRef.current = requestAnimationFrame(updateGame)
    }

    animationFrameRef.current = requestAnimationFrame(updateGame)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [setEntities, setGamePhase, setWinner])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[800px] border border-muted-foreground/20 rounded-lg overflow-hidden bg-muted/10"
    >
      {entities.map((entity) => (
        <div
          key={entity.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${entity.x}%`,
            top: `${entity.y}%`,
            fontSize: `${entity.size}px`,
            transition: "none", // Remove transition for smoother movement
          }}
        >
          {entity.type === "rock" && "🪨"}
          {entity.type === "paper" && "🧻"}
          {entity.type === "scissors" && "✂️"}
        </div>
      ))}
    </div>
  )
}

export default GamePhase

