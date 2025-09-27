const fs = require('fs');

// Read and evaluate only the converter classes, not the DOM code
const tsCode = fs.readFileSync('converter.js', 'utf8');
const converterCode = tsCode.split('document.addEventListener')[0];
eval(converterCode);

const converter = new AlienNumeralConverter();

console.log('🧪 Testing Alien Numeral Converter');
console.log('===================================');

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

        // Show breakdown for complex examples
        if (test.input.length > 3) {
            const breakdown = converter.getBreakdown(test.input);
            console.log(`   Breakdown: ${breakdown.map(item => `${item.symbol}(${item.value})`).join(' + ')}`);
        }
    } catch (error) {
        console.log(`❌ ${test.input} - Error: ${error.message}`);
    }
});

console.log('===================================');
console.log(`Results: ${passed}/${total} tests passed`);
console.log(passed === total ? '🎉 All tests passed!' : '❌ Some tests failed');