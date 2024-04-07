import { BeforeInsert, Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from "bcrypt"
import ENV from "../../helpers/ENV";
@Entity("users_list")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id : number
  @Index()
  @Column()
  email : string
  @Column()
  name : string
  @Column()
  lastname : string
  @Column()
  age : number
  @Column()
  password : string

  @BeforeInsert()
  async hashPassword() : Promise<void>{
    this.password = await bcrypt.hash(this.password, ENV.PassSalt)
  }
  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }
}
