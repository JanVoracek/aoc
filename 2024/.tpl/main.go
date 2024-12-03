package main

import (
	"strings"

	"github.com/janvoracek/advent-of-code/aoc/2024/shared"
)

type ParseOutput = []string

func parse(input string) ParseOutput {
	return strings.Split(strings.TrimSpace(input), "\n")
}

func solvePart1(input ParseOutput) any {
	return 0
}

func solvePart2(input ParseOutput) any {
	return 0
}

func main() {
	shared.Run(parse, solvePart1, solvePart2)
}
