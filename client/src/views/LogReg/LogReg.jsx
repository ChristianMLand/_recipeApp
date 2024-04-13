import { registerUser, loginUser } from "~/services";
import { AuthForm, Tabs, Tab } from "~/components";
import style from './logreg.module.css';

export default function LogReg() {
    // TODO make this prettier
    return (
        <main className={style.container}>
            <Tabs>
                <Tab title="Login">
                    <AuthForm
                        name="Login"
                        service={loginUser}
                        fields={{
                            login_email: "text",
                            login_password: "password"
                        }}
                    />
                </Tab>
                <Tab title="Register">
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
                </Tab>
            </Tabs>
        </main>
    )
}