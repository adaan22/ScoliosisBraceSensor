type ClassInput = string | number | boolean | null | undefined | ClassInput[]

function flatten(inputs: ClassInput[]): string[] {
  const output: string[] = []

  for (const input of inputs) {
    if (!input) continue
    if (Array.isArray(input)) {
      output.push(...flatten(input))
      continue
    }
    output.push(String(input))
  }

  return output
}

export function cn(...inputs: ClassInput[]) {
  return flatten(inputs).join(' ')
}
