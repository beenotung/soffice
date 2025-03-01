import { execSync } from 'child_process'

export function is_soffice_installed() {
  try {
    let output = execSync('soffice --version').toString()
    return output.includes('LibreOffice')
  } catch (error) {
    // e.g. not in PATH
    return false
  }
}
