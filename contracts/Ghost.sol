// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Ghost {

  mapping(address => address[]) public registry;
  mapping(address => address) public router;

  event Register(address, address[]);
  event Route(address, address);

  constructor() {
  }

  function register(address[] memory _registry) external {
    address[] memory registed = registry[msg.sender];
    require(registed.length == 0, "user already registed");
    for (uint i = 0; i < _registry.length; i++) {
      registry[msg.sender].push(_registry[i]);
    }

    emit Register(msg.sender, _registry);
    
  }

  function queryRegistry(address _account) public view returns(address[] memory){
    address[] memory _registry = registry[_account];
    return _registry;
  }

  function queryRegistryIndex(address _account, uint256 index) public view returns(address) {
    address[] memory _registry = registry[_account];
    require(_registry.length > index, "index larger than user's registry length");
    return _registry[index];
  }
  
  function route(address to) external {
    address[] memory _registry = registry[msg.sender];
    require(_registry.length > 0, "user has not registered yet");
    require(router[msg.sender] == address(0), "user already routed");

    for (uint i = 0; i < _registry.length; i++) {
      if (to == _registry[i]) {
        router[msg.sender] = to;
        emit Route(msg.sender, to);
      }
    }

    require(router[msg.sender] != address(0), "failed to obtain a matching registered address");
  }

  function queryRoute(address _account) external view returns (address) {
    address redirection = router[_account];
    if(redirection == address(0)) {
      return msg.sender;
    }

    return redirection;
  }

}
