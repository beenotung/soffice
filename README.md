# soffice

wrapper of the LibreOffice CLI - convert between office files (word documents, spreadsheets, presentation slides), pdf, and html files

[![npm Package Version](https://img.shields.io/npm/v/soffice)](https://www.npmjs.com/package/soffice)

## Features

- Convert html and office files to pdf
- Typescript support

## Installation

```bash
npm install soffice
```

You can also install `soffice` with [pnpm](https://pnpm.io/), [yarn](https://yarnpkg.com/), or [slnpm](https://github.com/beenotung/slnpm)

## Usage Example

```typescript
import { convertToPDF } from 'soffice'

let inputFile = 'res/test.html'
let outputFile = await convertToPDF(inputFile)
console.log(outputFile) // "res/test.pdf"
```

## Typescript Signature

Core Functions:

```typescript
export function convertToPDF(input_file: string): Promise<string>

export function convertToHTML(input_file: string): Promise<string>

export function convertTo(options: {
  input_file: string
  convert_to: Format
}): Promise<string>

export type Format =
  | 'pdf'
  | 'html'
  | 'doc'
  | 'docx'
  | 'odt'
  | 'odp'
  | 'pptx'
  | 'ppt'
  | 'ods'
  | 'xlsx'
  | 'xls'
```

Helper Functions:

```typescript
export function is_soffice_installed(): boolean
```

Error Class:

```typescript
export class ChildProcessError extends Error {
  code: number | null
  stdout: string
  stderr: string
  constructor(
    message: string,
    code: number | null,
    stdout: string,
    stderr: string,
  )
}
```
