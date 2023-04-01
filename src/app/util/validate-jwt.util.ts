import jwtDecode from 'jwt-decode'
import { JwtPayloadDto } from '../dto/jwt-payload.dto'

export function decodeJwtUtil(token: string){
    try{
        const payload = jwtDecode<JwtPayloadDto>(token)
        return payload.expiresIn < new Date().getTime() ? undefined : payload
    }catch(e){
        return undefined
    }
}