# Validation

This library help us to validate the form as well as model. 

## Prerequisites

You will need jQuery in order to use this library.

```
npm install jquery
```

## Installing

You can get the library by using following command:

```
npm install fmvalidation
```

## Example
```
var layout = [
	selector: '.username',
	rules: {
		required: true,
	},
	message: {
		required: 'Username is required'
	}
]
var validate = new Validation({
	layout: layout
}, $('form'));
```
## Structure of validation with all properties
```
var layout = [{
	identifier: <string> 
	path: <string>,
	selector: <string>,
	rules:{
		required: <values for validation>,
		<custom_rule>: <function>
	}
	message: {
		required: <string>,
		<custom_rule>: <string>
	}
	getValue: <string/function>
	showError: <function>
	hideError: <function>
	errorContainer: <string>
}]
var validate = new Validation({
	layout: layout
	errorOnSubmit: <boolean>,
	errorOnChange: <boolean>,
	defaultError: <boolean>,
	model: <object>,
	showAllErrors: <function>,
	hideAllErrors: <function>,
	errorContainer: <string>,
}, $('form'));
```
### Uses of Properties
#### identifier
It will unqiue identifier if you want to validate only the particular selector. ex: validate.validate(<identifier>)

#### path / selector
We need to specify path or selector. If you need to valdiate form then selector should provided or if you want to validate model the path('test1.0.name') should be provided.

#### rules
Rules are inbuilt rules or function that validate the form or object path.

#### messages
Messages are shown when error occurs in validation for rules.

#### getValue
If we are not able to read value from element from form or object we can return value which will be used for validation

#### showError/hideError
If we want to show and hide error in our way we can use these.  

#### errorContainer 
Display error in specific element.

#### defaultError
By default its true. If its true, validation will happen when user is typing.

#### errorOnChange
By default its false. If its true, validation will happen when user change the value. It will overwrite the defaultError.

#### errorOnSubmit
By default its false. If its true, validation will happen when user call validate or form sumbit. It will overwrite the defaultError.

#### showAllErrors/hideAllErrors
If we want to show and hide all errors in our way we can use these.

#### model
If we have model based approach and can't valdaite the form, we can pass an object on which we have to do validation.


### Methods
#### validate(<identifier>)
It will validate and display error if any. It will return true if no validation error occurs. If identifier is present it will valid only that rule.

#### isValid(<identifier>)
It will only valdiate the form or object but will not through error.

#### addRule(<single layout object>)
It will add rule at runtime.

#### removeRule(<identier>)
It will remove rule at runtime.

#### resetErrors
Reset all errors


### Global Method
#### Validation.addValidation(name, regx/function)
It will add validation rule globally and we can you in our rules -> layout;


### Inbuilt Rules
```
required - true
name - true
number - true
decimal - true
username - true
password - true
email - true
url - true
date - true
equalTo - selector for other element
minLength - length
maxLength - length
rangeLength - [min, max]
minValue - value
maxValue - value
rangeValue - [min, max]
valueEqualTo - string/array
valueNotEqualTo - string/array
```