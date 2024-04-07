export default {
  get PassSalt() : string{
    return process.env.PASS_HASH_SALT;
  },
  get JwtSecret() : string{
    return process.env.JWT_SECRET;
  }
}