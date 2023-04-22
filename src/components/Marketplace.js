import Navbar from "./Navbar";
import NFTTile from "./NFTTile";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";

export default function Marketplace() {
const sampleData = [
    {
        "name": "NFT#1",
        "description": "My College CBIT",
        "website":"https://www.cbit.ac.in/",
        "image":"https://gateway.pinata.cloud/ipfs/Qmej3AoCu6j7YYZefjkjjcqmZncftQuYQavg8xP8ja78mq",
        "price":"0.5ETH",
        "currentlySelling":"True",
        "address":"0xe93ae4b03e1eE78b8Aa17641Ff6dA94c3b463B13",
    },
    {
        "name": "NFT#2",
        "description": "My College ID",
        "website":"https://www.cbit.ac.in/",
        "image":"https://gateway.pinata.cloud/ipfs/QmbKR97d9mJVNFP4hyfDcxcmw2PQbzRsDuUaEV5pjCa7vY",
        "price":"10ETH",
        "currentlySelling":"True",
        "address":"0xe93ae4b03e1eE78b8Aa17641Ff6dA94c3b463B13",
    },
    {
        "name": "NFT#3",
        "description": "My Picture",
        "website":"https://www.cbit.ac.in/",
        "image":"https://gateway.pinata.cloud/ipfs/QmXkUxoRdEqUGSEWPhh36W7aVMMzHwD1p3W4ecrcFxXU9C",
        "price":"0.3ETH",
        "currentlySelling":"True",
        "address":"0xe93ae4b03e1eE78b8Aa17641Ff6dA94c3b463B13",
    },
];
const [data, updateData] = useState(sampleData);
const [dataFetched, updateFetched] = useState(false);

async function getAllNFTs() {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
    //create an NFT Token
    let transaction = await contract.getAllNFTs()

    //Fetch all the details of every NFT from the contract and display
    const items = await Promise.all(transaction.map(async i => {
        const tokenURI = await contract.tokenURI(i.tokenId);
        let meta = await axios.get(tokenURI);
        meta = meta.data;

        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
        }
        return item;
    }))

    updateFetched(true);
    updateData(items);
}

if(!dataFetched)
    getAllNFTs();

return (
    <div>
        <Navbar></Navbar>
        <div className="flex flex-col place-items-center mt-20">
            <div className="md:text-xl font-bold text-blue-700">
                Uploaded NFTs
            </div>
            <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
                {data.map((value, index) => {
                    return <NFTTile data={value} key={index}></NFTTile>;
                })}
            </div>
        </div>            
    </div>
);

}