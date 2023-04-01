export function cycleThroughAllKeys(obj: Object, action: (value?: unknown, key?: string) => void){
    for(const [key, value] of Object.entries(obj)){
        if(typeof value == 'object')
            cycleThroughAllKeys(obj, action)
        else
            action(value, key)
    }
}