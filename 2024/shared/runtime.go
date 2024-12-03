package shared

import (
	"fmt"
	"os"
)

func Run[T any](parse func(string) T, solvePart1 func(input T) any, solvePart2 func(input T) any) {
	example, _ := os.ReadFile("example.txt")
	input, _ := os.ReadFile("input.txt")

	if len(os.Args) < 3 {
		fmt.Println("Usage: go run main.go <example|input> <1|2>")
		os.Exit(1)
	}

	inputType := os.Args[1]
	partNumber := os.Args[2]

	currentInput := string(input)
	if inputType == "example" {
		currentInput = string(example)
	}

	parsed := parse(currentInput)

	if partNumber == "1" {
		fmt.Println(solvePart1(parsed))
	} else {
		fmt.Println(solvePart2(parsed))
	}
}
