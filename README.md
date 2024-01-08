# LYNC-Unity-AA-WebGL
LYNC AA SDK is a no-code Unity SDK allowing seamless integration of Account Abstraction. 
Supported Platforms: WebGL (Browser Games)

## Download the SDK
Download the SDK: [https://github.com/LYNC-WORLD/LYNC-Unity-AA/releases/](https://github.com/LYNC-WORLD/LYNC-Unity-AA-WebGL/releases)

## Get your API Key
Please get your API key before downloading the SDK from [here](https://www.lync.world/form.html)

## Installation
Import the SDK .unitypackage file to your project. or simply drag and drop the .unitypackage file to your project.

![image](https://github.com/LYNC-WORLD/LYNC-Unity-AA/assets/42548654/f7d176b5-2871-44d1-b121-bc43a4ecbbbc)


Once the Account Abstraction SDK package has finished importing into your Unity project, you can begin integrating it into your game.
The Folder structure looks like this

<img width="300" alt="Screenshot 2023-11-28 at 5 58 24 PM" src="https://github.com/LYNC-WORLD/LYNC-Unity-AA/assets/42548654/000dfd02-f167-4412-bb7d-66108e03ce02">

## Integrating AA SDK in Unity

There are 2 Example Projects present in the SDK:
Assets -> LYNC-AA-WEBGL -> Example / Example-2

<img width="700" alt="Screenshot 2023-11-28 at 6 00 09 PM" src="https://github.com/LYNC-WORLD/LYNC-Unity-AA-WebGL/assets/42548654/35a95059-1177-4af2-8344-b256e0259a20">

You can find the example scene in the folders. Simply pass the API key in lyncManager GameObject.
To test, Build and Run after adding this scene in (Scene in Build).

<img width="482" alt="Screenshot 2023-11-28 at 6 01 39 PM" src="https://github.com/LYNC-WORLD/LYNC-Unity-AA-WebGL/assets/42548654/d130d3e2-fb83-409b-944c-f6381e448e84">


## Setup the Project

To use, LYNC Manager Prefab, it needs to be attached to the first scene. This will serve as the starting point for your project.
In LYNC Manager Prefab, be sure to provide the following details:
1. LYNC API Key ([The API Key can be generated from here](https://lync.world/form.html))
2. Choose chain
3. Pass in the Dapp API Key ([The API key can be generated from the Biconomy Dashboard](https://dashboard.biconomy.io/))
4. Web3 Auth Client ID ([The API key can be generated from the Web3 Auth Dashboard](https://dashboard.web3auth.io/login))

Once done, You can attach the Login Example Script in your Scene by dragging and dropping a Button as a Game Object 

<img width="499" alt="Screenshot 2023-11-28 at 6 45 41 PM" src="https://github.com/LYNC-WORLD/LYNC-Unity-AA-WebGL/assets/42548654/94bb12aa-f349-4c47-8fe2-06030e88ab26">

To Login with Code:
```
using LYNC;
using LYNC.Wallet;

LyncManager.Instance.walletAuth.ConnectWallet(
  wallet =>
  {
      Debug.Log("EOA Address: "+walletData.PublicAddress);
      Debug.Log("Smart Account Address: "+walletData.SmartAccount);
  },
  error =>
  {
    Debug.LogError(error);
  }
);
```


