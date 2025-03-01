import { expect } from 'chai'
import { convertToPDF, is_soffice_installed } from './index'
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

    if (existsSync('res/test.pdf')) {
      unlinkSync('res/test.pdf')
    }
  })
  it('should convert html to pdf', async () => {
    let input_file = 'res/test.html'
    let output_file = 'res/test.pdf'
    expect(await convertToPDF(input_file)).to.equal(output_file)
    expect(existsSync(output_file)).to.be.true
  })
})
