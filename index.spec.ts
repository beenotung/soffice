import { expect } from 'chai'
import { convert_to_pdf, is_soffice_installed } from './index'
import { existsSync, unlinkSync, writeFileSync } from 'fs'

describe('check if soffice is installed', () => {
  it('should return true if LibreOffice is installed', () => {
    expect(is_soffice_installed()).to.be.true
  })
})

describe('pdf conversion', () => {
  before(async () => {
    let res = await fetch('https://www.example.com')
    let text = await res.text()
    writeFileSync('res/test.html', text)
  })
  it('should convert html to pdf', () => {
    let input_file = 'res/test.html'
    let output_file = 'res/test.pdf'
    if (existsSync(output_file)) {
      unlinkSync(output_file)
    }
    expect(convert_to_pdf(input_file)).to.equals(output_file)
    expect(existsSync(output_file)).to.be.true
  })
})
