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