import {View} from 'react-native';
import React, {useEffect, useState} from 'react';
import QRCode from 'react-native-qrcode-svg';
import {Images, AppStyle} from '@common/index';
// import qr from 'qr.js';
const SifirQRCode = props => {
  const {
    value = 'Sifir',
    fgColor = '#000000',
    bgColor = '#FFFFFF',
    size = 128,
    setQrCodeURI,
  } = props;
  const [svgRef, setSvgRef] = useState(null);
  useEffect(() => {
    if (!svgRef) return;
    svgRef.toDataURL(d => setQrCodeURI(`data:image/bmp;base64,${d}`));
  }, [svgRef]);
  return (
    <View>
      <QRCode
        size={size}
        value={value}
        backgroundColor={bgColor}
        color={fgColor}
        getRef={c => setSvgRef(c)}
        onError={console.error}
        logo={Images.icon_header}
        logoBackgroundColor={AppStyle.backgroundColor}
      />
    </View>
  );
};
export default SifirQRCode;
