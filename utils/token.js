import jwt from 'jsonwebtoken';

export default function generateToken(id){
    const tokenData={
        user:{
            id:id
        }
    }
    const token = jwt.sign(tokenData,process.env.JWT_SECRET,{expiresIn: '1d'})
    return token;
}