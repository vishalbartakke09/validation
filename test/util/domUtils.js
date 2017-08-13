var domUtils = {
	checkErrorMsg: function($input, errorMsg){
		var $error = $input.next('.v-error-msg');
		//console.log($error.text())
		//console.log(errorMsg)
		return $error.text() === errorMsg;
	},
		
	isError: function($input, errorMsg){
		//console.log(this.hasErrorClass($input))
		return this.hasErrorClass($input) && this.checkErrorMsg($input, errorMsg);
	},
	
	hasErrorClass: function($input){
		//console.log($input.hasClass('v-error'));
		return $input.hasClass('v-error');
	},

	createBody: function(){
		var template = '<form class="form"><div><label>Test 1</label><input class="test1"><div class="errorTest1"></div></div><div><label>Test 2</label><input class="test2"><div class="errorTest2"></div></div><div><label>Test 3</label><input class="test3"><div class="errorTest3"></div></div><div><label>Test 4</label><input class="test4"><div class="errorTest4"></div></div><div><label>Test 5</label><input class="test5"><div class="errorTest5"></div></div></form>'

		$('form').remove();
		if($('body').find('.body').length === 0){
			$('body').append('<div class="body" style="display: none"></div>');	
		} else{
			$('body .body').empty('');
		}
		
		$('body .body').html(template);
	},
};

if ( typeof module === "object" && typeof module.exports === "object" ) {
	module.exports = domUtils;
} else {
	window.domUtils = domUtils;
}