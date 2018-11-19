export interface IInvoice {
    _id?: string,
    number: number,
    issueDate: Date,
    to: string,
    from: string,
    dueDate: Date,
    reference: string,
    lines: [{
        id?: string,
        sku: string,
        name: string,
        unitCost: number,
        qty: number,
        discount: number
    }],
    subTotal: number,
    GST: number,
    grandTotal: number,
    amountPaid?: number,
    signature: string,
    state: string,
    blockchainIndex: string,
    blockNumber: string,
    txHash: string
}