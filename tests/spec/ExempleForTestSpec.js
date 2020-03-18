describe('ExempleForTest', function(){
    const exempleForTests = require('../../src/app/exempleForTest');

    it('Should add two numbers', function(){
        const result = exempleForTests.add(4,5);

        expect(result).toBe(9);
    });
});