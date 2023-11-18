using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using LYNC;
using LYNC.Wallet;
using UnityEngine.SceneManagement;

public class loginExample : MonoBehaviour
{
    public Button loginButton;
    void Start()
    {
        LyncManager.Instance.Init(SceneSetup);
    }

    private void SceneSetup(LyncManager lync)
    {
        Debug.Log("LYNC READY");
        WalletData.TryLoadSavedWallet(walletData =>
        {
            Debug.Log("walletData" + walletData);
            if (walletData.WalletConnected)
            {
                Debug.Log("CONNECTED");
                GoToNextScene();
            }
            else
            {
                Debug.Log("DISCONNECTED");
            }
        });

        loginButton.onClick.AddListener(() =>
        {
            if (Application.isEditor)
            {
                GoToNextScene();
                return;
            }
            Debug.Log("Login clicked!");
            lync.walletAuth.ConnectWallet(
                wallet =>
                {
                    GoToNextScene();
                },
                error =>
                {
                    Debug.LogError(error);
                }
            );
        });
    }

    private void GoToNextScene()
    {
        int nextSceneIndex = SceneManager.GetActiveScene().buildIndex + 1;
        Debug.Log("GoToNextScene()");
        SceneManager.LoadScene(nextSceneIndex);
    }
}
