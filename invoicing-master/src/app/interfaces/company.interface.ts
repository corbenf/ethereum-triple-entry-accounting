export interface ICompany {
    _id: string,
    name: string,
    streetAddress: [{
        street: string,
        suburb: string,
        city: string,
        postCode: string
    }],
    phoneNumber: string,
    emailAddress: string,
    webSiteAddress: string,
    gstNumber: string,
    hexAccount: string,
    invoiceStyleColor: string,
    currentInvoiceNumber: number
}