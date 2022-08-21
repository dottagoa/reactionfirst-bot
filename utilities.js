const { TOKEN } = process.env;
const util = require('util');

module.exports = {
    getRandom: function (arr, n) {
        var result = new Array(n),
            len = arr.length,
            taken = new Array(len);
        if (n > len) throw new RangeError('getRandom: more elements taken than available');
        while (n--) {
            var x = Math.floor(Math.random() * len);
            result[n] = arr[x in taken ? taken[x] : x];
            taken[x] = --len in taken ? taken[len] : len;
        }
        return result;
    },

    shuffle: function (a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    },

    clean: async function (text) {
        if (text && text.constructor.name == 'Promise') text = await text;
        if (typeof evaled !== 'string') text = util.inspect(text, { depth: 0 });

        text = text
            .replace(/`/g, '`' + String.fromCharCode(8203))
            .replace(/@/g, '@' + String.fromCharCode(8203))
            .replace(TOKEN, 'mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0');

        return text;
    },

    ordinal: function (i) {
        if (typeof i !== 'number') throw new TypeError('Expected Number, got ' + typeof i + ' ' + i);

        if (!Number.isFinite(i)) return i;
        return i + this.indicator(i);
    },

    indicator: function (i) {
        i = Math.abs(i);
        var cent = i % 100;
        if (cent >= 10 && cent <= 20) return 'th';
        var dec = i % 10;
        if (dec === 1) return 'st';
        if (dec === 2) return 'nd';
        if (dec === 3) return 'rd';
        return 'th';
    },
};
