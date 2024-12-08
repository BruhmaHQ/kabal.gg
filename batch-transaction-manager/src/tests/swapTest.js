const fetch = require('node-fetch'); 
const MAX_PATH = 14
const MAX_HOPS_PER_PATH = 3
const SWAP_FUNCTION ='0x2e8671ebdf16028d7de00229c26b551d8f145d541f96278eec54d9d775a49fe3::router::swap_generic_v4'
const COIN_NULL = '0x2e8671ebdf16028d7de00229c26b551d8f145d541f96278eec54d9d775a49fe3::router::Null'


function pathToSwapArgument(path) {
  let source
  let poolType
  let isXToY

  switch (path.source) {
    case 'pancake_swap':
      if (path.metadata?.isXToY === undefined) throw new Error(`isXToY undefined, path = ${JSON.stringify(path)}`)
      source = 1
      poolType = 1
      isXToY = path.metadata.isXToY ? 1 : 0
      break
    case 'sushi_swap':
      if (path.metadata?.isXToY === undefined) throw new Error(`isXToY undefined, path = ${JSON.stringify(path)}`)
      source = 2
      poolType = 2
      isXToY = path.metadata.isXToY ? 1 : 0
      break
    case 'liquid_swap_v0':
      if (path.metadata?.isStable === undefined) throw new Error(`isStable undefined, path = ${JSON.stringify(path)}`)
      if (path.metadata?.isXToY === undefined) throw new Error(`isXToY undefined, path = ${JSON.stringify(path)}`)
      source = 3
      poolType = path.metadata.isStable ? 3 : 2
      isXToY = path.metadata.isXToY ? 1 : 0
      break
    case 'liquid_swap_v0.5':
      if (path.metadata?.isStable === undefined) throw new Error(`isStable undefined, path = ${JSON.stringify(path)}`)
      if (path.metadata?.isXToY === undefined) throw new Error(`isXToY undefined, path = ${JSON.stringify(path)}`)
      source = 3
      poolType = path.metadata.isStable ? 1 : 0
      isXToY = path.metadata.isXToY ? 1 : 0
      break
    case 'thala_swap_stable':
      if (path.metadata?.tokenInIndex === undefined)
        throw new Error(`tokenInIndex undefined, path = ${JSON.stringify(path)}`)
      if (path.metadata?.tokenOutIndex === undefined)
        throw new Error(`tokenOutIndex undefined, path = ${JSON.stringify(path)}`)
      if (path.metadata.tokenInIndex > 1)
        throw new Error(`Not support tokenInIndex > 1 yet, path = ${JSON.stringify(path)}`)
      if (path.metadata.tokenOutIndex > 1)
        throw new Error(`Not support tokenOutIndex > 1 yet, path = ${JSON.stringify(path)}`)
      source = 4
      poolType = 0
      isXToY = path.metadata.tokenInIndex === 0 ? 1 : 0
      break
    case 'thala_swap_weighted': {
      if (path.metadata?.tokenInIndex === undefined)
        throw new Error(`tokenInIndex undefined, path = ${JSON.stringify(path)}`)
      if (path.metadata?.tokenOutIndex === undefined)
        throw new Error(`tokenOutIndex undefined, path = ${JSON.stringify(path)}`)
      if (path.metadata?.tokenInIndex > 1)
        throw new Error(`Not support tokenInIndex > 1 yet, path = ${JSON.stringify(path)}`)
      if (path.metadata?.tokenOutIndex > 1)
        throw new Error(`Not support tokenOutIndex > 1 yet, path = ${JSON.stringify(path)}`)
      if (path.metadata?.tokenInWeight === undefined)
        throw new Error(`tokenInWeight undefined, path = ${JSON.stringify(path)}`)
      if (path.metadata?.tokenOutWeight === undefined)
        throw new Error(`tokenOutWeight undefined, path = ${JSON.stringify(path)}`)
      const weight = path.metadata.tokenInIndex === 0 ? path.metadata.tokenInWeight : path.metadata.tokenOutWeight
      source = 4
      poolType = (1 << 20) + (1 << (weight / 5 - 1))
      isXToY = path.metadata.tokenInIndex === 0 ? 1 : 0
      break
    }
    // case "bapt_swap_v1":
    //   throw new Error(`Frontend not support ${path.source} yet.`)
    // case "bapt_swap_v2":
    //   throw new Error(`Frontend not support ${path.source} yet.`)
    // case "bapt_swap_v2.1":
    //   throw new Error(`Frontend not support ${path.source} yet.`)
    case 'aux_exchange':
      if (path.metadata?.isXToY === undefined) throw new Error(`isXToY undefined, path = ${JSON.stringify(path)}`)
      source = 6
      poolType = 0
      isXToY = path.metadata.isXToY ? 1 : 0
      break
    case 'cellana_finance':
      if (path.metadata?.isStable === undefined) throw new Error(`isStable undefined, path = ${JSON.stringify(path)}`)
      source = 7
      poolType = 0
      isXToY = path.metadata.isStable ? 1 : 0 // isXToY is actually isStable.
      break
    case 'cetus_amm':
      if (path.metadata?.isXToY === undefined) throw new Error(`isXToY undefined, path = ${JSON.stringify(path)}`)
      source = 8
      poolType = 0
      isXToY = path.metadata.isXToY ? 1 : 0
      break
    case 'aptoswap':
      if (path.metadata?.isXToY === undefined) throw new Error(`isXToY undefined, path = ${JSON.stringify(path)}`)
      source = 9
      poolType = 0
      isXToY = path.metadata.isXToY ? 1 : 0
      break
    case 'anime_swap':
      source = 10
      poolType = 0 // Can be anything.
      isXToY = 0 // Can be anything.
      break
    case 'econia':
      if (path.metadata?.isXToY === undefined) throw new Error(`isXToY undefined, path = ${JSON.stringify(path)}`)
      if (path.metadata?.marketId === undefined) throw new Error(`marketId undefined, path = ${JSON.stringify(path)}`)
      source = 12
      poolType = path.metadata.marketId
      isXToY = path.metadata.isXToY ? 1 : 0
      break
    case 'obric_v3_abel':
      if (path.metadata?.isXToY === undefined) throw new Error(`isXToY undefined, path = ${JSON.stringify(path)}`)
      source = 11
      poolType = 3
      isXToY = path.metadata.isXToY ? 1 : 0
      break
    default:
      throw new Error(`Frontend not support ${path.source} yet.`)
  }
  return [source, poolType, isXToY, path.srcAmount]
}

