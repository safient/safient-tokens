pragma solidity >=0.6.0 <=0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract SafexToken is ERC20 {

     using SafeMath for uint256;

    // tokenPrice: 100000000000000 wei
    // tokenPerEth: 10000

    constructor() ERC20("Safex", "SAFE") public {
    }

    function mintTokens(address recipient) public payable {
      _mint(recipient, msg.value.mul(10000));
    }

    function burnTokens() public {
      uint256 balanceToBurn = balanceOf(msg.sender);
      _burn(msg.sender, balanceToBurn);
    }

}
