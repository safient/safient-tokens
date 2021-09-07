// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract SafientToken is ERC20 {

     using SafeMath for uint256;

    // tokenPrice: 100000000000000 wei
    // tokenPerEth: 10000

    constructor() ERC20("Safient", "SFNT") public {
    }

    function mintTokens(address recipient) public payable {
      _mint(recipient, msg.value.mul(10000));
    }

    function burnTokens() public {
      uint256 balanceToBurn = balanceOf(msg.sender);
      _burn(msg.sender, balanceToBurn);
    }

}
