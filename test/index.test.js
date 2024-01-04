import { add } from "../src"

describe("两数相加", () => {
  it("add(2,4) -> should return 6", () => {
    const rand = add(2, 4)
    expect(rand).toBe(6)
  })
  it("add(1,2) -> should return 3", () => {
    const rand = add(1, 2)
    expect(rand).toBe(3)
  })
})
