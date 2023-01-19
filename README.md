# Game Web3 Wallet

Unity Wallet. Build iOS, Android and Desktop.

Link to this site to

- Sign a message

- Send a transaction

## Installation

`yarn` to install
`yarn start` to begin
`yarn build` to compile

## Verify Login

| Params          | Description           |
| --------------- | --------------------- |
| &action=sign    | action to verify user |
| &message=hello  | message to sign       |

example to sign a message: `http://localhost:1234/?action=sign&message=helloworld`

## Send a Transaction

Create a link with the following params

| Params            | Description                                                      |
| ----------------- | ---------------------------------------------------------------- |
| &action=send      | action to send transaction                                       |
| &chainId=4        | 1 for mainnet, 4 for rinkeby etc                                 |
| &to=0xAcc0nt      | use either account or contract address                           |
| &value=1000       | value in wei to send                                             |
| &data=0x01        | data for contract interaction. leave empty if sending to account |
| &gasLimit=21000   | gas limit. leave empty to for wallet to estimate                 |
| &gasPrice=5000000 | gas Price. leave empty to for wallet to estimate                 |

example to send eth: `http://localhost:1234/?action=send&chainId=4&to=0xdD4c825203f97984e7867F11eeCc813A036089D1&value=100000000000000`

example to send trasaction to bacnkend {cancel/complete}: `http://localhost:1234/?action=send&chainId=97&to=0xf7615BB8529275F9c2736bFD7b1B01164eE8C7a5&value=0&data=0xa9059cbb0000000000000000000000006e56c7c041529347dd8c34ee78d7a38ca10c45c2000000000000000000000000000000000000000000000001158e460913d00000&gasLimit=100000&gasPrice=10000000000&serverTransactionId=43225b1b-bf1c-4588-bdf6-c195cb4ea9b1`

example to interact with contract: `http://localhost:1234/?action=send&chainId=4&to=0x7286Cf0F6E80014ea75Dbc25F545A3be90F4904F&value=0&data=0xb76b97230000000000000000000000000000000000000000000000000000000000000001`

