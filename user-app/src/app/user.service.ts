import { Injectable } from '@angular/core';

export interface User {
	username: string;
	password: string;
}

@Injectable({
	providedIn: 'root',
})
export class UserService {
	private users: User[] = [];
	private currentUser: User | null = null;

	register(user: User): void {
		this.users.push({ ...user });
		this.currentUser = { ...user };
	}

	login(credentials: { username: string; password: string }): boolean {
		const found = this.users.find(
			(u) =>
				u.username === credentials.username &&
				u.password === credentials.password,
		);

		if (found) {
			this.currentUser = { ...found };
			return true;
		}

		return false;
	}

	getCurrentUser(): User | null {
		return this.currentUser ? { ...this.currentUser } : null;
	}

	logout(): void {
		this.currentUser = null;
	}
}
