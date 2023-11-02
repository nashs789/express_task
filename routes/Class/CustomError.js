class CustomError extends Error{
    constructor(messgae, code ){
        super(messgae);
        this.name = 'CustomError';
        this.code = code;
    }
}

module.exports = {
    CustomError,
    NoData     : new CustomError("데이터가 존재하지 않습니다.", 400),
    FailedToReg: new CustomError("등록에 실패 하였습니다.", 400)
}