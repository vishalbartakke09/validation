var test1 = '.test1';
var test2 = '.test2';
var test3 = '.test3';
var test4 = '.test4';
var test5 = '.test5';

var layouts = {
	sample: [
		{
			selector: test1,
			rules: {
				required: true,
				name: true,
			},
			messages:{
				required: 'Test is required',
				name: 'Name is invalid'
			}
		},
		{
			selector: test2,
			rules: {
				decimal: true
			},
			messages:{
				decimal: 'Decimal is invalid'
			}
		}
	],
	name: [
		{
			selector: test1,
			rules: {
				name: true,
			}
		}
	],
	number: [
		{
			selector: test1,
			rules: {
				number: true,
			}
		}
	],
	decimal: [
		{
			selector: test1,
			rules: {
				decimal: true,
			}
		}
	],
	username: [
		{
			selector: test1,
			rules: {
				username: true,
			}
		}
	],
	password: [
		{
			selector: test1,
			rules: {
				password: true,
			}
		}
	],
	email: [
		{
			selector: test1,
			rules: {
				email: true,
			}
		}
	],
	url: [
		{
			selector: test1,
			rules: {
				url: true,
			}
		}
	],
	equalTo: [
		{
			selector: test1,
			rules: {
				equalTo: test2,
			}
		}
	],
	maxLength: [
		{
			selector: test1,
			rules: {
				maxLength: 5,
			}
		}
	],
	minLength: [
		{
			selector: test1,
			rules: {
				minLength: 2,
			}
		}
	],
	rangeLength: [
		{
			selector: test1,
			rules: {
				rangeLength: [2, 5],
			}
		}
	],
	rangeValue: [
		{
			selector: test1,
			rules: {
				rangeValue: [10, 20],
			}
		}
	],
	maxValue: [
		{
			selector: test1,
			rules: {
				maxValue: 20,
			}
		}
	],
	minValue: [
		{
			selector: test1,
			rules: {
				minValue: 10,
			}
		}
	],
	valueEqualTo: [
		{
			selector: test1,
			rules: {
				valueEqualTo: ['10', 'test'],
			}
		}
	],
	valueNotEqualTo: [
		{
			selector: test1,
			rules: {
				valueNotEqualTo: ['10', 'test'],
			}
		}
	],
	fn: [
		{
			selector: test1,
			rules: {
				fn: function(rd){ return rd.value === 'pass';}
			},
			messages: {
				fn: 'This is function'
			}
		}
	],
	underscore: [
		{
			selector: test1,
			rules: {
				underscore: true
			},
			messages: {
				underscore: 'New Regx'
			}
		}
	],
	onlyFn: [
		{
			selector: test1,
			rules: {
				onlyFn: true
			},
			messages: {
				onlyFn: 'New Fn'
			}
		}
	],
	modelLayout:[{
		path: 'test1.name',
		rules: {
				required: true,
				name: true
		},
		messages: {
			required: 'This is required',
			name: 'Invalid Number'
		},
		errorContainer: '.errorTest1'
	}, {
		identifier: 'test2',
		path: 'test1.last',
		rules: {
				required: true
		 },
		 messages: {
			required: 'This is required'
		},
		errorContainer: '.errorTest2'
	}],
};

if ( typeof module === "object" && typeof module.exports === "object" ) {
	module.exports = layouts;
} else {
	window.layouts = layouts;
}
