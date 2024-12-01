package main

import (
	"fmt"
	"os"
	"strings"
)

func parse(input string) []string {
	return strings.Split(input, "\n")
}

func solvePart1(input []string) int {
	return 0
}

func solvePart2(input []string) int {
	return 0
}

func main() {
	example, _ := os.ReadFile("example.txt")
	input, _ := os.ReadFile("input.txt")

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
