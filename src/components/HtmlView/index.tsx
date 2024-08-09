import React from 'react';
import { Dimensions } from 'react-native';

import RenderHtml from 'react-native-render-html';

const HtmlView = React.memo(function HtmlView({ html }: { html: string }) {
  const screenWidth = Dimensions.get('window').width;

  const tagsStyles = React.useMemo(
    () => ({
      a: {
        color: 'black',
        textDecoration: 'none',
      },
    }),
    [],
  );
  return (
    <RenderHtml
      contentWidth={screenWidth}
      source={{ html }}
      ignoredDomTags={['details']}
      enableExperimentalBRCollapsing={true}
      tagsStyles={tagsStyles}
    />
  );
});

export default HtmlView;
