import { BeforeInsert, Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from "bcrypt"
import ENV from "../../helpers/ENV";
import { ArticleEntity } from "./article.entity";
@Entity("users_list")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id : number
  @Index()
  @Column({unique : true})
  email : string
  @Column()
  name : string
  @Column()
  lastname : string
  @Column()
  age : number

  @Column()
  password : string

  @OneToMany(() => ArticleEntity,
    (article) => article.author,
    { cascade: true, onDelete: 'SET NULL' })
  userArticles : ArticleEntity[]

  @BeforeInsert()
  async hashPassword() : Promise<void>{
    this.password = await bcrypt.hash(this.password, ENV.PassSalt)
  }
  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }
}
