// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NikoSwap is Ownable, ReentrancyGuard {
  using SafeERC20 for IERC20;
  struct Claim {
    address sender;
    uint256 amount;
  }
  mapping(address sender => uint256 amount) public takers;
  // prettier-ignore
  address public constant paradise = address(0x8658928deDEf0442b96891880a1E22bDbE0Dd45D);
  IERC20 public oldToken;
  IERC20 public newToken;

  event Claimed(address indexed sender, uint256 amount);
  event Taker(address indexed sender, uint256 amount);

  constructor(address _newToken, address _oldToken) Ownable(_msgSender()) {
    newToken = IERC20(_newToken);
    oldToken = IERC20(_oldToken);
  }

  function claim() external nonReentrant {
    address taker = _msgSender();
    uint256 amount = takers[taker];
    uint256 swapBalance = newToken.balanceOf(address(this));

    require(taker != address(0), "Swap: taker address cannot be zero");
    require(amount > 0, "Swap: taker has no balance to withdraw");
    require(
      swapBalance >= amount,
      "Swap: contract doesnt have enough NKO v2 to withdraw"
    );
    delete takers[taker];

    // if taker has old token swap the same amount
    uint256 oldTokenAmount = oldToken.balanceOf(taker);
    if (oldTokenAmount >= amount) {
      oldToken.safeTransferFrom(taker, paradise, amount);
    }
    newToken.safeTransfer(taker, amount);
    emit Claimed(taker, amount);
  }

  function createClaimers(Claim[] calldata claims) external onlyOwner {
    _setClaimers(claims);
  }

  function updateTakersClaims(Claim[] calldata claims) external onlyOwner {
    _setClaimers(claims);
  }

  function withdraw(uint256 amount) external onlyOwner {
    address owner = owner();
    newToken.safeTransfer(owner, amount);
  }

  function _setClaimers(Claim[] calldata claims) internal {
    for (uint i = 0; i < claims.length; i++) {
      Claim memory taker = claims[i];
      require(taker.sender != address(0), "Swap: taker wallet cannot be zero");
      require(taker.amount > 0, "Swap: amount must be higher than zero");
      takers[taker.sender] = taker.amount;
      emit Taker(taker.sender, taker.amount);
    }
  }
}
