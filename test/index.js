const chai = require('chai')
const { describe, it } =  require('mocha')
const deepClone = require('../src/deepClone')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

const assert = chai.assert
chai.use(sinonChai)

describe('deepClone', () => {
  it('是一个函数', () => {
    assert.isFunction(deepClone)
  })
  it('能复制基本类型', () => {
    // string number boolean null undefind symbol
    const s = 'xxx'
    assert(deepClone(s) === s)
    const n = 123
    assert(deepClone(n) === n)
    const b = true
    assert(deepClone(b) === b)
    const Null = null
    assert(deepClone(Null) === Null)
    const Undefind = undefined
    assert(deepClone(Undefind) === Undefind)
    const symbol = Symbol()
    assert(deepClone(symbol) === symbol)
  })
  describe('对象', () => {
    it('能够复制普通对象', () => {
      const a = {name: 'xxx', child: {name: 'yyy'}}
      const a2 = deepClone(a)
      assert(a !== a2)
      assert(a.name === a2.name)
      assert(a.child !== a2.child)
      assert(a.child.name === a2.child.name)
    })
    it('能够复制数组对象', () => {
      const a = [[11, 12], [21, 22], [31, 32]]
      const a2 = deepClone(a)
      assert(a !== a2)
      assert(a[0] !== a2[0])
      assert(a[1] !== a2[1])
      assert(a[2] !== a2[2])
      assert.deepEqual(a, a2)
    })
    it('能够复制函数对象', () => {
      const a = function(x, y) {
        return x + y
      }
      a.xxx = {yyy: {zzz: 1}}
      const a2 = deepClone(a)
      assert(a !== a2)
      assert(a.xxx !== a2.xxx)
      assert(a.xxx.yyy !== a2.xxx.yyy)
      assert(a.xxx.yyy.zzz === a2.xxx.yyy.zzz)
      assert(a(1, 2) === a2(1, 2))
    })
    it('能够有环存在的对象', () => {
      const a = {name: 'xxx'}
      a.self = a
      const a2 = deepClone(a)
      assert(a !== a2)
      assert(a.name === a2.name)
      assert(a.self !== a2.self)
    })
    xit('不会爆栈', () => {
      // 解决的方式就是用一个数组保存起来，将一个树形结构拍平
      // 整体来讲就是把 tree 变成 array
      // 然后对每个属性再次按照顺序拷贝
      const a = {}
      let b = a
      for(let i = 0; i < 20000; i++) {
        b.child = {
          child: null
        }
        b = b.child
      }
      const a2 = deepClone(a)
      assert(a !== a2)
      assert(a.child !== a2.child)
    })
    it('能够复制正则表达式', () => {
      // RegExp(source, flags)
      const a = new RegExp('hi\\d+', 'gi')
      a.xxx = {yyy: {zzz: 1}}
      const a2 = deepClone(a)
      assert(a !== a2)
      assert(a.xxx !== a2.xxx)
      assert(a.xxx.yyy !== a2.xxx.yyy)
      assert(a.xxx.yyy.zzz === a2.xxx.yyy.zzz)
      assert(a.source === a2.source)
      assert(a.flags === a2.flags)
    })
    it('能够复制 Date', () => {
      const a = new Date()
      a.xxx = {yyy: {zzz: 1}}
      const a2 = deepClone(a)
      assert(a !== a2)
      assert(a.xxx !== a2.xxx)
      assert(a.xxx.yyy !== a2.xxx.yyy)
      assert(a.xxx.yyy.zzz === a2.xxx.yyy.zzz)
      assert(a.getTime() === a2.getTime())
    })
    it('不复制原型上的属性', () => {
      const a = Object.create({name: 'xxx'})
      a.xxx = {yyy: {zzz: 1}}
      const a2 = deepClone(a)
      assert(a !== a2)
      assert(a.xxx !== a2.xxx)
      assert(a.xxx.yyy !== a2.xxx.yyy)
      assert(a.xxx.yyy.zzz === a2.xxx.yyy.zzz)
      assert.isFalse('name' in a2)
    })
  })
})
