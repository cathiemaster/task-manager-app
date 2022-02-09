const calculateTip = (total, percentTip = 0.25) => {
    const tip = total * percentTip;
    return total + tip;
}

const farhToCel = (temp) => {
    return ((temp - 32) / 1.8);
}

const celToFarh = (temp) => {
    return ((temp * 1.8) + 32)
}

const add = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if ((a < 0) || (b < 0)) {
                return reject("Numbers must be nonnegative");
            }
            resolve(a + b);
        }, 2000);
    })
}

module.exports = {
    calculateTip,
    celToFarh,
    farhToCel,
    add
}