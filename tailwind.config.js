module.exports = {
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      backgroundColor: {},
      borderColor: {},
      textColor: {},
    },
    fontFamily: {
      scenario: ["helvetica neue", "arial", "PingFangSC", "microsoft yahei"],
    },
  },
  variants: {
    backgroundColor: ["hover", "active"],
    extend: {
      opacity: ["disabled"],
    },
  },
};
