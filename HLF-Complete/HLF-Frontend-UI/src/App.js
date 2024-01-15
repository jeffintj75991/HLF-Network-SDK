import React, { useState } from 'react';
import './App.css'; 

import {
  submitPrivateTransaction,
  privateQuery,
  submitPublicTransaction,
  publicQuery,
  getBlockHeight,
  subscribeEvent,
  getSubscriptionList
} from './BlockchainAPI';
import logo from './hlf-logo.png';
const App = () => {
  const [privateSubmitData, setPrivateSubmitData] = useState('');
  const [privateQueryData, setPrivateQueryData] = useState('');
  const [publicSubmitData, setPublicSubmitData] = useState('');
  const [publicQueryData, setPublicQueryData] = useState('');
  const [blockHeightData, setBlockHeightData] = useState({ channelName: '' });
  const [subscribeEventData, setSubscribeEventData] = useState('');

  const [response, setResponse] = useState(null);

  const handleFormSubmit = async (event, apiFunction, dataSetter) => {
    event.preventDefault();
    try {
      const data = await apiFunction(JSON.parse(dataSetter));
      setResponse(data);
    } catch (error) {
      setResponse(null);
      console.error(error);
    }
  };

  const handleBlockHeightSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await getBlockHeight(blockHeightData.channelName);
      setResponse(data);
    } catch (error) {
      setResponse(null);
      console.error(error);
    }
  };

  return (
    <div className="app-container" style={{ backgroundColor: 'peachpuff' }}>

     
      <img 
      src={logo} 
      alt="Your Image Alt Text" 
      style={{  
        width: '100%',
        maxWidth: '600px',
        margin: '-150px 50px 10px 1100px', // Top, Right, Bottom, Left
        marginLeft: 'auto',  // Align to the right
        marginRight: '-100px',  // Add additional right margin
        display: 'block',

       }} />

<h1 style={{ textAlign: 'left', marginTop: '-200px', fontSize: '5em',color: 'blue'  }}>Hyperledger fabric application</h1>

      {/* Forms for Submit Transactions */}
      <div className="form-container">
        <form onSubmit={(e) => handleFormSubmit(e, submitPrivateTransaction, privateSubmitData)}>
          <label>
            Submit Private Transaction:
            <textarea
              rows="12"
              cols="70"
              value={privateSubmitData}
              onChange={(e) => setPrivateSubmitData(e.target.value)}
            />
          </label>
          <button type="submit">Submit </button>
        </form>

        <form onSubmit={(e) => handleFormSubmit(e, submitPublicTransaction, publicSubmitData)}>
          <label>
            Submit Public Transaction:
            <textarea
              rows="12"
              cols="70"
              value={publicSubmitData}
              onChange={(e) => setPublicSubmitData(e.target.value)}
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>

      {/* Forms for Querying */}
      <div className="form-container">
        <form onSubmit={(e) => handleFormSubmit(e, privateQuery, privateQueryData)}>
          <label>
            Query Private Data:
            <textarea
              rows="12"
              cols="70"
              value={privateQueryData}
              onChange={(e) => setPrivateQueryData(e.target.value)}
            />
          </label>
          <button type="submit">Submit</button>
        </form>

        <form onSubmit={(e) => handleFormSubmit(e, publicQuery, publicQueryData)}>
          <label>
            Query Public Data:
            <textarea
              rows="12"
              cols="70"
              value={publicQueryData}
              onChange={(e) => setPublicQueryData(e.target.value)}
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>

      {/* Form for Event Subscription */}
      <div className="form-container subscribe-event">
        <form onSubmit={(e) => handleFormSubmit(e, subscribeEvent, subscribeEventData)}>
          <label>
            Subscribe Events:
            <textarea
              rows="12"
              cols="70"
              value={subscribeEventData}
              onChange={(e) => setSubscribeEventData(e.target.value)}
            />
          </label>
          <button type="submit" style={{ marginRight: '-500px' }}>Submit</button>
        </form>
      </div>

      {/* Form for Block Height */}
      <div className="form-container">
        <form onSubmit={handleBlockHeightSubmit}>
          <label>
            Channel Name for Block Height:
            <input
              type="text"
              value={blockHeightData.channelName}
              onChange={(e) => setBlockHeightData({ channelName: e.target.value })}
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>

      {/* Form for Subscription List */}
      <div className="form-container subscription-list">
        <form onSubmit={(e) => handleFormSubmit(e, getSubscriptionList, null)}>
          <label>Subscription List:</label>
          <button type="submit" style={{ marginBottom: '100px',marginRight: '1000px' }}>Get Subscription List</button>
        </form>
      </div>

      {/* Display Response */}
      <div className="response-container">
        <strong>Response:</strong>
        <textarea
          rows="15"
          cols="70"
          value={response && JSON.stringify(response, null, 2)}
          readOnly
          style={{ color: 'red' }}
        />
      </div>
    </div>
  );
};

export default App;
