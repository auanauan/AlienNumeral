// Simple test implementation for Alien Numeral Converter
class AlienNumeralConverter {
    constructor() {
        this.symbolValues = {
            'A': 1,
            'B': 5,
            'Z': 10,
            'L': 50,
            'C': 100,
            'D': 500,
            'R': 1000
        };
        this.subtractionPairs = {
            'AB': 4,   // A before B
            'AZ': 9,   // A before Z
            'ZL': 40,  // Z before L
            'ZC': 90,  // Z before C
            'CD': 400, // C before D
            'CR': 900  // C before R
        };
    }

    convert(alienNumeral) {
        if (!alienNumeral || !this.isValidAlienNumeral(alienNumeral)) {
            throw new Error('Invalid Alien numeral');
        }

        let total = 0;
        let i = 0;

        while (i < alienNumeral.length) {
            // Check for subtraction pairs first
            if (i < alienNumeral.length - 1) {
                const pair = alienNumeral.substring(i, i + 2);
                if (this.subtractionPairs.hasOwnProperty(pair)) {
                    total += this.subtractionPairs[pair];
                    i += 2;
                    continue;
                }
            }

            // Single symbol
            const symbol = alienNumeral[i];
            if (this.symbolValues.hasOwnProperty(symbol)) {
                total += this.symbolValues[symbol];
                i++;
            } else {
                throw new Error(`Invalid symbol: ${symbol}`);
            }
        }

        return total;
    }

    isValidAlienNumeral(numeral) {
        const validSymbols = /^[ABZLCDR]+$/;
        return validSymbols.test(numeral);
    }
}

// Run tests
console.log('🧪 Testing Alien Numeral Converter');
console.log('===================================');

const converter = new AlienNumeralConverter();

const testCases = [
    { input: 'AAA', expected: 3 },
    { input: 'LBAAA', expected: 58 },
    { input: 'RCRZCAB', expected: 1994 },
    { input: 'AB', expected: 4 },
    { input: 'AZ', expected: 9 },
    { input: 'ZL', expected: 40 },
    { input: 'ZC', expected: 90 },
    { input: 'CD', expected: 400 },
    { input: 'CR', expected: 900 }
];

let passed = 0;
let total = testCases.length;

testCases.forEach(test => {
    try {
        const result = converter.convert(test.input);
        const isCorrect = result === test.expected;
        console.log(`${isCorrect ? '✅' : '❌'} ${test.input} = ${result} (expected: ${test.expected})`);
        if (isCorrect) passed++;
    } catch (error) {
        console.log(`❌ ${test.input} - Error: ${error.message}`);
    }
});

console.log('===================================');
console.log(`Results: ${passed}/${total} tests passed`);
console.log(passed === total ? '🎉 All tests passed!' : '❌ Some tests failed');