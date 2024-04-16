import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { ArticleEntity } from "./article.entity";

@Entity("tags")
export class TagEntity{
  @PrimaryGeneratedColumn()
  @ManyToMany(() => ArticleEntity, (article) => article.tags)
  id : number

  @Column()
  tag : string
}