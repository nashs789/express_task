class Common{
    isEmpty(obj){
        if(obj == undefined || obj == null || obj == ""){
            return true;
        }
        return false;
    }

    getResultJson(obj){
        return {
            "success": true,
            "result" : obj
        };
    }
}

module.exports = { Common: new Common() };