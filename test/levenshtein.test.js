const calculateLevenshteinDistance = require('../src/utils/calculateLevenshteinDistance')

describe('calculateLevenshteinDistance', () => {
    test('Проверка, когда обе строки пустые:', () => {
        expect(calculateLevenshteinDistance('', '')).toBe(0)
    })

    test('Проверка, когда одна из строк пустая', () => {
        expect(calculateLevenshteinDistance('abc', '')).toBe(3)
        expect(calculateLevenshteinDistance('', 'abc')).toBe(3)
    })

    test('Проверка, когда строки отличаются на один символ', () => {
        expect(calculateLevenshteinDistance('abc', 'abd')).toBe(1)
    })

    test('Проверка для строк с несколькими различиями', () => {
        expect(calculateLevenshteinDistance('kitten', 'sitting')).toBe(3)
        expect(calculateLevenshteinDistance('flaw', 'lawn')).toBe(2)
    })

    test('Проверка для полностью разных строк', () => {
        expect(calculateLevenshteinDistance('abc', 'def')).toBe(3)
    })

    test('Проверка для строк разной длины', () => {
        expect(calculateLevenshteinDistance('a', 'ab')).toBe(1)
        expect(calculateLevenshteinDistance('ab', 'a')).toBe(1)
        expect(calculateLevenshteinDistance('abc', 'ab')).toBe(1)
        expect(calculateLevenshteinDistance('ab', 'abc')).toBe(1)
    })

    test('Проверка для строк с повторяющимися символами', () => {
        expect(calculateLevenshteinDistance('aaa', 'aaaa')).toBe(1)
        expect(calculateLevenshteinDistance('aaaa', 'aaa')).toBe(1)
    })
})
