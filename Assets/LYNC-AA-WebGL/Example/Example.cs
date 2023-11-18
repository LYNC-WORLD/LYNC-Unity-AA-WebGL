using System.Collections;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using LYNC;
using LYNC.Wallet;

public class Example : MonoBehaviour
{
    [Header("Components")]
    public Button loginBtn;
    public Button logoutBtn;
    public TMP_Text publicAddressTxt;

    public Button[] tokens;

    void Start()
    {
        foreach (var item in tokens)
        {
            item.interactable = false;
        }
        loginBtn.interactable = false;
        logoutBtn.interactable = false;
        publicAddressTxt.text = "Checking API key...";
        LyncManager.Instance.Init(SceneSetup);
    }

    private void SceneSetup(LyncManager lync)
    {
        publicAddressTxt.text = "LYNC ready";
        WalletData.TryLoadSavedWallet(walletData =>
        {
            if (walletData.WalletConnected)
            {
                publicAddressTxt.text = "Public address = " + walletData.PublicAddress;
                loginBtn.interactable = false;
                logoutBtn.interactable = true;

                foreach (var item in tokens)
                {
                    item.interactable = true;
                }
            }
            else
            {
                loginBtn.interactable = true;
                logoutBtn.interactable = false;
            }
        });


        loginBtn.onClick.AddListener(() =>
        {
            loginBtn.interactable = false;
            lync.walletAuth.ConnectWallet(
                wallet =>
                {
                    logoutBtn.interactable = true;
                    publicAddressTxt.text = "Public address = " + wallet.PublicAddress;

                    foreach (var item in tokens)
                    {
                        item.interactable = true;
                    }
                },
                error =>
                {
                    loginBtn.interactable = true;
                    Debug.LogError(error);
                }
            );
        });

        logoutBtn.onClick.AddListener(() =>
        {
            logoutBtn.interactable = false;
            lync.walletAuth.Logout(
                () =>
                {
                    loginBtn.interactable = true;
                    publicAddressTxt.text = "";
                },
                error =>
                {
                    logoutBtn.interactable = true;
                    Debug.LogError(error);
                }
            );
        });
    }
}
