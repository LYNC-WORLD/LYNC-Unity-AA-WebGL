mergeInto(LibraryManager.library, {
  OpenLogin: function (domainAddress, APIKey, currentChainID) {
    window.lync.OpenLogin(
      UTF8ToString(domainAddress),
      UTF8ToString(APIKey),
      currentChainID
    );
  },

  LogOut: function () {
    window.lync.LogOut();
  },

  CheckIsWalletConnected: function (Web3AuthClientId, APIKey, currentChainID) {
    window.lync.CheckIsWalletConnected(
      UTF8ToString(Web3AuthClientId),
      UTF8ToString(APIKey),
      currentChainID
    );
  },

  CheckIsWalletDeployed: function () {
    if (window.lync.smartWallet.address == null) {
      return false;
    } else {
      return true;
    }
  },

  GetSmartAccount: function () {
    var str = window.lync.smartWallet.address;
    var bufferSize = lengthBytesUTF8(str) + 1;
    var buffer = _malloc(bufferSize);
    stringToUTF8(str, buffer, bufferSize);
    return buffer;
  },

  SendTransaction: function (contractAddress, ABI, functionName, args) {
    window.lync.mintNFT(
      UTF8ToString(contractAddress),
      UTF8ToString(ABI),
      UTF8ToString(functionName),
      UTF8ToString(args)
    );
  },

  response: function () {
    var str = window.lync.response;
    var bufferSize = lengthBytesUTF8(str) + 1;
    var buffer = _malloc(bufferSize);
    stringToUTF8(str, buffer, bufferSize);
    return buffer;
  },

  SmartWallet: function () {
    window.lync.DeploySmartWallet();
  },

  setResponse: function (value) {
    window.lync.SetResponse(UTF8ToString(value));
  },
});
