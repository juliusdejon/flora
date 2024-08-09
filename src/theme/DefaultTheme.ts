const defaultTheme = {
  direction: "ltr",
  font: {
    Roboto: "Roboto-Regular",
    RobotoBold: "Roboto-Bold",
    PlayfairDisplay: "PlayfairDisplay-Regular",
    PlayfairDisplayBold: "PlayfairDisplay-Bold",
  },
  palette: {
    common: {
      black: "#000",
      white: "#fff",
      grey: "#C8C7CC",
    },
    text: {
      primary: "#472723", // Brown
      secondary: "#252529", // close to black
      tertiary: "#8A8A8F", // gray
    },
    background: {
      primary: "#FBF7F2", // main bg
      secondary: "#EADACF", // dark bg
      tertiary: "#F0E7DA", // in between main and secondary

      paper: "#fff",
      default: "#fafafa",
    },
  },
  typography: {
    default: {
      fontFamily: "Roboto-Regular",
      fontSize: 15,
      color: "#252529",
    },
    h1: {
      fontSize: 40,
      fontFamily: "PlayfairDisplay-Regular",
      color: "#252529",
    },
    h2: {
      fontSize: 28,
      fontFamily: "PlayfairDisplay-Regular",
      color: "#252529",
    },
    h3: {
      fontSize: 20,
      fontFamily: "PlayfairDisplay-Regular",
      color: "#252529",
    },
    h4: {
      fontSize: 18,
      fontFamily: "Roboto-Regular",
      color: "#252529",
    },
    label: {
      fontFamily: "Roboto-Regular",
      fontSize: 13,
      color: "#8A8A8F",
    },
  },
  spacing: {
    unit: 8,
  },
  hitSlop: { top: 30, bottom: 30, left: 30, right: 30 }, // Hit Slop adjust the size of the hit area of the touchable area
};

export default defaultTheme;
