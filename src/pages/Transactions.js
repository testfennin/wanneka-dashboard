import React from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import GiftCardsTransactions from "components/Transactions/Giftcards";
import WalletsTrasactions from "components/Transactions/Wallets";
import OrdersTransactions from "components/Transactions/Orders";
import PaymentProofs from "components/Transactions/Proofs";

export const transactionType = {
    "gift-cards":"Gift Cards",
    "wallets":'Wallets',
    "payment-proofs": 'Payment Proofs'
}
const Transactions = () => {
    const params = useParams();
    console.log(params)

    if(transactionType[params.type] === 'Gift Cards'){
        return params.id ? <>Transaction - Gift Card Detail</>:<GiftCardsTransactions/>
    }
    if(transactionType[params.type] === 'Wallets'){
        return params.id ? <>Transaction - Wallet Detail</>:<WalletsTrasactions/>
    }
    if(transactionType[params.type] === 'Payment Proofs'){
        return params.id ? <>Transaction - Payment Proof Detail</>:<PaymentProofs/>
    }

    return params.id ? <>Transaction - Order Detail</>:<OrdersTransactions/>

};

export default Transactions;
