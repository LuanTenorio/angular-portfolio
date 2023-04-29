import jwtDecode from 'jwt-decode'
import { JwtPayloadDto } from '../dto/jwt-payload.dto'

export function decodeJwtUtil(token: string){
    try{
        return jwtDecode<JwtPayloadDto>(token)
    }catch(e){
        return undefined
    }
}