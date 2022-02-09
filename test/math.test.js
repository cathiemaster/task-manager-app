const { calculateTip, celToFarh, farhToCel, add } = require("../src/math");

test("hello-world", () => {
    //console.log("yay");
});

test("math-01", () => {
    const total = calculateTip(10, .3);
    expect(total).toBe(13);

    // if (total != 13) {
    //     throw new Error("Incorrect");
    // }
});

test("math-02", () => {
    const total = calculateTip(10);
    expect(total).toBe(12.5);
});

test("math-03", () => {
    const temp = celToFarh(0);
    expect(temp).toBe(32);
});

test("math-04", () => {
    const temp = farhToCel(32);
    expect(temp).toBe(0);
});

test("math-05", (done) => {
    add(2, 3).then((sum) => {
        expect(sum).toBe(5);
        done()
    })
});

test("math-05", async () => {
    const sum = await add(2, 3);
    expect(sum).toBe(5);
});