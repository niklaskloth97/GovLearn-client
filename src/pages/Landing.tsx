import {Button} from "antd";
import LoginModal from "../components/Login/LoginModal.tsx";
import {openLoginModal} from "../state/modalutil.ts";

function Landing() {



    return (
        <div>
            <h1>Landing</h1>
            <Button type="primary" onClick={() => {
                openLoginModal("login")
            }}>Einloggen</Button>
            <Button type="primary" onClick={() => {
                openLoginModal("register")
            }}>Registrieren</Button>
            <LoginModal/>
        </div>
    )
}

export default Landing