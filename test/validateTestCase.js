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

describe('Validate', function() {
  
	beforeEach(function(){
		layouts = Validation._.clone(layoutsOrig);
		domUtils.createBody();
		$test1 = $('.test1');
		$test2 = $('.test2');
	});
	
	it('Check Error Showing In Dom', function() {
		validate = new Validation({
			layout: layouts.sample
		}, $('form'));
		$test1.val('test_');
		$test1.val('12.3');
		validate.resetErrors();
		chai.assert.equal(validate.validate(), false);
		chai.assert.equal(domUtils.isError($test1, layouts.sample[0].messages.name), true);
		validate.hideError('.test1');
		chai.assert.equal(domUtils.hasErrorClass($test1), false);
		chai.assert.equal(domUtils.checkErrorMsg($test1, ''), true);
	});

	it('Validate only One Rule', function() {
		validate = new Validation({
			layout: layouts.sample
		}, $('form'));
		$test1.val('test_');
		$test2.val('test');
		validate.resetErrors();
		chai.assert.equal(validate.validate('.test1'), false);
		//check no other valdiation has been thrown
		chai.assert.equal(domUtils.hasErrorClass($test2), false);
		chai.assert.equal(validate.validate('.test2'), false);
		chai.assert.equal(domUtils.isError($test2, layouts.sample[1].messages.decimal), true);
	});

	it('Validate Rule Without Error', function() {
		validate = new Validation({
			layout: layouts.sample
		}, $('form'));
		$test1.val('test_');
		validate.resetErrors();
		chai.assert.equal(validate.isValid('.test1'), false);
		chai.assert.equal(domUtils.hasErrorClass($test1), false);
	});

	it('Add Rule', function() {
		validate = new Validation({
			layout: layouts.name,
		}, $('form'));
		$test1.val('test_');
		$test1.val('');
		validate.resetErrors();
		validate.addRule({
			selector: '.test2',
			rules: {
					required: true,
			},
			messages: {
				required: 'Required'
			}
		});
		chai.assert.equal(validate.isValid('.test2'), false);
		chai.assert.equal(validate.validate('.test2'), false);
		chai.assert.equal(domUtils.isError($test2, 'Required'), true);
	});

	it('Remove Rule', function() {
		validate = new Validation({
			layout: layouts.sample
		}, $('form'));
		$test1.val('test');
		$test2.val('test');
		validate.resetErrors();
		validate.removeRule('.test2');
		//removing above line should fail this test case
		chai.assert.equal(validate.validate('.test2'), true);
	});

	it('Function In Rule', function() {
		validate = new Validation({
			layout: layouts.fn,
		}, $('form'));
		$test1.val('pass');
		validate.resetErrors();
		chai.assert.equal(validate.validate(), true);
		$test1.val('fail');
		chai.assert.equal(validate.validate(), false);
		chai.assert.equal(domUtils.isError($test1, layouts.fn[0].messages.fn), true);
	});

	it('Add Global Validation Regx', function() {
		validate = new Validation({
			layout: layouts.underscore,
		}, $('form'));
		$test1.val('_');
		validate.resetErrors();
		chai.assert.equal(validate.validate(), true);
		$test1.val('fail');
		chai.assert.equal(validate.validate(), false);
		chai.assert.equal(domUtils.isError($test1, layouts.underscore[0].messages.underscore), true);
	});

	it('Add Global Validation Fn', function() {
		validate = new Validation({
			layout: layouts.onlyFn,
		}, $('form'));
		$test1.val('fn');
		validate.resetErrors();
		chai.assert.equal(validate.validate(), true);
		$test1.val('fail');
		chai.assert.equal(validate.validate(), false);
		chai.assert.equal(domUtils.isError($test1, layouts.onlyFn[0].messages.onlyFn), true);
	});	

	it('Error In Error Contianer', function() {
		layouts.sample[0].errorContainer = '.errorTest1';
		validate = new Validation({
			layout: layouts.sample,
		}, $('form'));
		$test1.val('');
		validate.resetErrors();
		chai.assert.equal(validate.validate(), false);
		chai.assert.equal($('.errorTest1').text() === layouts.sample[0].messages.required, true);
	});

	it('Default Behavoiur', function() {
		validate = new Validation({
			layout: layouts.sample,
		}, $('form'));
		$test1.val('Test');
		$test2.val('Test');
		validate.resetErrors();
		$test2.keyup();
		chai.assert.equal(domUtils.isError($test2, layouts.sample[1].messages.decimal), true);
	});

	it('On Submit', function() {
		validate = new Validation({
			layout: layouts.sample,
			errorOnSubmit: true
		}, $('form'));
		validate.resetErrors();
		$test1.val('Test');
		$test2.val('Test');
		$('form').submit();
		chai.assert.equal(domUtils.isError($test2, layouts.sample[1].messages.decimal), true);
	});

	it('Error On Change', function() {
		validate = new Validation({
			layout: layouts.sample,
			errorOnChange: true
		}, $('form'));
		$test1.val('Test');
		$test2.val('Test')	;
		validate.resetErrors();
		$test2.keyup();
		chai.assert.equal(domUtils.isError($test2, layouts.sample[1].messages.decimal), false);
		$test2.focusout();
		chai.assert.equal(domUtils.isError($test2, layouts.sample[1].messages.decimal), true);
		chai.assert.equal(domUtils.hasErrorClass($test1), false);
	});

	it('Show Error', function() {
		layouts.sample[0].showError = function(data){
			chai.assert.equal(data.type, 'error');
		}
		validate = new Validation({
			layout: layouts.sample
		}, $('form'));
		$test1.val('');
		validate.resetErrors();
		$test1.keyup();
	});

	it('Hide Error', function() {
		layouts.sample[0].hideError = function(data){
			chai.assert.equal(data.type, 'success');
		}
		validate = new Validation({
			layout: layouts.sample
		}, $('form'));
		$test1.val('test');
		validate.resetErrors();
		$test1.keyup();
	});

	it('Get Value', function() {
		layouts.sample[0].getValue = function(data){
			return;
		}
		validate = new Validation({
			layout: layouts.sample
		}, $('form'));
		$test1.val('test');
		validate.resetErrors();
		chai.assert.equal(validate.validate(), false);
		chai.assert.equal(domUtils.isError($test1, layouts.sample[0].messages.required), true);
	});

});