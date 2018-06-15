const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
//  'exhibit pride hold spy ask firm easy panther runway thumb one purpose',
//  'https://ropsten.infura.io/UQXTaan7AZ5i9yU5aSga'
    'metamask mnemonic pharse',
    'https://ropsten.infura.io/poGREhs'
);

const web3 = new Web3(provider);

const deploy = async() => {
 const accounts = await web3.eth.getAccounts();
  
 console.log('Attempting to deploy from accounts', accounts[0]);

 const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode})
    .send({ from: accounts[0], gas: '1000000' });

 console.log('Contract deployed to Address', result.options.address); 
 console.log(interface);
};
deploy();
