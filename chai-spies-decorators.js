import chai  from 'chai'
import spies from 'chai-spies'

/*  ------------------------------------------------------------------------ */

chai.use (spies)

/*  ------------------------------------------------------------------------ */

const prev_it = it
const $global = (typeof window === 'undefined') ? global : window

const gatherContractChecks = () => {

    const checklist = []

    Object.defineProperty ($global, 'will', {

        configurable: true, 
        
        get () {

            return new Proxy (Object.assign (function will (chain, Class, name, desc) {

                const spied = chai.spy (desc.value)
                const check = () => {

                    let prev = undefined,
                        next = chai.expect (spied).to

                    chain.forEach (what => {

                        if (Array.isArray (what)) { // call args

                            next = next.apply (prev, what) // prev.next (what)

                        } else { // .what

                            prev = next
                            next = next[what]
                        }
                    })
                }

                checklist.push (check)

                return {

                    configurable: desc.configurable,
                    enumerable:   desc.enumerable,

                    get () {
                        return (...args) => spied.apply (this, args)
                    }
                }

            }, { chain: [] }), {

                apply (target, proxy, args) {

                    if (args[2] && (args[2].value instanceof Function)) {

                        return target (target.chain, ...args)

                    } else {

                        target.chain.push (args)
                    }
                    
                    return proxy
                },

                get (target, prop, proxy) {

                    target.chain.push (prop)

                    return proxy
                }

            })
        }
    })

    return checklist
}

/*  ------------------------------------------------------------------------ */

const wrapIt = (prevIt, shouldFail) =>

    new Proxy (prevIt, {

        apply (target, thisArg, args) { const [ testName, testFn ] = args

            return prevIt.call (thisArg, testName, function (...args) {

                const checks = gatherContractChecks ()

                return Promise.resolve ().then (testFn.bind (this, ...args)).then (result => {

                    checks.forEach (check => check ())

                    if (shouldFail) {
                        shouldFail = false
                        throw new Error ('expected to fail, but it did not happen')
                    }

                    return result

                }).catch (e => {

                    if (!shouldFail) { throw e }

                })

            })
        }
    })

/*  ------------------------------------------------------------------------ */

it.only  = wrapIt (it.only)
it.skip  = wrapIt (it.skip)
it.fails = wrapIt (it, true)

it = wrapIt (it)

/*  ------------------------------------------------------------------------ */
