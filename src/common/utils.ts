import * as FileSystem from 'fs';

class Utils {
    static readConfig(name: string, ext: string='.conf'): any {
        let conFile = FileSystem.readFileSync(`./conf/${name}${ext}`, 'utf8');
        if (conFile == null) {
            return null;
        }
        return JSON.parse(conFile);
    }

    static reverseMap(mapData: Map<any, any>) {
        let reverseData = new Map<any, any>();
        mapData.forEach((value, key) => {
            reverseData.set(value, key);
        }, this);
        return reverseData;
    };
}

export default Utils;