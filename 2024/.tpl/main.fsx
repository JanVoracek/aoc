open System.IO

module Main =
  type ParseOutput = string list

  let parse (input: string) : ParseOutput = input.Trim().Split('\n') |> List.ofArray

  let solvePart1 (input: ParseOutput) = 0

  let solvePart2 (input: ParseOutput) = 0

  let main (argv: string array) =
    let inputType = argv.[0]
    let partNumber = argv.[1]

    let currentInput =
      if inputType = "example" then
        File.ReadAllText("example.txt")
      else
        File.ReadAllText("input.txt")

    let solveFunction = if partNumber = "1" then solvePart1 else solvePart2

    let parsed = parse currentInput
    solveFunction parsed |> printfn "%A"

if System.Environment.GetCommandLineArgs().[1] = "main.fsx" then
  Main.main (System.Environment.GetCommandLineArgs().[2..]) |> ignore
