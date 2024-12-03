package main

import (
	"slices"
	"strconv"
	"strings"

	"github.com/janvoracek/advent-of-code/aoc/2024/shared"
	"github.com/repeale/fp-go"
)

type ParseOutput = [][]int

func parse(input string) ParseOutput {
	reports := [][]int{}
	for _, line := range strings.Split(strings.TrimSpace(input), "\n") {
		reports = append(reports, fp.Map(func(val string) int {
			return shared.HandleError(strconv.Atoi(val))
		})(strings.Split(line, " ")))
	}
	return reports
}

func solvePart1(input ParseOutput) any {
	return len(fp.Filter(func(report []int) bool {
		return isSafe(report)
	})(input))
}

func solvePart2(input ParseOutput) any {
	return len(fp.Filter(func(report []int) bool {
		return fp.SomeWithIndex(func(_, i int) bool {
			return isSafe(without(report, i))
		})(report)
	})(input))
}

func isSafe(report []int) bool {
	globalTrend, _ := compare(report[0], report[1])
	return fp.EveryWithIndex(func(_, i int) bool {
		trend, diff := compare(report[i], report[i+1])
		return diff >= 1 && diff <= 3 && trend == globalTrend
	})(report[1:])
}

func without(array []int, index int) []int {
	return slices.Concat(array[:index], array[index+1:])
}

func compare(a, b int) (int, int) {
	return int(sign(b - a)), abs(a - b)
}

func abs(n int) int {
	if n < 0 {
		return -n
	}
	return n
}

func sign(n int) int {
	switch {
	case n > 0:
		return 1
	case n < 0:
		return -1
	default:
		return 0
	}
}

func main() {
	shared.Run(parse, solvePart1, solvePart2)
}
