import React, { useState, useRef, useCallback } from 'react';

const TensegrityFrameGenerator = () => {
  const [userImage, setUserImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [selectedFrame, setSelectedFrame] = useState(0);
  const [rotation, setRotation] = useState(0);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const frames = [
    { name: 'シャドウなし', url: '/images/frame_no_shadow.png' },
    { name: 'シャドウ白', url: '/images/frame_shadow_white.png' },
    { name: 'シャドウ黒', url: '/images/frame_shadow_black.png' },
  ];

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
      // キャンバスのサイズを大きくする（例：600x600）
      canvas.width = 600;
      canvas.height = 600;

      const scale = Math.min(canvas.width / userImg.width, canvas.height / userImg.height);
      const x = (canvas.width / 2) - (userImg.width / 2) * scale;
      const y = (canvas.height / 2) - (userImg.height / 2) * scale;
      ctx.drawImage(userImg, x, y, userImg.width * scale, userImg.height * scale);

      frameImg.onload = () => {
        // フレームを回転させて描画
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);  // 角度をラジアンに変換して回転
        ctx.drawImage(frameImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        ctx.restore();

        setProcessedImage(canvas.toDataURL());
      };
      frameImg.src = frames[selectedFrame].url;
    };
    userImg.src = userImage;
  }, [userImage, selectedFrame, frames, rotation]);  // framesを依存配列に追加

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
  }, [userImage, generateFrame, selectedFrame]);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onload = (e) => setUserImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      backgroundColor: '#f0f8ff',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    header: {
      fontSize: '2rem',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '2rem',
      color: '#69AAD6',
    },
    uploadArea: {
      border: '2px dashed #69AAD6',
      borderRadius: '10px',
      padding: '2rem',
      textAlign: 'center',
      cursor: 'pointer',
      marginBottom: '2rem',
    },
    frameSelector: {
      display: 'flex',
      justifyContent: 'space-around',
      marginBottom: '2rem',
    },
    frameThumbnail: {
      width: '100px',
      height: '100px',
      objectFit: 'cover',
      borderRadius: '5px',
      cursor: 'pointer',
      border: '2px solid transparent',
    },
    selectedFrame: {
      border: '2px solid #68B36C',
    },
    button: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#68B36C',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '1rem',
      transition: 'background-color 0.3s',
    },
    imageContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '2rem',
    },
    imageWrapper: {
      width: '48%',
    },
    image: {
      maxWidth: '100%',
      height: 'auto',
      borderRadius: '5px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontSize: '1.1rem',
      color: '#69AAD6',
    },
    footer: {
      textAlign: 'center',
      marginTop: '2rem',
      padding: '1rem',
      backgroundColor: '#f0f8ff',
      color: '#69AAD6',
      borderRadius: '10px',
    },
    link: {
      color: '#69AAD6',
      textDecoration: 'none',
      fontWeight: 'bold',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>🍹Tensegrityフレームジェネレーター🐹</h1>

      <div style={styles.excitingMessage}>
        いよいよ<a href="https://www.nornis.com/event/live_tour_2024/" target="_blank" style={styles.link}>Nornis LIVE TOUR 2024 -Tensegrity-</a>の開催が近づいてきましたね！<br />
        このサイトではSNSアイコンにTensegrity風のフレームを合成することができます。<br />
        SNS上でもイベントを盛り上げて、皆で最高のライブを作りましょう！
      </div>

      <div
        style={styles.uploadArea}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current.click()}
      >
        <p>ここに画像をドラッグ＆ドロップするか、クリックしてアップロード</p>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept="image/*"
        />
      </div>

      <div style={styles.frameSelector}>
        {frames.map((frame, index) => (
          <div key={frame.name}>
            <img
              src={frame.url}
              alt={frame.name}
              style={{
                ...styles.frameThumbnail,
                ...(selectedFrame === index ? styles.selectedFrame : {})
              }}
              onClick={() => setSelectedFrame(index)}
            />
            <p>{frame.name}</p>
          </div>
        ))}
      </div>

      <canvas ref={canvasRef} width={300} height={300} style={{ display: 'none' }} />

      {userImage && processedImage && (
        <div style={styles.imageContainer}>
          <div style={styles.imageWrapper}>
            <span style={styles.label}>オリジナル</span>
            <img src={userImage} alt="オリジナル" style={styles.image} />
          </div>
          <div style={styles.imageWrapper}>
            <span style={styles.label}>フレーム適用後</span>
            <img src={processedImage} alt="加工済み" style={styles.image} />
          </div>
        </div>
      )}

      {processedImage && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <button
            onClick={() => setRotation(rotation + 90)}  // ボタンを押すと90度回転
            style={styles.button}
          >
            フレームを90度回転
          </button>
        </div>
      )}

      {processedImage && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <button
            onClick={downloadImage}
            style={styles.button}
            onMouseOver={(e) => e.target.style.backgroundColor = '#5b92b8'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#68B36C'}
          >
            ダウンロード
          </button>
        </div>
      )}
      <footer style={styles.footer}>
        created by <a href="https://x.com/ino463" target="_blank" style={styles.link}>いのしろ</a>
      </footer>
    </div>
  );
};

export default TensegrityFrameGenerator;