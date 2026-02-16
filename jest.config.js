/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/*.test.ts'],
    verbose: true,
    // uuid is an ESM-only package. We need to tell Jest to transform it.
    transformIgnorePatterns: [
        'node_modules/(?!uuid/)',
    ],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
        '^.+\\.jsx?$': ['ts-jest', { useESM: false }],
    },
};
