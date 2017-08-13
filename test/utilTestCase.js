var layoutsOrig = window.layouts;
var layouts = window.layouts;
var domUtils = window.domUtils;
var validate;
var $test1;
var $test2;
var $test3;
var $test4;
var $test5;
var element;
var value;
var type;

describe('Util', function() {
	
	beforeEach(function(){
		layouts = Validation._.clone(layoutsOrig);
		domUtils.createBody();

		element = $('.test1')[0];
		validate = new Validation({
			layout: layouts.sample,
			form: 'form'
		}, $('form'));
		layout = layouts.sample[0];
		value = 'test';
		type = 'success';
	});
	
	it('Call Method', function() {
		var ruleKey = 'required';
		layout.rules[ruleKey] = true;
		
		var fn = function(data){
			chai.assert.equal(layout, data.layout);
			chai.assert.equal(value, data.value);
			chai.assert.equal(element, data.element);
			chai.assert.equal(type, data.type);
			chai.assert.equal(ruleKey, data.ruleKey);
			chai.assert.equal(true, data.ruleValue);
		}
		Validation.util.callMethod(fn, layout, ruleKey, element, value, type);
	});
	
	it('Check Optional', function() {
		var rule1 = {maxLength: 5, required: true};
		var rule2 = {maxLength: 5, minLength: 5};
		
		chai.assert.equal(false, Validation.util.checkOptional(rule1));
		chai.assert.equal(true, Validation.util.checkOptional(rule2));
	});
	
	it('Get Message', function() {
		var messages = {required: 'Required', maxLength: 'Max {0}', rangeLength: 'Range {0} and {1}'};
		
		chai.assert.equal('Required', Validation.util.getMessage(messages, 'required', true));
		chai.assert.equal('Max 5', Validation.util.getMessage(messages, 'maxLength', 5));
		chai.assert.equal('Range 2 and 5', Validation.util.getMessage(messages, 'rangeLength', [2, 5]));
		chai.assert.equal('Please enter a value less than or equal to 100.', Validation.util.getMessage(messages, 'maxValue', 100));
		chai.assert.equal('', Validation.util.getMessage(messages, 'rangeLengt', [2, 5]));
		chai.assert.equal('Range 2 and {1}', Validation.util.getMessage(messages, 'rangeLength', 2));
		chai.assert.equal('Range 1 and 2', Validation.util.getMessage(messages, 'rangeLength', [1,2,3]));
	});
	
	it('Is Element', function() {
		var element1 = $('<input/>')[0];
		var element2 = $('<input type="radio"/>')[0];
		var element3 = $('body')[0];
		var element4 = $('html')[0];
		
		chai.assert.equal(true, Validation.util.isElement(element1));
		chai.assert.equal(true, Validation.util.isElement(element2));
		chai.assert.equal(true, Validation.util.isElement(element3));
		chai.assert.equal(true, Validation.util.isElement(element4));
		chai.assert.equal(false, Validation.util.isElement({}));
	});
	
	it('Get Element Value', function() {		
		var input1 = $('<input value=""/>');
		var input2 = $('<input value=" test "/>');
		var select1 = $('<select><option selected>select</option><select>');
		var select2 = $('<select><option selected value="IND">India</option><select>');
		var radio1 = $('<input type="radio" value="Test" checked/>');
		var radio2 = $('<input type="radio" value="Test"/>');
		var checkbox1 = $('<input type="radio" value="Test" checked/>');
		var checkbox2 = $('<input type="radio" value="Test"/>');

		chai.assert.equal(Validation.util.getElementValue(input1), '');
		chai.assert.equal(Validation.util.getElementValue(input2), 'test');
		chai.assert.equal(Validation.util.getElementValue(select1), 'select');
		chai.assert.equal(Validation.util.getElementValue(select2), 'IND');
		chai.assert.equal(Validation.util.getElementValue(radio1), true);
		chai.assert.equal(Validation.util.getElementValue(radio2), false);
		chai.assert.equal(Validation.util.getElementValue(checkbox1), true);
		chai.assert.equal(Validation.util.getElementValue(checkbox2), false);
	});
		
	it('Equal To', function() {
		var ruleKey = 'equalTo';
		var vd = getValidationData(ruleKey, '.test2', value);
		$('.test2').val('test');
		chai.assert.equal(true, Validation.util.equalTo(validate, vd));
		$('.test2').val('test1');
		chai.assert.equal(false, Validation.util.equalTo(validate, vd));
	});
	
	it('Max Length', function() {
		var ruleKey = 'maxLength';
		var vd = getValidationData(ruleKey, 5, value);
		chai.assert.equal(true, Validation.util.maxLength(validate, vd));
		vd.value = 'test123456';
		chai.assert.equal(false, Validation.util.maxLength(validate, vd));
		
	});
	
	it('Min Length', function() {
		var ruleKey = 'minLength';
		var vd = getValidationData(ruleKey, 5, 'test123456');
		chai.assert.equal(true, Validation.util.minLength(validate, vd));
		vd.value = 'test';
		chai.assert.equal(false, Validation.util.minLength(validate, vd));
		
	});
	
	it('Range Length', function() {
		var ruleKey = 'rangeLength';
		var vd = getValidationData(ruleKey, [2, 5], value);
		chai.assert.equal(true, Validation.util.rangeLength(validate, vd));
		vd.value = 't';
		chai.assert.equal(false, Validation.util.rangeLength(validate, vd));
		vd.value = undefined;
		chai.assert.equal(false, Validation.util.rangeLength(validate, vd));
		vd.value = 'test123';
		chai.assert.equal(false, Validation.util.rangeLength(validate, vd));
	});

	it('Range Value', function() {
		var ruleKey = 'rangeValue';
		var vd = getValidationData(ruleKey, [50, 100], '50');
		chai.assert.equal(true, Validation.util.rangeValue(validate, vd));
		vd.value = '100';
		chai.assert.equal(true, Validation.util.rangeValue(validate, vd));
		vd.value = '67';
		chai.assert.equal(true, Validation.util.rangeValue(validate, vd));
		vd.value = '49';
		chai.assert.equal(false, Validation.util.rangeValue(validate, vd));
		
		vd = getValidationData(ruleKey, [0, 1], '0.1');
		chai.assert.equal(true, Validation.util.rangeValue(validate, vd));
		vd.value = '0.999';
		chai.assert.equal(true, Validation.util.rangeValue(validate, vd));
		vd.value = '1.1';
		chai.assert.equal(false, Validation.util.rangeValue(validate, vd));
		vd.value = '-1';
		chai.assert.equal(false, Validation.util.rangeValue(validate, vd));
		
		vd = getValidationData(ruleKey, [0, 1], value);
		chai.assert.equal(false, Validation.util.rangeValue(validate, vd));
	});
	
	it('Min Value', function() {
		var ruleKey = 'minValue';
		var vd = getValidationData(ruleKey, 50.10, '50.11');
		chai.assert.equal(true, Validation.util.minValue(validate, vd));
		vd.value = '51';
		chai.assert.equal(true, Validation.util.minValue(validate, vd));
		vd.value = 'dd';
		chai.assert.equal(false, Validation.util.minValue(validate, vd));
		vd.value = '49';
		chai.assert.equal(false, Validation.util.minValue(validate, vd));		
	});
	
	it('Max Value', function() {
		var ruleKey = 'minValue';
		var vd = getValidationData(ruleKey, 50.10, '50.09');
		chai.assert.equal(true, Validation.util.maxValue(validate, vd));
		vd.value = '49';
		chai.assert.equal(true, Validation.util.maxValue(validate, vd));
		vd.value = '-11';
		chai.assert.equal(true, Validation.util.maxValue(validate, vd));
		vd.value = 'dd';
		chai.assert.equal(false, Validation.util.maxValue(validate, vd));
		vd.value = '51';
		chai.assert.equal(false, Validation.util.maxValue(validate, vd));		
	});
	
	it('Value Equal To', function() {
		var ruleKey = 'valueEqualTo';
		var vd = getValidationData(ruleKey, 50.10, 50.10);
		chai.assert.equal(true, Validation.util.valueEqualTo(validate, vd));
		vd = getValidationData(ruleKey, ['test1', 'test'], value);
		chai.assert.equal(true, Validation.util.valueEqualTo(validate, vd));
		vd = getValidationData(ruleKey, value, value);
		chai.assert.equal(true, Validation.util.valueEqualTo(validate, vd));
		vd = getValidationData(ruleKey, [], value);
		chai.assert.equal(false, Validation.util.valueEqualTo(validate, vd));
		vd = getValidationData(ruleKey, 50.10, '50.10');
		chai.assert.equal(false, Validation.util.valueEqualTo(validate, vd));
		vd = getValidationData(ruleKey, [], []);
		chai.assert.equal(false, Validation.util.valueEqualTo(validate, vd));
	});
	
	it('Value Not Equal To', function() {
		var ruleKey = 'valueNotEqualTo';
		var vd = getValidationData(ruleKey, 50.10, 50.09);
		chai.assert.equal(true, Validation.util.valueNotEqualTo(validate, vd));
		vd = getValidationData(ruleKey, ['test1', 'test2'], value);
		chai.assert.equal(true, Validation.util.valueNotEqualTo(validate, vd));
		vd = getValidationData(ruleKey, 'test1', value);
		chai.assert.equal(true, Validation.util.valueNotEqualTo(validate, vd));
		vd = getValidationData(ruleKey, [], value);
		chai.assert.equal(true, Validation.util.valueNotEqualTo(validate, vd));
		vd = getValidationData(ruleKey, value, value);
		chai.assert.equal(false, Validation.util.valueNotEqualTo(validate, vd));
		vd = getValidationData(ruleKey, ['test'], value);
		chai.assert.equal(false, Validation.util.valueNotEqualTo(validate, vd));
	});

});

function getValidationData(ruleKey, keyValue, val){
	layout.rules[ruleKey] = keyValue;
	return Validation.util.getValidationData(layout, ruleKey, element, val, type);
}