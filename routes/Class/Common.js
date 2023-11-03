class Common{
    isEmpty(obj){
        if(obj == undefined || obj == null || obj == ""){
            return true;
        }
        return false;
    }
}

module.exports = { Common: new Common() };