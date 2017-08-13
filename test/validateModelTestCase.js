var layoutsOrig = window.layouts;
var layouts = window.layouts;
var domUtils = window.domUtils;
var validate;
var $test1;
var $test2;
var $test3;
var $test4;
var $test5;

//function(ruleName, defaultMsg, reg){
Validation.addValidation('underscore', 'New Regx', /^[_]+$/);
Validation.addValidation('onlyFn', 'New Fn', function(rd){return rd.value === 'fn';});

var origModel = {test1: {name: 'test1'}, test2: 'test2'};
var model;

describe('Validate Model', function() {
  
	beforeEach(function(){
		layouts = Validation._.clone(layoutsOrig);
		model = Validation._.clone(origModel);
		domUtils.createBody();
		$test1 = $('.test1');
		$test2 = $('.test2');
	});
	
	it('Simple Model Test', function() {
		validate = new Validation({
			layout: layouts.modelLayout,
			model: model
		});
		validate.resetErrors();
		chai.assert.equal(validate.validate(), false);
		chai.assert.equal($('.errorTest2').text() === layouts.modelLayout[1].messages.required, true);
	});

	it('Add Rule', function() {
		model.test1.last = 'last';
		validate = new Validation({
			layout: layouts.modelLayout,
			model: model
		});
		validate.resetErrors();
		validate.addRule({
			path: 'test2.name',
			rules: {
				required: true,
			},
			messages: {
				required: 'Invalid Number'
			},
			errorContainer: '.errorTest3'
		});
		chai.assert.equal(validate.validate(), false);
		chai.assert.equal($('.errorTest2').text() === '', true);
		chai.assert.equal($('.errorTest3').text() === 'Invalid Number', true);
	});

	it('Validate Using Identifier', function() {
		validate = new Validation({
			layout: layouts.modelLayout,
			model: model
		});
		validate.resetErrors();
		chai.assert.equal(validate.validate('test2'), false);
		chai.assert.equal($('.errorTest1').text() === '', true);
		chai.assert.equal($('.errorTest2').text() === layouts.modelLayout[1].messages.required, true);
	});

});