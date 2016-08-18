# chai-spies-decorators

```bash
npm install chai-spies-decorators
```

Provides ES7 decorators interface for [`chai-spies`](https://github.com/chaijs/chai-spies), allowing to set execution contracts on class methods in a nice declarative way. Requires [Mocha](https://mochajs.org/).

```javascript
import 'chai-spies-decorators'

describe ('example', () => {

	it ('works', () => {

		const foo = new (class Foo {

			@will.have.been.called.with (42).once
			bar () { }

			@will.have.been.called.twice
			zap () { }
		})

		foo.bar (42)
		foo.zap (); foo.zap ()
	})

})
```

## How it works

I've written an article on Medium explaining it: [Wiring ES7 decorators to Chai Spies for declarative contracts on class methods: A metaprogramming case study](https://medium.com/@xpl/wiring-es7-decorators-to-chai-spies-for-declarative-contracts-on-class-methods-957d6a8c27e9#.30sh22os4).

## Warning

It is not very well tested with asynchronous tests. Should work with Promises, but not with `done` callback (not implemented).
