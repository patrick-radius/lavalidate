const isNil = require('lodash/isNil')
const isEmpty = require('lodash/isEmpty')
// import {email, validateURL, validatePhone} from './form'
const parse = require('date-fns/parse')

const notEmpty = x => !isEmpty(x)

function required(value) {
  return isEmpty(value) ? '{{field}} is required' : true
}

function present(value) {
  return typeof value === 'undefined' ? '{{field}} should be present' : true
}

function string(value) {
  return typeof value === 'string' ? true : '{{field}} should be a string'
}

function numeric(value) {
  return !isNaN(parseFloat(value)) ? true : '{{field}} should be a number'
}

function size(value, size) {
  if (numeric(value) === true) {
    return parseFloat(value) >= size ? true : `{{field}} should be at least ${size}`
  }
  if (isNil(value)) {
    return `{{field}} should be at least ${size}`
  }
  return value.length >= size ? true : `{{field}} should be at least ${size}`
}


function reg(expression, message) {
  return value => string(value) === true && value.match(expression) ? true : message
}

function date(value) {
  return reg(/^[0-9]{2}-[0-9]{2}-[0-9]{4}$/, '{{field}} should be a date')(value)
}

const validatorMap = {
  date,
  required,
  string,
  size,
  numeric,
  present,
  email: reg(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, '{{field}} should be an e-mail'),
  alpha: reg(/^[a-zA-Z]+$/i, '{{field}} should only contain alpha characters'),
  alpha_dash: reg(/^[a-zA-Z-_]+$/i, '{{field}} should only contain alpha characters and dashes'),
  alpha_num: reg(/^[a-zA-Z0-9]+$/i, '{{field}} should only contain alphanumeric characters')
}

const validator = (value, rules = '', form = {}) => {
  const _rules = rules.split('|').filter(notEmpty)

  return _rules.reduce((memo, ruleSet) => {
    const [rule, ...params] = ruleSet.split(':')

    const result = validatorMap[rule](value, ...params, form)
    if (result === true) return memo

    if (Array.isArray(memo)) return [...memo, result]

    return [result]
  }, true)
}

module.exports = validator
