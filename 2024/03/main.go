package main

import (
	"regexp"
	"strconv"

	"github.com/janvoracek/advent-of-code/aoc/2024/shared"
)

type ParseOutput = string

func parse(input string) ParseOutput {
	return input
}

func solvePart1(input ParseOutput) any {
	re := regexp.MustCompile(`mul\((\d{1,3}),(\d{1,3})\)`)
	matches := re.FindAllStringSubmatch(input, -1)
	sum := 0
	for _, match := range matches {
		sum += parseInt(match[1]) * parseInt(match[2])
	}
	return sum
}

func solvePart2(input ParseOutput) any {
	re := regexp.MustCompile(`(?s)don't\(\).+?(do\(\)|$)`)
	return solvePart1(re.ReplaceAllString(input, ""))
}

func parseInt(s string) int {
	return shared.HandleError(strconv.Atoi(s))
}

func main() {
	shared.Run(parse, solvePart1, solvePart2)
}
