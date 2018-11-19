const validator = require('./index')

describe('/utils/validator', () => {
  it('returns true when rules is empty', () => {
    const result = validator('foo')
    expect(result).toEqual(true)
  })

  it('parses multiple rules', () => {
    expect(validator('3', 'required|numeric|size:3')).toEqual(true)
    expect(validator('foo', 'required|numeric|size:3')).toEqual(['{{field}} should be a number'])
    expect(validator(null, 'numeric|required|size:3')).toEqual(['{{field}} should be a number', '{{field}} is required', 'length of {{field}} should be 3'])
  })

  describe('rules', () => {
    it('required', () => {
      expect(validator('foo', 'required')).toEqual(true)
      expect(validator(undefined, 'required')).toEqual(['{{field}} is required'])
    })

    it('string', () => {
      expect(validator('foo', 'string')).toEqual(true)
      expect(validator(1, 'string')).toEqual(['{{field}} should be a string'])
      expect(validator(undefined, 'string')).toEqual(['{{field}} should be a string'])
    })

    it('size', () => {
      expect(validator('foo', 'size:3')).toEqual(true)
      expect(validator('foo', 'size:5')).toEqual(['{{field}} should have a length of 5'])

      expect(validator(10, 'size:10')).toEqual(true)
      expect(validator(9, 'size:10')).toEqual(['length of {{field}} should be 10'])
    })

    it('numeric', () => {
      expect(validator('foo', 'numeric')).toEqual(['{{field}} should be a number'])
      expect(validator('42', 'numeric')).toEqual(true)
      expect(validator(10, 'numeric')).toEqual(true)
    })

    it('alpha', () => {
      const msg = ['{{field}} should only contain alpha characters']
      expect(validator('foo', 'alpha')).toEqual(true)
      expect(validator('42', 'alpha')).toEqual(msg)
      expect(validator(10, 'alpha')).toEqual(msg)
      expect(validator('foo-bar', 'alpha')).toEqual(msg)
      expect(validator('foo_bar', 'alpha')).toEqual(msg)
      expect(validator('foo@bar', 'alpha')).toEqual(msg)
    })

    it('alpha_dash', () => {
      const msg = ['{{field}} should only contain alpha characters and dashes']
      expect(validator('foo', 'alpha_dash')).toEqual(true)
      expect(validator('42', 'alpha_dash')).toEqual(msg)
      expect(validator(10, 'alpha_dash')).toEqual(msg)
      expect(validator('foo-bar', 'alpha_dash')).toEqual(true)
      expect(validator('foo_bar', 'alpha_dash')).toEqual(true)
      expect(validator('foo@bar', 'alpha_dash')).toEqual(msg)
    })

    it('alpha_num', () => {
      const msg = ['{{field}} should only contain alphanumeric characters']
      expect(validator('foo', 'alpha_num')).toEqual(true)
      expect(validator('42', 'alpha_num')).toEqual(true)
      expect(validator(10, 'alpha_num')).toEqual(msg)
      expect(validator('foo-bar', 'alpha_num')).toEqual(msg)
      expect(validator('foo_bar', 'alpha_num')).toEqual(msg)
      expect(validator('foo@bar.nl', 'alpha_num')).toEqual(msg)
    })

    it('email', () => {
      const msg = ['{{field}} should be an e-mail']
      expect(validator('foo', 'email')).toEqual(msg)
      expect(validator('42', 'email')).toEqual(msg)
      expect(validator(10, 'email')).toEqual(msg)
      expect(validator('foo-bar', 'email')).toEqual(msg)
      expect(validator('foo_bar', 'email')).toEqual(msg)
      expect(validator('foo@bar.nl', 'email')).toEqual(true)
    })

    it('present', () => {
      const msg = ['{{field}} should be present']
      expect(validator('foo', 'present')).toEqual(true)
      expect(validator('42', 'present')).toEqual(true)
      expect(validator(10, 'present')).toEqual(true)
      expect(validator('foo-bar', 'present')).toEqual(true)
      expect(validator('foo_bar', 'present')).toEqual(true)
      expect(validator('foo@bar.nl', 'present')).toEqual(true)
      expect(validator('', 'present')).toEqual(true)
      expect(validator(undefined, 'present')).toEqual(msg)
    })

    it('date', () => {
      const msg = ['{{field}} should be a date']
      expect(validator('foo', 'date')).toEqual(msg)
      expect(validator('42', 'date')).toEqual(msg)
      expect(validator(10, 'date')).toEqual(msg)
      expect(validator('foo-bar', 'date')).toEqual(msg)
      expect(validator('foo_bar', 'date')).toEqual(msg)
      expect(validator('foo@bar.nl', 'date')).toEqual(msg)
      expect(validator('', 'date')).toEqual(msg)
      expect(validator(undefined, 'date')).toEqual(msg)
      expect(validator('25-05-2019', 'date')).toEqual(true)
    })

    it('between', () => {
      const numbermsg = ['{{field}} should be between 5 and 20']
      const lengthmsg = ['length of {{field}} should be between 5 and 20']

      expect(validator(10, 'between:5:20')).toEqual(true)
      expect(validator('6', 'between:5:20')).toEqual(true)
      expect(validator('42', 'between:5:20')).toEqual(numbermsg)

      expect(validator('foo', 'between:5:20')).toEqual(lengthmsg)
      expect(validator('foo', 'between:0:4')).toEqual(true)
      expect(validator(['a','b', 'c'], 'between:0:4')).toEqual(true)
      expect(validator(['a','b', 'c', 'd', 'e'], 'between:0:4')).toEqual(['length of {{field}} should be between 0 and 4'])

      expect(validator('foo-bar', 'between:5:20')).toEqual(true)
      expect(validator('foo_bar', 'between:5:20')).toEqual(true)
      expect(validator('foo@bar.nl', 'between:5:20')).toEqual(true)
      expect(validator('', 'between:5:20')).toEqual(lengthmsg)
      expect(validator(undefined, 'between:5:20')).toEqual(lengthmsg)
      expect(validator('25-05-2019', 'between:5:20')).toEqual(true)
    })

    it('Integer', () => {
      const msg = ['{{field}} should be an integer']

      expect(validator(10, 'integer')).toEqual(true)
      expect(validator('6', 'integer')).toEqual(true)
      expect(validator('42', 'integer')).toEqual(true)
      expect(validator(10.2, 'integer')).toEqual(msg)

      expect(validator('foo', 'integer')).toEqual(msg)
      expect(validator('foo', 'integer')).toEqual(msg)
      expect(validator(['a','b', 'c'], 'integer')).toEqual(msg)

      expect(validator('foo-bar', 'integer')).toEqual(msg)
      expect(validator('foo_bar', 'integer')).toEqual(msg)
      expect(validator('foo@bar.nl', 'integer')).toEqual(msg)
      expect(validator('', 'integer')).toEqual(msg)
      expect(validator(undefined, 'integer')).toEqual(msg)
      expect(validator('25-05-2019', 'integer')).toEqual(msg)
    })
  })
})
