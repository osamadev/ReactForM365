export class CommonHelperLibLibrary {
  public name(): string {
    return 'CommonHelperLibLibrary';
  }

  public getCurrentTime() : string{
    return 'This is the new version of current time from the common library is '+ new Date().toTimeString() +" ;)";
  }
}
