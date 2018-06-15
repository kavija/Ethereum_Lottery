import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  //contructor is just used to initialize the state with Manager property
  // constructor(props) {
  //   super(props);

  //   this.state = {manager: ''};
  // }

  //it is equals to above - initialize the state with Manager property
  state = {
    manager :'',
    players: [],//empty array
    balance : '',
    value:'',
    message:''
  };

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    // const manager = await lottery.methods.manager().call({
    //   from: accounts[0]
    // });
    //You do not have to pass the account info as the first metamask account is used by default 
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();

    //get how much money the lottery contract has so far.
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({manager, players, balance});
  }

  //Typical way of defining the function
  // onSubmit() {
  //   alert('hi');
  // }

  //this object is available that refers to the HTML Element that invokes it.
  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    this.setState({message: 'Waiting on transaction success..!'});

    //As this statement would take ~15 to ~30secs we need a state variable
    await lottery.methods.enter().send({
      from: accounts[0],
      value:  web3.utils.toWei(this.state.value, 'ether')
    });
    this.setState({message: 'You have been entered..!'});
  }

  onPickWinner = async(event) => {
    const accounts = await web3.eth.getAccounts();
    this.setState({message: 'Picking a winner..!'});

    //As this statement would take ~15 to ~30secs we need a state variable
    //As this is a transaction - expect no reply to identify the winner.
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });
    this.setState({message: 'Winner has picked'});  
  }

  render() {
    // console.log(web3);
    // web3.eth.getAccounts().then(console.log);
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {this.state.manager}
          There are currently {this.state.players.length} people entered
          Competing to win { web3.utils.fromWei(this.state.balance, 'ether')} ether!
          </p>
          <hr/>
          <form onSubmit={this.onSubmit}>
            <h4>Want to try your luck?</h4>
            <div>
              <label>Amount of Ether to enter</label>
              <input
                onChange = {event => this.setState({value : event.target.value}) }
                value = {this.state.value}
              />
              <button>Enter</button>
            </div>
          </form>
          <hr/>
          <h4>
            Ready to pick a winner
            <button onClick={this.onPickWinner}>Pick a Winner</button>
          </h4>
          <hr/>
          <h1>
            {this.state.message}
          </h1>
      </div>
    );
  }
}

export default App;
