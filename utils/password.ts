import bcrypt from 'bcrypt';

export async function saltAndHashPassword(password: string) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
} 

export async function validatePassword(input: string, hash: string){
  return bcrypt.compare(input, hash).then(result => result);
}