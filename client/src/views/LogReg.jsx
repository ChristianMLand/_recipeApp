import { registerUser, loginUser } from "../utils/apiServices.js";
import AuthForm from "../components/AuthForm.jsx";

export default function LogReg() {
    // TODO make this prettier
    return (
        <main id="logreg">
            <AuthForm 
                name="Register"
                service={registerUser}
                fields={{
                    username: "text",
                    email: "text",
                    password: "password",
                    confirm_password: "password"
                }}
            />
            <AuthForm 
                name="Login"
                service={loginUser}
                fields={{
                    login_email: "text",
                    login_password: "password"
                }}
            />
        </main>
    )
}