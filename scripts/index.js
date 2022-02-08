const fs = require("fs")
const matter = require("gray-matter")

const units = {
  cs: [],
  math: [],
  science: [],
}
function cs() {
  const dirs = fs.readdirSync("courses/cs")
  for (const i of dirs) {
    const file = fs.readFileSync(`courses/cs/${i}`)
    const { data } = matter(file.toString())
    if (!units.cs.includes(data.unit)) units.cs.push(data.unit)
  }
}
function math() {
  const dirs = fs.readdirSync("courses/math")
  for (const i of dirs) {
    const file = fs.readFileSync(`courses/math/${i}`)
    const { data } = matter(file.toString())
    if (!units.math.includes(data.unit)) units.math.push(data.unit)
  }
}
function science() {
  const dirs = fs.readdirSync("courses/science")
  for (const i of dirs) {
    const file = fs.readFileSync(`courses/science/${i}`)
    const { data } = matter(file.toString())
    const key = Math.random()
    if (!units.science.includes(data.unit)) units.science.push(data.unit)
  }
}

cs()
math()
science()
fs.writeFileSync("courses/units.json", JSON.stringify(units))
