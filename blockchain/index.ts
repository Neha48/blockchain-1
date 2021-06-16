import * as crypto from 'crypto';
// const crypto = require('crypto');
// Transfer of funds between two wallets
export class Transaction {
  constructor(
    public amount: number, 
    public payer: string, // public key
    public payee: string // public key
  ) {}

  toString() {
    return JSON.stringify(this);
  }
}

// Individual block on the chain
export class Block {

  public nonce = Math.round(Math.random() * 999999999);

  constructor(
    public prevHash: string, 
    public transaction: Transaction, 
    public ts = Date.now()
  ) {}

  get hash() {
    const str = JSON.stringify(this);
    const hash = crypto.createHash('SHA256');
    hash.update(str).end();
    return hash.digest('hex');
  }
}


// The blockchain
export class Chain {
  // Singleton instance
  public static instance = new Chain();

  chain: Block[];
  mining:number[];
  constructor() {
    this.chain = [
      // Genesis block
      new Block('', new Transaction(100, 'genesis', 'satoshi'))
    ];
    this.mining=[0];
  }

  // Most recent block
  get lastBlock() {
    return this.chain[this.chain.length - 1];
  }

  // Proof of work system
  mine(nonce: number) {
    let solution = 1;
    console.log('⛏️  mining...')

    while(true) {

      const hash = crypto.createHash('MD5');
      hash.update((nonce + solution).toString()).end();

      const attempt = hash.digest('hex');

      if(attempt.substr(0,4) === '0000'){
        console.log(`Solved: ${solution}`);
        return solution;
      }

      solution += 1;
    }
  }

  // Add a new block to the chain if valid signature & proof of work is complete
  addBlock(transaction: Transaction, senderPublicKey: string, signature: Buffer):number {
    const verify = crypto.createVerify('SHA256');
    verify.update(transaction.toString());

    const isValid = verify.verify(senderPublicKey, signature);
    let mined=0;
    if (isValid) {
      const newBlock = new Block(this.lastBlock.hash, transaction);
      mined=this.mine(newBlock.nonce);
      this.chain.push(newBlock);
      this.mining.push(mined);
      console.log('verified');
    }
    return mined;
  }

  mineBlock(amount: number,payerPublicKey:string,payerPrivateKey:string, payeePublicKey: string):number{

    const transaction = new Transaction(amount, payerPublicKey, payeePublicKey);

    const sign = crypto.createSign('SHA256');
    sign.update(transaction.toString()).end();
    const signature = sign.sign(payerPrivateKey);

    const verify = crypto.createVerify('SHA256');
    verify.update(transaction.toString());

    const isValid = verify.verify(payerPublicKey, signature);

    if (isValid) {
      const newBlock = new Block(this.lastBlock.hash, transaction);
      const m = this.mine(newBlock.nonce);
      return m;
    }
    return 0;
  }
}

// Wallet gives a user a public/private keypair
export class Wallet {
  public publicKey: string;
  public privateKey: string;

  constructor(w?:any) {
    console.log(w);
    const keypair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    this.privateKey = w.privateKey===undefined?keypair.privateKey:w.privateKey;
    this.publicKey = w.publicKey===undefined?keypair.publicKey:w.publicKey;
  }
  
  sendMoney(amount: number, payeePublicKey: string) : any{
    const transaction = new Transaction(amount, this.publicKey, payeePublicKey);

    const sign = crypto.createSign('SHA256');
    sign.update(transaction.toString()).end();

    // console.log(this.privateKey);
    const signature = sign.sign(this.privateKey); 
    const mined = Chain.instance.addBlock(transaction, this.publicKey, signature);
    const publicK = this.publicKey.split('-----');
    console.log(publicK);
    transaction.payer=publicK[2];
    const res = {Mined:mined,Transaction:transaction}
    return res;
  }
}

// Example usage

// const satoshi = new Wallet();
// const bob = new Wallet();
// const alice = new Wallet();

// satoshi.sendMoney(50, bob.publicKey);
// bob.sendMoney(23, alice.publicKey);
// alice.sendMoney(5, bob.publicKey);

// console.log(Chain.instance.chain)