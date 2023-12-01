export type EmailPassword = {
  username: string;
  password: string;
};

export interface EmailPasswordCode extends EmailPassword {
  code: string;
}

export type EmailPasswordCart = EmailPassword & {
  cartId?: string;
};
