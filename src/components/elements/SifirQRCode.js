import {Image, View} from 'react-native';
import PropTypes from 'prop-types';
import React from 'react';
import qr from 'qr.js';

function qr2bmp(data, colors, scale) {
  const header = Buffer.from(
    'Qk02GwAAAAAAADYAAAAoAAAAMAAAADAAAAABABgAAAAAAAAbAAATCwAAEwsAAAAAAAAAAAAA',
    'base64',
  );
  const size = data.length;
  const width = size * scale;
  if (width % 4 !== 0) throw new Error('Image width must be multiple of 4');
  header.writeUInt32LE(width, 0x12);
  header.writeUInt32LE(width, 0x16);
  header.writeUInt32LE(width * width * 3, 0x22);
  const outBuf = Buffer.alloc(width * width * 3);

  for (let rowN = 0, len = data.length; rowN < len; rowN += 1) {
    const row = data[rowN];
    for (let colN = 0, lenj = row.length; colN < lenj; colN += 1) {
      const color = colors[+row[colN]];
      for (let x = colN * scale; x < (colN + 1) * scale; x += 1) {
        for (let y = rowN * scale; y < (rowN + 1) * scale; y += 1) {
          const bo = ((width - 1 - y) * width + x) * 3;
          [outBuf[bo + 2], outBuf[bo + 1], outBuf[bo + 0]] = color;
        }
      }
    }
  }
  return `data:image/bmp;base64,${header.toString('base64')}${outBuf.toString(
    'base64',
  )}`;
}

const utf16to8 = str => {
  /* eslint-disable no-bitwise */
  let out = '';
  for (let i = 0, len = str.length; i < len; i += 1) {
    const c = str.charCodeAt(i);
    if (c >= 0x0001 && c <= 0x007f) {
      out += str.charAt(i);
    } else if (c > 0x07ff) {
      out += String.fromCharCode(0xe0 | ((c >> 12) & 0x0f));
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3f));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
    } else {
      out += String.fromCharCode(0xc0 | ((c >> 6) & 0x1f));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
    }
  }
  /* eslint-enable no-bitwise */
  return out;
};

const parseColor = hexColor => {
  if (!/^#[a-f0-9]{6}$/i.test(hexColor)) {
    throw new Error('Please provide the color in #FFFFFF format');
  }
  return [
    parseInt(hexColor.substr(1, 2), 16),
    parseInt(hexColor.substr(3, 2), 16),
    parseInt(hexColor.substr(5, 2), 16),
  ];
};

const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const lcm = (a, b) => (a * b) / gcd(a, b);

export default class SifirQRCode extends React.Component {
  static defaultProps = {
    value: 'Sifir',
    fgColor: '#000000',
    bgColor: '#FFFFFF',
    size: 128,
  };

  static propTypes = {
    value: PropTypes.string,
    size: PropTypes.number,
    bgColor: PropTypes.string,
    fgColor: PropTypes.string,
  };

  render() {
    const {size, bgColor, fgColor, value} = this.props;
    const QRData = qr(utf16to8(value)).modules;
    const imageMultiple = lcm(4, QRData.length);
    const imageSize = Math.ceil(size / imageMultiple) * imageMultiple;
    const scale = imageSize / QRData.length;
    const uri = qr2bmp(
      QRData,
      [parseColor(bgColor), parseColor(fgColor)],
      scale,
    );
    if (this.props.getBase64) {
      this.props.getBase64(uri);
    }
    return (
      <View>
        <Image source={{uri}} style={{width: size, height: size}} />
      </View>
    );
  }
}
