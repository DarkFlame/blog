function repeatArray(number) {
    return new Array(number)
}

console.log(Array())
console.log(Array(1))
console.log(Array(undefined))
console.log(Array(null))
console.log(Array(true))
console.log(Array(0))
console.log(Array('123'))


console.log(repeatArray(2))
console.log(repeatArray(undefined))
console.log(repeatArray())

console.log(Array.from({
    length: 3,
    0: 'test'
}))
console.log(Array.from(new Set([1,2,3])))
console.log(Array.from([1,2,3]))
console.log(Array.from('hello'))
console.log(Array.from((function* () {
    yield 1;
    yield 2;
    yield 3
})()))
console.log(Array.from({
    length: 3,
    0: 'test'
}))
console.log(Array.from({
    length: 2,
    0: 'aaa',
    1: 'bbb'
},(item,index) => ({
    item,
    index
})))


function Person(len) {
    this.personLen = len;
}

let func = Array.of.bind(Person)
let person = func(1,2,3)
console.log(person)
console.log(person instanceof Person)
console.log(person instanceof Array)


function repeatArray2(length = 0) {
    return Array.from({length})
}

console.log(repeatArray2(2))
console.log(repeatArray2(undefined))
console.log(repeatArray2())
