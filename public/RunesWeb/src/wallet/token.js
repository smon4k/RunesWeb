// 质押 Stake list
export default {
    HECO:{
        MdexRouter: "0x0f1c2D1FDD202768A4bDa7A38EB0377BD58d278E",
        LUSD: "0x369f2bce29d30e8c49b3a7a4c0f2c1e8af5de56b",
        USDT: "0xa71EdC38d189767582C38A3145b5873052c3e47a",
        HT: "0x0000000000000000000000000000000000000000",
        WHT: "0x5545153CCFcA01fbd7Dd11C0b23ba694D9509A6F",
        GLS: "0xfe6e9da67ff56470ac8fb41dab1f5f5baacb8262",
        numberAddress: "0x0151867E5B59FfeAf8039784E2aF2Bc70836668d",//猜数字 台子地址
        sizeAddress: "0x9bb54d1e9006ae506e81b97499459426a61feb1d", //猜大小 台子地址
        singDoubleAddress: "0xf6e73C401Aba8C8bcf5540C9ca122044830A3dBA", //猜单双 台子地址
        baccaratAddress: "0x118349b78082978d0554f8bb30AeD742D1C7d1D3", //百家乐 台子地址
        exchangeAddress: "0x98ba610e8e0bdc4b1f0a133c0c6ebde4375d969b", //兑换合约地址
        lverifyAddress: "0xFD8Cb6053f692016B5A3Cf2705069EBb87Eed280", //验牌地址
        browserUrl: 'https://www.hecoinfo.com/tx/'
    },
    ARB:{
        MdexRouter: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
        LUSD: "0xc8209b23338Fb8E3Ed5dC9Db2B3C6D22F8Fc676C",
        LUSD_MIN_BET_AMOUNT: 0.000001,
        USDT: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", //USDT
        USDC: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", //USDC
        HT: "0x0000000000000000000000000000000000000000",
        WHT: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", //WETH
        GLS: "0x282Ad65aA9ec9631aB2Ee517c4C2d05DdE5f4a35", //GLS
        numberAddress: "0xD327CA5623FE8880bA6801CAe06fa5d996392E6C", //猜数字 台子地址
        sizeAddress: "0x6CCe611a8d6225505b843c0341217e9B5881872c", //猜大小 台子地址
        singDoubleAddress: "0x10c658B21cED3CfCE7a4fd32F91e642A4B8F270f", //猜单双 台子地址
        baccaratAddress: "0x2bFD967Fb2Ea1b139cF107a510e120DEcf0A5f18", //百家乐 台子地址
        exchangeAddress: "0x5C3a6982Aca4B27c94c578303B6bc3b0dA27D2FA", //兑换合约地址
        lverifyAddress: "0xFD8Cb6053f692016B5A3Cf2705069EBb87Eed280", //验牌地址
        gamesFillingAddress: "0x2B7bB437d10a14955186ad2C1e382A2bcB8bC5d5", //充提合约地址
        luck001Address: "0x6E7F89d69aE8a0Ee3C7C3FD0e15C73452B6d1737", // _LUCK001 兑换合约地址
        luck001: "0x829D27ff1BB843a22BdE3F56853A1402f5C6Ad7d", //币种地址
        browserUrl: 'https://arbiscan.io/tx/'
    },
    BSC: {
        USDT: "0x55d398326f99059fF775485246999027B3197955",
        USDT_MIN_BET_AMOUNT: 0.000001,
        H2O: "0xC446c2B48328e5D2178092707F8287289ED7e8D6",
        Guru: "0xF1932eC9784B695520258F968b9575724af6eFa8",
        BUSDT:"0x55d398326f99059fF775485246999027B3197955",
        GLS: "0x88883a5184805ab8ad32d1e1859c903a8a938888", //Luck365
        gamesFillingAddress: "0x10EcC9165585b5a70b6489755027ad09035e5b6B", //充提合约地址
        luck001: "", //币种地址
        luck001Address: "", // _LUCK001 兑换合约地址
        browserUrl: 'https://bscscan.com//tx/'
    },
    TronGrid: {
        USDT: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
        browserUrl: 'https://tronscan.org/#/transaction/',
        gamesFillingAddress: "TWFJPJbcLrabvNqPf2FHjX2KnEjhtWhu9Y", //充提钱包地址
    }
};

// CFXsContractMain 
// CFXs符文合约:
// 0x5B5cA516a154816c977721aEaA133Bba6Be4b5B8

// CFXsIdAndDataService 
// CIS服务及Data类别合约: 
// 0xbB339b0eb57dD81e1381C29B2e9be4D9176E2C37

// CFXsERC20
// ERC20版CFXs合约：     
// 0x797Cb41A75B5460E2aD458564084C63E5B091252    

// CFXsERC721
// ERC721版CFXs合约：      
//  0x67f20599e34516B4f0138c183A79F93B28a5D8a9

// CFXsERCBridge 
// 虫洞bridge合约： 
// 0x6B25573D69CC04Db27D70daD4f338c75111A0087