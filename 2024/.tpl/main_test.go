package main

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestParse(t *testing.T) {
	input := "line1\nline2\nline3"
	result := parse(input)
	expected := []string{"line1", "line2", "line3"}
	assert.Equal(t, expected, result)
}

func TestSolvePart1(t *testing.T) {
	input := []string{"example1", "example2"}
	expected := 0
	result := solvePart1(input)
	assert.Equal(t, expected, result)
}

func TestSolvePart2(t *testing.T) {
	input := []string{"example1", "example2"}
	expected := 0
	result := solvePart2(input)
	assert.Equal(t, expected, result)
}
