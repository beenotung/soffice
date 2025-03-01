import { expect } from 'chai'
import { is_soffice_installed } from './index'

describe('check if soffice is installed', () => {
  it('should return true if LibreOffice is installed', () => {
    expect(is_soffice_installed()).to.be.true
  })
})
