import {Promise} from "es6-promise";
import * as utils from "./utils";

export default class Guard {
    constructor() {
        this.list = {}
    }

    /**
     * Request permission to perform a specific action.
     *
     * @param {string} action the key/name of the action requested.
     * @returns {Promise} A promise to either perform an action (`.then()`) or catch a failure (`.fail()`).
     * @throws Will throw an error a responder response is not a promise or boolean.
     */
    ifICan(action) {
        let args = Array.prototype.slice.call(arguments, 1);
        let callbackStack = [];
        let proceedPromise = new Promise(utils.noop);

        this.getStack(action).forEach(responder => {
            let context = responder.context || null;
            let callbackResult = responder.callback.apply(context, args);

            if (utils.isPromise(callbackResult)) {
                callbackStack.push(callbackResult);
            } else if (utils.isBoolean(callbackResult)) {
                if (callbackResult) {
                    callbackStack.push(Promise.resolve());
                } else {
                    callbackStack.push(Promise.reject());
                }
            } else {
                let type = utils.getType(callback);
                throw new Error(`Guard expects a response to be a promise or a boolean. Type "${type}" given.`);
            }
        });

        Promise.all(callbackStack)
            .then(() => {
                Promise.resolve(proceedPromise);
            })
            .catch(() => {
                Promise.reject(proceedPromise);
            });

        return proceedPromise;
    }

    /**
     * Add a listener to an action and respond with a value allowing or denying the action.
     *
     * @param {string} action The key/name of the action to listen to.
     * @param {function} callback The response (ultimately a boolean) to the requested action.
     */
    respondTo(action, callback, context) {
        if (!utils.isFunction(callback)) {
            let type = utils.getType(callback);
            throw new Error(`Guard expects a response to be a promise or a boolean. Type "${type}" given?`);
        }
        this.getStack(action).push({
            callback: callback,
            context: context
        });
    }

    stopResponding(action, callback, context) {
        let stack = this.getStack(action);

        // If it's an empty stack, don't bother with anything else
        if (!stack.length) {
            return;
        }

        if (callback && context) {
            // Reverse loop per: https://gist.github.com/chad3814/2924672#file-gistfile1-js-L63-L71
            for (let i = stack.length - 1; i >= 0; i -= 1) {
                let responder = stack[i];

                if (responder.callback === callback
                    && responder.context === context
                ) {
                    stack.splice(i, 1);
                }
            }
        } else if (callback) {
            for (let i = stack.length - 1; i >= 0; i -= 1) {
                let responder = stack[i];

                if (responder.callback === callback) {
                    stack.splice(i, 1);
                }
            }
        } else {
            delete this.list[action];
        }
    }

    /**
     * Return the stack of listeners/responders for a specific action. If no current stack exists, create one and return it.
     *
     * @param {string} action
     * @returns {array}
     */
    getStack(action) {
        if (utils.has(this.list, action)) {
            return this.list[action];
        }

        this.list[action] = [];
        return this.list[action];
    }

}