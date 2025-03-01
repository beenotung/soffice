import { expect } from 'chai'
import { convertTo, convertToPDF, Format, is_soffice_installed } from './index'
import { existsSync, renameSync, unlinkSync, writeFileSync } from 'fs'

describe('check if soffice is installed', () => {
  it('should return true if LibreOffice is installed', () => {
    expect(is_soffice_installed()).to.be.true
  })
})

describe('format conversion', () => {
  before(async () => {
    let res = await fetch('https://www.example.com')
    let text = await res.text()
    writeFileSync('res/test.html', text)
  })

  function test(from: Format, to: Format) {
    it(`should convert ${from} to ${to}`, async () => {
      let input_file = `res/test.${from}`
      let output_file = `res/test.${to}`

      delete_file(output_file)

      let result = await convertTo({
        input_file,
        convert_to: to,
      })
      expect(result).to.equal(output_file)

      expect(existsSync(output_file)).to.be.true
    }).timeout(10 * 1000)
  }

  function test_to_pdf(from: Format) {
    it(`should convert ${from} to pdf`, async () => {
      let input_file = `res/test.${from}`
      let output_file = `res/test.pdf`

      delete_file(output_file)

      let result = await convertToPDF(input_file)
      expect(result).to.equal(output_file)
    })
  }

  describe('from html', () => {
    test('html', 'pdf')
    test('html', 'odt')
    test('html', 'docx')
    test('html', 'doc')
  })

  describe('to pdf', () => {
    test_to_pdf('html')
    test_to_pdf('odt')
    test_to_pdf('docx')
    test_to_pdf('doc')
    test_to_pdf('odp')
    test_to_pdf('pptx')
    test_to_pdf('ppt')
    test_to_pdf('ods')
    test_to_pdf('xlsx')
    test_to_pdf('xls')
  })

  describe('word documents', () => {
    test('odt', 'docx')
    test('odt', 'doc')

    test('doc', 'docx')
    test('doc', 'odt')

    test('docx', 'doc')
    test('docx', 'odt')
  })

  describe('spreadsheets', () => {
    test('ods', 'xlsx')
    test('ods', 'xls')

    test('xls', 'xlsx')
    test('xls', 'ods')

    test('xlsx', 'xls')
    test('xlsx', 'ods')
  })

  describe('presentation slides', () => {
    test('odp', 'pptx')
    test('odp', 'ppt')

    test('ppt', 'pptx')
    test('ppt', 'odp')

    test('pptx', 'ppt')
    test('pptx', 'odp')
  })

  describe('to html', () => {
    test('odt', 'html')
    test('docx', 'html')
    test('doc', 'html')
    test('odp', 'html')
    test('pptx', 'html')
    test('ppt', 'html')
    test('ods', 'html')
    test('xlsx', 'html')
    test('xls', 'html')
  })

  it('should throw error if not supported', async () => {
    // backup the file
    renameSync('res/test.ods', 'res/test.ods.bak')
    let error: Error | null = null
    try {
      await convertTo({
        input_file: 'res/test.html',
        convert_to: 'ods',
      })
    } catch (err) {
      error = err as Error
    }
    renameSync('res/test.ods.bak', 'res/test.ods')
    expect(error).to.be.instanceOf(Error)
    expect(error!.message).to.equal(
      'Not supported to convert from .html to .ods',
    )
  })
})

function delete_file(file: string) {
  if (existsSync(file)) {
    unlinkSync(file)
  }
}
