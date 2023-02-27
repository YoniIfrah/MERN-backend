/* eslint-disable prefer-const */

export class StudentId {

    static studenId = ""

    static setStudenId(str:string){
        this.studenId = str
    }
    static getStudenId(){
        return this.studenId
    }
}