/**
 * Created by aditya on 15/09/17.
 */


const Engine = require('node-rules');
const _ = require('lodash');

function RuleRegistry(){
    this.registry = [];
}

RuleRegistry.prototype.add = function(condition, consequence, options){
    if(!options) options = {};
    const rule = {'condition': function(R){
        if(condition.length > 0){
            condition.call(this, function(err, outcome){
                if(err)
                    R.when(false);
                else
                    R.when(outcome);
            });
        }else{
            R.when(condition.call(this));
        }
    }, 'consequence': function(R){
        consequence.call(this);
        switch(options.handle){
            case 'next':
                R.next();
                break;
            case 'restart':
                R.restart();
                break;
            case 'stop':
                R.stop();
                break;
            default:
                break;
        }
    }};
    _.assign(rule, options);
    this.registry.push(rule);
};

RuleRegistry.prototype.build = function(){
    return this.registry;
};

RuleRegistry.prototype.length = function(){
    return this.registry.length;
};

function RuleEngine(){
    this.registry = new RuleRegistry();
    this.engine = new Engine([], {ignoreFactChanges: true});
}

RuleEngine.prototype.add = function(condition, consequence, options){
    this.registry.add(condition, consequence, options);
};

RuleEngine.prototype.enqueue = function(rules){
    _.forEach(rules, function(rule, index){
        const options = {'priority': 100 - this.registry.length(), 'handle': rules.length - 1 === index ? 'stop' : 'next'};
        this.registry.add(rule.condition, rule.consequence, options);
    }.bind(this));
};

RuleEngine.prototype.waterfall = function(rules){
    _.forEach(rules, function(rule){
        const options = {'priority': 100 - this.registry.length(), 'handle': 'stop'};
        this.registry.add(rule.condition, rule.consequence, options);
    }.bind(this));
};

RuleEngine.prototype.validate = function(fact, callback){
    this.engine.register(this.registry.build());
    this.engine.execute(fact, callback);
};

module.exports = RuleEngine;