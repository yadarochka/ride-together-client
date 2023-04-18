type UserData = {
    name: string;
    surname: string;
    phone: string;
    email: string;
}

export type User = UserData & {
    password: string;
    gender_id: number;
}

export type UserDto = UserData & {
    gender: string;
}