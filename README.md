# soffice

wrapper of the LibreOffice CLI - convert between office files, pdf, and html files

[![npm Package Version](https://img.shields.io/npm/v/soffice)](https://www.npmjs.com/package/soffice)

## Features

- Convert between office files, pdf, and html
  - word documents (odt, doc, docx)
  - spreadsheets (ods, xls, xlsx)
  - presentation slides (odp, ppt, pptx)
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

## License

This project is licensed with [BSD-2-Clause](./LICENSE)

This is free, libre, and open-source software. It comes down to four essential freedoms [[ref]](https://seirdy.one/2021/01/27/whatsapp-and-the-domestication-of-users.html#fnref:2):

- The freedom to run the program as you wish, for any purpose
- The freedom to study how the program works, and change it so it does your computing as you wish
- The freedom to redistribute copies so you can help others
- The freedom to distribute copies of your modified versions to others
