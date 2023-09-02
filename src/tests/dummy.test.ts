import { test, expect } from "vitest";

const temp = {
    name: "something",
}

test("It works", () => {
    expect(temp.name).toBe("something");
})