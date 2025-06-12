
import type { ChecklistItem } from '@/types';
import { WalletCards, HelpCircle, Bitcoin, CreditCard, ArrowRightLeft, Home, User, FileText, PlayCircle, ShoppingBag, PartyPopper } from 'lucide-react';

export const initialChecklistItems: ChecklistItem[] =[
  {
    "id": "1",
    "name": "Learn About Crypto",
    "Icon": PlayCircle,
    "text": "Grasp core cryptocurrency concepts and how digital currencies function.",
    "steps": [
      {
        "id": "1-step-1",
        "texts": [
          "To learn more about crypto in general and how it works, kindly watch the video below."
        ],
        "videos": [
          "https://www.youtube.com/watch?v=Zoz9gvhLgpM"
        ],
        "images": [],
        "notes": [],
        "cites": [],
        "completed": false
      }
    ]
  },
  {
    "id": "2",
    "name": "Understand Bitcoin",
    "Icon": Bitcoin,
    "text": "Discover Bitcoin's origins, its role as the first cryptocurrency, and its impact.",
    "steps": [
      {
        "id": "2-step-1",
        "texts": [
          "The entire crypto industry is based on Bitcoin which is called Digital Gold. See the video below to learn more about Bitcoin and its history."
        ],
        "videos": [
          "https://www.youtube.com/watch?v=41JCpzvnn_0"
        ],
        "images": [],
        "notes": [],
        "cites": [],
        "completed": false
      }
    ]
  },
  {
    "id": "3",
    "name": "Creating Crypto Wallet from Argent Mobile",
    "Icon": WalletCards,
    "text": "Set up your Argent mobile wallet to interact with the Starknet blockchain.",
    "steps": [
      {
        "id": "3-step-1",
        "texts": [
          "From the Play Store (for Android) or from the wallet Store (for iOS), search for the 'Argent - Starknet Wallet' app then select the 'Install' button."
        ],
        "videos": [],
        "images": [
          "https://i.imgur.com/BDfPp0V.jpeg",
          "https://i.imgur.com/bFAKAvE.jpeg"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "3-step-2",
        "texts": [
          "Once the Argent wallet is installed on the mobile phone, select the 'Open' button then select the 'Get Started' button to start the registration process."
        ],
        "videos": [],
        "images": [
          "https://i.imgur.com/2Eu4zZf.jpeg",
          "https://i.imgur.com/WV3vUFi.jpeg"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "3-step-3",
        "texts": [
          "First is to enter the required email address when asked then to accept its Terms & Conditions. Open the mail wallet to select the 'Verify email' button from the received email."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png",
          "https://placehold.co/300x200.png",
          "https://placehold.co/300x200.png",
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "3-step-4",
        "texts": [
          "After verifying the email address, the Argent wallet will now ask for a phone number."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png",
          "https://placehold.co/300x200.png"
        ],
        "notes": [
          "While it is recommended to register a phone number, this was skipped for this tutorial. This can be updated later in the Argent wallet."
        ],
        "cites": [],
        "completed": false
      },
      {
        "id": "3-step-5",
        "texts": [
          "To let the Argent wallet send notifications onto the mobile phone, select the 'Enable notifications' button."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "3-step-6",
        "texts": [
          "Select the 'Enable now' button to enable wallet recovery without a seed phrase [1] to complete the registration process."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png",
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [
          "[Coinbase. (n.d.). What is a seed phrase?](https://www.coinbase.com/learn/wallet/what-is-a-seed-phrase) Coinbase Learn."
        ],
        "completed": false
      }
    ]
  },
  {
    "id": "4",
    "name": "Creating Crypto Wallet from Rabby Mobile",
    "Icon": WalletCards,
    "text": "Create your Rabby mobile wallet, opening doors to the vast Ethereum (Ethereum-compatible) ecosystem.",
    "steps": [
      {
        "id": "4-step-1",
        "texts": [
          "From the Play Store (for Android) or from the wallet Store (for iOS), search for the 'Rabby Wallet - Crypto & EVM' app then select the 'Install' button."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "4-step-2",
        "texts": [
          "Once the Rabby wallet is installed on the mobile phone, select the 'Open' button then select the 'Create New Address' button to start the registration process. Check the wallet address provided in the 'Confirm Your Address' section then select the 'Confirm' button to proceed."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "4-step-3",
        "texts": [
          "After confirming the wallet address, provide the password to unlock the Rabby wallet, then select the 'Google Drive Backup' option to back up the seed phrase [1] of the Rabby wallet without writing it down manually."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png",
          "https://placehold.co/300x200.png",
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [
          "[Coinbase. (n.d.). What is a seed phrase?](https://www.coinbase.com/learn/wallet/what-is-a-seed-phrase) Coinbase Learn."
        ],
        "completed": false
      },
      {
        "id": "4-step-4",
        "texts": [
          "After securing the seed phrase, select the 'Done' button to complete the registration."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      }
    ]
  },
  {
    "id": "5",
    "name": "Frequently Asked Questions (FAQs) in Crypto",
    "Icon": HelpCircle,
    "text": "Find answers to common crypto questions and solidify your understanding.",
    "steps": [
      {
        "id": "5-step-1",
        "texts": [
          "What is Bitcoin?",
          "Bitcoin is the first widely used digital currency that lets people send and receive money directly over the internet without needing a bank. It operates on a decentralized blockchain and has a limited supply of 21 million units, making it a scarce digital asset."
        ],
        "videos": [],
        "images": [],
        "notes": [],
        "cites": [
          "[Coinbase (n.d.). What is Bitcoin?](https://www.coinbase.com/learn/crypto-basics/what-is-bitcoin) Coinbase Learn."
        ],
        "completed": false
      },
      {
        "id": "5-step-2",
        "texts": [
          "What is a crypto wallet?",
          "A crypto wallet is like a digital bank account that lets you store, send, and receive cryptocurrencies. It keeps the private keys of the crypto user, which are like passwords that allow access to its money."
        ],
        "videos": [],
        "images": [],
        "notes": [],
        "cites": [
          "[Coinbase. (n.d.). What is a crypto wallet?](https://www.coinbase.com/learn/crypto-basics/what-is-a-crypto-wallet) Coinbase Learn."
        ],
        "completed": false
      },
      {
        "id": "5-step-3",
        "texts": [
          "What is a seed phrase?",
          "A seed phrase is a series of random words that acts as a master key to a crypto wallet and all its digital assets. If access to a wallet is lost, this phrase is the only way to recover the funds. It is extremely important to keep this phrase secret and safe, as anyone who knows it can take the associated crypto."
        ],
        "videos": [],
        "images": [],
        "notes": [],
        "cites": [
          "[Coinbase. (n.d.). What is a seed phrase?](https://www.coinbase.com/learn/wallet/what-is-a-seed-phrase) Coinbase Learn."
        ],
        "completed": false
      },
      {
        "id": "5-step-4",
        "texts": [
          "Why is there a need to create separate crypto wallets such as Argent and Rabby if there are simpler and easier platforms such as GCrypto from Gcash?",
          "While GCrypto offers an easy entry to the crypto industry, wallets like Argent and Rabby provide greater control, broader access to the crypto ecosystem, enhanced security, and true ownership of one's digital assets, unlocking future possibilities."
        ],
        "videos": [],
        "images": [],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "5-step-5",
        "texts": [
          "What is Ethereum?",
          "Ethereum is a global, decentralized computing platform that extends blockchain security and openness to a vast range of applications, including financial tools and games. It utilizes smart contracts to automate agreements and its native cryptocurrency, Ether (ETH), fuels network operations."
        ],
        "videos": [],
        "images": [],
        "notes": [],
        "cites": [
          "[Coinbase. (n.d.). What is Ethereum?](https://www.coinbase.com/learn/crypto-basics/what-is-ethereum) Coinbase Learn."
        ],
        "completed": false
      },
      {
        "id": "5-step-6",
        "texts": [
          "What is a Stablecoin?",
          "A stablecoin is a type of cryptocurrency designed to maintain a stable value by pegging its market value to an external reference, such as a fiat currency or gold. These coins aim to provide the speed and security of blockchain technology while mitigating the high volatility common in other cryptocurrencies. An example of stablecoins are USDC [2], USDT [3], and xDAI [4]."
        ],
        "videos": [],
        "images": [],
        "notes": [],
        "cites": [
          "[Coinbase. (n.d.). What is a stablecoin?](https://www.coinbase.com/learn/crypto-basics/what-is-a-stablecoin)",
          "[Circle. (n.d.). What is USDC?](https://www.circle.com/en/usdc)",
          "[Tether. (n.d.). How it works.](https://tether.to/en/how-it-works/)",
          "[Exponential. (n.d.). xDai asset information.](https://www.exponential.fi/xdai-asset-information)"
        ],
        "completed": false
      },
      {
        "id": "5-step-7",
        "texts": [
          "What are gas fees or transaction fees?",
          "When a transaction is made on certain blockchains (e.g., Ethereum), a small fee is typically paid to the blockchain to process it. These fees, often referred to as gas fees, compensate the blockchain participants (miners or validators) for their computational work. The amount of the fee can vary based on blockchain congestion."
        ],
        "videos": [],
        "images": [],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "5-step-8",
        "texts": [
          "Why are there so many different blockchains?",
          "Just as there are many types of applications for different uses, there are many blockchains because each one is built for specific jobs. Some blockchains are designed to handle lots of transactions very quickly (e.g., Solana), while others might focus on keeping information super private or supporting complex programs (e.g., Ethereum). This variety helps the crypto world grow by letting different projects pick the best tool for what they're trying to build."
        ],
        "videos": [],
        "images": [],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "5-step-9",
        "texts": [
          "What is the difference between blockchain and network?",
          "A blockchain is the shared, secure digital record book of transactions, while the network refers to all the computers and participants working together to maintain that book, with examples like Ethereum as a blockchain with its network, Starknet as a network scaling the Ethereum blockchain, and Gnosis Chain as another distinct blockchain with its own network."
        ],
        "videos": [],
        "images": [],
        "notes": [],
        "cites": [
          "[Coinbase. (n.d.). What is a blockchain?](https://www.coinbase.com/learn/crypto-basics/what-is-blockchain) Coinbase Learn."
        ],
        "completed": false
      },
      {
        "id": "5-step-10",
        "texts": [
          "Should someone invest in cryptocurrencies?",
          "This is a personal decision that depends on an individual's financial situation, risk tolerance, and investment objectives. Cryptocurrencies can be an asset with high risk and potentially high reward. It is essential for individuals to conduct their own research (mostly known as DYOR), understand the associated risks, and only invest in funds they can afford to lose. Individuals should avoid succumbing to hype or get-rich-quick schemes."
        ],
        "videos": [],
        "images": [],
        "notes": [],
        "cites": [],
        "completed": false
      }
    ]
  },
  {
    "id": "6",
    "name": "Buying Crypto From Ramp Network",
    "Icon": ShoppingBag,
    "text": "Learn to buy crypto using Ramp Network, a service for converting traditional money.",
    "steps": [
      {
        "id": "6-step-1",
        "texts": [
          "Prior to buying any crypto, kindly check first the wallet address as its recipient.",
          "If using the Argent wallet, select the 'Fund' button and select the 'From another Starknet wallet' option.",
          "If using the Rabby wallet, select the 'Receive Crypto' option then select the first option. Select the 'Copy Address' button to copy the specified wallet address to the clipboard."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png",
          "https://placehold.co/300x200.png"
        ],
        "notes": [
          "Tap the address below to copy it to the clipboard.",
          "Transak does not currently support Argent wallet (which currently works in the Starknet network) in the meantime."
        ],
        "cites": [],
        "completed": false
      },
      {
        "id": "6-step-2",
        "texts": [
          "From the web browser, go to the website of Ramp Network (https://ramp.network) then select the 'Buy & sell crypto' button."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "6-step-3",
        "texts": [
          "From the window modal, enter the USD value and the crypto to be bought (etc., XDAI from Gnosis) then select the 'Proceed' button to continue."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [
          "When selecting a network, use Starknet network for the Argent wallet while Gnosis, Optimism or Arbitrum networks for the Rabby wallet."
        ],
        "cites": [],
        "completed": false
      },
      {
        "id": "6-step-4",
        "texts": [
          "Before checking out, register for an account first on the website then select the 'Proceed' button."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "6-step-5",
        "texts": [
          "After creating an account for the Ramp Network, enter the specified wallet address then select the 'Continue' button for checking out."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "6-step-6",
        "texts": [
          "From Step 2 in checking out, select the 'Card' option and 'Continue' button to proceed. Include the required card details then select the 'Add card' button to continue."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [
          "Depending on the card provided, provide the One-Time PIN (OTP) in the same window modal."
        ],
        "cites": [],
        "completed": false
      },
      {
        "id": "6-step-7",
        "texts": [
          "Verify the details provided then select the 'Buy now' button to confirm the order."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "6-step-8",
        "texts": [
          "When asked what the type of wallet was provided from the previous steps, select the 'Self-hosted (I have full control)' option. Confirm the wallet ownership by selecting the 'I confirm the ownership of the wallet' option then select the 'Continue' button."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "6-step-9",
        "texts": [
          "If asked for the Know Your Customer (KYC) [1] procedure, prepare the required documents (e.g., Passport, Driver's License, etc.) first then select the 'Proceed' button to continue."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [
          "[Coinbase. (n.d.). What is Know Your Customer (KYC)?](https://www.coinbase.com/learn/crypto-basics/what-is-kyc) Coinbase Learn."
        ],
        "completed": false
      },
      {
        "id": "6-step-10",
        "texts": [
          "After verifying the KYC process, enter the required value in the 'Security code' field then select the 'Pay with Card' button to continue."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [
          "There may be an instance that an OTP is required from the card issuer. Enter the required value to continue."
        ],
        "cites": [],
        "completed": false
      },
      {
        "id": "6-step-11",
        "texts": [
          "Once the transaction is successful from the card issuer, the specified crypto should be sent to the specified wallet."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      }
    ]
  },
  {
    "id": "7",
    "name": "Buying Crypto From Transak using Gcash",
    "Icon": CreditCard,
    "text": "Purchase crypto via Transak using Gcash for a localized payment experience.",
    "steps": [
      {
        "id": "7-step-1",
        "texts": [
          "Before buying any crypto, kindly check first the wallet address as its recipient. From the Rabby wallet, select the 'Receive Crypto' option then select the first option. Select the 'Copy Address' button to copy the specified wallet address to the clipboard."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [
          "Transak does not currently support Argent wallet (which currently works in the Starknet network) in the meantime."
        ],
        "cites": [],
        "completed": false
      },
      {
        "id": "7-step-2",
        "texts": [
          "From the web browser, go to the website of Transak (https://transak.com) then select the 'Buy crypto' button as an Individual."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "7-step-3",
        "texts": [
          "From the window modal, enter the PHP value and the crypto to be bought (etc., XDAI from Gnosis Chain) then select the 'Buy Now' button to continue."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "7-step-4",
        "texts": [
          "In the next section, paste the recipient address which was provided earlier then select the 'Buy USDC' button."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "7-step-5",
        "texts": [
          "Next is enter the email to be provided for the login or registration then select the 'Continue' button."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "7-step-6",
        "texts": [
          "From the email, get the verification code provided then select the 'Continue' button."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "7-step-7",
        "texts": [
          "If asked for the Know Your Customer (KYC) [1] procedure, prepare the required documents (e.g., Passport, Driver's License, etc.) first then select the 'Continue' button."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [
          "[Coinbase. (n.d.). What is Know Your Customer (KYC)?](https://www.coinbase.com/learn/crypto-basics/what-is-kyc) Coinbase Learn."
        ],
        "completed": false
      },
      {
        "id": "7-step-8",
        "texts": [
          "After verifying the KYC process, review the following details then select the 'Confirm' button to continue."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "7-step-9",
        "texts": [
          "After being redirected to another page, proceed with the payment using Gcash QR."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "7-step-10",
        "texts": [
          "Once the payment is confirmed, the window will be redirected back to the previous page indicating the crypto has been successfully sent to the specified wallet address."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      }
    ]
  },
  {
    "id": "8",
    "name": "Bridging Crypto From Argent Mobile",
    "Icon": ArrowRightLeft,
    "text": "Move crypto assets across different blockchains using Argent Mobile's bridging capabilities.",
    "steps": [
      {
        "id": "8-step-1",
        "texts": [
          "From the Assets page of the Argent wallet, select the 'Fund' button then the 'From an exchange or other chain' button to make a deposit."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "8-step-2",
        "texts": [
          "In the 'Select chain' section, select the chain that will send the funds with its token in the 'Select token' section (e.g., xDAI from Gnosis Chain network). Once a token is selected, a deposit wallet address will be generated then select the 'Copy' button to copy the said address to the clipboard."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "8-step-3",
        "texts": [
          "From the wallet that sends funds to the Argent wallet (e.g., Coinbase Wallet), perform the sending of the requested token (e.g., xDAI) to the recipient's address."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [
          "Always verify the recipient's address prior sending. Putting the wrong deposit address leads to the loss of funds."
        ],
        "cites": [],
        "completed": false
      },
      {
        "id": "8-step-4",
        "texts": [
          "After sending the token to the recipient's address, a 'Waiting for deposit' message will be shown on the Activity page. The expected token (e.g., DAI) should be shown in the Argent wallet on the Assets page in a few minutes."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      }
    ]
  },
  {
    "id": "9",
    "name": "Creating a RealT Account",
    "Icon": User,
    "text": "Register on RealT to explore fractional real estate investments via tokens.",
    "steps": [
      {
        "id": "9-step-1",
        "texts": [
          "Go to the RealT website (https://realt.co) then select the 'Get Started' button."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "9-step-2",
        "texts": [
          "From the My account page, fill in the required details in the Register section then select the 'Register' button to continue."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "9-step-3",
        "texts": [
          "After the registration, check the email from RealToken, Inc. for the activation link then select the 'click here' link."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "9-step-4",
        "texts": [
          "Once the account has been activated, select the 'Complete Registration' button to continue the registration process."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [
          "Alternatively, select the 'Learn About RealT' button to learn more about its concept and its use cases."
        ],
        "cites": [],
        "completed": false
      },
      {
        "id": "9-step-5",
        "texts": [
          "From the My Account page, scroll down to the specified page for their Know Your Customer (KYC) [1] procedure. Prepare the required documents (e.g., Passport, Driver's License, etc.) first then select the 'Continue' button to proceed."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [
          "[Coinbase. (n.d.). What is Know Your Customer (KYC)?](https://www.coinbase.com/learn/crypto-basics/what-is-kyc) Coinbase Learn."
        ],
        "completed": false
      },
      {
        "id": "9-step-6",
        "texts": [
          "Once approved, a window modal will appear showing that the KYC procedure was successful. Select the 'Our Projects' button to continue to the next step."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "9-step-7",
        "texts": [
          "Proceed to buy any property on the Our Projects page. Check the Buying a Property from RealT guide on how to buy a property first-time."
        ],
        "videos": [],
        "images": [],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "9-step-8",
        "texts": [
          "Prior to buying a property from RealT, a crypto wallet (e.g., Rabby wallet) is required with a balance of at least $50 XDAI in the Gnosis Chain. Please see the following guides below for the specified prerequisite:",
          "Creating Crypto Wallet from Rabby Mobile",
          "Buying Crypto from Transak",
          "Buying Crypto from Ramp Network"
        ],
        "videos": [],
        "images": [],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "9-step-9",
        "texts": [
          "Go to the RealT website (https://realt.co) then select the 'Register / Sign In' button to sign in."
        ],
        "videos": [],
        "images": [],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "9-step-10",
        "texts": [
          "After placing the order from the Checkout page, select the 'your Portfolio' link in the Wallet Setup section to continue."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "9-step-11",
        "texts": [
          "From the Your Portfolio page, select the 'Get a RealToken Wallet' button to create the specified crypto wallet. If still asked, select the 'Get Started' button to continue, accept the terms and conditions in the window modal then select the 'Enroll' button."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [
          "If asked for the Multi Factor Authentication (MFA), it is also possible to skip it for now then configure it after creating the crypto wallet."
        ],
        "cites": [],
        "completed": false
      },
      {
        "id": "9-step-12",
        "texts": [
          "After connecting through social login (e.g., Google), select the 'Initialize Wallet' button to continue."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "9-step-13",
        "texts": [
          "Once the crypto wallet is created, copy the wallet address found in the Property Wallet section for reference then proceed to step 8 of the Buying a Property from RealT guide to proceed with the payment of the first ordered property."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "9-step-14",
        "texts": [
          "From the Rabby wallet, select the 'Dapps' button then access the Request Finance website (https://app.request.finance)."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      }
    ]
  },
  {
    "id": "10",
    "name": "Buying a Property from RealT",
    "Icon": Home,
    "text": "Navigate the process of acquiring your first tokenized property on RealT.",
    "steps": [
      {
        "id": "10-step-1",
        "texts": [
          "Before buying a property from RealT, a crypto wallet (e.g., Rabby wallet) is required. The specified wallet should have enough XDAI in the Gnosis Chain to cover the cost of the property to buy. Please see the following guides below for the specified prerequisite:",
          "Creating Crypto Wallet from Rabby Mobile",
          "Buying Crypto from Transak",
          "Buying Crypto from Ramp Network"
        ],
        "videos": [],
        "images": [],
        "notes": [
          "XDAI is the main cryptocurrency that operates on the Gnosis Chain, a blockchain network based on Ethereum."
        ],
        "cites": [],
        "completed": false
      },
      {
        "id": "10-step-2",
        "texts": [
          "Go to the RealT website (https://realt.co) then select the 'Register / Sign In' button. From the Login section, fill in the required details then select the 'Log In' button."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "10-step-3",
        "texts": [
          "From the Our Projects page, find a property to buy by selecting the 'Add to Cart' button on each property."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "10-step-4",
        "texts": [
          "After adding the specified properties to the cart, select the shopping cart icon in the upper right of the website to proceed for checkout."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "10-step-5",
        "texts": [
          "From the Cart page, verify the added properties then select the 'Proceed to Checkout' button."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "10-step-6",
        "texts": [
          "From the Checkout page, fill in the required fields in the Billing details section then select Crypto Invoice as the mode of payment then select the Gnosis in the Payment Chain field and xDAI in the Payment Currency field. Select the checkbox button to agree to the website's terms and conditions then select the 'Place Order' button to continue."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [
          "Alternatively, a credit card or debit card can also be used as the mode of payment. Please take note of the 1.50% charge for the card processing fee."
        ],
        "cites": [],
        "completed": false
      },
      {
        "id": "10-step-7",
        "texts": [
          "After placing the order from the Checkout page, the message below should be shown that the process was completed successfully:",
          "Your Invoice Will Arrive Shortly.",
          "An email should arrive in your inbox at rollogutib@gmail.com within the next 60 minutes. This email will provide a link to securely make your payment for this order.",
          "Please check your spam filter if you do not see the email shortly.",
          "Please check your inbox and pay promptly. The invoice for this order will expire in 10 hours, after which the order will be cancelled."
        ],
        "videos": [],
        "images": [],
        "notes": [
          "If this is a first-time buying a property, kindly go back to the Creating a RealT Account guide first to finalize the creation of a Real Token crypto wallet."
        ],
        "cites": [],
        "completed": false
      },
      {
        "id": "10-step-8",
        "texts": [
          "After placing the order from the Checkout page, select the 'your Portfolio' link in the Wallet Setup section to continue:",
          "Your Invoice Will Arrive Shortly.",
          "An email should arrive in your inbox at rollogutib@gmail.com within the next 60 minutes. This email will provide a link to securely make your payment for this order.",
          "Please check your spam filter if you do not see the email shortly.",
          "Please check your inbox and pay promptly. The invoice for this order will expire in 10 hours, after which the order will be cancelled.",
          "Wallet Setup",
          "It's time to set up your digital wallet! This wallet will hold your RealTokens and the rent you earn."
        ],
        "videos": [],
        "images": [],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "10-step-9",
        "texts": [
          "From the Rabby wallet, select the 'Dapps' button then access the Request Finance website (https://app.request.finance)."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "10-step-10",
        "texts": [
          "From the Login page of the Request Finance, select the 'Sign up' link to create an account. Fill in the required details in the form then select the 'Create your account' button to continue."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [
          "If the account was already created, proceed instead to login the credentials then select the 'Login' button."
        ],
        "cites": [],
        "completed": false
      },
      {
        "id": "10-step-11",
        "texts": [
          "From the email, select the 'Confirm my account' button to verify the provided email for the created account. Once verified, select the 'Get Started' button to proceed."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "10-step-12",
        "texts": [
          "Finalize the requested information to complete the account creation."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [
          "If redirected to the Tasks page, kindly ignore the required steps for now to proceed directly to the Home page."
        ],
        "cites": [],
        "completed": false
      },
      {
        "id": "10-step-13",
        "texts": [
          "From the Home page, select the hamburger icon in the upper right part of the website to go to the Bills page from Payments section. Then find the latest invoice to be paid in the Awaiting Payment section (e.g., June 6th)."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "10-step-14",
        "texts": [
          "In the specified invoice, select the 'Pay Now' button to proceed with its payment. If asked, select the 'Yes, the information is correct' button. Then proceed to connect a crypto wallet using the Rabby wallet. If asked to connect to the specified website, select the 'Connect' button."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "10-step-15",
        "texts": [
          "Once the crypto wallet is connected, select the 'Pay Now' button in the window modal to start its payment. From the Rabby wallet, select the 'Sign' then 'Confirm' buttons respectively to confirm."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      }
    ]
  },
  {
    "id": "11",
    "name": "Signing Contracts from RealT",
    "Icon": FileText,
    "text": "Complete your RealT property purchase by digitally signing the required contracts.",
    "steps": [
      {
        "id": "11-step-1",
        "texts": [
          "Before signing any contracts from RealT, kindly check that the specified property has been paid from Request Finance."
        ],
        "videos": [],
        "images": [],
        "notes": [
          "Please see the Buying a Property from RealT guide on how to buy a property from the RealT website."
        ],
        "cites": [],
        "completed": false
      },
      {
        "id": "11-step-2",
        "texts": [
          "Find the email from Tediji for the recently bought property then select the 'Sign' button to continue."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "11-step-3",
        "texts": [
          "From the Tediji website, review the requested fields in the contract by selecting the 'Next' button. Once the requested fields are all checked, select the 'Sign' button to proceed."
        ],
        "videos": [],
        "images": [],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "11-step-4",
        "texts": [
          "In the Consent window modal, check the required checkbox fields then select the 'Next' button."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "11-step-5",
        "texts": [
          "In the Signature window modal, encode the requested signature then select the 'Sign' button to finalize the contract."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      },
      {
        "id": "11-step-6",
        "texts": [
          "Once the property contract has been signed, a message will be shown that the required documents were signed successfully."
        ],
        "videos": [],
        "images": [
          "https://placehold.co/300x200.png"
        ],
        "notes": [],
        "cites": [],
        "completed": false
      }
    ]
  },
  {
    "id": "12",
    "name": "Welcome, Crypto Native!",
    "Icon": PartyPopper,
    "text": "You've successfully completed your initial crypto flight—congratulations!",
    "steps": [
      {
        "id": "12-step-1",
        "texts": [
          "Acknowledge completion and commit to safe exploration practices."
        ],
        "videos": [],
        "images": [],
        "notes": [
          "Remember to always do your own research (DYOR), stay safe, and engage responsibly. Happy exploring, Crypto Native!"
        ],
        "cites": [],
        "completed": false
      }
    ]
  }
];

