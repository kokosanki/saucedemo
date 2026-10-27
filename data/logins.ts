import { credentials } from "../config";
import { messages } from "./messages";

const wrongPassword = "wrong_password";

export const invalidLogins = [
  {
    name: "locked out user",
    username: credentials.lockedOutUser,
    password: credentials.password,
    error: messages.lockedOutUser,
  },
  {
    name: "user with wrong password",
    username: credentials.standardUser,
    password: wrongPassword,
    error: messages.wrongCredentials,
  },
  {
    name: "user with empty username",
    username: "",
    password: credentials.password,
    error: messages.usernameRequired,
  },
  {
    name: "user with empty password",
    username: credentials.standardUser,
    password: "",
    error: messages.passwordRequired,
  },
];
