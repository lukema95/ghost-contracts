pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Ghost is Ownable {
  mapping(address => bool) register;
  mapping(address => address) router;

  event enroll(address);
  event route(address);

  constructor() {
  }

  function enroll() internal {
    bool registed = register[msg.sender];
    require(registed == false, "Error 1");
    register[msg.sender] = true;
  }
  
  function route(address to) internal {
    bool registed = register[msg.sender];
    require(registed == true, "Error 2");
    route[msg.sender] = to;
  }

  function setRoute(address to) external {
    enroll();
    route(to);
  }

  function getRoute() external view returns (address) {
    address route = router[msg.sender];
    if(route == address(0)) {
      return msg.sender;
    }

    return route;
  }

}
