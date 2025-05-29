class APIresponse {
    constructor(statuscode , data , message = "Everything is working"){
        this.statuscode = statuscode
        this.data = data
        this.message = message
        this.sucess = true
    }
}

export default APIresponse