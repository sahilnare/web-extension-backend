// import 'dotenv/config';
// import express from 'express';
// import cors from 'cors';
// import uuidv4 from 'uuid/v4';
const SHA256 = require('crypto-js/sha256');
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const uuidv4 = require('uuid/v4');

//Blockchain

class Block{
    constructor(index, data, previousHash = ''){
        this.index = index;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty)
    {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0"))
        {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: " + this.hash);
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
    }

    createGenesisBlock(){
        return new Block(0, "Genesis Block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++)
        {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash())
            {
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash)
            {
                return false;
            }
        }
        return true;
    }
}

let brogrammers = new Blockchain();


let users = {
  1: {
    id: 'dnksdf-sjadknkje-skj37-aksdh23',
    username: 'Sahil Nare',
    hash: 'fibueh73y82ehdwii7328yuewhbdu373273uehddjsaui73'
  }
};

// const models = require('./models');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use((req, res, next) => {
//   req.context = {
//     models,
//   };
//   next();
// });


// Main
app.get('/', (req, res) => {
  return res.send('Welcome!');
});
app.get('/test', (req, res) => {
  res.send('Testing testing');
});


app.get('/users', (req, res) => {
  return res.send(Object.values(users));
});
app.get('/users/:userId', (req, res) => {
  return res.send(users[req.params.userId]);
});
app.post('/users', (req, res) => {
  const id = uuidv4();
  brogrammers.addBlock(new Block(id, { amount : req.body.text }));
  lastBlock = brogrammers.getLatestBlock();
  const message = {
    id,
    username: req.body.text,
    hash: lastBlock.hash,
  };
  users[id] = message;
  return res.send(message);
});


app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);
