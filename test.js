import './chai-spies-decorators'
import chai from 'chai'

chai.should ()

describe ('chai-spies-decorator', () => {

    it ('works', function () {

        this.timeout.should.be.an.instanceof (Function) // it() hook should correctly pass 'this'

        class Foo {

            @will.have.been.called.with ('qux').once
            bar (qux) {
                return qux + qux
            }
        }

        const foo1 = new Foo ()
        const foo2 = new Foo ()

        foo1.bar ('qux').should.equal ('quxqux')
        foo2.bar ('qux').should.equal ('quxqux')
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
            bar () { this.should.equal (foo) }

            @will.have.been.called.twice
            baz () { this.should.equal (foo) }
        })

        foo.bar ()
        foo.baz (); foo.baz ()
    })
})