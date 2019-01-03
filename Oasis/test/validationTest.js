const assert = require('chai').assert;
const app = require('../assets/js/validation');

describe('App', function () {

    isEmptyTrueResult = app.isEmpty("x");
    isEmptyFalseResult = app.isEmpty("");
    describe('isEmpty()', function () {
        it('isEmpty should return error->`Can`t be empty`', function () {
            assert.equal(isEmptyFalseResult, "Can't be empty");
        });
        it('isEmpty should return `` ', function () {
            assert.equal(isEmptyTrueResult, "");
        });
    });

    isSelectedDivisionTrueResult = app.isSelectedDivision("Finance");
    isSelectedDivisionFalseResult = app.isSelectedDivision("-select division-");
    describe('isSelectedDivision()', function () {
        it('isSelectedDivison() should return error->`Must select a division`', function () {
            assert.equal(isSelectedDivisionFalseResult, "Must select a division");
        });
        it('isSelectedDivison() should return `` ', function () {
            assert.equal(isSelectedDivisionTrueResult, "");
        });
    });

    isSelectedSupervisorTrueResult = app.isSelectedSupervisor("s.tan");
    isSelectedSupervisorFalseResult = app.isSelectedSupervisor("-select supervisor-");
    describe('isSelectedSupervisor()', function () {
        it('isSelectedSupervisor() should return error->`Must select a supervisor`', function () {
            assert.equal(isSelectedSupervisorFalseResult, "Must select a supervisor");
        });
        it('isSelectedSupervisor() should return `` ', function () {
            assert.equal(isSelectedSupervisorTrueResult, "");
        });
    });

    isNumberTrueResult = app.isNumber(11);
    isNumberFalseResult = app.isNumber(-14);
    describe('isNumber()', function () {
        it('isNumber() should return error->`Must be valid positive number above 0`', function () {
            assert.equal(isNumberFalseResult, "Must be valid positive number above 0");
        });
        it('isNumber() should return ""', function () {
            assert.equal(isNumberTrueResult, "");
        });
    });

    // isAlphabetFalseResult=app.isAlphabet(11);
    // isAlphabetTrueResult=app.isAlphabet("aa");
    // describe('isAlphabet()', function () {
    //     it('isAplphabet() should return error->`Must be alphabet`', function () {
    //         assert.equal(isAlphabetFalseResult, "Must be alphabet");
    //     });
        
    //     it('isAplphabet() should return ``', function () {
    //         assert.equal(isAlphabetTrueResult, "");
    //     });
    // });    

});