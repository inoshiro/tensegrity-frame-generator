import React from 'react';
import { Helmet } from 'react-helmet';
import TensegrityFrameGenerator from './components/TensegrityFrameGenerator';

function App() {
  return (
    <div className="App">
      <Helmet>
        <title>Tensegrityフレームジェネレーター</title>
      </Helmet>
      <TensegrityFrameGenerator />
    </div>
  );
}

export default App;
