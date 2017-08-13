describe('_', function() {
	
	it('Clone', function() {
		var object1 = {
			fn: function(){console.log('test')},
			flag: true,
			name: 'xyz',
			address: {pincode: 111111, city: 'pune'}
		};
		var object2 = Validation._.clone(object1);
		
		chai.assert.notEqual(object1, object2);
		chai.assert.notEqual(object1.address, object2.address);
		chai.assert.equal(object1.fn, object2.fn);
		chai.assert.equal(object1.flag, object2.flag);
		chai.assert.equal(object1.name, object2.name);
	});
	
	it('Each 1', function() {
		var arr1 = [1, 2, 3, 4, 5];
		Validation._.each(arr1, function(item, index){
			chai.assert.equal(arr1[index], item);
		});
	});
	
	it('Each 2', function() {
		var arr1 = [];
		Validation._.each(arr1, function(item, index){
			chai.assert.notEqual(arr1[index], item);
		});
	});
	
	it('Is Empty', function() {
		chai.assert.equal(Validation._.isEmpty(''), true);
		chai.assert.equal(Validation._.isEmpty([]), true);
		chai.assert.equal(Validation._.isEmpty({}), true);
		chai.assert.equal(Validation._.isEmpty(null), true);
		chai.assert.equal(Validation._.isEmpty(undefined), true);
		chai.assert.equal(Validation._.isEmpty('test'), false);
		chai.assert.equal(Validation._.isEmpty([1,2]), false);
		chai.assert.equal(Validation._.isEmpty({a:1}), false);
		
	});
	
	it('Contains', function() {
		chai.assert.equal(Validation._.contains([1,2], 1), true);
		chai.assert.equal(Validation._.contains({a:1,b:2}, 2), true);
		chai.assert.equal(Validation._.contains('test', 'st'), true);
		chai.assert.equal(Validation._.contains('test', 'stt'), false);	
		chai.assert.equal(Validation._.contains([1,2], 3), false);
	});
	
	it('Get Object Path', function() {		
		var object1 = {a:'test1'};
		var object2 = {a:{b:{c:'test2'}}};
		var object3 = {a:{b:[{c:'test3'}]}};
		var object4 = [{a:{b:'test4'}}];

		chai.assert.equal(Validation._.getObjectPath(object1,'a'), 'test1');
		chai.assert.equal(Validation._.getObjectPath(object2,'a.b.c'), 'test2');
		chai.assert.equal(Validation._.getObjectPath(object3,'a.b.0.c'), 'test3');
		chai.assert.equal(Validation._.getObjectPath(object4,'0.a.b'), 'test4');
		chai.assert.equal(Validation._.getObjectPath(object4,'a.b'), undefined);
		chai.assert.equal(Validation._.getObjectPath(object4,''), undefined);
		chai.assert.equal(Validation._.getObjectPath(object4, true), undefined);
		chai.assert.equal(Validation._.getObjectPath({}, 'a.b'), undefined);
	});
	
	it('Is Function', function() {
		chai.assert.equal(true, Validation._.isFunction(function(){}));
		chai.assert.equal(false, Validation._.isFunction([]));
		chai.assert.equal(false, Validation._.isFunction({}));
	});
	
	it('Is Array', function() {
		chai.assert.equal(true, Validation._.isArray([1,2,3]));
		chai.assert.equal(true, Validation._.isArray([1,'test']));
		chai.assert.equal(false, Validation._.isArray({}));
	});
	
	it('Is String', function() {
		chai.assert.equal(true, Validation._.isString('test'));
		chai.assert.equal(false, Validation._.isString([1,'test']));
		chai.assert.equal(false, Validation._.isString({}));
	});
	
	it('Is Object', function() {
		chai.assert.equal(true, Validation._.isObject({}));
		chai.assert.equal(true, Validation._.isObject({a:2}));
		chai.assert.equal(false, Validation._.isObject('test'));
	});
	
	it('Is Undefined', function() {
		chai.assert.equal(true, Validation._.isUndefined());
		chai.assert.equal(false, Validation._.isUndefined({}));
	});
});