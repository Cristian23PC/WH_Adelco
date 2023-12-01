import * as bcrypt from 'bcrypt';

export class Hash {
  static make(plainText: string | Buffer) {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(plainText, salt);
  }

  static compare(plainText: string | Buffer, hash: string) {
    return bcrypt.compareSync(plainText, hash);
  }
}
