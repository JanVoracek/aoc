package main

import (
	"math"
	"slices"
	"strconv"
	"strings"

	"github.com/janvoracek/advent-of-code/aoc/2024/shared"
)

type ParseOutput = [2][]int

func parse(input string) ParseOutput {
	lines := strings.Split(strings.TrimSpace(input), "\n")
	result := ParseOutput{[]int{}, []int{}}
	for _, line := range lines {
		for i, part := range strings.Fields(line) {
			nr, _ := strconv.Atoi(part)
			result[i] = append(result[i], nr)
		}
	}
	return result
}

func solvePart1(input ParseOutput) any {
	slices.Sort(input[0])
	slices.Sort(input[1])
	sum := 0
	for i, v := range input[0] {
		sum += int(math.Abs(float64(v - input[1][i])))
	}
	return sum
}

func solvePart2(input ParseOutput) any {
	rightGroups := make(map[int]int)
	for _, num := range input[1] {
		rightGroups[num]++
	}

	sum := 0
	for _, num := range input[0] {
		sum += num * rightGroups[num]
	}

	return sum
}

func main() {
	shared.Run(parse, solvePart1, solvePart2)
}
