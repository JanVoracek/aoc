#r "nuget: Expecto"
#load "./main.fsx"

open Expecto
open Main

let tests = testList "Tests" [
    test  "Parse" {
        let result = Main.parse "1\n2\n3"
        let expected = ["1"; "2"; "3"]
        Expect.equal result expected "Parse test failed"
    }
    test "Part 1" {
        let result = Main.solvePart1 ["1"; "2"; "3"]
        let expected = 0
        Expect.equal result expected "Part 1 test failed"
    }
    test "Part 2" {
        let result = Main.solvePart2 ["1"; "2"; "3"]
        let expected = 0
        Expect.equal result expected "Part 1 test failed"
    }
]

runTestsWithCLIArgs [] [||] tests

