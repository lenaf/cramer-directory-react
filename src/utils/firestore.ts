export class FirestoreUtils {
    static setUndefinedValuesToNull(data: any): any {
        if (data === null || data === undefined || typeof data !== 'object') {
            return data;
        }
        
        if (Array.isArray(data)) {
            return data.map(item => FirestoreUtils.setUndefinedValuesToNull(item));
        }
        
        const result = { ...data };
        Object.keys(result).forEach(key => {
            if (result[key] === undefined) {
                result[key] = null;
            } else if (typeof result[key] === 'object' && result[key] !== null) {
                result[key] = FirestoreUtils.setUndefinedValuesToNull(result[key]);
            }
        });
        
        return result;
    }
}