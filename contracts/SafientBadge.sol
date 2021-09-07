// SPDX-License-Identifier: MIT


pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// GENESIS SAFIENS

// KOSHIK ..

pragma solidity ^0.8.0;
pragma abicoder v2;

contract SafientBadge is ERC721, ERC721Enumerable, Ownable {
    
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdTracker;

    string public BADGES_PROVENANCE = ""; // IPFS URL WILL BE ADDED WHEN BADGES ARE ALL SOLD OUT
    
    string public LICENSE_TEXT = ""; // IT IS WHAT IT SAYS
    
    bool licenseLocked = false; // TEAM CAN'T EDIT THE LICENSE AFTER THIS GETS TRUE

    uint256 public constant badgePrice = 40000000000000000; // 0.04 ETH

    uint public constant maxBadgePurchase = 10;

    uint256 public constant MAX_BADGES = 10000;

    bool public saleIsActive = false;
    
    mapping(uint => string) public badgeNames;
    
    // Reserve 10 badges for the team and give aways
    uint public badgeReserve = 20;

    string public baseTokenURI;

    event CreateBadge(uint256 indexed id);
    
    event badgeNameChange(address _by, uint _tokenId, string _name);
    
    event licenseisLocked(string _licenseText);

    constructor(string memory baseURI) ERC721("Safien Badge", "SFNB") { 
        setBaseURI(baseURI);
    }

    function _totalSupply() internal view returns (uint) {
        return _tokenIdTracker.current();
    }
    
    function withdraw() public onlyOwner {
        uint balance = address(this).balance;
        payable (address(msg.sender)).transfer(balance);
    }
    
    function reserveBadges(address _to, uint256 _reserveAmount) public onlyOwner {        
        uint supply = totalSupply();
        require(_reserveAmount > 0 && _reserveAmount <= badgeReserve, "Not enough reserve left for team");
        for (uint i = 0; i < _reserveAmount; i++) {
            _safeMint(_to, supply + i);
        }
        badgeReserve = badgeReserve.sub(_reserveAmount);
    }


    function setProvenanceHash(string memory provenanceHash) public onlyOwner {
        BADGES_PROVENANCE = provenanceHash;
    }

    
        function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        baseTokenURI = baseURI;
    }



    function flipSaleState() public onlyOwner {
        saleIsActive = !saleIsActive;
    }
    
    
    function tokensOfOwner(address _owner) external view returns(uint256[] memory ) {
        uint256 tokenCount = balanceOf(_owner);
        if (tokenCount == 0) {
            // Return an empty array
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 index;
            for (index = 0; index < tokenCount; index++) {
                result[index] = tokenOfOwnerByIndex(_owner, index);
            }
            return result;
        }
    }
    
    // Returns the license for tokens
    function tokenLicense(uint _id) public view returns(string memory) {
        require(_id < totalSupply(), "CHOOSE A BADGE WITHIN RANGE");
        return LICENSE_TEXT;
    }
    
    // Locks the license to prevent further changes 
    function lockLicense() public onlyOwner {
        licenseLocked =  true;
        emit licenseisLocked(LICENSE_TEXT);
    }
    
    // Change the license
    function changeLicense(string memory _license) public onlyOwner {
        require(licenseLocked == false, "License already locked");
        LICENSE_TEXT = _license;
    }
    
    
    function mintBadge(address _to, uint numberOfTokens) public payable {
        require(saleIsActive, "Sale must be active to mint badge");
        require(numberOfTokens > 0 && numberOfTokens <= maxBadgePurchase, "Can only mint 10 tokens at a time");
        require(totalSupply().add(numberOfTokens) <= MAX_BADGES, "Purchase would exceed max supply of Badges");
        require(msg.value >= badgePrice.mul(numberOfTokens), "Ether value sent is not correct");
        
        for(uint i = 0; i < numberOfTokens; i++) {
            uint mintIndex = totalSupply();
            if (totalSupply() < MAX_BADGES) {
                _tokenIdTracker.increment();
                _safeMint(_to, mintIndex);
                emit CreateBadge(mintIndex);
            }
        }

    }
     
    function changeBadgeName(uint _tokenId, string memory _name) public {
        require(ownerOf(_tokenId) == msg.sender, "Hey, your wallet doesn't own this badge!");
        require(sha256(bytes(_name)) != sha256(bytes(badgeNames[_tokenId])), "New name is same as the current one");
        badgeNames[_tokenId] = _name;
        
        emit badgeNameChange(msg.sender, _tokenId, _name);
        
    }
    
    function viewBadgeName(uint _tokenId) public view returns( string memory ){
        require(_tokenId < totalSupply(), "Choose a badge within range" );
        return badgeNames[_tokenId];
    }
    
    
    // GET ALL BADGES OF A WALLET AS AN ARRAY OF STRINGS. WOULD BE BETTER MAYBE IF IT RETURNED A STRUCT WITH ID-NAME MATCH
    function badgeNamesOfOwner(address _owner) external view returns(string[] memory ) {
        uint256 tokenCount = balanceOf(_owner);
        if (tokenCount == 0) {
            // Return an empty array
            return new string[](0);
        } else {
            string[] memory result = new string[](tokenCount);
            uint256 index;
            for (index = 0; index < tokenCount; index++) {
                result[index] = badgeNames[ tokenOfOwnerByIndex(_owner, index) ] ;
            }
            return result;
        }
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    
}