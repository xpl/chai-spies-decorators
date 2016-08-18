import './chai-spies-decorators'
import chai from 'chai'

chai.should ()

describe ('chai-spies-decorator', () => {

	it ('works', function () {

		this.timeout.should.be.an.instanceof (Function) // it() hook should correctly pass 'this'

		const foo = new (class Foo {

			@will.have.been.called.with ('qux').once
			bar (qux) { return qux + qux }
		})

		foo.bar ('qux').should.equal ('quxqux')
	})

	it.fails ('because of explicit throw', () => {

		throw new Error ()
	})

	it.fails ('fails due to calling more than once', () => {

		const foo = new (class Foo {

			@will.have.been.called.once
			bar () { }
		})

		foo.bar ()
		foo.bar ()
	})

	it.fails ('due to invalid argument', () => {

		const foo = new (class Foo {

			@will.have.been.called.with ('qux')
			bar (qux) { }
		})

		foo.bar ('zap')
	})

	it ('multiple @will dont mess up things', () => {

		const foo = new (class Foo {

			@will.have.been.called.once
			bar () { }

			@will.have.been.called.twice
			baz () { }
		})

		foo.bar ()
		foo.baz (); foo.baz ()
	})
})