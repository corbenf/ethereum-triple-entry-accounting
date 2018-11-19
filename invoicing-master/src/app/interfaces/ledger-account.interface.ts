export interface ILedgerAccount {
    _id?: string,
    code: number,
    accountName: string,
    category: string,
    subCategory: string,
    description: string,
    debits: [{
        _id?: string,
        date: Date,
        amount: number,
        reference: string,
        blockNumber: string,
        txHash: string
    }]
    credits: [{
        _id?: string,
        date: Date,
        amount: number,
        reference: string,
        blockNumber: string,
        txHash: string
    }]
    owner: string
}