function getSwapData(args) {
  // console.log(`args`, args)
  const data = {
    function: SWAP_FUNCTION,
    functionArguments: [
      ...Array(MAX_PATH * MAX_HOPS_PER_PATH).fill([0, 0, 0, '0']),
      args.feeRecipient,
      args.feeBps,
      args.amountIn,
      args.minAmountOut,
      args.amountInUsd,
      args.amountOutUsd,
    ],
    typeArguments: [
      args.tokenIn,
      args.tokenOut,
      args.chargeFeeBy === 'token_in' ? args.tokenIn : args.tokenOut,
      ...Array(MAX_PATH * (MAX_HOPS_PER_PATH - 1)).fill(COIN_NULL),
    ],
  }
  // Fill arguments.
  for (let i = 0; i < args.paths.length; i++) {
    for (let j = 0; j < args.paths[i].length; j++) {
      data.functionArguments[i * MAX_HOPS_PER_PATH + j] = pathToSwapArgument(args.paths[i][j])
    }
  }
  // Fill typeArguments.
  if (data.typeArguments) {
    for (let i = 0; i < args.paths.length; i++) {
      if (args.paths[i].length === 1) {
        data.typeArguments[3 + i * (MAX_HOPS_PER_PATH - 1)] = args.tokenOut
        continue
      }
      for (let j = 0; j < args.paths[i].length; j++) {
        data.typeArguments[3 + i * (MAX_HOPS_PER_PATH - 1) + j] = args.paths[i][j].dstCoinType
      }
    }
  }
  // console.log(`data`, data)
  return data
}


const swap = async () =>{

    const from_coin = '0x4fbed3f8a3fd8a11081c8b6392152a8b0cb14d70d0414586f0c9b858fcd2d6a7::UPTOS::UPTOS';
    const to_coin = '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC';
    const amount = 230000000000000; 

    const swapdata = await fetch(`https://api.anqa.ag/v1/quote?srcCoinType=${from_coin}&dstCoinType=${to_coin}&amount=${amount}`);
    const res = await swapdata.json();
    console.log(res);

    const swapData = await getSwapData({
        tokenIn: res.data.srcCoinType,
        tokenOut: res.data.dstCoinType,
        amountIn: res.data.srcAmount,
        amountOut: res.data.dstAmount,
        amountInUsd: 0,
        amountOutUsd: 0,
        minAmountOut: 0, // dstAmount - slippage
        paths: res.data.paths,
      
        feeRecipient: 'def1ad463d3c4a3665db77e9be1c6cb5ad0f0237fc34ecced6d81d7768efab9b',
        feeBps: 50, // 0.5%
        chargeFeeBy: 'token_in', // token_in
    });

    console.log(swapData);
}

swap();

