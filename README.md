# README #

Condition and Consequence based async rule-engine in node.
This package wraps https://github.com/mithunsatheesh/node-rules APIS and enables sync/async support

### What is this repository for? ###

* Provides Scalable flow control API. Prevents developer ending up in callback hell and if else mess.


### How do I get set up? ###

* npm install async-rule-engine

### How do I use api? ###

* create new RuleEngine instance which validates facts against rules.
* use either waterfall or enqueue flow control methods and pass in rules.
* simple rule example :
```javascript
{
  "condition": function(){
      return this.user.type === 'customer'; // condition should rule should return a boolean value. if true consequence will be executed. fact object will be available under this 
  },
  "consequence": function(){
      this.message = 'Hello Customer';
  }
}
```
* Validating facts
```javascript
const engine = new RuleEngine();
engine.waterfall(rules); // list of rules.
engine.validate({'user':{'type': 'customer'}}, function(data){
    console.log(data.message);
});
```