document.body.appendChild(
  Object.assign(document.createElement("script"), {
    type: "text/javascript",
    src: "./web3/ethers.min.js",
  })
);

// Init Unity dependencies
function sendUnityMessage(type, content) {
  window.unityInstance.SendMessage(
    "LyncManager",
    "GetMessage",
    JSON.stringify({
      type,
      content: JSON.stringify(content),
    })
  );
}
function sendUnityError(origin, message) {
  window.unityInstance.SendMessage(
    "LyncManager",
    "GetMessage",
    JSON.stringify({
      type: JSMessageType.ERROR,
      content: JSON.stringify({ origin, message }),
    })
  );
}
const JSMessageType = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  ERROR: "ERROR",
  TRANSACTION: "TRANSACTION",
  CONNECTED: "CONNECTED",
};

window.lync = {
  OpenLogin,
  LogOut,
  EOAAddress: "",
  smartWallet: "",
  mintNFT,
  response: "",
  WalletProvider: "",
  biconomyConfig: "",
  isSADeployed: "",
  DeploySmartWallet,
  SetResponse,
  web3auth: "",
  CheckIsWalletConnected,
};

async function OpenLogin(Web3AuthClientId, APIKey, chainID) {
  try {

    InitializeBiconomyConfig(chainID,APIKey);

    if (!lync.web3auth) {
      InitializeWeb3(Web3AuthClientId);
    }
    if (lync.web3auth.status != "ready") await lync.web3auth.initModal();

    if (lync.web3auth.status == "connected") {
      lync.WalletProvider = new ethers.providers.Web3Provider(
        lync.web3auth.provider
      );
      const accounts = await lync.WalletProvider.listAccounts();
      lync.EOAAddress = accounts[0];
      sendUnityMessage(JSMessageType.LOGIN, { publicAddress: lync.EOAAddress });
    } else {
      await lync.web3auth.connect();
      if (!lync.WalletProvider)
        lync.WalletProvider = new ethers.providers.Web3Provider(
          lync.web3auth.provider
        );
      const accounts = await lync.WalletProvider.listAccounts();
      lync.EOAAddress = accounts[0];

      sendUnityMessage(JSMessageType.LOGIN, { publicAddress: lync.EOAAddress });
    }
  } catch (error) {
    console.log(error);
    sendUnityError(JSMessageType.LOGIN, error.message);
  }
}

async function DeploySmartWallet() {
  lync.smartWallet = new window.smartAccount(
    lync.WalletProvider,
    lync.biconomyConfig
  );
  lync.smartWallet = await lync.smartWallet.init();
  let state = await lync.smartWallet.getSmartAccountState();
  lync.isSADeployed = state.isDeployed;
  console.log("window.lync.isSADeployed", lync.isSADeployed);
}

function InitializeWeb3(Web3AuthClientId){
  lync.web3auth = new window.Web3Auth({
    clientId: // Web3AuthClientId
    Web3AuthClientId,
    chainConfig: {
      chainNamespace: "eip155",
      chainId: "0x1",
    },
  });
}

function InitializeBiconomyConfig(chainID,APIKey){
  lync.biconomyConfig = {
    activeNetworkId: chainID,
    supportedNetworksIds: [chainID],
    networkConfig: [
      {
        chainId: chainID,
        dappAPIKey: APIKey,
      },
    ],
  };
}

async function mintNFT(contractAddress, ABI, functionName, args) {
  console.log("args array");
  console.log(mapArgsToArray(args));
  console.log("spread array: ");
  console.log(...mapArgsToArray(args));
  try {
    let transaction = "";
    lync.smartWallet = new window.smartAccount(
      lync.WalletProvider,
      lync.biconomyConfig
    );
    lync.smartWallet = await lync.smartWallet.init();
    let state = await lync.smartWallet.getSmartAccountState();
    console.log("state", state);
    lync.isSADeployed = state.isDeployed;

    const nftContract = new ethers.Contract(
      contractAddress,
      ABI,
      lync.WalletProvider
    );

    console.log("smartAccount.address ", lync.smartWallet.address);
    console.log("nftContract ", nftContract);
    let safeMintTx;
    const argsArray = mapArgsToArray(args);
    if (Array.isArray(argsArray) && argsArray.length > 0) {
      safeMintTx = await nftContract.populateTransaction[functionName](
        ...argsArray
      );
    } else {
      safeMintTx = await nftContract.populateTransaction[functionName]();
    }
    console.log(safeMintTx.data);

    const tx1 = {
      to: contractAddress,
      data: safeMintTx.data,
    };

    const txResponse = await lync.smartWallet.sendTransaction({
      transaction: tx1,
    });

    console.log("Tx sent, userOpHash:", txResponse);
    console.log("Waiting for tx to be mined...");
    const txHash = await txResponse.wait();
    console.log("txHash", txHash.transactionHash);

    window.lync.response = txHash.transactionHash;
    transaction = txHash.transactionHash;
    sendUnityMessage(JSMessageType.TRANSACTION, {
      txHash: transaction,
      contractAddress,
    });
  } catch (error) {
    console.log(error);
    console.log("Sending above error to Unity");
    sendUnityError(JSMessageType.TRANSACTION, error.message);
  }
}

function SetResponse(value) {
  lync.response = value;
}

async function CheckIsWalletConnected(Web3AuthClientId, APIKey, chainID) {
  try {

    InitializeBiconomyConfig(chainID,APIKey);
    InitializeWeb3(Web3AuthClientId);

    // await lync.web3auth.initModal();

    if (lync.web3auth.status == "not_ready") await lync.web3auth.initModal();
    if (lync.web3auth.status == "connected") {
      lync.WalletProvider = new ethers.providers.Web3Provider(
        lync.web3auth.provider
      );
      const accounts = await lync.WalletProvider.listAccounts();
      lync.EOAAddress = accounts[0];
      sendUnityMessage(JSMessageType.CONNECTED, {
        publicAddress: lync.EOAAddress,
      });
    } else {
      sendUnityMessage(JSMessageType.CONNECTED, { publicAddress: "" });
    }
  } catch (error) {
    console.log(error);
    sendUnityError(JSMessageType.CONNECTED, error.message);
  }
}

async function LogOut() {
  try {
    lync.web3auth.logout();
    window.sendUnityMessage(JSMessageType.LOGOUT, "success");
  } catch (error) {
    console.log(error);
    sendUnityError(JSMessageType.LOGOUT, error.message);
  }
}

function mapArgsToArray(argsString) {
  const argsArray = argsString.split(",");

  const parsedArray = argsArray.map((arg) => {
    if (/^-?\d+$/.test(arg)) {
      return parseInt(arg); // Parse as an integer
    } else if (/^-?\d*\.\d+$/.test(arg)) {
      return parseFloat(arg); // Parse as a float
    } else {
      return arg; // Keep it as a string if it's neither an int nor a float
    }
  });

  return parsedArray.filter((arg) => arg !== "");
}
