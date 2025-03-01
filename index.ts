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

function extractFileDetails(input_file: string) {
  let ext = extname(input_file)
  let output_file = input_file.slice(0, input_file.length - ext.length) + '.pdf'
  let dir = dirname(input_file)
  return { ext, output_file, dir }
}

export function convertTo(options: { input_file: string; convert_to: string }) {
  const { dir, output_file } = extractFileDetails(options.input_file)
  return new Promise((resolve, reject) => {
    let child = spawn('soffice', [
      '--headless',
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

export function convertToPdf(input_file: string) {
  return convertTo({
    input_file,
    convert_to: 'pdf:writer_pdf_Export',
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
