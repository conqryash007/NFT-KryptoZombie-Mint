import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { providerOptions } from "./providerOptions";
import { ABI, contractAddress } from "./config";

import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
  MDBBtn,
} from "mdb-react-ui-kit";
import "./App.css";

const web3Modal = new Web3Modal({
  network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions, // required
});

const App = () => {
  const [provider, setProvider] = useState();
  const [library, setLibrary] = useState();
  const [account, setAccount] = useState();
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");
  const [chainId, setChainId] = useState();
  const [network, setNetwork] = useState();
  const [message, setMessage] = useState("");
  const [signedMessage, setSignedMessage] = useState("");
  const [verified, setVerified] = useState();

  const [userNFT, setUserNFT] = useState([]);

  const [contractKBZ, setContractKBZ] = useState(null);

  const connectWallet = async () => {
    console.log("-----connect wallet started----");
    try {
      const provider = await web3Modal.connect();
      const library = new ethers.providers.Web3Provider(provider);
      const accounts = await library.listAccounts();
      const network = await library.getNetwork();
      const signer = library.getSigner();
      const contKBZ = new ethers.Contract(contractAddress, ABI, signer);
      setContractKBZ(contKBZ);
      setProvider(provider);
      setLibrary(library);
      if (accounts) setAccount(accounts[0]);
      setChainId(network.chainId);
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };
  const refreshState = () => {
    setAccount();
    setChainId();
    setNetwork("");
    setMessage("");
    setSignature("");
    setVerified(undefined);
  };

  const disconnect = async () => {
    await web3Modal.clearCachedProvider();
    refreshState();
  };

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, [web3Modal.cachedProvider]);

  // FUNCTIONS
  useEffect(() => {
    const findNFTs = async () => {
      const balOfUser = await contractKBZ.balanceOf(account);

      const promise = [];

      for (let i = 0; i < balOfUser; i++) {
        promise.push(contractKBZ.tokenOfOwnerByIndex(account, i));
      }
      const val = await Promise.all(promise);

      const userNFTs = await Promise.all(
        val.map((curr) => {
          const idx = parseInt(curr._hex, 16);
          return contractKBZ.krytoBird(idx);
        })
      );
      setUserNFT(userNFTs);
    };
    if (contractKBZ && account) {
      findNFTs();
    }
  }, [contractKBZ, account]);

  console.log(account, contractKBZ);

  const mintZombie = async () => {
    if (contractKBZ) {
      try {
        let idx = await contractKBZ.totalSupply();
        idx = parseInt(idx._hex, 16);
        let stringZombie = `https://app.pixelencounter.com/api/basic/svgmonsters/${idx}?fillType=5`;

        const tx = await contractKBZ.mint(stringZombie);
        console.log("-------------------tx----");
        console.log(tx);
        const hash = await tx.wait();
        console.log("-----------------");
        console.log(hash);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div>
      {/* <h1>App</h1>
      <button onClick={connectWallet}>CONNECT</button>
      <button onClick={disconnect}>DISCONNECT</button> */}
      <div className="container-filled">
        <nav
          className="navbar navbar-dark fixed-top 
                bg-dark flex-md-nowrap p-0 shadow"
        >
          <div
            className="navbar-brand col-sm-3 col-md-3 
                mr-0"
            style={{ color: "white" }}
          >
            Krypto Zombie NFTs (Non Fungible Tokens)
          </div>
          <ul className="navbar-nav px-3">
            <li
              className="nav-item text-nowrap
                d-none d-sm-none d-sm-block
                "
            >
              <small className="text-white">
                <button onClick={connectWallet}>CONNECT</button>
                <button onClick={disconnect}>DISCONNECT</button>
              </small>
            </li>
          </ul>
        </nav>

        <div className="container-fluid mt-1">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div
                className="content mr-auto ml-auto"
                style={{ opacity: "0.8" }}
              >
                <h1 style={{ color: "black" }}>
                  Krypto Zombie - NFT Marketplace
                </h1>
                <button className="mintBtn" onClick={mintZombie}>
                  MINT
                </button>
              </div>
            </main>
          </div>
          <hr></hr>
          <div className="row textCenter">
            {userNFT.map((curr, key) => {
              return (
                <div key={key}>
                  <div>
                    <MDBCard
                      className="token img"
                      style={{ maxWidth: "22rem" }}
                    >
                      <MDBCardImage
                        src={curr}
                        position="top"
                        height="250rem"
                        style={{ marginRight: "4px", backgroundColor: "black" }}
                      />
                      <MDBCardBody>
                        <MDBCardTitle> KryptoZombie </MDBCardTitle>
                        <MDBCardText>
                          {" "}
                          The KryptoZombie are uniquely generated pixel zombie
                          from the depts of a corrupted server! There is only
                          few of them and each zombie can be owned by a single
                          person on the Ethereum blockchain.{" "}
                        </MDBCardText>
                      </MDBCardBody>
                    </MDBCard>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
