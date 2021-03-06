import React, { useCallback, useEffect, useState } from "react";
import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress } from "eth-hooks";
import { useUserProvider, useContractLoader, useBalance } from "./hooks";
import { NETWORKS } from "./networks";
import { Text, Page, Tabs, Row, Col, Spacer } from "@geist-ui/react";

import ContractsNotDeployed from "./components/ContractsNotDeployed/ContractsNotDeployed";
import ConnectWeb3Modal from "./components/ConnectWeb3Modal/ConnectWeb3Modal";
import SafientToken from "./components/SafientToken";
import SafientBadges from "./components/SafientBadges";
import MyAccount from "./components/MyAccount/MyAccount";


const targetNetwork = NETWORKS["rinkeby"];
const localProviderUrl = targetNetwork.rpcUrl;
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
const localProvider = new StaticJsonRpcProvider(localProviderUrlFromEnv);

function App() {
  const [injectedProvider, setInjectedProvider] = useState();

  const userProvider = useUserProvider(injectedProvider, localProvider);
  const address = useUserAddress(userProvider);
  const balance = useBalance(userProvider, address);
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId = userProvider && userProvider._network && userProvider._network.chainId;
  const writeContracts = useContractLoader(userProvider);

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new Web3Provider(provider));
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) loadWeb3Modal();
  }, [loadWeb3Modal]);

  return (
    <Page size="large">
      <Row align="middle">
        <Col span={20}>
          <Page.Header>Safient
            <Text h2>Safient Token</Text>
          </Page.Header>
        </Col>
        <Col span={4}>
          <ConnectWeb3Modal web3Modal={web3Modal} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />
        </Col>
      </Row>
      {localChainId && selectedChainId && localChainId != selectedChainId ? (
        <ContractsNotDeployed localChainId={localChainId} selectedChainId={selectedChainId} />
      ) : (
        <>
          <Spacer y={1} />
          <Tabs initialValue="3">
            <Spacer y={1} />
            <Tabs.Item label="Tokens" value="1">
              <SafientToken address={address} writeContracts={writeContracts} />
            </Tabs.Item>
            <Tabs.Item label="Badges" value="2">
              <SafientBadges address={address} writeContracts={writeContracts} />
            </Tabs.Item>
            <Tabs.Item label="account" value="3">
              <MyAccount address={address} balance={balance} writeContracts={writeContracts} />
            </Tabs.Item>
          </Tabs>
        </>
      )}
    </Page>
  );
}

const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: process.env.REACT_APP_INFURA_API_KEY,
      },
    },
  },
  theme: "dark",
});

const logoutOfWeb3Modal = async () => {
  await web3Modal.clearCachedProvider();
  setTimeout(() => {
    window.location.reload();
  }, 1);
};

window.ethereum &&
  window.ethereum.on("chainChanged", (chainId) => {
    web3Modal.cachedProvider &&
      setTimeout(() => {
        window.location.reload();
      }, 1);
  });

window.ethereum &&
  window.ethereum.on("accountsChanged", (accounts) => {
    web3Modal.cachedProvider &&
      setTimeout(() => {
        window.location.reload();
      }, 1);
  });

export default App;
