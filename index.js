var fs = require('fs');
const ethers = require('ethers')
const moment = require('moment');
const provider = new ethers.providers.WebSocketProvider('wss://mainnet.infura.io/ws/v3/e875cdf3b3764428ac1347a09e65282d')
// const provider = new ethers.providers.WebSocketProvider('wss://main-light.eth.linkpool.io/ws')
// const provider = new ethers.providers.JsonRpcProvider('https://cloudflare-eth.com/')
// const provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com/')

var lastTime = moment()
//15532008
var arrival = 0
function live() {
    provider.on("block",async (blockNumber) => {
        let block = await provider.getBlock(blockNumber)
        let blockTime = moment(block.timestamp*1000)
        var duration = moment.duration(blockTime.diff(lastTime));
        lastTime = moment(block.timestamp*1000)
        var seconds = parseInt(duration.asSeconds());
        
        fs.appendFile('LiveData.csv',`${blockNumber},${seconds},${block.transactions.length},${blockTime.format('HH:mm:ss')},${arrival/12}\n`, function (err) {
            if (err) throw err;
        });
        console.log(`Block Number ${blockNumber}, Time ${seconds}, Amount of Txs ${block.transactions.length}, BlockTime ${blockTime.format('HH:mm:ss')}, Arrival ${arrival/12}\n`)
        arrival = 0
    });
    console.log('waiting for tx to come')
    provider.on('pending',async (txHash)=>{
        // console.log(txHash)
        arrival+=1;
    })
}


async function getData(from,to){
    for(i=from;i<=to;i++){
        let blockNumber = i
        let block = await provider.getBlock(blockNumber)
        let blockTime = moment(block.timestamp*1000)
        var duration = moment.duration(blockTime.diff(lastTime));
        lastTime = moment(block.timestamp*1000)
        var seconds = parseInt(duration.asSeconds());
        console.log(`${blockNumber}, TXs ${block.transactions.length}, Time ${seconds}, Block Time ${blockTime.format('HH:mm:ss')}\n`);
        // fs.appendFile('dataPoW.csv',`${blockNumber},${block.transactions.length},${seconds},${block._difficulty.toString()},${blockTime.local()}\n`, function (err) {
            //     if (err) throw err;
        // });
    }
}

// getData(15894127-100,15894127)
live() 