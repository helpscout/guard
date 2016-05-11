# Guard

Guard is a terminatable pub/sub utility.

Guard allows asynchronous, anonymous coupling of components. Components wanting to perform an action can be stopped by other components through Guard. The components are coupled to Guard rather than each other.

## Install

### NPM
`npm install @helpscout/guard`

### CDN (npmcdn.com)

```javascript
https://npmcdn.com/helpscout/guard/dist/guard.js
https://npmcdn.com/helpscout/guard/dist/guard.min.js
```

## Usage

### CommonJS

```javascript
var Guard = require('@helpscout/guard');

var guard = new Guard();
```

### Example:

An online forum thread editor wants to save a block of text in its WYSIWYG editor. The code for this editor may want to perform a "save" action and it requests permission to do so.

```javascript

guard.ifICan('save')
	.then(function(){
    	// save the text
	})
	.catch(function(){
		// handle the error
	});
```

Now, before saving, there may be some steps you need to check first. Was the "subject" field filled out? Were any required fields left blank?

```
guard.respondTo('save', function(){
    if ($('#subject').val() === '') {
        return false;
    }

    return true;
});

guard.respondTo('save', function(){
    $('.required-field').each(function(){
        if ($(this).val() === '') {
            return false;
        }
    });

    return true;
});
```

The requested action (in this case, "save") can be stoped if even a single responder returns false.

### Responders

Responders must "respond to" a requested action. The two required parameters to `respondTo` are the name of the action, and a callback.

The callback must either return a boolean or a [Promise](https://promisesaplus.com).

## Local Build

- Clone this repo.
- Install dependencies with `npm install`
- Build project with `npm run build`
- Run Unit Tests with `npm test`

## License

MIT
