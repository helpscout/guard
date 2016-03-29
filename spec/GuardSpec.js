var _ = require('underscore');
var Guard = require('../lib/guard').default;
var Deferred = require('../lib/deferred').default;
var guard = new Guard();

describe('guard.* tests', function(){

    beforeEach(function() {
        guard = new Guard();
    });

    describe('getStack()', function(){

        it('should return the list', function(){
            var list = {
                save: [true, false, true]
            };

            guard.list = list;

            expect(guard.getStack('save')).toEqual(list.save);
        });
    });

    describe('respondTo()', function(){

        it('should add a new responder to the call stack', function(){
            expect(_.keys(guard.list).length).toEqual(0);
            expect(_.has(guard.list, 'save')).toEqual(false);

            guard.respondTo('save', function(){});

            expect(_.keys(guard.list).length).toEqual(1);
            expect(_.has(guard.list, 'save')).toEqual(true);
        });

        it('should throw an exception when adding a non-function responder is added', function(){
            expect(function(){guard.respondTo('save', true)}).toThrow();
            expect(function(){guard.respondTo('save', "abc")}).toThrow();
            expect(function(){guard.respondTo('save', {})}).toThrow();
            expect(function(){guard.respondTo('save', function(){})}).not.toThrow();
        });
    });

    describe('stopResponding()', function() {

        it('should remove all responders when no callback or context is passed', function(){
            guard.respondTo('save', function(){});
            guard.respondTo('save', function(){});
            guard.respondTo('save', function(){});

            expect(guard.getStack('save').length).toBe(3);

            guard.stopResponding('save');

            expect(guard.getStack('save').length).toBe(0);
        });

        it('should remove 2 responders that are the same callback if no context passed', function(){
            var callback = function(){};

            guard.respondTo('save', callback);
            guard.respondTo('save', callback);
            guard.respondTo('save', function(){});

            expect(guard.getStack('save').length).toBe(3);

            guard.stopResponding('save', callback);

            expect(guard.getStack('save').length).toBe(1);
        });

        it('should remove 1 responder when callback and context is passed', function(){
            var Person = function(name){
                this.name = name;
            };
            Person.prototype.getName = function(){
                return this.name;
            };

            var doctor = new Person('The Doctor');
            var rose = new Person('Rose');

            guard.respondTo('save', doctor.getName, doctor);
            guard.respondTo('save', rose.getName, rose);
            guard.respondTo('save', function(){});

            expect(guard.getStack('save').length).toBe(3);

            guard.stopResponding('save', doctor.getName, doctor);

            expect(guard.getStack('save').length).toBe(2);
        });

        it('should remove 1 responder when callback and context is passed and same responder listens twice', function(){
            var Person = function(name){
                this.name = name;
            };
            Person.prototype.getName = function(){
                return this.name;
            };

            Person.prototype.allonsy = function() {
                return 'Allons-y!';
            };

            var doctor = new Person('The Doctor');
            var rose = new Person('Rose');

            guard.respondTo('save', doctor.getName, doctor);
            guard.respondTo('save', doctor.allonsy, doctor);
            guard.respondTo('save', rose.getName, rose);
            guard.respondTo('save', function(){});

            expect(guard.getStack('save').length).toBe(4);

            guard.stopResponding('save', doctor.getName, doctor);

            expect(guard.getStack('save').length).toBe(3);
        });

    });

    describe('ifICan()', function(){

        it('should succeed with one responder that is not a promise', function(done){
            guard.respondTo('save', function(){
                return true;
            });

            callAndSucceed(done);
        });


        // it('should succeed with one responder that returns a promise from a closure', function(){
        //     guard.respondTo('save', function(){
        //         var deferred = new Deferred();
        //         deferred.resolve();
        //         return deferred.promise;
        //     });

        //     callAndSucceed();
        // });

        // it('should succeed with one responder that returns a delayed promise from a closure', function(done){
        //     guard.respondTo('save', function(){
        //         var deferred = new Deferred();

        //         setTimeout(function(){
        //             deferred.resolve();
        //         }, 1);

        //         return deferred.promise;
        //     });

        //     callAndSucceed(done);
        // });

        // it('should fail when one responder says no', function(){
        //     guard.respondTo('save', function() {
        //         return false;
        //     });

        //     callAndFail();
        // });

        // it('should fail when one responder promise says no', function(){
        //     guard.respondTo('save', function() {
        //         var deferred = new Deferred().reject();
        //         return deferred.promise;
        //     });

        //     callAndFail();
        // });

        // it('should succeed when multiple responders say yes', function(){
        //     guard.respondTo('save', function(){
        //         return true;
        //     });

        //     guard.respondTo('save', function(){
        //         return true;
        //     });

        //     guard.respondTo('save', function(){
        //         return true;
        //     });

        //     callAndSucceed();
        // });

        // it('should fail when 1/3 responders says no', function(){
        //     guard.respondTo('save', function(){
        //         return true;
        //     });

        //     guard.respondTo('save', function(){
        //         return false;
        //     });

        //     guard.respondTo('save', function(){
        //         return true;
        //     });

        //     callAndFail();
        // });

        // it('should succeed when multiple responders with delayed promises say yes', function(done){
        //     guard.respondTo('save', function(){
        //         var deferred = new Deferred();

        //         setTimeout(function(){
        //             deferred.resolve();
        //         }, 1);

        //         return deferred.promise;
        //     });

        //     guard.respondTo('save', function(){
        //         var deferred = new Deferred();

        //         setTimeout(function(){
        //             deferred.resolve();
        //         }, 1);

        //         return deferred.promise;
        //     });

        //     guard.respondTo('save', function(){
        //         var deferred = new Deferred();

        //         setTimeout(function(){
        //             deferred.resolve();
        //         }, 1);

        //         return deferred.promise;
        //     });

        //     callAndSucceed(done);
        // });

        // it('should fail when one of multiple responders returns a rejected promise', function(done){
        //     guard.respondTo('save', function(){
        //         var deferred = new Deferred();

        //         setTimeout(function(){
        //             deferred.resolve();
        //         }, 1);

        //         return deferred.promise;
        //     });

        //     guard.respondTo('save', function(){
        //         var deferred = new Deferred();

        //         setTimeout(function(){
        //             deferred.reject();
        //         }, 1);

        //         return deferred.promise;
        //     });

        //     guard.respondTo('save', function(){
        //         return new Deferred().resolve().promise;
        //     });

        //     callAndFail(done);
        // });

        // it('should pass when a single responder says yes from a scoped method', function(done){
        //     var obj = {
        //         response: true,

        //         check: function() {
        //             return this.response;
        //         }
        //     };

        //     guard.respondTo('save', obj.check, obj);

        //     callAndSucceed(done);
        // });

        function expectFail(thenCallback, catchCallback) {
            expect(thenCallback).not.toHaveBeenCalled();
            expect(catchCallback).toHaveBeenCalled();
        }

        function expectSuccess(thenCallback, catchCallback) {
            expect(thenCallback).toHaveBeenCalled();
            expect(catchCallback).not.toHaveBeenCalled();
        }

        function callAndSucceed(done) {
            callAndExpect(true, done);
        }

        function callAndFail(done) {
            callAndExpect(false, done);
        }

        function callAndExpect(succeed, done) {
            var expectMethod = succeed === true ? expectSuccess : expectFail;
            var _then = jasmine.createSpy('then');
            var _catch = jasmine.createSpy('catch');

            guard.ifICan('save').then(_then).catch(_catch);

            if ( done ) {
                return setTimeout(function () {
                    expectMethod(_then, _catch);
                    done();
                }, 100);
            }

            expectMethod(_then, _catch);
        }
    });
});
