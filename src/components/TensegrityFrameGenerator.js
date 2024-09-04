import React, { useState, useRef, useCallback } from 'react';

const TensegrityFrameGenerator = () => {
  const [userImage, setUserImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  // フレーム画像のURL（実際のURLに置き換えてください）
  const frameImageUrl = '/images/frame.png';

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setUserImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const generateFrame = useCallback(() => {
    if (!userImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const userImg = new Image();
    const frameImg = new Image();

    userImg.onload = () => {
      // ユーザー画像のリサイズとセンタリング
      const scale = Math.min(canvas.width / userImg.width, canvas.height / userImg.height);
      const x = (canvas.width / 2) - (userImg.width / 2) * scale;
      const y = (canvas.height / 2) - (userImg.height / 2) * scale;
      ctx.drawImage(userImg, x, y, userImg.width * scale, userImg.height * scale);

      // フレーム画像の読み込みと描画
      frameImg.onload = () => {
        ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
        setProcessedImage(canvas.toDataURL());
      };
      frameImg.src = frameImageUrl;
    };
    userImg.src = userImage;
  }, [userImage, frameImageUrl]);

  const downloadImage = () => {
    const link = document.createElement('a');
    link.download = 'tensegrity-frame.png';
    link.href = processedImage;
    link.click();
  };

  React.useEffect(() => {
    if (userImage) {
      generateFrame();
    }
  }, [userImage, generateFrame]);

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem' }}>
        Tensegrity Frame Generator
      </h1>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <button onClick={() => fileInputRef.current.click()} style={{ padding: '0.5rem 1rem', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Upload Image
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept="image/*"
        />
      </div>
      
      <canvas ref={canvasRef} width={300} height={300} style={{ display: 'none' }} />
      
      {processedImage && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={processedImage} alt="Processed" style={{ maxWidth: '100%', height: 'auto', marginBottom: '1rem' }} />
          <button onClick={downloadImage} style={{ padding: '0.5rem 1rem', backgroundColor: '#008CBA', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Download
          </button>
        </div>
      )}
      
      <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '0.75rem', borderRadius: '4px', marginTop: '1rem' }}>
        <p>
          This generator uses a preset Tensegrity frame image. You can replace the frame image URL with your own design for a custom look.
        </p>
      </div>
    </div>
  );
};

export default TensegrityFrameGenerator;