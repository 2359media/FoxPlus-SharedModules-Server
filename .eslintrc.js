module.exports = {
    "extends": "airbnb-base",
    "env": {
        "node": true,
        "mocha": true,
        "es6": true
    },
    "rules": {
        "indent": ["error", 4, { "SwitchCase": 1 }],
        "no-console": 1,
        "comma-dangle": 0,
        "no-param-reassign": 0,
        "arrow-body-style": 0,
        "no-restricted-syntax": 0,
        "class-methods-use-this": 0,
        "no-underscore-dangle": 0,
        "max-len": ["error", { "ignoreUrls": true, "code": 120 }]
    },
};
