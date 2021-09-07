import React, { useEffect, useState } from "react";
import { utils } from "ethers";
import { Text, Divider, Spacer, Snippet, Table, Tag, Row, Col } from "@geist-ui/react";

function MyAccount({ address, balance, writeContracts }) {
  const [tokenBalance, setTokenBalance] = useState(0);

  useEffect(async () => {
    try {
      setTokenBalance(await writeContracts.SafientToken.balanceOf(address));
    } catch (e) {
      console.log(e);
    }
  }, [writeContracts]);


  return (
    <>
      <Text b>Account address :</Text>
      <Spacer />
      <Snippet text={address} type="lite" filled symbol="" width="390px" />
      <Divider />
      <Text b>Account balance :</Text>
      <Text>
        {balance !== undefined ? utils.formatEther(balance) : ""}
        <Spacer inline x={0.35} />
        ETH
      </Text>
      <Divider />
      <Text b>Safient token balance :</Text>
      <Text>
        {balance !== undefined ? utils.formatEther(tokenBalance) : ""}
        <Spacer inline x={0.35} />
        SAFE
      </Text>
    </>
  );
}

export default MyAccount;
