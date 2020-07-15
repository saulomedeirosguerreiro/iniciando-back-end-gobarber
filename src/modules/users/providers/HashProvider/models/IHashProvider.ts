export default interface IHashProvider {
    generateHash(payload:string): Promise<string>;
    compareHash(payload:string, hashed:String): Promise<boolean>;
}