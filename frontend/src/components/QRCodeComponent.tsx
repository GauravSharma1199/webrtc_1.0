// import { QRCode } from 'qrcode.react';

import QRCode from "qrcode.react";

const QRCodeComponent = ({ value }: any) => {
  return <QRCode value={value} size={256} />;
};

export default QRCodeComponent;
