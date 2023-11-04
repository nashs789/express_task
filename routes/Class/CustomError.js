class CustomError extends Error{
    constructor(messgae, code ){
        super(messgae);
        this.name = 'CustomError';
        this.code = code;
    }
}

// server error로 500 떨궈야 하는거 아닌가? code는 사용자 정의 에러코드인가????
module.exports = {
    CustomError,
    NoData      : new CustomError("데이터가 존재하지 않습니다."  , 400),
    FailedToReg : new CustomError("등록에 실패 하였습니다."     , 400),
    InvalidUser : new CustomError("유효하지 않은 유저 정보입니다.", 400),
    NoComments  : new CustomError("댓글 내용을 입력해주세요."    , 400),
    NotValidPw  : new CustomError("비밀번호가 불일치 합니다."    , 400),
    FailedUpdate: new CustomError("데이터 수정에 실패 했습니다."  , 400),
    FailedInsert: new CustomError("데이터 삽입에 실패 했습니다."  , 400),
    FailedDelete: new CustomError("데이터 삭제에 실패 했습니다."  , 400)
}