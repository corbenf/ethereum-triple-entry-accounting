export interface IProduct {
    _id: string,
    sku: string,
    description: string,
    salePrice: number,
    soh: number,
    totalValue: number,
    transactions: [{
        _id: string,
        date: Date,
        type: string,
        reference: string,
        qty: number,
        unitPrice: number,
        blockNumber: string,
        txHash: string
    }],
    owner: string
}