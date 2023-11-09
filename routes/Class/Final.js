class Final{
    ONE = 1;
    TWO = 2;
}

const final = new Final();
Object.freeze(final);

module.exports = {final};