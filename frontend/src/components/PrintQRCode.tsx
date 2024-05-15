
import { useEffect } from 'react';
import QRCodeComponent from './QRCodeComponent';


const PrintQRCode = ({ data }: any) => {
  const handlePrint = () => {
    window.print();
  };

 


  useEffect(() => {
    handlePrint();
      
  }, [])
  return (
    <div>
      <div id="QRCodeToPrint" style={{ textAlign: 'center' }}>
        <QRCodeComponent value={data} />
        <p>Scan the QR code</p>
      </div>
      <button onClick={handlePrint}>Print QR Code</button>
    </div>
  );
};

export default PrintQRCode;
