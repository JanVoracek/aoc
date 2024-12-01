open System.IO

module Main =
  type ParseOutput = int array array

  let parse (input: string) : ParseOutput =
    input.Trim().Split('\n')
    |> Array.map (fun line ->
      line.Split([| ' '; '\t' |], System.StringSplitOptions.RemoveEmptyEntries)
      |> Array.map int)

  let solvePart1 (columns: ParseOutput) : int =
    columns
    |> Array.transpose
    |> Array.map Array.sort
    |> Array.transpose
    |> Array.sumBy (fun (a) -> abs (a.[0] - a.[1]))

  let solvePart2 (input: ParseOutput) : int =
    input
    |> Array.transpose
    |> fun columns ->
        let left = columns.[0]
        let rightGroups = columns.[1] |> Array.countBy id |> Map.ofArray

        left
        |> Array.sumBy (fun num ->
          match Map.tryFind num rightGroups with
          | Some count -> count * num
          | None -> 0)

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
