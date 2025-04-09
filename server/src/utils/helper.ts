export const generateToken = ( length = 6 ) =>{
    // Declare variable
    let otp = ""
    for(let i = 0; i < length; i++){
        const digit = Math.floor(Math.random() * 10);
        otp += digit
    }

    return otp
}