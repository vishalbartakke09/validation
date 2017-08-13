"use strict";
(function() {
	
	var layout = 'layout';

	var regx = {
		required: '',
		name: /^[a-zA-Z ]+$/,
		number: /^[0-9]+$/,
		decimal: /^[0-9\.]+$/,
		username: /^[a-z0-9_]+$/,
		password: /^[a-zA-Z0-9_%]+$/,
		email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		url: /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/
	};
	//Invalid Date
	var defaultMessage = {
		required: 'This field is required.',
		name: 'Please enter a valid name.',
		number: 'Please enter a valid number.',
		decimal: 'Please enter a valid decimal number',
		username: 'Please enter a valid username.',
		password: 'Please enter a valid password.',
		email: 'Please enter a valid email address.',
		url: "Please enter a valid URL.",
		date: "Please enter a valid date.",
		
		//method in util
		equalTo: 'Please enter the same value again.',
		maxLength: 'Please enter no more than {0} characters.',
		minLength: 'Please enter at least {0} characters.',
		rangeLength: 'Please enter a value between {0} and {1} characters long.',
		rangeValue: 'Please enter a value between {0} and {1}.',
		maxValue: 'Please enter a value less than or equal to {0}.',
		minValue: 'Please enter a value greater than or equal to {0}.',
		valueEqualTo: 'Please enter a value equal to {0}.',
		valueNotEqualTo: 'Please enter a value that is not equal to {0}.',
	};
	var ERROR_CLASS = 'v-error-msg';
	var INPUT_CLASS = 'v-error';
	var CON_CLASS = 'v-error-con'
	
	function Validation(data, $form){
		var v = this;
		
		this.data = _.clone(data);
		this.data.$form = $form;
		//set original model if it update this model will also update
		this.data.model = data.model;
		util.getFormElement(this);
		util.checkAllError(this);
		util.addStyle();
		this.data.defaultError = _.isUndefined(this.data.defaultError) ? true : this.data.defaultError;
		if(this.data.errorOnSubmit || this.data.errorOnChange){
			this.data.defaultError = false;
		}
		util.addEvents.call(this, this.data);
		this.data.$form.submit(function(e){
			if(!v.validate()){
				e.preventDefault();
			}
		});
	}
	
	Validation.prototype = {

		validate: function (selector){
			return validate.call(this, this.data, selector, false);
		},
		addRule: function (data){
			this.data[layout].push(_.clone(data));
			util.addEvents.call(this, this.data);
		},
		removeRule: function (selector){
			if(_.isEmpty(selector)){
				return;
			}
			var self = this;
			_.each(this.data[layout], function(item, index){
				if(item.selector === selector || item.path === selector || item.identifier === selector){
					var $ele = $(item.selector, self.data.$form);
					util.hide(self, item, '', $ele, $ele.val());
					util.removeEvent(selector, self.data.$form);
					self.data[layout].splice(index, 1);
					return true;
				}
			});
		},
		hideError: function(selector){
			if(_.isEmpty(selector)){
				return;
			}
			var self = this;
			_.each(this.data[layout], function(item, index){
				if(item.selector === selector || item.path === selector || item.identifier === selector) {
					var $ele = $(item.selector, self.data.$form);
					util.hide(self, item, '', $ele, $ele.val());
					return true;
				}
			});
		},
		resetErrors: function() {
			util.resetErrors(this.data);
		},
		isValid: function(selector) {
			return validate.call(this, this.data, selector, true);
		}
	}
	
	var validate = function(data, selector, isSilent){	
		var self = this;
		var isValid = true;
		var isSpecificSelector = !_.isEmpty(selector);
		
		data.errors = [];
		if(!isSilent){
			this.isSubmit = true;
			//util.resetErrors(data);
		}
		_.each(data[layout], function(lay, index){
			if(lay.selector && (!isSpecificSelector || lay.selector === selector || lay.identifier === selector)){
				$(lay.selector, self.data.$form).each(function(index, element) {
					var $ele = $(element);
					var error = util.checkValid.bind(element, lay, self, isSilent)();
					if(_.isString(error)){
						data.errors.push(util.getMessage(lay.messages, error, lay[error]));
						isValid = false;
					}
				});
			} else if(lay.path && (!isSpecificSelector || lay.path === selector || lay.identifier === selector)) {
				var error = util.checkValid.bind({}, lay, self, isSilent)();
				if(_.isString(error)){
					data.errors.push(util.getMessage(lay.messages, error, lay[error]));
					isValid = false;
				}
			}
		});
		this.isSubmit = false;
		if(!isValid && !isSilent){
			if(data.errorContainer) {
				util.showAllErrors(data);
			} else if(_.isFunction(data.showAllErrors)){
				data.showAllErrors(data.errors);
			}
		} else if(!isSilent){
			if(_.isFunction(data.hideAllErrors)){
				data.hideAllErrors();
			}
		}
		return isValid;
	}
/*------------------------Validation additional functions-----------------------------------*/
	var util = {
		addStyle: function(){
			var exist = $('#validationStyle').length > 0;
			if(!exist){
				$('head').prepend('<style id="validationStyle">.v-error-msg,.v-error-con{color: red}</style>');
			}
		},
		addEvents: function(data){
			var input = [];
			var other = [];
			var self = this;

			_.each(data[layout], function(item){
				item.isOptional = util.checkOptional(item.rules);
				if(!_.isEmpty(item.selector)){
					item.isSelector = true;
					$(item.selector, data.$form).each(function(index, element) {
						var $ele = $(element);
						$ele.attr('selector', item.selector);
						if(element.isEvent){
							return;
						}
						
						element.isEvent = true;
						if($ele.is('[type=checkbox], [type=radio], select') && (data.defaultError || data.errorOnChange)){
							$ele.on('change', util.checkValid.bind($ele[0], item, self, false));
						} else {
							if(data.defaultError){
								$ele.on('keyup', util.checkValid.bind($ele[0], item, self, false));	
							}
							if(data.errorOnChange){
								$ele.on('focusout', util.checkValid.bind($ele[0], item, self, false));	
							}
							
						}
                    });
				} else {
					item.isSelector = false;
				}
			});
		},
		//require current element this for function
		checkValid: function(lay, self, noError, e){
			var focusOut = false;
			var value = util.getValue(this, lay, self);
			var $ele = $(this);
			var isError = false;
			var lastRuleKey;
			var lastRuleValue;
			var passingData;

			if(_.isObject(e) && e.key === 'Tab'){
				return;
			}
			if(_.isObject(e) && (e.type === 'focusout' || e.type === 'change')){
				focusOut = true;
			}
			//{required: true} rule = true and key = required
			_.each(lay.rules, function(ruleValue, ruleKey){	
				lastRuleKey = ruleKey;
				lastRuleValue = ruleValue;
				passingData = util.getValidationData(lay, ruleKey, $ele[0], value, 'validate');
				if(_.isFunction(ruleValue)){
					if (!ruleValue(passingData)) {
						isError = true;
					}	
				} else if(!util.checkValidRule(self, passingData)){
					isError = true;
				}
				return isError;
			});
			if(isError && !noError){
				util.show(self, lay, lastRuleKey, $ele, value, focusOut);
			} else if(!noError) {
				util.hide(self, lay, lastRuleKey, $ele, value, focusOut);
			}
			if(isError){
				//return key if error for fn calling from validate
				return lastRuleKey;
			}
			return !isError;
		},
		checkOptional: function(rules) {
			var isOptional = true;
			_.each(rules, function(rule, key){
				if(key === 'required'){
					isOptional = false;
					return true;
				}
			});
			return isOptional;
		},
		callMethod: function(fn, lay, ruleKey, element, value, type){
			if(_.isFunction(fn)){
				var data = util.getValidationData(lay, ruleKey, element, value, type);
				fn(data);
			}
		},
		checkValidRule: function(self, rd){
			if(rd.ruleKey === 'required'){
				if(_.isEmpty(rd.value) || !rd.value){
					return false;
				}
				//regx function
			}else if(_.isFunction(regx[rd.ruleKey])){
				if(!regx[rd.ruleKey](rd)){
					return false;
				}
				//regx test
			}else if(regx[rd.ruleKey]){
				if(!(regx[rd.ruleKey].test(rd.value))) {
					return false;
				}
				//function in util with inbuilt
			} else if(_.isFunction(util[rd.ruleKey])){
				if(!util[rd.ruleKey](self, rd)){
					return false;
				}
			} 
			return true;
		},
		checkAllError: function(self) {
			self.isAllError = false;
			if(self.data.showAllErrors || self.data.errorContainer){
				self.isAllError = true;		
			}
		},
		getFormElement: function(self){
			if(_.isEmpty(self.data.$form)){
				self.data.$form = $(self.data.form);
				if(self.data.$form.length === 0){
					self.data.$form = $('body');
				}
			} else if(_.isString(self.data.$form)){
				self.data.$form = $(self.data.$form);
				if(self.data.$form.length === 0){
					self.data.$form = $('body');
				}
			} else if(_.isObject(self.data.$form) && self.data.$form.nodeType) {
				self.data.$form = $(self.data.$form);
			} else if(_.isObject(self.data.$form) && self.data.$form.length === 0){
				self.data.$form = $('body');
			}
		},
		getMessage: function(messages, rule, value){
			var message;

			if(_.isObject(messages) && !_.isEmpty(messages[rule])){
				message = messages[rule];
			} else {
				message = defaultMessage[rule] || '';
			}

			if(_.isArray(value)){
				value.splice(0, 0, message);
				return Validation.formatString.apply(util, value);
			} else {
				return Validation.formatString.apply(util, [message, value]);
			}
		},
		getValidationData: function(lay, ruleKey, element, value, type){
			return {
				ruleKey: ruleKey,
				ruleValue: lay.rules[ruleKey],
				layout: lay,
				element: element,
				value: value,
				type: type,
			};
		},
		getValue: function(ele, lay, self){
			if(_.isString(lay.getValue)) {
				return lay.getValue;
			} else if(_.isFunction(lay.getValue)) {
				return lay.getValue({eleement: $(ele), layout: lay});
			} else {
				if(lay.isSelector) {
					return util.getElementValue(ele);
				} else {
					return _.getObjectPath(self.data.model, lay.path);
				}
			}
		},
		hide: function(self, lay, ruleKey, $ele, value, focusOut){
			var data = self.data;
			var isSubmit = self.data.errorOnSubmit && self.isSubmit;
			var errorOnChange = self.data.errorOnChange;
			var isFocusOut = errorOnChange && focusOut;
			
			if (((isFocusOut || self.isSubmit) || data.defaultError || isSubmit) && !self.isAllError) {
				if(lay.errorContainer){
					self.data.$form.find(lay.errorContainer)
						.empty()
						.hide();
				} else if(_.isFunction(lay.hideError)) {
					util.callMethod(lay.hideError, lay, ruleKey, $ele[0], value, 'success');
				} else if(lay.selector) {
					util.hideError($ele);
				}
			}
		},
		hideError: function($element){
			var $errorContainer = $element.next('.' + ERROR_CLASS);
			$errorContainer.empty().hide();
			$element.removeClass(INPUT_CLASS);
		},
		show: function(self, lay, ruleKey, $ele, value, focusOut){
			var data = self.data;
			var isSubmit = self.data.errorOnSubmit && self.isSubmit;
			var errorOnChange = self.data.errorOnChange;
			var isFocusOut = errorOnChange && focusOut;

			if (((isFocusOut || self.isSubmit) || data.defaultError || isSubmit) && !self.isAllError) {
				if(lay.errorContainer){
					self.data.$form.find(lay.errorContainer)
						.html(util.getMessage(lay.messages, ruleKey, lay.rules[ruleKey]))
						.addClass(ERROR_CLASS)
						.show();
				} else if(_.isFunction(lay.showError)) {
					util.callMethod(lay.showError, lay, ruleKey, $ele[0], value, 'error');
				} else if(lay.selector) {
					util.showError($ele, util.getMessage(lay.messages, ruleKey, lay.rules[ruleKey]));
				}
			}
		},
		showError: function($element, message){
			var $errorContainer = $element.next('.' + ERROR_CLASS);
			var isErrorContianer = $errorContainer.length > 0;
			
			$element.addClass(INPUT_CLASS);
			if(isErrorContianer){
				$errorContainer.html(message).show();
			} else {
				$('<div class="' + ERROR_CLASS + '">' + message + '</div>').insertAfter($element);
			}
		},
		showAllErrors: function(data){
			var $ul = $('<ul class="' + CON_CLASS + '"/>');
			var $errorContainer = $(data.errorContainer, data.$form);
			var li;
			
			$errorContainer.find('ul').remove();
			_.each(data.errors, function(item){
				li = '<li>' + item + '</li>';
				$ul.append(li);
			});
			$errorContainer.append($ul).show();
		},
		resetErrors: function(data){
			delete data.errors;
			data.errors = [];
			
			$('.' + ERROR_CLASS, data.$form).empty().hide();
			$('.' + CON_CLASS, data.$form).empty().hide();
			$('.' + INPUT_CLASS, data.$form).removeClass(INPUT_CLASS);
			_.each(data.layout, function(lay){
				if(lay.errorContainer){
					$(lay.errorContainer, data.$form).empty().hide();
				}
			});
			if (_.isFunction(data.hideAllErrors)) {
				data.hideAllErrors();
			}
		},
		removeEvent: function(selector, $form){
			if(_.isEmpty(selector)){
				return;
			}
			$(selector, $form).off('keyup focusout change');
		},
		
		isElement: function(element){
			return typeof element === 'object' && element.nodeType >= 0; 
		},
		getElementValue: function (ele){
			var $ele = $(ele);
			if($ele.is('[type=checkbox], [type=radio]')){
				return $ele.prop('checked');
			} else {
				var val = $ele.val();
				if(_.isString(val)){
					return val.trim();
				} else {
					return val;
				}
			}
		},
		equalTo: function(self, rd){
			var equalValue = util.getElementValue($(rd.ruleValue, self.data.$form)[0]);
			return rd.value === equalValue;
		},
		maxLength: function(self, rd){
			if(_.isString(rd.value)){
				return rd.value.length <= rd.ruleValue;
			}
			return false;
		},
		minLength: function(self, rd){
			if(_.isString(rd.value)){
				return rd.value.length >= rd.ruleValue;
			}
			return false;
		},
		rangeLength: function(self, rd){
			if(_.isString(rd.value) && _.isArray(rd.ruleValue)){
				return rd.value.length >= rd.ruleValue[0] && rd.value.length <= rd.ruleValue[1];
			}
			return false;
		},
		rangeValue: function(self, rd){
			if(!isNaN(rd.value) && _.isArray(rd.ruleValue)){
				return parseFloat(rd.value) >= rd.ruleValue[0] && parseFloat(rd.value) <= rd.ruleValue[1];
			}
			return false;
		},
		minValue: function(self, rd){
			if(!isNaN(rd.value)){
				return parseFloat(rd.value) >= rd.ruleValue;
			}
			return false;
		},
		maxValue: function(self, rd){
			if(!isNaN(rd.value)){
				return parseFloat(rd.value) <= rd.ruleValue;
			}
			return false;
		},
		valueEqualTo: function(self, rd){
			if(_.isArray(rd.ruleValue)){
				return _.contains(rd.ruleValue, rd.value);
			} else {
				return rd.value === rd.ruleValue;
			}
		},
		valueNotEqualTo: function(self, rd){
			if(_.isArray(rd.ruleValue)){
				return !_.contains(rd.ruleValue, rd.value);
			} else {
				return rd.value !== rd.ruleValue;
			}
		},
		
	};
	
/*------------------------Validation utilities functions-----------------------------------*/
	var _ = {
		clone: function(obj){
			if (obj === null || typeof obj !== 'object') {
				return obj;
			}
		 
			var temp = obj.constructor(); // give temp the original obj's constructor
			for (var key in obj) {
				if(typeof obj === 'object') {
					temp[key] = _.clone(obj[key]);
				} else {
					temp[key] = obj[key];
				}
			}
		 
			return temp;
		},
		
		each: function(data, fn){
			for(var i in data){
				if(this.isFunction(fn)){
					if(fn(data[i], i)){
						break;
					}
				}
			}
		},
		
		isEmpty: function(data){
			if(data === null || data === undefined){
				return true;
			} else if(this.isArray(data) && data.length === 0){
				return true;
			} else if(this.isObject(data) && JSON.stringify(data) === '{}'){
				return true;
			} else  if(this.isString(data) && data === ''){
				return true;
			}
			return false;
		},
		
		getObjectPath: function(json, path){
			if(!_.isObject(json) ||  !_.isString(path)){
				return undefined;
			}
			var pathArray = path.split('.');
			var val;
			var temp = json;
		
			for(var i = 0; i < pathArray.length; i++){
				try{
					if(typeof temp === 'object'){
						temp = val = temp[pathArray[i]];
					} else if(temp[pathArray[i]] !== undefined) {
						return temp[pathArray[i]];
					} else {
						return;
					}
				}catch(e){return}
			}
			return val;
		},
		
		isFunction: function(fn){
			return typeof fn === 'function';
		},
		
		isObject: function(data){
			return typeof data === 'object';
		},
		
		isArray: function(data){
			return data instanceof Array;
		},
		
		isString: function(data){
			return typeof data === 'string';
		},
		
		isUndefined: function(data){
			return typeof data === 'undefined';
		},
		
		contains: function(data, matchData){
			var isContain = false;
			
			if(this.isArray(data) || this.isObject(data)){
				_.each(data, function(val){
					if(val === matchData){
						isContain = true;
						return true;
					}
				});
			} else  if(this.isString(data) && data.indexOf(matchData) > -1){
				isContain = true;
			}
			return isContain;
		}	
	};

/*------------------------Validation config functions-----------------------------------*/
	//regx/fn should return true if valid else false
	Validation.addValidation = function(ruleName, defaultMsg, reg){
		regx[ruleName] = reg;
		defaultMessage[ruleName] = defaultMsg;
	}
	
	Validation.formatString = function(){
		var formatStr = arguments[0];
		var number = arguments.length;
		
		for(var i = 1; i < number; i++){
			formatStr = formatStr.replace('{' + (i-1) + '}', arguments[i]);
		}
		return formatStr;
	}

	Validation._ = _;
	Validation.util = util;
	Validation.regx = regx;
		
	//declare validation to other module or globally
	if ( typeof module === "object" && module && typeof module.exports === "object" ) {
		var $ = require('jquery');
		module.exports = Validation;
	} else if(typeof window === 'object' && window.jQuery) {
		var $ = window.jQuery;
		window.Validation = Validation;
		$.fn.validation = function(data){
			if(this.length === 0){
				return null;
			}
			return (new Validation(data, this));
		}
	}
})();