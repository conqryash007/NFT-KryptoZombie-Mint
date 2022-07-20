import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { providerOptions } from "./providerOptions";
import { ABI, contractAddress } from "./config";

import { MDBSpinner } from "mdb-react-ui-kit";

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
  const [nftLoading, setNftLoading] = useState(false);

  const [contractKBZ, setContractKBZ] = useState(null);

  const [mintTraxLoad, setMintTraxLoad] = useState(false);

  const connectWallet = async () => {
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
    setUserNFT([]);
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
    setNftLoading(true);
    const findNFTs = async () => {
      try {
        const balOfUser = await contractKBZ.balanceOf(account);

        const promise = [];

        for (let i = 0; i < balOfUser; i++) {
          promise.push(contractKBZ.tokenOfOwnerByIndex(account, i));
        }
        const val = await Promise.all(promise);

        const userNFTs = await Promise.all(
          val.map((curr) => {
            const idx = parseInt(curr._hex, 16);
            return contractKBZ.kryptoZombie(idx);
          })
        );
        setUserNFT(userNFTs);
        setNftLoading(false);
      } catch (err) {}
    };
    if (contractKBZ && account) {
      findNFTs();
    }
  }, [contractKBZ, account]);

  const mintZombie = async () => {
    if (contractKBZ) {
      try {
        setMintTraxLoad(true);
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
      setMintTraxLoad(false);
    }
  };

  return (
    <div>
      <div className="container-filled">
        <nav
          className="navbar navbar-dark fixed-top 
                bg-dark flex-md-nowrap p-0 shadow"
          style={{ backgroundColor: "black" }}
        >
          <div
            className="navbar-brand col-sm-3 col-md-3 
                mr-0"
            style={{ color: "white" }}
          >
            Krypto Zombie NFTs
          </div>
          <ul className="navbar-nav px-3">
            <li
              className="nav-item text-nowrap
                d-none d-sm-none d-sm-block
                "
            >
              <small className="text-white">
                {account ? (
                  <button className="disconnectBtn" onClick={disconnect}>
                    DISCONNECT
                  </button>
                ) : null}
                <button className="connectBtn" onClick={connectWallet}>
                  {account
                    ? `${account.slice(0, 6)}...${account.slice(-2)}`
                    : "CONNECT"}
                </button>
              </small>
            </li>
          </ul>
        </nav>

        <div className="container-fluid mt-1">
          <div className="row upper-cont-001">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div
                className="content mr-auto ml-auto"
                style={{ opacity: "0.9" }}
              >
                <h3 className="animate-charcter">
                  Krypto Zombie
                  <br /> NFT Marketplace
                </h3>
                {account ? (
                  <div className="container">
                    <button
                      className="mintBtn glow-on-hover"
                      onClick={mintZombie}
                    >
                      {mintTraxLoad ? (
                        <MDBSpinner />
                      ) : (
                        <>
                          <span role="img">🧟‍♀️</span> MINT YOUR ZOMBIE
                          <span>🧟</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : null}
              </div>
            </main>
          </div>
          <hr></hr>
          <div className="row textCenter container-nft">
            {userNFT.length > 0 ? (
              userNFT.map((curr, key) => {
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
                          style={{
                            marginRight: "4px",
                            backgroundColor: "black",
                          }}
                        />
                        <MDBCardBody>
                          <MDBCardTitle style={{ color: "gold" }}>
                            {" "}
                            KryptoZombie{" "}
                          </MDBCardTitle>
                          <MDBCardText style={{ color: "wheat" }}>
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
              })
            ) : account ? (
              !nftLoading ? null : (
                <>
                  <div className="loader">
                    <h1>L</h1>
                    <MDBSpinner grow className="mx-2" color="warning" />
                    <h1>ADING</h1>
                  </div>
                </>
              )
            ) : (
              <>
                <h1
                  className="text-coonect-acc"
                  style={{ margin: "auto", marginTop: "10vh", color: "gold" }}
                >
                  Please Connect a account
                </h1>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
