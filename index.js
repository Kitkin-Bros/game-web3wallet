import "regenerator-runtime/runtime";
import {ethers} from "ethers";
import {parseUnits, hexlify, fetchJson} from "ethers/lib/utils";

let provider;
let signer;

document.addEventListener("DOMContentLoaded", loadApp());


function returnToApp() {
    // console.log("redirect")
    //var user_agent_header = navigator.userAgent;
    window.location.href = "madbackpackdeeplink:// ";
    // setTimeout(function () {
    //     window.location.href = "madbackpackdeeplink:// ";
    // }, 25);

    // if (user_agent_header.indexOf('iPhone') != -1 || user_agent_header.indexOf('iPod') != -1 || user_agent_header.indexOf('iPad') != -1) {
    //
    // }
}


async function loadApp() {
    provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    signer = provider.getSigner();
    if (!signer) window.location.reload();
    await provider.send("eth_requestAccounts", []);
    processAction();
}

function processAction() {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get("action");
    const message = urlParams.get("message");
    const chainId = urlParams.get("chainId") || 1;
    const to = urlParams.get("to");
    const value = urlParams.get("value");
    const data = urlParams.get("data") || "";
    const gasLimit = urlParams.get("gasLimit") || undefined;
    const gasPrice = urlParams.get("gasPrice") || undefined;
    const backendOrderId = urlParams.get("serverTransactionId") || undefined;
    const BACKENDAPI = 'https://back.madbackpacks.io/api/v1/order'

    if (action === "sign" && message) {
        return signMessage(message, BACKENDAPI, backendOrderId);
    }

    if (action === "send" && to && value) {
        return sendTransaction(chainId, to, value, gasLimit, gasPrice, data, BACKENDAPI, backendOrderId);
    }

    copyToClipboard("error");
    displayResponse("Invalid URL");

    copyToClipboard("error");

    returnToApp()
}


async function sendTransaction(chainId, to, value, gasLimit, gasPrice, data, BACKENDAPI, backendOrderId) {
    try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const network = await provider.getNetwork();
        if (network.chainId !== chainId) {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{chainId: `0x${parseInt(chainId, 10).toString(16)}`}], // chainId must be in hexadecimal numbers
            });
        }
        const from = await signer.getAddress();
        const tx = await signer.sendTransaction({
            from,
            to,
            value: parseUnits(value, "wei"),
            gasLimit: gasLimit ? hexlify(Number(gasLimit)) : gasLimit,
            gasPrice: gasPrice ? hexlify(Number(gasPrice)) : gasPrice,
            data: data ? data : "0x",
        });
        // displayResponse("Transaction sent.<br><br>Copy to clipboard then continue to App", tx.hash);
        transactionComplete(tx, BACKENDAPI, backendOrderId)
        displayResponse("Transaction completed.<br>", tx.hash);

        // await copyToClipboard(tx.hash);
    } catch (error) {
        // await copyToClipboard("error");
        // displayResponse("Transaction Denied");
        console.log(error)
        transactionCancel(error, BACKENDAPI, backendOrderId)
        displayResponse("Transaction Canceled.<br>",);

        // await copyToClipboard("error");
    }

    returnToApp()
}

async function signMessage(message) {
    try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const signature = await signer.signMessage(message);
        console.log({signature});
        displayResponse("Signature complete.<br><br>Copy to clipboard then continue to App", signature);
        await copyToClipboard(signature);
    } catch (error) {
        // await copyToClipboard("error");
        // displayResponse("Signature Denied");
        transactionCancel(error, BACKENDAPI, backendOrderId)
        displayResponse("Transaction Canceled.<br>",);

        // await copyToClipboard("error");
    }

    returnToApp()
}

async function copyToClipboard(response) {
    try {
        // focus from metamask back to browser
        window.focus();
        // wait to finish focus
        await new Promise((resolve) => setTimeout(resolve, 500));
        // copy tx hash to clipboard
        await navigator.clipboard.writeText(response);
        document.getElementById("response-button").innerHTML = "Copied";
    } catch {
        // for metamask mobile android
        const input = document.createElement("input");
        input.type = "text";
        input.value = response;
        document.body.appendChild(input);
        input.select();
        document.execCommand("Copy");
        input.style = "visibility: hidden";
        document.getElementById("response-button").innerHTML = "Copied";
    }
}

function displayResponse(text, response) {
    // display error or response
    const responseText = document.getElementById("response-text");
    responseText.innerHTML = text;
    responseText.className = "active";

    if (response) {
        // display button to copy tx.hash or signature
        const responseButton = document.getElementById("response-button");
        responseButton.className = "active";
        responseButton.onclick = () => copyToClipboard(response);
    }
}


function transactionCancel(error, BACKENDAPI, backendOrderId) {
    if (error.code == 4001) {
        fetchJson(`${BACKENDAPI}/${backendOrderId}/cancel`, {method: 'GET',}).then(function (data){
            console.log(data)
        })        
    }
}


function transactionComplete(tx, BACKENDAPI, backendOrderId) {
    fetchJson(`${BACKENDAPI}/${backendOrderId}/complete`, {method: "POST", body: JSON.stringify({'tx_hash': tx['hash']})})
    .then(function(data){
        console.log(data)
    })

}