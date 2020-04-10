import { getData } from "../client/js/app";

describe('Test, the function "getData()" should exist', () => {
  test("It should return true", async () => {
    expect(getData).toBeDefined();
  });
});

describe('Test, the function "getData()" should be a function', () => {
  test("It should be a function", async () => {
    expect(typeof getData).toBe("function");
  });
});
