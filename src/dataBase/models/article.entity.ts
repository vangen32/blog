import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TagEntity } from "./tag.entity";
import { UserEntity } from "./user.entity";

@Entity("articles")
export class ArticleEntity{
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  content : string

  @ManyToOne(() => UserEntity, user => user.id)
  author : UserEntity

  @ManyToMany(() => TagEntity)
  @JoinTable()
  tags : TagEntity[]

}