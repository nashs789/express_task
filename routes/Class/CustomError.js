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
    NoData          : new CustomError("조회 데이터가 존재하지 않습니다."  , 400),
    NoComments      : new CustomError("댓글 내용을 입력해주세요."        , 400),
    NoRequiredData  : new CustomError("필수 데이터를 입력해주세요."       , 400),
    NoPost          : new CustomError("존재하지 않는 게시글 입니다."      , 400),
    // Valid Data
    InvalidUser     : new CustomError("유효하지 않은 유저 정보입니다."    , 400),
    InvalidPw       : new CustomError("비밀번호가 불일치 합니다."        , 400),
    InvalidJoinInfo : new CustomError("비밀번호는 대소문자, 숫자로 이루어진 4글자 이상이여야 합니다.", 400),
    InvalidLoginInfo: new CustomError("닉네임 또는 패스워드를 확인해주세요.", 400),
    // CRUD
    FailedUpdate    : new CustomError("데이터 수정에 실패 했습니다."      , 400),
    FailedInsert    : new CustomError("데이터 삽입에 실패 했습니다."      , 400),
    FailedDelete    : new CustomError("데이터 삭제에 실패 했습니다."      , 400),
    // Token
    InvalidToken    : new CustomError("유효하지 않은 토큰 정보 입니다."    , 401)
}