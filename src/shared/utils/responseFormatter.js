class ResponseFormatter{
    static success(data = null, message = "Success", statusCode = 200){
        return {
            success: true,
            message,
            data,
            statusCode,
            timestamp: new Date().toISOString()
        }
    }
}