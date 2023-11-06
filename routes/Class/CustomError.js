class CustomError extends Error{
    constructor(messgae, code ){
        super(messgae);
        this.name = 'CustomError';
        this.code = code;
    }
}

module.exports = {
    CustomError,
    NotFound        : new CustomError("해당 게시글이 존재하지 않습니다."  , 404),

    NotPermitted    : new CustomError("허가되지 않은 접근 입니다."      , 404),

    NoData          : new CustomError("조회 데이터가 존재하지 않습니다."  , 400),
    NoComments      : new CustomError("댓글 내용을 입력해주세요."        , 400),
    NoRequiredData  : new CustomError("필수 데이터를 입력해주세요."       , 400),
    // Valid Data
    InvalidPw       : new CustomError("비밀번호가 불일치 합니다."        , 400),
    InvalidJoinInfo : new CustomError("비밀번호는 대소문자, 숫자로 이루어진 4글자 이상이여야 합니다.", 400),
    InvalidLoginInfo: new CustomError("닉네임 또는 패스워드를 확인해주세요.", 400),
    // Token
    InvalidToken    : new CustomError("유효하지 않은 토큰 정보 입니다."    , 401)
}