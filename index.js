const shajs = require('sha.js');

const calcularHash = (block) => {
    let text = block.index + block.timestamp + block.prevHash + block.getStringData() + block.nonce;
    let chain = new shajs.sha256().update(text).digest('hex');
    return chain.toString();
}


class Block {
    constructor(index, data, prevHash = "") {
        this.index = index;
        this.prevHash = prevHash;
        this.data = data;
        this.timestamp = new Date().getTime();
        this.nonce = 0;
        this.hash = calcularHash(this);
    }

    getStringData() {
        return JSON.stringify(this.data);
    }
    
    getStringBlock() {
        return JSON.stringify(this);
    }

    mine(difficult) {
        let begin = Array(difficult + 1).join("0");
        while (this.hash.substring(0, difficult) != begin) {
            this.nonce++;
            this.hash = calcularHash(this)
        }
        console.log(`Finish minning at ${this.nonce} iterations`);
    }
}

class BlockChain {
    constructor() {
        let genesisBlock = new Block(0, "Bloque Genesis", null);
        genesisBlock.mine(4);
        this.chain = [genesisBlock];
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    validateBlock(newBlock) {
        let lastBlock = this.getLastBlock();
        let validate = true;

        if(lastBlock.hash != newBlock.prevHash) {
            console.log("Previous Hash Invalid")
            validate = false;
        } else if(lastBlock.index + 1 != newBlock.index) {
            console.log("Previous Index Invalid")
            validate = false;
        } else if(newBlock.hash != calcularHash(newBlock)) {
            console.log("New Hash Invalid")
            validate = false
        }

        return validate;
    }

    createBlock(data) {
        let lastBlock = this.getLastBlock();
        let newBlock = new Block(lastBlock.index + 1, data, lastBlock.hash);
        newBlock.mine(4);

        if(this.validateBlock(newBlock)) {
            this.chain.push(newBlock);
        }

    }

    print() {
        this.chain.forEach(block => console.log(block.getStringBlock()));
    }
}

const blockchain = new BlockChain();
blockchain.createBlock("Hola Mundo");
blockchain.print();