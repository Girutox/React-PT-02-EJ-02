function User() {
  const obj = {}

  obj.pi = 3.1416

  obj.sum = (a, b) => a + b

  return obj
}

const fernando = User()
const giancarlo = User()

fernando.sum === giancarlo.sum // false