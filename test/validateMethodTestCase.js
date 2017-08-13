var layoutsOrig = window.layouts;
var layouts = window.layouts;
var domUtils = window.domUtils;
var validate;
var $test1;
var $test2;
var $test3;
var $test4;
var $test5;


describe('Validate Method', function() {
  
	beforeEach(function(){
		layouts = Validation._.clone(layoutsOrig);
		domUtils.createBody();
		validate = new Validation({
			layout: layouts.sample,
			form: 'form'
		}, $('form'));
		$test1 = $('.test1');
		$test2 = $('.test2');
	});
	
	it('Getting Form Element', function() {
		chai.assert.equal(validate.data.$form[0].nodeName, 'FORM');
		validate = new Validation({
			layout: layouts.sample,
			form: 'for'
		});
		chai.assert.equal(validate.data.$form[0].nodeName, 'BODY');
		validate = new Validation({
			layout: layouts.sample,
			form: 'div'
		});
		chai.assert.equal(validate.data.$form[0].nodeName, 'DIV');
		validate = new Validation({
			layout: layouts.sample,
			form: 'form'
		}, $('for'));
		chai.assert.equal(validate.data.$form[0].nodeName, 'BODY');
		validate = new Validation({
			layout: layouts.sample,
			form: 'form'
		}, $('form')[0]);
		chai.assert.equal(validate.data.$form[0].nodeName, 'FORM');
	});

	it('Name', function() {
		validate = new Validation({
			layout: layouts.name,
		}, $('form'));
		$test1.val('validate');
		//tested below 2 lines only in case to check if it iterate over 2 selector
		chai.assert.equal($test1.attr('selector'), '.test1');
		chai.assert.equal($test2.attr('selector'), '.test2');
		chai.assert.equal(validate.validate(), true);
		$test1.val('vali%date');
		chai.assert.equal(validate.validate(), false);
		$test1.val('validate@');
		chai.assert.equal(validate.validate(), false);
	});
	
	it('Number', function() {
		validate = new Validation({
			layout: layouts.number,
		}, $('form'));
		$test1.val('123456');
		chai.assert.equal(validate.validate(), true);
		$test1.val('vali%date');
		chai.assert.equal(validate.validate(), false);
		$test1.val('valida1234');
		chai.assert.equal(validate.validate(), false);
	});

	it('Decimal', function() {
		validate = new Validation({
			layout: layouts.decimal,
		}, $('form'));
		$test1.val('123456');
		chai.assert.equal(validate.validate(), true);
		$test1.val('12345.254');
		chai.assert.equal(validate.validate(), true);
		$test1.val('valida.1234');
		chai.assert.equal(validate.validate(), false);
	});

	it('Username', function() {
		validate = new Validation({
			layout: layouts.username,
		}, $('form'));
		$test1.val('123456');
		chai.assert.equal(validate.validate(), true);
		$test1.val('vali_date');
		chai.assert.equal(validate.validate(), true);
		$test1.val('valida_1234');
		chai.assert.equal(validate.validate(), true);
		$test1.val('valida_ 1234');
		chai.assert.equal(validate.validate(), false);
	});

	it('Password', function() {
		validate = new Validation({
			layout: layouts.password,
		}, $('form'));
		$test1.val('123456');
		chai.assert.equal(validate.validate(), true);
		$test1.val('vali%date');
		chai.assert.equal(validate.validate(), true);
		$test1.val('valid!a1234');
		chai.assert.equal(validate.validate(), false);
	});

	it('Email', function() {
		validate = new Validation({
			layout: layouts.email,
		}, $('form'));
		$test1.val('xyz@gmail.com');
		chai.assert.equal(validate.validate(), true);
		$test1.val('xyz@gmail.co.in');
		chai.assert.equal(validate.validate(), true);
		$test1.val('valida1234');
		chai.assert.equal(validate.validate(), false);
		$test1.val('xyz.gmail.co.in');
		chai.assert.equal(validate.validate(), false);
	});

	it('Url', function() {
		validate = new Validation({
			layout: layouts.url,
		}, $('form'));
		$test1.val('http://www.google.com');
		chai.assert.equal(validate.validate(), true);
		$test1.val('https://www.google.com');
		chai.assert.equal(validate.validate(), true);
		$test1.val('valida1234');
		chai.assert.equal(validate.validate(), false);
		$test1.val('www.goo.com');
		chai.assert.equal(validate.validate(), false);
	});

	it('Equal To', function() {
		validate = new Validation({
			layout: layouts.equalTo,
		}, $('form'));
		$test1.val('test');
		$test2.val('test');
		chai.assert.equal(validate.validate(), true);
		$test2.val('test1');
		chai.assert.equal(validate.validate(), false);
	});

	it('Equal To', function() {
		validate = new Validation({
			layout: layouts.equalTo,
		}, $('form'));
		$test1.val('test');
		$test2.val('test');
		chai.assert.equal(validate.validate(), true);
		$test2.val('test1');
		chai.assert.equal(validate.validate(), false);
	});

	it('Max Length', function() {
		validate = new Validation({
			layout: layouts.maxLength,
		}, $('form'));
		$test1.val('vali');
		chai.assert.equal(validate.validate(), true);
		$test1.val('validate');
		chai.assert.equal(validate.validate(), false);
	});

	it('Min Length', function() {
		validate = new Validation({
			layout: layouts.minLength,
		}, $('form'));
		$test1.val('vali');
		chai.assert.equal(validate.validate(), true);
		$test1.val('v');
		chai.assert.equal(validate.validate(), false);
	});

	it('Range Length', function() {
		validate = new Validation({
			layout: layouts.rangeLength,
		}, $('form'));
		$test1.val('vali');
		chai.assert.equal(validate.validate(), true);
		$test1.val('validate');
		chai.assert.equal(validate.validate(), false);
	});

	it('Range Value', function() {
		validate = new Validation({
			layout: layouts.rangeValue,
		}, $('form'));
		$test1.val('10');
		chai.assert.equal(validate.validate(), true);
		$test1.val('30');
		chai.assert.equal(validate.validate(), false);
		$test1.val('9');
		chai.assert.equal(validate.validate(), false);
	});

	it('Min Value', function() {
		validate = new Validation({
			layout: layouts.minValue,
		}, $('form'));
		$test1.val('11');
		chai.assert.equal(validate.validate(), true);
		$test1.val('9');
		chai.assert.equal(validate.validate(), false);
		$test1.val('test');
		chai.assert.equal(validate.validate(), false);
	});

	it('Max Value', function() {
		validate = new Validation({
			layout: layouts.maxValue,
		}, $('form'));
		$test1.val('11');
		chai.assert.equal(validate.validate(), true);
		$test1.val('21');
		chai.assert.equal(validate.validate(), false);
		$test1.val('test');
		chai.assert.equal(validate.validate(), false);
	});

	it('Value Equal To', function() {
		validate = new Validation({
			layout: layouts.valueEqualTo,
		}, $('form'));
		$test1.val('10');
		chai.assert.equal(validate.validate(), true);
		$test1.val('test');
		chai.assert.equal(validate.validate(), true);
		$test1.val('11');
		chai.assert.equal(validate.validate(), false);
	});

	it('Value Not Equal To', function() {
		validate = new Validation({
			layout: layouts.valueNotEqualTo,
		}, $('form'));
		$test1.val('11');
		chai.assert.equal(validate.validate(), true);
		$test1.val('test1');
		chai.assert.equal(validate.validate(), true);
		$test1.val('10');
		chai.assert.equal(validate.validate(), false);
	});

});