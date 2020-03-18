var ExempleForTest = function() {};

ExempleForTest.prototype.add = function(a, b) {
    return a + b;
};

ExempleForTest.prototype.subtract = function(a, b) {
    return a - b;
};

ExempleForTest.prototype.multiply = function(a, b) {
    return a * b;
};
module.exports = new ExempleForTest();