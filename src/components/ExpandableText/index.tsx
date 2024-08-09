import { Text } from "react-native";
import React, { useContext, useState } from "react";

import { ThemeContext } from "../../contexts/ThemeContext";

const ExpandableText = ({
  text
}: any) => {
  const { theme } = useContext(ThemeContext);
  const [showFullText, setShowFullText] = useState(false);

  const toggleText = () => {
    setShowFullText(!showFullText);
  };

  return (
    <Text style={{ ...theme.typography.default }}>
      {showFullText ? text : text.slice(0, 80)}
      {!showFullText && text.length > 80 && "..."}
      {text.length > 80 && (
        <Text
          onPress={toggleText}
          style={{
            fontFamily: theme.font.RobotoBold,
          }}
        >
          {showFullText ? " Less" : " More"}
        </Text>
      )}
    </Text>
  );
};
export default ExpandableText;
