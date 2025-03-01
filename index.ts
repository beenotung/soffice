import { execSync, spawn } from 'child_process'
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
  const { dir, output_file } = extractFileDetails(
    options.input_file,
    options.convert_to,
  )
  return new Promise((resolve, reject) => {
    let child = spawn('soffice', [
      '--headless',
      '--writer',
      '--convert-to',
      options.convert_to,
      options.input_file,
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
    child.on('exit', code => {
      if (code === 0) resolve(output_file)
      else
        reject(
          new ChildProcessError(
            `Failed to convert file "${options.input_file}" into ${options.convert_to}`,
            code,
            stdout,
            stderr,
          ),
        )
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
