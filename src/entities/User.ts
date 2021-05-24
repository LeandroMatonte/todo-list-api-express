import {
    Entity, Column,
    PrimaryGeneratedColumn, BaseEntity,
    OneToMany
} from 'typeorm';
import { Todo } from './Todo';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Todo, todo => todo.user, {cascade: true})
    todos: Todo[];
}