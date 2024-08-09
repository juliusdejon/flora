import React from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const QRCodeGenerator = () => {
  const expoProjectUrl = 'exp://192.168.5.83:8081/--/product/clj-1';

  const platformSpecificUrl = `${expoProjectUrl}`;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <QRCode value={platformSpecificUrl} size={200} />
    </View>
  );
};

export default QRCodeGenerator;
