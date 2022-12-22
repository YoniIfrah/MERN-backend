class myError{
   code:number;
   message:String;
   constructor(code: number = 0, message: String = 'empty message'){
       this.code = code
       this.message = message
   }
}
export = myError