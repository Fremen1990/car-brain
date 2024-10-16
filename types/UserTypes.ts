export interface SignInFormData {
	email: string
	password: string
}

export interface SignUpFormData extends SignInFormData {
	username: string
}
