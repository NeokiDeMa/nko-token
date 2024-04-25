// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {ERC20Votes} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import {Nonces} from "@openzeppelin/contracts/utils/Nonces.sol";

contract NikoToken is ERC20, ERC20Permit, ERC20Votes {
  constructor() ERC20("Niko Token", "NKO") ERC20Permit("Niko Token") {
    _mint(_msgSender(), 3e27);
  }

  function _update(
    address from,
    address to,
    uint256 value
  ) internal virtual override(ERC20, ERC20Votes) {
    super._update(from, to, value);
  }

  function nonces(
    address owner
  ) public view virtual override(ERC20Permit, Nonces) returns (uint256) {
    return super.nonces(owner);
  }
}
