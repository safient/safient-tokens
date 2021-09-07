import React, { useEffect, useState } from "react";
import { utils } from "ethers";
import { Button, Text, Divider, Spacer, Snippet, Note, Input, useToasts } from "@geist-ui/react";

function SafientToken({ writeContracts, address }) {
  const [safientContractAddress, setSafientContractAddress] = useState("");
  const [safientTokenBalance, setSafientTokenBalance] = useState(0);
  const [recipientAddress, setRecipientAddress] = useState(address);
  const [arbitrationFeeWei, setArbitrationFeeWei] = useState("");
  const [fundInEth, setFundInEth] = useState("");
  const [loading, setLoading] = useState(false);
  const [toasts, setToast] = useToasts();

  const showAlert = (alertMessage, alertColor) => {
    setToast({
      text: alertMessage,
      type: alertColor,
    });
  };

  useEffect(async () => {
    try {
      setSafientContractAddress(writeContracts.SafientToken.address);
      const balance = await await writeContracts.SafientToken.totalSupply()
      setSafientTokenBalance(utils.formatEther(balance));
    } catch (e) {
      if (e.data !== undefined) {
        const error = e.data.message.split(":")[2].split("revert ")[1];
        showAlert(error + "!", "warning");
      } else {
        console.log(e);
      }
    }
  }, [writeContracts]);


  const onFormSubmit = async (e) => {
    e.preventDefault();
    if (recipientAddress !== "" && recipientAddress.length === 42) {
      
      let fundInWei;
      if (fundInEth !== 0 && fundInEth !== "" && fundInEth !== null) {
        fundInWei = utils.parseEther(fundInEth);
        try {
          setLoading(true);
          const tx = await writeContracts.SafientToken.mintTokens(recipientAddress, { value: fundInWei });
          const txReceipt = await tx.wait();
          if (txReceipt.status === 1) {
            showAlert("Transaction successful!", "success");
          } else if (txReceipt.status === 0) {
            showAlert("Transaction rejected!", "warning");
          }
        } catch (e) {
          if (e.data !== undefined) {
            const error = e.data.message.split(":")[2].split("revert ")[1];
            showAlert(error + "!", "warning");
          } else {
            showAlert("Error!", "warning");
          }
        }
      } else {
        showAlert("Enter a valid recipient address!", "warning");
      }
      
    } else {
      showAlert("Enter a valid recipient address!", "warning");
    }
  };

  return (
    <>
      <Text b>Safient token address :</Text>
      <Spacer />
      <Snippet text={safientContractAddress} type="lite" filled symbol="" width="390px" />
      <Divider />
      <Text b>Safient token supply :</Text>
      <Text>
        {safientTokenBalance}
        <Spacer inline x={0.35} />
        SFNT
      </Text>

      <Note label="Note ">
        Provide fund in Ether to receive SAFE tokens. Current value of 1 SAFE token is 0.0001 ETH (You will receive 10,000 SAFE for 1 Ether ).
        You can also provide the recipient address if you do not wish to recieve on your current wallet address.
      </Note>
      <Spacer />
      <Divider />
      <form>
   
        <Input status="secondary" clearable initialValue={recipientAddress} onChange={(e) => setRecipientAddress(e.target.value)} width="50%">
          <Text b>Receiving Address :</Text>
        </Input>
        <Spacer />
        <Input status="secondary" type="number" onChange={(e) => setFundInEth(e.target.value)} width="50%">
          <Text b>
            Provide fund in Ether: 
          </Text>
        </Input>
        <Spacer y={2} />
        {!loading ? (
          <Button type="secondary" auto onClick={onFormSubmit}>
            Claim tokens
          </Button>
        ) : (
          <Button type="secondary" auto loading>
            CClaim tokens
          </Button>
        )}
      </form>

    </>
  );
}

export default SafientToken;
