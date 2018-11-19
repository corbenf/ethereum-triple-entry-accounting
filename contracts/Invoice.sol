pragma solidity ^0.4.24;
contract Invoice{

    address owner;   
    uint number;
    uint256 issueDate;
    address to;
    address from;
    uint256 dueDate;
    bytes32 reference;
    bytes32[] lines; 
    uint subTotal;    
    uint GST;
    uint grandTotal;
    uint amountPaid;
    bytes signature;
    State state;

    enum State {
        Invoiced,
        Signed,
        Paid,
        Overdue,
        OverdueSigned
    }

    constructor(
        uint _number,
        uint256 _issueDate,
        address _to,
        address _from, 
        uint256 _dueDate, 
        bytes32 _ref,  
        bytes32[] _lines, 
        uint _subTotal,
        uint _GST, 
        uint _grandTotal) 
    public{
        owner = msg.sender;
        number = _number;
        issueDate = _issueDate;
        to = _to;
        from = _from;
        dueDate = _dueDate;
        reference = _ref;
        lines = _lines;
        subTotal = _subTotal;
        GST = _GST;
        grandTotal = _grandTotal;
        amountPaid = 0;
        signature = "";
        state = State.Invoiced;

        emit logNewInvoice(address(this), _number, _to, msg.sender);
    }

    event logNewInvoice(address invoiceAddress, uint invoiceNumber, address to, address from);
    event logInvoiceSigned(address signedBy, bytes signature);
    event logInvoicePayment(address paidBy, uint paymentAmount);
    event logBalanceTransfer(address supplier, uint transferAmount, uint newContractBalance);

    function getInvoiceDetails() 
    public view 
    returns (
        uint256 _number,
        uint256 _issueDate, 
        address _to,
        address _from, 
        uint256 _dueDate,
        bytes32 _ref,
        bytes32[] _lines,
        uint _subTotal,
        uint _GST,
        uint _grandTotal,
        uint _amountPaid,
        bytes _custSig,
        State _state)
    {
        if(block.timestamp > dueDate){
            if(state == State.Invoiced) _state = State.Overdue;
            if(state == State.Signed) _state = State.OverdueSigned;
            if(state == State.Paid) _state = state;
            if(state == State.Overdue) _state = state;
            if(state == State.OverdueSigned) _state = state;
        } else {
            _state = state;
        }
        return(number,issueDate,to,from,dueDate,reference,lines,subTotal,GST,grandTotal,amountPaid,signature,_state);
    }
    
    function payInvoice(uint _amountPaid) public payable returns (bool success) {
        if(state != State.Signed) revert("Invoice must be signed before payment.");
        require(msg.value == _amountPaid, "msg.value/_amountPaid discrepancy");
        if(_amountPaid != grandTotal){revert("Invoice must be paid in full.");}

        else {
            amountPaid = _amountPaid;
            emit logInvoicePayment(msg.sender, msg.value);
            transferInvoiceBalanceToOwner();
            return true;
        }
    }

    function transferInvoiceBalanceToOwner() public returns (bool success){
        uint balBeforeTransfer = address(this).balance;
        owner.transfer(amountPaid);
        emit logBalanceTransfer(owner, balBeforeTransfer, address(this).balance);
        state = State.Paid;
        return true;
    }

    function signInvoice(bytes _signature) public returns(bool success){
        if(state != State.Invoiced) revert("Invoice must be in State.Invoiced to sign");
        if(msg.sender != to) revert("Only customer can sign an invoice");

        signature = _signature;
        state = State.Signed;
        emit logInvoiceSigned(msg.sender, _signature);
        return true;
    }
}