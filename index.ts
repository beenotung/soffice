import { execSync } from 'child_process'
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

export function convert_to_pdf(input_file: string) {
  let ext = extname(input_file)
  let output_file = input_file.slice(0, input_file.length - ext.length) + '.pdf'
  let dir = dirname(input_file)
  execSync(
    `soffice --headless --convert-to pdf:writer_pdf_Export ${input_file} --outdir ${dir}`,
  )
  return output_file
}
