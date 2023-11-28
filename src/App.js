import { Alchemy, Network } from "alchemy-sdk";
import { Fragment, useEffect, useState } from "react";

import "./App.css";

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [showTransactions, setShowTransactions] = useState(true);
  const [txHashes, setTxHashes] = useState();

  const handleButtonClick = () => {
    setShowTransactions(false);
  };

  useEffect(() => {
    async function getBlockNumber() {
      const block = await alchemy.core.getBlockWithTransactions();
      setBlockNumber(block);
      setTxHashes(
        block.transactions.map((tx) => {
          return {
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            number: tx.blockNumber,
          };
        })
      );
    }

    getBlockNumber();
  }, []);
  console.log(blockNumber);

  return (
    <Fragment>
      <div className='Wrapper'>
        {blockNumber && showTransactions === true ? (
          <div className={`Blocking ${showTransactions ? "" : "hidden"}`}>
            <p>The Actual Block number is: {blockNumber.number}</p>
            <button className='button' onClick={handleButtonClick}>
              Show me Txs from that block
            </button>
          </div>
        ) : (
          <div className={`Blocking ${showTransactions ? "" : "hidden"}`}>
            <p>Loading...</p>
          </div>
        )}

        {blockNumber && showTransactions === false ? (
          <div className='Txs'>
            {txHashes.map((tx, i) => (
              <div className='Tx button'>
                <p>You are in BlockNumber: {tx.number}</p>
                <p>Tx number: {i}</p>
                <p key={i}>
                  Hash: {tx.hash.slice(0, 4)}....{tx.hash.slice(-4)}
                </p>
                <p>From: {tx.from}</p>
                <p>To: {tx.to}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className=''></div>
        )}
      </div>
    </Fragment>
  );
}

export default App;
