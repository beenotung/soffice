import { execSync, spawn } from 'child_process'
import { access } from 'fs/promises'
import { dirname, extname } from 'path'

export function is_soffice_installed() {
  try {
    let output = execSync('soffice --version').toString()
    return output.includes('LibreOffice')
  } catch (error) {
    // e.g. not in PATH
    return false
  }
}

function extractFileDetails(input_file: string, convert_to: string) {
  let input_ext = extname(input_file)
  let output_ext = '.' + convert_to.split(':')[0]
  let output_file =
    input_file.slice(0, input_file.length - input_ext.length) + output_ext
  let dir = dirname(input_file)
  return { output_file, dir }
}

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

/**
 * Convert a file to a different format using LibreOffice cli `soffice`.
 *
 * @param options.input_file - The path to the input file.
 * @param options.convert_to - The format to convert the file to.
 *
 * @returns The path to the output file.
 */
export function convertTo(options: {
  input_file: string
  convert_to: Format
}): Promise<string> {
  let { input_file, convert_to } = options
  const { dir, output_file } = extractFileDetails(input_file, convert_to)
  return new Promise((resolve, reject) => {
    let child = spawn('soffice', [
      '--headless',
      '--writer',
      '--convert-to',
      convert_to,
      input_file,
      '--outdir',
      dir,
    ])
    child.on('error', reject)
    let stdout = ''
    child.stdout.on('data', data => {
      stdout += data.toString()
    })
    let stderr = ''
    child.stderr.on('data', data => {
      stderr += data.toString()
    })
    child.on('exit', async code => {
      try {
        if (code !== 0) {
          throw new ChildProcessError(
            `Failed to convert file "${input_file}" into ${convert_to}`,
            code,
            stdout,
            stderr,
          )
        }
        try {
          await access(output_file)
          resolve(output_file)
        } catch (error) {
          let from = extname(input_file)
          let to = extname(output_file)
          throw new Error(`Not supported to convert from ${from} to ${to}`)
        }
      } catch (error) {
        reject(error)
      }
    })
  })
}

export function convertToPDF(input_file: string) {
  return convertTo({
    input_file,
    convert_to: 'pdf',
  })
}

export function convertToHTML(input_file: string) {
  return convertTo({
    input_file,
    convert_to: 'html',
  })
}

export class ChildProcessError extends Error {
  constructor(
    message: string,
    public code: number | null,
    public stdout: string,
    public stderr: string,
  ) {
    super(message)
  }
}
